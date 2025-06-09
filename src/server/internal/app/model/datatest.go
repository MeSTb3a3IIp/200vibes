package model

// DataTest описывает запись из таблицы datatest.
type DataTest struct {
	ID     int    `json:"id"`     // id_datatest
	Input  string `json:"input"`  // input_datatest
	Output string `json:"output"` // output_datatest
}
