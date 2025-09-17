import { generateMetadata, generateTrackPayload, transformResultBuilder } from '../../../testUtils';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';
import { defaultAccessTokenAuthHeader } from '../../../common/secrets';

const commonDestination: Destination = {
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
  Config: {
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
  },
  Enabled: true,
};

const commonUserTraits = {
  email: 'abc@gmail.com',
  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
  event_id: '12345',
};

const commonUserProperties = {
  price: 400,
  additional_bet_index: 0,
  eventId: '12345',
};

const commonPropertiesWithProducts = {
  revenue: 400,
  additional_bet_index: 0,
  eventId: '12345',
  products: [
    {
      product_id: '123',
      name: 'abc',
      category: 'def',
      brand: 'xyz',
      variant: 'pqr',
      price: 100,
      quantity: 2,
    },
    {
      product_id: '456',
      name: 'def',
      category: 'abc',
      brand: 'pqr',
      variant: 'xyz',
      price: 200,
      quantity: 3,
    },
  ],
};

const commonPropertiesWithProductsPriceNotPresentInAll = {
  revenue: 400,
  additional_bet_index: 0,
  eventId: '12345',
  products: [
    {
      product_id: '123',
      name: 'abc',
      category: 'def',
      brand: 'xyz',
      variant: 'pqr',
      quantity: 2,
    },
    {
      product_id: '456',
      name: 'def',
      category: 'abc',
      brand: 'pqr',
      variant: 'xyz',
      price: 200,
      quantity: 3,
    },
  ],
};

const commonTimestamp = new Date('2023-10-14');

const commonStatTags = {
  destinationId: 'default-destinationId',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  implementation: 'cdkV2',
  destType: 'LINKEDIN_ADS',
  module: 'destination',
  feature: 'processor',
  workspaceId: 'default-workspaceId',
};

const commonHeader = {
  Authorization: defaultAccessTokenAuthHeader,
  'Content-Type': 'application/json',
  'LinkedIn-Version': '202509',
  'X-RestLi-Method': 'BATCH_CREATE',
  'X-Restli-Protocol-Version': '2.0.0',
};

