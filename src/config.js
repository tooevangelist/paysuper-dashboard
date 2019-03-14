export default {
  ownBackendUrl: process.env.VUE_APP_BACKEND_DOMAIN,
  projectID: process.env.VUE_APP_P1PAYAPI_PROJECT_IDENTIFIER,
  apiUrl: process.env.VUE_APP_P1PAYAPI_URL,
  apiAuthUrl: process.env.VUE_APP_P1AUTH_URL,
  apiUserInfoUrl: `${process.env.VUE_APP_P1AUTH_URL}/oauth2/userinfo`,
};
