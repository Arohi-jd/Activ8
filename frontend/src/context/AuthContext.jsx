import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  const fetchMe = async (options = {}) => {
    const { silentUnauthorized = false } = options;

    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data);
      return res.data.data;
    } catch (error) {
      setUser(null);

      const statusCode = error?.response?.status;
      if (statusCode === 401 && silentUnauthorized) {
        return null;
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) {
      return;
    }
    hasFetchedRef.current = true;
    fetchMe({ silentUnauthorized: true });
  }, []);

  const login = async (email, password) => {
    await api.post('/auth/login', { email, password });

    try {
      await fetchMe();
    } catch (error) {
      if (error?.response?.status === 401) {
        throw new Error('Login succeeded but session was not created. Enable third-party cookies and try again.');
      }
      throw error;
    }
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, setUser, loading, login, logout, refreshUser: fetchMe }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
