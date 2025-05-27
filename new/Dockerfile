FROM node:24-alpine

RUN apk update
RUN apk upgrade
RUN apk add --no-cache  python3 make g++

# Set environment variables
ENV NODE_ENV=production \
    PORT=9090

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    # Clean npm cache to reduce image size
    npm cache clean --force

# Copy application code
COPY . .

# Create a non-root user and switch to it
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

USER appuser

# Expose the port the app runs on
EXPOSE 9090

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:9090/health || exit 1

# Add metadata labels
LABEL org.opencontainers.image.title="Rudder Transformer Custom" \
      org.opencontainers.image.description="Simplified version of rudder-transformer for /customTransform endpoint" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.vendor="RudderStack"

# Command to run the application
CMD ["node", "index.js"]
