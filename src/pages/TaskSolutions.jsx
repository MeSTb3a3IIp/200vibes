import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./../css/TaskSolutions.css";

function TaskSolutions() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/tasks')
      .then(response => response.text()) // получаем тело ответа, как текст
      .then(text => {
        console.log("Text response from /api/tasks:", text); // выводим текст ответа
        try {
          const data = JSON.parse(text); // пробуем распарсить текст как JSON
          setTasks(data);
        } catch (e) {
          console.error("Ошибка при парсинге JSON:", e);
          setError("Ошибка при парсинге JSON");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка fetch:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Загрузка задач...</p>;
  }

  if (error) {
    return <p className="error">Ошибка: {error}</p>;
  }

  return (
    <div className="main-container">
      <div className="tasks-container">
        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task.id} className="task-item">
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
          <div className="tag">Algorithm</div>
        </div>
      </div>
    </div>
  );
}

export default TaskSolutions;
