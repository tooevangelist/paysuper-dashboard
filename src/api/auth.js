import axios from 'axios';

export default {
  login(data) {
    return axios.post(`${process.env.VUE_APP_P1AUTH_URL}/user/login`, data);
  },
  register(data) {
    return axios.post(`${process.env.VUE_APP_P1AUTH_URL}/user/create/`, data);
  },
  refresh(token) {
    return axios.get(`${process.env.VUE_APP_P1AUTH_URL}/token/refresh/?token=${token}`);
  },
};
