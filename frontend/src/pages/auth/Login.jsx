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
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  if (user) {
    navigate(roleLanding[user.role] || '/');
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420, margin: '2rem auto', display: 'grid', gap: '0.75rem' }}>
      <h2>Login</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
