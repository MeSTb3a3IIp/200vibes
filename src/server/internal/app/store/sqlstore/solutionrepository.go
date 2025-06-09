package sqlstore

import (
	"database/sql"
)

// SolutionRepository отвечает за операции с таблицей solution.
type SolutionRepository struct {
	store *Store
}

// UpsertSolution вставляет новое решение, или обновляет существующее, если решение уже есть для заданного пользователя и задачи.
func (r *SolutionRepository) UpsertSolution(text string, userID, taskID int, ready bool) error {
	// Попробуем обновить решение, если оно уже существует.
	res := r.store.db.QueryRow(
		`UPDATE solution 
         SET text_solution = $1, if_ready_solution = $2, start_time_solution = NOW(), end_time_solution = NOW() 
         WHERE id_user_solution = $3 AND id_task_solution = $4
         RETURNING id_solution;`,
		text, ready, userID, taskID)
	var id int
	err := res.Scan(&id)
	// Если обновление не затронуло ни одной строки (решения нет), вставляем новое.
	if err == sql.ErrNoRows {
		_, err = r.store.db.Exec(
			`INSERT INTO solution (text_solution, if_ready_solution, start_time_solution, end_time_solution, id_user_solution, id_task_solution)
             VALUES ($1, $2, NOW(), NOW(), $3, $4);`,
			text, ready, userID, taskID)
	}
	return err
}
