import Cookies from 'js-cookie';
import api from './api';

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  const { user, token } = res.data.data;
  Cookies.set('token', token, { expires: 7 });
  Cookies.set('user', JSON.stringify(user), { expires: 7 });
  return { user, token };
};

export const logout = () => {
  Cookies.remove('token');
  Cookies.remove('user');
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(Cookies.get('user') || 'null');
  } catch {
    return null;
  }
};

export const isAuthenticated = () => !!Cookies.get('token');

export const hasRole = (roles) => {
  const user = getUser();
  if (!user) return false;
  return roles.includes(user.role);
};
