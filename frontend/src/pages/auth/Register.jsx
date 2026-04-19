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
    <div className="container auth-shell">
      <div className="animate-fade-in auth-layout auth-layout-center">
        <section className="auth-panel card">
          <form onSubmit={onSubmit} className="grid gap-md">
            <div className="auth-heading">
              <h2 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Create Account</h2>
              <p style={{ margin: 0 }}>Set up your Active8 workspace.</p>
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
            
            <div className="form-group">
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Account Type</label>
              <select className="input" name="role" value={form.role} onChange={onChange} style={{ cursor: 'pointer' }}>
                <option value="student">Student</option>
                <option value="brand">Brand</option>
                <option value="college_admin">College Admin</option>
                <option value="platform_admin">Platform Admin</option>
              </select>
            </div>

            {form.role === 'student' && (
              <div className="form-group">
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
              <div className="grid gap-md">
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
                <div className="form-group">
                  <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>College Domain</label>
                  <input
                    className="input"
                    name="collegeDomain"
                    value={form.collegeDomain}
                    onChange={onChange}
                    placeholder="e.g. mit.edu"
                  />
                </div>
              </div>
            )}

            {error && <div className="card text-error auth-feedback">{error}</div>}
            {success && <div className="card auth-success-feedback">{success}</div>}
            
            <button type="submit" className="btn btn-primary btn-lg btn-block">Register</button>
            
            <div className="text-center">
              <Link to="/login" className="link-button">Already have an account? Login here</Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Register;
