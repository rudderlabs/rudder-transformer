import type { Destination, RouterTransformationResponse } from '../../../../../src/types';
import type { RouterTestData } from '../../../testTypes';
import {
  destination,
  eventsEndpoint,
  eventsHeaders,
  metadata,
  noApiTokenDestination,
  pushwooshEvent,
  setTagsBody,
  setTagsEndpoint,
  setTagsHeaders,
  timestamp,
} from '../common';

const input = (
  jobId: number,
  message: Record<string, unknown>,
  inputDestination: Destination = destination,
) => ({ message, metadata: metadata(jobId), destination: inputDestination });

const batchedRequest = (
  endpoint: string,
  endpointPath: string,
  headers: Record<string, string>,
  JSON: Record<string, unknown>,
  jobIds: number[],
): RouterTransformationResponse => ({
  batchedRequest: {
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint,
    endpointPath,
    headers,
    params: {},
    body: { JSON, JSON_ARRAY: {}, XML: {}, FORM: {} },
    files: {},
  },
  metadata: jobIds.map(metadata),
  destination,
  batched: true,
  statusCode: 200,
});

const eventsRequest = (events: Record<string, unknown>[], jobIds: number[]) =>
  batchedRequest(eventsEndpoint, '/post-events', eventsHeaders, { events }, jobIds);

const setTagsRequest = (body: Record<string, unknown>, jobId: number) =>
  batchedRequest(setTagsEndpoint, '/setTags', setTagsHeaders, body, [jobId]);

const errorResponse = (
  jobId: number,
  error: string,
  errorType = 'instrumentation',
  errorDestination: Destination = destination,
): RouterTransformationResponse => ({
  metadata: [metadata(jobId)],
  batched: false,
  statusCode: 400,
  error,
  destination: errorDestination,
  statTags: {
    destType: 'PUSHWOOSH',
    destinationId: 'pushwoosh-dest-1',
    errorCategory: 'dataValidation',
    errorType,
    feature: 'router',
    implementation: 'native',
    module: 'destination',
    workspaceId: 'ws-1',
  },
});

