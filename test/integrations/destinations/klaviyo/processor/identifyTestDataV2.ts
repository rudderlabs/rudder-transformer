import { removeUndefinedAndNullValues } from '@rudderstack/integrations-lib';
import {
  overrideDestination,
  transformResultBuilder,
  generateSimplifiedIdentifyPayload,
  generateMetadata,
} from '../../../testUtils';
import { ProcessorTestData } from '../../../testTypes';
import { Destination } from '../../../../../src/types';
import { secret1, authHeader1 } from '../maskedSecrets';

const destination: Destination = {
  ID: '123',
  Name: 'klaviyo',
  DestinationDefinition: {
    ID: '123',
    Name: 'klaviyo',
    DisplayName: 'klaviyo',
    Config: {},
  },
  Config: {
    apiVersion: 'v2',
    privateApiKey: secret1,
  },
  Enabled: true,
  WorkspaceID: '123',
  Transformations: [],
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
  street: '63, Shibuya',
  properties: {
    listId: 'XUepkK',
    subscribe: true,
    consent: ['email', 'sms'],
  },
};

const commonOutputUserProps = {
  external_id: 'user@1',
  anonymous_id: '97c46c81-3140-456d-b2a9-690d70aaca35',
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
    address1: '63, Shibuya',
  },
  properties: {
    Flagged: false,
    Residence: 'Shibuya',
  },
};

const commonOutputSubscriptionProps = {
  profiles: {
    data: [
      {
        type: 'profile',
        attributes: {
          email: 'test@rudderstack.com',
          phone_number: '+12 345 578 900',
          subscriptions: {
            email: { marketing: { consent: 'SUBSCRIBED' } },
            sms: { marketing: { consent: 'SUBSCRIBED' } },
          },
        },
      },
    ],
  },
};
const commonOutputUnsubscriptionProps = {
  profiles: {
    data: [
      {
        type: 'profile',
        attributes: {
          email: 'test@rudderstack.com',
          phone_number: '+12 345 578 900',
        },
      },
    ],
  },
};
const subscriptionRelations = {
  list: {
    data: {
      type: 'list',
      id: 'XUepkK',
    },
  },
};

const commonOutputHeaders = {
  Authorization: authHeader1,
  'Content-Type': 'application/json',
  Accept: 'application/json',
  revision: '2024-06-15',
};

const anonymousId = '97c46c81-3140-456d-b2a9-690d70aaca35';
const userId = 'user@1';
const sentAt = '2021-01-03T17:02:53.195Z';
const originalTimestamp = '2021-01-03T17:02:53.193Z';
const userProfileCommonEndpoint = 'https://a.klaviyo.com/api/profile-import';
const subscribeEndpoint = 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs';
const unsubscribeEndpoint = 'https://a.klaviyo.com/api/profile-subscription-bulk-delete-jobs';

export const identifyData: ProcessorTestData[] = [
  {
    id: 'klaviyo-identify-150624-test-1',
    name: 'klaviyo',
    description:
      '150624 -> Identify call with flattenProperties enabled in destination config and subscribe',
    scenario: 'Business',
    successCriteria:
      'The profile response should contain the flattened properties of the friend object and one request object for subscribe',
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
            metadata: generateMetadata(2),
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
              userId: '',
              method: 'POST',
              endpoint: userProfileCommonEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'profile',
                  attributes: {
                    ...commonOutputUserProps,
                    properties: {
                      ...commonOutputUserProps.properties,
                      'friend.age': 25,
                      'friend.names.first': 'Alice',
                      'friend.names.last': 'Smith',
                    },
                  },
                  meta: {
                    patch_properties: {},
                  },
                },
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(2),
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
                  relationships: subscriptionRelations,
                },
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(2),
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-identify-150624-test-2',
    name: 'klaviyo',
    description:
      '150624 -> Identify call with flattenProperties enabled in destination config and unsubscribe',
    scenario: 'Business',
    successCriteria:
      'The profile response should contain the flattened properties of the friend object and one request object for subscribe',
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
                  properties: { ...commonTraits.properties, subscribe: false },
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
            metadata: generateMetadata(2),
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
              userId: '',
              method: 'POST',
              endpoint: userProfileCommonEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'profile',
                  attributes: {
                    ...commonOutputUserProps,
                    properties: {
                      ...commonOutputUserProps.properties,
                      'friend.age': 25,
                      'friend.names.first': 'Alice',
                      'friend.names.last': 'Smith',
                    },
                  },
                  meta: {
                    patch_properties: {},
                  },
                },
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(2),
          },
          {
            output: transformResultBuilder({
              userId: '',
              method: 'POST',
              endpoint: unsubscribeEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'profile-subscription-bulk-delete-job',
                  attributes: commonOutputUnsubscriptionProps,
                  relationships: subscriptionRelations,
                },
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(2),
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-identify-150624-test-3',
    name: 'klaviyo',
    description:
      '150624 -> Profile without subscribing/unsubscribing the user and get klaviyo id from externalId',
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
                externalId: [
                  {
                    type: 'klaviyo-profileId',
                    id: '12345678',
                  },
                ],
                traits: {
                  ...commonTraits,
                  appendList1: 'New Value 1',
                  appendList2: 'New Value 2',
                  unappendList1: 'Old Value 1',
                  unappendList2: 'Old Value 2',
                  properties: { ...commonTraits.properties, subscribe: undefined },
                },
              },
              integrations: {
                Klaviyo: {
                  fieldsToUnset: ['Unset1', 'Unset2'],
                  fieldsToAppend: ['appendList1', 'appendList2'],
                  fieldsToUnappend: ['unappendList1', 'unappendList2'],
                },
                All: true,
              },
              anonymousId,
              originalTimestamp,
            }),
            metadata: generateMetadata(4),
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
              method: 'POST',
              endpoint: userProfileCommonEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                data: {
                  type: 'profile',
                  id: '12345678',
                  attributes: commonOutputUserProps,
                  meta: {
                    patch_properties: {
                      append: {
                        appendList1: 'New Value 1',
                        appendList2: 'New Value 2',
                      },
                      unappend: {
                        unappendList1: 'Old Value 1',
                        unappendList2: 'Old Value 2',
                      },
                      unset: ['Unset1', 'Unset2'],
                    },
                  },
                },
              },
              userId: '',
            }),
            statusCode: 200,
            metadata: generateMetadata(4),
          },
        ],
      },
    },
  },
  {
    id: 'klaviyo-identify-150624-test-4',
    name: 'klaviyo',
    description: '150624 -> Identify call with enforceEmailAsPrimary enabled in destination config',
    scenario: 'Business',
    successCriteria:
      'Response should contain two payloads one for profile and other for subscription, response status code should be 200, for the profile updation payload there should be no external_id field in the payload as enforceEmailAsPrimary is set to true in the destination config and the userId should be mapped to _id field in the properties object',
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
            metadata: generateMetadata(5),
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
              userId: '',
              method: 'POST',
              endpoint: userProfileCommonEndpoint,
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
                  meta: {
                    patch_properties: {},
                  },
                },
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(5),
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
                  relationships: subscriptionRelations,
                },
              },
            }),
            statusCode: 200,
            metadata: generateMetadata(5),
          },
        ],
      },
    },
  },
];
