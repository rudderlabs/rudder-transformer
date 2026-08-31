import { Destination, Metadata } from '../../../../src/types';

export const endpoint = 'https://api.openai.com/v1/events';
export const deliveryAccount = {
  id: 'openai-account-1',
  options: { pixelId: 'pixel-123' },
  secret: { apiKey: 'test-api-key' },
  accountDefinitionName: 'DESTINATION_OPENAI_ADS_API_KEY',
};

export const destination: Destination = {
  ID: 'openai-ads-dest-1',
  Name: 'OPENAI_ADS',
  DestinationDefinition: {
    ID: 'openai-ads-def-1',
    Name: 'OPENAI_ADS',
    DisplayName: 'OpenAI Ads',
    Config: {},
  },
  Config: {
    eventMapping: [
      { from: 'Product Viewed', to: 'contents_viewed' },
      { from: 'Lead Created', to: 'lead_created' },
    ],
    defaultActionSource: 'offline',
  },
  deliveryAccount,
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
};

export const metadata = (jobId: number): Metadata => ({
  jobId,
  attemptNum: 1,
  userId: `u${jobId}`,
  sourceId: 'src-1',
  destinationId: 'openai-ads-dest-1',
  workspaceId: 'ws-1',
  sourceType: 'web',
  sourceCategory: 'cloud',
  destinationType: 'OPENAI_ADS',
  messageId: `msg-${jobId}`,
  secret: {},
  dontBatch: false,
});
