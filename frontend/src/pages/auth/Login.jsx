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
    <div className="container flex-center" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="animate-fade-in w-full max-w-md">
        <form onSubmit={onSubmit} className="glass-panel">
          <div className="text-center mb-lg">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
            <p>Access your Active8 dashboard</p>
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
          
          <div className="form-group mb-md">
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          {error && <div className="card text-error max-w-md mx-auto my-md flex-center" style={{ padding: '0.75rem', borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>{error}</div>}
          
          <button type="submit" className="btn btn-primary btn-lg btn-block mt-md">Login to Account</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
