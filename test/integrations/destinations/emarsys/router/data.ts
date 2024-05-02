const config = {
  discardEmptyProperties: true,
  emersysUsername: 'dummy',
  emersysUserSecret: 'dummy',
  emersysCustomIdentifier: '3',
  defaultContactList: 'dummy',
  eventsMapping: [
    {
      from: 'Order Completed',
      to: 'purchase',
    },
  ],
  fieldMapping: [
    {
      from: 'Email',
      to: '3',
    },
  ],
  oneTrustCookieCategories: [
    {
      oneTrustCookieCategory: 'Marketing',
    },
  ],
};

const commonDestination = {
  ID: '12335',
  Name: 'sample-destination',
  DestinationDefinition: {
    ID: '123',
    Name: 'emarsys',
    DisplayName: 'Emarsys',
    Config: {
      cdkV2Enabled: true,
    },
  },
  WorkspaceID: '123',
  Transformations: [],
  Config: config,
  Enabled: true,
};

export const data = [
  {
    id: 'emarsys-track-test-1',
    name: 'emarsys',
    description: 'Track call : custom event calls with simple user properties and traits',
    scenario: 'Business',
    successCriteria:
      'event not respecting the internal mapping and as well as UI mapping should be considered as a custom event and should be sent as it is',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                sentAt: '2020-08-14T05: 30: 30.118Z',
                channel: 'web',
                context: {
                  source: 'test',
                  userAgent: 'chrome',
                  traits: {
                    anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                    email: 'abc@gmail.com',
                    phone: '+1234589947',
                    gender: 'non-binary',
                    db: '19950715',
                    lastname: 'Rudderlabs',
                    firstName: 'Test',
                    address: {
                      city: 'Kolkata',
                      state: 'WB',
                      zip: '700114',
                      country: 'IN',
                    },
                  },
                  device: {
                    advertisingId: 'abc123',
                  },
                  library: {
                    name: 'rudder-sdk-ruby-sync',
                    version: '1.0.6',
                  },
                },
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2024-02-10T12:16:07.251Z',
                anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                sourceType: '',
                destinationType: '',
                namespace: '',
                jobId: 1,
                secret: {
                  accessToken: 'dummyToken',
                },
              },
              destination: commonDestination,
            },
            {
              message: {
                type: 'identify',
                sentAt: '2020-08-14T05: 30: 30.118Z',
                channel: 'web',
                context: {
                  source: 'test',
                  userAgent: 'chrome',
                  traits: {
                    anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                    email: 'abc@gmail.com',
                    phone: '+1234589947',
                    gender: 'non-binary',
                    db: '19950715',
                    lastname: 'Rudderlabs',
                    firstName: 'Test',
                    address: {
                      city: 'Kolkata',
                      state: 'WB',
                      zip: '700114',
                      country: 'IN',
                    },
                  },
                  device: {
                    advertisingId: 'abc123',
                  },
                  library: {
                    name: 'rudder-sdk-ruby-sync',
                    version: '1.0.6',
                  },
                },
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2024-02-10T12:16:07.251Z',
                anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                sourceType: '',
                destinationType: '',
                namespace: '',
                jobId: 2,
                secret: {
                  accessToken: 'dummyToken',
                },
              },
              destination: commonDestination,
            },
            {
              message: {
                type: 'identify',
                sentAt: '2020-08-14T05: 30: 30.118Z',
                channel: 'web',
                context: {
                  source: 'test',
                  userAgent: 'chrome',
                  traits: {
                    anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                    phone: '+1234589947',
                    gender: 'non-binary',
                    db: '19950715',
                    lastname: 'Rudderlabs',
                    firstName: 'Test',
                    address: {
                      city: 'Kolkata',
                      state: 'WB',
                      zip: '700114',
                      country: 'IN',
                    },
                  },
                  device: {
                    advertisingId: 'abc123',
                  },
                  library: {
                    name: 'rudder-sdk-ruby-sync',
                    version: '1.0.6',
                  },
                },
                messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                timestamp: '2024-02-10T12:16:07.251Z',
                anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
                integrations: {
                  All: true,
                },
              },
              metadata: {
                sourceType: '',
                destinationType: '',
                namespace: '',
                jobId: 3,
                secret: {
                  accessToken: 'dummyToken',
                },
              },
              destination: commonDestination,
            },
          ],
          destType: 'emarsys',
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
                  sourceType: '',
                  destinationType: '',
                  namespace: '',
                  jobId: 3,
                  secret: {
                    accessToken: 'dummyToken',
                  },
                },
              ],
              destination: {
                ID: '12335',
                Name: 'sample-destination',
                DestinationDefinition: {
                  ID: '123',
                  Name: 'emarsys',
                  DisplayName: 'emarsys',
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                WorkspaceID: '123',
                Transformations: [],
                Config: config,
                Enabled: true,
              },
              batched: false,
              statusCode: 400,
              error:
                '[emarsys] no matching user id found. Please provide at least one of the following: email, emersysFirstPartyAdsTrackingUUID, acxiomId, oracleMoatId',
              statTags: {
                destType: 'emarsys',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'cdkV2',
                module: 'destination',
              },
            },
            {
              batchedRequest: {
                body: {
                  JSON: {
                    elements: [
                      {
                        conversionHappenedAt: 1707567367251,
                        eventId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        conversionValue: {
                          currencyCode: 'USD',
                          amount: '50',
                        },
                        user: {
                          userIds: [
                            {
                              idType: 'SHA256_EMAIL',
                              idValue:
                                '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                            },
                          ],
                          userInfo: {
                            firstName: 'Test',
                            lastName: 'Rudderlabs',
                          },
                        },
                        conversion: 'urn:lla:llaPartnerConversion:1234567',
                      },
                      {
                        conversionHappenedAt: 1707567367251,
                        eventId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        conversionValue: {
                          currencyCode: 'USD',
                          amount: '50',
                        },
                        user: {
                          userIds: [
                            {
                              idType: 'SHA256_EMAIL',
                              idValue:
                                '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                            },
                          ],
                          userInfo: {
                            firstName: 'Test',
                            lastName: 'Rudderlabs',
                          },
                        },
                        conversion: 'urn:lla:llaPartnerConversion:34567',
                      },
                      {
                        conversionHappenedAt: 1707567367251,
                        eventId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        conversionValue: {
                          currencyCode: 'USD',
                          amount: '50',
                        },
                        user: {
                          userIds: [
                            {
                              idType: 'SHA256_EMAIL',
                              idValue:
                                '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                            },
                          ],
                          userInfo: {
                            firstName: 'Test',
                            lastName: 'Rudderlabs',
                          },
                        },
                        conversion: 'urn:lla:llaPartnerConversion:1234567',
                      },
                      {
                        conversionHappenedAt: 1707567367251,
                        eventId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
                        conversionValue: {
                          currencyCode: 'USD',
                          amount: '50',
                        },
                        user: {
                          userIds: [
                            {
                              idType: 'SHA256_EMAIL',
                              idValue:
                                '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                            },
                          ],
                          userInfo: {
                            firstName: 'Test',
                            lastName: 'Rudderlabs',
                          },
                        },
                        conversion: 'urn:lla:llaPartnerConversion:34567',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://api.emarsys.com/rest/conversionEvents',
                headers: {
                  'Content-Type': 'application/json',
                  'X-RestLi-Method': 'BATCH_CREATE',
                  'X-Restli-Protocol-Version': '2.0.0',
                  'emarsys-Version': '202402',
                  Authorization: 'Bearer dummyToken',
                },
                params: {},
                files: {},
              },
              metadata: [
                {
                  sourceType: '',
                  destinationType: '',
                  namespace: '',
                  jobId: 1,
                  secret: {
                    accessToken: 'dummyToken',
                  },
                },
                {
                  sourceType: '',
                  destinationType: '',
                  namespace: '',
                  jobId: 2,
                  secret: {
                    accessToken: 'dummyToken',
                  },
                },
              ],
              batched: true,
              statusCode: 200,
              destination: commonDestination,
            },
          ],
        },
      },
    },
  },
];
