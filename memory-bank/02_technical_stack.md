# Technical Stack

## Languages

- **TypeScript** - Primary language for development
- **JavaScript** - Used for some components and legacy code
- **Go** - Used only for internal testing purposes to expose test data to other services, not for any customer-facing functionality

## Frameworks

- **Koa.js** - Web framework for building the API layer
- **Jest** - Testing framework for unit and integration tests

## Libraries

### Core Libraries

- **axios** - HTTP client for making API requests
- **lodash** - Utility functions for data manipulation
- **ioredis** - Redis client for caching and temporary storage
- **prom-client** - Prometheus metrics collection
- **zod** - Schema validation
- **isolated-vm** - Sandboxed JavaScript execution for user transformations

### RudderStack Libraries

- **@rudderstack/integrations-lib** - Common integration utilities
- **@rudderstack/json-template-engine** - JSON templating for transformations
- **@rudderstack/workflow-engine** - Workflow management

### Data Processing

- **flat** - Flatten/unflatten nested objects
- **json-size** - Calculate JSON object size
- **crypto-js** - Cryptographic functions
- **ajv** - JSON Schema validation

### Utilities

- **moment** - Date and time manipulation
- **uuid** - Generate UUIDs
- **validator** - String validation utilities
- **node-cache** - In-memory caching

## Tools

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitizen** - Standardized commit messages
- **TypeScript** - Static type checking

### Build and Deployment

- **Docker** - Containerization
- **npm** - Package management
- **standard-version** - Version management

### Testing and Quality

- **Jest** - Unit and integration testing
- **Supertest** - API testing
- **Allure** - Test reporting

### Monitoring and Observability

- **Prometheus** - Metrics collection
- **Pyroscope** - Profiling
- **Winston** - Logging
- **Bugsnag** - Error tracking

### Documentation

- **Swagger** - API documentation
- **Koa2-swagger-ui** - Swagger UI integration
