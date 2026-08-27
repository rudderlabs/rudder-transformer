import { createHash } from 'crypto';
import { Integration } from '../routerTransform';
import { processBatchedDestination } from '../../../../services/destination/nativeBatching/processBatchedDestination';
import type { Metadata } from '../../../../types/rudderEvents';
import type { RouterTransformationRequestData } from '../../../../types/destinationTransformation';
import type { Connection, Destination } from '../../../../types/controlPlaneConfig';
import type { RedditAudienceConnectionConfig, RedditAudienceDestinationConfig } from '../types';

type RedditDestination = Destination<RedditAudienceDestinationConfig>;
type RedditConnection = Connection<{ destination: RedditAudienceConnectionConfig }>;
type RecordAction = 'insert' | 'update' | 'delete';

const AUDIENCE_ID = 'ca.129482487242828';
const ENDPOINT = `https://ads-api.reddit.com/api/v3/custom_audiences/${AUDIENCE_ID}/users`;
const ACCESS_TOKEN = 'test-access-token';

const sha256 = (v: string) => createHash('sha256').update(v).digest('hex');

const buildDestination = (
  configOverrides: Partial<RedditAudienceDestinationConfig> = {},
): RedditDestination =>
  ({
    ID: 'dest-1',
    Name: 'reddit_audience',
    DestinationDefinition: {
      ID: 'destDef-1',
      Name: 'REDDIT_AUDIENCE',
      DisplayName: 'Reddit Audience',
      Config: {},
    },
    Config: {
      rudderAccountId: 'acc-1',
      adAccountId: 'a2_abcdefg',
      ...configOverrides,
    },
    Enabled: true,
    WorkspaceID: 'ws-1',
    Transformations: [],
  }) as RedditDestination;

const buildConnection = (
  overrides: Partial<RedditAudienceConnectionConfig> = {},
): RedditConnection =>
  ({
    sourceId: 'src-1',
    destinationId: 'dest-1',
    enabled: true,
    config: {
      destination: {
        audienceId: AUDIENCE_ID,
        isHashRequired: true,
        syncMode: 'mirror',
        identifierMappings: [{ from: 'email', to: 'EMAIL_SHA256' }],
        ...overrides,
      },
    },
  }) as RedditConnection;

const buildMetadata = (jobId: number): Metadata =>
  ({
    jobId,
    workspaceId: 'ws-1',
    destinationId: 'dest-1',
    sourceId: 'src-1',
    sourceType: 'warehouse',
    sourceCategory: 'warehouse',
    destinationType: 'REDDIT_AUDIENCE',
    messageId: `msg-${jobId}`,
    secret: { accessToken: ACCESS_TOKEN },
  }) as unknown as Metadata;

const buildInput = (
  jobId: number,
  action: RecordAction,
  identifiers: Record<string, unknown>,
  destination: RedditDestination = buildDestination(),
  connection: RedditConnection = buildConnection(),
): RouterTransformationRequestData =>
  ({
    message: {
      type: 'record',
      action,
      identifiers,
      channel: 'sources',
      context: {},
      recordId: String(jobId),
    },
    metadata: buildMetadata(jobId),
    destination,
    connection,
  }) as unknown as RouterTransformationRequestData;

const successes = (results: any[]) => results.filter((r) => r.statusCode === 200);
const body = (r: any) => r.batchedRequest.body?.JSON;
const jobIds = (r: any) =>
  r.metadata.map((m: any) => m.jobId).sort((a: number, b: number) => a - b);

