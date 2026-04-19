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
    <div className="container" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="animate-fade-in event-create-layout">
        <section className="event-create-panel card">
          <div className="event-create-header">
            <span className="badge badge-primary" style={{ alignSelf: 'flex-start' }}>New Event</span>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Create Event</h2>
            <p style={{ margin: 0 }}>Add a polished event with date, time, and sponsorship details.</p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-md">
            {error && <p className="text-error" style={{ margin: 0 }}>{error}</p>}

            <div className="event-create-section">
              <div className="form-group">
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Event Title</label>
                <input className="input" value={form.title} placeholder="e.g., Tech Summit 2026" onChange={(e) => onChange('title', e.target.value)} required />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Description</label>
                <textarea className="input" value={form.description} placeholder="What is this event about?" onChange={(e) => onChange('description', e.target.value)} rows={5} style={{ resize: 'vertical' }} required />
              </div>
            </div>

            <div className="event-create-section">
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Schedule</h3>
              <div className="event-create-grid">
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
                    className="input event-datepicker"
                    wrapperClassName="event-datepicker-wrapper"
                    popperClassName="event-datepicker-popper"
                    required
                  />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Choose both the event date and start time.</span>
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
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Used to estimate sponsorship interest.</span>
                </div>
              </div>
            </div>

            <div className="event-create-section">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Location</label>
                <input className="input" value={form.location} placeholder="e.g., Main Campus Auditorium" onChange={(e) => onChange('location', e.target.value)} required />
              </div>
            </div>

            <div className="flex justify-end pt-sm">
              <button type="submit" className="btn btn-primary btn-lg btn-block">Publish Event</button>
            </div>
          </form>
        </section>

        <aside className="event-create-summary card">
          <div className="event-create-summary-top">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Event Preview</h3>
            <p style={{ margin: 0 }}>A quick overview of what sponsors will see.</p>
          </div>

          <div className="event-create-summary-item">
            <span>Title</span>
            <strong>{form.title || 'Your event title'}</strong>
          </div>

          <div className="event-create-summary-item">
            <span>Date & Time</span>
            <strong>{form.date ? form.date.toLocaleString() : 'Not selected yet'}</strong>
          </div>

          <div className="event-create-summary-item">
            <span>Footfall</span>
            <strong>{form.footfall ? form.footfall.toLocaleString() : '0'}</strong>
          </div>

          <div className="event-create-summary-item">
            <span>Location</span>
            <strong>{form.location || 'Not added yet'}</strong>
          </div>

          <div className="event-create-summary-note">
            <p style={{ margin: 0 }}>Tip: choose a date/time that gives brands enough lead time to respond.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateEvent;
