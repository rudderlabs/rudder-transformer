FROM node:10.16.0-alpine

RUN apk add --no-cache tini python make g++
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Create app directory
WORKDIR /home/node/app
USER node

ADD . /home/node/app
RUN npm install
RUN npm run buildTest

COPY --chown=node:node . .

ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "npm", "start" ]
