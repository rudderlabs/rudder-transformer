/**
 * Common configuration for rudder_test destination tests
 */

import { Destination } from '../../../../src/types';
import { generateMetadata } from '../../testUtils';

// Common destination configuration for tests
export const destination: Destination = {
  ID: 'rudder-platform-destination-id',
  Name: 'rudder_test',
  DestinationDefinition: {
    ID: 'rudder-platform-definition-id',
    Name: 'RUDDER_TEST',
    DisplayName: 'Rudder Platform',
    Config: {
      cdkV2Enabled: false,
    },
  },
  Config: {
    testField: 'test-value',
    enableBatching: 'false',
  },
  Enabled: true,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};

// Common metadata for tests
export const metadata = generateMetadata(1);

// Common headers for tests
export const headers = {
  'Content-Type': 'application/json',
};
