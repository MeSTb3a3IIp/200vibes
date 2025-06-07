import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./../css/Auth.css"
function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Логика авторизации/регистрации
    navigate('/home');
  };
  const angles = [0, 40, 80, 120, 160, 200, 240, 280, 320];

  return (
    <div className="auth">
      <div className="letter-container">
        <span className="letter">C</span>
        <span className="letter">l</span>
        <span className="letter">o</span>
        <span className="letter">u</span>
        <span className="letter">d</span>
        <span className="letter"> </span>
        <span className="letter">G</span>
        <span className="letter">O</span>
      </div>
      <div className="logo-container" style={{"--logo-container-background":"#eee", "--logo-container-delay":"0.5s" }}></div>
      
      <div className="logo-container" ></div>

      <div className="shadow-left-info" style={{"--background":"#eee","--delay":"0.1s"}}>
      </div>
      <div className="shadow-right-info" style={{"--background":"#eee","--delay":"0.1s"}}>
      </div>
      <div className="left-info">
          Платформа для решения и создания задач по программированию на языке Go
      </div>
      <div className="right-info">
          Улучшайте навыки, расширяйте знания, готовьтесь к техническим собеседованиям, создавайте задачи на нашей платформе
      </div>
      
      <div className="point reverse">
        {angles.map((deg) => (
          <div className="circle" key={deg} style={{"--circle-width": "34vw", "--circle-height": "24vh", "--circle-border": "50%", "--circle-rotate": `rotate(${deg}deg)`, "--circle-background":"#eee"}}></div>
        ))}
      </div>
      <div className="point">
        {angles.map((deg) => (
          <div className="circle" key={deg} style={{"--circle-width": "30vw", "--circle-height": "20vh", "--circle-border": "50%", "--circle-rotate": `rotate(${deg}deg)`}}></div>
        ))}
      </div>
      
      <div className="auth-container">
        <div className="title">
          {isLogin ? 'Login' : 'Registration'}
        </div>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" placeholder="Введите ФИО" required />
          )}
          <input type="email" placeholder="Введите e-mail" required />
          <input type="password" placeholder="Введите пароль" required />
          <button type="submit">
            Lets GO
          </button>
          
        </form>
        <div className="form-toggle">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="sign"
          >
             {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
