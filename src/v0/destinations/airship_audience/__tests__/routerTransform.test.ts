import { Integration } from '../routerTransform';
import { processDestinationIntegration } from '../../../../services/destination/destinationIntegration/processDestinationIntegration';
import { secretPaths } from '../../../../secretPaths';
import type { Metadata } from '../../../../types/rudderEvents';
import type {
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../../../types/destinationTransformation';

type RecordAction = 'insert' | 'update' | 'delete';

const API_KEY = 'airship-audience-unit-api-key';
const US_ENDPOINT = 'https://go.urbanairship.com/api/named_users/tags';
const EU_ENDPOINT = 'https://go.airship.eu/api/named_users/tags';

const buildDestination = (config: Record<string, unknown> = {}) => ({
  ID: 'dest-1',
  Name: 'airship_audience',
  DestinationDefinition: {
    ID: 'destDef-1',
    Name: 'AIRSHIP_AUDIENCE',
    DisplayName: 'Airship Audience',
    Config: {},
  },
  Config: {
    rudderAccountId: 'acc-1',
    apiKey: API_KEY,
    dataCenter: 'US',
    tagGroup: 'rudderstack_audiences',
    ...config,
  },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
});

const buildConnection = (tagName = 'rs_air_e2e', sourceId = 'src-1') => ({
  sourceId,
  destinationId: 'dest-1',
  enabled: true,
  config: {
    destination: {
      tagName,
      syncMode: 'mirror',
      schemaVersion: '1.1',
      identifierMappings: [{ from: 'user_id', to: 'named_user_id' }],
    },
  },
});

const buildMetadata = (jobId: number): Metadata =>
  ({
    jobId,
    workspaceId: 'ws-1',
    destinationId: 'dest-1',
    sourceId: 'src-1',
    sourceType: 'warehouse',
    sourceCategory: 'warehouse',
    destinationType: 'AIRSHIP_AUDIENCE',
    messageId: `msg-${jobId}`,
  }) as Metadata;

const buildInput = (
  jobId: number,
  action: RecordAction,
  namedUserId: unknown,
  destination = buildDestination(),
  connection = buildConnection(),
): RouterTransformationRequestData =>
  ({
    message: {
      type: 'record',
      action,
      identifiers: namedUserId === undefined ? {} : { named_user_id: namedUserId },
      fields: {},
      channel: 'sources',
      context: {},
      recordId: String(jobId),
    },
    metadata: buildMetadata(jobId),
    destination,
    connection,
  }) as unknown as RouterTransformationRequestData;

const run = (inputs: RouterTransformationRequestData[]) =>
  processDestinationIntegration(inputs, Integration, {});

const successes = (results: RouterTransformationResponse[]) =>
  results.filter((r) => r.statusCode === 200);
const failures = (results: RouterTransformationResponse[]) =>
  results.filter((r) => r.statusCode !== 200);
type TagsBody = { audience: { named_user_id: string[] } } & Record<string, unknown>;
const bodyOf = (r: RouterTransformationResponse) =>
  (r.batchedRequest as unknown as { body: { JSON: TagsBody } }).body.JSON;

describe('AirshipAudienceIntegration via processDestinationIntegration', () => {
  const normalisedIds: [string, unknown, string][] = [
    ['0 → "0" (not empty)', 0, '0'],
    ['12345 → "12345"', 12345, '12345'],
    ['" rs-air-e2e-1 " is trimmed', ' rs-air-e2e-1 ', 'rs-air-e2e-1'],
    ['"Rs-Air-1" keeps its case', 'Rs-Air-1', 'Rs-Air-1'],
    ['128 characters is accepted', 'n'.repeat(128), 'n'.repeat(128)],
    ['128 characters after trim is accepted', ` ${'n'.repeat(128)} `, 'n'.repeat(128)],
  ];

  const rejectedIds: [string, unknown, string][] = [
    ['""', '', 'No named user ID mapped'],
    ['whitespace only', '   ', 'No named user ID mapped'],
    ['missing', undefined, 'No named user ID mapped'],
    ['null', null, 'No named user ID mapped'],
    ['an object', {}, 'Invalid named user ID'],
    ['a boolean', true, 'Invalid named user ID'],
    ['NaN', Number.NaN, 'Invalid named user ID'],
    ['Infinity', Number.POSITIVE_INFINITY, 'Invalid named user ID'],
    // Airship refuses the whole request: 400 40003 "Named user id … is greater than 128 characters".
    ['129 characters', 'n'.repeat(129), 'Invalid named user ID'],
  ];

  it('three inserts → one request adding the tag to all three IDs', async () => {
    const results = await run([
      buildInput(1, 'insert', 'u-1'),
      buildInput(2, 'insert', 'u-2'),
      buildInput(3, 'update', 'u-3'),
    ]);

    expect(results).toHaveLength(1);
    expect(results[0].statusCode).toBe(200);
    expect(results[0].metadata).toHaveLength(3);
    expect(results[0].batchedRequest).toEqual({
      version: '1',
      type: 'REST',
      method: 'POST',
      endpoint: US_ENDPOINT,
      endpointPath: '/api/named_users/tags',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/vnd.urbanairship+json; version=3',
        'Content-Type': 'application/json',
      },
      params: {},
      body: {
        JSON: {
          audience: { named_user_id: ['u-1', 'u-2', 'u-3'] },
          add: { rudderstack_audiences: ['rs_air_e2e'] },
        },
        JSON_ARRAY: {},
        XML: {},
        FORM: {},
      },
      files: {},
    });
  });

  it('2,500 inserts → requests of 1,000, 1,000 and 500 named users', async () => {
    const inputs = Array.from({ length: 2500 }, (_, i) => buildInput(i + 1, 'insert', `u-${i}`));
    const results = await run(inputs);

    expect(results.map((r) => bodyOf(r).audience.named_user_id.length)).toEqual([1000, 1000, 500]);
    expect(results.map((r) => r.metadata.length)).toEqual([1000, 1000, 500]);
  });

  it('insert + delete → two requests, never an add and a remove block in one body', async () => {
    const results = await run([buildInput(1, 'insert', 'u-1'), buildInput(2, 'delete', 'u-2')]);

    expect(successes(results).map(bodyOf)).toEqual([
      { audience: { named_user_id: ['u-1'] }, add: { rudderstack_audiences: ['rs_air_e2e'] } },
      { audience: { named_user_id: ['u-2'] }, remove: { rudderstack_audiences: ['rs_air_e2e'] } },
    ]);
  });

  it('two connections with tags a and b in one call → one request per tag', async () => {
    const destination = buildDestination();
    const results = await run([
      buildInput(1, 'insert', 'u-1', destination, buildConnection('a', 'src-a')),
      buildInput(2, 'insert', 'u-2', destination, buildConnection('b', 'src-b')),
    ]);

    expect(successes(results).map(bodyOf)).toEqual([
      { audience: { named_user_id: ['u-1'] }, add: { rudderstack_audiences: ['a'] } },
      { audience: { named_user_id: ['u-2'] }, add: { rudderstack_audiences: ['b'] } },
    ]);
  });

  it.each(normalisedIds)('named user ID %s', async (_name, raw, expected) => {
    const [result] = await run([buildInput(1, 'insert', raw)]);
    expect(bodyOf(result).audience).toEqual({ named_user_id: [expected] });
  });

  it.each(rejectedIds)('named user ID %s fails the row alone', async (_name, raw, error) => {
    const results = await run([buildInput(1, 'insert', raw), buildInput(2, 'insert', 'good')]);

    expect(successes(results).map(bodyOf)).toEqual([
      { audience: { named_user_id: ['good'] }, add: { rudderstack_audiences: ['rs_air_e2e'] } },
    ]);
    expect(failures(results).map(({ statusCode, error: e }) => ({ statusCode, error: e }))).toEqual(
      [{ statusCode: 400, error }],
    );
  });

  it('a blank apiKey fails the input schema', async () => {
    const [result] = await run([
      buildInput(1, 'insert', 'u-1', buildDestination({ apiKey: '   ' })),
    ]);
    expect(result.statusCode).toBe(400);
    expect(result.error).toBe('destination.Config.apiKey: Airship API key is missing');
  });

  it('a tag of 129 characters fails the input schema (Airship answers 400 40006, P4)', async () => {
    const [result] = await run([
      buildInput(1, 'insert', 'u-1', buildDestination(), buildConnection('t'.repeat(129))),
    ]);
    expect(result.statusCode).toBe(400);
    expect(result.error).toBe(
      'connection.config.destination.tagName: String must contain at most 128 character(s)',
    );
  });

  it('dataCenter EU → https://go.airship.eu', async () => {
    const [result] = await run([
      buildInput(1, 'insert', 'u-1', buildDestination({ dataCenter: 'EU' })),
    ]);
    expect(result.batchedRequest).toMatchObject({ endpoint: EU_ENDPOINT });
  });

  it('trims the apiKey and tagGroup before use', async () => {
    const [result] = await run([
      buildInput(
        1,
        'delete',
        'u-1',
        buildDestination({ apiKey: `  ${API_KEY}  `, tagGroup: ' rudderstack_audiences ' }),
      ),
    ]);
    expect(result.batchedRequest).toMatchObject({
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    expect(bodyOf(result)).toEqual({
      audience: { named_user_id: ['u-1'] },
      remove: { rudderstack_audiences: ['rs_air_e2e'] },
    });
  });

  it('lists the Authorization header for masking in Live Events', () => {
    expect(secretPaths.AIRSHIP_AUDIENCE).toEqual(['headers.Authorization']);
  });
});
