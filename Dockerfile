FROM node:10.12-alpine

RUN apk update && apk add git

WORKDIR /application

COPY package.json /application

RUN npm rebuild --force && npm install && npm run build && npm prune --production

COPY . /application

EXPOSE 8080

CMD ["node", "./index.js"]
