import { removeUndefinedAndNullValues } from '@rudderstack/integrations-lib';
import {
  overrideDestination,
  transformResultBuilder,
  generateSimplifiedIdentifyPayload,
} from '../../../testUtils';

const destination = {
  Config: {
    publicApiKey: 'dummyPublicApiKey',
    privateApiKey: 'dummyPrivateApiKey',
  },
};

const commonTraits = {
  firstName: 'Test',
  lastName: 'Rudderlabs',
  email: 'test@rudderstack.com',
  phone: '+12 345 578 900',
  userId: 'user@1',
  title: 'Developer',
  organization: 'Rudder',
  city: 'Tokyo',
  region: 'Kanto',
  country: 'JP',
  zip: '100-0001',
  Flagged: false,
  Residence: 'Shibuya',
  properties: {
    listId: 'XUepkK',
    subscribe: true,
    consent: ['email', 'sms'],
  },
};

const commonOutputUserProps = {
  external_id: 'user@1',
  email: 'test@rudderstack.com',
  first_name: 'Test',
  last_name: 'Rudderlabs',
  phone_number: '+12 345 578 900',
  title: 'Developer',
  organization: 'Rudder',
  location: {
    city: 'Tokyo',
    region: 'Kanto',
    country: 'JP',
    zip: '100-0001',
  },
  properties: {
    Flagged: false,
    Residence: 'Shibuya',
  },
};

const commonOutputSubscriptionProps = {
  list_id: 'XUepkK',
  subscriptions: [
    {
      email: 'test@rudderstack.com',
      phone_number: '+12 345 578 900',
      channels: {
        email: ['MARKETING'],
        sms: ['MARKETING'],
      },
    },
  ],
};

const commonOutputHeaders = {
  Authorization: 'Klaviyo-API-Key dummyPrivateApiKey',
  'Content-Type': 'application/json',
  Accept: 'application/json',
  revision: '2023-02-22',
};

const anonymousId = '97c46c81-3140-456d-b2a9-690d70aaca35';
const userId = 'user@1';
const sentAt = '2021-01-03T17:02:53.195Z';
const originalTimestamp = '2021-01-03T17:02:53.193Z';
const commonUserUpdateEndpoint = 'https://a.klaviyo.com/api/profiles/01GW3PHVY0MTCDGS0A1612HARX';
const subscribeEndpoint = 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs';

