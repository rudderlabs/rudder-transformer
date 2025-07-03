#!/usr/bin/env ts-node

import { createIntegrationTestCLI } from '../../../baseIntegrationTest';
import { RudderTransformerIntegrationTest, DEFAULT_LOAD_TEST_CONFIGS } from './integrationTest';
import { RUDDER_TEST_SCENARIOS } from './dataGenerator';

// Create CLI using common utilities
const program = createIntegrationTestCLI(
  RUDDER_TEST_SCENARIOS,
  DEFAULT_LOAD_TEST_CONFIGS,
  RudderTransformerIntegrationTest,
);

program
  .name('rudder-integration-test')
  .description('Integration tests for Rudder Transformer using real service instance')
  .version('1.0.0');

if (require.main === module) {
  program.parse();
}
