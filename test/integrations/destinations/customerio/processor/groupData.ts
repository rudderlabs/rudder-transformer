import { destination, context } from '../common';
function getResponse(groupId, attributes, action, cio_relationships, userId) {
  return {
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint: 'https://track.customer.io/api/v2/batch',
    headers: {
      Authorization: 'Basic NDZiZTU0NzY4ZTdkNDlhYjI2Mjg6ZHVtbXlBcGlLZXk=',
    },
    params: {},
    body: {
      JSON: {
        type: 'object',
        action,
        attributes,
        identifiers: {
          object_id: groupId,
          object_type_id: '1',
        },
        cio_relationships,
      },
      XML: {},
      JSON_ARRAY: {},
      FORM: {},
    },
    files: {},
    userId,
    statusCode: 200,
  };
}
export const groupData = [
  {
    name: 'customerio',
    id: 'Test 0',
    description: 'successful group call with userId in email format ',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'group',
              header: {
                'content-type': 'application/json; charset=utf-8',
              },
              sentAt: '2023-03-28T09:36:49.882Z',
              traits: {
                city: 'Frankfurt',
                name: 'rudder test',
                state: 'Hessen',
                isFake: true,
                address: 'Solmsstraße 83',
                country: 'DE',
                website: 'http://www.rudderstack.com',
                industry: 'Waste and recycling',
                postcode: '60486',
                whiteLabel: 'rudderlabs',
                maxNbJobBoards: 2,
                organisationId: 306,
                pricingPackage: 'packageExpert',
                dateProTrialEnd: '2022-08-31T00:00:00+00:00',
                isProTrialActive: true,
                datetimeRegistration: '2020-07-01T10:23:41+00:00',
                isPersonnelServiceProvider: false,
              },
              userId: 'abc@xyz.com',
              channel: 'server',
              context,
              groupId: 306,
              rudderId: 'f5b46a12-2dab-4e24-a127-7316eed414fc',
              messageId: '7032394c-e813-4737-bf52-622dbcefe849',
              receivedAt: '2023-03-28T09:36:48.296Z',
              request_ip: '18.195.235.225',
              originalTimestamp: '2023-03-28T09:36:49.882Z',
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
              '306',
              {
                city: 'Frankfurt',
                name: 'rudder test',
                state: 'Hessen',
                isFake: true,
                address: 'Solmsstraße 83',
                country: 'DE',
                website: 'http://www.rudderstack.com',
                industry: 'Waste and recycling',
                postcode: '60486',
                whiteLabel: 'rudderlabs',
                maxNbJobBoards: 2,
                organisationId: 306,
                pricingPackage: 'packageExpert',
                dateProTrialEnd: '2022-08-31T00:00:00+00:00',
                isProTrialActive: true,
                datetimeRegistration: '2020-07-01T10:23:41+00:00',
                isPersonnelServiceProvider: false,
              },
              'identify',
              [
                {
                  identifiers: {
                    email: 'abc@xyz.com',
                  },
                },
              ],
              'abc@xyz.com',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: 'Test 1',
    feature: 'processor',
    description: 'successful group call with identify action',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context,
              groupId: 'group@1',
              integrations: {
                All: true,
              },
              traits: {
                domainNames: 'rudderstack.com',
                email: 'help@rudderstack.com',
                name: 'rudderstack',
                action: 'identify',
              },
              type: 'group',
              userId: 'user@1',
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
              'group@1',
              {
                name: 'rudderstack',
                email: 'help@rudderstack.com',
                domainNames: 'rudderstack.com',
              },
              'identify',
              [
                {
                  identifiers: {
                    id: 'user@1',
                  },
                },
              ],
              'user@1',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: 'Test 2',
    feature: 'processor',
    module: 'destination',
    description: 'successful group call with delete action',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.0-beta.2',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.0-beta.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              groupId: 'group@1',
              integrations: {
                All: true,
              },
              traits: {
                domainNames: 'rudderstack.com',
                email: 'help@rudderstack.com',
                name: 'rudderstack',
                action: 'delete',
              },
              type: 'group',
              userId: 'user@1',
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
              'group@1',
              {
                name: 'rudderstack',
                email: 'help@rudderstack.com',
                domainNames: 'rudderstack.com',
              },
              'delete',
              [
                {
                  identifiers: {
                    id: 'user@1',
                  },
                },
              ],
              'user@1',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: 'Test 3',
    description: 'successful group call with add_relationships action',
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
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.0-beta.2',
                },
                ip: '0.0.0.0',
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.1.0-beta.2',
                },
                locale: 'en-GB',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
                traits: {
                  email: 'test@rudderstack.com',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              groupId: 'group@1',
              integrations: {
                All: true,
              },
              traits: {
                domainNames: 'rudderstack.com',
                email: 'help@rudderstack.com',
                name: 'rudderstack',
                action: 'add_relationships',
              },
              type: 'group',
              userId: 'user@1',
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
              'group@1',
              {
                name: 'rudderstack',
                email: 'help@rudderstack.com',
                domainNames: 'rudderstack.com',
              },
              'add_relationships',
              [
                {
                  identifiers: {
                    id: 'user@1',
                  },
                },
              ],
              'user@1',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'customerio',
    id: 'Test 4',
    description: 'successful group call with delete_relationships action',
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
              groupId: 1090,
              integrations: {
                All: true,
              },
              traits: {
                domainNames: 'rudderstack.com',
                email: 'help@rudderstack.com',
                name: 'rudderstack',
                action: 'delete_relationships',
              },
              type: 'group',
              userId: 110,
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
              '1090',
              {
                name: 'rudderstack',
                email: 'help@rudderstack.com',
                domainNames: 'rudderstack.com',
              },
              'delete_relationships',
              [
                {
                  identifiers: {
                    id: '110',
                  },
                },
              ],
              '110',
            ),
            statusCode: 200,
          },
        ],
      },
    },
  },
];
