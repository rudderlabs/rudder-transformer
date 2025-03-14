import { authHeader1, secret1 } from '../maskedSecrets';

export const data = [
  {
    name: 'freshsales',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                context: {
                  device: { name: 'Mi', token: 'dummyDeviceToken' },
                  os: { name: 'android' },
                  traits: {
                    address: {
                      city: 'city',
                      country: 'country',
                      postalCode: 'postalCode',
                      state: 'state',
                      street: 'street',
                    },
                    email: 'user112@mail.com',
                    firstName: 'sample1',
                    lastName: 'user1',
                  },
                },
                messageId: '8184ebd7-3a19-45a3-a340-d6f449c63d27',
                originalTimestamp: '2022-08-30T11:28:48.429+05:30',
                receivedAt: '2022-08-30T11:28:43.648+05:30',
                request_ip: '[::1]',
                rudderId: 'ed33ef22-569d-44b1-a6cb-063c69dca8f0',
                sentAt: '2022-08-30T11:28:48.429+05:30',
                timestamp: '2022-08-30T11:28:43.647+05:30',
                type: 'identify',
                userId: 'user113',
              },
              destination: {
                ID: '2E3xCNR3sae33y3AkGzuQ3ym05v',
                Name: 'test',
                DestinationDefinition: {
                  ID: '2E3x3AwySRvh6vXgYslvYApyFPb',
                  Name: 'FRESHSALES',
                  DisplayName: 'Freshsales',
                  Config: {
                    destConfig: { defaultConfig: ['apiKey', 'domain'] },
                    excludeKeys: [],
                    includeKeys: ['apiKey', 'domain'],
                    saveDestinationResponse: true,
                    supportedMessageTypes: ['identify', 'group'],
                    supportedSourceTypes: [
                      'amp',
                      'android',
                      'cordova',
                      'cloud',
                      'flutter',
                      'ios',
                      'reactnative',
                      'unity',
                      'warehouse',
                      'web',
                    ],
                    transformAt: 'processor',
                    transformAtV1: 'processor',
                  },
                  ResponseRules: {},
                },
                Config: {
                  apiKey: secret1,
                  domain: 'rudderstack-479541159204968909.myfreshworks.com',
                },
                Enabled: true,
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2E3xCLWeb83vOGDh0mkN4Auei3i',
              },
              metadata: { userId: 'u1' },
            },
          ],
          destType: 'freshsales',
        },
        method: 'POST',
      },
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
                method: 'POST',
                endpoint:
                  'https://rudderstack-479541159204968909.myfreshworks.com/crm/sales/api/contacts/upsert',
                headers: {
                  Authorization: authHeader1,
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    contact: {
                      emails: 'user112@mail.com',
                      first_name: 'sample1',
                      last_name: 'user1',
                      external_id: 'user113',
                      address: 'street city state country postalCode',
                      city: 'city',
                      state: 'state',
                      country: 'country',
                      zipcode: 'postalCode',
                      created_at: '2022-08-30T11:28:43.647+05:30',
                      updated_at: '2022-08-30T11:28:43.647+05:30',
                    },
                    unique_identifier: { emails: 'user112@mail.com' },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: {
                ID: '2E3xCNR3sae33y3AkGzuQ3ym05v',
                Name: 'test',
                DestinationDefinition: {
                  ID: '2E3x3AwySRvh6vXgYslvYApyFPb',
                  Name: 'FRESHSALES',
                  DisplayName: 'Freshsales',
                  Config: {
                    destConfig: { defaultConfig: ['apiKey', 'domain'] },
                    excludeKeys: [],
                    includeKeys: ['apiKey', 'domain'],
                    saveDestinationResponse: true,
                    supportedMessageTypes: ['identify', 'group'],
                    supportedSourceTypes: [
                      'amp',
                      'android',
                      'cordova',
                      'cloud',
                      'flutter',
                      'ios',
                      'reactnative',
                      'unity',
                      'warehouse',
                      'web',
                    ],
                    transformAt: 'processor',
                    transformAtV1: 'processor',
                  },
                  ResponseRules: {},
                },
                Config: {
                  apiKey: secret1,
                  domain: 'rudderstack-479541159204968909.myfreshworks.com',
                },
                Enabled: true,
                Transformations: [],
                IsProcessorEnabled: true,
                RevisionID: '2E3xCLWeb83vOGDh0mkN4Auei3i',
              },
            },
          ],
        },
      },
    },
  },
];
