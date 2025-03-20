import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard'); // Перенаправление на страницу Dashboard (четвёртая страница)
  };

  return (
    <div>
      <h2>Авторизация</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Введите e-mail или никнейм" required />
        <input type="password" placeholder="Введите пароль" required />
        <button type="submit">Войти</button>
      </form>
      <p>Нет аккаунта? <a href="/register">Зарегистрируйтесь</a></p>
    </div>
  );
}

export default Login;
