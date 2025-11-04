# Code Structure

## Directory Layout

```
rudder-transformer/
├── src/                    # Main source code directory
│   ├── adapters/           # Adapters for external services and network handling
│   ├── cdk/                # Component Development Kit for building integrations
│   ├── constants/          # Constant values used throughout the application
│   ├── controllers/        # API controllers that handle HTTP requests
│   ├── helpers/            # Helper functions and utilities
│   ├── interfaces/         # TypeScript interfaces and type definitions
│   ├── middlewares/        # Koa middleware functions
│   ├── routes/             # API route definitions
│   ├── services/           # Core business logic services
│   ├── sources/            # Source integrations for importing data
│   ├── types/              # Global type definitions
│   ├── util/               # Utility functions and helpers
│   ├── v0/                 # Legacy version of transformations
│   ├── v1/                 # Current version of transformations
│   └── warehouse/          # Warehouse-specific transformations
├── test/                   # Test files and utilities
├── swagger/                # API documentation
└── scripts/                # Utility scripts for development and deployment
```

### Key Directories Explained

#### `src/adapters/`

Contains adapters for external services, including network handling for API requests.

#### `src/cdk/`

Component Development Kit provides a framework for building new integrations in a standardized way.

#### `src/controllers/`

API controllers that handle HTTP requests and coordinate the business logic.

#### `src/routes/`

Defines the API routes and connects them to the appropriate controllers.

#### `src/services/`

Contains the core business logic services that implement the transformation functionality.

#### `src/sources/`

Implementations for source integrations that import data from external systems.

#### `src/v0/` and `src/v1/`

Different versions of the transformation logic, with v1 being the current version.

#### `src/warehouse/`

Specialized transformations for data warehouse destinations.

## Naming Conventions

### Files and Directories

- **File Names**: Use kebab-case for file names (e.g., `network-handler.ts`)
- **Directory Names**: Use camelCase for directory names (e.g., `networkHandler`)
- **Test Files**: Append `.test.ts` to test files (e.g., `utils.test.ts`)

### Code Elements

- **Classes**: Use PascalCase for class names (e.g., `BaseStrategy`)
- **Interfaces**: Use PascalCase for interface names, often prefixed with `I` (e.g., `IEventPayload`)
- **Types**: Use PascalCase for type definitions (e.g., `EventType`)
- **Variables and Functions**: Use camelCase (e.g., `handleResponse`)
- **Constants**: Use UPPER_SNAKE_CASE for constants (e.g., `MAX_BATCH_SIZE`)

### Component Naming

- **Controllers**: Suffix with `Controller` (e.g., `DestinationController`)
- **Services**: Suffix with `Service` (e.g., `IntegrationService`)
- **Middleware**: Suffix with `Middleware` (e.g., `AuthMiddleware`)
- **Utilities**: Descriptive names without specific suffix (e.g., `networkUtils`)

## Modular Organization

The codebase is organized into modules based on functionality:

### Core Modules

- **Controllers**: Handle HTTP requests and coordinate business logic
- **Services**: Implement core business logic
- **Routes**: Define API endpoints

### Integration Modules

- **Sources**: Implement source integrations
- **Destinations**: Implement destination integrations
- **Warehouse**: Implement warehouse integrations

### Utility Modules

- **Helpers**: Provide helper functions for specific domains
- **Utils**: Provide general utility functions
- **Constants**: Define constant values

### Infrastructure Modules

- **Adapters**: Provide interfaces to external systems
- **Middlewares**: Implement request processing middleware

## Destination Integration Structure

Each destination integration typically follows this structure:

```
destinations/
└── example-destination/
    ├── config.ts              # Configuration constants
    ├── index.ts               # Main entry point
    ├── networkHandler.ts      # Network request handling
    ├── types.ts               # Type definitions
    ├── utils.ts               # Utility functions
    └── strategies/            # Transformation strategies
        ├── base.ts            # Base strategy class
        ├── track-identify.ts  # Strategy for track/identify events
        └── generic.ts         # Generic fallback strategy
```

### Key Files in a Destination

#### `config.ts`

Contains configuration constants specific to the destination.

```typescript
export const MAX_BATCH_SIZE = 100;
export const API_VERSION = 'v1';
export const BULK_ENDPOINTS = ['events/track/bulk', 'users/update/bulk'];
```

#### `networkHandler.ts`

Handles network requests to the destination API.

```typescript
function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}
```

#### `types.ts`

Defines TypeScript interfaces and types for the destination.

```typescript
export type DestinationResponse = {
  status: number;
  response: {
    msg?: string;
    code?: string;
    params?: Record<string, unknown>;
  };
};
```

#### Strategy Pattern

Destinations often use the strategy pattern to handle different types of events:

```typescript
// Base strategy
abstract class BaseStrategy {
  abstract handleSuccess(responseParams: any): void;
  abstract handleError(responseParams: any): void;
}

// Specific strategy
class TrackIdentifyStrategy extends BaseStrategy {
  handleSuccess(responseParams: any): void {
    // Implementation
  }

  handleError(responseParams: any): void {
    // Implementation
  }
}
```
