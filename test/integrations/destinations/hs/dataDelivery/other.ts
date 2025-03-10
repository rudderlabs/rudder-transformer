import { generateMetadata } from '../../../testUtils';
import { authHeader1 } from '../maskedSecrets';

const commonStatTags = {
  destType: 'HS',
  destinationId: 'default-destinationId',
  errorCategory: 'network',
  errorType: 'retryable',
  feature: 'dataDelivery',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

const commonBody = {
  version: '1',
  type: 'REST',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: authHeader1,
  },
  params: {},
  files: {},
  metadata: [generateMetadata(1), generateMetadata(2)],
  body: {
    JSON: {
      inputs: [
        {
          properties: {
            firstname: 'testmail1217',
          },
          id: '12877907024',
        },
        {
          properties: {
            firstname: 'test1',
            email: 'test1@mail.com',
          },
          id: '12877907025',
        },
      ],
    },
    JSON_ARRAY: {},
    XML: {},
    FORM: {},
  },
};

export const otherData = [
  {
    name: 'hs',
    id: 'hs_datadelivery_other_00',
    description: 'failed due to gateway timeout from hubspot',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          endpoint: 'https://random_test_url/test_for_gateway_time_out',
          ...commonBody,
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'HUBSPOT: Error in transformer proxy v1 during HUBSPOT response transformation',
            response: [
              {
                error: '"Gateway Timeout"',
                metadata: generateMetadata(1),
                statusCode: 504,
              },
              {
                error: '"Gateway Timeout"',
                metadata: generateMetadata(2),
                statusCode: 504,
              },
            ],
            statTags: commonStatTags,
            status: 504,
          },
        },
      },
    },
  },
  {
    name: 'hs',
    id: 'hs_datadelivery_other_01',
    description: 'failed due to internal server error from hubspot',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          endpoint: 'https://random_test_url/test_for_internal_server_error',
          ...commonBody,
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'HUBSPOT: Error in transformer proxy v1 during HUBSPOT response transformation',
            response: [
              {
                error: '"Internal Server Error"',
                metadata: generateMetadata(1),
                statusCode: 500,
              },
              {
                error: '"Internal Server Error"',
                metadata: generateMetadata(2),
                statusCode: 500,
              },
            ],
            statTags: commonStatTags,
            status: 500,
          },
        },
      },
    },
  },
  {
    name: 'hs',
    id: 'hs_datadelivery_other_02',
    description: 'failed due to service unavailable error from hubspot',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          endpoint: 'https://random_test_url/test_for_service_not_available',
          ...commonBody,
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message:
              'HUBSPOT: Error in transformer proxy v1 during HUBSPOT response transformation',
            response: [
              {
                error:
                  '{"error":{"message":"Service Unavailable","description":"The server is currently unable to handle the request due to temporary overloading or maintenance of the server. Please try again later."}}',
                metadata: generateMetadata(1),
                statusCode: 503,
              },
              {
                error:
                  '{"error":{"message":"Service Unavailable","description":"The server is currently unable to handle the request due to temporary overloading or maintenance of the server. Please try again later."}}',
                metadata: generateMetadata(2),
                statusCode: 503,
              },
            ],
            statTags: commonStatTags,
            status: 503,
          },
        },
      },
    },
  },
  {
    name: 'hs',
    id: 'hs_datadelivery_other_03',
    description: 'getting success response but not in the expected format',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v1',
    input: {
      request: {
        body: {
          endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts/batch/update',
          version: '1',
          type: 'REST',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader1,
          },
          params: {},
          files: {},
          metadata: [generateMetadata(1), generateMetadata(2)],
          body: {
            JSON: {
              inputs: [
                {
                  properties: {
                    firstname: 'testmail12178',
                  },
                  id: '12877907024',
                },
                {
                  properties: {
                    firstname: 'test1',
                    email: 'test1@mail.com',
                  },
                  id: '12877907025',
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            message: '[HUBSPOT Response V1 Handler] - Request Processed Successfully',
            response: [
              {
                error: 'success',
                metadata: generateMetadata(1),
                statusCode: 200,
              },
              {
                error: 'success',
                metadata: generateMetadata(2),
                statusCode: 200,
              },
            ],
            status: 200,
          },
        },
      },
    },
  },
];
