const path = require('path');

const envUtils = require('../app/utils/env');

const getEnvVariable = envUtils.getEnvVariable;
const getEnvVariableArray = envUtils.getEnvVariableArray;

const config = {
  serverPort: +getEnvVariable('SERVER_PORT', 80),

  redisHost: getEnvVariable('REDIS_HOST', 'localhost'),
  redisPort: +getEnvVariable('REDIS_PORT', '6379'),

  sessionCookieName: getEnvVariable('SESSION_COOKIE_NAME', 'ptahsid'),
  sessionCookieSignKey: getEnvVariable('SESSION_COOKIE_SIGN_KEY', '3a610fe5-fd7f-41a3-89ba-e7c8c9bcd1d1'),

  routesPrefix: getEnvVariable('ROUTES_PREFIX', ''),
  auth1RoutesNamespace: '/auth1',

  sentryDsn: getEnvVariable('SENTRY_DSN', 'https://0c02631c9b4645699161cffa21721ef4@sentry.tst.protocol.one/9'),

  publicHost: getEnvVariable('PUBLIC_HOST', 'http://127.0.0.1'),

  postMessageTargetOrigin: getEnvVariable('POST_MESSAGE_TARGET_ORIGIN', 'http://127.0.0.1:3000'),

  ptahApiHostUrl: getEnvVariable('PTAH_API_HOST_URL', 'https://ptahapi.tst.protocol.one'),

  auth1ClientId: getEnvVariable('AUTH1_CLIENT_ID', '5c6fc4888db4bc0001beacec'),
  auth1ClientSecret: getEnvVariable('AUTH1_CLIENT_SECRET', 'RUOuk4bkWFNljuZzqwq5zrs0GdCLY9U3MJqubuDViUv7XQzgiU84y288Jh0klK1Z'),
  auth1Scope: getEnvVariableArray('AUTH1_CLIENT_SCOPE', 'openid,offline'),
  auth1AuthorizeUrl: getEnvVariable('AUTH1_AUTHORIZE_URL', 'https://oauth.tst.protocol.one/oauth2/auth'),
  auth1TokenUrl: getEnvVariable('AUTH1_TOKEN_URL', 'https://oauth.tst.protocol.one/oauth2/token'),
  auth1RevokeTokenUrl: getEnvVariable('AUTH1_REVOKE_TOKEN_URL', 'https://oauth.tst.protocol.one/oauth2/revoke'),
  auth1UserinfoUrl: getEnvVariable('AUTH1_USERINFO_URL', 'https://oauth.tst.protocol.one/userinfo'),
  auth1PostmessageHtmlTemplatePath: path.resolve('backend/templates/auth1.postmessage.html.template'),
  auth1SessionNamespace: 'auth1',

  corsValidOrigins: getEnvVariableArray('CORS_VALID_ORIGINS', 'http://127.0.0.1:3000'),

};

module.exports = config;
