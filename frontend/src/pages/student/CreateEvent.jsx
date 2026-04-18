import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    footfall: 0,
  });
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    await api.post('/events', form);
    navigate('/student/dashboard');
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 500, margin: '2rem auto', display: 'grid', gap: '0.75rem' }}>
      <h2>Create Event</h2>
      <input placeholder="Title" onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input type="datetime-local" onChange={(e) => setForm({ ...form, date: e.target.value })} />
      <input placeholder="Location" onChange={(e) => setForm({ ...form, location: e.target.value })} />
      <input
        type="number"
        placeholder="Footfall"
        onChange={(e) => setForm({ ...form, footfall: Number(e.target.value) })}
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateEvent;
