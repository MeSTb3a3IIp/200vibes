package sqlstore

import (
	"database/sql"

	"github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/model"
	"github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/store"
	_ "github.com/lib/pq"
)

type Store struct {
	db             *sql.DB
	userRepository *UserRepository
}

func New(db *sql.DB) *Store {
	return &Store{
		db: db,
	}
}

func (s *Store) User() store.UserRepository {
	if s.userRepository != nil {
		return s.userRepository
	}

	s.userRepository = &UserRepository{
		store: s,
		users: make(map[int]*model.User),
	}
	return s.userRepository
}
