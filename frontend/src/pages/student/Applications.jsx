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
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div className="mb-lg" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h2>Student Applications</h2>
        <p style={{ margin: 0 }}>Apply to brands and track application statuses</p>
      </div>

      <div className="grid gap-lg mb-lg">
        <div className="card">
          <h3 className="mb-md">Explore Available Brands</h3>
          {myEvents.length === 0 ? (
            <p>Create an event first before applying to brands.</p>
          ) : brands.length === 0 ? (
            <p>No active brands available right now.</p>
          ) : (
            <form onSubmit={applyToBrand} className="grid gap-md" style={{ maxWidth: 700 }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Available Brands</label>
                <div className="grid gap-sm" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                  {brands.map((brand) => (
                    <div
                      key={brand._id}
                      className={form.brandId === brand._id ? 'card' : 'card'}
                      style={{
                        padding: '1rem',
                        cursor: 'pointer',
                        borderColor: form.brandId === brand._id ? 'var(--accent-primary)' : 'var(--border-color)',
                        boxShadow: form.brandId === brand._id ? 'var(--shadow-glow)' : 'none',
                      }}
                      onClick={() => setForm((prev) => ({ ...prev, brandId: brand._id }))}
                    >
                      <div className="flex-between">
                        <div>
                          <strong style={{ color: '#fff' }}>{brand.name}</strong>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{brand.email}</div>
                        </div>
                        <div className={form.brandId === brand._id ? 'badge badge-primary' : ''}>
                          {form.brandId === brand._id ? 'Selected' : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Select Event</label>
                <select
                  className="input"
                  style={{ cursor: 'pointer' }}
                  value={form.eventId}
                  onChange={(e) => setForm((prev) => ({ ...prev, eventId: e.target.value }))}
                >
                  {myEvents.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.title} ({event.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Message to brand</label>
                <textarea
                  className="input"
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell the brand why they should sponsor you..."
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {error && <div className="card text-error max-w-md my-sm flex-center" style={{ padding: '0.75rem', borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>{error}</div>}
              {success && <div className="card max-w-md my-sm flex-center" style={{ color: 'var(--success)', padding: '0.75rem', borderColor: 'var(--success)', background: 'rgba(34, 197, 94, 0.05)' }}>{success}</div>}

              <div>
                <button type="submit" className="btn btn-primary">Apply to Brand</button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="grid gap-lg" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }}>
        <section>
          <h3 className="mb-md">Applications from Brands</h3>
          <div className="flex-col gap-sm">
            {incomingFromBrands.length === 0 ? (
              <div className="card text-center" style={{ padding: '2rem 1rem' }}>
                <p style={{ margin: 0 }}>No applications received from brands yet.</p>
              </div>
            ) : (
              incomingFromBrands.map((app) => (
                <div key={app._id} className="card">
                  <div className="mb-sm">
                    <h4 style={{ color: '#fff' }}>{app.event?.title}</h4>
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>Brand: {app.brand?.name}</p>
                    <span className="badge badge-warning" style={{ marginTop: '0.5rem' }}>{app.status}</span>
                  </div>
                  {app.status === 'pending' && (
                    <div className="flex gap-sm mt-sm">
                      <button className="btn btn-primary btn-sm flex-1" onClick={() => respond(app._id, 'accepted')}>Accept</button>
                      <button className="btn btn-secondary btn-sm flex-1" onClick={() => respond(app._id, 'rejected')}>Reject</button>
                    </div>
                  )}
                  {app.status === 'accepted' ? (
                    <Link to={`/student/chat/${app._id}`} className="btn btn-primary btn-sm w-full mt-sm">Open Chat</Link>
                  ) : (
                    app.status !== 'pending' && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Chat unlocks after application is accepted.</p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h3 className="mb-md">Applications Sent to Brands</h3>
          <div className="flex-col gap-sm">
            {sentToBrands.length === 0 ? (
              <div className="card text-center" style={{ padding: '2rem 1rem' }}>
                <p style={{ margin: 0 }}>You have not applied to any brands yet.</p>
              </div>
            ) : (
              sentToBrands.map((app) => (
                <div key={app._id} className="card">
                  <div className="mb-sm flex-between">
                    <div>
                      <h4 style={{ color: '#fff' }}>{app.event?.title}</h4>
                      <p style={{ fontSize: '0.875rem', margin: 0 }}>Brand: {app.brand?.name}</p>
                    </div>
                    <span className="badge badge-warning">{app.status}</span>
                  </div>
                  {app.status === 'accepted' ? (
                    <Link to={`/student/chat/${app._id}`} className="btn btn-primary btn-sm w-full mt-sm">Open Chat</Link>
                  ) : (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Waiting for brand response.</p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentApplications;
