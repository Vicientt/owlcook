import api from './axiosInstance';

const me = async () => {
  const response = await api.get('/api/me');
  return response.data;
};

const logout = async () => {
  const response = await api.post('/api/logout');
  return response.data;
};

export default { me, logout };
