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
    <div className="container flex-center" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="animate-fade-in w-full" style={{ maxWidth: '600px' }}>
        <div className="card">
          <div className="mb-lg border-bottom" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Create Event</h2>
            <p style={{ margin: 0 }}>Add a new event to attract brand sponsorships</p>
          </div>
          
          <form onSubmit={onSubmit} className="grid gap-md">
            <div className="form-group">
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Event Title</label>
              <input className="input" placeholder="e.g., Tech Summit 2026" onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            
            <div className="form-group">
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Description</label>
              <textarea className="input" placeholder="What is this event about?" onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} style={{ resize: 'vertical' }} required />
            </div>
            
            <div className="grid gap-md" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Date & Time</label>
                <input className="input" type="datetime-local" onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              
              <div className="form-group">
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Expected Footfall</label>
                <input
                  className="input"
                  type="number"
                  placeholder="e.g., 5000"
                  onChange={(e) => setForm({ ...form, footfall: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="form-group mb-lg">
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Location</label>
              <input className="input" placeholder="e.g., Main Campus Auditorium" onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
            
            <div className="flex justify-end pt-sm">
              <button type="submit" className="btn btn-primary btn-lg btn-block">Publish Event</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
