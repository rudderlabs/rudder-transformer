export const data = [
  {
    name: 'campaign_manager',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              metadata: {
                secret: {
                  access_token: 'dummyApiToken',
                  refresh_token: 'efgh5678',
                  developer_token: 'ijkl91011',
                },
                jobId: 1,
              },
              destination: {
                Config: {
                  treatmentForUnderage: false,
                  limitAdTracking: false,
                  childDirectedTreatment: false,
                  nonPersonalizedAd: false,
                  rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
                },
              },
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
                event: 'Promotion Clicked',
                originalTimestamp: '2022-11-17T00:22:02.903+05:30',
                properties: {
                  profileId: 437689,
                  floodlightConfigurationId: '213123123',
                  ordinal: 'string',
                  quantity: '455678',
                  floodlightActivityId: '456543345245',
                  value: 7,
                  encryptedUserIdCandidates: ['dfghjbnm'],
                  limitAdTracking: true,
                  childDirectedTreatment: true,
                  encryptionSource: 'AD_SERVING',
                  encryptionEntityId: '3564523',
                  encryptionEntityType: 'DCM_ACCOUNT',
                  requestType: 'batchinsert',
                },
                type: 'track',
                anonymousId: 'randomId',
                integrations: {
                  All: true,
                },
                name: 'ApplicationLoaded',
                sentAt: '2022-11-17T00:22:02.903+05:30',
              },
            },
            {
              metadata: {
                secret: {
                  access_token: 'dummyApiToken',
                  refresh_token: 'efgh5678',
                  developer_token: 'ijkl91011',
                },
                jobId: 2,
              },
              destination: {
                Config: {
                  treatmentForUnderage: false,
                  limitAdTracking: false,
                  childDirectedTreatment: false,
                  nonPersonalizedAd: false,
                  rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
                },
              },
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
                event: 'Promotion Clicked',
                type: 'track',
                originalTimestamp: '2022-11-17T00:22:02.903+05:30',
                properties: {
                  profileId: 437689,
                  floodlightConfigurationId: '213123123',
                  ordinal: 'string',
                  floodlightActivityId: '456543345245',
                  quantity: '455678',
                  value: 7,
                  encryptedUserIdCandidates: ['dfghjbnm'],
                  limitAdTracking: true,
                  childDirectedTreatment: true,
                  encryptionSource: 'AD_SERVING',
                  encryptionEntityId: '3564523',
                  encryptionEntityType: 'DCM_ACCOUNT',
                  requestType: 'batchupdate',
                },
                anonymousId: 'randomId',
                integrations: {
                  All: true,
                },
                name: 'ApplicationLoaded',
                sentAt: '2022-11-17T00:22:02.903+05:30',
              },
            },
            {
              metadata: {
                secret: {
                  access_token: 'dummyApiToken',
                  refresh_token: 'efgh5678',
                  developer_token: 'ijkl91011',
                },
                jobId: 3,
              },
              destination: {
                Config: {
                  treatmentForUnderage: false,
                  limitAdTracking: false,
                  childDirectedTreatment: false,
                  nonPersonalizedAd: false,
                  rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
                },
              },
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
                event: 'Promotion Clicked',
                type: 'track',
                originalTimestamp: '2022-11-17T00:22:02.903+05:30',
                properties: {
                  profileId: 437689,
                  floodlightConfigurationId: '213123123',
                  ordinal: 'string',
                  floodlightActivityId: '456543345245',
                  mobileDeviceId: 'string',
                  value: 7,
                  encryptedUserIdCandidates: ['dfghjbnm'],
                  gclid: 'string',
                  matchId: 'string',
                  dclid: 'string',
                  quantity: '455678',
                  impressionId: 'string',
                  limitAdTracking: true,
                  childDirectedTreatment: true,
                  encryptionInfo: {
                    kind: 'dfareporting#encryptionInfo',
                    encryptionSource: 'AD_SERVING',
                    encryptionEntityId: '3564523',
                    encryptionEntityType: 'DCM_ACCOUNT',
                  },
                  requestType: 'randomValue',
                },
                anonymousId: 'randomId',
                integrations: {
                  All: true,
                },
                name: 'ApplicationLoaded',
                sentAt: '2022-11-17T00:22:02.903+05:30',
              },
            },
          ],
          destType: 'campaign_manager',
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
                  'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/437689/conversions/batchinsert',
                headers: {
                  Authorization: 'Bearer dummyApiToken',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    kind: 'dfareporting#conversionsBatchInsertRequest',
                    encryptionInfo: {
                      kind: 'dfareporting#encryptionInfo',
                      encryptionSource: 'AD_SERVING',
                      encryptionEntityId: '3564523',
                      encryptionEntityType: 'DCM_ACCOUNT',
                    },
                    conversions: [
                      {
                        nonPersonalizedAd: false,
                        treatmentForUnderage: false,
                        timestampMicros: '1668624722903000',
                        floodlightConfigurationId: '213123123',
                        ordinal: 'string',
                        quantity: '455678',
                        floodlightActivityId: '456543345245',
                        value: 7,
                        encryptedUserIdCandidates: ['dfghjbnm'],
                        limitAdTracking: true,
                        childDirectedTreatment: true,
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  secret: {
                    access_token: 'dummyApiToken',
                    developer_token: 'ijkl91011',
                    refresh_token: 'efgh5678',
                  },
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  childDirectedTreatment: false,
                  limitAdTracking: false,
                  nonPersonalizedAd: false,
                  rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
                  treatmentForUnderage: false,
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint:
                  'https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/437689/conversions/batchupdate',
                headers: {
                  Authorization: 'Bearer dummyApiToken',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    kind: 'dfareporting#conversionsBatchUpdateRequest',
                    encryptionInfo: {
                      kind: 'dfareporting#encryptionInfo',
                      encryptionSource: 'AD_SERVING',
                      encryptionEntityId: '3564523',
                      encryptionEntityType: 'DCM_ACCOUNT',
                    },
                    conversions: [
                      {
                        nonPersonalizedAd: false,
                        treatmentForUnderage: false,
                        timestampMicros: '1668624722903000',
                        floodlightConfigurationId: '213123123',
                        ordinal: 'string',
                        quantity: '455678',
                        floodlightActivityId: '456543345245',
                        value: 7,
                        encryptedUserIdCandidates: ['dfghjbnm'],
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  secret: {
                    access_token: 'dummyApiToken',
                    developer_token: 'ijkl91011',
                    refresh_token: 'efgh5678',
                  },
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  childDirectedTreatment: false,
                  limitAdTracking: false,
                  nonPersonalizedAd: false,
                  rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
                  treatmentForUnderage: false,
                },
              },
            },
            {
              destination: {
                Config: {
                  treatmentForUnderage: false,
                  limitAdTracking: false,
                  childDirectedTreatment: false,
                  nonPersonalizedAd: false,
                  rudderAccountId: '2EOknn1JNH7WK1MfNku4fGYKkRK',
                },
              },
              batched: false,
              error:
                '[CAMPAIGN MANAGER (DCM)]: properties.requestType must be one of batchinsert or batchupdate.',
              metadata: [
                {
                  secret: {
                    access_token: 'dummyApiToken',
                    developer_token: 'ijkl91011',
                    refresh_token: 'efgh5678',
                  },
                  jobId: 3,
                },
              ],
              statusCode: 400,
              statTags: {
                destType: 'CAMPAIGN_MANAGER',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
            },
          ],
        },
      },
    },
  },
];
