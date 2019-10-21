FROM node:10.12-alpine

RUN apk update && apk add git

WORKDIR /application

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . /application

RUN npm rebuild node-sass && yarn build

EXPOSE 8080

CMD ["node", "./index.js"]
