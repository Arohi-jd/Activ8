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
    <div style={{ padding: '1rem' }}>
      <h2>Colleges</h2>
      {colleges.map((college) => (
        <div key={college._id} style={{ border: '1px solid #ddd', marginTop: '0.5rem', padding: '0.5rem' }}>
          {college.name} ({college.domain}) - verified: {String(college.verified)}
          {!college.verified && (
            <button onClick={() => verify(college._id)} style={{ marginLeft: '1rem' }}>
              Verify
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlatformColleges;
