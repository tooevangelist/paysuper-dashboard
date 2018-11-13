FROM node:10.12-alpine

RUN mkdir -p /application
COPY . /application
WORKDIR /application

RUN apk update && apk upgrade && apk add git

COPY package.json /application
RUN npm rebuild --force
RUN npm install

ENV NODE_ENV=production
ENV P1AUTH_URL=https://auth.tst.protocol.one/api/v1
ENV P1PAYAPI_URL=https://p1payapi.tst.protocol.one
ENV P1PAYAPI_PROJECT_IDENTIFIER=5be2e16701d96d00012d26c3

COPY . /application
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000

CMD ["npm", "start"]