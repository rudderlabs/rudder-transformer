import { destination, traits, context, metadata, instrumentationErrorStatTags } from '../commonConfig';
import { transformResultBuilder } from '../../../testUtils';
export const identify = [
  {
    id: 'ninetailed-test-identify-success-1',
    name: 'ninetailed',
    description: 'identify call with all mappings available',
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
              type: 'identify',
              context,
              userId: 'sajal12',
              channel: 'mobile',
              messageId: '1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce',
              traits: traits,
              anonymousId: '9c6bd77ea9da3e68',
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
                    type: 'identify',
                    channel: 'mobile',
                    userId: 'sajal12',
                    messageId: '1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce',
                    traits: traits,
                    anonymousId: '9c6bd77ea9da3e68',
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
  {
    id: 'ninetailed-test-identify-failure-1',
    name: 'ninetailed',
    description: 'identify call with no userId available',
    scenario: 'Framework',
    successCriteria:
      'Error should be thrown for required field userId not present and status code should be 200',
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
              type: 'identify',
              channel: 'mobile',
              messageId: '1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce',
              traits: traits,
              anonymousId: '9c6bd77ea9da3e68',
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
            error:
              'Missing required value from "userIdOnly": Workflow: procWorkflow, Step: preparePayload, ChildStep: undefined, OriginalError: Missing required value from "userIdOnly"',
            metadata: {
              destinationId: 'dummyDestId',
            },
            statTags: instrumentationErrorStatTags,
            statusCode: 400,
          },
        ],
      },
    },
  },
];