describe('reddit_audience router transform', () => {
  it('builds the documented positional-matrix payload', async () => {
    const results = await processBatchedDestination(
      [buildInput(1, 'insert', { EMAIL_SHA256: 'alice@example.com' })],
      Integration,
      {},
    );
    const ok = successes(results);
    expect(ok).toHaveLength(1);
    expect(ok[0].batchedRequest.endpoint).toBe(ENDPOINT);
    expect(ok[0].batchedRequest.method).toBe('PATCH');
    expect(body(ok[0])).toEqual({
      data: {
        action_type: 'ADD',
        column_order: ['EMAIL_SHA256'],
        user_data: [['ff8d9819fc0e12bf0d24892e45987e249a28dce836a85cad60e28eaaa8c6d976']],
      },
    });
  });

  it('sends the bearer token and a non-generic User-Agent', async () => {
    // Reddit maps a missing/generic user agent to 403 (Blocked) and 429.
    const results = await processBatchedDestination(
      [buildInput(1, 'insert', { EMAIL_SHA256: 'alice@example.com' })],
      Integration,
      {},
    );
    const headers = successes(results)[0].batchedRequest.headers;
    expect(headers.Authorization).toBe(`Bearer ${ACCESS_TOKEN}`);
    expect(headers['User-Agent']).toMatch(/rudderstack/i);
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('maps insert and update to ADD, and batches them together', async () => {
    const results = await processBatchedDestination(
      [
        buildInput(1, 'insert', { EMAIL_SHA256: 'a@example.com' }),
        buildInput(2, 'update', { EMAIL_SHA256: 'b@example.com' }),
      ],
      Integration,
      {},
    );
    const ok = successes(results);
    expect(ok).toHaveLength(1);
    expect(body(ok[0]).data.action_type).toBe('ADD');
    expect(body(ok[0]).data.user_data).toHaveLength(2);
  });

  it('SPLITS ADD and REMOVE even though they share one endpoint', async () => {
    // This is the reason internalGroupKey exists for this destination: unlike
    // iterable_audience (distinct URLs per action) the composite grouping key
    // would otherwise merge ADD and REMOVE into one request and silently send
    // removals under action_type ADD.
    const results = await processBatchedDestination(
      [
        buildInput(1, 'insert', { EMAIL_SHA256: 'a@example.com' }),
        buildInput(2, 'delete', { EMAIL_SHA256: 'b@example.com' }),
      ],
      Integration,
      {},
    );
    const ok = successes(results);
    expect(ok).toHaveLength(2);
    const actions = ok.map((r) => body(r).data.action_type).sort();
    expect(actions).toEqual(['ADD', 'REMOVE']);
    ok.forEach((r) => expect(r.batchedRequest.endpoint).toBe(ENDPOINT));
    // and each batch carries only its own job
    expect(ok.map((r) => jobIds(r)).sort()).toEqual([[1], [2]]);
  });

  it('SPLITS rows whose identifier sets differ, so column_order always aligns', async () => {
    // Reddit requires every user_data row to match column_order positionally.
    // An email-only row cannot ride in a request declaring two columns.
    const results = await processBatchedDestination(
      [
        buildInput(1, 'insert', { EMAIL_SHA256: 'a@example.com' }),
        buildInput(2, 'insert', { MAID_SHA256: 'EA7583CD-A667-48BC-B806-42ECB2B48606' }),
        buildInput(3, 'insert', {
          EMAIL_SHA256: 'c@example.com',
          MAID_SHA256: 'cdda802e-fb9c-47ad-9866-0794d394c912',
        }),
      ],
      Integration,
      {},
    );
    const ok = successes(results);
    expect(ok).toHaveLength(3);
    const byColumns = Object.fromEntries(
      ok.map((r) => [body(r).data.column_order.join(','), body(r).data]),
    );
    expect(Object.keys(byColumns).sort()).toEqual([
      'EMAIL_SHA256',
      'EMAIL_SHA256,MAID_SHA256',
      'MAID_SHA256',
    ]);
    // every row in every batch has exactly as many cells as declared columns
    ok.forEach((r) => {
      const d = body(r).data;
      d.user_data.forEach((row: string[]) => expect(row).toHaveLength(d.column_order.length));
    });
  });

  it('puts email before MAID in a two-column row', async () => {
    const results = await processBatchedDestination(
      [
        buildInput(1, 'insert', {
          // deliberately reversed key order in the source object
          MAID_SHA256: 'cdda802e-fb9c-47ad-9866-0794d394c912',
          EMAIL_SHA256: 'alice@example.com',
        }),
      ],
      Integration,
      {},
    );
    const d = body(successes(results)[0]).data;
    expect(d.column_order).toEqual(['EMAIL_SHA256', 'MAID_SHA256']);
    expect(d.user_data[0]).toEqual([
      'ff8d9819fc0e12bf0d24892e45987e249a28dce836a85cad60e28eaaa8c6d976',
      'f23b554b2a8fb732a8b973733832e70f018da7bc294dfea289735a07d5dd2c9f',
    ]);
  });

  it("chunks at Reddit's documented 2500-row limit", async () => {
    const inputs = Array.from({ length: 2501 }, (_, i) =>
      buildInput(i + 1, 'insert', { EMAIL_SHA256: `user${i}@example.com` }),
    );
    const results = await processBatchedDestination(inputs, Integration, {});
    const ok = successes(results);
    expect(ok).toHaveLength(2);
    const sizes = ok.map((r) => body(r).data.user_data.length).sort((a, b) => b - a);
    expect(sizes).toEqual([2500, 1]);
  });

  it('aborts only the identifier-less record and still delivers its siblings', async () => {
    const results = await processBatchedDestination(
      [
        buildInput(1, 'insert', { EMAIL_SHA256: 'a@example.com' }),
        buildInput(2, 'insert', {}),
        buildInput(3, 'insert', { EMAIL_SHA256: 'c@example.com' }),
      ],
      Integration,
      {},
    );
    const ok = successes(results);
    const failed = results.filter((r) => r.statusCode === 400);
    expect(failed).toHaveLength(1);
    expect(failed[0].metadata[0].jobId).toBe(2);
    expect(failed[0].error).toMatch(/No valid Reddit identifier/);
    expect(ok).toHaveLength(1);
    expect(body(ok[0]).data.user_data).toHaveLength(2);
  });

  it('drops identifiers Reddit does not accept without failing the record', async () => {
    const results = await processBatchedDestination(
      [buildInput(1, 'insert', { EMAIL_SHA256: 'a@example.com', phone: '+15554441234' })],
      Integration,
      {},
    );
    const d = body(successes(results)[0]).data;
    expect(d.column_order).toEqual(['EMAIL_SHA256']);
    expect(d.user_data[0]).toHaveLength(1);
  });

  it('aborts a record whose only identifier is unmappable', async () => {
    const results = await processBatchedDestination(
      [buildInput(1, 'insert', { phone: '+15554441234' })],
      Integration,
      {},
    );
    expect(results.filter((r) => r.statusCode === 400)).toHaveLength(1);
  });

  it('passes pre-hashed values through when isHashRequired is false', async () => {
    const pre = sha256('alice@example.com');
    const results = await processBatchedDestination(
      [
        buildInput(
          1,
          'insert',
          { EMAIL_SHA256: pre },
          buildDestination(),
          buildConnection({ isHashRequired: false }),
        ),
      ],
      Integration,
      {},
    );
    expect(body(successes(results)[0]).data.user_data).toEqual([[pre]]);
  });

  it('rejects the record when hashing is off but the value is not hashed', async () => {
    const results = await processBatchedDestination(
      [
        buildInput(
          1,
          'insert',
          { EMAIL_SHA256: 'alice@example.com' },
          buildDestination(),
          buildConnection({ isHashRequired: false }),
        ),
      ],
      Integration,
      {},
    );
    expect(results.filter((r) => r.statusCode === 400)).toHaveLength(1);
  });

  it('rejects a non-record message type via the input schema', async () => {
    const input = buildInput(1, 'insert', { EMAIL_SHA256: 'a@example.com' });
    (input.message as any).type = 'track';
    const results = await processBatchedDestination([input], Integration, {});
    expect(results.filter((r) => r.statusCode === 400)).toHaveLength(1);
  });

  it('fails as a configuration error when the access token is missing', async () => {
    const input = buildInput(1, 'insert', { EMAIL_SHA256: 'a@example.com' });
    delete (input.metadata as any).secret;
    const results = await processBatchedDestination([input], Integration, {});
    const failed = results.filter((r) => r.statusCode !== 200);
    expect(failed).toHaveLength(1);
  });

  it("builds the endpoint from the connection's audienceId", async () => {
    // `processBatchedDestination` is scoped to ONE destination + connection per
    // call (`events[0].destination`, first non-null `connection`), so a router
    // call never spans two audiences — rudder-server groups by connection
    // upstream. The audience therefore comes from connection config, exactly as
    // braze_audience reads customAttributeName and iterable_audience reads listId.
    const results = await processBatchedDestination(
      [
        buildInput(
          1,
          'insert',
          { EMAIL_SHA256: 'a@example.com' },
          buildDestination(),
          buildConnection({ audienceId: 'ca.999' }),
        ),
      ],
      Integration,
      {},
    );
    expect(successes(results)[0].batchedRequest.endpoint).toBe(
      'https://ads-api.reddit.com/api/v3/custom_audiences/ca.999/users',
    );
  });

  it('rejects the whole router call when connection config is absent', async () => {
    // The guard is in the constructor, which runs before any per-record error
    // handling, so this surfaces as a rejected call rather than per-job 400s.
    // Same behaviour as braze_audience / iterable_audience — a VDM v2
    // destination cannot function at all without connection config.
    const input = buildInput(1, 'insert', { EMAIL_SHA256: 'a@example.com' });
    delete (input as any).connection;
    await expect(processBatchedDestination([input], Integration, {})).rejects.toThrow(
      'Connection config is required for reddit_audience',
    );
  });
});

describe('misaligned-batch guard', () => {
  // Reddit answers 204 to a row whose length disagrees with column_order
  // (verified live), so nothing downstream would ever surface this. The guard
  // is the only thing standing between a regression here and a silent
  // zero-match sync, so assert it fires rather than trusting it exists.
  const strategyFor = () => {
    const integration = new (Integration as any)(buildDestination(), buildConnection());
    return integration.getBatchStrategy();
  };

  it('throws when a row has fewer values than column_order declares', () => {
    const strategy = strategyFor();
    expect(() =>
      strategy.wrapBody([
        { actionType: 'ADD', columnOrder: ['EMAIL_SHA256', 'MAID_SHA256'], row: ['only-one'] },
      ]),
    ).toThrow(/misaligned batch/);
  });

  it('throws when a row has more values than column_order declares', () => {
    const strategy = strategyFor();
    expect(() =>
      strategy.wrapBody([{ actionType: 'ADD', columnOrder: ['EMAIL_SHA256'], row: ['a', 'b'] }]),
    ).toThrow(/misaligned batch/);
  });

  it('names the declared columns so the failure is diagnosable', () => {
    const strategy = strategyFor();
    expect(() =>
      strategy.wrapBody([
        { actionType: 'ADD', columnOrder: ['EMAIL_SHA256', 'MAID_SHA256'], row: ['x'] },
      ]),
    ).toThrow(/EMAIL_SHA256, MAID_SHA256/);
  });

  it('accepts a correctly aligned batch', () => {
    const strategy = strategyFor();
    expect(
      strategy.wrapBody([
        { actionType: 'ADD', columnOrder: ['EMAIL_SHA256'], row: ['a'.repeat(64)] },
      ]),
    ).toEqual({
      data: {
        action_type: 'ADD',
        column_order: ['EMAIL_SHA256'],
        user_data: [['a'.repeat(64)]],
      },
    });
  });
});

describe('destination config shape', () => {
  // Regression: adAccountId is discovery-only and optional on the destination
  // (the sync wizard supplies it, the transform never reads it). Requiring it in
  // the zod schema rejected every record from a wizard-configured destination
  // with "destination.Config.adAccountId: Required". The component fixtures all
  // set it, so only an end-to-end /routerTransform call caught it.
  it('transforms a destination that carries NO adAccountId', async () => {
    const dest = buildDestination();
    delete (dest.Config as Record<string, unknown>).adAccountId;
    const results = await processBatchedDestination(
      [buildInput(1, 'insert', { EMAIL_SHA256: 'alice@example.com' }, dest)],
      Integration,
      {},
    );
    expect(results.filter((r) => r.statusCode !== 200)).toHaveLength(0);
    expect(body(successes(results)[0]).data.user_data).toEqual([
      ['ff8d9819fc0e12bf0d24892e45987e249a28dce836a85cad60e28eaaa8c6d976'],
    ]);
  });

  it('still accepts a destination that does carry adAccountId (agentic/MCP path)', async () => {
    const results = await processBatchedDestination(
      [buildInput(1, 'insert', { EMAIL_SHA256: 'alice@example.com' })],
      Integration,
      {},
    );
    expect(results.filter((r) => r.statusCode !== 200)).toHaveLength(0);
  });
});
