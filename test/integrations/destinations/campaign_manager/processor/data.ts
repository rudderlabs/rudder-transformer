export const data = [
  {
    name: 'campaign_manager',
    description: 'Test 0',
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
                  version: '1.0.0',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                traits: {
                  email: 'alex@example.com',
                  phone: '+1-202-555-0146',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'England',
                  countryCode: 'GB',
                  postalCode: 'EC3M',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              originalTimestamp: '2022-11-17T00:22:02.903+05:30',
              properties: {
                profileId: '34245',
                floodlightConfigurationId: '213123123',
                ordinal: 'string',
                floodlightActivityId: '456543345245',
                value: '756',
                encryptedUserIdCandidates: ['dfghjbnm'],
                quantity: '455678',
                encryptionSource: 'AD_SERVING',
                encryptionEntityId: '3564523',
                encryptionEntityType: 'DCM_ACCOUNT',
                requestType: 'batchinsert',
              },
              type: 'track',
              event: 'event test',
              anonymousId: 'randomId',
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'dummyApiToken',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                profileId: '5343234',
                treatmentForUnderage: false,
                limitAdTracking: false,
                childDirectedTreatment: false,
                nonPersonalizedAd: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/34245/conversions/batchinsert',
              headers: {
                Authorization: 'Bearer dummyApiToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  kind: 'dfareporting#conversionsBatchInsertRequest',
                  encryptionInfo: {
                    encryptionEntityType: 'DCM_ACCOUNT',
                    encryptionSource: 'AD_SERVING',
                    encryptionEntityId: '3564523',
                    kind: 'dfareporting#encryptionInfo',
                  },
                  conversions: [
                    {
                      floodlightConfigurationId: '213123123',
                      ordinal: 'string',
                      timestampMicros: '1668624722903000',
                      floodlightActivityId: '456543345245',
                      quantity: '455678',
                      value: 756,
                      encryptedUserIdCandidates: ['dfghjbnm'],
                      nonPersonalizedAd: false,
                      treatmentForUnderage: false,
                      childDirectedTreatment: false,
                      limitAdTracking: false,
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'dummyApiToken',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'campaign_manager',
    description: 'Test 1',
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
                  version: '1.0.0',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                traits: {
                  email: 'alex@example.com',
                  phone: '+1-202-555-0146',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'England',
                  countryCode: 'GB',
                  postalCode: 'EC3M',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              originalTimestamp: '2021-01-04T08:25:04.780Z',
              properties: {
                profileId: '34245',
                floodlightConfigurationId: '213123123',
                ordinal: 'string',
                floodlightActivityId: '456543345245',
                value: '756',
                quantity: '455678',
                gclid: 'string',
                encryptionSource: 'AD_SERVING',
                encryptionEntityId: '3564523',
                encryptionEntityType: 'DCM_ACCOUNT',
                requestType: 'batchupdate',
              },
              type: 'track',
              event: 'event test',
              anonymousId: 'randomId',
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'dummyApiToken',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                profileId: '5343234',
                treatmentForUnderage: false,
                limitAdTracking: false,
                childDirectedTreatment: false,
                nonPersonalizedAd: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/34245/conversions/batchupdate',
              headers: {
                Authorization: 'Bearer dummyApiToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  kind: 'dfareporting#conversionsBatchUpdateRequest',
                  conversions: [
                    {
                      floodlightConfigurationId: '213123123',
                      ordinal: 'string',
                      timestampMicros: '1609748704780000',
                      floodlightActivityId: '456543345245',
                      quantity: '455678',
                      value: 756,
                      gclid: 'string',
                      nonPersonalizedAd: false,
                      treatmentForUnderage: false,
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'dummyApiToken',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'campaign_manager',
    description: 'Test 2',
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
                  version: '1.0.0',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                traits: {
                  email: 'alex@example.com',
                  phone: '+1-202-555-0146',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'England',
                  countryCode: 'GB',
                  postalCode: 'EC3M',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              originalTimestamp: '2022-11-17T00:22:02.903+05:30',
              properties: {
                profileId: '34245',
                floodlightConfigurationId: '213123123',
                ordinal: 'string',
                floodlightActivityId: '456543345245',
                mobileDeviceId: 'string',
                value: '756',
                encryptedUserIdCandidates: ['dfghjbnm'],
                quantity: '455678',
                gclid: 'string',
                matchId: 'string',
                dclid: 'string',
                impressionId: 'string',
                requestType: 'batchinsert',
              },
              type: 'track',
              event: 'event test',
              anonymousId: 'randomId',
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'dummyApiToken',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                profileId: '5343234',
                treatmentForUnderage: false,
                limitAdTracking: false,
                childDirectedTreatment: false,
                nonPersonalizedAd: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
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
            metadata: {
              secret: {
                access_token: 'dummyApiToken',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error:
              '[CAMPAIGN MANAGER (DCM)]: If encryptedUserId or encryptedUserIdCandidates is used, provide proper values for properties.encryptionEntityType , properties.encryptionSource and properties.encryptionEntityId',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'campaign_manager',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'sources',
              originalTimestamp: '2022-11-17T00:22:02.903+05:30',
              properties: {
                floodlightConfigurationId: '213123123',
                ordinal: 'string',
                floodlightActivityId: '456543345245',
                value: '756',
                quantity: '455678',
                requestType: 'batchinsert',
              },
              type: 'track',
              event: 'event test',
              anonymousId: 'randomId',
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'dummyApiToken',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                profileId: '5343234',
                treatmentForUnderage: false,
                limitAdTracking: false,
                childDirectedTreatment: false,
                nonPersonalizedAd: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
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
            metadata: {
              secret: {
                access_token: 'dummyApiToken',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 400,
            error:
              '[CAMPAIGN MANAGER (DCM)]: Atleast one of encryptedUserId,encryptedUserIdCandidates, matchId, mobileDeviceId, gclid, dclid, impressionId.',
            statTags: {
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              destType: 'CAMPAIGN_MANAGER',
              module: 'destination',
              implementation: 'native',
              feature: 'processor',
            },
          },
        ],
      },
    },
  },
  {
    name: 'campaign_manager',
    description: 'Test 4',
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
                  version: '1.0.0',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                traits: {
                  email: 'alex@example.com',
                  phone: '+1-202-555-0146',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'England',
                  countryCode: 'GB',
                  postalCode: 'EC3M',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              originalTimestamp: '2022-11-17T00:22:02.903+05:30',
              properties: {
                profileId: '34245',
                floodlightConfigurationId: '213123123',
                ordinal: '1',
                floodlightActivityId: '456543345245',
                value: '756',
                quantity: '455678',
                encryptionSource: 'AD_SERVING',
                encryptionEntityId: '3564523',
                encryptionEntityType: 'DCM_ACCOUNT',
                requestType: 'batchinsert',
                matchId: '123',
              },
              type: 'track',
              event: 'event test',
              anonymousId: 'randomId',
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'dummyApiToken',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                profileId: '5343234',
                treatmentForUnderage: false,
                limitAdTracking: false,
                childDirectedTreatment: false,
                nonPersonalizedAd: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/34245/conversions/batchinsert',
              headers: {
                Authorization: 'Bearer dummyApiToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  kind: 'dfareporting#conversionsBatchInsertRequest',
                  conversions: [
                    {
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      timestampMicros: '1668624722903000',
                      floodlightActivityId: '456543345245',
                      quantity: '455678',
                      value: 756,
                      matchId: '123',
                      nonPersonalizedAd: false,
                      treatmentForUnderage: false,
                      childDirectedTreatment: false,
                      limitAdTracking: false,
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'dummyApiToken',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'campaign_manager',
    description: 'Test 5',
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
                  version: '1.0.0',
                },
                device: {
                  id: '0572f78fa49c648e',
                  name: 'generic_x86_arm',
                  type: 'Android',
                  model: 'AOSP on IA Emulator',
                  manufacturer: 'Google',
                  adTrackingEnabled: true,
                  advertisingId: '44c97318-9040-4361-8bc7-4eb30f665ca8',
                },
                traits: {
                  email: 'alex@example.com',
                  phone: '+1-202-555-0146',
                  firstName: 'John',
                  lastName: 'Gomes',
                  city: 'London',
                  state: 'England',
                  countryCode: 'GB',
                  postalCode: 'EC3M',
                  streetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
                },
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  version: '1.0.0',
                },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                locale: 'en-US',
                ip: '0.0.0.0',
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 2,
                },
              },
              originalTimestamp: '1668624722903333',
              properties: {
                profileId: '34245',
                floodlightConfigurationId: '213123123',
                ordinal: '1',
                floodlightActivityId: '456543345245',
                value: '756',
                quantity: '455678',
                encryptionSource: 'AD_SERVING',
                encryptionEntityId: '3564523',
                encryptionEntityType: 'DCM_ACCOUNT',
                requestType: 'batchinsert',
                matchId: '123',
              },
              type: 'track',
              event: 'event test',
              anonymousId: 'randomId',
              integrations: {
                All: true,
              },
              name: 'ApplicationLoaded',
              sentAt: '2019-10-14T11:15:53.296Z',
            },
            metadata: {
              secret: {
                access_token: 'dummyApiToken',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            destination: {
              Config: {
                profileId: '5343234',
                treatmentForUnderage: false,
                limitAdTracking: false,
                childDirectedTreatment: false,
                nonPersonalizedAd: false,
                rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
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
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint:
                'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/34245/conversions/batchinsert',
              headers: {
                Authorization: 'Bearer dummyApiToken',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  kind: 'dfareporting#conversionsBatchInsertRequest',
                  conversions: [
                    {
                      floodlightConfigurationId: '213123123',
                      ordinal: '1',
                      timestampMicros: '1668624722903333',
                      floodlightActivityId: '456543345245',
                      quantity: '455678',
                      value: 756,
                      matchId: '123',
                      nonPersonalizedAd: false,
                      treatmentForUnderage: false,
                      childDirectedTreatment: false,
                      limitAdTracking: false,
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              secret: {
                access_token: 'dummyApiToken',
                refresh_token: 'efgh5678',
                developer_token: 'ijkl91011',
              },
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
