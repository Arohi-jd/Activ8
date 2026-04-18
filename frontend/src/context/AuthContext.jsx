import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  const fetchMe = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) {
      return;
    }
    hasFetchedRef.current = true;
    fetchMe();
  }, []);

  const login = async (email, password) => {
    await api.post('/auth/login', { email, password });
    await fetchMe();
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
