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

See `test/integrations/destinations/rudder_test/processor/envOverrideExamples.ts` for complete working examples.

### API Endpoint Override

```typescript
envOverrides: {
  RUDDER_TEST_API_ENDPOINT: 'https://staging.rudderstack.com/v1/record',
}
```

### Debug Mode Override

```typescript
envOverrides: {
  RUDDER_TEST_DEBUG: 'true',
}
```

### System Flag Override

```typescript
envOverrides: {
  USE_HAS_DYNAMIC_CONFIG_FLAG: 'false', // Force legacy behavior
}
```

### Multiple Environment Variables

```typescript
envOverrides: {
  RUDDER_TEST_API_ENDPOINT: 'https://multi-env.example.com/api',
  RUDDER_TEST_DEBUG: 'true',
  LOG_LEVEL: 'debug',
  BATCH_SIZE: '50',
  FEATURE_ENHANCED_PROCESSING: undefined, // Delete this env var
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
