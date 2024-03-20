import { generateMetadata, generateTrackPayload, transformResultBuilder } from '../../../testUtils';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';

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
    oneTrustCookieCategories: [
      {
        oneTrustCookieCategory: 'Marketing',
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
  revenue: 400,
  additional_bet_index: 0,
  email: 'abc@gmail.com',
  eventId: '12345',
};

const commonTimestamp = new Date('2023-10-14');

export const trackTestData: ProcessorTestData[] = [
  {
    id: 'linkedin_ads-track-test-1',
    name: 'linkedin_ads',
    description: 'Track call : custom event calls with simple user properties and traits',
    scenario: 'Business',
    successCriteria:
      'event not respecting the internal mapping and as well as UI mapping should be considered as a custom event and should be sent as it is',
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
              headers: {
                Authorization: 'Bearer default-accessToken',
                'Content-Type': 'application/json',
                'LinkedIn-Version': '202402',
                'X-RestLi-Method': 'BATCH_CREATE',
                'X-Restli-Protocol-Version': '2.0.0',
              },
              params: {},
              FORM: {},
              files: {},
              JSON: {
                elements: [
                  {
                    conversion: 'urn:lla:llaPartnerConversion:23456',
                    conversionHappenedAt: 1697241600000,
                    conversionValue: {
                      amount: 0,
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
    description:
      'Track call : other standard type event calls with simple user properties and traits',
    scenario: 'Business',
    successCriteria:
      'event not respecting the internal mapping and as well as UI mapping but falls under other standard events, should be considered as a simple track event',
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
              headers: {
                Authorization: 'Bearer default-accessToken',
                'Content-Type': 'application/json',
                'LinkedIn-Version': '202402',
                'X-RestLi-Method': 'BATCH_CREATE',
                'X-Restli-Protocol-Version': '2.0.0',
              },
              params: {},
              FORM: {},
              files: {},
              JSON: {
                elements: [
                  {
                    conversion: 'urn:lla:llaPartnerConversion:1234567',
                    conversionHappenedAt: 1697241600000,
                    conversionValue: {
                      amount: 0,
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
                      amount: 0,
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
];
