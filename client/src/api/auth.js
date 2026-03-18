const AUTH_USER_STORAGE_KEY = 'shop.auth.user';
const AUTH_TOKEN_STORAGE_KEY = 'shop.auth.token';

export const getAuthUser = () => {
  const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveAuthUser = (user) => {
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
};

export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
};

export const saveAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
};

export const setAuthSession = ({ user, token }) => {
  saveAuthUser(user);
  saveAuthToken(token);
};

export const clearAuthUser = () => {
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
};

export const isAuthenticated = () => Boolean(getAuthUser() && getAuthToken());
