import axios from 'axios';

export default {
  create(data, token) {
    return axios.post(`${process.env.VUE_APP_P1PAYAPI_URL}/api/v1/s/merchant`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  get(token) {
    return axios.get(`${process.env.VUE_APP_P1PAYAPI_URL}/api/v1/s/merchant`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  update(data, token) {
    return axios.put(`${process.env.VUE_APP_P1PAYAPI_URL}/api/v1/s/merchant`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
