import React from 'react';
import { NavLink } from 'react-router-dom';
import "./../css/Home.css"
function Home() {
  // Пример данных новостей (эти данные могут загружаться с сервера)
  const newsData = [
    {
      id: 1,
      difficulty: 'hard',
      title: 'Remove Duplicates V',
      published: 'posted the task 20 minutes ago, by @user',
      description: 'Text task text task text task text task text task text task text task text task...'
    },
    {
      id: 2,
      difficulty: 'hard',
      title: 'Remove Duplicates IV',
      published: 'posted the task 40 minutes ago, by @user',
      description: 'Text task text task text task text task text task text task text task text task...'
    },
    {
      id: 3,
      difficulty: 'medium',
      title: 'Remove Duplicates III',
      published: 'posted the task an hour ago, by @user',
      description: 'Text task text task text task text task text task text task text task text task...'
    },
    {
      id: 4,
      difficulty: 'medium',
      title: 'Remove Duplicates II',
      published: 'posted the task 2 hours ago, by @user',
      description: 'Text task text task text task text task text task text task text task text task...'
    },
    {
      id: 5,
      difficulty: 'easy',
      title: 'Remove Duplicates',
      published: 'posted the task 2 days ago, by @user',
      description: 'Text task text task text task text task text task text task text task text task...'
    },
    {
      id: 1,
      difficulty: 'hard',
      title: 'Remove Duplicates V',
      published: 'posted the task 20 minutes ago, by @user',
      description: 'Text task text task text task text task text task text task text task text task...'
    },
    {
      id: 2,
      difficulty: 'hard',
      title: 'Remove Duplicates IV',
      published: 'posted the task 40 minutes ago, by @user',
      description: 'Text task text task text task text task text task text task text task text task...'
    },
    {
      id: 3,
      difficulty: 'medium',
      title: 'Remove Duplicates III',
      published: 'posted the task an hour ago, by @user',
      description: 'Text task text text task text task text task text task text task text task text k text task text task text task text task text task text task...'
    },
    {
      id: 4,
      difficulty: 'medium',
      title: 'Remove Duplicates II',
      published: 'posted the task 2 hours ago, by @user',
      description: 'Text task text task text task text task text task text task text task text task...'
    },
    {
      id: 5,
      difficulty: 'easy',
      title: 'Remove Duplicates',
      published: 'posted the task 2 days ago, by @user',
      description: 'Text task text task text task tex...'
    }
  ];

  return (
    <div className="main">
      <div className="news-list">
        {newsData.map(news => (
          <div key={news.id} className="news-item">
            <div className="news-header">
              <h2 className="news-title">{news.title}</h2>
              <div className={`news-difficulty ${news.difficulty}`}>
                {news.difficulty.toUpperCase()}
              </div>
            </div>
            <div className="news-meta">{news.published}</div>
            <div className="news-description">{news.description}</div>
          </div>
        ))}
      </div>
      <div className="help-list">
          <div className="help-item">
              <div className="help-title">
                  CloudCoin
              </div>
              <div className="help-description">
                  Support our site and receive CloudCoins, 
                  the most active users will be 
                  included in a big thank you list 
              </div>
              <NavLink className="nav" to="/tasks">
                  <button className="help-button">
                      Lets Go
                  </button>
              </NavLink>
          </div>
      </div>
    </div>
  );
}

export default Home;
