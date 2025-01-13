import { generateMetadata, generateProxyV1Payload } from '../../../testUtils';
import { ProxyV1TestData } from '../../../testTypes';

export const headerBlockWithCorrectAccessToken = {
  'Content-Type': 'application/json',
  Authorization: 'dummy-key',
};

export const contactPayload = {
  phone_number: '+919433127939',
  first_name: 'john',
  last_name: 'Doe',
};

export const statTags = {
  destType: 'CLICKSEND',
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
  {
    jobId: 3,
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
    jobId: 4,
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

export const singleMetadata = [
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
];

const commonIdentifyRequestParametersWithWrongData = {
  method: 'POST',
  headers: headerBlockWithCorrectAccessToken,
  JSON: { ...contactPayload, address_line_1: { city: 'kolkata' } },
};

const commonIdentifyRequestParameters = {
  method: 'POST',
  headers: headerBlockWithCorrectAccessToken,
  JSON: { ...contactPayload },
};

const commonIdentifyUpdateRequestParameters = {
  method: 'PUT',
  headers: headerBlockWithCorrectAccessToken,
  JSON: { ...contactPayload },
};

const trackSmSCampaignPayload = {
  method: 'POST',
  headers: headerBlockWithCorrectAccessToken,
  JSON: {
    list_id: 'wrong-id',
    name: 'My Campaign 1',
    body: 'This is my new campaign message.',
  },
};

const trackSmSSendPayload = {
  method: 'POST',
  headers: headerBlockWithCorrectAccessToken,
  JSON: {
    messages: [
      {
        body: 'test message, please ignore',
        to: '+919XXXXXXX8',
        from: '+9182XXXXXX8',
      },
      {
        body: 'test message, please ignore',
        to: '+919XXXXXXX9',
        from: '+9182XXXXXX8',
      },
      {
        body: 'test message, please ignore',
        to: '+919XXXXXXX0',
        from: '+9182XXXXXX8',
      },
      {
        body: 'test message, please ignore',
        to: '+919XXXXXXX7',
        from: '+9182XXXXXX8',
      },
    ],
  },
};

export const testScenariosForV1API: ProxyV1TestData[] = [
  {
    id: 'clicksend_v1_scenario_1',
    name: 'clicksend',
    description: 'Identify Event for creating contact fails due to wrong contact list Id',
    successCriteria: 'Should return 400 and aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://rest.clicksend.com/v3/lists/wrong-id/contacts',
            ...commonIdentifyRequestParameters,
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
            status: 403,
            statTags,
            message:
              'CLICKSEND: Error transformer proxy v1 during CLICKSEND response transformation. unknown error format',
            response: [
              {
                statusCode: 403,
                metadata: generateMetadata(1),
                error:
                  '{"http_code":403,"response_code":"FORBIDDEN","response_msg":"Resource not found or you don\'t have the permissions to access this resource.","data":null}',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'clicksend_v1_scenario_1',
    name: 'clicksend',
    description: 'Identify Event for updating contact fails due to wrong contact list Id',
    successCriteria: 'Should return 400 and aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://rest.clicksend.com/v3/lists/<wrong-id>/contacts/<right-id>',
            ...commonIdentifyUpdateRequestParameters,
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
              'CLICKSEND: Error transformer proxy v1 during CLICKSEND response transformation. unknown error format',
            response: [
              {
                statusCode: 404,
                metadata: generateMetadata(1),
                error:
                  '{"http_code":404,"response_code":"NOT_FOUND","response_msg":"Contact record not found.","data":null}',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'clicksend_v1_scenario_1',
    name: 'clicksend',
    description: 'Identify Event for updating contact fails due to wrong contact list Id',
    successCriteria: 'Should return 400 and aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://rest.clicksend.com/v3/lists/<right-id>/contacts/<wrong-id>',
            ...commonIdentifyUpdateRequestParameters,
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
              'CLICKSEND: Error transformer proxy v1 during CLICKSEND response transformation. unknown error format',
            response: [
              {
                statusCode: 404,
                metadata: generateMetadata(1),
                error:
                  '{"http_code":404,"response_code":"NOT_FOUND","response_msg":"Contact record not found.","data":null}',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'clicksend_v1_scenario_1',
    name: 'clicksend',
    description: 'Identify Event for creating contact fails due to wrong parameter',
    successCriteria: 'Should return 400 and aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://rest.clicksend.com/v3/lists/<right-id>/contacts/<right-id>',
            ...commonIdentifyRequestParametersWithWrongData,
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
              'CLICKSEND: Error transformer proxy v1 during CLICKSEND response transformation. unknown error format',
            response: [
              {
                statusCode: 400,
                metadata: generateMetadata(1),
                error:
                  '{"http_code":400,"response_code":400,"response_msg":"preg_replace(): Parameter mismatch, pattern is a string while replacement is an array","data":null}',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'clicksend_v1_scenario_1',
    name: 'clicksend',
    description: 'Track sms campaign Event fails due to wrong list id',
    successCriteria: 'Should return 400 and aborted',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://rest.clicksend.com/v3/sms-campaigns/send',
            ...trackSmSCampaignPayload,
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
              'CLICKSEND: Error transformer proxy v1 during CLICKSEND response transformation. unknown error format',
            response: [
              {
                statusCode: 404,
                metadata: generateMetadata(1),
                error:
                  '{"http_code":404,"response_code":"NOT_FOUND","response_msg":"Your list is not found.","data":null}',
              },
            ],
          },
        },
      },
    },
  },
  {
    id: 'clicksend_v1_scenario_1',
    name: 'clicksend',
    description: 'Track sms send Event partially passing',
    successCriteria: 'Should return 200 and 400 based on success status',
    scenario: 'Business',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: generateProxyV1Payload(
          {
            endpoint: 'https://rest.clicksend.com/v3/sms/send',
            ...trackSmSSendPayload,
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
            destinationResponse: {
              response: {
                data: {
                  _currency: {
                    currency_name_long: 'Indian Rupees',
                    currency_name_short: 'INR',
                    currency_prefix_c: '¢',
                    currency_prefix_d: '₹',
                  },
                  blocked_count: 2,
                  messages: [
                    {
                      body: 'test message, please ignore',
                      carrier: 'BSNL MOBILE',
                      contact_id: null,
                      country: 'IN',
                      custom_string: '',
                      date: 1718728461,
                      direction: 'out',
                      from: '+61447254068',
                      from_email: null,
                      is_shared_system_number: false,
                      list_id: null,
                      message_id: '1EF2D909-D81A-65FA-BEC7-33227BD3AB16',
                      message_parts: 1,
                      message_price: '7.7050',
                      schedule: 1718728461,
                      status: 'SUCCESS',
                      subaccount_id: 589721,
                      to: '+919XXXXXXX8',
                      user_id: 518988,
                    },
                    {
                      body: 'test message, please ignore',
                      carrier: 'BSNL MOBILE',
                      contact_id: null,
                      country: 'IN',
                      custom_string: '',
                      date: 1718728461,
                      direction: 'out',
                      from: '+61447254068',
                      from_email: null,
                      is_shared_system_number: false,
                      list_id: null,
                      message_id: '1EF2D909-D8C4-6D02-9EF0-1575A27E0783',
                      message_parts: 1,
                      message_price: '7.7050',
                      schedule: 1718728461,
                      status: 'SUCCESS',
                      subaccount_id: 589721,
                      to: '+919XXXXXXX9',
                      user_id: 518988,
                    },
                    {
                      body: 'test message, please ignore',
                      carrier: 'Optus',
                      country: 'AU',
                      custom_string: '',
                      from: '+61447238703',
                      is_shared_system_number: true,
                      message_id: '1EF2D909-D8CB-6684-AFF9-DDE3218AE055',
                      message_parts: 0,
                      message_price: '0.0000',
                      schedule: '',
                      status: 'COUNTRY_NOT_ENABLED',
                      to: '+614XXXXXX7',
                    },
                    {
                      body: 'test message, please ignore',
                      carrier: 'Optus',
                      country: 'AU',
                      custom_string: '',
                      from: '+61447268001',
                      is_shared_system_number: true,
                      message_id: '1EF2D909-D8D2-645C-A69F-57D016B5E549',
                      message_parts: 0,
                      message_price: '0.0000',
                      schedule: '',
                      status: 'COUNTRY_NOT_ENABLED',
                      to: '+614XXXXXXX2',
                    },
                  ],
                  queued_count: 2,
                  total_count: 4,
                  total_price: 15.41,
                },
                http_code: 200,
                response_code: 'SUCCESS',
                response_msg: 'Messages queued for delivery.',
              },
              status: 200,
            },
            message: '[CLICKSEND Response V1 Handler] - Request Processed Successfully',
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
              {
                statusCode: 400,
                metadata: generateMetadata(3),
                error: 'COUNTRY_NOT_ENABLED',
              },
              {
                statusCode: 400,
                metadata: generateMetadata(4),
                error: 'COUNTRY_NOT_ENABLED',
              },
            ],
          },
        },
      },
    },
  },
];

export const data = [...testScenariosForV1API];
