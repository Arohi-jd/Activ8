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
    <div className="container animate-fade-in dashboard-shell">
      <div className="dashboard-hero card">
        <div>
          <span className="badge badge-primary">Student Dashboard</span>
          <h2 style={{ marginTop: '0.75rem' }}>Manage your events and applications</h2>
          <p style={{ marginBottom: 0 }}>Track pending sponsorship requests, publish events, and keep everything in one place.</p>
        </div>
        <div className="flex gap-sm dashboard-actions">
          <Link to="/student/events/create" className="btn btn-primary">Create Event</Link>
          <Link to="/student/applications" className="btn btn-secondary">View Applications</Link>
        </div>
      </div>

      {error && <div className="card text-error auth-feedback">{error}</div>}

      <div className="stats-grid">
        <div className="card stat-card">
          <span>Events</span>
          <strong>{events.length}</strong>
        </div>
        <div className="card stat-card">
          <span>Pending requests</span>
          <strong>{incomingPending.length}</strong>
        </div>
        <div className="card stat-card">
          <span>Total applications</span>
          <strong>{applications.length}</strong>
        </div>
      </div>

      <div className="grid gap-lg dashboard-grid">
        <section className="card dashboard-section">
          <div className="section-heading">
            <div>
              <h3>Incoming Brand Applications</h3>
              <p>Requests that need your attention.</p>
            </div>
          </div>

          <div className="flex-col gap-sm">
            {incomingPending.length === 0 ? (
              <div className="empty-state">
                <p style={{ margin: 0 }}>No pending applications yet.</p>
              </div>
            ) : (
              incomingPending.map((app) => (
                <div key={app._id} className="list-card">
                  <div>
                    <h4>{app.event?.title}</h4>
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>Brand: {app.brand?.name}</p>
                  </div>
                  <span className="badge badge-warning">{app.status}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="card dashboard-section">
          <div className="section-heading">
            <div>
              <h3>My Events</h3>
              <p>Publish and manage your event listings.</p>
            </div>
          </div>

          <div className="flex-col gap-sm">
            {events.length === 0 ? (
               <div className="empty-state">
                 <p style={{ margin: 0 }}>You haven't created any events.</p>
               </div>
            ) : (
              events.map((event) => (
                <div key={event._id} className="list-card">
                  <div>
                    <h4>{event.title}</h4>
                    <div className="flex gap-sm" style={{ marginTop: '0.5rem' }}>
                      <span className={event.status === 'published' ? 'badge badge-success' : 'badge badge-warning'}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  {event.status !== 'published' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={async () => {
                        await api.patch(`/events/${event._id}/publish`);
                        await loadData();
                      }}
                    >
                      Publish
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
