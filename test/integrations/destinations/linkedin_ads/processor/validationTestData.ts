import {
  generateMetadata,
  generateTrackPayload,
  overrideDestination,
  transformResultBuilder,
} from '../../../testUtils';
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
  additional_bet_index: 0,
  eventId: '12345',
};

const commonUserPropertiesWithProductWithoutPrice = {
  additional_bet_index: 0,
  eventId: '12345',
  products: [
    {
      productId: '12345',
    },
    {
      productId: '123456',
    },
  ],
};

const commonStats = {
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

const commonTimestamp = new Date('2023-10-14');
const olderTimestamp = new Date('2023-07-13');

export const validationTestData: ProcessorTestData[] = [
  {
    id: 'linkedin_ads-validation-test-1',
    name: 'linkedin_ads',
    description: 'Track call : event is older than 90 days',
    scenario: 'Business',
    successCriteria: 'shoud throw error with status code 400 and error message',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'spin_result',
              properties: { ...commonUserProperties, price: 400 },
              context: {
                traits: commonUserTraits,
              },
              timestamp: olderTimestamp,
              messageId: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
            }),
            metadata: generateMetadata(1),
            destination: overrideDestination(commonDestination, { hashData: false }),
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
              'Events must be sent within ninety days of their occurrence.: Workflow: procWorkflow, Step: commonFields, ChildStep: undefined, OriginalError: Events must be sent within ninety days of their occurrence.',
            metadata: generateMetadata(1),
            statTags: {
              destinationId: 'default-destinationId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              implementation: 'cdkV2',
              destType: 'LINKEDIN_ADS',
              module: 'destination',
              feature: 'processor',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'linkedin_ads-validation-test-2',
    name: 'linkedin_ads',
    description: 'Track call : event not mapped to conversion rule in UI',
    scenario: 'Business',
    successCriteria:
      'should throw error with status code 400 and error message no matching conversion rule found for random event. Please provide a conversion rule. Aborting',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'random event',
              properties: { ...commonUserProperties, price: 400 },
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
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              '[LinkedIn Conversion API] no matching conversion rule found for random event. Please provide a conversion rule. Aborting: Workflow: procWorkflow, Step: deduceConversionEventRules, ChildStep: undefined, OriginalError: [LinkedIn Conversion API] no matching conversion rule found for random event. Please provide a conversion rule. Aborting',
            metadata: generateMetadata(1),
            statTags: { ...commonStats, errorType: 'configuration' },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'linkedin_ads-validation-test-3',
    name: 'linkedin_ads',
    description: '[Error]: Check for unsupported message type',
    scenario: 'Framework',
    successCriteria:
      'Response should contain error message and status code should be 400, as we are sending a message type which is not supported by linkedin_ads destination and the error message should be Event type random is not supported',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: commonDestination,
            metadata: generateMetadata(1),
            message: {
              userId: 'user123',
              type: 'random',
              groupId: 'XUepkK',
              traits: {
                subscribe: true,
              },
              context: {
                traits: {
                  email: 'test@rudderstack.com',
                  phone: '+12 345 678 900',
                  consent: 'email',
                },
              },
              timestamp: '2020-01-21T00:21:34.208Z',
            },
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
              'message type random is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type random is not supported',
            metadata: generateMetadata(1),
            statTags: commonStats,
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'linkedin_ads-validation-test-4',
    name: 'linkedin_ads',
    description: 'Track call : properties without product array and no price',
    scenario: 'Business',
    successCriteria:
      'should not have conversionValue object as price is a mandatory field for linkedin conversions',
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
              messageId: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
            }),
            metadata: generateMetadata(1),
            destination: overrideDestination(commonDestination, {
              deduplicationKey: `properties.eventId`,
            }),
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
    id: 'linkedin_ads-validation-test-5',
    name: 'linkedin_ads',
    description: 'Track call : properties with product array and no price',
    scenario: 'Business',
    successCriteria:
      'should throw error with status code 400 and error message regarding price is a mandatory field for linkedin conversions',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateTrackPayload({
              event: 'ABC Searched',
              properties: commonUserPropertiesWithProductWithoutPrice,
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
