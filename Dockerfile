FROM node:10.12-alpine

RUN apk update && apk add git

WORKDIR /application

ENV NODE_ENV=production \
    AUTH1_CLIENT_ID="" \
    AUTH1_CLIENT_SCOPE="openid,offline" \
    AUTH1_CLIENT_SECRET="" \
    AUTH1_ISSUER_URL="" \
    CORS_VALID_ORIGINS="" \
    POST_MESSAGE_TARGET_ORIGIN="" \
    PUBLIC_HOST="" \
    REDIS_HOST="" \
    REDIS_PORT="" \
    ROUTES_PREFIX="" \
    SENTRY_DSN="" \
    SERVER_PORT=8080 \
    SESSION_COOKIE_NAME="" \
    SESSION_COOKIE_SIGN_KEY="" \
    SESSION_MAX_AGE=21600 \
    P1AUTH_URL="" \
    P1PAYAPI_URL="" \
    P1PAYAPI_PROJECT_IDENTIFIER=""

COPY package.json /application
RUN npm rebuild --force && npm install && npm run build && npm prune --production

COPY . /application

EXPOSE 8080

CMD ["node", "./index.js"]
