import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const BrandApplications = () => {
  const [applications, setApplications] = useState([]);

  const load = async () => {
    const res = await api.get('/applications/mine');
    setApplications(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const respond = async (id, status) => {
    await api.patch(`/applications/${id}/respond`, { status });
    await load();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Brand Applications</h2>
      {applications.map((app) => (
        <div key={app._id} style={{ border: '1px solid #ddd', marginTop: '0.5rem', padding: '0.5rem' }}>
          <p>
            Event: {app.event?.title} | Student: {app.student?.name} | Status: {app.status}
          </p>
          {app.status === 'pending' && app.initiatedBy === 'student' && (
            <>
              <button onClick={() => respond(app._id, 'accepted')}>Accept</button>
              <button onClick={() => respond(app._id, 'rejected')}>Reject</button>
            </>
          )}
          {app.status === 'accepted' ? (
            <Link to={`/brand/chat/${app._id}`}>Open Chat</Link>
          ) : (
            <p style={{ color: '#666' }}>Chat unlocks after application is accepted.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default BrandApplications;
