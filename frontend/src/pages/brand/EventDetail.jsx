import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const BrandEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/events/${id}`).then((res) => setEvent(res.data.data));
    api.get(`/events/${id}/tiers`).then((res) => setTiers(res.data.data));
  }, [id]);

  const apply = async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setFeedback('');

    try {
      await api.post('/applications', { eventId: id, message: message.trim() });
      setFeedback('Application submitted successfully.');
      setMessage('');
      setTimeout(() => navigate('/brand/applications'), 800);
    } catch (err) {
      if (err?.response?.status === 409) {
        setFeedback('You already applied to this event. Check your Applications page.');
      } else {
        setFeedback(err?.response?.data?.message || 'Unable to submit application');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!event) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <h3>Tiers</h3>
      {tiers.map((tier) => (
        <div key={tier._id}>
          {tier.name} - ₹{tier.price} - {tier.benefits}
        </div>
      ))}
      {feedback && <p style={{ color: '#b45309' }}>{feedback}</p>}
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
      <br />
      <button onClick={apply} disabled={submitting}>
        {submitting ? 'Applying...' : 'Apply'}
      </button>
      <div style={{ marginTop: '0.75rem' }}>
        <Link to="/brand/applications">Go to My Applications</Link>
      </div>
    </div>
  );
};

export default BrandEventDetail;
