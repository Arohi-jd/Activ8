import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const BrandChat = () => {
  const { appId } = useParams();
  const [conversationId, setConversationId] = useState('');
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const loadConversation = async () => {
    try {
      const convoRes = await api.get(`/conversations/${appId}`);
      setConversationId(convoRes.data.data._id);
      const msgRes = await api.get(`/conversations/${convoRes.data.data._id}/messages`);
      setMessages(msgRes.data.data);
      setError('');
    } catch (err) {
      setConversationId('');
      setError(err?.response?.data?.message || 'Unable to load chat');
    }
  };

  useEffect(() => {
    loadConversation();
  }, [appId]);

  const send = async (e) => {
    e.preventDefault();
    if (!content || !conversationId) {
      return;
    }
    try {
      await api.post(`/conversations/${conversationId}/messages`, { content: content.trim() });
      setContent('');
      setError('');
      await loadConversation();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to send message');
    }
  };

  return (
    <div className="container animate-fade-in flex-col" style={{ height: 'calc(100vh - 72px)', paddingTop: '1rem', paddingBottom: '1rem' }}>
      <div className="mb-md">
        <h2>Brand Conversation</h2>
        <p style={{ margin: 0 }}>Communicate directly with students</p>
      </div>
      
      {error && <div className="card text-error mb-md flex-center" style={{ padding: '0.75rem', borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>{error}</div>}
      
      <div className="card flex-col flex-1 pb-0 mb-0" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.length === 0 && !error ? (
            <div className="flex-center w-full h-full text-center" style={{ color: 'var(--text-secondary)' }}>
              Start the conversation by sending a message
            </div>
          ) : (
            messages.map((m) => (
              <div key={m._id} className="flex-col" style={{ maxWidth: '80%' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', marginLeft: '0.5rem' }}>
                  {m.sender?.name}
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: '0.75rem', color: '#fff', border: '1px solid var(--border-color)' }}>
                  {m.content}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <form onSubmit={send} className="flex gap-sm">
            <input 
              className="input flex-1" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Type your message..." 
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary" disabled={!content.trim()}>Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BrandChat;
