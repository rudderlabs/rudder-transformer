/**
 * Router-level validation / instrumentation error cases.
 *
 * These behaviours were previously covered only by the (now-removed) processor
 * test suite, which drove the deprecated `process` entry point. Since HubSpot is
 * router-only, they are reproduced here against `processRouterDest`.
 *
 * The "get properties" GET that the router flow issues before per-event validation
 * is mocked in ../network.ts for the 'hs-access-token' token these cases use, so they
 * need no per-case mockFns — the intended config/instrumentation error surfaces
 * instead of a network error.
 */

const newApiConfig = (over: Record<string, unknown> = {}) => ({
  authorizationType: 'newPrivateAppApi',
  apiVersion: 'newApi',
  accessToken: 'hs-access-token',
  lookupField: 'email',
  hubspotEvents: [],
  eventFilteringOption: 'disable',
  blacklistedEvents: [{ eventName: '' }],
  whitelistedEvents: [{ eventName: '' }],
  ...over,
});

const buildCase = ({
  id,
  description,
  message,
  config,
  error,
  errorType,
}: {
  id: string;
  description: string;
  message: Record<string, unknown>;
  config: Record<string, unknown>;
  error: string;
  errorType: 'configuration' | 'instrumentation';
}) => {
  const destination = { ID: 'hs-gap', Config: config, Enabled: true };
  return {
    name: 'hs',
    id,
    description,
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [{ message, destination, metadata: { jobId: 1, userId: 'u1' } }],
          destType: 'hs',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [{ jobId: 1, userId: 'u1' }],
              batched: false,
              statusCode: 400,
              error,
              statTags: {
                destType: 'HS',
                errorCategory: 'dataValidation',
                errorType,
                feature: 'router',
                implementation: 'native',
                module: 'destination',
              },
              destination,
            },
          ],
        },
      },
    },
  };
};

export const errorValidationData = [
  buildCase({
    id: 'hs_router_missing_access_token',
    description: '(newPrivateAppApi) missing accessToken in config is aborted',
    message: { type: 'track', event: 'Purchase', properties: {} },
    config: newApiConfig({ accessToken: '' }),
    error: 'Access Token not found. Aborting',
    errorType: 'configuration',
  }),
  buildCase({
    id: 'hs_router_identify_missing_lookup_field',
    description: '(newApi) identify without the default email lookup field is aborted',
    message: { type: 'identify', traits: {}, context: { mappedToDestination: false } },
    config: newApiConfig(),
    error: 'Identify:: email i.e a default lookup field for contact lookup not found in traits',
    errorType: 'instrumentation',
  }),
  buildCase({
    id: 'hs_router_track_event_name_not_string',
    description: '(newApi) track with a non-string event name is aborted',
    message: { type: 'track', event: 12345, properties: {} },
    config: newApiConfig(),
    error: 'Event is a required field and should be a string',
    errorType: 'instrumentation',
  }),
  buildCase({
    id: 'hs_router_message_type_not_supported',
    description: '(newApi) unsupported message type (page) is aborted',
    message: { type: 'page', name: 'Home' },
    config: newApiConfig(),
    error: 'Message type page is not supported',
    errorType: 'instrumentation',
  }),
  buildCase({
    id: 'hs_router_message_type_not_present',
    description: '(newApi) event with no message type is aborted',
    message: { properties: {} },
    config: newApiConfig(),
    error: 'Message type is not present. Aborting message.',
    errorType: 'instrumentation',
  }),
  buildCase({
    id: 'hs_router_track_event_name_required',
    description: '(newApi) track without an event name is aborted',
    message: { type: 'track', properties: { rev: 1 } },
    config: newApiConfig(),
    error: 'event name is required for track call',
    errorType: 'instrumentation',
  }),
  buildCase({
    id: 'hs_router_track_behavioral_missing_id',
    description: '(newApi) custom behavioral event without email/utk/objectId is aborted',
    message: { type: 'track', event: 'Order Completed', properties: { revenue: 9 } },
    config: newApiConfig({
      hubspotEvents: [
        {
          rsEventName: 'Order Completed',
          hubspotEventName: 'pe_order_completed',
          eventProperties: [],
        },
      ],
    }),
    error: 'Either of email, utk or objectId is required for custom behavioral events',
    errorType: 'instrumentation',
  }),
  buildCase({
    id: 'hs_router_retl_missing_external_id',
    description: '(newApi) RETL mappedToDestination event without an externalId is aborted',
    message: {
      type: 'identify',
      context: { mappedToDestination: true },
      traits: { email: 'a@b.com' },
    },
    config: newApiConfig(),
    error: 'rETL - external Id not found.',
    errorType: 'instrumentation',
  }),
  buildCase({
    id: 'hs_router_retl_invalid_email',
    description: '(newApi) RETL identify with an invalid email trait is aborted',
    message: {
      type: 'identify',
      traits: { to: { id: 1 }, from: { id: 9405415215 }, email: 'not-an-email' },
      context: {
        mappedToDestination: true,
        externalId: [
          {
            id: 1,
            type: 'HS-association',
            toObjectType: 'contacts',
            fromObjectType: 'companies',
            identifierType: 'id',
            associationTypeId: 'engineer',
          },
        ],
      },
    },
    config: newApiConfig(),
    error: 'Email "not-an-email" is invalid',
    errorType: 'instrumentation',
  }),
];
