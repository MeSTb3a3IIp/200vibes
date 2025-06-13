package apiserver

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"runtime"
	"sync"

	"github.com/MeSTb3a3IIp/200vibes/src/server/internal/app/model"
)

// TestResult описывает результат одного теста.
type TestResult struct {
	TestNumber int    `json:"testNumber"`
	Input      string `json:"input"`
	Expected   string `json:"expected"`
	Output     string `json:"output"`
	Passed     bool   `json:"passed"`
	Error      string `json:"error,omitempty"`
}

// buildSolution сохраняет код во временный файл и компилирует бинарник.
func buildSolution(code string) (runnerPath string, cleanup func(), err error) {
	// 1) Сохраняем исходник
	src, err := ioutil.TempFile("", "solution-*.go")
	if err != nil {
		return "", nil, err
	}
	srcName := src.Name()
	if _, err := src.WriteString(code); err != nil {
		src.Close()
		return "", nil, err
	}
	src.Close()

	// 2) Компилируем
	runnerPath = srcName + ".bin"
	cmd := exec.Command("go", "build", "-o", runnerPath, srcName)
	if out, err := cmd.CombinedOutput(); err != nil {
		return "", nil, fmt.Errorf("build failed: %v\n%s", err, out)
	}

	// 3) Функция очистки
	cleanup = func() {
		os.Remove(srcName)
		os.Remove(runnerPath)
	}
	return runnerPath, cleanup, nil
}

// runBinary запускает готовый бинарник с подставленным stdin.
func runBinary(runnerPath, input string) (string, error) {
	cmd := exec.Command(runnerPath)
	cmd.Stdin = bytes.NewBufferString(input)

	out, err := cmd.CombinedOutput()
	return string(out), err
}

// runSequential выполняет тесты один за другим.
func runSequential(runnerPath string, tests []*model.DataTest) ([]TestResult, error) {
	results := make([]TestResult, len(tests))
	for i, test := range tests {
		out, err := runBinary(runnerPath, test.Input)
		tr := TestResult{
			TestNumber: i + 1,
			Input:      test.Input,
			Expected:   test.Output,
			Output:     out,
			Passed:     err == nil && out == test.Output,
		}
		if err != nil {
			tr.Error = err.Error()
		} else if out != test.Output {
			tr.Error = "output does not match expected"
		}
		results[i] = tr
	}
	return results, nil
}

// runParallel выполняет все тесты параллельно, но не более NumCPU() процессов.
func runParallel(runnerPath string, tests []*model.DataTest) ([]TestResult, error) {
	var wg sync.WaitGroup
	results := make([]TestResult, len(tests))
	sem := make(chan struct{}, runtime.NumCPU())

	for i, test := range tests {
		wg.Add(1)
		go func(i int, test *model.DataTest) {
			defer wg.Done()
			sem <- struct{}{}        // занять слот
			defer func() { <-sem }() // освободить слот

			out, err := runBinary(runnerPath, test.Input)
			tr := TestResult{
				TestNumber: i + 1,
				Input:      test.Input,
				Expected:   test.Output,
				Output:     out,
				Passed:     err == nil && out == test.Output,
			}
			if err != nil {
				tr.Error = err.Error()
			} else if out != test.Output {
				tr.Error = "output does not match expected"
			}
			results[i] = tr
		}(i, test)
	}

	wg.Wait()
	return results, nil
}

// EvaluateSolution компилирует код один раз и запускает нужный режим.
func EvaluateSolution(code string, tests []*model.DataTest, parallel bool) ([]TestResult, error) {
	runnerBin, cleanup, err := buildSolution(code)
	if err != nil {
		return nil, err
	}
	defer cleanup()

	if parallel {
		return runParallel(runnerBin, tests)
	}
	return runSequential(runnerBin, tests)
}
