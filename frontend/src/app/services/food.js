import api from './axiosInstance';

const baseUrl = '/api/food';

const getAll = async () => {
  const response = await api.get(baseUrl);
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`${baseUrl}/${id}`);
  return response.data;
};

const update = async (id, foodObject) => {
  const response = await api.put(`${baseUrl}/${id}`, foodObject);
  return response.data;
};

const create = async (newObject) => {
  const response = await api.post(baseUrl, newObject);
  return response.data;
};

const remove = async (id) => {
  const response = await api.delete(`${baseUrl}/${id}`);
  return response.data;
};

export default { getAll, update, create, remove, getById };