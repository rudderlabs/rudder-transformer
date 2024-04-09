export const data = [
  {
    name: 'sfmc',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'Creating or updating contacts is disabled. To enable this feature set "Do Not Create or Update Contacts" to false',
            statTags: {
              destType: 'SFMC',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
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
    name: 'sfmc',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint:
                'https://vcn7AQ2W9GGIAZSsN6Mfq.rest.marketingcloudapis.com/contacts/v1/contacts',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer yourAuthToken',
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
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'PUT',
              endpoint:
                'https://vcn7AQ2W9GGIAZSsN6Mfq.rest.marketingcloudapis.com/hub/v1/dataevents/key:f3ffa19b-e0b3-4967-829f-549b781080e6/rows/Contact Key:12345',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer yourAuthToken',
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
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sfmc',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              userProperties: {
                test_key: 'test value',
              },
              sentAt: '2019-10-14T09:03:22.563Z',
              integrations: {
                All: true,
              },
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
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Either userId or email is required',
            statTags: {
              destType: 'SFMC',
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
    name: 'sfmc',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              userId: 12345,
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              userProperties: {
                test_key: 'test value',
              },
              sentAt: '2019-10-14T09:03:22.563Z',
              integrations: {
                All: true,
              },
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
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event type is required',
            statTags: {
              destType: 'SFMC',
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
    name: 'sfmc',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              type: 'revenue',
              userId: 12345,
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              userProperties: {
                test_key: 'test value',
              },
              sentAt: '2019-10-14T09:03:22.563Z',
              integrations: {
                All: true,
              },
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
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event type revenue is not supported',
            statTags: {
              destType: 'SFMC',
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
    name: 'sfmc',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
                device: {
                  adTrackingEnabled: true,
                  type: 'iOS',
                  manufacturer: 'Apple',
                  model: 'iPhone XR',
                  name: 'Apple iPhone XR',
                },
                network: {
                  bluetooth: 'off',
                  wifi: 'connceted',
                  cellular: 'active',
                  carrier: 'Verizon',
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
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'POST',
              endpoint:
                'https://vcn7AQ2W9GGIAZSsN6Mfq.rest.marketingcloudapis.com/contacts/v1/contacts',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer yourAuthToken',
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
            statusCode: 200,
          },
          {
            output: {
              version: '1',
              type: 'REST',
              userId: '',
              method: 'PUT',
              endpoint:
                'https://vcn7AQ2W9GGIAZSsN6Mfq.rest.marketingcloudapis.com/hub/v1/dataevents/key:f3ffa19b-e0b3-4967-829f-549b781080e6/rows/Contact Key:12345',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer yourAuthToken',
              },
              params: {},
              body: {
                JSON: {
                  values: {
                    Name: 'Tonmoy Labs',
                    Email: 'tonmoy@rudderstack.com',
                    Locale: 'en-GB',
                    'App Name': 'RudderLabs JavaScript SDK',
                    'UTM Term': 'Demo terms',
                    'App Build': '1.0.0',
                    'IP Address': '0.0.0.0',
                    'UTM Medium': 'online',
                    'UTM Source': 'facebook',
                    'User Agent':
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                    'App Version': '1.0.0',
                    'Contact Key': '12345',
                    'Device Name': 'Apple iPhone XR',
                    'Device Type': 'iOS',
                    'UTM Content': 'Demo content',
                    'Device-model': 'iPhone XR',
                    'Screen Width': 1280,
                    'UTM Campaign': 'Demo Campaign',
                    'Wifi Enabled': 'connceted',
                    'Screen Height': 860,
                    'Screen Density': 2,
                    'Network Carrier': 'Verizon',
                    'Cellular Enabled': 'active',
                    'Bluetooth Enabled': 'off',
                    'Ad Tracking Enabled': true,
                    'Device Manufacturer': 'Apple',
                  },
                },
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
              },
              files: {},
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sfmc',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'Event Name',
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
              type: 'track',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              userId: '12345',
              properties: {
                Plan: 'plan value',
              },
              sentAt: '2019-10-14T09:03:22.563Z',
              integrations: {
                All: true,
              },
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
                eventToExternalKey: [
                  {
                    from: 'Event Name',
                    to: 'C500FD37-155C-49BD-A21B-AFCEF3D1A9CB',
                  },
                ],
                eventToPrimaryKey: [
                  {
                    from: 'userId',
                    to: 'Contact Key',
                  },
                ],
                eventToUUID: [
                  {
                    event: '',
                    uuid: false,
                  },
                ],
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
                'https://vcn7AQ2W9GGIAZSsN6Mfq.rest.marketingcloudapis.com/hub/v1/dataevents/key:C500FD37-155C-49BD-A21B-AFCEF3D1A9CB/rows/Contact Key:12345',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer yourAuthToken',
              },
              params: {},
              body: {
                JSON: {
                  values: {
                    Plan: 'plan value',
                    Locale: 'en-GB',
                    'App Name': 'RudderLabs JavaScript SDK',
                    'UTM Term': 'Demo terms',
                    'App Build': '1.0.0',
                    'IP Address': '0.0.0.0',
                    'UTM Medium': 'online',
                    'UTM Source': 'facebook',
                    'User Agent':
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                    'App Version': '1.0.0',
                    'Contact Key': '12345',
                    'UTM Content': 'Demo content',
                    'Screen Width': 1280,
                    'UTM Campaign': 'Demo Campaign',
                    'Screen Height': 860,
                    'Screen Density': 2,
                  },
                },
                XML: {},
                JSON_ARRAY: {},
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
    name: 'sfmc',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'Event Name',
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
                device: {
                  adTrackingEnabled: true,
                  type: 'iOS',
                  manufacturer: 'Apple',
                  model: 'iPhone XR',
                  name: 'Apple iPhone XR',
                },
                network: {
                  bluetooth: 'off',
                  wifi: 'connceted',
                  cellular: 'active',
                  carrier: 'Verizon',
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
              type: 'track',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              userId: '12345',
              properties: {
                Plan: 'plan value',
              },
              sentAt: '2019-10-14T09:03:22.563Z',
              integrations: {
                All: true,
              },
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
                eventToExternalKey: [
                  {
                    from: 'Event Name',
                    to: 'C500FD37-155C-49BD-A21B-AFCEF3D1A9CB',
                  },
                ],
                eventToPrimaryKey: [
                  {
                    from: 'userId',
                    to: 'Contact Key',
                  },
                ],
                eventToUUID: [
                  {
                    event: 'Event Name',
                    uuid: true,
                  },
                ],
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
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  values: {
                    Plan: 'plan value',
                    Uuid: '50360b9c-ea8d-409c-b672-c9230f91cce5',
                    Locale: 'en-GB',
                    'App Name': 'RudderLabs JavaScript SDK',
                    'UTM Term': 'Demo terms',
                    'App Build': '1.0.0',
                    'IP Address': '0.0.0.0',
                    'UTM Medium': 'online',
                    'UTM Source': 'facebook',
                    'User Agent':
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                    'App Version': '1.0.0',
                    'Device Name': 'Apple iPhone XR',
                    'Device Type': 'iOS',
                    'UTM Content': 'Demo content',
                    'Device-model': 'iPhone XR',
                    'Screen Width': 1280,
                    'UTM Campaign': 'Demo Campaign',
                    'Wifi Enabled': 'connceted',
                    'Screen Height': 860,
                    'Screen Density': 2,
                    'Network Carrier': 'Verizon',
                    'Cellular Enabled': 'active',
                    'Bluetooth Enabled': 'off',
                    'Ad Tracking Enabled': true,
                    'Device Manufacturer': 'Apple',
                  },
                },
              },
              type: 'REST',
              files: {},
              method: 'PUT',
              params: {},
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer yourAuthToken',
              },
              version: '1',
              endpoint:
                'https://vcn7AQ2W9GGIAZSsN6Mfq.rest.marketingcloudapis.com/hub/v1/dataevents/key:C500FD37-155C-49BD-A21B-AFCEF3D1A9CB/rows/Uuid:50360b9c-ea8d-409c-b672-c9230f91cce5',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sfmc',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'Purchase Event',
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
                device: {
                  adTrackingEnabled: true,
                  type: 'iOS',
                  manufacturer: 'Apple',
                  model: 'iPhone XR',
                  name: 'Apple iPhone XR',
                },
                network: {
                  bluetooth: 'off',
                  wifi: 'connceted',
                  cellular: 'active',
                  carrier: 'Verizon',
                },
                traits: {
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
              type: 'track',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              userId: '12345',
              properties: {
                Plan: 'plan value',
              },
              sentAt: '2019-10-14T09:03:22.563Z',
              integrations: {
                All: true,
              },
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
                eventToExternalKey: [
                  {
                    from: 'Event Name',
                    to: 'C500FD37-155C-49BD-A21B-AFCEF3D1A9CB',
                  },
                ],
                eventToPrimaryKey: [
                  {
                    from: 'userId',
                    to: 'Contact Key',
                  },
                ],
                eventToUUID: [
                  {
                    event: 'Event Name',
                    uuid: true,
                  },
                ],
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
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Event not mapped for this track call',
            statTags: {
              destType: 'SFMC',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
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
    name: 'sfmc',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'Event Name',
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
                device: {
                  adTrackingEnabled: true,
                  type: 'iOS',
                  manufacturer: 'Apple',
                  model: 'iPhone XR',
                  name: 'Apple iPhone XR',
                },
                network: {
                  bluetooth: 'off',
                  wifi: 'connceted',
                  cellular: 'active',
                  carrier: 'Verizon',
                },
                traits: {
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
              type: 'track',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              properties: {
                Plan: 'plan value',
              },
              sentAt: '2019-10-14T09:03:22.563Z',
              integrations: {
                All: true,
              },
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
                eventToExternalKey: [
                  {
                    from: 'Event Name',
                    to: 'C500FD37-155C-49BD-A21B-AFCEF3D1A9CB',
                  },
                ],
                eventToPrimaryKey: [
                  {
                    from: 'userId',
                    to: 'Contact Key',
                  },
                ],
                eventToUUID: [
                  {
                    event: 'Event Name',
                    uuid: true,
                  },
                ],
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
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Either userId or email is required',
            statTags: {
              destType: 'SFMC',
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
    name: 'sfmc',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'Watch',
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
              type: 'track',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              userId: '12345',
              properties: {
                Plan: 'plan value',
                'Price Key': 29.99,
                'Guest Key': '2323-34343-3434',
              },
              sentAt: '2019-10-14T09:03:22.563Z',
              integrations: {
                All: true,
              },
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
                eventToExternalKey: [
                  {
                    from: 'Event Name',
                    to: 'C500FD37-155C-49BD-A21B-AFCEF3D1A9CB',
                  },
                  {
                    from: 'Watch',
                    to: 'C500FD37-155C-49BD-A21B-AFCEF3D1A9CB',
                  },
                ],
                eventToPrimaryKey: [
                  {
                    from: 'userId',
                    to: 'User Key',
                  },
                  {
                    from: 'watch',
                    to: 'Guest Key',
                  },
                ],
                eventToUUID: [
                  {
                    event: 'Event Name',
                    uuid: true,
                  },
                ],
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
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  values: {
                    Plan: 'plan value',
                    Locale: 'en-GB',
                    'App Name': 'RudderLabs JavaScript SDK',
                    'UTM Term': 'Demo terms',
                    'App Build': '1.0.0',
                    'Price Key': 29.99,
                    'Guest Key': '2323-34343-3434',
                    'IP Address': '0.0.0.0',
                    'UTM Medium': 'online',
                    'UTM Source': 'facebook',
                    'User Agent':
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                    'App Version': '1.0.0',
                    'UTM Content': 'Demo content',
                    'Screen Width': 1280,
                    'UTM Campaign': 'Demo Campaign',
                    'Screen Height': 860,
                    'Screen Density': 2,
                  },
                },
              },
              type: 'REST',
              files: {},
              method: 'PUT',
              params: {},
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer yourAuthToken',
              },
              version: '1',
              endpoint:
                'https://vcn7AQ2W9GGIAZSsN6Mfq.rest.marketingcloudapis.com/hub/v1/dataevents/key:C500FD37-155C-49BD-A21B-AFCEF3D1A9CB/rows/Guest Key:2323-34343-3434',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sfmc',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'Watch',
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
              type: 'track',
              messageId: '50360b9c-ea8d-409c-b672-c9230f91cce5',
              originalTimestamp: '2019-10-15T09:35:31.288Z',
              userId: '12345',
              properties: {
                Plan: 'plan value',
                'Price Key': 29.99,
                'Contact Key': 12345,
                'Guest Key': '2323-34343-3434',
              },
              sentAt: '2019-10-14T09:03:22.563Z',
              integrations: {
                All: true,
              },
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
                eventToExternalKey: [
                  {
                    from: 'Event Name',
                    to: 'C500FD37-155C-49BD-A21B-AFCEF3D1A9CB',
                  },
                  {
                    from: 'Watch',
                    to: 'C500FD37-155C-49BD-A21B-AFCEF3D1A9CB',
                  },
                ],
                eventToPrimaryKey: [
                  {
                    from: 'userId',
                    to: 'User Key',
                  },
                  {
                    from: 'watch',
                    to: 'Guest Key, Contact Key',
                  },
                ],
                eventToUUID: [
                  {
                    event: 'Event Name',
                    uuid: true,
                  },
                ],
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
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  values: {
                    Plan: 'plan value',
                    Locale: 'en-GB',
                    'App Name': 'RudderLabs JavaScript SDK',
                    'UTM Term': 'Demo terms',
                    'App Build': '1.0.0',
                    'Price Key': 29.99,
                    'Contact Key': 12345,
                    'Guest Key': '2323-34343-3434',
                    'IP Address': '0.0.0.0',
                    'UTM Medium': 'online',
                    'UTM Source': 'facebook',
                    'User Agent':
                      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                    'App Version': '1.0.0',
                    'UTM Content': 'Demo content',
                    'Screen Width': 1280,
                    'UTM Campaign': 'Demo Campaign',
                    'Screen Height': 860,
                    'Screen Density': 2,
                  },
                },
              },
              type: 'REST',
              files: {},
              method: 'PUT',
              params: {},
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer yourAuthToken',
              },
              version: '1',
              endpoint:
                'https://vcn7AQ2W9GGIAZSsN6Mfq.rest.marketingcloudapis.com/hub/v1/dataevents/key:C500FD37-155C-49BD-A21B-AFCEF3D1A9CB/rows/Guest Key:2323-34343-3434,Contact Key:12345',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sfmc',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'message event',
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
              type: 'track',
              userId: '12345',
              properties: {
                id: 'id101',
                contactId: 'cid101',
                email: 'testemail@gmail.com',
                accountNumber: '99110099',
                patronName: 'SP',
              },
              sentAt: '2019-10-14T09:03:22.563Z',
              integrations: {
                All: true,
              },
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
                eventToExternalKey: [
                  {
                    from: 'Event Name',
                    to: 'C500FD37-155C-49BD-A21B-AFCEF3D1A9CB',
                  },
                  {
                    from: 'Watch',
                    to: 'C500FD37-155C-49BD-A21B-AFCEF3D1A9CB',
                  },
                ],
                eventToPrimaryKey: [
                  {
                    from: 'userId',
                    to: 'User Key',
                  },
                  {
                    from: 'watch',
                    to: 'Guest Key, Contact Key',
                  },
                ],
                eventToUUID: [
                  {
                    event: 'Event Name',
                    uuid: true,
                  },
                ],
                eventToDefinitionMapping: [
                  {
                    from: 'message event',
                    to: 'test-event-definition',
                  },
                ],
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
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
                JSON: {
                  ContactKey: 'cid101',
                  Data: {
                    accountNumber: '99110099',
                    email: 'testemail@gmail.com',
                    id: 'id101',
                    patronName: 'SP',
                  },
                  EventDefinitionKey: 'test-event-definition',
                },
              },
              type: 'REST',
              files: {},
              method: 'POST',
              params: {},
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer yourAuthToken',
              },
              version: '1',
              endpoint:
                'https://vcn7AQ2W9GGIAZSsN6Mfq.rest.marketingcloudapis.com/interaction/v1/events',
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'sfmc',
    description: 'Tests 401 un authenticated code from sfmc',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'message event',
              type: 'track',
              userId: '12345',
              properties: {
                id: 'id101',
                contactId: 'cid101',
                email: 'testemail@gmail.com',
                accountNumber: '99110099',
                patronName: 'SP',
              },
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
                clientId: 'testHandleHttpRequest401',
                clientSecret: 'testHandleHttpRequest401',
                createOrUpdateContacts: false,
                eventDelivery: true,
                eventDeliveryTS: 1615371070621,
                eventToExternalKey: [
                  {
                    from: 'Event Name',
                    to: 'C500FD37-155C-49BD-A21B-AFCEF3D1A9CB',
                  },
                  {
                    from: 'Watch',
                    to: 'C500FD37-155C-49BD-A21B-AFCEF3D1A9CB',
                  },
                ],
                eventToPrimaryKey: [
                  {
                    from: 'userId',
                    to: 'User Key',
                  },
                  {
                    from: 'watch',
                    to: 'Guest Key, Contact Key',
                  },
                ],
                eventToUUID: [
                  {
                    event: 'Event Name',
                    uuid: true,
                  },
                ],
                eventToDefinitionMapping: [
                  {
                    from: 'message event',
                    to: 'test-event-definition',
                  },
                ],
                externalKey: 'f3ffa19b-e0b3-4967-829f-549b781080e6',
                subDomain: 'testHandleHttpRequest401',
              },
              Enabled: true,
              Transformations: [],
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
            error:
              '{"message":"Could not retrieve access token","destinationResponse":{"error":"invalid_client","error_description":"Invalid client ID. Use the client ID in Marketing Cloud Installed Packages.","error_uri":"https://developer.salesforce.com/docs"}}',
            statTags: {
              destType: 'SFMC',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 401,
          },
        ],
      },
    },
  },
  {
    name: 'sfmc',
    description: 'Tests 429 status code from sfmc',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'message event',
              type: 'track',
              userId: '12345',
              properties: {
                id: 'id101',
                contactId: 'cid101',
                email: 'testemail@gmail.com',
                accountNumber: '99110099',
                patronName: 'SP',
              },
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
                clientId: 'testHandleHttpRequest429',
                clientSecret: 'testHandleHttpRequest429',
                subDomain: 'testHandleHttpRequest429',
              },
              Enabled: true,
              Transformations: [],
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
            error:
              '{"message":"Could not retrieve access token","destinationResponse":{"message":"Your requests are temporarily blocked.","errorcode":50200,"documentation":"https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/error-handling.htm"}}',
            statTags: {
              destType: 'SFMC',
              errorCategory: 'network',
              errorType: 'throttled',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 429,
          },
        ],
      },
    },
  },
  {
    name: 'sfmc',
    description: 'Tests DNS lookup failure for sfmc',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'message event',
              type: 'track',
              userId: '12345',
              properties: {
                id: 'id101',
                contactId: 'cid101',
                email: 'testemail@gmail.com',
                accountNumber: '99110099',
                patronName: 'SP',
              },
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
                clientId: 'testHandleHttpRequest-dns',
                clientSecret: 'testHandleHttpRequest-dns',
                subDomain: 'testHandleHttpRequest-dns',
              },
              Enabled: true,
              Transformations: [],
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
            error: '{"message":"Could not retrieve access token","destinationResponse":{}}',
            statTags: {
              destType: 'SFMC',
              errorCategory: 'network',
              errorType: 'aborted',
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
    name: 'sfmc',
    description: 'Test 500 status failure for sfmc',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'message event',
              type: 'track',
              userId: '12345',
              properties: {
                id: 'id101',
                contactId: 'cid101',
                email: 'testemail@gmail.com',
                accountNumber: '99110099',
                patronName: 'SP',
              },
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
                clientId: 'testHandleHttpRequest-null',
                clientSecret: 'testHandleHttpRequest-null',
                subDomain: 'testHandleHttpRequest-null',
              },
              Enabled: true,
              Transformations: [],
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
            error: 'Could not retrieve access token',
            statTags: {
              destType: 'SFMC',
              errorCategory: 'network',
              errorType: 'retryable',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 500,
          },
        ],
      },
    },
  },
];
