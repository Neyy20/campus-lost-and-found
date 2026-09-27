import React, { useState } from 'react';

export default function Login({ onLogin, onSwitchToRegister, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className="form-card">
      <h2 className="form-title">🔑 Student Login</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            className="form-control"
            placeholder="student@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '10px' }}>
          Login
        </button>

        <p style={{ textAlign: 'center', marginTop: '16px', color: '#64748b', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <span
            style={{ color: '#0284c7', cursor: 'pointer', fontWeight: 600 }}
            onClick={onSwitchToRegister}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
}
