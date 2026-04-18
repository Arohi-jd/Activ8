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
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div className="flex-between mb-lg" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h2>Brand Dashboard</h2>
          <p style={{ margin: 0 }}>Discover events and manage requests</p>
        </div>
        <div>
          <Link to="/brand/applications" className="btn btn-secondary">View All Applications</Link>
        </div>
      </div>

      <div className="grid gap-lg" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }}>
        <section>
          <h3 className="mb-md">Student Requests</h3>
          <div className="flex-col gap-sm">
            {incomingFromStudents.length === 0 ? (
              <div className="card text-center" style={{ padding: '2rem 1rem' }}>
                <p style={{ margin: 0 }}>No new student requests.</p>
              </div>
            ) : (
              incomingFromStudents.map((app) => (
                <div key={app._id} className="card">
                  <div className="flex-between mb-sm">
                    <div>
                      <h4 style={{ color: '#fff' }}>{app.event?.title}</h4>
                      <p style={{ fontSize: '0.875rem', margin: 0 }}>Student: {app.student?.name}</p>
                    </div>
                    <span className="badge badge-warning">{app.status}</span>
                  </div>
                  {app.status === 'pending' && (
                    <div className="flex gap-sm">
                      <button className="btn btn-primary btn-sm flex-1" onClick={() => respond(app._id, 'accepted')}>Accept</button>
                      <button className="btn btn-secondary btn-sm flex-1" onClick={() => respond(app._id, 'rejected')}>Reject</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h3 className="mb-md">Published Events</h3>
          <div className="flex-col gap-sm">
            {events.length === 0 ? (
               <div className="card text-center" style={{ padding: '2rem 1rem' }}>
                 <p style={{ margin: 0 }}>No events available currently.</p>
               </div>
            ) : (
              events.map((event) => (
                <div key={event._id} className="card flex-between">
                  <div>
                    <h4 style={{ color: '#fff' }}>{event.title}</h4>
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>{event.location}</p>
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
