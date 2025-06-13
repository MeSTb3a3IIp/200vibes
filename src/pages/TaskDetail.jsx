// TaskDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import "./../css/TaskDetail.css";

function TaskDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Данные задачи
  const taskData = location.state || {
    title: 'Неизвестная задача',
    description: 'Описание отсутствует.'
  };

  // Основные состояния
  const [code, setCode]             = useState('');
  const [lineNumbers, setLineNumbers] = useState(['1']);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  // Для таймера и режима
  const [currentMode, setCurrentMode] = useState(null);  // "sequential" или "parallel"
  const [startTime, setStartTime]     = useState(null);
  const [elapsed, setElapsed]         = useState(0);

  // Обновляем номера строк
  const updateLineNumbers = (text) => {
    const count = text.split('\n').length;
    setLineNumbers(Array.from({ length: count }, (_, i) => String(i + 1)));
  };

  const handleCodeChange = (e) => {
    const txt = e.target.value;
    setCode(txt);
    updateLineNumbers(txt);
  };

  // Таймер проверки
  useEffect(() => {
    let timer;
    if (loading && startTime) {
      timer = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [loading, startTime]);

  // Отправка решения
  const handleSubmit = async (mode) => {
    setError(null);
    setTestResult(null);
    setCurrentMode(mode);
    setStartTime(Date.now());
    setElapsed(0);
    setLoading(true);

    try {
      const res = await fetch('/api/check-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: parseInt(id, 10),
          solution: code,
          mode
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка при проверке решения');
      setTestResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Переход к статистике
  const handleViewStatistics = () => {
    navigate(`/tasks/${id}/statistics`, {
      state: { ...taskData, solution: code, result: testResult }
    });
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
              {lineNumbers.map(n => (
                <div key={n} className="line-number">{n}</div>
              ))}
            </div>
            <textarea
              className="code-editor"
              value={code}
              onChange={handleCodeChange}
              placeholder="Напишите ваше решение здесь..."
              wrap="off"
            />
          </div>
        </div>

        <button
          className="submit-button"
          onClick={() => handleSubmit('sequential')}
          disabled={loading}
        >
          Проверка (последовательно)
        </button>
        <button
          className="submit-button"
          onClick={() => handleSubmit('parallel')}
          disabled={loading}
        >
          Проверка (параллельно)
        </button>
      </div>

      {/* Блок статуса/таймера */}
      {(loading || testResult) && (
        <div className="status-block">
          {loading ? (
            <p className="timer-text">
              Идет проверка (
              {currentMode === 'parallel' ? 'параллельно' : 'последовательно'}
              ), время: {(elapsed / 1000).toFixed(2)} сек
            </p>
          ) : (
            <p className="timer-text">
              Режим: {currentMode === 'parallel' ? 'Параллельный' : 'Последовательный'},
              итоговое время: {testResult.duration}
            </p>
          )}
        </div>
      )}

      {error && <p className="error">Ошибка: {error}</p>}

      {/* Контейнер результатов с прокруткой */}
      {testResult && (
        <div className="test-results-container">
          {testResult.success ? (
            <>
              <p>Все тесты пройдены!</p>
              <button className="stats-button" onClick={handleViewStatistics}>
                Посмотреть статистику и комментарии
              </button>
            </>
          ) : (
            <>
              {/* Первый неудачный тест */}
              {(() => {
                const fail = testResult.results.find(r => !r.passed);
                if (!fail) return null;
                return (
                  <div className="failure-block">
                    <p>Первый неудачный тест #{fail.testNumber}</p>
                    <div className="log-block">
                      Input: {fail.input}
                      {'\n'}Expected: {fail.expected}
                      {'\n'}Got: {fail.output}
                      {fail.error && `\nОшибка: ${fail.error}`}
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskDetail;
