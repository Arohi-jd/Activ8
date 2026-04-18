import { useEffect, useState } from 'react';
import api from '../../services/api';

const PlatformColleges = () => {
  const [colleges, setColleges] = useState([]);

  const load = async () => {
    const res = await api.get('/colleges');
    setColleges(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const verify = async (id) => {
    await api.patch(`/colleges/${id}/verify`);
    await load();
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div className="mb-lg" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h2>Platform Administration</h2>
        <p style={{ margin: 0 }}>Manage and verify registered colleges</p>
      </div>

      <div className="grid gap-md" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
        {colleges.length === 0 ? (
           <div className="card text-center w-full" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
             <p style={{ margin: 0 }}>No colleges registered yet.</p>
           </div>
        ) : (
          colleges.map((college) => (
            <div key={college._id} className="card flex-between" style={{ borderColor: college.verified ? 'var(--border-color)' : 'var(--warning)' }}>
              <div>
                <div className="flex gap-sm" style={{ alignItems: 'center', marginBottom: '0.25rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.25rem', margin: 0 }}>{college.name}</h3>
                  {college.verified ? (
                    <span className="badge badge-success">Verified</span>
                  ) : (
                    <span className="badge badge-warning">Pending</span>
                  )}
                </div>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>Domain: <strong>{college.domain}</strong></p>
              </div>
              {!college.verified && (
                <button className="btn btn-primary btn-sm" onClick={() => verify(college._id)}>
                  Verify College
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlatformColleges;
