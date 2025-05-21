# syntax=docker/dockerfile:1.4
FROM node:20.18.3-alpine3.21 AS base
ENV HUSKY 0

RUN apk update
RUN apk upgrade

RUN apk add --no-cache tini make g++ python3 bash linux-tools perf

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

FROM base AS development
ENV HUSKY 0

ARG version
ARG GIT_COMMIT_SHA
ENV transformer_build_version=$version
ENV git_commit_sha=$GIT_COMMIT_SHA

# Create app directory
WORKDIR /home/node/app
RUN chown -R node:node /home/node/app
USER node

COPY package*.json ./
COPY scripts/skipPrepareScript.js ./scripts/skipPrepareScript.js
COPY scripts/start-service.sh ./start-service.sh
RUN npm ci --no-audit --cache .npm
COPY --chown=node:node . .
RUN npm run build:ci -- --sourceMap false
RUN npm run copy
RUN npm run setup:swagger

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=1s --timeout=30s --retries=30 \
    CMD wget --no-verbose --tries=5 --spider http://localhost:9090/health || exit 1

CMD [ "./start-service.sh" ]

EXPOSE 9090/tcp

FROM base AS prodDepsBuilder

WORKDIR /home/node/app
USER node
COPY --chown=node:node --from=development /home/node/app/package*.json ./
COPY --chown=node:node --from=development /home/node/app/scripts/skipPrepareScript.js ./scripts/skipPrepareScript.js
COPY --chown=node:node --from=development /home/node/app/start-service.sh ./start-service.sh

ENV SKIP_PREPARE_SCRIPT='true'

RUN npm ci --omit=dev --no-audit --cache .npm
RUN npm run clean:node

FROM base as production
ENV HUSKY 0

ARG version
ARG GIT_COMMIT_SHA
ENV transformer_build_version=$version
ENV git_commit_sha=$GIT_COMMIT_SHA

WORKDIR /home/node/app

USER node

COPY --chown=node:node --from=prodDepsBuilder /home/node/app/package.json ./

COPY --chown=node:node --from=prodDepsBuilder /home/node/app/node_modules ./node_modules

COPY --chown=node:node --from=development /home/node/app/dist/ ./dist

COPY --chown=node:node --from=development /home/node/app/start-service.sh ./start-service.sh

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=1s --timeout=30s --retries=30 \
    CMD wget --no-verbose --tries=5 --spider http://localhost:9090/health || exit 1

CMD [ "./start-service.sh" ]

EXPOSE 9090/tcp
