import {
  generateMetadata,
  generateProxyV0Payload,
  generateProxyV1Payload,
} from '../../../testUtils';

const commonHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer testApiKey',
  Accept: 'application/json',
  'Intercom-Version': '1.4',
};

const unauthorizedResponseHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer invalidApiKey',
  Accept: 'application/json',
  'Intercom-Version': '1.4',
};

const createUserPayload = {
  email: 'test_1@test.com',
  phone: '9876543210',
  name: 'Test Name',
  signed_up_at: 1601493060,
  last_seen_user_agent: 'unknown',
  update_last_request_at: true,
  user_id: 'test_user_id_1',
  custom_attributes: {
    'address.city': 'Kolkata',
    'address.state': 'West Bengal',
  },
};

const conflictUserPayload = {
  email: 'test_1@test.com',
  name: 'Rudder Labs',
  signed_up_at: 1601496060,
  last_seen_user_agent: 'unknown',
  update_last_request_at: true,
  user_id: 'test_user_id_2',
  custom_attributes: {
    'address.city': 'Kolkata',
    'address.state': 'West Bengal',
  },
};

const updateUserPayload = {
  email: 'test_1@test.com',
  phone: '9876543211',
  name: 'Sample Name',
  signed_up_at: 1601493060,
  update_last_request_at: true,
  user_id: 'test_user_id_1',
  custom_attributes: {
    'address.city': 'Kolkata',
    'address.state': 'West Bengal',
  },
};

const createCompanyPayload = {
  company_id: 'rudderlabs',
  name: 'RudderStack',
  website: 'www.rudderstack.com',
  plan: 'enterprise',
  size: 500,
  industry: 'CDP',
  custom_attributes: { isOpenSource: true },
};

const sendMessagePayload = {
  from: {
    type: 'user',
    id: 'id@1',
  },
  body: 'heyy, how are you',
  referer: 'https://twitter.com/bob',
};

const createUserRequestParameters = {
  JSON: createUserPayload,
  headers: commonHeaders,
};

const updateUserRequestParameters = {
  JSON: updateUserPayload,
  headers: commonHeaders,
};

const createCompanyRequestParameters = {
  JSON: createCompanyPayload,
  headers: commonHeaders,
};

const sendMessageRequestParameters = {
  JSON: sendMessagePayload,
  headers: commonHeaders,
};

const metadataArray = [generateMetadata(1)];

export const testScenariosForV0API = [
  {
    id: 'intercom_v0_other_scenario_1',
    name: 'intercom',
    description:
      '[Proxy v0 API] :: Scenario to test Invalid Credentials Handling during Destination Authentication',
    successCriteria: 'Should return 401 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...createUserRequestParameters,
          headers: unauthorizedResponseHeaders,
          endpoint: 'https://api.intercom.io/users/test1',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            destinationResponse: {
              errors: [
                {
                  code: 'unauthorized',
                  message: 'Access Token Invalid',
                },
              ],
              request_id: 'request123',
              type: 'error.list',
            },
            message: 'Request Processed Successfully',
            status: 401,
          },
        },
      },
    },
  },
  {
    id: 'intercom_v0_other_scenario_2',
    name: 'intercom',
    description:
      '[Proxy v0 API] :: Scenario to test Malformed Payload Response Handling from Destination',
    successCriteria: 'Should return 401 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...createCompanyRequestParameters,
          endpoint: 'https://api.eu.intercom.io/companies',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            destinationResponse: {
              errors: [
                {
                  code: 'parameter_invalid',
                  message: "Custom attribute 'isOpenSource' does not exist",
                },
              ],
              request_id: 'request_1',
              type: 'error.list',
            },
            message: 'Request Processed Successfully',
            status: 401,
          },
        },
      },
    },
  },
  {
    id: 'intercom_v0_other_scenario_3',
    name: 'intercom',
    description:
      '[Proxy v0 API] :: Scenario to test Plan-Restricted Response Handling from Destination',
    successCriteria: 'Should return 403 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...sendMessageRequestParameters,
          endpoint: 'https://api.intercom.io/messages',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 403,
        body: {
          output: {
            destinationResponse: {
              errors: [
                {
                  code: 'api_plan_restricted',
                  message: 'Active subscription needed.',
                },
              ],
              request_id: 'request124',
              type: 'error.list',
            },
            message: 'Request Processed Successfully',
            status: 403,
          },
        },
      },
    },
  },
  {
    id: 'intercom_v0_other_scenario_4',
    name: 'intercom',
    description: '[Proxy v0 API] :: Scenario to test Rate Limit Exceeded Handling from Destination',
    successCriteria: 'Should return 429 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: generateProxyV0Payload({
          ...updateUserRequestParameters,
          endpoint: 'https://api.intercom.io/users/test1',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 429,
        body: {
          output: {
            destinationResponse: {
              errors: [
                {
                  code: 'rate_limit_exceeded',
                  message: 'The rate limit for the App has been exceeded',
                },
              ],
              request_id: 'request125',
              type: 'error.list',
            },
            message: 'Request Processed Successfully',
            status: 429,
          },
        },
      },
    },
  },
  {
    id: 'intercom_v0_other_scenario_5',
    name: 'intercom',
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
          headers: {
            ...commonHeaders,
            'Intercom-Version': '2.10',
          },
          endpoint: 'https://api.intercom.io/contacts',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 409,
        body: {
          output: {
            destinationResponse: {
              errors: [
                {
                  code: 'conflict',
                  message: 'A contact matching those details already exists with id=test1',
                },
              ],
              request_id: 'request126',
              type: 'error.list',
            },
            message: 'Request Processed Successfully',
            status: 409,
          },
        },
      },
    },
  },
  {
    id: 'intercom_v0_other_scenario_6',
    name: 'intercom',
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
            ...commonHeaders,
            'Intercom-Version': '2.10',
          },
          endpoint: 'https://api.intercom.io/users',
        }),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 406,
        body: {
          output: {
            destinationResponse: {
              errors: [
                {
                  code: 'media_type_not_acceptable',
                  message: 'The Accept header should send a media type of application/json',
                },
              ],
              type: 'error.list',
            },
            message: 'Request Processed Successfully',
            status: 406,
          },
        },
      },
    },
  },
];

