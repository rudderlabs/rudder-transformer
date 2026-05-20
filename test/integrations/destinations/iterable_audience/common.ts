import { generateMetadata, generateRecordPayload } from '../../testUtils';

export const destType = 'iterable_audience';

export const destination = {
  ID: 'sample-destination-id',
  Name: 'Iterable Audience',
  DestinationDefinition: {
    DisplayName: 'Iterable Audience',
    ID: 'sample-destination-definition-id',
    Name: 'ITERABLE_AUDIENCE',
    Config: {},
  },
  Config: {
    apiKey: 'test-api-key',
    dataCenter: 'USDC',
  },
  Enabled: true,
  WorkspaceID: 'sample-workspace-id',
  Transformations: [],
  IsProcessorEnabled: true,
};

export const connection = {
  config: {
    destination: {
      audienceId: '12345',
      syncMode: 'mirror',
      projectType: 'hybrid',
      identifierMappings: [{ from: 'email', to: 'email' }],
    },
  },
};

export const insertEvent = {
  message: generateRecordPayload({
    action: 'insert',
    identifiers: { email: 'user@example.com' },
  }),
  metadata: generateMetadata(1),
  destination,
  connection,
};

export const deleteEvent = {
  message: generateRecordPayload({
    action: 'delete',
    identifiers: { email: 'user2@example.com' },
  }),
  metadata: generateMetadata(2),
  destination,
  connection,
};
