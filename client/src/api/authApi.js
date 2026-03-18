import api from './axiosInstance';

export const registerRequest = async (payload) => {
  const response = await api.post('/auth/register', payload);
  return response.data.data;
};

export const loginRequest = async (payload) => {
  const response = await api.post('/auth/login', payload);
  return response.data.data;
};

export const getProfileRequest = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};

export const refreshTokenRequest = async () => {
  const response = await api.post('/auth/refresh');
  return response.data.data;
};

export const logoutRequest = async () => {
  await api.post('/auth/logout');
};
