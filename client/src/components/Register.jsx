import React, { useState } from 'react';

export default function Register({ onRegister, onSwitchToLogin, error }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ name, email, password });
  };

  return (
    <div className="form-card">
      <h2 className="form-title">🎓 Student Registration</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
            placeholder="Choose a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '10px' }}>
          Create Account
        </button>

        <p style={{ textAlign: 'center', marginTop: '16px', color: '#64748b', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <span
            style={{ color: '#0284c7', cursor: 'pointer', fontWeight: 600 }}
            onClick={onSwitchToLogin}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}
