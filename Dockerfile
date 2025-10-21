# syntax=docker/dockerfile:1.4
FROM node:25.0.0-alpine3.21@sha256:1c66cb8e1a58309a1be03f3752bfc4a98aafa9f822e3fb003c5c97f7c2d1edd4 AS base
ENV HUSKY 0

RUN apk update
RUN apk upgrade

RUN apk add --no-cache tini make g++ python3

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

RUN npm ci --ignore-scripts --no-audit --cache .npm && \
npm run prepare

COPY --chown=node:node . .

RUN npm run build:ci -- --sourceMap false && \
npm run copy && \
npm run setup:swagger

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=1s --timeout=30s --retries=30 \
CMD wget --no-verbose --tries=5 --spider http://localhost:9090/health || exit 1

CMD [ "npm", "start" ]

EXPOSE 9090/tcp

FROM base AS prodDepsBuilder

WORKDIR /home/node/app
USER node
COPY --chown=node:node --from=development /home/node/app/package*.json ./

# Install production dependencies with scripts disabled for security
RUN npm ci --ignore-scripts --omit=dev --no-audit --cache .npm && \
npm run prepare && \
npm run clean:node

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

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=1s --timeout=30s --retries=30 \
CMD wget --no-verbose --tries=5 --spider http://localhost:9090/health || exit 1

CMD [ "npm", "start" ]

EXPOSE 9090/tcp
