# syntax=docker/dockerfile:1.4
FROM node:18.15.0-alpine3.17 AS base
ENV HUSKY 0

RUN apk update
RUN apk upgrade

RUN apk add --no-cache tini make g++ python3

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
CMD wget --no-verbose --tries=5 --spider http://localhost:9090/health || exit 1

CMD [ "npm", "start" ]

EXPOSE 9090/tcp
