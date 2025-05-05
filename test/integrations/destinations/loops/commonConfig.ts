import { Destination, Metadata } from '../../../../src/types';
import { authHeader1, secret1 } from './maskedSecrets';
import { generateMetadata } from '../../testUtils';

export const destination: Destination = {
  ID: 'loops-destination-id',
  Name: 'LOOPS',
  DestinationDefinition: {
    ID: '123',
    Name: 'LOOPS',
    DisplayName: 'Loops',
    Config: {
      cdkV2Enabled: true,
    },
  },
  Config: {
    apiKey: secret1,
  },
  Enabled: true,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};

export const metadata: Metadata = generateMetadata(1);

export const headers = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
};
