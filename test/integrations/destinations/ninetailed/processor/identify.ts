import {
  destination,
  traits,
  commonInput,
  commonInputWithNoLocationAndChannel,
  metadata,
} from '../commonConfig';
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
              ...commonInput,
              userId: 'sajal12',
              traits: traits,
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
                    channel: 'web',
                    userId: 'sajal12',
                    messageId: 'dummy_msg_id',
                    traits: traits,
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
  {
    id: 'ninetailed-test-identify-success-2',
    name: 'ninetailed',
    description: 'identify call with no userId available',
    scenario: 'Framework',
    successCriteria:
      'No Error should be thrown for field userId not present but default empty string should be provided to userId and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: {
              ...commonInputWithNoLocationAndChannel,
              type: 'identify',
              messageId: 'dummy_msg_id',
              traits: traits,
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
                      location: {},
                    },
                    type: 'identify',
                    userId: '',
                    channel: 'server',
                    messageId: 'dummy_msg_id',
                    traits: traits,
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
  {
    id: 'ninetailed-test-identify-success-3',
    name: 'ninetailed',
    description: 'identify call with no context.location present and {} is used as default',
    scenario: 'Framework+Buisness',
    successCriteria: 'Response should contain context.location as {} and status code should be 200',
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
              ...commonInputWithNoLocationAndChannel,
              userId: 'sajal12',
              traits: traits,
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
                      location: {},
                    },
                    type: 'identify',
                    channel: 'server',
                    userId: 'sajal12',
                    messageId: 'dummy_msg_id',
                    traits: traits,
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
