import axios from 'axios';

export default {
    login: function (data) {
        return axios.post(`${process.env.authServerUrl}/user/login`, data);
    },
    register: function (data) {
        return axios.post(`${process.env.authServerUrl}/user/create`, data);
    },
    refresh: function (token) {
        return axios.get(`${process.env.authServerUrl}/token/refresh/?token=${token}`);
    }
}