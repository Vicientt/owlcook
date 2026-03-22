import api, { setToken } from './axiosInstance';

const baseUrl = '/api/users';

const register = async (credentials) => {
  const response = await api.post(baseUrl, credentials);
  return response.data;
};

const update = async (credentials) => {
  const response = await api.put(baseUrl, credentials);
  return response.data;
};

export default { register, setToken, update };