import axios from 'axios';

export default {
  login(data) {
    return axios.post(`${process.env.authServerUrl}/user/login`, data);
  },
  register(data) {
    return axios.post(`${process.env.authServerUrl}/user/create/`, data);
  },
  refresh(token) {
    return axios.get(`${process.env.authServerUrl}/token/refresh/?token=${token}`);
  },
};
