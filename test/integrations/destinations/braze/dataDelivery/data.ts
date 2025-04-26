/**
 * Auto-migrated and optimized test cases
 * Generated on: 2025-04-26T03:49:59.410Z
 */

import {} from '../../../testTypes';
import MockAdapter from 'axios-mock-adapter';
import { authHeader1 } from '../maskedSecrets';

const baseMetadata = [
  {
    jobId: 1,
    attemptNum: 1,
    userId: 'default-user',
    sourceId: 'default-source',
    destinationId: 'default-destination',
    workspaceId: 'default-workspace',
    secret: {},
    dontBatch: false,
  },
];

export const data = [
  {
    id: 'proxy-1745639399407',
    name: 'braze',
    description: 'Test 0',
    scenario: 'Default proxy scenario',
    successCriteria: 'Proxy test should pass successfully',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1.0.0',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test1',
          userId: 'gabi_userId_45',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'proxy-1745639399407',
    name: 'braze',
    description: 'Test 1',
    scenario: 'Default proxy scenario',
    successCriteria: 'Proxy test should pass successfully',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1.0.0',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test2',
          userId: 'gabi_userId_45',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'proxy-1745639399407',
    name: 'braze',
    description: 'Test 2',
    scenario: 'Default proxy scenario',
    successCriteria: 'Proxy test should pass successfully',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1.0.0',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test3',
          userId: 'gabi_userId_45',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'proxy-1745639399407',
    name: 'braze',
    description: 'Test 3',
    scenario: 'Default proxy scenario',
    successCriteria: 'Proxy test should pass successfully',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1.0.0',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test4',
          userId: 'gabi_userId_45',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'proxy-1745639399407',
    name: 'braze',
    description: 'Test 4',
    scenario: 'Default proxy scenario',
    successCriteria: 'Proxy test should pass successfully',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1.0.0',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test5',
          userId: 'gabi_userId_45',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'proxy-1745639399407',
    name: 'braze',
    description: 'Test 5',
    scenario: 'Default proxy scenario',
    successCriteria: 'Proxy test should pass successfully',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1.0.0',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test6',
          userId: 'gabi_userId_45',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'proxy-1745639399407',
    name: 'braze',
    description: 'Test 6',
    scenario: 'Default proxy scenario',
    successCriteria: 'Proxy test should pass successfully',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1.0.0',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test7',
          userId: 'gabi_userId_45',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
    mockFns: (mockAdapter: MockAdapter) => {
      mockAdapter
        .onPost(
          'https://rest.iad-03.braze.com/users/identify/test7',
          {
            aliases_to_identify: [
              {
                external_id: 'gabi_userId_45',
                user_alias: { alias_label: 'rudder_id', alias_name: 'gabi_anonId_45' },
              },
            ],
          },
          {
            Accept: 'application/json',
            Authorization: authHeader1,
            'Content-Type': 'application/json',
            'User-Agent': 'RudderLabs',
          },
        )
        .replyOnce(201, { aliases_processed: 1, message: 'success' });
    },
  },
  {
    id: 'proxy-1745639399407',
    name: 'braze',
    description: 'Test Transformer Proxy V1 input with v0 proxy handler',
    scenario: 'Default proxy scenario',
    successCriteria: 'Proxy test should pass successfully',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          version: '1.0.0',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/test1',
          userId: 'gabi_userId_45',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'proxy-1745639399407',
    name: 'braze',
    description: 'Test Transformer Proxy V1 input with v0 proxy handler Error returned',
    scenario: 'Default proxy scenario',
    successCriteria: 'Proxy test should pass successfully',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          version: '1.0.0',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://rest.iad-03.braze.com/users/identify/testV1',
          userId: 'gabi_userId_45',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'proxy-1745639399407',
    name: 'braze',
    description:
      'Test Transformer Proxy V1 input with v0 proxy handler Error returned Multiple metadata Track Event',
    scenario: 'Default proxy scenario',
    successCriteria: 'Proxy test should pass successfully',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          version: '1.0.0',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://rest.iad-03.braze.com/users/track/testV1',
          userId: 'gabi_userId_45',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'braze_v1_scenario_1',
    name: 'braze',
    description:
      '[Proxy v1 API] :: Test for a valid request - 2 events and 1 purchase event are sent where the destination responds with 200 without any error',
    scenario: 'Business',
    successCriteria: 'Should return 200 with no error with destination response',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          version: 'v1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://rest.iad-03.braze.com/users/track/valid_scenario1',
          userId: 'default-userId',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'braze_v1_scenario_2',
    name: 'braze',
    description:
      '[Proxy v1 API] :: Test for a invalid request - 2 events and 1 purchase event are sent where the destination responds with 200 with error for a one of the event and the purchase event',
    scenario: 'Business',
    successCriteria: 'Should return 200 with error for one of the event and the purchase event',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          version: 'v1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://rest.iad-03.braze.com/users/track/invalid_scenario1',
          userId: 'default-userId',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'braze_v1_scenario_3',
    name: 'braze',
    description: '[Proxy v1 API] :: Test for an invalid request  - all the payloads are invalid',
    scenario: 'Business',
    successCriteria: 'Should return 400 with error for all the payloads',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          version: 'v1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://rest.iad-03.braze.com/users/track/invalid_scenario2',
          userId: 'default-userId',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'braze_v1_scenario_4',
    name: 'braze',
    description: '[Proxy v1 API] :: Test for invalid auth scneario',
    scenario: 'Business',
    successCriteria: 'Should return 400 for all the payloads',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          version: 'v1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://rest.iad-03.braze.com/users/track/invalid_scenario3',
          userId: 'default-userId',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'braze_v1_other_scenario_1',
    name: 'braze',
    description:
      '[Proxy v1 API] :: Scenario for testing Service Unavailable error from destination',
    scenario: 'Framework',
    successCriteria: 'Should return 500 status code with error message',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          version: 'v1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://random_test_url/test_for_service_not_available',
          userId: 'default-userId',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'braze_v1_other_scenario_2',
    name: 'braze',
    description: '[Proxy v1 API] :: Scenario for testing Internal Server error from destination',
    scenario: 'Framework',
    successCriteria: 'Should return 500 status code with error message',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          version: 'v1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://random_test_url/test_for_internal_server_error',
          userId: 'default-userId',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'braze_v1_other_scenario_3',
    name: 'braze',
    description: '[Proxy v1 API] :: Scenario for testing Gateway Time Out error from destination',
    scenario: 'Framework',
    successCriteria: 'Should return 504 status code with error message',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          version: 'v1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://random_test_url/test_for_gateway_time_out',
          userId: 'default-userId',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'braze_v1_other_scenario_4',
    name: 'braze',
    description: '[Proxy v1 API] :: Scenario for testing null response from destination',
    scenario: 'Framework',
    successCriteria: 'Should return 500 status code with error message',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          version: 'v1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://random_test_url/test_for_null_response',
          userId: 'default-userId',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
  {
    id: 'braze_v1_other_scenario_5',
    name: 'braze',
    description:
      '[Proxy v1 API] :: Scenario for testing null and no status response from destination',
    scenario: 'Framework',
    successCriteria: 'Should return 500 status code with error message',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          version: 'v1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://random_test_url/test_for_null_and_no_status',
          userId: 'default-userId',
          metadata: baseMetadata,
          destinationConfig: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 200,
            message: 'Success',
            response: [
              {
                error: '',
                statusCode: 200,
                metadata: {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-user',
                  sourceId: 'default-source',
                  destinationId: 'default-destination',
                  workspaceId: 'default-workspace',
                  secret: {},
                  dontBatch: false,
                },
              },
            ],
          },
          metadata: baseMetadata,
        },
      },
      metadata: baseMetadata,
    },
  },
];
