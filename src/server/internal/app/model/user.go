package model

import (
	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/go-ozzo/ozzo-validation/is"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id                int    `json:"id_user"`
	Fullname          string `json:"fullname_user"`
	Email             string `json:"email_user"`
	Password          string `json:"password_user"`
	EncryptedPassword string `json:"encrypted_password_user"`
	Count_easy_task   int    `json:"count_easy_task_user"`
	Count_medium_task int    `json:"count_medium_task_user"`
	Count_hard_task   int    `json:"count_hard_task_user"`
}

func (u *User) BeforeCreate() error {
	if len(u.Password) > 0 {
		enc, err := encryptString(u.Password)
		if err != nil {
			return err
		}
		u.EncryptedPassword = enc
	}

	return nil
}

func (u *User) Sanitize() {
	u.Password = ""
}

func (u *User) ComparePassword(password string) bool {
	return bcrypt.CompareHashAndPassword([]byte(u.EncryptedPassword), []byte(password)) == nil
}
func encryptString(s string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(s), bcrypt.MinCost)
	if err != nil {
		return "", err
	}
	return string(b), nil
}
func (u *User) Validate() error {
	return validation.ValidateStruct(
		u,
		validation.Field(&u.Email, validation.Required, is.Email),
		validation.Field(&u.Password, validation.By(reqiredIf(u.EncryptedPassword == "")), validation.Length(6, 100)),
	)
}