export const trackTestData: ProcessorTestData[] = [
  {
    id: 'linkedin_ads-track-test-1',
    name: 'linkedin_ads',
    description: 'Track call : particular track event mapped to a specific conversion rule',
    scenario: 'Business',
    successCriteria:
      'event will respect the UI mapping and create a conversion event with the mapped conversion rule',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'spin_result',
              properties: commonUserProperties,
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
              messageId: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `https://api.linkedin.com/rest/conversionEvents`,
              headers: commonHeader,
              params: {},
              FORM: {},
              files: {},
              JSON: {
                elements: [
                  {
                    conversion: 'urn:lla:llaPartnerConversion:23456',
                    conversionHappenedAt: 1697241600000,
                    conversionValue: {
                      amount: '400',
                      currencyCode: 'USD',
                    },
                    eventId: '12345',
                    user: {
                      userIds: [
                        {
                          idType: 'SHA256_EMAIL',
                          idValue:
                            '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                        },
                      ],
                    },
                  },
                ],
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'linkedin_ads-track-test-2',
    name: 'linkedin_ads',
    description: 'Track call : event is mapped with more than one conversion rules ',
    scenario: 'Business',
    successCriteria:
      'event will respect the UI mapping and create a conversion event with the mapped conversion rule and club the two conversions in a single elements array',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'ABC Searched',
              properties: commonUserProperties,
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `https://api.linkedin.com/rest/conversionEvents`,
              headers: commonHeader,
              params: {},
              FORM: {},
              files: {},
              JSON: {
                elements: [
                  {
                    conversion: 'urn:lla:llaPartnerConversion:1234567',
                    conversionHappenedAt: 1697241600000,
                    conversionValue: {
                      amount: '400',
                      currencyCode: 'USD',
                    },
                    eventId: '12345',
                    user: {
                      userIds: [
                        {
                          idType: 'SHA256_EMAIL',
                          idValue:
                            '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                        },
                      ],
                    },
                  },
                  {
                    conversion: 'urn:lla:llaPartnerConversion:34567',
                    conversionHappenedAt: 1697241600000,
                    conversionValue: {
                      amount: '400',
                      currencyCode: 'USD',
                    },
                    eventId: '12345',
                    user: {
                      userIds: [
                        {
                          idType: 'SHA256_EMAIL',
                          idValue:
                            '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                        },
                      ],
                    },
                  },
                ],
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'linkedin_ads-track-test-3',
    name: 'linkedin_ads',
    description: 'Track call : track event containing multiple allowed user identifiqers',
    scenario: 'Business',
    successCriteria:
      'event will respect the UI mapping and create a conversion event with the mapped conversion rule',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'spin_result',
              properties: commonUserProperties,
              externalId: [
                {
                  id: 'test@rudderlabs.com',
                  type: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID',
                },
                {
                  id: 'test@rudderlabs.com',
                  type: 'ACXIOM_ID',
                },
                {
                  id: 'test@rudderlabs.com',
                  type: 'ORACLE_MOAT_ID',
                },
              ],
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
              messageId: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `https://api.linkedin.com/rest/conversionEvents`,
              headers: commonHeader,
              params: {},
              FORM: {},
              files: {},
              JSON: {
                elements: [
                  {
                    conversion: 'urn:lla:llaPartnerConversion:23456',
                    conversionHappenedAt: 1697241600000,
                    conversionValue: {
                      amount: '400',
                      currencyCode: 'USD',
                    },
                    eventId: '12345',
                    user: {
                      userIds: [
                        {
                          idType: 'SHA256_EMAIL',
                          idValue:
                            '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                        },
                        {
                          idType: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID',
                          idValue: 'test@rudderlabs.com',
                        },
                        {
                          idType: 'ACXIOM_ID',
                          idValue: 'test@rudderlabs.com',
                        },
                        {
                          idType: 'ORACLE_MOAT_ID',
                          idValue: 'test@rudderlabs.com',
                        },
                      ],
                    },
                  },
                ],
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'linkedin_ads-track-test-4',
    name: 'linkedin_ads',
    description: 'Track call : event not containing any of the allowed user identifiers',
    scenario: 'Business',
    successCriteria:
      'Error will be thrown as the event does not contain any of the allowed user identifiers',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'ABC Searched',
              properties: commonUserProperties,
              context: {
                traits: {
                  firstName: 'John',
                },
              },
              timestamp: commonTimestamp,
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
              '[LinkedIn Conversion API] no matching user id found. Please provide at least one of the following: email, linkedinFirstPartyAdsTrackingUUID, acxiomId, oracleMoatId: Workflow: procWorkflow, Step: commonFields, ChildStep: undefined, OriginalError: [LinkedIn Conversion API] no matching user id found. Please provide at least one of the following: email, linkedinFirstPartyAdsTrackingUUID, acxiomId, oracleMoatId',
            metadata: generateMetadata(1),
            statTags: commonStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'linkedin_ads-track-test-5',
    name: 'linkedin_ads',
    description: 'Track call : track event containing product array',
    scenario: 'Business',
    successCriteria:
      'the amount will be summation of product * quantity for all the products in the array',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'spin_result',
              properties: commonPropertiesWithProducts,
              externalId: [
                {
                  id: 'test@rudderlabs.com',
                  type: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID',
                },
                {
                  id: 'test@rudderlabs.com',
                  type: 'ACXIOM_ID',
                },
                {
                  id: 'test@rudderlabs.com',
                  type: 'ORACLE_MOAT_ID',
                },
              ],
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
              messageId: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `https://api.linkedin.com/rest/conversionEvents`,
              headers: commonHeader,
              params: {},
              FORM: {},
              files: {},
              JSON: {
                elements: [
                  {
                    conversion: 'urn:lla:llaPartnerConversion:23456',
                    conversionHappenedAt: 1697241600000,
                    conversionValue: {
                      amount: '800',
                      currencyCode: 'USD',
                    },
                    eventId: '12345',
                    user: {
                      userIds: [
                        {
                          idType: 'SHA256_EMAIL',
                          idValue:
                            '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                        },
                        {
                          idType: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID',
                          idValue: 'test@rudderlabs.com',
                        },
                        {
                          idType: 'ACXIOM_ID',
                          idValue: 'test@rudderlabs.com',
                        },
                        {
                          idType: 'ORACLE_MOAT_ID',
                          idValue: 'test@rudderlabs.com',
                        },
                      ],
                    },
                  },
                ],
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'linkedin_ads-track-test-6',
    name: 'linkedin_ads',
    description: 'Track call : track event containing first name and last name in traits',
    scenario: 'Business',
    successCriteria:
      'output event will contain userInfo object only because first name and last name are present in traits',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'spin_result',
              properties: commonUserProperties,
              context: {
                traits: { ...commonUserTraits, firstName: 'John', lastName: 'Doe' },
              },
              timestamp: commonTimestamp,
              messageId: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `https://api.linkedin.com/rest/conversionEvents`,
              headers: commonHeader,
              params: {},
              FORM: {},
              files: {},
              JSON: {
                elements: [
                  {
                    conversion: 'urn:lla:llaPartnerConversion:23456',
                    conversionHappenedAt: 1697241600000,
                    conversionValue: {
                      amount: '400',
                      currencyCode: 'USD',
                    },
                    eventId: '12345',
                    user: {
                      userIds: [
                        {
                          idType: 'SHA256_EMAIL',
                          idValue:
                            '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                        },
                      ],
                      userInfo: {
                        firstName: 'John',
                        lastName: 'Doe',
                      },
                    },
                  },
                ],
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
  {
    id: 'linkedin_ads-track-test-7',
    name: 'linkedin_ads',
    description:
      'Track call : track event containing product array where not all products contains price field',
    scenario: 'Business',
    successCriteria:
      'the amount will be summation of product * quantity for all the products in the array',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'spin_result',
              properties: commonPropertiesWithProductsPriceNotPresentInAll,
              externalId: [
                {
                  id: 'test@rudderlabs.com',
                  type: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID',
                },
                {
                  id: 'test@rudderlabs.com',
                  type: 'ACXIOM_ID',
                },
                {
                  id: 'test@rudderlabs.com',
                  type: 'ORACLE_MOAT_ID',
                },
              ],
              context: {
                traits: commonUserTraits,
              },
              timestamp: commonTimestamp,
              messageId: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
            }),
            metadata: generateMetadata(1),
            destination: commonDestination,
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
            output: transformResultBuilder({
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: `https://api.linkedin.com/rest/conversionEvents`,
              headers: commonHeader,
              params: {},
              FORM: {},
              files: {},
              JSON: {
                elements: [
                  {
                    conversion: 'urn:lla:llaPartnerConversion:23456',
                    conversionHappenedAt: 1697241600000,
                    conversionValue: {
                      amount: '600',
                      currencyCode: 'USD',
                    },
                    eventId: '12345',
                    user: {
                      userIds: [
                        {
                          idType: 'SHA256_EMAIL',
                          idValue:
                            '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                        },
                        {
                          idType: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID',
                          idValue: 'test@rudderlabs.com',
                        },
                        {
                          idType: 'ACXIOM_ID',
                          idValue: 'test@rudderlabs.com',
                        },
                        {
                          idType: 'ORACLE_MOAT_ID',
                          idValue: 'test@rudderlabs.com',
                        },
                      ],
                    },
                  },
                ],
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(1),
          },
        ],
      },
    },
  },
];
