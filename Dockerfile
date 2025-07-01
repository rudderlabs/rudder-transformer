# syntax=docker/dockerfile:1.4
FROM ubuntu:22.04 AS base
ENV DEBIAN_FRONTEND=noninteractive
ENV HUSKY=0

# copy healthcheck script and make it executable
COPY healthcheck.sh /usr/local/bin/healthcheck.sh

# install prerequisites and Node.js 20.x (ensuring same 20.19.2 runtime)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    build-essential curl gnupg2 python3 python3-pip \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/* \
    && chmod +x /usr/local/bin/healthcheck.sh \
    && groupadd -r node \
    && useradd -r -g node -d /home/node node \
    && mkdir -p /home/node/app/node_modules \
    && chown -R node:node /home/node/app

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
RUN npm ci --no-audit --cache .npm
COPY --chown=node:node . .
RUN npm run build:ci -- --sourceMap false
RUN npm run copy
RUN npm run setup:swagger

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=1s --timeout=30s --retries=30 \
    CMD ["/usr/local/bin/healthcheck.sh"]

CMD [ "npm", "start" ]

EXPOSE 9090/tcp

FROM base AS PRODDEPSBUILDER

WORKDIR /home/node/app
USER node
COPY --chown=node:node --from=development /home/node/app/package*.json ./
COPY --chown=node:node --from=development /home/node/app/scripts/skipPrepareScript.js ./scripts/skipPrepareScript.js

ENV SKIP_PREPARE_SCRIPT='true'

RUN npm ci --omit=dev --no-audit --cache .npm
RUN npm run clean:node

FROM base AS production
ENV HUSKY 0

ARG version
ARG GIT_COMMIT_SHA
ENV transformer_build_version=$version
ENV git_commit_sha=$GIT_COMMIT_SHA

WORKDIR /home/node/app

USER node

COPY --chown=node:node --from=PRODDEPSBUILDER /home/node/app/package.json ./

COPY --chown=node:node --from=PRODDEPSBUILDER /home/node/app/node_modules ./node_modules

COPY --chown=node:node --from=development /home/node/app/dist/ ./dist

ENTRYPOINT ["/sbin/tini", "--"]

HEALTHCHECK --interval=1s --timeout=30s --retries=30 \
    CMD ["/usr/local/bin/healthcheck.sh"]

CMD [ "npm", "start" ]

EXPOSE 9090/tcp
