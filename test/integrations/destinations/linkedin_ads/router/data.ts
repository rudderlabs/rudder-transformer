export const mockFns = (_) => {
  // @ts-ignore
  jest.useFakeTimers().setSystemTime(new Date('2023-10-15'));
};

const config = {
  hashData: true,
  deduplicationKey: 'properties.eventId',
  conversionMapping: [
    {
      from: 'ABC Searched',
      to: '1234567',
    },
    {
      from: 'spin_result',
      to: '23456',
    },
    {
      from: 'ABC Searched',
      to: '34567',
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
    Name: 'linkedin_ads',
    DisplayName: 'LinkedIn Ads',
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
    id: 'linkedin_ads-track-test-1',
    name: 'linkedin_ads',
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
                type: 'track',
                event: 'ABC Searched',
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
                properties: {
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'USD',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
                  requestIP: '123.0.0.0',
                  optOutType: 'LDP',
                  clickId: 'dummy_clickId',

                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                },
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
                type: 'track',
                event: 'ABC Searched',
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
                properties: {
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'USD',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
                  requestIP: '123.0.0.0',
                  optOutType: 'LDP',
                  clickId: 'dummy_clickId',

                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                },
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
                type: 'track',
                event: 'spin_result',
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
                properties: {
                  tax: 2,
                  total: 27.5,
                  coupon: 'hasbros',
                  revenue: 48,
                  price: 25,
                  quantity: 2,
                  currency: 'USD',
                  discount: 2.5,
                  order_id: '50314b8e9bcf000000000000',
                  requestIP: '123.0.0.0',
                  optOutType: 'LDP',
                  clickId: 'dummy_clickId',

                  shipping: 3,
                  subtotal: 22.5,
                  affiliation: 'Google Store',
                  checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                },
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
          destType: 'linkedin_ads',
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
                  Name: 'linkedin_ads',
                  DisplayName: 'LinkedIn Ads',
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
                '[LinkedIn Conversion API] no matching user id found. Please provide at least one of the following: email, linkedinFirstPartyAdsTrackingUUID, acxiomId, oracleMoatId',
              statTags: {
                destType: 'LINKEDIN_ADS',
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
                endpoint: 'https://api.linkedin.com/rest/conversionEvents',
                headers: {
                  'Content-Type': 'application/json',
                  'X-RestLi-Method': 'BATCH_CREATE',
                  'X-Restli-Protocol-Version': '2.0.0',
                  'LinkedIn-Version': '202402',
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
].map((d) => ({ ...d, mockFns }));
