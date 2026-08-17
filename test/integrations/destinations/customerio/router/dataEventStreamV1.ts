import { authHeader1, secret1, secret2 } from '../maskedSecrets';

// Covers the hybrid state: the batching framework is enabled (unlocking record events),
// but CUSTOMERIO_EVENT_STREAM_V2_API_ENABLED is left at its default (disabled) — so
// event-stream events keep shipping via the V1 request shape while record events still
// go through the V2 batching path. Compare with dataV2.ts, which sets
// CUSTOMERIO_EVENT_STREAM_V2_API_ENABLED: 'true' and asserts the V2 shape for the same
// kind of event-stream events.
export const dataEventStreamV1 = [
  {
    name: 'customerio',
    description:
      'hybrid: batching framework on, event-stream V2 API off — identify event ships in the V1 shape',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    envOverrides: {
      CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: 'ALL',
    },
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                channel: 'web',
                type: 'identify',
                userId: 'user-1',
                traits: { plan: 'pro', email: 'test@rudderstack.com' },
                originalTimestamp: '2020-01-09T10:01:53.558Z',
              },
              metadata: { jobId: 300, userId: 'u1', workspaceId: 'ws-cio-hybrid' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
            },
          ],
          destType: 'customerio',
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'PUT',
                endpoint: 'https://track.customer.io/api/v1/customers/user-1',
                endpointPath: 'v1/customers',
                headers: { Authorization: authHeader1 },
                params: {},
                body: {
                  JSON: {
                    plan: 'pro',
                    email: 'test@rudderstack.com',
                    _timestamp: 1578564113,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 300, userId: 'u1', workspaceId: 'ws-cio-hybrid' }],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    name: 'customerio',
    description:
      'hybrid: batching framework on, event-stream V2 API off — record event still batches on /v2/batch while the event-stream event ships separately in the V1 shape',
    scenario: 'framework',
    successCriteria:
      'the record event batches onto the V2 endpoint exactly as it does when the flag is enabled, while the event-stream event ships unbatched against its V1 endpoint instead of joining the V2 batch',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    envOverrides: {
      CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: 'ALL',
    },
    input: {
      request: {
        body: {
          input: [
            {
              // record event — always goes through the V2 batching path, flag or no flag
              message: {
                type: 'record',
                action: 'insert',
                identifiers: { id: 'user-123' },
              },
              metadata: { jobId: 200, userId: 'u1', workspaceId: 'ws-cio-hybrid' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              connection: {
                sourceId: 'src-1',
                destinationId: 'dest-1',
                enabled: true,
                config: { destination: { object: 'person', syncMode: 'mirror' } },
              },
            },
            {
              // event-stream event — V1 shape while the flag is off, even though the
              // batching framework is on for this workspace
              message: {
                channel: 'web',
                type: 'track',
                event: 'Order Completed',
                userId: 'user-789',
                properties: { total: 42 },
                originalTimestamp: '2020-01-09T10:01:53.558Z',
              },
              metadata: { jobId: 201, userId: 'u1', workspaceId: 'ws-cio-hybrid' },
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
            },
          ],
          destType: 'customerio',
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://track.customer.io/api/v2/batch',
                endpointPath: 'v2/batch',
                headers: { Authorization: authHeader1, 'Content-Type': 'application/json' },
                params: {},
                body: {
                  JSON: {
                    batch: [
                      {
                        type: 'person',
                        action: 'identify',
                        identifiers: { id: 'user-123' },
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 200, userId: 'u1', workspaceId: 'ws-cio-hybrid' }],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://track.customer.io/api/v1/customers/user-789/events',
                endpointPath: 'v1/customers/events',
                headers: { Authorization: authHeader1 },
                params: {},
                body: {
                  JSON: {
                    data: { total: 42 },
                    name: 'Order Completed',
                    type: 'event',
                    timestamp: 1578564113,
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 201, userId: 'u1', workspaceId: 'ws-cio-hybrid' }],
              destination: { Config: { datacenter: 'US', siteID: secret1, apiKey: secret2 } },
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
