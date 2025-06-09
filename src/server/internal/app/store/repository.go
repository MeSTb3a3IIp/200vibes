package store

import "github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/model"

// UserRepository – интерфейс для работы с пользователями.
type UserRepository interface {
	Create(*model.User) error
	Find(int) (*model.User, error)
	FindByEmail(string) (*model.User, error)
}

// TaskRepository – интерфейс для работы с задачами.
type TaskRepository interface {
	FindAll() ([]*model.Task, error)
	FindByID(id int) (*model.Task, error)
}

// DataTestRepository – интерфейс для работы с тестовыми данными.
type DataTestRepository interface {
	FindByTaskID(taskID int) ([]*model.DataTest, error)
}
type SolutionRepository interface {
	UpsertSolution(text string, userID, taskID int, ready bool) error
}
