import { generateMetadata, generateTrackPayload, transformResultBuilder } from '../../../testUtils';
import { Destination } from '../../../../../src/types';
import { ProcessorTestData } from '../../../testTypes';

const commonDestination: Destination = {
  ID: '12335',
  Name: 'sample-destination',
  DestinationDefinition: {
    ID: '123',
    Name: 'facebook_pixel',
    DisplayName: 'Facebook Pixel',
    Config: {},
  },
  WorkspaceID: '123',
  Transformations: [],
  Config: {
    blacklistPiiProperties: [
      {
        blacklistPiiProperties: '',
        blacklistPiiHash: false,
      },
    ],
    accessToken: '09876',
    pixelId: 'dummyPixelId',
    eventsToEvents: [
      {
        from: '',
        to: '',
      },
    ],
    eventCustomProperties: [
      {
        eventCustomProperties: '',
      },
    ],
    valueFieldIdentifier: '',
    advancedMapping: false,
    whitelistPiiProperties: [
      {
        whitelistPiiProperties: 'email',
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
};

const commonTimestamp = new Date('2023-10-14');

export const trackTestData: ProcessorTestData[] = [
  {
    id: 'fbPixel-track-test-1',
    name: 'facebook_pixel',
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
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'spin_result',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      additional_bet_index: 0,
                      email: 'abc@gmail.com',
                      value: 400,
                    },
                  }),
                ],
              },
              files: {},
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
    id: 'fbPixel-track-test-2',
    name: 'facebook_pixel',
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
              event: 'AddToWishlist',
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
              endpoint: 'https://graph.facebook.com/v24.0/dummyPixelId/events?access_token=09876',
              endpointPath: 'events',
              headers: {},
              params: {},
              FORM: {
                data: [
                  JSON.stringify({
                    user_data: {
                      external_id:
                        '3ffc8a075f330402d82aa0a86c596b0d2fe70df38b22c5be579f86a18e4aca47',
                      em: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                      client_user_agent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                    },
                    event_name: 'AddToWishlist',
                    event_time: 1697241600,
                    event_id: '12345',
                    action_source: 'website',
                    custom_data: {
                      additional_bet_index: 0,
                      email: 'abc@gmail.com',
                      value: 400,
                    },
                  }),
                ],
              },
              files: {},
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
