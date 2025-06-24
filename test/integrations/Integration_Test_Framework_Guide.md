# Integration Test Framework

Simple integration testing for Rudder Transformer destinations.

## Quick Start

```bash
# Run integration tests
npm run test:integration
```

This will:
1. Start the transformer service
2. Test processor and router endpoints  
3. Test environment variable overrides
4. Stop the service

## Implementation

The integration test is implemented in `test/integrations/destinations/rudder_test/integration.ts` - a simple 180-line file that covers all the essential testing needs.

## Adding Integration Tests for Other Destinations

Copy the rudder_test integration.ts file and modify the test payloads for your destination.

That's it! Simple, effective integration testing without the complexity. 