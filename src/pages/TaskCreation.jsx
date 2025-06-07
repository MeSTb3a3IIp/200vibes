import React, { useState } from 'react';
import "./../css/TaskCreation.css";

function TaskCreation() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', expected: '' }]);
  const [solution, setSolution] = useState('');

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expected: '' }]);
  };
  const handleDeleteTestCase = (index) => {
    const tempTestCases = [...testCases];
    tempTestCases.splice(index, 1);
    setTestCases(tempTestCases);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь отправка данных задачи на сервер или другая логика
    console.log({ title, description, testCases, solution });
  };

  return (
    <div className="task-creation">
      <h2>Создать задачу</h2>
      <div className='input'>
        
        <form onSubmit={handleSubmit}>
          <label>Название задачи:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
          <label>Описание задачи:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required
          ></textarea>
          <h3>Тестовые данные</h3>
          {testCases.map((testCase, index) => (
            <div key={index} className="test-case">
              <input 
                type="text" 
                placeholder="Входные данные" 
                value={testCase.input} 
                onChange={(e) => {
                  const newCases = [...testCases];
                  newCases[index].input = e.target.value;
                  setTestCases(newCases);
                }} 
                required 
              />
              <input 
                type="text" 
                placeholder="Ожидаемый результат" 
                value={testCase.expected} 
                onChange={(e) => {
                  const newCases = [...testCases];
                  newCases[index].expected = e.target.value;
                  setTestCases(newCases);
                }} 
                required 
              />
              <button type="button" className='delete-testCase' onClick={() => handleDeleteTestCase(index)}>x</button>
            </div>
          ))}
          <button type="button" className='add-testCase' onClick={handleAddTestCase}>
            +
          </button>
          <label>Решение:</label>
          <textarea 
            value={solution} 
            onChange={(e) => setSolution(e.target.value)} 
            required
          ></textarea>
          <button className="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default TaskCreation;
