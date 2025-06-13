// server.go
package apiserver

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/model"
	"github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/store"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/sirupsen/logrus"
)

// контекстные ключи
type ctxKey int8

const (
	sessionName        = "MeSTb3a3IIp"
	ctxKeyUser  ctxKey = iota
	ctxKeyRequestID
)

var (
	errIncorrectEmailOrPassword = errors.New("incorrect email or password")
	errNotAuthenticated         = errors.New("not authenticated")
)

// Server описывает HTTP-сервер
type Server struct {
	logger       *logrus.Logger
	router       *mux.Router
	store        store.Store
	sessionStore sessions.Store
}

// NewServer создаёт новый экземпляр Server
func NewServer(st store.Store, ss sessions.Store) *Server {
	server := &Server{
		logger:       logrus.New(),
		router:       mux.NewRouter(),
		store:        st,
		sessionStore: ss,
	}
	server.ConfigureRouter()
	return server
}

// ConfigureRouter настраивает маршруты
func (server *Server) ConfigureRouter() {
	server.router.HandleFunc("/users", server.handleUsersCreate()).Methods("POST")
	server.router.HandleFunc("/sessions", server.handleSessionsCreate()).Methods("POST")
	server.router.HandleFunc("/api/check-solution", server.handleCheckSolution()).Methods("POST")
	server.router.HandleFunc("/api/tasks", server.handleTasks()).Methods("GET")
	// private-маршруты можно подключить здесь через server.authenticateUser
}

// ServeHTTP реализует http.Handler
func (server *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	server.router.ServeHTTP(w, r)
}

// helper: отправка ошибки в формате JSON
func (server *Server) error(w http.ResponseWriter, r *http.Request, status int, err error) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{
		"error": err.Error(),
	})
}

// helper: отправка успешного ответа
func (server *Server) respond(w http.ResponseWriter, r *http.Request, code int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	if data != nil {
		json.NewEncoder(w).Encode(data)
	}
}

// Создание пользователя
func (server *Server) handleUsersCreate() http.HandlerFunc {
	type request struct {
		Fullname string `json:"fullname"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		req := &request{}
		if err := json.NewDecoder(r.Body).Decode(req); err != nil {
			server.error(w, r, http.StatusBadRequest, err)
			return
		}
		user := &model.User{
			Fullname: req.Fullname,
			Email:    req.Email,
			Password: req.Password,
		}
		if err := server.store.User().Create(user); err != nil {
			server.error(w, r, http.StatusUnprocessableEntity, err)
			return
		}
		user.Sanitize()
		server.respond(w, r, http.StatusCreated, user)
	}
}

// Создание сессии (логин)
func (server *Server) handleSessionsCreate() http.HandlerFunc {
	type request struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		req := &request{}
		if err := json.NewDecoder(r.Body).Decode(req); err != nil {
			server.error(w, r, http.StatusBadRequest, err)
			return
		}
		user, err := server.store.User().FindByEmail(req.Email)
		if err != nil || !user.ComparePassword(req.Password) {
			server.error(w, r, http.StatusUnauthorized, errIncorrectEmailOrPassword)
			return
		}
		session, err := server.sessionStore.Get(r, sessionName)
		if err != nil {
			server.error(w, r, http.StatusInternalServerError, err)
			return
		}
		session.Values["user_id"] = user.Id
		if err := server.sessionStore.Save(r, w, session); err != nil {
			server.error(w, r, http.StatusInternalServerError, err)
			return
		}
		server.respond(w, r, http.StatusOK, nil)
	}
}

// Пример middleware для WhoAmI
func (server *Server) handleWhoami() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := r.Context().Value(ctxKeyUser).(*model.User)
		server.respond(w, r, http.StatusOK, user)
	}
}

// Middleware: присвоить request ID
func (server *Server) setRequestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := uuid.New().String()
		w.Header().Set("X-Request-ID", id)
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), ctxKeyRequestID, id)))
	})
}

// Middleware: логирование запросов
func (server *Server) logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger := server.logger.WithFields(logrus.Fields{
			"remote_addr": r.RemoteAddr,
			"request_id":  r.Context().Value(ctxKeyRequestID),
		})
		logger.Infof("started %s %s", r.Method, r.RequestURI)
		start := time.Now()
		rw := &responseWriter{w, http.StatusOK}
		next.ServeHTTP(rw, r)
		logger.Infof(
			"completed with %d %s in %v",
			rw.code,
			http.StatusText(rw.code),
			time.Since(start),
		)
	})
}

// Middleware: аутентификация
func (server *Server) authenticateUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, err := server.sessionStore.Get(r, sessionName)
		if err != nil {
			server.error(w, r, http.StatusInternalServerError, err)
			return
		}
		id, ok := session.Values["user_id"]
		if !ok {
			server.error(w, r, http.StatusUnauthorized, errNotAuthenticated)
			return
		}
		user, err := server.store.User().Find(id.(int))
		if err != nil {
			server.error(w, r, http.StatusUnauthorized, errNotAuthenticated)
			return
		}
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), ctxKeyUser, user)))
	})
}

// Проверка решения — теперь останавливаемся на первом неуспешном тесте
func (server *Server) handleCheckSolution() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 1) Парсим тело запроса
		var req struct {
			TaskID   int    `json:"taskId"`
			Solution string `json:"solution"`
			Mode     string `json:"mode"` // "sequential" или "parallel"
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			server.error(w, r, http.StatusBadRequest, err)
			return
		}
		if strings.TrimSpace(req.Solution) == "" {
			server.error(w, r, http.StatusBadRequest, errors.New("пустое решение недопустимо"))
			return
		}

		// 2) Загружаем тесты
		tests, err := server.store.DataTest().FindByTaskID(req.TaskID)
		if err != nil {
			server.error(w, r, http.StatusInternalServerError, err)
			return
		}
		if len(tests) == 0 {
			server.error(w, r, http.StatusNotFound, errors.New("тестовые данные не найдены"))
			return
		}

		// 3) Засекаем время
		start := time.Now()

		// 4) Компиляция + запуск всех тестов
		results, err := EvaluateSolution(req.Solution, tests, req.Mode == "parallel")
		if err != nil {
			server.error(w, r, http.StatusInternalServerError, err)
			return
		}

		// 5) Срезаем результаты после первого неудачного теста
		for i, res := range results {
			if !res.Passed {
				results = results[:i+1]
				break
			}
		}

		// 6) Считаем пройденные тесты
		passed := 0
		for _, res := range results {
			if res.Passed {
				passed++
			}
		}

		// 7) Формируем ответ
		resp := struct {
			Success     bool         `json:"success"`
			TotalTests  int          `json:"totalTests"`
			PassedTests int          `json:"passedTests"`
			Results     []TestResult `json:"results"`
			Duration    string       `json:"duration"`
		}{
			Success:     passed == len(results),
			TotalTests:  len(results),
			PassedTests: passed,
			Results:     results,
			Duration:    time.Since(start).String(),
		}

		server.respond(w, r, http.StatusOK, resp)
	}
}

// Получение списка задач
func (server *Server) handleTasks() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Обработка запроса: /api/tasks")
		tasks, err := server.store.Task().FindAll()
		if err != nil {
			fmt.Printf("Ошибка получения задач: %v\n", err)
			server.error(w, r, http.StatusInternalServerError, err)
			return
		}
		server.respond(w, r, http.StatusOK, tasks)
	}
}
