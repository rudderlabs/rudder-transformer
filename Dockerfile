FROM node:10.16.0-alpine

RUN apk add --no-cache tini python make g++
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Create app directory
WORKDIR /home/node/app
USER node

COPY package*.json ./
RUN npm install

COPY --chown=node:node . .

ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "npm", "start" ]
