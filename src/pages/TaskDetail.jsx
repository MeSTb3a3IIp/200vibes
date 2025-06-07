import React, { useState } from 'react';
import "./../css/TaskDetail.css"
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function TaskDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const taskData = location.state || {
    title: 'Неизвестная задача',
    description: 'Описание отсутствует.'
  };

  const [code, setCode] = useState('');
  const [lineNumbers, setLineNumbers] = useState(['1']);

  // Обновление нумерации строк при изменении содержимого редактора
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

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/tasks/${id}/statistics`, { state: { ...taskData, solution: code, id } });
  };

  return (
    <div className="task-detail">
      <h2>{taskData.title}</h2>
      <div className="desc">
        <p>{taskData.description}</p>
      </div>
      <form onSubmit={handleSubmit} className="code-form">
        {/* Оборачиваем редактор и нумерацию в один скроллируемый блок */}
        <div className="editor-scroll-container">
          <div className="editor-container">
            <div className="line-numbers">
              {lineNumbers.map(number => (
                <div key={number} className="line-number">
                  {number}
                </div>
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
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
}

export default TaskDetail;
