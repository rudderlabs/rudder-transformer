# Rudder Transformer Custom

This is a simplified version of the Rudder Transformer that only handles the `/customTransform` endpoint. It's written in pure JavaScript (no TypeScript) and contains only the code necessary for the `/customTransform` endpoint.

## Structure

- `index.js`: The main entry point that sets up the server and routes
- `middleware.js`: Middleware functions for request size, feature flags, etc.
- `routes.js`: Defines the routes for the `/customTransform` endpoint
- `controllers/transform.js`: Controller for the `/customTransform` endpoint
- `services/transform.js`: Service for transforming events
- `services/piscina/wrapper.js`: Wrapper for Piscina worker thread pool
- `services/piscina/transform.js`: Worker file for Piscina
- `utils/customTransformer.js`: Utility functions for running transformations in an isolated VM

## Installation

```bash
cd new
npm install
```

## Running

```bash
cd new
npm start
```

The server will start on port 9090 by default. You can change the port by setting the `PORT` environment variable.

## Usage

Send a POST request to `/customTransform` with a JSON body containing the events to transform. The server will return the transformed events.

Example:

```bash
curl -X POST -H "Content-Type: application/json" -d '[{"message":{"messageId":"1234","type":"track"},"metadata":{"sourceId":"source1","destinationId":"dest1"},"destination":{"Transformations":[{"VersionID":"v1"}]}}]' http://localhost:9090/customTransform
```

## Environment Variables

- `PORT`: The port to listen on (default: 9090)
- `ISOLATE_VM_MEMORY`: Memory limit for the isolate VM in MB (default: 128)
- `GEOLOCATION_URL`: URL for the geolocation service (optional)
- `GEOLOCATION_TIMEOUT_IN_MS`: Timeout for geolocation requests in milliseconds (default: 1000)
- `CONFIG_BACKEND_URL`: URL for the config backend service (default: 'https://api.rudderlabs.com')
- `HTTPS_PROXY`: HTTPS proxy URL for making requests to the config backend (optional)

### Piscina Configuration

Piscina is a Node.js worker thread pool implementation that can be used to offload CPU-intensive tasks to worker threads. To enable Piscina, set the following environment variables:

- `USE_PISCINA`: Set to `true` to enable Piscina
- `MIN_THREADS`: Minimum number of worker threads (default: 0)
- `MAX_THREADS`: Maximum number of worker threads (default: number of CPU cores)
- `WORKER_IDLE_TIMEOUT`: Idle timeout for worker threads in milliseconds (default: 60000)
- `CONCURRENT_TASKS_PER_WORKER`: Maximum number of concurrent tasks per worker thread (default: 1)

## Authentication

Authentication is implemented using JSON Web Tokens (JWT). To enable authentication, set the following environment variables:

- `AUTH_ENABLED`: Set to `true` to enable authentication
- `JWT_SECRET`: Secret key for JWT verification (default: 'default-secret-key')

When authentication is enabled, clients must include a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Rate Limiting

Rate limiting is implemented using Redis. To enable rate limiting, set the following environment variables:

- `RATE_LIMIT_ENABLED`: Set to `true` to enable rate limiting
- `REDIS_ENABLED`: Set to `true` to enable Redis (required for rate limiting)
- `RATE_LIMIT_DURATION`: Duration in milliseconds for rate limiting window (default: 60000)
- `RATE_LIMIT_MAX`: Maximum number of requests allowed per window (default: 100)
- `RATE_LIMIT_WHITELIST_IPS`: Comma-separated list of IPs to whitelist
- `RATE_LIMIT_BLACKLIST_IPS`: Comma-separated list of IPs to blacklist

## Clustering

Clustering is implemented using Node.js cluster module. To enable clustering, set the following environment variables:

- `CLUSTER_ENABLED`: Set to `true` to enable clustering
- `NUM_PROCS`: Number of worker processes to create (default: number of CPU cores)

## Redis Integration

Redis is used for rate limiting and potentially for caching. To configure Redis, set the following environment variables:

- `REDIS_ENABLED`: Set to `true` to enable Redis
- `REDIS_HOST`: Redis host (default: 'localhost')
- `REDIS_PORT`: Redis port (default: 6379)
- `REDIS_PASSWORD`: Redis password (optional)
- `REDIS_USERNAME`: Redis username (optional)
- `REDIS_MAX_RETRIES`: Maximum number of connection retries (default: 5)
- `REDIS_TIME_AFTER_RETRY_IN_MS`: Time to wait between retries in milliseconds (default: 500)
- `REDIS_EXPIRY_TIME_IN_SEC`: Default expiry time for Redis keys in seconds (default: 3600)

## Notes

This is a simplified version that only handles the `/customTransform` endpoint. It doesn't include all the features of the full Rudder Transformer, such as:

- Comprehensive error handling
- Metrics and monitoring
- Swagger documentation

If you need these features, use the full Rudder Transformer.

## Docker

The application can be run in a Docker container. A Dockerfile is provided in the repository.

### Building the Docker Image

```bash
cd new
docker build -t rudder-transformer-custom .
```

### Running the Docker Container

```bash
docker run -p 9090:9090 rudder-transformer-custom
```

### Using Environment Variables with Docker

You can pass environment variables to the Docker container using the `-e` flag:

```bash
docker run -p 9090:9090 \
  -e PORT=9090 \
  -e AUTH_ENABLED=true \
  -e JWT_SECRET=your-secret-key \
  -e RATE_LIMIT_ENABLED=true \
  -e REDIS_ENABLED=true \
  -e REDIS_HOST=your-redis-host \
  rudder-transformer-custom
```

### Using Docker Compose

You can also use Docker Compose to run the application with Redis:

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "9090:9090"
    environment:
      - PORT=9090
      - AUTH_ENABLED=true
      - JWT_SECRET=your-secret-key
      - RATE_LIMIT_ENABLED=true
      - REDIS_ENABLED=true
      - REDIS_HOST=redis
    depends_on:
      - redis
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

Save this to a file named `docker-compose.yml` and run:

```bash
docker-compose up
```

## TODOs
* Update node version
* Update dependencies in package.json

## Notes

### Performance improvements

* Using isolated-vm v6 with node 24 goes from 4.7k to 5k eps
* If we just share the isolated-vm without doing anything else, the performance is worse
* If we shared the same isolated-vm with piscina, after a while we get an error saying "Isolate is disposed"
* TODO try to recreate the isolate when it has been disposed of
* TODO try to have the piscina worker return a stringify version of the result and avoid cloning
