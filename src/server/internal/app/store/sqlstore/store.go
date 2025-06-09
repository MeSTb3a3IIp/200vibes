package sqlstore

import (
	"database/sql"

	"github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/model"
	"github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/store"
)

// Store – реализация общего хранилища.
type Store struct {
	db                 *sql.DB
	userRepository     *UserRepository
	taskRepository     *TaskRepository
	datatestRepository *DataTestRepository
	solutionRepository store.SolutionRepository
}

// New создаёт новое хранилище.
func New(db *sql.DB) store.Store {
	return &Store{db: db}
}

// User возвращает репозиторий пользователей.
func (s *Store) User() store.UserRepository {
	if s.userRepository != nil {
		return s.userRepository
	}

	// Убедитесь, что используемый тип — *model.User
	s.userRepository = &UserRepository{
		store: s,
		users: make(map[int]*model.User),
	}
	return s.userRepository
}

// Task возвращает репозиторий задач.
func (s *Store) Task() store.TaskRepository {
	if s.taskRepository != nil {
		return s.taskRepository
	}

	s.taskRepository = &TaskRepository{
		store: s,
	}
	return s.taskRepository
}

// DataTest возвращает репозиторий тестовых данных.
func (s *Store) DataTest() store.DataTestRepository {
	if s.datatestRepository != nil {
		return s.datatestRepository
	}

	s.datatestRepository = &DataTestRepository{
		store: s,
	}
	return s.datatestRepository
}
func (s *Store) Solution() store.SolutionRepository {
	if s.solutionRepository == nil {
		s.solutionRepository = &SolutionRepository{store: s}
	}
	return s.solutionRepository
}
