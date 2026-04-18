import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  const setAuthToken = (token) => {
    if (!token) {
      return;
    }

    localStorage.setItem('authToken', token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, []);

  const fetchMe = async (options = {}) => {
    const { silentUnauthorized = false, clearAuthOnUnauthorized = true } = options;

    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data);
      return res.data.data;
    } catch (error) {
      setUser(null);

      const statusCode = error?.response?.status;
      if (statusCode === 401 && clearAuthOnUnauthorized) {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common.Authorization;
      }

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
    fetchMe({ silentUnauthorized: true, clearAuthOnUnauthorized: false });
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const responseData = response?.data?.data || {};
    const token = responseData?.token;

    setAuthToken(token);

    if (responseData) {
      const { token: _token, ...userData } = responseData;
      setUser(userData);
    }

    fetchMe({ silentUnauthorized: true, clearAuthOnUnauthorized: false }).catch(() => null);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, setUser, loading, login, logout, refreshUser: fetchMe }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
