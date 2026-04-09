import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Admin.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="admin-logo">
          <img src="https://www.winstoneprojects.com/winstonelogo.jpg" alt="Logo" />
          <span>WINSTONE ADMIN</span>
        </div>
        <h1>Welcome Back</h1>
        <p style={{ color: '#a0a0a0', marginBottom: '30px' }}>Secure access to your platform</p>

        <form onSubmit={handleLogin} className="admin-form">
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="admin@winstone.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div style={{ color: '#ff4444', fontSize: '13px' }}>{error}</div>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
