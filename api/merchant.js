import axios from 'axios';

export default {
    create: function (data, token) {
        return axios.post(`${process.env.apiServerUrl}/api/v1/s/merchant`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    get: function (token) {
        return axios.get(`${process.env.apiServerUrl}/api/v1/s/merchant`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    update: function (data, token) {
        return axios.put(`${process.env.apiServerUrl}/api/v1/s/merchant`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}