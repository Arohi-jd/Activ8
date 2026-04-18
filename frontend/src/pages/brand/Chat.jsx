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
    <div style={{ padding: '1rem' }}>
      <h2>Brand Chat</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {messages.map((m) => (
        <p key={m._id}>
          <strong>{m.sender?.name}:</strong> {m.content}
        </p>
      ))}
      <form onSubmit={send}>
        <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default BrandChat;
