import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../services/api';

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: null,
    location: '',
    footfall: 0,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.date) {
      setError('Please select event date and time');
      return;
    }

    setError('');

    const payload = {
      ...form,
      date: new Date(form.date).toISOString(),
    };

    await api.post('/events', payload);
    navigate('/student/dashboard');
  };

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
            {error && <p className="text-error" style={{ margin: 0 }}>{error}</p>}
            <div className="form-group">
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Event Title</label>
              <input className="input" value={form.title} placeholder="e.g., Tech Summit 2026" onChange={(e) => onChange('title', e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Description</label>
              <textarea className="input" value={form.description} placeholder="What is this event about?" onChange={(e) => onChange('description', e.target.value)} rows={4} style={{ resize: 'vertical' }} required />
            </div>
            
            <div className="grid gap-md" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Date & Time</label>
                <DatePicker
                  selected={form.date}
                  onChange={(date) => onChange('date', date)}
                  showTimeSelect
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  placeholderText="Select date and time"
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Expected Footfall</label>
                <input
                  className="input"
                  type="number"
                  value={form.footfall || ''}
                  placeholder="e.g., 5000"
                  onChange={(e) => onChange('footfall', Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="form-group mb-lg">
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Location</label>
              <input className="input" value={form.location} placeholder="e.g., Main Campus Auditorium" onChange={(e) => onChange('location', e.target.value)} required />
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
