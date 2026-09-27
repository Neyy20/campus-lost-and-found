import React from 'react';

export default function Navbar({ currentView, setCurrentView, user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => setCurrentView('home')}>
        <span>🎓</span>
        <span>Campus Lost & Found</span>
      </div>
      <div className="navbar-links">
        <button
          className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentView('home')}
        >
          Home
        </button>
        <button
          className={`nav-btn ${currentView === 'create' ? 'active' : ''}`}
          onClick={() => setCurrentView('create')}
        >
          + Post Item
        </button>

        {user ? (
          <>
            <button
              className={`nav-btn ${currentView === 'myposts' ? 'active' : ''}`}
              onClick={() => setCurrentView('myposts')}
            >
              My Posts
            </button>
            <span className="user-badge">👤 {user.name}</span>
            <button className="nav-btn logout" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className={`nav-btn ${currentView === 'login' ? 'active' : ''}`}
              onClick={() => setCurrentView('login')}
            >
              Login
            </button>
            <button
              className={`nav-btn primary ${currentView === 'register' ? 'active' : ''}`}
              onClick={() => setCurrentView('register')}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
