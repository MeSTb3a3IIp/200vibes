package store

import "github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/model"

type UserRepository interface {
	Create(*model.User) error
	Find(int) (*model.User, error)
	FindByEmail(string) (*model.User, error)
}
