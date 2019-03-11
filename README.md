# PayOne web interface
Uses Nuxt.js

## Usage
### Compiles and hot-reloads for development
```
npm run dev
```

You'll need an `.env.local` file:
```
VUE_APP_I18N_FALLBACK_LOCALE=en
VUE_APP_P1AUTH_URL=https://yourhost/auth
VUE_APP_P1PAYAPI_URL=https://yourhost/api
VUE_APP_P1PAYAPI_PROJECT_IDENTIFIER=123123123
```

### Compiles and starts for production
```
npm run build
npm run start
```

# Authentication backend for PayOne


## Dependencies: 
* Node.js v10+
* NPM v6+
* Redis v5+

## Install and run
* `npm install`
* `npm prune --production`
* `NODE_ENV={string=production} AUTH1_CLIENT_ID={string} AUTH1_CLIENT_SCOPE={string="openid,offline"} 
AUTH1_CLIENT_SECRET={string} AUTH1_ISSUER_URL={string} CORS_VALID_ORIGINS={string} POST_MESSAGE_TARGET_ORIGIN={string} 
PUBLIC_HOST={string} REDIS_HOST={string} REDIS_PORT={string} ROUTES_PREFIX={string} SENTRY_DSN={string} SERVER_PORT=80 
SESSION_COOKIE_NAME={string} SESSION_COOKIE_SIGN_KEY={string} SESSION_MAX_AGE={string=21600} node ./index.js`

Where:

*Obligatory params*

{AUTH1_CLIENT_ID} - client id for OAuth2 authentication through Auth1 service

{AUTH1_CLIENT_SCOPE} - required client scope for OAuth2 authentication through Auth1 service

{AUTH1_CLIENT_SECRET} - client secret for OAuth2 authentication through Auth1 service

{AUTH1_ISSUER_URL} - url of Auth1 host 

{CORS_VALID_ORIGINS} - list of valid origins for CORS protection, separated by comma. Notice! Value of * uses by default (disable CORS protection)

{NODE_ENV} - Current environment

{POST_MESSAGE_TARGET_ORIGIN} - target origin for postMessages with results of authorization

{PUBLIC_HOST} - Public host url, for example https://landings.protocol.one

{REDIS_HOST} - Redis host

{REDIS_PORT} - Redis post

{ROUTES_PREFIX} - Common prefix for all routes, use empty string by default

{SENTRY_DSN} - public DSN for Sentry

{SERVER_PORT} - Port of koa http server

{SESSION_COOKIE_NAME} - Name of cookie session

{SESSION_COOKIE_SIGN_KEY} - Key for signing cookie session

{SESSION_MAX_AGE} - session lifetime in seconds


## User Authentication

For make a user login, you must create subscribtion for receiving postMessages in your SPA, and then and open an 
`/login` url in iframe.
All process of authentication will go in that frame, and finally you will be redirected to `/callback` url.

As the result of authentication process you will receive a postMessage from iframe.  
Result will be a json-serialized object with auth token, expire time and error code if it occures.
Actual structure of object you may see in `backend/templates/auth1.postmessage.html.template` file.
Also, targetOrigin of postMessage may be configured in `postMessageTargetOrigin` endpoints option.

Token, that you receive form postMessage, you must store in browser's local storage and  pass as bearer authorization 
header to all requests to your auth-protected API endpoints.

For refresh you must send ajax request to `GET /refresh`, and you will get json response with updated token. 

For logout you must send ajax request to `GET /logout`, this will revoke access and refresh tokens and destroy session.
Logout endpoint send `204 No content` status in case of success, and `500 Internal server error` on other cases 
(if user already logged out, for example, or not logged yet). In most cases you can ignore this error in your SPA

You do not need pass bearer authorization header to refresh and logout endpoints, because they are authorize your 
request by user session cookie. Be sure, that you enable send cookies with this requests in your's framework http 
client!

Also, good idea will be close refresh and logout endpoints with CORS Policy.
