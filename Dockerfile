FROM node:10.16.0-alpine

RUN apk add python make g++

# Create app directory
WORKDIR /app

COPY package*.json ./
COPY build.js ./

RUN npm install --unsafe-perm

COPY . .

CMD [ "npm", "start" ]
