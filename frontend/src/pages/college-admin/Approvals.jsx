import { useEffect, useState } from 'react';
import api from '../../services/api';

const CollegeApprovals = () => {
  const [students, setStudents] = useState([]);

  const load = async () => {
    const res = await api.get('/colleges/students/pending');
    setStudents(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await api.patch(`/colleges/students/${id}/approve`);
    await load();
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div className="mb-lg" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h2>College Admin Approvals</h2>
        <p style={{ margin: 0 }}>Review and approve pending student accounts for your college</p>
      </div>

      <div className="grid gap-md" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
        {students.length === 0 ? (
           <div className="card text-center w-full" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
             <p style={{ margin: 0 }}>No pending student approvals at this time.</p>
           </div>
        ) : (
          students.map((s) => (
            <div key={s._id} className="card flex-between">
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.25rem' }}>{s.name}</h3>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>{s.email}</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => approve(s._id)}>
                Approve Student
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CollegeApprovals;
