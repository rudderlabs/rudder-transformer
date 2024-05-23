import {
  context,
  destination,
  destinationWithWrongUrl,
  destinationWithoutHeaders,
} from '../commonConfig';
import { generalProperties, userProperties } from '../basicProperties';

export const data = [
  {
    name: 'webhook',
    id: 'Test 0 - processor',
    description: 'Basic track call',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_0',
              context,
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: generalProperties,
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: userProperties,
            },
            destination,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {
                  anonymousId: 'anon_0',
                  context,
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: generalProperties,
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                  user_properties: userProperties,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_0',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 1 - processor',
    description: 'Track -> No headers in config object',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_1',
              context,
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: generalProperties,
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: userProperties,
            },
            destination: destinationWithoutHeaders,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {
                  anonymousId: 'anon_1',
                  context,
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: generalProperties,
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                  user_properties: userProperties,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_1',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/json',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 2 - processor',
    description: 'Track call -> with destination having wrong url',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_2',
              context,
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: generalProperties,
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: userProperties,
            },
            destination: destinationWithWrongUrl,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {
                  anonymousId: 'anon_2',
                  context,
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: generalProperties,
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                  user_properties: userProperties,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_2',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://6b0e6a60.',
              headers: {
                'content-type': 'application/json',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 3 - processor',
    description: 'Track call, having distinct properties, webhookMethod -> GET, output -> params',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_3',
              context,
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                k1: 'v1',
                k2: {
                  k3: 'c3',
                  k4: {
                    k5: 'c5',
                  },
                },
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
            },
            destination: {
              Config: {
                webhookUrl: 'https://6b0e6a60.',
                webhookMethod: 'GET',
                headers: [
                  {
                    from: 'X-customHeader',
                    to: 'customHeaderVal',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_3',
              type: 'REST',
              method: 'GET',
              endpoint: 'https://6b0e6a60.',
              headers: {
                'x-customheader': 'customHeaderVal',
              },
              params: {
                k1: 'v1',
                'k2.k3': 'c3',
                'k2.k4.k5': 'c5',
              },
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 4 - processor',
    description: 'Track call, having distinct properties, webhookMethod -> GET, output -> params',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_4',
              context,
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                k1: 'v1',
                k2: {
                  k3: 'c3',
                  k4: {
                    k5: 'c5',
                  },
                },
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
            },
            destination: {
              Config: {
                webhookUrl: 'https://6b0e6a60.',
                webhookMethod: 'GET',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_4',
              type: 'REST',
              method: 'GET',
              endpoint: 'https://6b0e6a60.',
              headers: {},
              params: {
                k1: 'v1',
                'k2.k3': 'c3',
                'k2.k4.k5': 'c5',
              },
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 5 - processor',
    description: 'Track call, having request_ip, method -> POST',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_5',
              context,
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: generalProperties,
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              request_ip: '127.0.0.1',
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                header: [
                  {
                    from: 'test1',
                    to: 'value1',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {
                  anonymousId: 'anon_5',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: {
                      carrier: 'Banglalink',
                    },
                    os: {
                      name: 'android',
                      version: '8.1.0',
                    },
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                    ip: '127.0.0.1',
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: generalProperties,
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                  request_ip: '127.0.0.1',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_5',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/json',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 6 - processor',
    description: 'Track call, method -> POST',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_6',
              context,
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: generalProperties,
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              request_ip: '127.0.0.1',
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                headers: [
                  {
                    from: 'Content-Type',
                    to: 'application/xml',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {
                  anonymousId: 'anon_6',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: {
                      carrier: 'Banglalink',
                    },
                    os: {
                      name: 'android',
                      version: '8.1.0',
                    },
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                    ip: '127.0.0.1',
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: generalProperties,
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                  request_ip: '127.0.0.1',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_6',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/xml',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 7 - processor',
    description: 'Track call, method -> POST',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_7',
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: generalProperties,
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                headers: [
                  {
                    from: 'Content-Type',
                    to: 'application/xml',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {
                  anonymousId: 'anon_7',
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: generalProperties,
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_7',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/xml',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 8 - processor',
    description: 'Track call -> with appendPath and distinct headers, method -> POST',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_8',
              context,
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                additional_bet_index: 0,
                battle_id: 'N/A',
                featureGameType: 'N/A',
                win_amount: 0,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              header: {
                dynamic_header_key_string: 'dynamic_header_value_string',
                dynamic_header_key_num: 10,
                dynamic_header_key_object: {
                  k1: 'v1',
                },
              },
              appendPath: '/product/search?string=value',
            },
            destination,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {
                  anonymousId: 'anon_8',
                  context,
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
                    additional_bet_index: 0,
                    battle_id: 'N/A',
                    featureGameType: 'N/A',
                    win_amount: 0,
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_8',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io/product/search?string=value',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
                dynamic_header_key_string: 'dynamic_header_value_string',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 9 - processor',
    description: 'Track calls -> with fullPath, method -> POST',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_9',
              context,
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                additional_bet_index: 0,
                battle_id: 'N/A',
                featureGameType: 'N/A',
                win_amount: 0,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              fullPath: 'https://www.google.com',
            },
            destination,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {
                  anonymousId: 'anon_9',
                  context,
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
                    additional_bet_index: 0,
                    battle_id: 'N/A',
                    featureGameType: 'N/A',
                    win_amount: 0,
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_9',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://www.google.com',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 10 - processor',
    description: 'Basic track calls',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_10',
              context,
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                additional_bet_index: 0,
                battle_id: 'N/A',
                featureGameType: 'N/A',
                win_amount: 0,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              fullPath: 'https://www.google.com/',
              appendPath: '?searchTerms=cats',
            },
            destination,
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {
                  anonymousId: 'anon_10',
                  context,
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
                    additional_bet_index: 0,
                    battle_id: 'N/A',
                    featureGameType: 'N/A',
                    win_amount: 0,
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_10',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://www.google.com/?searchTerms=cats',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 11 - processor',
    description: 'Basic track calls',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_11',
              context,
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                additional_bet_index: 0,
                battle_id: 'N/A',
                featureGameType: 'N/A',
                win_amount: 0,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              fullPath: 'https://www.google.com/',
              appendPath: '?searchTerms=cats',
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                webhookMethod: 'PUT',
                headers: [
                  {
                    from: '',
                    to: '',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {
                  anonymousId: 'anon_11',
                  context,
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
                    additional_bet_index: 0,
                    battle_id: 'N/A',
                    featureGameType: 'N/A',
                    win_amount: 0,
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_11',
              type: 'REST',
              method: 'PUT',
              endpoint: 'https://www.google.com/?searchTerms=cats',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 12 - processor',
    description: 'Basic track calls',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_12',
              context,
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                additional_bet_index: 0,
                battle_id: 'N/A',
                featureGameType: 'N/A',
                win_amount: 0,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              fullPath: 'https://www.google.com/',
              appendPath: '?searchTerms=cats',
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                webhookMethod: 'DELETE',
                headers: [
                  {
                    from: '',
                    to: '',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_12',
              type: 'REST',
              method: 'DELETE',
              endpoint: 'https://www.google.com/?searchTerms=cats',
              headers: {
                test2: 'value2',
              },
              params: {
                additional_bet_index: 0,
                battle_id: 'N/A',
                featureGameType: 'N/A',
                win_amount: 0,
              },
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 13 - processor',
    description: 'Basic track calls',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_13',
              context,
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: generalProperties,
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: userProperties,
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                webhookMethod: 'POST',
                headers: [
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {
                  anonymousId: 'anon_13',
                  context,
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: generalProperties,
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                  user_properties: userProperties,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_13',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 14 - processor',
    description: 'Basic track calls',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_14',
              context,
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: generalProperties,
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: userProperties,
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                webhookMethod: 'PATCH',
                headers: [
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {
                  anonymousId: 'anon_14',
                  context,
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: generalProperties,
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                  user_properties: userProperties,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_14',
              type: 'REST',
              method: 'PATCH',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 15 - processor',
    description: 'Test POST method with track message type',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_15',
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                additional_bet_index: 0,
                level: 1,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                headers: [
                  {
                    from: 'Content-Type',
                    to: 'application/xml',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {
                  anonymousId: 'anon_15',
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
                    additional_bet_index: 0,
                    level: 1,
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_15',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/xml',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    id: 'Test 16 - processor',
    description: 'Test method PATCH',
    scenario: 'Framework',
    successCriteria: 'Event should be transformed successfully and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'anon_16',
              context: {
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                prop1: 1,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: {
                coin_balance: 9466052,
              },
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                webhookMethod: 'PATCH',
                headers: [
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
            output: {
              body: {
                JSON: {
                  anonymousId: 'anon_16',
                  context: {
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
                    prop1: 1,
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                  user_properties: {
                    coin_balance: 9466052,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'anon_16',
              type: 'REST',
              method: 'PATCH',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
