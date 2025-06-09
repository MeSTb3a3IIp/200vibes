package apiserver

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"sync"

	"github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/model"
)

// TestResult описывает результат проверки одного теста.
type TestResult struct {
	TestNumber int    `json:"testNumber"`
	Input      string `json:"input"`
	Expected   string `json:"expected"`
	Output     string `json:"output"`
	Passed     bool   `json:"passed"`
	Error      string `json:"error,omitempty"`
}

// saveCodeToFile сохраняет код пользователя во временный файл.
func saveCodeToFile(code string) (string, error) {
	tmpFile, err := ioutil.TempFile("", "solution-*.go")
	if err != nil {
		return "", err
	}
	if _, err := tmpFile.Write([]byte(code)); err != nil {
		tmpFile.Close()
		return "", err
	}
	tmpFile.Close()
	return tmpFile.Name(), nil
}

// runUserCode запускает сохранённый код через "go run", подставляя тестовые входные данные.
func runUserCode(fileName string, input string) (string, error) {
	cmd := exec.Command("go", "run", fileName)
	cmd.Stdin = bytes.NewBufferString(input)
	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr
	err := cmd.Run()
	if err != nil {
		return "", fmt.Errorf("%v: %s", err, stderr.String())
	}
	return out.String(), nil
}

// runUserSolution запускает код пользователя для всех тестовых случаев параллельно.
func runUserSolution(solutionCode string, tests []*model.DataTest) ([]TestResult, error) {
	results := make([]TestResult, len(tests))

	fileName, err := saveCodeToFile(solutionCode)
	if err != nil {
		return nil, err
	}
	defer os.Remove(fileName)

	var wg sync.WaitGroup
	wg.Add(len(tests))

	for i, test := range tests {
		go func(i int, test *model.DataTest) {
			defer wg.Done()
			output, err := runUserCode(fileName, test.Input)
			res := TestResult{
				TestNumber: i + 1,
				Input:      test.Input,
				Expected:   test.Output,
				Output:     output,
				Passed:     false,
			}
			if err != nil {
				res.Error = err.Error()
			} else if output == test.Output {
				res.Passed = true
			} else {
				res.Error = "Output does not match expected result"
			}
			results[i] = res
		}(i, test)
	}
	wg.Wait()
	return results, nil
}
