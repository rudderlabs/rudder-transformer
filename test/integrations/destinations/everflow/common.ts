import type { Destination, Metadata } from '../../../../src/types';

export const endpoint = 'https://www.example.com/everflow/postback';

export const destination: Destination = {
  ID: 'everflow-dest-1',
  Name: 'EVERFLOW',
  DestinationDefinition: {
    ID: 'everflow-def-1',
    Name: 'EVERFLOW',
    DisplayName: 'Everflow',
    Config: {},
  },
  Config: {
    postbackUrl: endpoint,
    networkId: 'network-1',
    verificationToken: 'verification-token-1',
  },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
};

export const metadata = (jobId: number): Metadata => ({
  jobId,
  attemptNum: 1,
  userId: `user-${jobId}`,
  sourceId: 'source-1',
  destinationId: 'everflow-dest-1',
  workspaceId: 'ws-1',
  sourceType: 'javascript',
  sourceCategory: 'web',
  destinationType: 'EVERFLOW',
  messageId: `message-${jobId}`,
  secret: {},
  dontBatch: false,
});
