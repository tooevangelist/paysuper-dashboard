const path = require('path');

const envUtils = require('../app/utils/env');

const { getEnvVariable } = envUtils;
const { getEnvVariableArray } = envUtils;

const config = {
  serverPort: +getEnvVariable('SERVER_PORT', 8080),

  redisHost: getEnvVariable('REDIS_HOST', ''),
  redisPort: +getEnvVariable('REDIS_PORT', '6379'),

  sessionMaxAge: +getEnvVariable('SESSION_MAX_AGE', '21600'), // 6 hours, in seconds
  sessionCookieName: getEnvVariable('SESSION_COOKIE_NAME', 'pssid'),
  sessionCookieSignKey: getEnvVariable('SESSION_COOKIE_SIGN_KEY', '02e435ef-7015-4c9b-8e4e-00a376f80332'),

  routesPrefix: getEnvVariable('ROUTES_PREFIX', ''),
  auth1RoutesNamespace: '/auth1',

  sentryDsn: getEnvVariable('SENTRY_DSN', 'https://2fc1a112904e472da22284cad12c6d87@sentry.tst.protocol.one/10'),

  publicHost: getEnvVariable('PUBLIC_HOST', 'https://paysupermgmt.tst.protocol.one'),

  postMessageTargetOrigin: getEnvVariable('POST_MESSAGE_TARGET_ORIGIN', 'https://paysupermgmt.tst.protocol.one'),

  auth1ClientId: getEnvVariable('AUTH1_CLIENT_ID', '5c88be64ebe80e0001ed2e3e'),
  auth1ClientSecret: getEnvVariable('AUTH1_CLIENT_SECRET', '6LBSHzkJVWOLiU7iCpbffpE3fcyIrqoyeCfgpDqiMPhnQwW7KFqtalsrsVyLP3Ee'),
  auth1Scope: getEnvVariableArray('AUTH1_CLIENT_SCOPE', 'openid,offline'),
  auth1Issuer: getEnvVariable('AUTH1_ISSUER_URL', 'https://dev-auth1.tst.protocol.one'),
  auth1PostmessageHtmlTemplatePath: path.resolve('backend/templates/auth1.postmessage.html.template'),
  auth1SessionNamespace: 'auth1',

  corsValidOrigins: getEnvVariableArray('CORS_VALID_ORIGINS', 'http://localhost:3030'),
};

module.exports = config;
