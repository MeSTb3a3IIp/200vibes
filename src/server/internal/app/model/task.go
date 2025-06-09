package model

type Task struct {
	ID          int    `json:"id"`          // id_task
	Title       string `json:"title"`       // name_task
	Description string `json:"description"` // content_task
	Date        string `json:"date"`        // date_task (для простоты используем string)
	Difficulty  string `json:"difficulty"`  // difficulty_task
}
