import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    collegeName: '',
    collegeDomain: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.role === 'student' && !form.collegeDomain.trim()) {
      setError('College domain is required for student registration');
      return;
    }

    if (form.role === 'college_admin' && (!form.collegeName.trim() || !form.collegeDomain.trim())) {
      setError('College name and domain are required for college admin registration');
      return;
    }

    try {
      const payload = { ...form };
      if (payload.role !== 'student' && payload.role !== 'college_admin') {
        delete payload.collegeDomain;
        delete payload.collegeName;
      }
      await api.post('/auth/register', payload);
      setSuccess('Registration successful. You can now login when account is active.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container flex-center" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="animate-fade-in w-full max-w-md">
        <form onSubmit={onSubmit} className="glass-panel">
          <div className="text-center mb-md">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Create Account</h2>
            <p>Join Active8 today</p>
          </div>
          
          <div className="form-group">
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Full Name</label>
            <input className="input" name="name" value={form.name} onChange={onChange} placeholder="Enter your name" />
          </div>
          
          <div className="form-group">
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email Address</label>
            <input className="input" name="email" value={form.email} onChange={onChange} placeholder="Enter your email" />
          </div>
          
          <div className="form-group">
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Password</label>
            <input className="input" name="password" type="password" value={form.password} onChange={onChange} placeholder="Create a password" />
          </div>
          
          <div className="form-group mb-md">
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Account Type</label>
            <select className="input" name="role" value={form.role} onChange={onChange} style={{ cursor: 'pointer' }}>
              <option value="student">Student</option>
              <option value="brand">Brand</option>
              <option value="college_admin">College Admin</option>
              <option value="platform_admin">Platform Admin</option>
            </select>
          </div>

          {form.role === 'student' && (
            <div className="form-group mb-md">
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>College Domain</label>
              <input
                className="input"
                name="collegeDomain"
                value={form.collegeDomain}
                onChange={onChange}
                placeholder="e.g. mit.edu"
              />
            </div>
          )}

          {form.role === 'college_admin' && (
            <>
              <div className="form-group">
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>College Name</label>
                <input
                  className="input"
                  name="collegeName"
                  value={form.collegeName}
                  onChange={onChange}
                  placeholder="Enter college name"
                />
              </div>
              <div className="form-group mb-md">
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>College Domain</label>
                <input
                  className="input"
                  name="collegeDomain"
                  value={form.collegeDomain}
                  onChange={onChange}
                  placeholder="e.g. mit.edu"
                />
              </div>
            </>
          )}

          {error && <div className="card text-error max-w-md mx-auto my-md flex-center" style={{ padding: '0.75rem', borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>{error}</div>}
          {success && <div className="card max-w-md mx-auto my-md flex-center" style={{ color: 'var(--success)', padding: '0.75rem', borderColor: 'var(--success)', background: 'rgba(34, 197, 94, 0.05)' }}>{success}</div>}
          
          <button type="submit" className="btn btn-primary btn-lg btn-block mt-md">Register</button>
          
          <div className="text-center mt-md">
            <Link to="/login" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Already have an account? <span style={{ color: 'var(--accent-primary)' }}>Login here</span></Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
