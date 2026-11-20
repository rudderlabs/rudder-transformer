# The Integration Audit agent's environment: Node (same version as .nvmrc), the Cursor CLI and the audit tools.
# The workflow runs it locked down (read-only, non-root, no capabilities); see integrations_audit.yml.
# Build context: this folder. The bookworm image (not slim) keeps curl and git for the agent's shell.
FROM node:22.23.4-bookworm@sha256:7702d8aa4d5910871692af4480eb3ba86f23047a6417a44d857d06c95d060d3f

# Cursor ships the CLI only as tarballs, so Dependabot can't update it. To bump: take the version from
# https://cursor.com/install, and both checksums from <tarball url>.sha256 for linux/x64 and linux/arm64.
ARG CURSOR_CLI_VERSION=2026.11.19-f005e9d
ARG CURSOR_CLI_SHA256_X64=a25986eaf0c9330aeeec599a139711cb9f267c64562d073a72b751edf5161695
ARG CURSOR_CLI_SHA256_ARM64=5ff05be0d7c0b7754574dbcd677c35254a3ff190ed6457e71bbee0f276237e29
ARG TARGETARCH

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN set -eu; \
    case "$TARGETARCH" in \
      amd64) arch=x64; sum="$CURSOR_CLI_SHA256_X64" ;; \
      arm64) arch=arm64; sum="$CURSOR_CLI_SHA256_ARM64" ;; \
      *) echo "Unsupported architecture $TARGETARCH" >&2; exit 1 ;; \
    esac; \
    curl -fsSL "https://downloads.cursor.com/lab/$CURSOR_CLI_VERSION/linux/$arch/agent-cli-package.tar.gz" -o /tmp/cursor-cli.tgz; \
    echo "$sum  /tmp/cursor-cli.tgz" | sha256sum -c -; \
    mkdir -p /opt/cursor-cli; \
    tar --strip-components=1 -xzf /tmp/cursor-cli.tgz -C /opt/cursor-cli; \
    rm /tmp/cursor-cli.tgz; \
    ln -s /opt/cursor-cli/cursor-agent /usr/local/bin/cursor-agent

# tsx and @linear/sdk from the audit lockfile, without install scripts.
COPY package.json package-lock.json /opt/audit-tools/
RUN npm ci --prefix /opt/audit-tools --ignore-scripts --no-audit --no-fund

# Installed as root above, so the agent (user node) can't change its own tools. Only cursor-agent is
# linked onto PATH: the CLI folder bundles its own node, which must not replace the image's.
ENV PATH=/opt/audit-tools/node_modules/.bin:$PATH
USER node
WORKDIR /repo
