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
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div className="mb-lg" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h2>Brand Applications</h2>
        <p style={{ margin: 0 }}>Review student sponsorship requests</p>
      </div>
      
      <div className="grid gap-md" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
        {applications.map((app) => (
          <div key={app._id} className="card flex-col flex-between">
            <div>
              <div className="flex-between mb-sm">
                <h3 style={{ color: '#fff' }}>{app.event?.title}</h3>
                <span className="badge badge-warning">{app.status}</span>
              </div>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Student: <strong>{app.student?.name}</strong></p>
            </div>
            
            <div className="mt-md border-top pt-sm" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              {app.status === 'pending' && app.initiatedBy === 'student' && (
                <div className="flex gap-sm">
                  <button className="btn btn-primary flex-1" onClick={() => respond(app._id, 'accepted')}>Accept</button>
                  <button className="btn btn-secondary flex-1" onClick={() => respond(app._id, 'rejected')}>Reject</button>
                </div>
              )}
              {app.status === 'accepted' ? (
                <Link to={`/brand/chat/${app._id}`} className="btn btn-primary w-full text-center">Open Chat</Link>
              ) : (
                app.status !== 'pending' && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>Chat unlocks after application is accepted.</p>
              )}
            </div>
          </div>
        ))}
        {applications.length === 0 && (
          <div className="card w-full text-center" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
            <p style={{ margin: 0 }}>No applications to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandApplications;
