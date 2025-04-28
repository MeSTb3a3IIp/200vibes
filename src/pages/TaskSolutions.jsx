import React from 'react';
import { Link } from 'react-router-dom';
import "./../css/TaskSolutions.css"
function TaskSolutions() {
    // Тестовый массив задач с данными
    const tasks = [
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

  return (
    <div className="main-container">
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

export default TaskSolutions;