export const identifyData = [
  {
    id: 'klaviyo-identify-test-1',
    name: 'klaviyo',
    description:
      'Identify and Subscribe user where the user doesnot exists[mock] (without suppression status code feature from server)',
    scenario: 'Business + Framework',
    successCriteria:
      'Response should containt two payloads one for profile updation and other for subscription, response status code should be 200',
    comment:
      'Reasoning: As suppression status code feature is not enabled from server, so we would expect 2 responses from transformer one for profile updation (deafult behaviour) and other for subscription',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedIdentifyPayload({
              context: {
                traits: commonTraits,
              },
              anonymousId,
              userId,
              sentAt,
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
              userId: '',
              method: 'PATCH',
              endpoint: commonUserUpdateEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'profile',
                  attributes: commonOutputUserProps,
                  id: '01GW3PHVY0MTCDGS0A1612HARX',
                },
              },
            }),
            statusCode: 200,
          },
          {
            output: transformResultBuilder({
              method: 'POST',
              userId: '',
              endpoint: subscribeEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'profile-subscription-bulk-create-job',
                  attributes: commonOutputSubscriptionProps,
                },
              },
            }),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-identify-test-2',
    name: 'klaviyo',
    description: 'Identify call for with flattenProperties enabled in destination config',
    scenario: 'Business',
    successCriteria:
      'The profile updation response should contain the flattened properties of the friend object',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, { flattenProperties: true }),
            message: generateSimplifiedIdentifyPayload({
              sentAt,
              userId,
              context: {
                traits: {
                  ...commonTraits,
                  friend: {
                    names: {
                      first: 'Alice',
                      last: 'Smith',
                    },
                    age: 25,
                  },
                },
              },
              anonymousId,
              originalTimestamp,
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
              userId: '',
              method: 'PATCH',
              endpoint: commonUserUpdateEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'profile',
                  id: '01GW3PHVY0MTCDGS0A1612HARX',
                  attributes: {
                    ...commonOutputUserProps,
                    properties: {
                      ...commonOutputUserProps.properties,
                      'friend.age': 25,
                      'friend.names.first': 'Alice',
                      'friend.names.last': 'Smith',
                    },
                  },
                },
              },
            }),
            statusCode: 200,
          },
          {
            output: transformResultBuilder({
              userId: '',
              method: 'POST',
              endpoint: subscribeEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'profile-subscription-bulk-create-job',
                  attributes: commonOutputSubscriptionProps,
                },
              },
            }),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-identify-test-3',
    name: 'klaviyo',
    description: 'Negative Test Case for Profile updation call and subcribe user',
    scenario: 'Business + Framework',
    successCriteria:
      'Response should contain error message and status code should be 500, as we are getting a network error from klaviyo',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              Config: {
                publicApiKey: 'dummyPublicApiKey',
                privateApiKey: 'dummyPrivateApiKeyforfailure',
              },
            },
            message: generateSimplifiedIdentifyPayload({
              sentAt,
              userId,
              context: {
                traits: {
                  ...commonTraits,
                  email: 'test3@rudderstack.com',
                },
              },
              anonymousId,
              originalTimestamp,
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
            error:
              '{"message":"Failed to create user due to \\"\\"","destinationResponse":"\\"\\""}',
            statTags: {
              destType: 'KLAVIYO',
              errorCategory: 'network',
              errorType: 'retryable',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 500,
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-identify-test-4',
    name: 'klaviyo',
    description: 'Profile create update without subscribing the user',
    scenario: 'Business',
    successCriteria:
      'Response should contain only profile update payload and status code should be 200 as subscribe is set to false in the payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            message: generateSimplifiedIdentifyPayload({
              sentAt,
              userId,
              context: {
                traits: {
                  ...commonTraits,
                  properties: { ...commonTraits.properties, subscribe: false },
                },
              },
              anonymousId,
              originalTimestamp,
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
              method: 'PATCH',
              endpoint: commonUserUpdateEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'profile',
                  attributes: commonOutputUserProps,
                  id: '01GW3PHVY0MTCDGS0A1612HARX',
                },
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
    id: 'klaviyo-identify-test-5',
    name: 'klaviyo',
    description: 'Identify call with enforceEmailAsPrimary enabled in destination config',
    scenario: 'Business',
    successCriteria:
      'Response should contain two payloads one for profile updation and other for subscription, response status code should be 200, for the profile updation payload there should be no external_id field in the payload as enforceEmailAsPrimary is set to true in the destination config and the userId should be mapped to _id field in the properties object',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, { enforceEmailAsPrimary: true }),
            message: generateSimplifiedIdentifyPayload({
              sentAt,
              userId,
              context: {
                traits: commonTraits,
              },
              anonymousId,
              originalTimestamp,
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
              userId: '',
              method: 'PATCH',
              endpoint: commonUserUpdateEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'profile',
                  attributes: removeUndefinedAndNullValues({
                    ...commonOutputUserProps,
                    properties: {
                      ...commonOutputUserProps.properties,
                      _id: userId,
                    },
                    // remove external_id from the payload
                    external_id: undefined,
                  }),
                  id: '01GW3PHVY0MTCDGS0A1612HARX',
                },
              },
            }),
            statusCode: 200,
          },
          {
            output: transformResultBuilder({
              userId: '',
              method: 'POST',
              endpoint: subscribeEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'profile-subscription-bulk-create-job',
                  attributes: commonOutputSubscriptionProps,
                },
              },
            }),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-identify-test-6',
    name: 'klaviyo',
    description: 'Identify call without user custom Properties',
    scenario: 'Business',
    successCriteria:
      'Response should contain two payloads one for profile updation and other for subscription, response status code should be 200, for the profile updation payload does not have any custom properties in the payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: destination,
            message: generateSimplifiedIdentifyPayload({
              sentAt,
              userId,
              context: {
                traits: removeUndefinedAndNullValues({
                  ...commonTraits,
                  Flagged: undefined,
                  Residence: undefined,
                }),
              },
              anonymousId,
              originalTimestamp,
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
              userId: '',
              method: 'PATCH',
              endpoint: commonUserUpdateEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'profile',
                  attributes: removeUndefinedAndNullValues({
                    ...commonOutputUserProps,
                    properties: undefined,
                  }),
                  id: '01GW3PHVY0MTCDGS0A1612HARX',
                },
              },
            }),
            statusCode: 200,
          },
          {
            output: transformResultBuilder({
              userId: '',
              method: 'POST',
              endpoint: subscribeEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'profile-subscription-bulk-create-job',
                  attributes: commonOutputSubscriptionProps,
                },
              },
            }),
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-identify-test-7',
    name: 'klaviyo',
    description: 'Identify call without email and phone & enforceEmailAsPrimary enabled from UI',
    scenario: 'Business',
    successCriteria:
      'Response should contain error message and status code should be 400, as we are not sending email and phone in the payload and enforceEmailAsPrimary is enabled from UI',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: overrideDestination(destination, { enforceEmailAsPrimary: true }),
            message: generateSimplifiedIdentifyPayload({
              sentAt,
              userId,
              context: {
                traits: removeUndefinedAndNullValues({
                  ...commonTraits,
                  email: undefined,
                  phone: undefined,
                }),
              },
              anonymousId,
              originalTimestamp,
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
            error: 'None of email and phone are present in the payload',
            statTags: {
              destType: 'KLAVIYO',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
];
