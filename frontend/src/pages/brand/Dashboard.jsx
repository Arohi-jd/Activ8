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
    <div style={{ padding: '1rem' }}>
      <h2>Brand Dashboard</h2>

      <div style={{ border: '1px solid #ddd', padding: '0.75rem', marginBottom: '1rem' }}>
        <h3>Student Requests (Front Page)</h3>
        {incomingFromStudents.length === 0 ? (
          <p>No student requests yet.</p>
        ) : (
          incomingFromStudents.map((app) => (
            <div key={app._id} style={{ border: '1px solid #ddd', marginTop: '0.5rem', padding: '0.5rem' }}>
              <p>
                Event: {app.event?.title} | Student: {app.student?.name} | Status: {app.status}
              </p>
              {app.status === 'pending' && (
                <>
                  <button onClick={() => respond(app._id, 'accepted')}>Accept</button>
                  <button onClick={() => respond(app._id, 'rejected')} style={{ marginLeft: '0.5rem' }}>
                    Reject
                  </button>
                </>
              )}
            </div>
          ))
        )}
        <div style={{ marginTop: '0.75rem' }}>
          <Link to="/brand/applications">View All Applications</Link>
        </div>
      </div>

      <h3>Published Events</h3>
      {events.map((event) => (
        <div key={event._id} style={{ border: '1px solid #ddd', marginTop: '0.5rem', padding: '0.5rem' }}>
          <strong>{event.title}</strong> | {event.location}
          <div>
            <Link to={`/brand/events/${event._id}`}>View Details</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrandDashboard;
