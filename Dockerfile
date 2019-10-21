FROM node:10.12-alpine

RUN apk update && apk add git

WORKDIR /application

COPY package.json yarn.lock ./

RUN npm rebuild node-sass && yarn install

COPY . /application

RUN yarn build

EXPOSE 8080

CMD ["node", "./index.js"]