export const testScenariosForV1API = [
  {
    id: 'intercom_v1_other_scenario_1',
    name: 'intercom',
    description:
      '[Proxy v1 API] :: Scenario to test Invalid Credentials Handling during Destination Authentication',
    successCriteria: 'Should return 401 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...createUserRequestParameters,
            headers: unauthorizedResponseHeaders,
            endpoint: 'https://api.intercom.io/users/test1',
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: 'Request Processed Successfully',
            response: [
              {
                error:
                  '{"type":"error.list","request_id":"request123","errors":[{"code":"unauthorized","message":"Access Token Invalid"}]}',
                metadata: generateMetadata(1),
                statusCode: 401,
              },
            ],
            status: 401,
          },
        },
      },
    },
  },
  {
    id: 'intercom_v1_other_scenario_2',
    name: 'intercom',
    description:
      '[Proxy v1 API] :: Scenario to test Malformed Payload Response Handling from Destination',
    successCriteria: 'Should return 401 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...createCompanyRequestParameters,
            endpoint: 'https://api.eu.intercom.io/companies',
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: 'Request Processed Successfully',
            response: [
              {
                error:
                  '{"type":"error.list","request_id":"request_1","errors":[{"code":"parameter_invalid","message":"Custom attribute \'isOpenSource\' does not exist"}]}',
                metadata: generateMetadata(1),
                statusCode: 401,
              },
            ],
            status: 401,
          },
        },
      },
    },
  },
  {
    id: 'intercom_v1_other_scenario_3',
    name: 'intercom',
    description:
      '[Proxy v1 API] :: Scenario to test Plan-Restricted Response Handling from Destination',
    successCriteria: 'Should return 403 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...sendMessageRequestParameters,
            endpoint: 'https://api.intercom.io/messages',
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: 'Request Processed Successfully',
            response: [
              {
                error:
                  '{"type":"error.list","request_id":"request124","errors":[{"code":"api_plan_restricted","message":"Active subscription needed."}]}',
                metadata: generateMetadata(1),
                statusCode: 403,
              },
            ],
            status: 403,
          },
        },
      },
    },
  },
  {
    id: 'intercom_v1_other_scenario_4',
    name: 'intercom',
    description: '[Proxy v1 API] :: Scenario to test Rate Limit Exceeded Handling from Destination',
    successCriteria: 'Should return 429 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            ...updateUserRequestParameters,
            endpoint: 'https://api.intercom.io/users/test1',
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: 'Request Processed Successfully',
            response: [
              {
                error:
                  '{"type":"error.list","request_id":"request125","errors":[{"code":"rate_limit_exceeded","message":"The rate limit for the App has been exceeded"}]}',
                metadata: generateMetadata(1),
                statusCode: 429,
              },
            ],
            status: 429,
          },
        },
      },
    },
  },
  {
    id: 'intercom_v1_other_scenario_5',
    name: 'intercom',
    description: '[Proxy v1 API] :: Scenario to test Conflict User Handling from Destination',
    successCriteria: 'Should return 409 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: conflictUserPayload,
            headers: {
              ...commonHeaders,
              'Intercom-Version': '2.10',
            },
            endpoint: 'https://api.intercom.io/contacts',
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: 'Request Processed Successfully',
            response: [
              {
                error:
                  '{"type":"error.list","request_id":"request126","errors":[{"code":"conflict","message":"A contact matching those details already exists with id=test1"}]}',
                metadata: generateMetadata(1),
                statusCode: 409,
              },
            ],
            status: 409,
          },
        },
      },
    },
  },
  {
    id: 'intercom_v1_other_scenario_6',
    name: 'intercom',
    description: '[Proxy v1 API] :: Scenario to test Unsupported Media Handling from Destination',
    successCriteria: 'Should return 406 status code with error message',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            JSON: createUserPayload,
            headers: {
              ...commonHeaders,
              'Intercom-Version': '2.10',
            },
            endpoint: 'https://api.intercom.io/users',
          },
          metadataArray,
        ),
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: 'Request Processed Successfully',
            response: [
              {
                error:
                  '{"errors":[{"code":"media_type_not_acceptable","message":"The Accept header should send a media type of application/json"}],"type":"error.list"}',
                metadata: generateMetadata(1),
                statusCode: 406,
              },
            ],
            status: 406,
          },
        },
      },
    },
  },
];
