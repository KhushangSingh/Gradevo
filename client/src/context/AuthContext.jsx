import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Point axios at the deployed API in production; empty string lets Vite proxy work in dev
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days rolling session

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Save session & logically update the local rolling timestamp
  const saveSession = (newToken) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('lastActive', Date.now().toString());
    setToken(newToken);
  };

  const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastActive');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const isSessionValid = () => {
    const storedToken = localStorage.getItem('token');
    const lastActive = localStorage.getItem('lastActive');
    if (!storedToken || !lastActive) return false;
    return (Date.now() - Number(lastActive)) < SESSION_DURATION_MS;
  };

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check if rolling session is still valid (user has visited in last 7 days)
      if (!isSessionValid()) {
        clearSession();
        setLoading(false);
        return;
      }

      // 2. Setup auth headers
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await fetchUser();
      } else {
        clearSession();
        setLoading(false);
      }
    };
    initAuth();
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/users/me');
      setUser(res.data);

      // Successful fetch = active visit = refresh the rolling window
      if (res.data.token) {
          saveSession(res.data.token);
      } else {
          localStorage.setItem('lastActive', Date.now().toString());
      }
    } catch (error) {
      console.error('Error fetching user', error);
      clearSession();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/users/login', { email, password });
    saveSession(res.data.token);
    setUser(res.data);
    setLoading(false);
    return res.data;
  };

  const register = async (userData) => {
    const res = await axios.post('/api/users', userData);
    saveSession(res.data.token);
    setUser(res.data);
    setLoading(false);
    return res.data;
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
