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
    <form onSubmit={onSubmit} style={{ maxWidth: 420, margin: '2rem auto', display: 'grid', gap: '0.75rem' }}>
      <h2>Register</h2>
      <input name="name" value={form.name} onChange={onChange} placeholder="Name" />
      <input name="email" value={form.email} onChange={onChange} placeholder="Email" />
      <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" />
      <select name="role" value={form.role} onChange={onChange}>
        <option value="student">student</option>
        <option value="brand">brand</option>
        <option value="college_admin">college_admin</option>
        <option value="platform_admin">platform_admin</option>
      </select>
      {form.role === 'student' && (
        <input
          name="collegeDomain"
          value={form.collegeDomain}
          onChange={onChange}
          placeholder="College domain (e.g. mit.edu)"
        />
      )}
      {form.role === 'college_admin' && (
        <>
          <input
            name="collegeName"
            value={form.collegeName}
            onChange={onChange}
            placeholder="College name"
          />
          <input
            name="collegeDomain"
            value={form.collegeDomain}
            onChange={onChange}
            placeholder="College domain (e.g. mit.edu)"
          />
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <button type="submit">Register</button>
      <Link to="/login">Already have an account?</Link>
    </form>
  );
};

export default Register;
