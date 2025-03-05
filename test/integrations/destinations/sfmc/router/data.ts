import { authHeader1 } from '../maskedSecrets';
export const data = [
  {
    name: 'sfmc',
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
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  campaign: {
                    name: 'Demo Campaign',
                    source: 'facebook',
                    medium: 'online',
                    term: 'Demo terms',
                    content: 'Demo content',
                  },
                  traits: {
                    email: 'tonmoy@rudderstack.com',
                    name: 'Tonmoy Labs',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  screen: {
                    density: 2,
                    height: 860,
                    width: 1280,
                  },
                },
                type: 'identify',
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                userId: '12345',
                userProperties: {
                  test_key: 'test value',
                },
                sentAt: '2019-10-14T09:03:22.563Z',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                jobId: 1,
              },
              destination: {
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'SFMC',
                DestinationDefinition: {
                  ID: '1pYpYSeQd8OeN6xPdw6VGDzqUd1',
                  Name: 'SFMC',
                  DisplayName: 'Salesforce Marketing Cloud',
                  Config: {
                    destConfig: [],
                    excludeKeys: [],
                    includeKeys: [],
                    saveDestinationResponse: true,
                    supportedSourceTypes: [],
                    transformAt: 'processor',
                  },
                  ResponseRules: {},
                },
                Config: {
                  clientId: 'vcn7AQ2W9GGIAZSsN6Mfq',
                  clientSecret: 'vcn7AQ2W9GGIAZSsN6Mfq',
                  createOrUpdateContacts: true,
                  eventDelivery: true,
                  eventDeliveryTS: 1615371070621,
                  eventToUUID: [],
                  externalKey: 'f3ffa19b-e0b3-4967-829f-549b781080e6',
                  subDomain: 'vcn7AQ2W9GGIAZSsN6Mfq',
                },
                Enabled: true,
                Transformations: [],
              },
            },
            {
              message: {
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  campaign: {
                    name: 'Demo Campaign',
                    source: 'facebook',
                    medium: 'online',
                    term: 'Demo terms',
                    content: 'Demo content',
                  },
                  traits: {
                    email: 'tonmoy@rudderstack.com',
                    name: 'Tonmoy Labs',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-GB',
                  ip: '0.0.0.0',
                  screen: {
                    density: 2,
                    height: 860,
                    width: 1280,
                  },
                },
                type: 'identify',
                messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                originalTimestamp: '2019-10-15T09:35:31.288Z',
                userId: '12345',
                userProperties: {
                  test_key: 'test value',
                },
                sentAt: '2019-10-14T09:03:22.563Z',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                jobId: 2,
              },
              destination: {
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'SFMC',
                DestinationDefinition: {
                  ID: '1pYpYSeQd8OeN6xPdw6VGDzqUd1',
                  Name: 'SFMC',
                  DisplayName: 'Salesforce Marketing Cloud',
                  Config: {
                    destConfig: [],
                    excludeKeys: [],
                    includeKeys: [],
                    saveDestinationResponse: false,
                    supportedSourceTypes: [],
                    transformAt: 'processor',
                  },
                  ResponseRules: {},
                },
                Config: {
                  clientId: 'vcn7AQ2W9GGIAZSsN6Mfq',
                  clientSecret: 'vcn7AQ2W9GGIAZSsN6Mfq',
                  createOrUpdateContacts: false,
                  eventDelivery: true,
                  eventDeliveryTS: 1615371070621,
                  eventToUUID: [],
                  externalKey: 'f3ffa19b-e0b3-4967-829f-549b781080e6',
                  subDomain: 'vcn7AQ2W9GGIAZSsN6Mfq',
                },
                Enabled: true,
                Transformations: [],
              },
            },
          ],
          destType: 'sfmc',
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
              metadata: [
                {
                  jobId: 1,
                },
              ],
              destination: {
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'SFMC',
                DestinationDefinition: {
                  ID: '1pYpYSeQd8OeN6xPdw6VGDzqUd1',
                  Name: 'SFMC',
                  DisplayName: 'Salesforce Marketing Cloud',
                  Config: {
                    destConfig: [],
                    excludeKeys: [],
                    includeKeys: [],
                    saveDestinationResponse: true,
                    supportedSourceTypes: [],
                    transformAt: 'processor',
                  },
                  ResponseRules: {},
                },
                Config: {
                  clientId: 'vcn7AQ2W9GGIAZSsN6Mfq',
                  clientSecret: 'vcn7AQ2W9GGIAZSsN6Mfq',
                  createOrUpdateContacts: true,
                  eventDelivery: true,
                  eventDeliveryTS: 1615371070621,
                  eventToUUID: [],
                  externalKey: 'f3ffa19b-e0b3-4967-829f-549b781080e6',
                  subDomain: 'vcn7AQ2W9GGIAZSsN6Mfq',
                },
                Enabled: true,
                Transformations: [],
              },
              batched: false,
              statusCode: 400,
              error:
                'Creating or updating contacts is disabled. To enable this feature set "Do Not Create or Update Contacts" to false',
              statTags: {
                destType: 'SFMC',
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
            },
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://vcn7AQ2W9GGIAZSsN6Mfq.rest.marketingcloudapis.com/contacts/v1/contacts',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: authHeader1,
                  },
                  params: {},
                  body: {
                    JSON: {
                      attributeSets: [],
                      contactKey: '12345',
                    },
                    XML: {},
                    JSON_ARRAY: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'PUT',
                  endpoint:
                    'https://vcn7AQ2W9GGIAZSsN6Mfq.rest.marketingcloudapis.com/hub/v1/dataevents/key:f3ffa19b-e0b3-4967-829f-549b781080e6/rows/Contact Key:12345',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: authHeader1,
                  },
                  params: {},
                  body: {
                    JSON: {
                      values: {
                        'Contact Key': '12345',
                        'App Name': 'RudderLabs JavaScript SDK',
                        'App Version': '1.0.0',
                        'App Build': '1.0.0',
                        'UTM Campaign': 'Demo Campaign',
                        'UTM Source': 'facebook',
                        'UTM Medium': 'online',
                        'UTM Term': 'Demo terms',
                        'UTM Content': 'Demo content',
                        Locale: 'en-GB',
                        'User Agent':
                          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                        'IP Address': '0.0.0.0',
                        'Screen Density': 2,
                        'Screen Height': 860,
                        'Screen Width': 1280,
                        Email: 'tonmoy@rudderstack.com',
                        Name: 'Tonmoy Labs',
                      },
                    },
                    XML: {},
                    JSON_ARRAY: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'SFMC',
                DestinationDefinition: {
                  ID: '1pYpYSeQd8OeN6xPdw6VGDzqUd1',
                  Name: 'SFMC',
                  DisplayName: 'Salesforce Marketing Cloud',
                  Config: {
                    destConfig: [],
                    excludeKeys: [],
                    includeKeys: [],
                    saveDestinationResponse: false,
                    supportedSourceTypes: [],
                    transformAt: 'processor',
                  },
                  ResponseRules: {},
                },
                Config: {
                  clientId: 'vcn7AQ2W9GGIAZSsN6Mfq',
                  clientSecret: 'vcn7AQ2W9GGIAZSsN6Mfq',
                  createOrUpdateContacts: false,
                  eventDelivery: true,
                  eventDeliveryTS: 1615371070621,
                  eventToUUID: [],
                  externalKey: 'f3ffa19b-e0b3-4967-829f-549b781080e6',
                  subDomain: 'vcn7AQ2W9GGIAZSsN6Mfq',
                },
                Enabled: true,
                Transformations: [],
              },
            },
          ],
        },
      },
    },
  },
];
