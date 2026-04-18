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
    <div style={{ padding: '1rem' }}>
      <h2>Pending Students</h2>
      {students.map((s) => (
        <div key={s._id} style={{ border: '1px solid #ddd', marginTop: '0.5rem', padding: '0.5rem' }}>
          {s.name} ({s.email})
          <button onClick={() => approve(s._id)} style={{ marginLeft: '1rem' }}>
            Approve
          </button>
        </div>
      ))}
    </div>
  );
};

export default CollegeApprovals;
