import { RouterTestData } from '../../../testTypes';
import { destination, endpoint, metadata } from '../common';

const batchedRequest = {
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint,
  endpointPath: '/v1/events',
  headers: { Authorization: 'Bearer test-api-key', 'Content-Type': 'application/json' },
  params: { pid: 'pixel-123' },
  body: {
    JSON: {
      events: [
        {
          id: 'msg-1',
          type: 'contents_viewed',
          timestamp_ms: 1704067200000,
          action_source: 'offline',
          data: { type: 'contents' },
        },
        {
          id: 'msg-2',
          type: 'lead_created',
          timestamp_ms: 1704067201000,
          action_source: 'offline',
          data: { type: 'customer_action' },
        },
      ],
    },
    JSON_ARRAY: {},
    XML: {},
    FORM: {},
  },
  files: {},
};

export const data: RouterTestData[] = [
  {
    id: 'openai-ads-router-batching',
    name: 'openai_ads',
    description:
      'Batching Framework: mapped track events are batched into one OpenAI /v1/events request',
    scenario: 'Native batching cloud CAPI',
    successCriteria: 'Two compatible mapped events collapse into one request-level pid/auth group',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'Product Viewed',
                messageId: 'msg-1',
                timestamp: '2024-01-01T00:00:00.000Z',
                properties: {},
              },
              metadata: metadata(1),
              destination,
            },
            {
              message: {
                type: 'track',
                event: 'Lead Created',
                messageId: 'msg-2',
                timestamp: '2024-01-01T00:00:01.000Z',
                properties: {},
              },
              metadata: metadata(2),
              destination,
            },
          ],
          destType: 'openai_ads',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest,
              metadata: [metadata(1), metadata(2)],
              batched: true,
              statusCode: 200,
              destination,
            },
          ],
        },
      },
    },
  },
  {
    id: 'openai-ads-router-unmapped',
    name: 'openai_ads',
    description: 'Unmapped non-standard events fail before delivery',
    scenario: 'Event mapping validation',
    successCriteria: 'The event returns a per-event instrumentation error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'Unknown Event',
                messageId: 'msg-3',
                timestamp: '2024-01-01T00:00:00.000Z',
                properties: {},
              },
              metadata: metadata(3),
              destination,
            },
          ],
          destType: 'openai_ads',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [metadata(3)],
              batched: false,
              statusCode: 400,
              error: 'OpenAI Ads event mapping not found for Unknown Event',
              destination,
              statTags: {
                destType: 'OPENAI_ADS',
                destinationId: 'openai-ads-dest-1',
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                feature: 'router',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'ws-1',
              },
            },
          ],
        },
      },
    },
  },
];
