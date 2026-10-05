import type { Destination, Metadata } from '../../../../src/types';

export const endpoint = 'https://s2s.mparticle.com/v2/bulkevents';
export const headers = {
  'Content-Type': 'application/json',
  Authorization: `Basic ${Buffer.from('server-key:server-secret').toString('base64')}`,
};

export const destination: Destination = {
  ID: 'rokt-dest-1',
  Name: 'ROKT',
  DestinationDefinition: {
    ID: 'rokt-def-1',
    Name: 'ROKT',
    DisplayName: 'Rokt',
    Config: {},
  },
  Config: {
    apiEndpoint: 'https://s2s.mparticle.com',
    serverToServerKey: 'server-key',
    serverToServerSecret: 'server-secret',
  },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
};

export const metadata = (jobId: number): Metadata => ({
  jobId,
  attemptNum: 1,
  userId: `synthetic-user-${jobId}`,
  sourceId: 'source-1',
  destinationId: 'rokt-dest-1',
  workspaceId: 'ws-1',
  sourceType: 'web',
  sourceCategory: 'cloud',
  destinationType: 'ROKT',
  messageId: `message-${jobId}`,
  secret: {},
  dontBatch: false,
});
