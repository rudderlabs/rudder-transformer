import {
  generateMetadata,
  generateTrackPayload,
  overrideDestination,
  transformResultBuilder,
} from '../../../testUtils';
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

const commonTimestamp = new Date('2023-10-14');

const commonHeader = {
  Authorization: 'Bearer default-accessToken',
  'Content-Type': 'application/json',
  'LinkedIn-Version': '202402',
  'X-RestLi-Method': 'BATCH_CREATE',
  'X-Restli-Protocol-Version': '2.0.0',
};

export const configLevelFeaturesTestData: ProcessorTestData[] = [
  {
    id: 'linkedin_ads-config-test-1',
    name: 'linkedin_ads',
    description: 'Track call : hashData is set to false and no deduplication key is provided',
    scenario: 'Business',
    successCriteria: 'email provided will not be hashed and eventId will be mapped from messageId',
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
            destination: overrideDestination(commonDestination, { hashData: false }),
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
                    eventId: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                    user: {
                      userIds: [
                        {
                          idType: 'SHA256_EMAIL',
                          idValue: 'abc@gmail.com',
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
    id: 'linkedin_ads-config-test-2',
    name: 'linkedin_ads',
    description: 'Track call : hashData is set to true and deduplication key is provided',
    scenario: 'Business',
    successCriteria:
      'email provided will be hashed and eventId will be mapped from deduplication key properties.eventId',
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
            destination: overrideDestination(commonDestination, {
              deduplicationKey: `properties.eventId`,
            }),
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
];
