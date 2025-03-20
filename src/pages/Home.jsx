import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Добро пожаловать на 200Vibes!</h1>
      <p>Этот сайт создан для решения задач и создания нового опыта в программировании.  
         Узнайте больше, попробуйте себя в решении задач и развивайте свои навыки вместе с нами.</p>
      <div>
        <button onClick={() => navigate('/login')}>Sign In</button>
        <button onClick={() => navigate('/register')}>Sign Up</button>
      </div>
    </div>
  );
}

export default Home;
