# syntax=docker/dockerfile:1.4
FROM node:14.21.1-alpine3.15

RUN apk update
RUN apk upgrade

# installing specific python version based on your previous configuration
RUN apk add --no-cache tini python2

# installing specific make version based on your previous configuration
RUN apk add make=4.2.1-r2 --repository=http://dl-cdn.alpinelinux.org/alpine/v3.11/main

# installing specific gcc version based on your previous configuration
RUN apk add g++=9.3.0-r0 --repository=http://dl-cdn.alpinelinux.org/alpine/v3.11/main

# RUN apk add --no-cache tini python make g++
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Create app directory
WORKDIR /home/node/app
USER node

ARG version
ARG GIT_COMMIT_SHA
ENV transformer_build_version=$version
ENV git_commit_sha=$GIT_COMMIT_SHA
COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=1s --timeout=30s --retries=30 \
    CMD  wget --no-verbose --tries=5 --spider http://localhost:9090/health || exit 1

CMD [ "npm", "start" ]

EXPOSE 9090/tcp
