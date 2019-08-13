FROM node:10.16.0-alpine

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9292
CMD [ "npm", "run", "start-ut" ]
