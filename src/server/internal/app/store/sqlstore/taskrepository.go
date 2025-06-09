package sqlstore

import (
	"fmt"

	"github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/model"
)

type TaskRepository struct {
	store *Store
}

func (r *TaskRepository) FindAll() ([]*model.Task, error) {
	fmt.Println("Выполняется запрос для получения задач")
	rows, err := r.store.db.Query("SELECT id_task, name_task, content_task, date_task, difficulty_task FROM task")
	if err != nil {
		fmt.Printf("Ошибка запроса: %v\n", err)
		return nil, err
	}
	defer rows.Close()

	var tasks []*model.Task
	for rows.Next() {
		var t model.Task
		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.Date, &t.Difficulty); err != nil {
			fmt.Printf("Ошибка сканирования строки: %v\n", err)
			return nil, err
		}
		tasks = append(tasks, &t)
	}
	fmt.Println("Запрос выполнен успешно")
	return tasks, nil
}

func (r *TaskRepository) FindByID(id int) (*model.Task, error) {
	row := r.store.db.QueryRow("SELECT id_task, name_task, content_task, date_task, difficulty_task FROM task WHERE id_task = $1", id)
	var t model.Task
	if err := row.Scan(&t.ID, &t.Title, &t.Description, &t.Date, &t.Difficulty); err != nil {
		return nil, err
	}
	return &t, nil
}
