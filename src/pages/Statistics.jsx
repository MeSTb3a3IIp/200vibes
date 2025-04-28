import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import "./../css/Statistics.css";

function Statistics() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const taskData = location.state || { title: 'Remove duplicates V', id };

  const [comments, setComments] = useState([
      { user: '@user', text: 'Отличное решение!' },
      { user: '@user', text: 'Можно улучшить алгоритм.' }
    ]);
  const [newComment, setNewComment] = useState('');
  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, { user: '@user', text: newComment.trim() }]);
      setNewComment('');
    }
  };
  return (
    <div className="task-statistics">
        <h2>{taskData.title}</h2>
        <div className="statistics-container">
            <div className="statistics-item">
                <p>Accepted Solutions Runtime Distribution</p>
                <div className="statistics-graphic"></div>
            </div>
            <div className="statistics-item">
                <p>Accepted Solutions Memory Distribution</p>
                <div className="statistics-graphic"></div>
            </div>
            <div className="statistics-item">
                <p>Accepted Solutions Decision Time Distribution</p>
                <div className="statistics-graphic"></div>
            </div>
        </div>
        <div className="comments-container">
            <div className="comments-info">
                <p>Comments: 1</p>
            </div>
            <div className="input-comment-container">
                <textarea className="input-comment"
                      type="text"
                      placeholder="Написать комментарий..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onInput={(e) => {
                        e.target.style.height = "auto"; // Сбрасываем высоту, чтобы scrollHeight обновился
                        e.target.style.height = `${e.target.scrollHeight}px`; // Устанавливаем новую высоту
                      }}
                />
                <div className="buttons-container">
                    <button className="button-item">
                        &#8594;
                    </button>
                    <button className="button-item">
                        &#8594;
                    </button>
                    <button className="button-item">
                        &#8594;
                    </button>
                    <button className="button-item" onClick={handleAddComment}>
                        &#8594;
                    </button>
                </div>
            </div>
            <div className="comments">
                {comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <strong>{comment.user}</strong>
                    <p>{comment.text}</p>
                  </div>
                ))}
            </div>
        </div>
    </div>
  );
}

export default Statistics;
