import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, userInfo, error: authError } = useAuth();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Redirect if already logged in
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';
  
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);

    try {
      if (isLoginTab) {
        await login(email, password);
      } else {
        if (!name) {
          throw new Error('Name is required');
        }
        await register(name, email, password);
      }
      navigate(redirect);
    } catch (err) {
      setLocalError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '75vh',
      padding: '40px 0'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '35px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)'
      }}>
        
        {/* Tab Headers */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          marginBottom: '30px',
          gap: '20px'
        }}>
          <button
            onClick={() => {
              setIsLoginTab(true);
              setLocalError(null);
            }}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              borderBottom: isLoginTab ? '2px solid var(--accent)' : '2px solid transparent',
              color: isLoginTab ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '1.05rem',
              paddingBottom: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'var(--transition)'
            }}
          >
            <LogIn size={18} /> Sign In
          </button>
          <button
            onClick={() => {
              setIsLoginTab(false);
              setLocalError(null);
            }}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              borderBottom: !isLoginTab ? '2px solid var(--accent)' : '2px solid transparent',
              color: !isLoginTab ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '1.05rem',
              paddingBottom: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'var(--transition)'
            }}
          >
            <UserPlus size={18} /> Register
          </button>
        </div>

        {/* Errors */}
        {(localError || authError) && (
          <div className="glass-panel badge-danger" style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            fontSize: '0.85rem',
            fontWeight: 500,
            border: '1px solid var(--danger)'
          }}>
            {localError || authError}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Name Field (Register only) */}
          {!isLoginTab && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                />
                <User size={18} style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
              />
              <Mail size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
              />
              <Lock size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '10px' }}
          >
            {loading ? 'Processing...' : isLoginTab ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Demo Credentials Alert */}
        {isLoginTab && (
          <div className="glass-panel" style={{
            marginTop: '24px',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            border: '1px solid var(--border)',
            lineHeight: '1.5'
          }}>
            <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '6px' }}>🔑 Demonstration Credentials:</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><strong>Admin:</strong> <code>admin@shopsphere.com</code> / <code>adminpassword123</code></div>
              <div><strong>Buyer:</strong> <code>john@gmail.com</code> / <code>password123</code></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;
