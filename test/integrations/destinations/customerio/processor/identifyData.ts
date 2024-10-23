import { destination, context } from '../common';
const traits = {
  anonymousId: 'anon-id',
  email: 'test@gmail.com',
  'dot.name': 'Arnab Pal',
  address: {
    city: 'NY',
    country: 'USA',
    postalCode: 712136,
    state: 'CA',
    street: '',
  },
};
function getResponse(endpoint, payload, userId) {
  return {
    version: '1',
    type: 'REST',
    method: 'PUT',
    endpoint,
    headers: {
      Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
    },
    params: {},
    body: {
      JSON: payload,
      XML: {},
      JSON_ARRAY: {},
      FORM: {},
    },
    files: {},
    userId,
    statusCode: 200,
  };
}
export const identifyData = [
  {
    name: 'customerio',
    id: 'Identify -> Test 0',
    description: 'Identify: Updating email and if for an already existing user using userId',
    successCriteria:
      'Recieved Status code 200 with payload/error as responseduring transformation and payload containing updated traits and userId in endpoint path',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              type: 'identify',
              userId: 'cio_1234',
              integrations: {
                All: true,
              },
              traits: {
                email: 'updated_email@example.com',
                id: 'updated-id-value',
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: getResponse(
              'https://track.customer.io/api/v1/customers/cio_1234',
              {
                email: 'updated_email@example.com',
                id: 'updated-id-value',
              },
              'cio_1234',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: 'identify -> Test 1',
    description:
      'identify: Creating a new user with some common traits with userID as main identifier',
    successCriteria:
      'Received Status code 200 with payload/error as responseresponse with request config after transformation and traits is given preference over context.traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                ...context,
                traits: {
                  email: 'test@rudderstack.com',
                },
              },
              user_properties: {
                prop1: 'val1',
                prop2: 'val2',
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              userId: '123456',
              integrations: {
                All: true,
              },
              traits,
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: getResponse(
              'https://track.customer.io/api/v1/customers/123456',
              {
                _timestamp: 1571043797,
                anonymous_id: '123456',
                city: 'NY',
                state: 'CA',
                street: '',
                prop1: 'val1',
                prop2: 'val2',
                country: 'USA',
                postalCode: 712136,
                email: 'test@gmail.com',
                'dot.name': 'Arnab Pal',
              },
              '123456',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: 'identify -> Test 2',
    description: 'identify: neither userId or email is present for user creation or updating',
    successCriteria:
      'Received Status code 200 with payload/error as responseresponse for transformation but got an instrumentation error od neither email or phone available',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              integrations: {
                All: true,
              },
              traits: {
                anonymousId: 'anon-id',
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination,
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'userId or email is not present',
            statTags: {
              destType: 'CUSTOMERIO',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: 'identify -> Test 3',
    description: 'identify: creating an user with email as main identifier',
    successCriteria:
      'Status code 200 with request payload and email included in endpoint as identifier ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context,
              user_properties: {
                prop1: 'val1',
                prop2: 'val2',
              },
              type: 'identify',
              messageId: '84e26acc-56a5-4835-8233-591137fca468',
              originalTimestamp: '2019-10-14T09:03:17.562Z',
              anonymousId: '123456',
              integrations: {
                All: true,
              },
              traits: {
                email: 'test@gmail.com',
                'dot.name': 'Arnab Pal',
                address: {
                  city: 'NY',
                  country: 'USA',
                  postalCode: 712136,
                  state: 'CA',
                  street: '',
                },
              },
              sentAt: '2019-10-14T09:03:22.563Z',
            },
            destination: {
              Config: {
                datacenter: 'EU',
                siteID: '46be54768e7d49ab2628',
                apiKey: 'dummyApiKey',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: getResponse(
              'https://track-eu.customer.io/api/v1/customers/test@gmail.com',
              {
                _timestamp: 1571043797,
                anonymous_id: '123456',
                city: 'NY',
                country: 'USA',
                'dot.name': 'Arnab Pal',
                email: 'test@gmail.com',
                postalCode: 712136,
                prop1: 'val1',
                prop2: 'val2',
                state: 'CA',
                street: '',
              },
              '123456',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: 'identify -> Test 4',
    description: 'identify: RETL: using externalId for setting identifier in endpoint',
    successCriteria:
      'Request Payload containing external id as main identifier and status code is 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'sources',
              context: {
                ...context,
                externalId: [
                  {
                    id: 'xaviercharles@hotmail.com',
                    identifierType: 'email',
                    type: 'CUSTOMERIO-customers',
                  },
                ],
                mappedToDestination: 'true',
              },
              messageId: 'd82a45e1-5a27-4c1d-af89-83bdbc6139d0',
              originalTimestamp: '2021-10-27T09:09:56.673Z',
              receivedAt: '2021-10-27T09:09:56.187Z',
              recordId: '3',
              request_ip: '10.1.85.177',
              rudderId: '5b19a81b-df60-4ccd-abf0-fcfe2b7db054',
              sentAt: '2021-10-27T09:09:56.673Z',
              timestamp: '2021-10-27T09:09:56.186Z',
              traits: {
                last_name: 'xavier',
                first_name: 'charles',
              },
              type: 'identify',
              userId: 'xaviercharles@gmail.com',
            },
            destination,
            libraries: [],
            request: {
              query: {},
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: getResponse(
              'https://track.customer.io/api/v1/customers/xaviercharles@hotmail.com',
              {
                last_name: 'xavier',
                first_name: 'charles',
                email: 'xaviercharles@hotmail.com',
                _timestamp: 1635325796,
              },
              'xaviercharles@hotmail.com',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
];
