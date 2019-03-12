FROM node:10.12-alpine

RUN apk update && apk add git

WORKDIR /application

COPY . /application

RUN npm rebuild --force && npm install && npm run build && npm prune --production

EXPOSE 8080

CMD ["node", "./index.js"]
