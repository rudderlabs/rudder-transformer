import { Destination } from '../../../../src/types';

const destType = 'zoho';
const destTypeInUpperCase = 'ZOHO';
const advertiserId = 'test-advertiser-id';
const dataProviderId = 'rudderstack';
const segmentName = 'test-segment';
const firstPartyDataEndpoint = 'https://sin-data.adsrvr.org/data/advertiser';

const sampleDestination: Destination = {
  Config: {
    region: 'US',
    module: 'Leads',
    trigger: 'workflow',
    addDefaultDuplicateCheck: true,
    multiSelectFieldLevelDecision: [
      {
        from: 'multi-language',
        to: 'true',
      },
      {
        from: 'multi class',
        to: 'false',
      },
    ],
    oneTrustCookieCategories: [
      {
        oneTrustCookieCategory: 'Marketing',
      },
    ],
  },
  DestinationDefinition: {
    Config: { cdkV2Enabled: true },
    ID: '123',
    Name: 'ZOHO',
    DisplayName: 'Zoho',
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
  externalId: [
    {
      identifierType: 'email',
      type: 'ZOHO--LEADS',
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

export {
  destType,
  destTypeInUpperCase,
  advertiserId,
  dataProviderId,
  segmentName,
  sampleDestination,
  sampleContext,
  proxyV1AbortableErrorStatTags,
  firstPartyDataEndpoint,
};
