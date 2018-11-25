FROM node:10.12-alpine

RUN apk update && apk add git

WORKDIR /application

COPY package.json /application
RUN npm rebuild --force && npm install

COPY . /application

ENV NODE_ENV=production
ENV P1AUTH_URL=https://auth.tst.protocol.one/api/v1
ENV P1PAYAPI_URL=https://p1payapi.tst.protocol.one
ENV P1PAYAPI_PROJECT_IDENTIFIER=5be2e16701d96d00012d26c3

RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000

CMD ["npm", "start"]