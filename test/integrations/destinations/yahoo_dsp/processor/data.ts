import { addMock } from '../../../testUtils';
import { networkCallsData } from '../network';

export const mockFns = (mockAdapter) => {
  addMock(mockAdapter, networkCallsData[0]);
  // 21 September 2023 19:39:50 GMT+05:30
  Date.now = jest.fn(() => 1695305390000);
};
export const data = [
  {
    name: 'yahoo_dsp',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      ipAddress: 'fdffddf',
                      email: 'alex@email.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '09876543210',
                      firstName: 'alex',
                      lastName: 'hales',
                      country: 'AUS',
                      postalCode: '1245',
                      includeChains: 1573,
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'amy@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      includeChains: 1573,
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'van@abc.com ',
                      deviceId: 'djfdjfkdjf',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      includeChains: 1573,
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 2,
                    },
                  ],
                },
                enablePartialFailure: true,
              },
              context: { ip: '14.5.67.21', library: { name: 'http' } },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: 'sjhdkhfrz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFR4rXQg',
                audienceType: 'EMAIL',
                accountId: '12444',
                audienceId: '34893',
                hashRequired: true,
              },
              ID: 'iwehr83843',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'PUT',
              endpoint:
                'https://dspapi.admanagerplus.yahoo.com/traffic/audiences/email_address/34893',
              headers: {
                'X-Auth-Method': 'OAuth2',
                'X-Auth-Token': 'testAuthToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  seedList: [
                    'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
                    '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
                    '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
                  ],
                  accountId: '12444',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'yahoo_dsp',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      ipAddress: 'fdffddf',
                      deviceId: 'djfdjfkdjf',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      postalCode: '1245',
                      includeChains: 1573,
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'amy@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      includeChains: 1573,
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'van@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      includeChains: 1573,
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 2,
                    },
                  ],
                },
              },
              context: { ip: '14.5.67.21', library: { name: 'http' } },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdeb8-f459-4cd6-b4c5-958b3d663242',
                clientSecret: 'abcdePsz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFRdsfd',
                audienceType: 'EMAIL',
                accountId: '12444',
                audienceId: '34893',
                hashRequired: true,
              },
              ID: 'iwehr83843',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Required property for email type audience is not available in an object',
            statTags: {
              destType: 'YAHOO_DSP',
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
    name: 'yahoo_dsp',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      ipAddress: 'fdffddf',
                      email: 'alex@email.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '09876543210',
                      firstName: 'alex',
                      lastName: 'hales',
                      country: 'AUS',
                      postalCode: '1245',
                      includeChains: 1573,
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'amy@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      includeChains: 1573,
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'van@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      includeChains: 1573,
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 2,
                    },
                  ],
                },
              },
              context: { ip: '14.5.67.21', library: { name: 'http' } },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdeb8-f459-4cd6-b4c5-958b3d663242',
                clientSecret: 'abcdePsz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFRdsfd',
                audienceType: 'DEVICE_ID',
                accountId: '12444',
                audienceId: '34893',
                hashRequired: true,
                seedListType: 'IDFA',
              },
              ID: 'iwehr83843',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'PUT',
              endpoint: 'https://dspapi.admanagerplus.yahoo.com/traffic/audiences/device_id/34893',
              headers: {
                'X-Auth-Token': 'testAuthToken',
                'X-Auth-Method': 'OAuth2',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  accountId: '12444',
                  seedList: [
                    'd3495732378523014e58b1e040f919a3616946f765860b8dd388cf575c26735e',
                    'd3495732378523014e58b1e040f919a3616946f765860b8dd388cf575c26735e',
                    'd3495732378523014e58b1e040f919a3616946f765860b8dd388cf575c26735e',
                  ],
                  seedListType: 'IDFA',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'yahoo_dsp',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      ipAddress: 'fdffddf',
                      email: 'alex@email.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '09876543210',
                      firstName: 'alex',
                      lastName: 'hales',
                      country: 'AUS',
                      postalCode: '1245',
                      includeChains: 1573,
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'amy@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      includeChains: 1573,
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'van@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      includeChains: 1573,
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 2,
                    },
                  ],
                },
              },
              context: { ip: '14.5.67.21', library: { name: 'http' } },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdeb8-f459-4cd6-b4c5-958b3d663242',
                clientSecret: 'abcdePsz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFRdsfd',
                audienceType: 'IP_ADDRESS',
                accountId: '12444',
                audienceId: '34893',
                hashRequired: true,
                seedListType: 'IDFA',
              },
              ID: 'iwehr83843',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'PUT',
              endpoint:
                'https://dspapi.admanagerplus.yahoo.com/traffic/audiences/customsegments/34893',
              headers: {
                'X-Auth-Token': 'testAuthToken',
                'X-Auth-Method': 'OAuth2',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  accountId: '12444',
                  seedList: [
                    '86a50ed7952688691a2dcbb5dda3a1227097e8fc3878ca7368135c7dc7b5a083',
                    '86a50ed7952688691a2dcbb5dda3a1227097e8fc3878ca7368135c7dc7b5a083',
                    '86a50ed7952688691a2dcbb5dda3a1227097e8fc3878ca7368135c7dc7b5a083',
                  ],
                  seedListType: 'SHA256IP',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'yahoo_dsp',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      ipAddress: 'fdffddf',
                      email: 'alex@email.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '09876543210',
                      firstName: 'alex',
                      lastName: 'hales',
                      country: 'AUS',
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'amy@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'van@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 2,
                    },
                  ],
                },
              },
              context: { ip: '14.5.67.21', library: { name: 'http' } },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdeb8-f459-4cd6-b4c5-958b3d663242',
                clientSecret: 'abcdePsz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFRdsfd',
                audienceType: 'DEVICE_ID',
                accountId: '12444',
                audienceId: '34893',
                hashRequired: true,
              },
              ID: 'iwehr83843',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              "seedListType is required for deviceId type audience and it should be any one of 'IDFA' and 'GPADVID'",
            statTags: {
              destType: 'YAHOO_DSP',
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
    name: 'yahoo_dsp',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      ipAddress: 'fdffddf',
                      email: 'alex@email.com',
                      phone: '09876543210',
                      firstName: 'alex',
                      lastName: 'hales',
                      country: 'AUS',
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'amy@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'van@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 2,
                    },
                  ],
                },
              },
              context: { ip: '14.5.67.21', library: { name: 'http' } },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdeb8-f459-4cd6-b4c5-958b3d663242',
                clientSecret: 'abcdePsz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFRdsfd',
                audienceType: 'DEVICE_ID',
                accountId: '12444',
                audienceId: '34893',
                hashRequired: true,
                seedListType: 'IDFA',
              },
              ID: 'iwehr83843',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Required property for deviceId type audience is not available in an object',
            statTags: {
              destType: 'YAHOO_DSP',
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
    name: 'yahoo_dsp',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      ipAddress: 'fdffddf',
                      email: 'van@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 2,
                    },
                  ],
                },
              },
              context: { ip: '14.5.67.21', library: { name: 'http' } },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdeb8-f459-4cd6-b4c5-958b3d663242',
                clientSecret: 'abcdePsz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFRdsfd',
                audienceType: 'DEVICEID',
                accountId: '12444',
                audienceId: '34893',
                hashRequired: true,
                seedListType: 'IDFA',
              },
              ID: 'iwehr83843',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Audience Type DEVICEID is not supported',
            statTags: {
              destType: 'YAHOO_DSP',
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
    name: 'yahoo_dsp',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {
                listData: {
                  remove: [
                    {
                      ipAddress: 'fdffddf',
                      email: 'alex@email.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '09876543210',
                      firstName: 'alex',
                      lastName: 'hales',
                      country: 'AUS',
                      postalCode: '1245',
                      includeChains: 1573,
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'amy@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      includeChains: 1573,
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'van@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      includeChains: 1573,
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 2,
                    },
                  ],
                },
                enablePartialFailure: true,
              },
              context: { ip: '14.5.67.21', library: { name: 'http' } },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: 'sjhdkhfrz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFR4rXQg',
                audienceType: 'EMAIL',
                accountId: '12444',
                audienceId: '34893',
                hashRequired: true,
              },
              ID: 'iwehr83843',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: "The only supported operation for audience updation 'add' is not present",
            statTags: {
              destType: 'YAHOO_DSP',
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
    name: 'yahoo_dsp',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user 1',
              type: 'track',
              properties: {
                listData: {
                  add: [
                    {
                      ipAddress: 'fdffddf',
                      email: 'alex@email.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '09876543210',
                      firstName: 'alex',
                      lastName: 'hales',
                      country: 'AUS',
                      postalCode: '1245',
                      includeChains: 1573,
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'amy@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      includeChains: 1573,
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'van@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      includeChains: 1573,
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 2,
                    },
                  ],
                },
                enablePartialFailure: true,
              },
              context: { ip: '14.5.67.21', library: { name: 'http' } },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: 'sjhdkhfrz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFR4rXQg',
                audienceType: 'EMAIL',
                accountId: '12444',
                audienceId: '34893',
                hashRequired: true,
              },
              ID: 'iwehr83843',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event type track is not supported',
            statTags: {
              destType: 'YAHOO_DSP',
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
    name: 'yahoo_dsp',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user 1',
              properties: {
                listData: {
                  add: [
                    {
                      ipAddress: 'fdffddf',
                      email: 'alex@email.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '09876543210',
                      firstName: 'alex',
                      lastName: 'hales',
                      country: 'AUS',
                      postalCode: '1245',
                      includeChains: 1573,
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'amy@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      includeChains: 1573,
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 1,
                    },
                    {
                      ipAddress: 'fdffddf',
                      email: 'van@abc.com',
                      deviceId: 'djfdjfkdjf',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      includeChains: 1573,
                      postalCode: '1245',
                      mailDomain: 'yahoo.com',
                      categoryIds: 2,
                    },
                  ],
                },
                enablePartialFailure: true,
              },
              context: { ip: '14.5.67.21', library: { name: 'http' } },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdef8-f49-4cd6-b4c5-958b3d66d431',
                clientSecret: 'sjhdkhfrz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFR4rXQg',
                audienceType: 'EMAIL',
                accountId: '12444',
                audienceId: '34893',
                hashRequired: true,
              },
              ID: 'iwehr83843',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event type is required',
            statTags: {
              destType: 'YAHOO_DSP',
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
    name: 'yahoo_dsp',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              properties: {},
              context: { ip: '14.5.67.21', library: { name: 'http' } },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdeb8-f459-4cd6-b4c5-958b3d663242',
                clientSecret: 'abcdePsz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFRdsfd',
                audienceType: 'POINT_OF_INTEREST',
                accountId: '12444',
                audienceId: '34893',
                hashRequired: true,
                seedListType: 'IDFA',
              },
              ID: 'iwehr83843',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'listData is not present inside properties. Aborting message',
            statTags: {
              destType: 'YAHOO_DSP',
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
    name: 'yahoo_dsp',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              userId: 'user 1',
              type: 'audiencelist',
              context: { ip: '14.5.67.21', library: { name: 'http' } },
              timestamp: '2020-02-02T00:23:09.544Z',
            },
            destination: {
              Config: {
                clientId: 'abcdeb8-f459-4cd6-b4c5-958b3d663242',
                clientSecret: 'abcdePsz6yc9LrRRIPimE9h53jADLccXTykHCcA6eEoFRdsfd',
                audienceType: 'POINT_OF_INTEREST',
                accountId: '12444',
                audienceId: '34893',
                hashRequired: true,
                seedListType: 'IDFA',
              },
              ID: 'iwehr83843',
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Message properties is not present. Aborting message',
            statTags: {
              destType: 'YAHOO_DSP',
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
].map((d) => {
  return { ...d, mockFns };
});
