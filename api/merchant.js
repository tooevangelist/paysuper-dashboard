import axios from 'axios';

export default {
  create(data, token) {
    return axios.post(`${process.env.apiServerUrl}/api/v1/s/merchant`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  get(token) {
    return axios.get(`${process.env.apiServerUrl}/api/v1/s/merchant`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  update(data, token) {
    return axios.put(`${process.env.apiServerUrl}/api/v1/s/merchant`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
