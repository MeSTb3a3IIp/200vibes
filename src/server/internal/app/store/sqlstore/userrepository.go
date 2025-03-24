package sqlstore

import (
	"database/sql"

	store "github.com/MeSTb3a3IIp/200vibes/src/server/internal/app"
	"github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/model"
)

type UserRepository struct {
	store *Store
	users map[int]*model.User
}

func (userRepository UserRepository) Create(user *model.User) error {
	if err := user.Validate(); err != nil {
		return err
	}
	if err := user.BeforeCreate(); err != nil {
		return err
	}
	//
	return userRepository.store.db.QueryRow(
		"INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
		user.Fullname,
		user.Email,
		user.EncryptedPassword,
		user.Count_easy_task,
		user.Count_medium_task,
		user.Count_hard_task,
	).Scan(user.Id)
}

func (r *UserRepository) Find(id_user int) (*model.User, error) {
	user := &model.User{}
	if err := r.store.db.QueryRow(
		"SELECT id_user, fullname_user, email_user, encrypted_password_user, count_easy_task_user, count_medium_task_user, count_hard_task_user FROM users WHERE id_user = $1",
		id_user,
	).Scan(
		&user.Id,
		&user.Fullname,
		&user.Email,
		&user.EncryptedPassword,
		&user.Count_easy_task,
		&user.Count_medium_task,
		&user.Count_hard_task,
	); err != nil {
		if err == sql.ErrNoRows {
			return nil, store.ErrRecordNotFound
		}
		return nil, err
	}
	return user, nil
}
func (r *UserRepository) FindByEmail(email_user string) (*model.User, error) {
	user := &model.User{}
	if err := r.store.db.QueryRow(
		"SELECT id_user, fullname_user, email_user, encrypted_password_user, count_easy_task_user, count_medium_task_user, count_hard_task_user FROM users WHERE email_user = $1",
		email_user,
	).Scan(
		&user.Id,
		&user.Fullname,
		&user.Email,
		&user.EncryptedPassword,
		&user.Count_easy_task,
		&user.Count_medium_task,
		&user.Count_hard_task,
	); err != nil {
		if err == sql.ErrNoRows {
			return nil, store.ErrRecordNotFound
		}
		return nil, err
	}
	return user, nil
}
