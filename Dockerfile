FROM node:10.12-alpine

RUN apk update && apk add git

WORKDIR /application

COPY package.json /application
RUN npm rebuild --force && npm install

COPY . /application

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
    SERVER_PORT=80 \
    SESSION_COOKIE_NAME="" \
    SESSION_COOKIE_SIGN_KEY="" \
    SESSION_MAX_AGE=21600 \
    P1AUTH_URL='https://auth.tst.protocol.one/api/v1' \
    P1PAYAPI_URL='https://p1payapi.tst.protocol.one' \
    P1PAYAPI_PROJECT_IDENTIFIER='5be2e16701d96d00012d26c3'

RUN npm run build

EXPOSE 80

CMD ["node", "./index.js"]
