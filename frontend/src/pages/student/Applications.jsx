import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [brands, setBrands] = useState([]);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ eventId: '', brandId: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    const [applicationsRes, brandsRes, eventsRes] = await Promise.all([
      api.get('/applications/mine'),
      api.get('/auth/brands'),
      api.get('/events'),
    ]);

    setApplications(applicationsRes.data.data || []);
    setBrands(brandsRes.data.data || []);
    setEvents(eventsRes.data.data || []);

    setForm((prev) => ({
      ...prev,
      eventId: prev.eventId || eventsRes.data.data?.[0]?._id || '',
      brandId: prev.brandId || brandsRes.data.data?.[0]?._id || '',
    }));
  };

  useEffect(() => {
    load();
  }, []);

  const respond = async (id, status) => {
    await api.patch(`/applications/${id}/respond`, { status });
    await load();
  };

  const applyToBrand = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.eventId || !form.brandId) {
      setError('Please select both an event and a brand');
      return;
    }

    try {
      await api.post('/applications', {
        eventId: form.eventId,
        brandId: form.brandId,
        message: form.message.trim(),
      });

      setSuccess('Application sent to brand successfully');
      setForm((prev) => ({ ...prev, message: '' }));
      await load();
    } catch (err) {
      if (err?.response?.status === 409) {
        setError('You already sent application to this brand for this event');
      } else {
        setError(err?.response?.data?.message || 'Unable to apply to brand');
      }
    }
  };

  const myEvents = events;
  const incomingFromBrands = applications.filter((app) => app.initiatedBy === 'brand');
  const sentToBrands = applications.filter((app) => app.initiatedBy === 'student');

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Student Applications</h2>

      <div style={{ border: '1px solid #ddd', padding: '0.75rem', marginBottom: '1rem' }}>
        <h3>Explore Available Brands</h3>
        {myEvents.length === 0 ? (
          <p>Create an event first before applying to brands.</p>
        ) : brands.length === 0 ? (
          <p>No active brands available right now.</p>
        ) : (
          <form onSubmit={applyToBrand} style={{ display: 'grid', gap: '0.5rem', maxWidth: 700 }}>
            <div>
              <p style={{ marginBottom: '0.5rem' }}>Available Brands:</p>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {brands.map((brand) => (
                  <div
                    key={brand._id}
                    style={{
                      border: form.brandId === brand._id ? '2px solid #2563eb' : '1px solid #ddd',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <strong>{brand.name}</strong>
                      <div style={{ color: '#666' }}>{brand.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, brandId: brand._id }))}
                    >
                      {form.brandId === brand._id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <label>
              Select Event
              <select
                value={form.eventId}
                onChange={(e) => setForm((prev) => ({ ...prev, eventId: e.target.value }))}
              >
                {myEvents.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title} ({event.status})
                  </option>
                ))}
              </select>
            </label>

            <p>
              Sending to: <strong>{brands.find((b) => b._id === form.brandId)?.name || 'No brand selected'}</strong>
            </p>

            <textarea
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="Message to brand"
              rows={3}
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <button type="submit">Apply to Brand</button>
          </form>
        )}
      </div>

      <div style={{ border: '1px solid #ddd', padding: '0.75rem', marginBottom: '1rem' }}>
        <h3>Applications Received From Brands</h3>
        {incomingFromBrands.length === 0 ? (
          <p>No applications received from brands yet.</p>
        ) : (
          incomingFromBrands.map((app) => (
            <div key={app._id} style={{ border: '1px solid #ddd', marginTop: '0.5rem', padding: '0.5rem' }}>
              <p>
                Event: {app.event?.title} | Brand: {app.brand?.name} | Status: {app.status}
              </p>
              {app.status === 'pending' && (
                <>
                  <button onClick={() => respond(app._id, 'accepted')}>Accept</button>
                  <button onClick={() => respond(app._id, 'rejected')}>Reject</button>
                </>
              )}
              {app.status === 'accepted' ? (
                <Link to={`/student/chat/${app._id}`}>Open Chat</Link>
              ) : (
                <p style={{ color: '#666' }}>Chat unlocks after application is accepted.</p>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{ border: '1px solid #ddd', padding: '0.75rem' }}>
        <h3>Applications Sent To Brands</h3>
        {sentToBrands.length === 0 ? (
          <p>You have not applied to any brands yet.</p>
        ) : (
          sentToBrands.map((app) => (
            <div key={app._id} style={{ border: '1px solid #ddd', marginTop: '0.5rem', padding: '0.5rem' }}>
              <p>
                Event: {app.event?.title} | Brand: {app.brand?.name} | Status: {app.status}
              </p>
              {app.status === 'accepted' ? (
                <Link to={`/student/chat/${app._id}`}>Open Chat</Link>
              ) : (
                <p style={{ color: '#666' }}>Waiting for brand response.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentApplications;
