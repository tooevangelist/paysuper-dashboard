import axios from 'axios';

export default {
    create: function (token) {
        return axios.post(`${process.env.apiServerUrl}/s/merchant`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    get: function (token) {
        return axios.get(`${process.env.apiServerUrl}/s/merchant`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    update: function (data, token) {
        return axios.put(`${process.env.apiServerUrl}/s/merchant`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}