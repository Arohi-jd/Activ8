import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const roleLanding = {
  student: '/student/dashboard',
  brand: '/brand/dashboard',
  college_admin: '/college-admin/approvals',
  platform_admin: '/platform-admin/colleges',
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err?.message || err?.response?.data?.message || 'Login failed');
    }
  };

  if (user) {
    navigate(roleLanding[user.role] || '/');
  }

  return (
    <div className="container auth-shell">
      <div className="animate-fade-in auth-layout auth-layout-center">
        <section className="auth-panel card">
          <form onSubmit={onSubmit} className="grid gap-md">
            <div className="auth-heading">
              <h2 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Sign in</h2>
              <p style={{ margin: 0 }}>Use your Active8 credentials to continue.</p>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email Address</label>
              <input 
                className="input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email" 
              />
            </div>
            
            <div className="form-group">
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {error && <div className="card text-error auth-feedback">{error}</div>}

            <button type="submit" className="btn btn-primary btn-lg btn-block">Login to Account</button>

            <div className="text-center">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>New here? </span>
              <button type="button" className="link-button" onClick={() => navigate('/register')}>Create an account</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;
