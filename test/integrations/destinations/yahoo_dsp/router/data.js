const data = [
  {
    name: 'yahoo_dsp',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
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
              metadata: {
                jobId: 1,
              },
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
                        phone: '09432457768',
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
                        phone: '09432457768',
                        firstName: 'sudip',
                        lastName: 'paul',
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
                        phone: '@09432457768',
                        firstName: 'sudip',
                        lastName: 'paul',
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
                context: {
                  ip: '14.5.67.21',
                  library: {
                    name: 'http',
                  },
                },
                timestamp: '2020-02-02T00:23:09.544Z',
              },
            },
          ],
          destType: 'yahoo_dsp',
        },
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'PUT',
                endpoint:
                  'https://dspapi.admanagerplus.yahoo.com/traffic/audiences/email_address/34893',
                headers: {
                  'X-Auth-Method': 'OAuth2',
                  'X-Auth-Token': 'fb8c05c9-3a32-409a-9993-3f53d307fe75',
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
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
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
        },
      },
    },
  },
];

module.exports = {
  data,
};
