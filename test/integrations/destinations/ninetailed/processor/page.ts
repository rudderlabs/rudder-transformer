import { destination, context, commonProperties, metadata } from '../commonConfig';
import { transformResultBuilder } from '../../../testUtils';
export const page = [
  {
    id: 'ninetailed-test-page-success-1',
    name: 'ninetailed',
    description: 'page call with all mappings available',
    scenario: 'Framework+Buisness',
    successCriteria: 'Response should contain all the mappings and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              context,
              type: 'page',
              event: 'product purchased',
              userId: 'sajal12',
              channel: 'mobile',
              messageId: 'dummy_msg_id',
              properties: commonProperties,
              anonymousId: 'anon_123',
              integrations: {
                All: true,
              },
              originalTimestamp: '2021-01-25T15:32:56.409Z',
            },
            metadata,
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
              destinationId: 'dummyDestId',
            },
            output: transformResultBuilder({
              method: 'POST',
              endpoint:
                'https://experience.ninetailed.co/v2/organizations/dummyOrganisationId/environments/main/events',
              JSON: {
                events: [
                  {
                    context: {
                      app: {
                        name: 'RudderLabs JavaScript SDK',
                        version: '1.0.0',
                      },
                      campaign: {
                        name: 'campign_123',
                        source: 'social marketing',
                        medium: 'facebook',
                        term: '1 year',
                      },
                      library: {
                        name: 'RudderstackSDK',
                        version: 'Ruddderstack SDK version',
                      },
                      locale: 'en-US',
                      page: {
                        path: '/signup',
                        referrer: 'https://rudderstack.medium.com/',
                        search: '?type=freetrial',
                        url: 'https://app.rudderstack.com/signup?type=freetrial',
                      },
                      userAgent:
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                      location: {
                        coordinates: {
                          latitude: 40.7128,
                          longitude: -74.006,
                        },
                        city: 'San Francisco',
                        postalCode: '94107',
                        region: 'CA',
                        regionCode: 'CA',
                        country: '  United States',
                        countryCode: 'United States of America',
                        continent: 'North America',
                        timezone: 'America/Los_Angeles',
                      },
                    },
                    type: 'page',
                    channel: 'mobile',
                    messageId: 'dummy_msg_id',
                    properties: commonProperties,
                    anonymousId: 'anon_123',
                    originalTimestamp: '2021-01-25T15:32:56.409Z',
                  },
                ],
              },
              userId: '',
            }),
            statusCode: 200,
          },
        ],
      },
    },
  },
];
