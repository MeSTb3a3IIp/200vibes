// TaskSolutionsTest.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./../css/TaskSolutions.css";

// Функция-симуляция запроса данных с задержкой (например, 300 мс для каждого запроса)
function simulateFetchTask(task) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(task);
    }, 300);
  });
}

function TaskSolutionsTest() {
  // Исходный массив задач, как если бы они были в БД
  const tasksMock = [
    {
      id: 1,
      title: 'Remove Duplicates V',
      difficulty: 'hard',
      description: 'Длинное описание задачи Remove Duplicates V.'
    },
    {
      id: 2,
      title: 'Remove Duplicates IV',
      difficulty: 'hard',
      description: 'Длинное описание задачи Remove Duplicates IV.'
    },
    {
      id: 3,
      title: 'Remove Duplicates III',
      difficulty: 'medium',
      description: 'Длинное описание задачи Remove Duplicates III.'
    },
    {
      id: 4,
      title: 'Remove Duplicates II',
      difficulty: 'medium',
      description: 'Длинное описание задачи Remove Duplicates II.'
    },
    {
      id: 5,
      title: 'Remove Duplicates',
      difficulty: 'easy',
      description: 'Длинное описание задачи Remove Duplicates.'
    }
  ];

  const [tasks, setTasks] = useState([]);
  const [loadingTime, setLoadingTime] = useState(null);

  // Загрузка задач параллельно: создаём массив промисов и ждём их выполнения через Promise.all
  const loadParallel = async () => {
    const start = performance.now();
    const promises = tasksMock.map(task => simulateFetchTask(task));
    const results = await Promise.all(promises);
    const end = performance.now();
    setTasks(results);
    setLoadingTime((end - start).toFixed(2));
  };

  // Загрузка задач последовательно: дожидаемся выполнения каждого запроса поочередно
  const loadSequential = async () => {
    const start = performance.now();
    const results = [];
    for (let task of tasksMock) {
      const res = await simulateFetchTask(task);
      results.push(res);
    }
    const end = performance.now();
    setTasks(results);
    setLoadingTime((end - start).toFixed(2));
  };

  return (
    <div className="main-container">
      {/* Контейнер с кнопками для тестирования */}
        <div className="buttons-container">
            <button className="button" onClick={loadParallel}>
                Параллельный вывод
            </button>
            <button className="button" onClick={loadSequential}>
                Последовательный вывод
            </button>
            {loadingTime && <p className="loading-time">Данные загружены за: {loadingTime} мс</p>}
        </div>

      <div className="tasks-container">
        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task.id} className="task-item">
              {/* Передаём всю задачу через state */}
              <Link to={`/tasks/${task.id}`} state={task}>
                <div className="task-header">
                  <h2 className="task-title">{task.title}</h2>
                  <div className={`task-difficulty ${task.difficulty}`}>
                    {task.difficulty.toUpperCase()}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="tags-container">
        <p>Trending Tags</p>
        <div className="tags">
          <div className="tag">Array</div>
          <div className="tag">String</div>
          <div className="tag">Math</div>
          <div className="tag">Algorythm</div>
        </div>
      </div>
    </div>
  );
}

export default TaskSolutionsTest;
