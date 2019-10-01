FROM node:10.16.0-alpine

RUN apk add python make g++

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9090
CMD [ "npm", "start" ]
