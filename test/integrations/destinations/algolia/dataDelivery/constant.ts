const proxyMetdata1 = {
  jobId: 1,
  attemptNum: 1,
  userId: 'dummyUserId',
  sourceId: 'dummySourceId',
  destinationId: 'dummyDestinationId',
  workspaceId: 'dummyWorkspaceId',
  secret: {},
  dontBatch: false,
};

const proxyMetdata2 = {
  jobId: 2,
  attemptNum: 1,
  userId: 'dummyUserId',
  sourceId: 'dummySourceId',
  destinationId: 'dummyDestinationId',
  workspaceId: 'dummyWorkspaceId',
  secret: {},
  dontBatch: false,
};

export const metadataArray = [proxyMetdata1, proxyMetdata2];

export const abortStatTags = {
  errorCategory: 'network',
  errorType: 'aborted',
  destType: 'ALGOLIA',
  module: 'destination',
  implementation: 'native',
  feature: 'dataDelivery',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};

export const commonRequestProperties = {
  commonHeaders: {
    'X-Algolia-API-Key': 'dummyApiKey',
    'X-Algolia-Application-Id': 'O2YARRI15I',
    'User-Agent': 'RudderLabs',
  },
  singleValidEvent: {
    events: [
      {
        eventName: 'product clicked',
        eventType: 'click',
        filters: ['field1:hello', 'val1:val2'],
        index: 'products',
        userToken: 'testuserId1',
      },
    ],
  },
  singleInValidEvent: {
    events: [
      {
        eventName: 'product clicked',
        eventType: 'abc',
        filters: ['field1:hello', 'val1:val2'],
        index: 'products',
        userToken: 'testuserId1',
      },
    ],
  },
  multipleValidEvent: {
    events: [
      {
        eventName: 'product clicked',
        eventType: 'click',
        filters: ['field1:hello', 'val1:val2'],
        index: 'products',
        userToken: 'testuserId1',
      },
      {
        eventName: 'product clicked',
        eventType: 'view',
        filters: ['field1:hello', 'val1:val2'],
        index: 'products',
        userToken: 'testuserId1',
      },
    ],
  },
  combinedValidInvalidEvents: {
    events: [
      {
        eventName: 'product clicked',
        eventType: 'click',
        filters: ['field1:hello', 'val1:val2'],
        index: 'products',
        userToken: 'testuserId1',
      },
      {
        eventName: 'product clicked',
        eventType: 'view',
        filters: ['field1:hello', 'val1:val2'],
        index: 'products',
        userToken: 'testuserId1',
      },
      {
        eventName: 'product clicked',
        eventType: 'abc',
        filters: ['field1:hello', 'val1:val2'],
        index: 'products',
        userToken: 'testuserId1',
      },
    ],
  },
};

export const retryStatTags = {
  errorCategory: 'network',
  errorType: 'retryable',
  destType: 'ALGOLIA',
  module: 'destination',
  implementation: 'native',
  feature: 'dataDelivery',
  destinationId: 'dummyDestinationId',
  workspaceId: 'dummyWorkspaceId',
};
