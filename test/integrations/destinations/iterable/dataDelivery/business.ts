import { ProxyV1TestData } from '../../../testTypes';
import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import {
  correctIdentifyData,
  correctTrackData,
  headerBlockWithCorrectAccessToken,
  partiallyCorrectIdentifyData,
  partiallyCorrectTrackData,
  wrongIdentifyData,
  wrongTrackData,
} from './network';

export const statTags = {
  destType: 'ITERABLE',
  errorCategory: 'network',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
  errorType: 'aborted',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
};

export const metadata = [
  {
    jobId: 1,
    attemptNum: 1,
    userId: 'default-userId',
    destinationId: 'default-destinationId',
    workspaceId: 'default-workspaceId',
    sourceId: 'default-sourceId',
    secret: {
      accessToken: 'default-accessToken',
    },
    dontBatch: false,
  },
  {
    jobId: 2,
    attemptNum: 1,
    userId: 'default-userId',
    destinationId: 'default-destinationId',
    workspaceId: 'default-workspaceId',
    sourceId: 'default-sourceId',
    secret: {
      accessToken: 'default-accessToken',
    },
    dontBatch: false,
  },
];

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'ITERABLE_v1_other_scenario_1',
    name: 'iterable',
    description:
      '[Proxy API] :: Scenario to test correct Payload Response Handling from Destination',
    successCriteria: 'Should return 200 status code with success',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: correctTrackData,
            headers: headerBlockWithCorrectAccessToken,
            endpoint: 'https://api.iterable.com/api/events/trackBulk',
          },
          metadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[ITERABLE Response Handler] - Request Processed Successfully',
            destinationResponse: {
              status: 200,
              response: {
                createdFields: [],
                disallowedEventNames: [],
                failCount: 0,
                failedUpdates: {
                  forgottenEmails: [],
                  forgottenUserIds: [],
                  invalidEmails: [],
                  invalidUserIds: [],
                  notFoundEmails: [],
                  notFoundUserIds: [],
                },
                filteredOutFields: [],
                invalidEmails: [],
                invalidUserIds: [],
                successCount: 2,
              },
            },
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: 'success',
              },
              {
                statusCode: 200,
                metadata: generateMetadata(2),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'ITERABLE_v1_other_scenario_2',
    name: 'iterable',
    description:
      '[Proxy API] :: Scenario to test Malformed Payload Response Handling from Destination',
    successCriteria: 'Should return 400 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: wrongTrackData,
            headers: headerBlockWithCorrectAccessToken,
            endpoint: 'https://api.iterable.com/api/events/trackBulk',
          },
          metadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            statTags,
            message:
              'ITERABLE: Error transformer proxy during ITERABLE response transformation. {"obj.events[1].createdAt":"Number value expected"}',
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(1),
                error:
                  '{"msg":"[/api/events/trackBulk] Invalid JSON body","code":"BadJsonBody","params":{"obj.events[1].createdAt":"Number value expected"}}',
              },
              {
                statusCode: 400,
                metadata: generateMetadata(2),
                error:
                  '{"msg":"[/api/events/trackBulk] Invalid JSON body","code":"BadJsonBody","params":{"obj.events[1].createdAt":"Number value expected"}}',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'ITERABLE_v1_other_scenario_3',
    name: 'iterable',
    description:
      '[Proxy API] :: Scenario to test partially successful Response Handling from Destination',
    successCriteria: 'Should return 400 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: partiallyCorrectTrackData,
            headers: headerBlockWithCorrectAccessToken,
            endpoint: 'https://api.iterable.com/api/events/trackBulk',
          },
          metadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[ITERABLE Response Handler] - Request Processed Successfully',
            destinationResponse: {
              status: 200,
              response: {
                successCount: 1,
                failCount: 1,
                invalidEmails: ['sayan'],
                invalidUserIds: [],
                disallowedEventNames: [],
                filteredOutFields: [],
                createdFields: [],
                failedUpdates: {
                  invalidEmails: ['sayan'],
                  invalidUserIds: [],
                  notFoundEmails: [],
                  notFoundUserIds: [],
                  forgottenEmails: [],
                  forgottenUserIds: [],
                },

                status: 200,
              },
            },
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(1),
                error: 'Request failed for value "sayan" because it is "invalidEmails".',
              },
              {
                statusCode: 200,
                metadata: generateMetadata(2),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'ITERABLE_v1_other_scenario_1',
    name: 'iterable',
    description:
      '[Proxy API] :: Scenario to test correct identify Payload Response Handling from Destination',
    successCriteria: 'Should return 200 status code with success',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: correctIdentifyData,
            headers: headerBlockWithCorrectAccessToken,
            endpoint: 'https://api.iterable.com/api/users/bulkUpdate',
          },
          metadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[ITERABLE Response Handler] - Request Processed Successfully',
            destinationResponse: {
              status: 200,
              response: {
                createdFields: [],
                noOpEmails: [],
                noOpUserIds: [],
                failCount: 0,
                failedUpdates: {
                  conflictEmails: [],
                  conflictUserIds: [],
                  forgottenEmails: [],
                  forgottenUserIds: [],
                  invalidEmails: [],
                  invalidUserIds: [],
                  notFoundEmails: [],
                  notFoundUserIds: [],
                  invalidDataEmails: [],
                  invalidDataUserIds: [],
                },
                filteredOutFields: [],
                invalidEmails: [],
                invalidUserIds: [],
                successCount: 2,
              },
            },
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: 'success',
              },
              {
                statusCode: 200,
                metadata: generateMetadata(2),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'ITERABLE_v1_other_scenario_2',
    name: 'iterable',
    description:
      '[Proxy API] :: Scenario to test Malformed identify Payload Response Handling from Destination',
    successCriteria: 'Should return 400 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: wrongIdentifyData,
            headers: headerBlockWithCorrectAccessToken,
            endpoint: 'https://api.iterable.com/api/users/bulkUpdate',
          },
          metadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 400,
            statTags,
            message:
              'ITERABLE: Error transformer proxy during ITERABLE response transformation. {"obj.users[1].preferUserId":"Boolean value expected"}',
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(1),
                error:
                  '{"msg":"[/api/users/bulkUpdate] Invalid JSON body","code":"BadJsonBody","params":{"obj.users[1].preferUserId":"Boolean value expected"}}',
              },
              {
                statusCode: 400,
                metadata: generateMetadata(2),
                error:
                  '{"msg":"[/api/users/bulkUpdate] Invalid JSON body","code":"BadJsonBody","params":{"obj.users[1].preferUserId":"Boolean value expected"}}',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'ITERABLE_v1_other_scenario_3',
    name: 'iterable',
    description:
      '[Proxy API] :: Scenario to test partially successful identify Response Handling from Destination',
    successCriteria: 'Should return 400 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: partiallyCorrectIdentifyData,
            headers: headerBlockWithCorrectAccessToken,
            endpoint: 'https://api.iterable.com/api/users/bulkUpdate',
          },
          metadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: '[ITERABLE Response Handler] - Request Processed Successfully',
            destinationResponse: {
              status: 200,
              response: {
                successCount: 1,
                failCount: 1,
                invalidEmails: ['shrouti'],
                invalidUserIds: [],
                noOpEmails: [],
                noOpUserIds: [],
                filteredOutFields: [],
                createdFields: [],
                failedUpdates: {
                  invalidEmails: ['shrouti'],
                  conflictEmails: [],
                  conflictUserIds: [],
                  invalidUserIds: [],
                  notFoundEmails: [],
                  notFoundUserIds: [],
                  forgottenEmails: [],
                  forgottenUserIds: [],
                  invalidDataEmails: [],
                  invalidDataUserIds: [],
                },
              },
            },
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: 'success',
              },
              {
                statusCode: 400,
                metadata: generateMetadata(2),
                error: 'Request failed for value "shrouti" because it is "invalidEmails".',
              },
            ],
          },
        },
      },
    },
  },
];
