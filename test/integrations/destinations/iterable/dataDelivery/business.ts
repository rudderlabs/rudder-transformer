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
import { defaultAccessToken } from '../../../common/secrets';

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

export const metadata = [generateMetadata(1), generateMetadata(2)];

export const singleMetadata = [
  {
    jobId: 1,
    attemptNum: 1,
    userId: 'default-userId',
    destinationId: 'default-destinationId',
    workspaceId: 'default-workspaceId',
    sourceId: 'default-sourceId',
    secret: {
      accessToken: defaultAccessToken,
    },
    dontBatch: false,
  },
];

export const singleTrackPayload = {
  email: 'sayan@gmail.com',
  userId: 'abcdeeeeeeeexxxx102',
  eventName: 'Email Opened',
  id: '1234',
  createdAt: 1598631966468,
  dataFields: {
    subject: 'resume validate',
    sendtime: '2020-01-01',
    sendlocation: 'akashdeep@gmail.com',
  },
  campaignId: 0,
  templateId: 0,
  createNewFields: true,
};

export const updateEmailData = {
  currentEmail: 'sayan',
  currentUserId: 'abcdeeeeeeeexxxx102',
  newEmail: 'sayan@gmail.com',
};

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
            endpointPath: 'events/trackBulk',
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
            endpointPath: 'events/trackBulk',
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
                error: JSON.stringify({
                  msg: '[/api/events/trackBulk] Invalid JSON body',
                  code: 'BadJsonBody',
                  params: { 'obj.events[1].createdAt': 'Number value expected' },
                }),
              },
              {
                statusCode: 400,
                metadata: generateMetadata(2),
                error: JSON.stringify({
                  msg: '[/api/events/trackBulk] Invalid JSON body',
                  code: 'BadJsonBody',
                  params: { 'obj.events[1].createdAt': 'Number value expected' },
                }),
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
            endpointPath: 'events/trackBulk',
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
                error: 'email error:"sayan" in "invalidEmails,failedUpdates.invalidEmails".',
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
    id: 'ITERABLE_v1_other_scenario_4',
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
            endpointPath: 'users/bulkUpdate',
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
    id: 'ITERABLE_v1_other_scenario_5',
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
            endpointPath: 'users/bulkUpdate',
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
                error: JSON.stringify({
                  msg: '[/api/users/bulkUpdate] Invalid JSON body',
                  code: 'BadJsonBody',
                  params: { 'obj.users[1].preferUserId': 'Boolean value expected' },
                }),
              },
              {
                statusCode: 400,
                metadata: generateMetadata(2),
                error: JSON.stringify({
                  msg: '[/api/users/bulkUpdate] Invalid JSON body',
                  code: 'BadJsonBody',
                  params: { 'obj.users[1].preferUserId': 'Boolean value expected' },
                }),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'ITERABLE_v1_other_scenario_6',
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
            endpointPath: 'users/bulkUpdate',
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
                error: 'email error:"shrouti" in "invalidEmails,failedUpdates.invalidEmails".',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'ITERABLE_v1_other_scenario_7',
    name: 'iterable',
    description:
      '[Proxy API] :: Scenario to test partially unsuccessful updateEmail Response Handling from Destination',
    successCriteria: 'Should return 400 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: updateEmailData,
            headers: headerBlockWithCorrectAccessToken,
            endpoint: 'https://api.iterable.com/api/users/updateEmail',
            endpointPath: 'users/updateEmail',
          },
          singleMetadata,
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
              'ITERABLE: Error transformer proxy during ITERABLE response transformation. "Invalid currentEmail sayan"',
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(1),
                error: JSON.stringify({
                  msg: 'Invalid currentEmail sayan',
                  code: 'InvalidEmailAddressError',
                  params: null,
                }),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'ITERABLE_v1_other_scenario_8',
    name: 'iterable',
    description:
      '[Proxy API] :: Scenario to test single track correct Payload Response Handling from Destination',
    successCriteria: 'Should return 200 status code with success',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: singleTrackPayload,
            headers: headerBlockWithCorrectAccessToken,
            endpoint: 'https://api.iterable.com/api/events/track',
            endpointPath: 'events/track',
          },
          singleMetadata,
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
                msg: 'Event with id: 1234 tracked.',
                code: 'Success',
                params: {
                  id: '1234',
                },
              },
            },
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'ITERABLE_v1_other_scenario_9',
    name: 'iterable',
    description:
      '[Proxy API] :: Scenario to wrong sinle track event Response Handling from Destination',
    successCriteria: 'Should return 400 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: { ...singleTrackPayload, email: 'sayan' },
            headers: headerBlockWithCorrectAccessToken,
            endpoint: 'https://api.iterable.com/api/events/track',
            endpointPath: 'events/track',
          },
          singleMetadata,
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
              'ITERABLE: Error transformer proxy during ITERABLE response transformation. "Invalid email: sayan"',
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(1),
                error: JSON.stringify({
                  msg: 'Invalid email: sayan',
                  code: 'InvalidEmailAddressError',
                  params: null,
                }),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'ITERABLE_v1_other_scenario_10',
    name: 'iterable',
    description:
      '[Proxy API] :: Scenario to wrong single track event for catalogs Response Handling from Destination',
    successCriteria: 'Should return 400 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: {
              documents: {
                Tiffany: { ruchira: 'donaldbaker@ellis.com', new_field2: 'GB' },
                ABC: { ruchira: 'abc@ellis.com', new_field2: 'GB1' },
              },
              replaceUploadedFieldsOnly: true,
            },
            headers: headerBlockWithCorrectAccessToken,
            endpoint: 'https://api.iterable.com/api/catalogs/rudder-test/items',
            endpointPath: 'catalogs',
          },
          singleMetadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 404,
            statTags,
            message:
              'ITERABLE: Error transformer proxy during ITERABLE response transformation. "Catalog not found: rudder-test"',
            response: [
              {
                statusCode: 404,
                metadata: generateMetadata(1),
                error: JSON.stringify({
                  error: 'NotFound',
                  message: 'Catalog not found: rudder-test',
                  code: 'error.catalogs.notFound',
                  data: { args: ['rudder-test'] },
                }),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'ITERABLE_v1_other_scenario_11',
    name: 'iterable',
    description:
      '[Proxy API] :: Scenario to test catalog track correct Payload Response Handling from Destination',
    successCriteria: 'Should return 200 status code with success',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: {
              documents: {
                Tiffany: { ruchira: 'donaldbaker@ellis.com', new_field2: 'GB' },
                ABC: { ruchira: 'abc@ellis.com', new_field2: 'GB1' },
              },
              replaceUploadedFieldsOnly: true,
            },
            headers: headerBlockWithCorrectAccessToken,
            endpoint: 'https://api.iterable.com/api/catalogs/test-ruchira/items',
            endpointPath: 'catalogs',
          },
          singleMetadata,
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
                code: 'Success',
                msg: 'Request to bulk-upload documents into test-ruchira processed successfully',
                params: null,
              },
            },
            response: [
              {
                statusCode: 200,
                metadata: generateMetadata(1),
                error: 'success',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'ITERABLE_v1_other_scenario_12',
    name: 'iterable',
    description:
      '[Proxy API] :: Scenario to correct device token registration event Response Handling from Destination with wrong permission',
    successCriteria: 'Should return 400 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: {
              email: 'sayan@gmail.com',
              device: {
                token: '1234',
                platform: 'APNS',
                applicationName: 'rudder',
                dataFields: {},
              },
              userId: 'abcdeeeeeeeexxxx102',
              preferUserId: true,
            },
            headers: headerBlockWithCorrectAccessToken,
            endpoint: 'https://api.iterable.com/api/users/registerDeviceToken',
            endpointPath: 'users/registerDeviceToken',
          },
          singleMetadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 401,
            statTags,
            message:
              'ITERABLE: Error transformer proxy during ITERABLE response transformation. {"ip":"103.189.130.133","endpoint":"/api/users/registerDeviceToken","apiKeyIdentifier":"af831922","apiKeyType":"ServerSide"}',
            response: [
              {
                statusCode: 401,
                metadata: generateMetadata(1),
                error: JSON.stringify({
                  msg: 'Disabled API key or insufficient privileges',
                  code: 'BadApiKey',
                  params: {
                    ip: '103.189.130.133',
                    endpoint: '/api/users/registerDeviceToken',
                    apiKeyIdentifier: 'af831922',
                    apiKeyType: 'ServerSide',
                  },
                }),
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'ITERABLE_v1_other_scenario_13',
    name: 'iterable',
    description:
      '[Proxy API] :: Scenario to correct browser token registration event Response Handling from Destination with wrong permission',
    successCriteria: 'Should return 400 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: {
              email: 'sayan@gmail.com',
              browserToken: '1234567',
              userId: 'abcdeeeeeeeexxxx102',
            },
            headers: headerBlockWithCorrectAccessToken,
            endpoint: 'https://api.iterable.com/api/users/registerBrowserToken',
            endpointPath: 'users/registerBrowserToken',
          },
          singleMetadata,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 401,
            statTags,
            message:
              'ITERABLE: Error transformer proxy during ITERABLE response transformation. {"ip":"103.189.130.129","endpoint":"/api/users/registerBrowserToken","apiKeyIdentifier":"af831922","apiKeyType":"ServerSide"}',
            response: [
              {
                statusCode: 401,
                metadata: generateMetadata(1),
                error: JSON.stringify({
                  msg: 'Disabled API key or insufficient privileges',
                  code: 'BadApiKey',
                  params: {
                    ip: '103.189.130.129',
                    endpoint: '/api/users/registerBrowserToken',
                    apiKeyIdentifier: 'af831922',
                    apiKeyType: 'ServerSide',
                  },
                }),
              },
            ],
          },
        },
      },
    },
  },
];
