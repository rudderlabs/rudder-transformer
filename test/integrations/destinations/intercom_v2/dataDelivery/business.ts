import {
  generateMetadata,
  generateProxyV0Payload,
  generateProxyV1Payload,
} from '../../../testUtils';
import { headers, RouterNetworkErrorStatTags } from '../common';
import { ProxyV1TestData } from '../../../testTypes';

const createUserPayload = {
  email: 'test-unsupported-media@rudderlabs.com',
  external_id: 'user-id-1',
  name: 'John Snow',
};

const conflictUserPayload = {
  email: 'conflict@test.com',
  user_id: 'conflict_test_user_id_1',
};

const statTags = {
  ...RouterNetworkErrorStatTags,
  errorType: 'retryable',
  feature: 'dataDelivery',
};

export const testScenariosForV0API = [
  {
    id: 'INTERCOM_V2_v0_other_scenario_1',
    name: 'intercom_v2',
    description:
      '[Proxy v0 API] :: Scenario to test Malformed Payload Response Handling from Destination',
    successCriteria: 'Should return 400 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          JSON: {
            custom_attributes: {
              isOpenSource: true,
            },
          },
          headers,
          endpoint: 'https://api.intercom.io/contacts/proxy-contact-id',
          method: 'PUT',
        }),
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            destinationResponse: {
              response: {
                errors: [
                  {
                    code: 'parameter_invalid',
                    message: "Custom attribute 'isOpenSource' does not exist",
                  },
                ],
                request_id: 'request_1',
                type: 'error.list',
              },
              status: 400,
            },
            message:
              '[Intercom V2 Response Handler] Request failed for destination intercom_v2 with status: 400. {"request_id":"request_1","type":"error.list","errors":[{"code":"parameter_invalid","message":"Custom attribute \'isOpenSource\' does not exist"}]}',
            status: 400,
            statTags: {
              ...statTags,
              errorType: 'aborted',
            },
          },
        },
      },
    },
  },
  {
    id: 'INTERCOM_V2_v0_other_scenario_2',
    name: 'intercom_v2',
    description: '[Proxy v0 API] :: Scenario to test Rate Limit Exceeded Handling from Destination',
    successCriteria: 'Should return 429 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          JSON: {
            email: 'new@test.com',
          },
          endpoint: 'https://api.intercom.io/contacts/proxy-contact-id',
          method: 'PUT',
          headers,
        }),
      },
    },
    output: {
      response: {
        status: 429,
        body: {
          output: {
            destinationResponse: {
              response: {
                errors: [
                  {
                    code: 'rate_limit_exceeded',
                    message: 'The rate limit for the App has been exceeded',
                  },
                ],
                request_id: 'request125',
                type: 'error.list',
              },
              status: 429,
            },
            message:
              '[Intercom V2 Response Handler] Request failed for destination intercom_v2 with status: 429. {"errors":[{"code":"rate_limit_exceeded","message":"The rate limit for the App has been exceeded"}],"request_id":"request125","type":"error.list"}',
            status: 429,
            statTags: {
              ...statTags,
              errorType: 'throttled',
            },
          },
        },
      },
    },
  },
  {
    id: 'INTERCOM_V2_v0_other_scenario_3',
    name: 'intercom_v2',
    description: '[Proxy v0 API] :: Scenario to test Conflict User Handling from Destination',
    successCriteria: 'Should return 409 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          JSON: conflictUserPayload,
          headers,
          endpoint: 'https://api.intercom.io/contacts',
          method: 'POST',
        }),
      },
    },
    output: {
      response: {
        status: 409,
        body: {
          output: {
            destinationResponse: {
              response: {
                errors: [
                  {
                    code: 'conflict',
                    message: 'A contact matching those details already exists with id=test',
                  },
                ],
                request_id: 'request126',
                type: 'error.list',
              },
              status: 409,
            },
            message:
              '[Intercom V2 Response Handler] Request failed for destination intercom_v2 with status: 409. {"errors":[{"code":"conflict","message":"A contact matching those details already exists with id=test"}],"request_id":"request126","type":"error.list"}',
            status: 409,
            statTags: {
              ...statTags,
              errorType: 'aborted',
            },
          },
        },
      },
    },
  },
  {
    id: 'INTERCOM_V2_v0_other_scenario_4',
    name: 'intercom_v2',
    description: '[Proxy v0 API] :: Scenario to test Unsupported Media Handling from Destination',
    successCriteria: 'Should return 406 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          JSON: createUserPayload,
          headers: {
            ...headers,
            Accept: 'test',
            'Content-Type': 'test',
          },
          endpoint: 'https://api.intercom.io/contacts',
          method: 'POST',
        }),
      },
    },
    output: {
      response: {
        status: 406,
        body: {
          output: {
            destinationResponse: {
              response: {
                errors: [
                  {
                    code: 'media_type_not_acceptable',
                    message: 'The Accept header should send a media type of application/json',
                  },
                ],
                type: 'error.list',
              },
              status: 406,
            },
            message:
              '[Intercom V2 Response Handler] Request failed for destination intercom_v2 with status: 406. {"errors":[{"code":"media_type_not_acceptable","message":"The Accept header should send a media type of application/json"}],"type":"error.list"}',
            status: 406,
            statTags: {
              ...statTags,
              errorType: 'aborted',
            },
          },
        },
      },
    },
  },
  {
    id: 'INTERCOM_V2_v0_other_scenario_5',
    name: 'intercom_v2',
    description: '[Proxy v0 API] :: Request Timeout Error Handling from Destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          JSON: {
            email: 'time-out@gmail.com',
          },
          endpoint: 'https://api.intercom.io/contacts',
          headers,
          method: 'POST',
        }),
      },
    },
    output: {
      response: {
        status: 500,
        body: {
          output: {
            status: 500,
            message:
              '[Intercom V2 Response Handler] Request failed for destination intercom_v2 with status: 408',
            destinationResponse: {
              response: {
                type: 'error.list',
                request_id: 'req-123',
                errors: [
                  {
                    code: 'Request Timeout',
                    message: 'The server would not wait any longer for the client',
                  },
                ],
              },
              status: 408,
            },
            statTags,
          },
        },
      },
    },
  },
];

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'INTERCOM_V2_v1_other_scenario_1',
    name: 'intercom_v2',
    description:
      '[Proxy v1 API] :: Scenario to test Malformed Payload Response Handling from Destination',
    successCriteria: 'Should return 400 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          JSON: {
            custom_attributes: {
              isOpenSource: true,
            },
          },
          headers,
          endpoint: 'https://api.intercom.io/contacts/proxy-contact-id',
          method: 'PUT',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error:
                  '{"request_id":"request_1","type":"error.list","errors":[{"code":"parameter_invalid","message":"Custom attribute \'isOpenSource\' does not exist"}]}',
                statusCode: 400,
                metadata: generateMetadata(1),
              },
            ],
            message:
              '[Intercom V2 Response Handler] Request failed for destination intercom_v2 with status: 400. {"request_id":"request_1","type":"error.list","errors":[{"code":"parameter_invalid","message":"Custom attribute \'isOpenSource\' does not exist"}]}',
            status: 400,
            statTags: {
              ...statTags,
              errorType: 'aborted',
            },
          },
        },
      },
    },
  },
  {
    id: 'INTERCOM_V2_v1_other_scenario_2',
    name: 'intercom_v2',
    description: '[Proxy v1 API] :: Scenario to test Rate Limit Exceeded Handling from Destination',
    successCriteria: 'Should return 429 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          JSON: {
            email: 'new@test.com',
          },
          endpoint: 'https://api.intercom.io/contacts/proxy-contact-id',
          headers,
          method: 'PUT',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error: JSON.stringify({
                  errors: [
                    {
                      code: 'rate_limit_exceeded',
                      message: 'The rate limit for the App has been exceeded',
                    },
                  ],
                  request_id: 'request125',
                  type: 'error.list',
                }),
                statusCode: 429,
                metadata: generateMetadata(1),
              },
            ],
            message:
              '[Intercom V2 Response Handler] Request failed for destination intercom_v2 with status: 429. {"errors":[{"code":"rate_limit_exceeded","message":"The rate limit for the App has been exceeded"}],"request_id":"request125","type":"error.list"}',
            status: 429,
            statTags: {
              ...statTags,
              errorType: 'throttled',
            },
          },
        },
      },
    },
  },
  {
    id: 'INTERCOM_V2_v1_other_scenario_3',
    name: 'intercom_v2',
    description: '[Proxy v1 API] :: Scenario to test Conflict User Handling from Destination',
    successCriteria: 'Should return 409 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          JSON: conflictUserPayload,
          headers,
          endpoint: 'https://api.intercom.io/contacts',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error: JSON.stringify({
                  errors: [
                    {
                      code: 'conflict',
                      message: 'A contact matching those details already exists with id=test',
                    },
                  ],
                  request_id: 'request126',
                  type: 'error.list',
                }),
                statusCode: 409,
                metadata: generateMetadata(1),
              },
            ],
            message:
              '[Intercom V2 Response Handler] Request failed for destination intercom_v2 with status: 409. {"errors":[{"code":"conflict","message":"A contact matching those details already exists with id=test"}],"request_id":"request126","type":"error.list"}',
            status: 409,
            statTags: {
              ...statTags,
              errorType: 'aborted',
            },
          },
        },
      },
    },
  },
  {
    id: 'INTERCOM_V2_v1_other_scenario_4',
    name: 'intercom_v2',
    description: '[Proxy v1 API] :: Scenario to test Unsupported Media Handling from Destination',
    successCriteria: 'Should return 406 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          JSON: createUserPayload,
          headers: {
            ...headers,
            Accept: 'test',
            'Content-Type': 'test',
          },
          endpoint: 'https://api.intercom.io/contacts',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            response: [
              {
                error: JSON.stringify({
                  errors: [
                    {
                      code: 'media_type_not_acceptable',
                      message: 'The Accept header should send a media type of application/json',
                    },
                  ],
                  type: 'error.list',
                }),
                statusCode: 406,
                metadata: generateMetadata(1),
              },
            ],
            message:
              '[Intercom V2 Response Handler] Request failed for destination intercom_v2 with status: 406. {"errors":[{"code":"media_type_not_acceptable","message":"The Accept header should send a media type of application/json"}],"type":"error.list"}',
            status: 406,
            statTags: {
              ...statTags,
              errorType: 'aborted',
            },
          },
        },
      },
    },
  },
  {
    id: 'INTERCOM_V2_v1_other_scenario_5',
    name: 'intercom_v2',
    description: '[Proxy v1 API] :: Request Timeout Error Handling from Destination',
    successCriteria: 'Should return 500 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload({
          JSON: {
            email: 'time-out@gmail.com',
          },
          endpoint: 'https://api.intercom.io/contacts',
          headers,
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            status: 500,
            message:
              '[Intercom V2 Response Handler] Request failed for destination intercom_v2 with status: 408',
            response: [
              {
                error: JSON.stringify({
                  type: 'error.list',
                  request_id: 'req-123',
                  errors: [
                    {
                      code: 'Request Timeout',
                      message: 'The server would not wait any longer for the client',
                    },
                  ],
                }),
                metadata: generateMetadata(1),
                statusCode: 500,
              },
            ],
            statTags,
          },
        },
      },
    },
  },
];
