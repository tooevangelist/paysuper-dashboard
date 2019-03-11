import cookie from 'js-cookie';

export default {
  methods: {
    setCookies(data) {
      Object.keys(data.data).forEach((key) => {
        if (!data.data[key]) {
          return;
        }

        data.data[key].exp *= 1000;
      });

      const expireAccessToken = new Date();
      const expireRefreshToken = new Date();

      expireAccessToken.setTime(data.data.accessToken.exp);
      expireRefreshToken.setTime(data.data.refreshToken.exp);

      cookie.set('PP_EML_V', data.email);
      cookie.set('PP_ACC_T', data.data.accessToken.value, { expires: expireAccessToken });
      cookie.set('PP_ACC_E', data.data.accessToken.exp, { expires: expireAccessToken });
      cookie.set('PP_RER_T', data.data.refreshToken.value, { expires: expireRefreshToken });
    },
  },
};
