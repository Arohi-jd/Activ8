import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const BrandDashboard = () => {
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);

  const loadData = async () => {
    try {
      const [eventsRes, applicationsRes] = await Promise.all([api.get('/events'), api.get('/applications/mine')]);
      setEvents(eventsRes.data.data || []);
      setApplications(applicationsRes.data.data || []);
    } catch (error) {
      setEvents([]);
      setApplications([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const respond = async (id, status) => {
    await api.patch(`/applications/${id}/respond`, { status });
    await loadData();
  };

  const incomingFromStudents = applications.filter((app) => app.initiatedBy === 'student');

  return (
    <div className="container animate-fade-in dashboard-shell">
      <div className="dashboard-hero card">
        <div>
          <span className="badge badge-primary">Brand Dashboard</span>
          <h2 style={{ marginTop: '0.75rem' }}>Discover events and manage sponsorship requests</h2>
          <p style={{ marginBottom: 0 }}>Review incoming student requests and browse published events with a cleaner, faster workspace.</p>
        </div>
        <div>
          <Link to="/brand/applications" className="btn btn-secondary">View All Applications</Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <span>Student requests</span>
          <strong>{incomingFromStudents.length}</strong>
        </div>
        <div className="card stat-card">
          <span>Published events</span>
          <strong>{events.length}</strong>
        </div>
        <div className="card stat-card">
          <span>All applications</span>
          <strong>{applications.length}</strong>
        </div>
      </div>

      <div className="grid gap-lg dashboard-grid">
        <section className="card dashboard-section">
          <div className="section-heading">
            <div>
              <h3>Student Requests</h3>
              <p>Accept or reject inbound sponsorship requests.</p>
            </div>
          </div>

          <div className="flex-col gap-sm">
            {incomingFromStudents.length === 0 ? (
              <div className="empty-state">
                <p style={{ margin: 0 }}>No new student requests.</p>
              </div>
            ) : (
              incomingFromStudents.map((app) => (
                <div key={app._id} className="list-card">
                  <div className="list-card-content">
                    <h4>{app.event?.title}</h4>
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>Student: {app.student?.name}</p>
                    <span className="badge badge-warning" style={{ marginTop: '0.5rem' }}>{app.status}</span>
                  </div>
                  {app.status === 'pending' && (
                    <div className="flex gap-sm list-card-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => respond(app._id, 'accepted')}>Accept</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => respond(app._id, 'rejected')}>Reject</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="card dashboard-section">
          <div className="section-heading">
            <div>
              <h3>Published Events</h3>
              <p>Explore the latest event opportunities.</p>
            </div>
          </div>

          <div className="flex-col gap-sm">
            {events.length === 0 ? (
               <div className="empty-state">
                 <p style={{ margin: 0 }}>No events available currently.</p>
               </div>
            ) : (
              events.map((event) => (
                <div key={event._id} className="list-card">
                  <div>
                    <h4>{event.title}</h4>
                    <p style={{ fontSize: '0.875rem', margin: '0.35rem 0 0' }}>{event.location}</p>
                  </div>
                  <Link to={`/brand/events/${event._id}`} className="btn btn-secondary btn-sm">View Details</Link>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BrandDashboard;
