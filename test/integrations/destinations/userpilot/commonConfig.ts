import { Destination } from '../../../../src/types';
import { secret1, authHeader1 } from './maskedSecrets';

export const destination: Destination = {
  ID: 'userpilot-destination-id',
  Name: 'Userpilot',
  DestinationDefinition: {
    ID: '123',
    Name: 'USERPILOT',
    DisplayName: 'userpilot',
    Config: {
      cdkV2Enabled: true,
    },
  },
  Config: {
    apiKey: secret1,
    apiEndpoint: 'https://analytex.userpilot.io',
  },
  Enabled: true,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};

export const commonHeaders = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
  'X-API-Version': '2020-09-22',
};

export const endpoints = {
  IDENTIFY: 'https://analytex.userpilot.io/v1/identify',
  TRACK: 'https://analytex.userpilot.io/v1/track',
  GROUP: 'https://analytex.userpilot.io/v1/companies/identify',
};
