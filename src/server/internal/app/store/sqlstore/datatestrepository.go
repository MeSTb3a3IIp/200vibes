package sqlstore

import (
	"github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/model"
)

type DataTestRepository struct {
	store *Store
}

func (r *DataTestRepository) FindByTaskID(taskID int) ([]*model.DataTest, error) {
	rows, err := r.store.db.Query("SELECT id_datatest, input_datatest, output_datatest FROM datatest WHERE id_task_datatest = $1", taskID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tests []*model.DataTest
	for rows.Next() {
		var dt model.DataTest
		if err := rows.Scan(&dt.ID, &dt.Input, &dt.Output); err != nil {
			return nil, err
		}
		tests = append(tests, &dt)
	}
	return tests, nil
}
