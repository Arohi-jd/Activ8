import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const StudentDashboard = () => {
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [eventsRes, applicationsRes] = await Promise.all([api.get('/events'), api.get('/applications/mine')]);
      setEvents(eventsRes.data.data || []);
      setApplications(applicationsRes.data.data || []);
      setError('');
    } catch (err) {
      setError('Unable to load dashboard data');
      setEvents([]);
      setApplications([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const incomingPending = applications.filter((app) => app.initiatedBy === 'brand' && app.status === 'pending');

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Student Dashboard</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
        <Link to="/student/events/create">Create Event</Link>
        <Link to="/student/applications">View Applications</Link>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Incoming Brand Applications</h3>
      {incomingPending.length === 0 ? (
        <p>No pending applications yet.</p>
      ) : (
        incomingPending.map((app) => (
          <div key={app._id} style={{ border: '1px solid #ddd', marginTop: '0.5rem', padding: '0.5rem' }}>
            <strong>{app.event?.title}</strong> | Brand: {app.brand?.name} | Status: {app.status}
          </div>
        ))
      )}

      <h3>My Events</h3>
      {events.map((event) => (
        <div key={event._id} style={{ border: '1px solid #ddd', marginTop: '0.5rem', padding: '0.5rem' }}>
          <strong>{event.title}</strong> - {event.status}
          <div>
            <button
              onClick={async () => {
                await api.patch(`/events/${event._id}/publish`);
                await loadData();
              }}
            >
              Publish
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentDashboard;
