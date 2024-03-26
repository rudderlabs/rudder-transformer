import { Destination } from '../../../../src/types';

const destType = 'the_trade_desk';
const destTypeInUpperCase = 'THE_TRADE_DESK';
const advertiserId = 'test-advertiser-id';
const dataProviderId = 'rudderstack';
const segmentName = 'test-segment';
const firstPartyDataEndpoint = 'https://sin-data.adsrvr.org/data/advertiser';

const sampleDestination: Destination = {
  Config: {
    advertiserId,
    advertiserSecretKey: 'test-advertiser-secret-key',
    dataServer: 'apac',
    ttlInDays: 30,
    audienceId: segmentName,
  },
  DestinationDefinition: {
    Config: { cdkV2Enabled: true },
    ID: '123',
    Name: 'TRADEDESK',
    DisplayName: 'Trade Desk',
  },
  ID: '345',
  Name: 'Test',
  Enabled: true,
  WorkspaceID: '',
  Transformations: [],
};

const sampleSource = {
  job_id: 'test-job-id',
  job_run_id: 'test-job-run-id',
  task_run_id: 'test-task-run-id',
  version: 'v1.40.4',
};

const sampleContext = {
  destinationFields: 'daid, uid2',
  externalId: [
    {
      identifierType: 'tdid',
      type: 'THE_TRADE_DESK-test-segment',
    },
  ],
  mappedToDestination: 'true',
  sources: sampleSource,
};

const proxyV1AbortableErrorStatTags = {
  destType: destTypeInUpperCase,
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

const { errorType: _, ...proxyV1PlatformErrorStatTags } = proxyV1AbortableErrorStatTags;
proxyV1PlatformErrorStatTags.errorCategory = 'platform';

const proxyV1RetryableErrorStatTags = { ...proxyV1AbortableErrorStatTags, errorType: 'retryable' };

export {
  destType,
  destTypeInUpperCase,
  advertiserId,
  dataProviderId,
  segmentName,
  sampleDestination,
  sampleContext,
  proxyV1AbortableErrorStatTags,
  proxyV1PlatformErrorStatTags,
  proxyV1RetryableErrorStatTags,
  firstPartyDataEndpoint,
};
