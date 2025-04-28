import React from 'react';
import { NavLink } from 'react-router-dom';
import "./../css/Header.css";
function Header() {
  return (
    <header className="header">
      <div className="nav">
        <NavLink to="/home">200vibes</NavLink>
      </div>
      <div className="nav">
        <NavLink to="/tasks">Cloud Tasks</NavLink>
      </div>
      <div className="nav">
        <NavLink to="/create-task">Create Task</NavLink>
      </div>
      <div className="nav">
      <NavLink
        to="/faq"
        className={({ isActive }) => (isActive ? 'active nav-item' : 'nav-item')}
      >
        FAQ
      </NavLink>
      </div>
      <nav className="nav">
        <NavLink to="/profile">
          <img src="/path/to/profile-icon.svg" alt="Профиль" className="profile-icon" />
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
