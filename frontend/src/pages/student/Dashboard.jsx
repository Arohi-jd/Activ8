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
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div className="flex-between mb-lg" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h2>Student Dashboard</h2>
          <p style={{ margin: 0 }}>Manage your events and applications</p>
        </div>
        <div className="flex gap-sm">
          <Link to="/student/events/create" className="btn btn-primary">Create Event</Link>
          <Link to="/student/applications" className="btn btn-secondary">View Applications</Link>
        </div>
      </div>

      {error && <div className="card text-error mb-md flex-center" style={{ padding: '0.75rem', borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>{error}</div>}

      <div className="grid gap-lg" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }}>
        <section>
          <h3 className="mb-md">Incoming Brand Applications</h3>
          <div className="flex-col gap-sm">
            {incomingPending.length === 0 ? (
              <div className="card text-center" style={{ padding: '2rem 1rem' }}>
                <p style={{ margin: 0 }}>No pending applications yet.</p>
              </div>
            ) : (
              incomingPending.map((app) => (
                <div key={app._id} className="card flex-between">
                  <div>
                    <h4 style={{ color: '#fff' }}>{app.event?.title}</h4>
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>Brand: {app.brand?.name}</p>
                  </div>
                  <span className="badge badge-warning">{app.status}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h3 className="mb-md">My Events</h3>
          <div className="flex-col gap-sm">
            {events.length === 0 ? (
               <div className="card text-center" style={{ padding: '2rem 1rem' }}>
                 <p style={{ margin: 0 }}>You haven't created any events.</p>
               </div>
            ) : (
              events.map((event) => (
                <div key={event._id} className="card flex-between">
                  <div>
                    <h4 style={{ color: '#fff' }}>{event.title}</h4>
                    <span className={event.status === 'published' ? 'badge badge-success' : 'badge badge-warning'} style={{ marginTop: '0.25rem' }}>
                      {event.status}
                    </span>
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
