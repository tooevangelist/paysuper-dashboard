import cookie from 'js-cookie';

export default {
    methods: {
        setCookies: function (data) {
            for (let key in data.data) {
                if (!data.data.hasOwnProperty(key)) {
                    continue;
                }

                data.data[key].exp = data.data[key].exp * 1000;
            }

            let expireAccessToken = new Date();
            let expireRefreshToken = new Date();

            expireAccessToken.setTime(data.data['accessToken']['exp']);
            expireRefreshToken.setTime(data.data['refreshToken']['exp']);

            cookie.set('PP_EML_V', data['email']);
            cookie.set('PP_ACC_T', data.data['accessToken'].value, { expires: expireAccessToken });
            cookie.set('PP_ACC_E', data.data['accessToken'].exp, { expires: expireAccessToken });
            cookie.set('PP_RER_T', data.data['refreshToken'].value, { expires: expireRefreshToken });
        }
    }
};