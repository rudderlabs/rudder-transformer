# syntax=docker/dockerfile:1.4
FROM node:14.21.1-alpine3.15 AS base

RUN apk update
RUN apk upgrade

# installing specific python version based on your previous configuration
RUN apk add --no-cache tini python2
# installing specific make version based on your previous configuration
RUN apk add make=4.2.1-r2 --repository=http://dl-cdn.alpinelinux.org/alpine/v3.11/main
# installing specific gcc version based on your previous configuration
RUN apk add g++=9.3.0-r0 --repository=http://dl-cdn.alpinelinux.org/alpine/v3.11/main

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

FROM base AS development

ARG version
ARG GIT_COMMIT_SHA
ENV transformer_build_version=$version
ENV git_commit_sha=$GIT_COMMIT_SHA

# Create app directory
WORKDIR /home/node/app
ADD . .
RUN chown -R node:node /home/node/app
USER node

RUN npm ci
RUN npm run build

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=1s --timeout=30s --retries=30 \
CMD  wget --no-verbose --tries=5 --spider http://localhost:9090/health || exit 1

CMD [ "npm", "start" ]

EXPOSE 9090/tcp

FROM base AS prodbuilder

WORKDIR /home/node/app
USER node
COPY --chown=node:node --from=development /home/node/app/package.json   ./

RUN npm install --production

FROM base as production

ARG version
ARG GIT_COMMIT_SHA
ENV transformer_build_version=$version
ENV git_commit_sha=$GIT_COMMIT_SHA

WORKDIR /home/node/app

USER node

COPY --chown=node:node --from=development /home/node/app/dist/  ./dist
COPY --chown=node:node --from=prodBuilder /home/node/app/package.json   ./
COPY --chown=node:node --from=prodBuilder /home/node/app/node_modules   ./node_modules

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=1s --timeout=30s --retries=30 \
CMD  wget --no-verbose --tries=5 --spider http://localhost:9090/health || exit 1

CMD [ "npm", "start" ]

EXPOSE 9090/tcp
