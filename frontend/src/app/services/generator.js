import api from './axiosInstance';

const baseUrl = '/api/generator';

const add = async (requestObject) => {
  const response = await api.post(baseUrl, requestObject);
  return response.data;
};

export default { add };