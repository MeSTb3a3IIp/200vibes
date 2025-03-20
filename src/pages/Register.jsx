import React from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/dashboard'); // Перенаправление на страницу Dashboard (четвёртая страница)
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Введите ФИО" required />
        <input type="email" placeholder="Введите e-mail" required />
        <input type="text" placeholder="Введите никнейм" required />
        <input type="password" placeholder="Введите пароль" required />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>Уже есть аккаунт? <a href="/login">Войдите</a></p>
    </div>
  );
}

export default Register;
