import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Логика авторизации/регистрации
    navigate('/home');
  };

  return (
    <div className="auth">
      <div className="auth-container">
        <div className="form-toggle">
          <button 
            onClick={() => setIsLogin(true)} 
            className={isLogin ? 'active' : ''}
          >
            Вход
          </button>
          <button 
            onClick={() => setIsLogin(false)} 
            className={!isLogin ? 'active' : ''}
          >
            Регистрация
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" placeholder="Введите ФИО" required />
          )}
          <input type="email" placeholder="Введите e-mail" required />
          <input type="password" placeholder="Введите пароль" required />
          <button type="submit">
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
