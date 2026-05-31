/**
 * Router test data for Survicate destination
 * Tests all event types (identify, group, track) in router format
 */

type RouterTestData = {
  name: string;
  description?: string;
  feature?: string;
  module?: string;
  version?: string;
  input?: any;
  output?: any;
};

// Shared destination stubs reused across test cases
const dest = (key: string) => ({
  ID: 'survicate-dest-id',
  Name: 'Survicate',
  DestinationDefinition: { Config: {} },
  Config: { destinationKey: key },
  Enabled: true,
  Transformations: [],
});

const meta = (jobId: number = 1) => ({ destinationId: 'destId', workspaceId: 'wspId', jobId });

const identifyEndpoint =
  'https://hv.survicate.com/integrations/partners/rudder-stack/identify';
const groupEndpoint = 'https://hv.survicate.com/integrations/partners/rudder-stack/group';
const trackEndpoint = 'https://hv.survicate.com/integrations/partners/rudder-stack/track';

const headers = (key: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${key}`,
});

const okRequest = (
  endpoint: string,
  key: string,
  json: Record<string, unknown>,
  m = meta(),
) => ({
  batchedRequest: {
    body: { FORM: {}, JSON: json, JSON_ARRAY: {}, XML: {} },
    endpoint,
    files: {},
    headers: headers(key),
    method: 'POST',
    params: {},
    type: 'REST',
    version: '1',
  },
  batched: false,
  metadata: [m],
  statusCode: 200,
  destination: dest(key),
});

const errItem = (
  key: string,
  error: string,
  errorType: string = 'instrumentation',
  m = meta(),
) => ({
  batched: false,
  destination: dest(key),
  error,
  metadata: [m],
  statTags: {
    destType: 'SURVICATE',
    destinationId: 'destId',
    errorCategory: 'dataValidation',
    errorType,
    feature: 'router',
    implementation: 'native',
    module: 'destination',
    workspaceId: 'wspId',
  },
  statusCode: 400,
});

export const data: RouterTestData[] = [
  // ─── Batch / multi-event tests ────────────────────────────────────────────

  {
    name: 'survicate',
    description: 'Router Test: Multiple identify events in batch',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                messageId: 'msg-1',
                userId: 'user-1',
                originalTimestamp: '2020-04-22T08:06:20.337Z',
                context: {
                  traits: { name: 'User 1', email: 'user1@example.com' },
                  locale: 'en-US',
                },
              },
              metadata: meta(1),
              destination: dest('test-key-123'),
            },
            {
              message: {
                type: 'identify',
                messageId: 'msg-2',
                userId: 'user-2',
                originalTimestamp: '2020-04-22T08:06:20.337Z',
                context: {
                  traits: { name: 'User 2', email: 'user2@example.com', company: { id: 'comp-2' } },
                  locale: 'en-GB',
                },
              },
              metadata: meta(2),
              destination: dest('test-key-123'),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            okRequest(identifyEndpoint, 'test-key-123', {
              user_id: 'user-1',
              name: 'User 1',
              email: 'user1@example.com',
              context: { locale: 'en-US' },
              timestamp: '2020-04-22T08:06:20.337Z',
              message_id: 'msg-1',
            }, meta(1)),
            okRequest(identifyEndpoint, 'test-key-123', {
              user_id: 'user-2',
              name: 'User 2',
              email: 'user2@example.com',
              company: { id: 'comp-2' },
              context: { locale: 'en-GB' },
              timestamp: '2020-04-22T08:06:20.337Z',
              message_id: 'msg-2',
            }, meta(2)),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Router Test: Mixed event types in batch',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                messageId: 'msg-identify',
                userId: 'user-123',
                originalTimestamp: '2020-04-22T08:06:20.337Z',
                context: { traits: { name: 'John Doe' } },
              },
              metadata: meta(1),
              destination: dest('test-key'),
            },
            {
              message: {
                type: 'track',
                messageId: 'msg-track',
                userId: 'user-123',
                event: 'Purchase',
                originalTimestamp: '2020-04-22T08:06:21.337Z',
                properties: { amount: 100 },
              },
              metadata: meta(2),
              destination: dest('test-key'),
            },
            {
              message: {
                type: 'group',
                messageId: 'msg-group',
                userId: 'user-123',
                groupId: 'group-456',
                originalTimestamp: '2020-04-22T08:06:22.337Z',
                traits: { name: 'Company ABC' },
              },
              metadata: meta(3),
              destination: dest('test-key'),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            okRequest(identifyEndpoint, 'test-key', {
              user_id: 'user-123',
              name: 'John Doe',
              timestamp: '2020-04-22T08:06:20.337Z',
              message_id: 'msg-identify',
            }, meta(1)),
            okRequest(trackEndpoint, 'test-key', {
              user_id: 'user-123',
              event: 'Purchase',
              properties: { amount: 100 },
              timestamp: '2020-04-22T08:06:21.337Z',
              message_id: 'msg-track',
            }, meta(2)),
            okRequest(groupEndpoint, 'test-key', {
              user_id: 'user-123',
              group_id: 'group-456',
              name: 'Company ABC',
              timestamp: '2020-04-22T08:06:22.337Z',
              message_id: 'msg-group',
            }, meta(3)),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Incoming snake_case keys are normalized',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                message_id: 'snake-1',
                user_id: 'user-snake',
                originalTimestamp: '2021-05-05T05:05:05.000Z',
                context: { traits: { foo: 'bar' } },
              },
              metadata: meta(),
              destination: dest('test-key'),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            okRequest(identifyEndpoint, 'test-key', {
              user_id: 'user-snake',
              foo: 'bar',
              timestamp: '2021-05-05T05:05:05.000Z',
              message_id: 'snake-1',
            }),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Reserved keys in context.traits should not overwrite canonical fields',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                messageId: 'msg-reserved',
                userId: 'user-reserved',
                originalTimestamp: '2021-01-01T00:00:00.000Z',
                context: {
                  traits: {
                    user_id: 'bad', userId: 'bad2',
                    group_id: 'bad', groupId: 'bad2',
                    timestamp: 'bad', originalTimestamp: 'bad2',
                    message_id: 'bad', messageId: 'bad2',
                    extra: 'value1',
                  },
                },
              },
              metadata: meta(1),
              destination: dest('test-key'),
            },
            {
              message: {
                type: 'group',
                messageId: 'msg-res-g',
                userId: 'user-reserved',
                groupId: 'group-reserved',
                originalTimestamp: '2021-01-01T01:00:00.000Z',
                traits: { foo: 'bar' },
                context: {
                  traits: {
                    user_id: 'override', userId: 'override2',
                    group_id: 'override', groupId: 'override2',
                    timestamp: 'override', originalTimestamp: 'override2',
                    message_id: 'override', messageId: 'override2',
                    other: 'value2',
                  },
                },
              },
              metadata: meta(2),
              destination: dest('test-key'),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            okRequest(identifyEndpoint, 'test-key', {
              user_id: 'user-reserved',
              extra: 'value1',
              timestamp: '2021-01-01T00:00:00.000Z',
              message_id: 'msg-reserved',
            }, meta(1)),
            okRequest(groupEndpoint, 'test-key', {
              user_id: 'user-reserved',
              group_id: 'group-reserved',
              foo: 'bar',
              other: 'value2',
              timestamp: '2021-01-01T01:00:00.000Z',
              message_id: 'msg-res-g',
            }, meta(2)),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Track events include filtered context properties and traits',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                messageId: 'msg-track2',
                userId: 'user-track',
                event: 'Clicked',
                originalTimestamp: '2022-02-02T02:02:02.000Z',
                properties: { foo: 'bar' },
                context: {
                  traits: { alice: 'wonderland', user_id: 'should-not', timestamp: 'nope' },
                  locale: 'fr-FR',
                  campaign: { id: 'cmp-123' },
                  userAgent: 'UA-1',
                },
              },
              metadata: meta(),
              destination: dest('test-key'),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            okRequest(trackEndpoint, 'test-key', {
              user_id: 'user-track',
              event: 'Clicked',
              properties: { foo: 'bar', alice: 'wonderland' },
              timestamp: '2022-02-02T02:02:02.000Z',
              message_id: 'msg-track2',
              context: { locale: 'fr-FR', campaign: { id: 'cmp-123' }, userAgent: 'UA-1' },
            }),
          ],
        },
      },
    },
  },
  // audit field validation
  {
    name: 'survicate',
    description: 'Missing messageId results in validation error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                userId: 'user-noid',
                originalTimestamp: '2023-01-01T00:00:00.000Z',
                context: { traits: { name: 'Alice' } },
              },
              metadata: meta(),
              destination: dest('test-key'),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: { output: [errItem('test-key', 'messageId is required.')] },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Missing userId results in validation error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                messageId: 'no-id',
                originalTimestamp: '2023-01-01T00:00:00.000Z',
              },
              metadata: meta(),
              destination: dest('test-key'),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            errItem('test-key', 'Anonymous identify calls are not supported. userId is required.'),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Missing originalTimestamp results in validation error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                messageId: 'msg-no-ts',
                userId: 'user-nots',
                event: 'Test',
              },
              metadata: meta(),
              destination: dest('test-key'),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: { output: [errItem('test-key', 'originalTimestamp is required.')] },
      },
    },
  },

  // ─── Identify ─────────────────────────────────────────────────────────────

  {
    name: 'survicate',
    description: 'Complete identify event with nested traits',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                messageId: '508d5e8c-96e4-4301-bd46-1890dba5c866',
                originalTimestamp: '2020-04-22T08:06:20.337Z',
                sentAt: '2020-04-22T08:06:20.337Z',
                userId: 'my-user-id',
                anonymous_id: '21b43de4-3b9b-423f-b51f-794eae31fc03',
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.1.1-rc.2',
                  },
                  traits: {
                    name: 'User name',
                    email: 'user@domain.com',
                    plan: 'Enterprise',
                    company: { id: 'company-A' },
                    createdAt: 'Thu Mar 24 2016 17:46:45 GMT+0000 (UTC)',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.1-rc.2',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                  locale: 'en-US',
                  os: { name: '', version: '' },
                  screen: { density: 1.600000023841858 },
                  page: {
                    path: '/tests/html/script-test.html',
                    referrer: 'http://localhost:1111/tests/html/',
                    search: '',
                    title: '',
                    url: 'http://localhost:1111/tests/html/script-test.html',
                  },
                },
                integrations: { All: true },
              },
              destination: dest('test-destination-key-12345'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            okRequest(identifyEndpoint, 'test-destination-key-12345', {
              user_id: 'my-user-id',
              name: 'User name',
              email: 'user@domain.com',
              plan: 'Enterprise',
              company: { id: 'company-A' },
              createdAt: 'Thu Mar 24 2016 17:46:45 GMT+0000 (UTC)',
              context: {
                locale: 'en-US',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
              timestamp: '2020-04-22T08:06:20.337Z',
              message_id: '508d5e8c-96e4-4301-bd46-1890dba5c866',
            }),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Identify using snake_case keys',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                message_id: 'snake-2',
                user_id: 'user-snake2',
                originalTimestamp: '2022-02-02T02:02:02.000Z',
                context: { traits: { x: 'y' } },
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            okRequest(identifyEndpoint, 'test-key', {
              user_id: 'user-snake2',
              x: 'y',
              timestamp: '2022-02-02T02:02:02.000Z',
              message_id: 'snake-2',
            }),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Identify event with deeply nested attributes',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                messageId: 'msg-456',
                originalTimestamp: '2020-04-22T08:06:20.337Z',
                userId: 'user-456',
                context: {
                  traits: {
                    name: 'John Doe',
                    subscription: { plan: { tier: 'pro', renewal: { date: '2025-12-01' } } },
                  },
                  locale: 'en-GB',
                },
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            okRequest(identifyEndpoint, 'test-key', {
              user_id: 'user-456',
              name: 'John Doe',
              subscription: { plan: { tier: 'pro', renewal: { date: '2025-12-01' } } },
              context: { locale: 'en-GB' },
              timestamp: '2020-04-22T08:06:20.337Z',
              message_id: 'msg-456',
            }),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Identify event missing messageId - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                originalTimestamp: '2021-01-01T00:00:00.000Z',
                userId: 'user-1',
                context: { traits: { foo: 'bar' } },
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: { output: [errItem('test-key', 'messageId is required.')] },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Identify event missing originalTimestamp - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                messageId: 'msg-missing-ts',
                userId: 'user-2',
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: { output: [errItem('test-key', 'originalTimestamp is required.')] },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Anonymous identify event - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                anonymous_id: '21b43de4-3b9b-423f-b51f-794eae31fc03',
                message_id: 'msg-anonymous',
                originalTimestamp: '2024-01-01T00:00:00.000Z',
                context: { traits: { email: 'user@example.com' } },
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            errItem(
              'test-key',
              'Anonymous identify calls are not supported. userId is required.',
            ),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Identify event missing userId - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                messageId: 'no-id',
                originalTimestamp: '2024-01-01T00:00:00.000Z',
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            errItem(
              'test-key',
              'Anonymous identify calls are not supported. userId is required.',
            ),
          ],
        },
      },
    },
  },

  // ─── Group ────────────────────────────────────────────────────────────────

  {
    name: 'survicate',
    description: 'Complete group event with nested traits',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'group',
                messageId: '0b0e-test-cafe',
                originalTimestamp: '2025-11-07T10:15:00.000Z',
                sentAt: '2025-11-07T10:15:02.000Z',
                userId: 'my-user-id',
                groupId: 'company-A',
                anonymous_id: '21b4-test-fc03',
                traits: {
                  name: 'Acme Inc.',
                  industry: 'SaaS',
                  employees: 1200,
                  plan: 'Enterprise',
                  nested: { settings: { notifications: true } },
                },
                context: {
                  locale: 'en-US',
                  campaign: { name: 'autumn', source: 'referral' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36',
                },
              },
              destination: dest('test-destination-key-12345'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            okRequest(groupEndpoint, 'test-destination-key-12345', {
              user_id: 'my-user-id',
              group_id: 'company-A',
              name: 'Acme Inc.',
              industry: 'SaaS',
              employees: 1200,
              plan: 'Enterprise',
              nested: { settings: { notifications: true } },
              context: {
                locale: 'en-US',
                campaign: { name: 'autumn', source: 'referral' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36',
              },
              timestamp: '2025-11-07T10:15:00.000Z',
              message_id: '0b0e-test-cafe',
            }),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Group event with snake_case keys',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'group',
                message_id: 'snake-group',
                user_id: 'user-snake-group',
                group_id: 'company-S',
                originalTimestamp: '2023-01-01T00:00:00.000Z',
                traits: { name: 'Snake Corp' },
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            okRequest(groupEndpoint, 'test-key', {
              user_id: 'user-snake-group',
              group_id: 'company-S',
              name: 'Snake Corp',
              timestamp: '2023-01-01T00:00:00.000Z',
              message_id: 'snake-group',
            }),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Group event without groupId - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'group',
                messageId: 'msg-missing-group_id',
                originalTimestamp: '2023-01-01T00:00:00.000Z',
                userId: 'user-123',
                traits: { name: 'Company Name' },
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: { output: [errItem('test-key', 'groupId is required for group events.')] },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Anonymous group event - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'group',
                anonymous_id: 'anon-123',
                groupId: 'company-B',
                messageId: 'msg-anon-group',
                originalTimestamp: '2024-01-01T00:00:00.000Z',
                traits: { name: 'Company B' },
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            errItem(
              'test-key',
              'Anonymous group calls are not supported. userId is required.',
            ),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Group event missing messageId - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'group',
                userId: 'user-1',
                groupId: 'company-X',
                originalTimestamp: '2023-01-01T00:00:00.000Z',
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: { output: [errItem('test-key', 'messageId is required.')] },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Group event missing originalTimestamp - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'group',
                messageId: 'msg-missing-ts',
                userId: 'user-2',
                groupId: 'company-Y',
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: { output: [errItem('test-key', 'originalTimestamp is required.')] },
      },
    },
  },

  // ─── Track ────────────────────────────────────────────────────────────────

  {
    name: 'survicate',
    description: 'Complete track event with nested properties',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                messageId: '04a303b1-a466-4e66-9022-2a24edaca4fc',
                originalTimestamp: '2020-04-22T08:06:20.338Z',
                sentAt: '2020-04-22T08:06:20.338Z',
                userId: 'my-user-id',
                anonymous_id: '21b43de4-3b9b-423f-b51f-794eae31fc03',
                channel: 'web',
                event: 'Product Purchased',
                properties: {
                  order_ID: '1',
                  category: 'boots',
                  product_name: 'new_boots',
                  price: 60,
                  currency: 'USD',
                  product: {
                    sku: 'SKU-123',
                    vendor: { name: 'Vendor Inc.', region: 'North America' },
                  },
                },
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.1.1-rc.2',
                  },
                  traits: {
                    name: 'User name',
                    email: 'user@domain.com',
                    plan: 'Enterprise',
                    company: { id: 'company-A' },
                    createdAt: 'Thu Mar 24 2016 17:46:45 GMT+0000 (UTC)',
                  },
                  library: { name: 'RudderLabs JavaScript SDK', version: '1.1.1-rc.2' },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
                  locale: 'en-US',
                  os: { name: '', version: '' },
                  screen: { density: 1.600000023841858 },
                  page: {
                    path: '/tests/html/script-test.html',
                    referrer: 'http://localhost:1111/tests/html/',
                    search: '',
                    title: '',
                    url: 'http://localhost:1111/tests/html/script-test.html',
                  },
                },
                integrations: { All: true },
              },
              destination: dest('test-destination-key-12345'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            okRequest(trackEndpoint, 'test-destination-key-12345', {
              user_id: 'my-user-id',
              event: 'Product Purchased',
              properties: {
                order_ID: '1',
                category: 'boots',
                product_name: 'new_boots',
                price: 60,
                currency: 'USD',
                product: {
                  sku: 'SKU-123',
                  vendor: { name: 'Vendor Inc.', region: 'North America' },
                },
                name: 'User name',
                email: 'user@domain.com',
                plan: 'Enterprise',
                company: { id: 'company-A' },
                createdAt: 'Thu Mar 24 2016 17:46:45 GMT+0000 (UTC)',
              },
              timestamp: '2020-04-22T08:06:20.338Z',
              message_id: '04a303b1-a466-4e66-9022-2a24edaca4fc',
              context: {
                locale: 'en-US',
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
              },
            }),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Track event with snake_case keys',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                message_id: 'snake-track',
                user_id: 'user-snake-track',
                originalTimestamp: '2022-02-02T02:02:02.000Z',
                event: 'Clicked',
                properties: { foo: 'bar' },
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            okRequest(trackEndpoint, 'test-key', {
              user_id: 'user-snake-track',
              event: 'Clicked',
              properties: { foo: 'bar' },
              timestamp: '2022-02-02T02:02:02.000Z',
              message_id: 'snake-track',
            }),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Track event with simple properties',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                messageId: 'msg-simple',
                originalTimestamp: '2020-04-22T08:06:20.338Z',
                userId: 'user-123',
                event: 'Page View',
                properties: { page: '/checkout', referrer: '/home' },
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            okRequest(trackEndpoint, 'test-key', {
              user_id: 'user-123',
              event: 'Page View',
              properties: { page: '/checkout', referrer: '/home' },
              timestamp: '2020-04-22T08:06:20.338Z',
              message_id: 'msg-simple',
            }),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Track event without event name - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                messageId: 'msg-no-event',
                originalTimestamp: '2023-01-01T00:00:00.000Z',
                userId: 'user-123',
                properties: { amount: 100 },
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: { output: [errItem('test-key', 'event name is required for track events.')] },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Anonymous track event - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                anonymous_id: 'anon-456',
                messageId: 'msg-anon-track',
                originalTimestamp: '2024-01-01T00:00:00.000Z',
                event: 'Purchase',
                properties: { amount: 150 },
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            errItem(
              'test-key',
              'Anonymous track calls are not supported. userId is required.',
            ),
          ],
        },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Track event missing messageId - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                originalTimestamp: '2023-01-01T00:00:00.000Z',
                userId: 'user-1',
                event: 'Test',
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: { output: [errItem('test-key', 'messageId is required.')] },
      },
    },
  },
  {
    name: 'survicate',
    description: 'Track event missing originalTimestamp - should fail',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                messageId: 'msg-missing-ts',
                userId: 'user-2',
                event: 'Test',
              },
              destination: dest('test-key'),
              metadata: meta(),
            },
          ],
          destType: 'survicate',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: { output: [errItem('test-key', 'originalTimestamp is required.')] },
      },
    },
  },
];
