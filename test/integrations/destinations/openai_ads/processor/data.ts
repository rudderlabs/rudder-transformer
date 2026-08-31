import type { ProcessorTestData } from '../../../testTypes';
import { destination, endpoint, metadata } from '../common';

export const data: ProcessorTestData[] = [
  {
    id: 'openai-ads-processor-track',
    name: 'openai_ads',
    description: 'Mapped track events are transformed into OpenAI /v1/events requests',
    scenario: 'Cloud CAPI processor transform',
    successCriteria: 'The processor entrypoint returns a singleton REST request for a mapped event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: [
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
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
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
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: metadata(1),
            statusCode: 200,
          },
        ],
      },
    },
  },
];
