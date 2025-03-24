package apiserver

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/store/sqlstore"
	"github.com/gorilla/sessions"
)

func Start(config *Config) error {
	db, err := NewDataBase(config.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	store := sqlstore.New(db)
	sessionStore := sessions.NewCookieStore([]byte(config.SessionKey))
	server := NewServer(store, sessionStore)

	return http.ListenAndServe(config.BindAddr, server)
}

func NewDataBase(databaseURL string) (*sql.DB, error) {
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	return db, nil
}
