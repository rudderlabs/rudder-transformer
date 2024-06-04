import {
  overrideDestination,
  transformResultBuilder,
  generateSimplifiedIdentifyPayload,
} from '../../testUtils';

const destination = {
  ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
  Name: 'BLUECORE',
  Config: {
    bluecoreNamespace: 'dummy_sandbox',
    eventsMapping: [
      {
        from: 'ABC Searched',
        to: 'search',
      },
    ],
  },
  Enabled: true,
  Transformations: [],
  DestinationDefinition: { Config: { cdkV2Enabled: true } },
};

const metadata = {
  sourceType: '',
  destinationType: '',
  namespace: '',
  destinationId: '',
};

const commonTraits = {
  anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
  phone: '+1234589947',
  gender: 'non-binary',
  db: '19950715',
  lastname: 'Rudderlabs',
  firstName: 'Test',
  address: {
    city: 'Kolkata',
    state: 'WB',
    zip: '700114',
    country: 'IN',
  },
};

const contextWithExternalId = {
  traits: {
    ...commonTraits,
    email: 'abc@gmail.com',
  },
  externalId: [{ type: 'bluecoreExternalId', id: '54321' }],
};

const commonOutputCustomerProperties = {
  first_name: 'Test',
  last_name: 'Rudderlabs',
  sex: 'non-binary',
  anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
  db: '19950715',
  gender: 'non-binary',
  phone: '+1234589947',
  address: {
    city: 'Kolkata',
    state: 'WB',
    zip: '700114',
    country: 'IN',
  },
};

const commonOutputHeaders = {
  'Content-Type': 'application/json',
};

const anonymousId = '97c46c81-3140-456d-b2a9-690d70aaca35';
const userId = 'user@1';
const sentAt = '2021-01-03T17:02:53.195Z';
const originalTimestamp = '2021-01-03T17:02:53.193Z';
const commonEndpoint = 'https://api.bluecore.app/api/track/mobile/v1';

export const identifyData = [
  {
    id: 'bluecore-identify-test-1',
    name: 'bluecore',
    description:
      '[Success]: Identify call with all properties, that creates a customer in bluecore by default',
    scenario: 'Business',
    successCriteria:
      'Response should containt one payload with event name as customer_patch and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            metadata,
            message: generateSimplifiedIdentifyPayload({
              context: {
                traits: { ...commonTraits, email: 'abc@gmail.com' },
              },
              anonymousId,
              userId,
              sentAt,
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
              method: 'POST',
              endpoint: commonEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                properties: {
                  distinct_id: 'abc@gmail.com',
                  customer: { ...commonOutputCustomerProperties, email: 'abc@gmail.com' },
                  token: 'dummy_sandbox',
                },
                event: 'customer_patch',
              },
            }),
            metadata: {
              sourceType: '',
              destinationType: '',
              namespace: '',
              destinationId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-identify-test-2',
    name: 'bluecore',
    description:
      '[Success]: Identify call with all properties,along with action as identify that mandatorily needs email to link distict_id with customer in bluecore',
    scenario: 'Business',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            metadata,
            message: generateSimplifiedIdentifyPayload({
              context: {
                traits: commonTraits,
              },
              traits: {
                action: 'identify',
              },
              anonymousId,
              userId,
              sentAt,
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
              '[Bluecore] property:: email is required for identify action: Workflow: procWorkflow, Step: prepareIdentifyPayload, ChildStep: undefined, OriginalError: [Bluecore] property:: email is required for identify action',
            metadata: {
              destinationId: '',
              destinationType: '',
              namespace: '',
              sourceType: '',
            },
            statTags: {
              destType: 'BLUECORE',
              destinationId: '',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-identify-test-3',
    name: 'bluecore',
    description:
      '[Success]: Identify call with all properties,along with action as random which is not supported by bluecore for identify action',
    scenario: 'Business',
    successCriteria:
      'Response should containt one payload with event name as identify and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            metadata,
            message: generateSimplifiedIdentifyPayload({
              context: {
                traits: commonTraits,
              },
              traits: {
                action: 'random',
              },
              anonymousId,
              userId,
              sentAt,
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
              "[Bluecore]  traits.action must be 'identify' for identify action: Workflow: procWorkflow, Step: prepareIdentifyPayload, ChildStep: undefined, OriginalError: [Bluecore]  traits.action must be 'identify' for identify action",
            metadata: {
              destinationId: '',
              destinationType: '',
              namespace: '',
              sourceType: '',
            },
            statTags: {
              destType: 'BLUECORE',
              destinationId: '',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-identify-test-4',
    name: 'bluecore',
    description:
      '[Success]: Identify call with all properties, that stitches a customer email with distinct_id in bluecore if action is identify and email is present in traits',
    scenario: 'Business',
    successCriteria:
      'Response should containt one payload with event name as identify and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            metadata,
            message: generateSimplifiedIdentifyPayload({
              context: {
                traits: { ...commonTraits, email: 'abc@gmail.com' },
              },
              traits: {
                action: 'identify',
              },
              anonymousId,
              userId,
              sentAt,
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
              method: 'POST',
              endpoint: commonEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                properties: {
                  distinct_id: 'user@1',
                  customer: { ...commonOutputCustomerProperties, email: 'abc@gmail.com' },
                  token: 'dummy_sandbox',
                },

                event: 'identify',
              },
            }),
            metadata: {
              destinationId: '',
              destinationType: '',
              namespace: '',
              sourceType: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    id: 'bluecore-identify-test-5',
    name: 'bluecore',
    description:
      '[Success]: Identify call with all properties and externalId, that creates a customer in bluecore by default, distinct_id is set to externalId value',
    scenario: 'Business',
    successCriteria:
      'Response should containt one payload with event name as customer_patch and status code should be 200',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination,
            metadata,
            message: generateSimplifiedIdentifyPayload({
              context: contextWithExternalId,
              anonymousId,
              userId,
              sentAt,
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
              method: 'POST',
              endpoint: commonEndpoint,
              headers: commonOutputHeaders,
              JSON: {
                properties: {
                  distinct_id: '54321',
                  customer: { ...commonOutputCustomerProperties, email: 'abc@gmail.com' },
                  token: 'dummy_sandbox',
                },
                event: 'customer_patch',
              },
            }),
            metadata: {
              sourceType: '',
              destinationType: '',
              namespace: '',
              destinationId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
