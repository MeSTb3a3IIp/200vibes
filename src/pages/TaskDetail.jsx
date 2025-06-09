// TaskDetail.jsx
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import "./../css/TaskDetail.css";

function TaskDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Если данные задачи передаются через state
  const taskData = location.state || {
    title: 'Неизвестная задача',
    description: 'Описание отсутствует.'
  };

  const [code, setCode] = useState('');
  const [lineNumbers, setLineNumbers] = useState(['1']);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Функция обновления нумерации строк
  const updateLineNumbers = (text) => {
    const linesCount = text.split('\n').length;
    const numbers = [];
    for (let i = 1; i <= linesCount; i++) {
      numbers.push(i.toString());
    }
    setLineNumbers(numbers);
  };

  const handleCodeChange = (e) => {
    const newText = e.target.value;
    setCode(newText);
    updateLineNumbers(newText);
  };

  // Функция отправки решения на сервер с указанием режима проверки
  const handleSubmit = async (mode) => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/check-solution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: parseInt(id, 10),
          solution: code,
          mode: mode // передаём режим: "sequential" или "parallel"
        })
      });
      const data = await response.json();
      console.log("Ответ сервера:", data);
      if (!response.ok) {
        throw new Error("Ошибка при проверке решения");
      }
      setTestResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик перехода к странице статистики и комментариев, если тесты прошли
  const handleViewStatistics = () => {
    navigate(`/tasks/${id}/statistics`, { state: { ...taskData, solution: code, result: testResult } });
  };

  return (
    <div className="task-detail">
      <h2>{taskData.title}</h2>
      <div className="desc">
        <p>{taskData.description}</p>
      </div>
      <div className="code-form">
        <div className="editor-scroll-container">
          <div className="editor-container">
            <div className="line-numbers">
              {lineNumbers.map(number => (
                <div key={number} className="line-number">{number}</div>
              ))}
            </div>
            <textarea
              className="code-editor"
              value={code}
              onChange={handleCodeChange}
              placeholder="Напишите ваше решение здесь..."
              wrap="off"
            ></textarea>
          </div>
        </div>
        {/* Две кнопки: последовательная и параллельная проверка */}
        <button 
          className="submit-button" 
          onClick={() => handleSubmit("sequential")}
          disabled={loading}
        >
          Проверка (Последовательно)
        </button>
        <button 
          className="submit-button" 
          onClick={() => handleSubmit("parallel")}
          disabled={loading}
        >
          Проверка (Параллельно)
        </button>
      </div>

      {loading && <p>Проверка решения…</p>}
      {error && <p className="error">Ошибка: {error}</p>}
      
      {testResult && (
        <div className="test-results">
          {testResult.success ? (
            <div>
              <p>Все тесты пройдены!</p>
              <p>Время проверки: {testResult.duration}</p>
              <button className="stats-button" onClick={handleViewStatistics}>
                Посмотреть статистику и комментарии
              </button>
            </div>
          ) : (
            <div>
              <p>
                Пройдено {testResult.passedTests} из {testResult.totalTests} тестов.
              </p>
              <ul>
                {testResult.results &&
                  testResult.results
                    .filter(r => !r.passed)
                    .map(r => (
                      <li key={r.testNumber}>
                        Тест {r.testNumber} — Input: {r.input}, Expected: {r.expected}, Got: {r.output}
                        {r.error && ` (Error: ${r.error})`}
                      </li>
                    ))
                }
              </ul>
              <p>Время проверки: {testResult.duration}</p>
              <p>Проверьте код и попробуйте снова.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskDetail;