export const data: RouterTestData[] = [
  {
    id: 'pushwoosh-router-track-batch-and-identify',
    name: 'pushwoosh',
    description: 'Track events share one post-events batch; identify ships alone to setTags',
    scenario: 'Mixed track and identify events in one router request',
    successCriteria:
      'Track events are batched with sanitized attributes; identify tags drop PII and identity keys',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          destType: 'pushwoosh',
          input: [
            input(1, {
              type: 'track',
              userId: 'user-1',
              event: 'Purchase',
              timestamp,
              context: {
                device: { id: 'device-1', type: 'Android' },
                os: { name: 'Android', version: '14' },
              },
              properties: {
                revenue: 9.99,
                currency: 'EUR',
                first: true,
                items: [{ sku: 'a' }, 'b', 3],
                meta: { src: 'push' },
                empty: null,
              },
            }),
            input(2, {
              type: 'track',
              userId: 'user-2',
              event: 'Purchase',
              originalTimestamp: '2026-10-10T13:00:00+03:00',
              context: { device: { id: 'idfv-1', type: 'iOS' }, os: { name: 'iOS' } },
            }),
            input(3, {
              type: 'identify',
              userId: 'user-3',
              traits: {
                plan: 'pro',
                age: 30,
                vip: false,
                interests: ['news', { topic: 'sport' }],
                settings: { lang: 'de' },
                address: { city: 'Berlin' },
                email: 'user-3@example.com',
                phone: '+10000000000',
                firstName: 'First',
                lastName: 'Last',
                name: 'First Last',
                id: 'user-3',
                userId: 'user-3',
                anonymousId: 'anon-3',
                nickname: null,
              },
            }),
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            eventsRequest(
              [
                pushwooshEvent('user-1', {
                  device_id: 'device-1',
                  device_platform: 'android',
                  attributes: {
                    revenue: 9.99,
                    currency: 'EUR',
                    first: true,
                    items: ['{"sku":"a"}', 'b', 3],
                    meta: '{"src":"push"}',
                  },
                }),
                pushwooshEvent('user-2', { device_id: 'idfv-1', device_platform: 'ios' }),
              ],
              [1, 2],
            ),
            setTagsRequest(
              setTagsBody('user-3', {
                plan: 'pro',
                age: 30,
                vip: false,
                interests: ['news', '{"topic":"sport"}'],
                settings: '{"lang":"de"}',
              }),
              3,
            ),
          ],
        },
      },
    },
  },
  {
    id: 'pushwoosh-router-web-defaults',
    name: 'pushwoosh',
    description: 'A track without a mobile platform or device id is a web event',
    scenario: 'Track from a desktop browser with a numeric userId',
    successCriteria:
      'device_platform is web, device_id is empty, userId is a string, attributes is an object',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          destType: 'pushwoosh',
          input: [
            input(1, {
              type: 'track',
              userId: 42,
              event: 'Signed Up',
              timestamp,
              context: { os: { name: 'Mac OS X' }, device: { type: 'desktop' } },
              properties: 'not-an-object',
            }),
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: { output: [eventsRequest([pushwooshEvent('42', { name: 'Signed Up' })], [1])] },
      },
    },
  },
  {
    id: 'pushwoosh-router-identify-context-traits',
    name: 'pushwoosh',
    description: 'Identify falls back to context.traits when traits are absent',
    scenario: 'Identify from an SDK that carries traits in context',
    successCriteria: 'Tags come from context.traits without the excluded keys',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          destType: 'pushwoosh',
          input: [
            input(1, {
              type: 'identify',
              userId: 'user-1',
              context: { traits: { plan: 'free', email: 'user-1@example.com' } },
            }),
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: { output: [setTagsRequest(setTagsBody('user-1', { plan: 'free' }), 1)] },
      },
    },
  },
  {
    id: 'pushwoosh-router-instrumentation-errors',
    name: 'pushwoosh',
    description: 'Events Pushwoosh cannot store fail individually without blocking the batch',
    scenario: 'Missing userId, missing event name, invalid timestamp, no tags, unsupported type',
    successCriteria: 'Each bad event gets its own 400 and the valid event is still delivered',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          destType: 'pushwoosh',
          input: [
            input(1, { type: 'track', event: 'Purchase', anonymousId: 'anon-1', timestamp }),
            input(2, { type: 'track', userId: 'user-2', timestamp }),
            input(3, {
              type: 'track',
              userId: 'user-3',
              event: 'Purchase',
              timestamp: 'yesterday',
            }),
            input(4, {
              type: 'identify',
              userId: 'user-4',
              traits: { email: 'user-4@example.com' },
            }),
            input(5, { type: 'identify', anonymousId: 'anon-5', traits: { plan: 'pro' } }),
            input(6, { type: 'page', userId: 'user-6', name: 'Home' }),
            input(7, { type: 'track', userId: 'user-7', event: 'Purchase', timestamp }),
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            eventsRequest([pushwooshEvent('user-7')], [7]),
            errorResponse(
              6,
              "message.type: Invalid enum value. Expected 'track' | 'identify', received 'page'",
            ),
            errorResponse(1, 'Missing required value from "userId"'),
            errorResponse(2, 'Missing required value from "event"'),
            errorResponse(3, 'Invalid timestamp: "yesterday"'),
            errorResponse(4, 'No traits left to send as Pushwoosh tags'),
            errorResponse(5, 'Missing required value from "userId"'),
          ],
        },
      },
    },
  },
  {
    id: 'pushwoosh-router-missing-api-token',
    name: 'pushwoosh',
    description: 'A destination without an API token is rejected before any request is built',
    scenario: 'Unconfigured destination credentials',
    successCriteria: 'The event fails schema validation with a 400',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          destType: 'pushwoosh',
          input: [
            input(
              1,
              { type: 'track', userId: 'user-1', event: 'Purchase', timestamp },
              noApiTokenDestination,
            ),
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            errorResponse(
              1,
              'destination.Config.apiToken: String must contain at least 1 character(s)',
              'configuration',
              noApiTokenDestination,
            ),
          ],
        },
      },
    },
  },
];
