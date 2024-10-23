import { destination, context } from '../common';
function getResponse(endpoint, payload, userId, method) {
  return {
    version: '1',
    type: 'REST',
    method,
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
export const trackData = [
  {
    name: 'customerio',
    id: ' track -> Test 0',
    feature: 'processor',
    module: 'destination',
    description: 'track: sample test event with userId as main identifier',
    successCriteria: 'Request Payload containing userId as main identifier and status code is 200',
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
                  anonymousId: '12345',
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '12345',
              event: 'test track event',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
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
              'https://track.customer.io/api/v1/customers/12345/events',
              {
                type: 'event',
                data: {
                  user_actual_id: 12345,
                  user_actual_role: 'system_admin',
                  user_time_spent: 50000,
                },
                timestamp: 1571051718,
                name: 'test track event',
              },
              '12345',
              'POST',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: ' track -> Test 1',
    feature: 'processor',
    module: 'destination',
    description: 'track: sample test event with email as main identifier',
    successCriteria: 'Request Payload containing email as main identifier and status code is 200',
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
                  anonymousId: '12345',
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '',
              event: 'test track event',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
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
              'https://track-eu.customer.io/api/v1/customers/test@rudderstack.com/events',
              {
                type: 'event',
                data: {
                  user_actual_id: 12345,
                  user_actual_role: 'system_admin',
                  user_time_spent: 50000,
                },
                timestamp: 1571051718,
                name: 'test track event',
              },
              'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              'POST',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: ' track -> Test 2',
    description: 'track: sample test event with only anonymousId available',
    successCriteria:
      'Request Payload containing anonymousId at root level fetched from traits and status code is 200',
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
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              userId: '',
              event: 'test track event',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
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
              'https://track.customer.io/api/v1/events',
              {
                type: 'event',
                anonymous_id: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                data: {
                  user_actual_id: 12345,
                  user_actual_role: 'system_admin',
                  user_time_spent: 50000,
                },
                timestamp: 1571051718,
                name: 'test track event',
              },
              'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              'POST',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: ' track -> Test 3',
    feature: 'processor',
    module: 'destination',
    description:
      'track: Device Delete Event with device token available and email as main identifier',
    successCriteria:
      'No Payload in request body and endpoint contains device token and method is DELETE and status code is 200',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  token: 'abcxyz',
                },
                traits: {
                  userId: '12345',
                },
              },
              event: 'Application Uninstalled',
              integrations: {
                All: true,
              },
              messageId: '1578564113557-af022c68-429e-4af4-b99b-2b9174056383',
              properties: {},
              userId: '12345',
              originalTimestamp: '2020-01-09T10:01:53.558Z',
              type: 'track',
              sentAt: '2020-01-09T10:02:03.257Z',
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
              'https://track.customer.io/api/v1/customers/12345/devices/abcxyz',
              {},
              '12345',
              'DELETE',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: ' track -> Test 4',
    description:
      'track: Device Delete Event with device token available and email as main identifier',
    successCriteria:
      'No Payload in request body and endpoint contains device token and method is DELETE and status code is 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  name: 'test android',
                  type: 'mobile',
                  token: 'somel',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Uninstalled',
              properties: {},
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
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
              'https://track.customer.io/api/v1/customers/test@rudderstack.com/devices/somel',
              {},
              'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              'DELETE',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: ' track -> Test 5',
    feature: 'processor',
    module: 'destination',
    description: 'track: Device Delete Event with device token unavailable',
    successCriteria: 'Error for no device id present and status code is 200',

    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {},
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Uninstalled',
              properties: {},
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
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
            error: 'userId/email or device_token not present',
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
    id: ' track -> Test 6',
    description:
      'track: Device register Event with device token available and email as main identifier',
    successCriteria:
      'No Payload in request body and endpoint contains device token and method is PUT and status code is 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {
                device: {
                  token: 'somel',
                },
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.0.0',
                },
                traits: {
                  email: 'test@rudderstack.com',
                  anonymousId: '12345',
                },
              },
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Installed',
              properties: {
                user_actual_role: 'system_admin',
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
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
              'https://track.customer.io/api/v1/customers/test@rudderstack.com/devices',
              {
                device: {
                  id: 'somel',
                  last_used: 1571051718,
                  user_actual_role: 'system_admin',
                },
              },
              'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              'PUT',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: ' track -> Test 7',
    description:
      'track: Device register Event with device token available and userId as main identifier',
    successCriteria:
      'No Payload in request body and endpoint contains device token and method is PUT and status code is 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '7e32188a4dab669f',
              channel: 'mobile',
              context: {
                device: {
                  id: '7e32188a4dab669f',
                  manufacturer: 'Google',
                  model: 'Android SDK built for x86',
                  name: 'generic_x86',
                  type: 'ipados',
                  token: 'abcxyz',
                },
              },
              event: 'Application Installed',
              integrations: {
                All: true,
              },
              messageId: '1578564113557-af022c68-429e-4af4-b99b-2b9174056383',
              properties: {
                review_id: 'some_review_id',
                product_id: 'some_product_id_a',
                rating: 2,
                review_body: 'Some Review Body',
              },
              userId: '12345',
              originalTimestamp: '2020-01-09T10:01:53.558Z',
              type: 'track',
              sentAt: '2020-01-09T10:02:03.257Z',
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
              'https://track-eu.customer.io/api/v1/customers/12345/devices',
              {
                device: {
                  review_body: 'Some Review Body',
                  rating: 2,
                  review_id: 'some_review_id',
                  last_used: 1578564113,
                  platform: 'ios',
                  id: 'abcxyz',
                  product_id: 'some_product_id_a',
                },
              },
              '12345',
              'PUT',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: ' track -> Test 8',
    description: 'No device token for application installed event',
    successCriteria:
      'Request contains normal event payload and endpoint and not the device register one as there is no device token present and statusCode is 200 ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'mobile',
              context: {},
              type: 'track',
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2019-10-14T11:15:18.300Z',
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'Application Installed',
              userId: '12345',
              properties: {
                user_actual_role: 'system_admin',
                user_actual_id: 12345,
                user_time_spent: 50000,
              },
              integrations: {
                All: true,
              },
              sentAt: '2019-10-14T11:15:53.296Z',
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
              'https://track-eu.customer.io/api/v1/customers/12345/events',
              {
                type: 'event',
                data: {
                  user_actual_id: 12345,
                  user_actual_role: 'system_admin',
                  user_time_spent: 50000,
                },
                timestamp: 1571051718,
                name: 'Application Installed',
              },
              '12345',
              'POST',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: ' track -> Test 9',
    description:
      'track: Device register Event with device token and properties available and userId as main identifier',
    successCriteria:
      'Payload containg propertiers and context traits in request body and endpoint contains device token and method is PUT and status code is 200',

    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
              channel: 'mobile',
              context: {
                device: {
                  attTrackingStatus: 0,
                  id: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  manufacturer: 'Apple',
                  model: 'iPhone',
                  name: 'iPhone 13',
                  token: 'deviceToken',
                  type: 'iOS',
                },
                traits: {
                  anonymousId: '5d727a3e-a72b-4d00-8078-669c1494791d',
                  email: 'sofia@gmail.com',
                  login_status: 'Authenticated',
                  name: 'Sofia',
                  phone_verified: 1,
                  selected_city: '',
                  selected_lat: 0,
                  selected_long: 0,
                  selected_neighborhood: '',
                  selected_number: '',
                  selected_postal_code: '',
                  selected_state: '',
                  selected_street: '',
                  signed_up_for_newsletters: 0,
                  userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
                },
              },
              event: 'Application Opened',
              integrations: {
                All: true,
              },
              messageId: '1641808826-28d23237-f4f0-4f65-baa2-99141e422a8f',
              timestamp: '2022-01-10T10:00:26.513Z',
              properties: {
                from_background: false,
              },
              receivedAt: '2022-01-10T20:35:30.556+05:30',
              request_ip: '[::1]',
              rudderId: '423cdf83-0448-4a99-b14d-36fcc63e6ea0',
              sentAt: '2022-01-10T10:00:26.982Z',
              type: 'track',
              userId: 'e91e0378-63fe-11ec-82ac-0a028ee659c3',
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
              'https://track.customer.io/api/v1/customers/e91e0378-63fe-11ec-82ac-0a028ee659c3/devices',
              {
                device: {
                  from_background: false,
                  id: 'deviceToken',
                  platform: 'ios',
                  last_used: 1641808826,
                },
              },
              'e91e0378-63fe-11ec-82ac-0a028ee659c3',
              'PUT',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
];
