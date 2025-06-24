# Environment Variable Override Utilities

This module provides utilities for overriding environment variables in component tests, enabling per-test environment configuration without affecting other tests.

## Usage

```typescript
import { EnvOverride } from './envUtils';

// In your test case
const testCase: ProcessorTestData = {
  id: 'test-with-env-override',
  name: 'my_destination',
  description: 'Test with custom environment configuration',
  envOverrides: {
    API_BASE_URL: 'https://staging.api.com',
    DEBUG_MODE: 'true',
    LEGACY_FEATURE: undefined, // Deletes this env var
  },
  // ... rest of test case
};
```

## Examples

### API Endpoint Override

```typescript
envOverrides: {
  API_ENDPOINT: 'https://staging.api.example.com/v1/events',
  API_ENVIRONMENT: 'staging',
}
```

### Feature Flag Testing

```typescript
envOverrides: {
  DEBUG_MODE: 'true',
  LOG_LEVEL: 'debug',
}
```

### Disabling Features

```typescript
envOverrides: {
  ENABLE_NEW_FEATURE: 'false',
  USE_LEGACY_PROCESSING: 'true',
  FEATURE_FLAG_BATCHING: undefined, // Remove this env var
}
```

## Best Practices

### ✅ DO: Use Dynamic Functions

```typescript
// config.ts - Use functions that read at runtime
export const getApiEndpoint = (): string => process.env.API_ENDPOINT || 'https://default.api.com';

export const isDebugMode = (): boolean => process.env.DEBUG_MODE === 'true';
```

### ❌ DON'T: Use Static Constants

```typescript
// config.ts - Avoid static constants
export const API_ENDPOINT = process.env.API_ENDPOINT || 'https://default.api.com'; // ❌
export const DEBUG_MODE = process.env.DEBUG_MODE === 'true'; // ❌
```

**Why?** Static constants are evaluated at module load time and won't be affected by test overrides.

## Implementation

The system automatically:

1. Takes a snapshot of existing environment variables
2. Applies the overrides for the test
3. Restores the original values after the test
4. Ensures complete test isolation

## Common Environment Variables

- `API_ENDPOINT` / `API_BASE_URL` - Override API endpoints
- `DEBUG_MODE` - Enable debug mode
- `LOG_LEVEL` - Set logging level
- `USE_HAS_DYNAMIC_CONFIG_FLAG` - Control dynamic config processing
- `NODE_ENV` - Set environment (test, development, production)
- `BATCH_SIZE` - Override batch processing settings
