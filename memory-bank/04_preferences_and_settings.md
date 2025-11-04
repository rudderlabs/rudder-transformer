# Preferences and Settings

## User Preferences

### Code Style

- **Formatting**: Prettier configured with consistent rules
- **Linting**: ESLint with Airbnb style guide
- **TypeScript**: Strict type checking enabled
- **Line Length**: 100 characters maximum
- **Indentation**: 2 spaces
- **Quotes**: Single quotes preferred
- **Semicolons**: Required

### Commit Format

- **Style**: Conventional commits format
- **Scope**: Optional scope in parentheses
- **Body**: Required for non-trivial changes
- **Line Length**: Maximum 100 characters per line
- **Case**: Lowercase for commit messages
- **Types**: feat, fix, docs, style, refactor, perf, test, chore
- **JIRA References**: Optional

### Testing Approach

- **Framework**: Jest
- **Style**: Table-driven tests preferred
- **Coverage**: High coverage expected for new code
- **Mocking**: Jest mocks and mock adapters
- **Test Types**: Unit, component, and integration tests

## System Settings

### Server Configuration

- **PORT**: 9090 (Default API port)
- **METRICS_PORT**: 9091 (Default metrics port)
- **CLUSTER_ENABLED**: true/false (Enable/disable clustering)
- **LOG_LEVEL**: debug/info/warn/error (Logging verbosity)
- **STATS_CLIENT**: prometheus (Metrics collection client)
- **NODE_OPTIONS**: --no-node-snapshot (Node.js runtime options)

### Performance Settings

- **BODY_PARSER_LIMIT**: 200mb (Maximum request body size)
- **MAX_WAIT_SECONDS**: 30000 (Graceful shutdown timeout)
- **FORCE_EXIT**: true (Force exit after graceful shutdown)

### Redis Configuration

- **REDIS_HOST**: Redis server hostname
- **REDIS_PORT**: Redis server port
- **REDIS_PASSWORD**: Redis authentication password
- **REDIS_DB**: Redis database number

### Monitoring Configuration

- **BUGSNAG_API_KEY**: API key for error reporting
- **PYROSCOPE_SERVER_ADDRESS**: Pyroscope server address
- **PYROSCOPE_APPLICATION_NAME**: Application name in Pyroscope

## Environment Variables

The application uses the following environment variables:

```
# Server Configuration
PORT=9090
METRICS_PORT=9091
CLUSTER_ENABLED=true
LOG_LEVEL=info
STATS_CLIENT=prometheus

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Monitoring Configuration
BUGSNAG_API_KEY=
PYROSCOPE_SERVER_ADDRESS=
PYROSCOPE_APPLICATION_NAME=rudder-transformer
```

These environment variables can be set in a `.env` file or directly in the environment.
