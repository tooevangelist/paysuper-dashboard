FROM node:10.12-alpine

RUN mkdir -p /application
COPY . /application
WORKDIR /application

RUN apk update && apk upgrade && apk add git

COPY package.json /application
RUN npm install

ENV NODE_ENV=production

COPY . /application
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000

CMD ["npm", "start"]