FROM nikolaik/python-nodejs:python3.5-nodejs12

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9090
CMD [ "npm", "start" ]
