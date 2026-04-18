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
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div className="card mb-lg pb-md">
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#fff' }}>{event.title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{event.description}</p>
        
        <div className="mt-md p-md rounded" style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 className="mb-sm" style={{ color: '#fff' }}>Sponsorship Tiers</h3>
          <div className="grid gap-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {tiers.map((tier) => (
              <div key={tier._id} className="card" style={{ background: 'var(--bg-primary)' }}>
                <h4 style={{ color: 'var(--accent-primary)', fontSize: '1.25rem', marginBottom: '0.25rem' }}>{tier.name}</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>₹{tier.price}</div>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>{tier.benefits}</p>
              </div>
            ))}
            {tiers.length === 0 && <p>No tiers specified for this event.</p>}
          </div>
        </div>

        <div className="mt-lg pt-md" style={{ borderTop: '1px solid var(--border-color)' }}>
          <h3 className="mb-sm">Apply for Sponsorship</h3>
          {feedback && (
            <div className={`card mb-md flex-center ${feedback.includes('successfully') ? '' : 'text-error'}`} style={{ padding: '0.75rem', borderColor: feedback.includes('successfully') ? 'var(--success)' : 'var(--danger)', background: feedback.includes('successfully') ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)', color: feedback.includes('successfully') ? 'var(--success)' : 'var(--danger)' }}>
              {feedback}
            </div>
          )}
          <div className="form-group mb-md">
            <textarea
              className="input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Why are you interested in sponsoring this event?"
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div className="flex gap-md">
            <button className="btn btn-primary" onClick={apply} disabled={submitting}>
              {submitting ? 'Submitting Application...' : 'Apply as Sponsor'}
            </button>
            <Link to="/brand/applications" className="btn btn-secondary">Go to My Applications</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandEventDetail;
