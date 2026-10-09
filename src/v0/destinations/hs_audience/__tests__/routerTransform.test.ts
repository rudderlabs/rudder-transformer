jest.mock('../../../../adapters/network');

import { httpPOST } from '../../../../adapters/network';
import { processDestinationIntegration } from '../../../../services/destination/destinationIntegration/processDestinationIntegration';
import type { Connection, Destination } from '../../../../types/controlPlaneConfig';
import type { z } from 'zod';
import type { RouterTransformationRequestData } from '../../../../types/destinationTransformation';
import type { Metadata } from '../../../../types/rudderEvents';
import { Integration } from '../routerTransform';
import { HubSpotAudienceRouterRequestSchema } from '../types';

type RouterInput = z.infer<typeof HubSpotAudienceRouterRequestSchema>;

const mockHttpPost = httpPOST as unknown as jest.Mock;
const LARGE_ID = '9007199254740993';

type RecordAction = 'insert' | 'update' | 'delete';

const buildDestination = (accessToken: string | undefined = 'pat-test'): Destination =>
  ({
    ID: 'dest-1',
    Name: 'HS_AUDIENCE',
    DestinationDefinition: {
      ID: 'destDef-1',
      Name: 'HS_AUDIENCE',
      DisplayName: 'HubSpot Audience',
      Config: {},
    },
    Config: { accessToken },
    Enabled: true,
    WorkspaceID: 'ws-1',
    Transformations: [],
  }) as Destination;

const buildConnection = (audienceId: string): Connection =>
  ({
    sourceId: 'src-1',
    destinationId: 'dest-1',
    enabled: true,
    config: { destination: { audienceId, identifierMappings: [] } },
  }) as Connection;

const buildMetadata = (jobId: number): Metadata =>
  ({
    jobId,
    workspaceId: 'ws-1',
    destinationId: 'dest-1',
    sourceId: 'src-1',
    sourceType: 'warehouse',
    sourceCategory: 'warehouse',
    destinationType: 'HS_AUDIENCE',
    messageId: `msg-${jobId}`,
  }) as Metadata;

const buildInput = (
  jobId: number,
  action: RecordAction | string,
  identifiers: Record<string, unknown>,
  destination: Destination,
  connection?: Connection,
): RouterTransformationRequestData =>
  ({
    message: { type: 'record', action, identifiers, channel: 'sources', context: {} },
    metadata: buildMetadata(jobId),
    destination,
    ...(connection ? { connection } : {}),
  }) as unknown as RouterTransformationRequestData;

// Schema input vs control-plane request types disagree on `message.type` / `metadata`.
const asRouterInputs = (inputs: RouterTransformationRequestData[]): RouterInput[] =>
  inputs as unknown as RouterInput[];

function httpSuccess(data: unknown, status = 200) {
  return { success: true, response: { data, status, headers: {} } };
}

function httpFailure(status: number, data: unknown = { message: 'raw-body-sentinel' }) {
  return { success: false, response: { response: { status, data } } };
}

function foundByEmail(idFor: (email: string) => string) {
  return async (_url: string, body: { inputs: { id: string }[] }) =>
    httpSuccess({
      status: 'COMPLETE',
      results: body.inputs.map((input) => ({
        id: idFor(input.id),
        properties: { email: input.id },
      })),
      errors: [],
    });
}

const jsonBody = (response: { batchedRequest?: { body?: { JSON?: unknown } } }) =>
  response.batchedRequest?.body?.JSON as {
    recordIdsToAdd: string[];
    recordIdsToRemove: string[];
  };

describe('HubSpot audience routing', () => {
  const destination = buildDestination();
  const listA = buildConnection('list-a');
  const listB = buildConnection('list-b');

  beforeEach(() => {
    mockHttpPost.mockReset();
  });

  it('does not require a connection on the integration instance', () => {
    expect(() => new Integration(destination)).not.toThrow();
    expect(() => new Integration(destination, listA)).not.toThrow();
  });

  it('uses each row list and separates add from remove', async () => {
    const integration = new Integration(destination, listA);
    const rowOnOtherList = buildInput(2, 'delete', { hs_object_id: '20' }, destination, listB);
    const result = await integration.transformEvents(
      asRouterInputs([
        buildInput(1, 'insert', { hs_object_id: '10' }, destination, listA),
        rowOnOtherList,
        buildInput(3, 'update', { hs_object_id: '30' }, destination, listA),
      ]),
    );

    expect(mockHttpPost).not.toHaveBeenCalled();
    expect(result.errorPayloads).toEqual([]);
    expect(result.successPayloads.map((payload) => payload.endpoint)).toEqual([
      'https://api.hubapi.com/crm/v3/lists/list-a/memberships/add-and-remove',
      'https://api.hubapi.com/crm/v3/lists/list-b/memberships/add-and-remove',
      'https://api.hubapi.com/crm/v3/lists/list-a/memberships/add-and-remove',
    ]);
    expect(result.successPayloads.map((payload) => payload.internalGroupKey)).toEqual([
      'add',
      'remove',
      'add',
    ]);
    expect(result.successPayloads.every((payload) => payload.headers?.Authorization)).toBe(false);
    expect(result.successPayloads[0].headers).toEqual({ 'Content-Type': 'application/json' });
    expect(result.successPayloads[0].endpointPath).toBe(
      '/crm/v3/lists/:listId/memberships/add-and-remove',
    );

    const batched = await processDestinationIntegration(
      [
        buildInput(1, 'insert', { hs_object_id: '10' }, destination, listA),
        buildInput(2, 'delete', { hs_object_id: '20' }, destination, listA),
      ],
      Integration,
      {},
    );
    expect(batched).toHaveLength(2);
    expect(jsonBody(batched[0] as never)).toEqual({
      recordIdsToAdd: ['10'],
      recordIdsToRemove: [],
    });
    expect(jsonBody(batched[1] as never)).toEqual({
      recordIdsToAdd: [],
      recordIdsToRemove: ['20'],
    });
    expect((batched[0] as { batchedRequest: { headers: object } }).batchedRequest.headers).toEqual({
      'Content-Type': 'application/json',
    });
  });

  it('fails only the row whose connection is missing', async () => {
    const results = await processDestinationIntegration(
      [
        buildInput(1, 'insert', { hs_object_id: '10' }, destination, listA),
        buildInput(2, 'insert', { hs_object_id: '20' }, destination),
        buildInput(3, 'insert', { hs_object_id: '30' }, destination, listB),
      ],
      Integration,
      {},
    );

    const successes = results.filter((result) => result.statusCode === 200);
    const failure = results.find((result) => result.statusCode === 400);
    expect(successes).toHaveLength(2);
    expect(
      successes.map(
        (result) => (result as { batchedRequest: { endpoint: string } }).batchedRequest.endpoint,
      ),
    ).toEqual([
      'https://api.hubapi.com/crm/v3/lists/list-a/memberships/add-and-remove',
      'https://api.hubapi.com/crm/v3/lists/list-b/memberships/add-and-remove',
    ]);
    expect(failure?.error).toBe('HubSpot list ID is required');
    expect(failure?.metadata).toEqual([expect.objectContaining({ jobId: 2 })]);
  });

  it('rejects an unsafe list id and an unsupported action without echoing the value', async () => {
    const integration = new Integration(destination, listA);
    const result = await integration.transformEvents(
      asRouterInputs([
        buildInput(1, 'insert', { hs_object_id: '10' }, destination, buildConnection('../secret')),
        buildInput(2, 'upsert', { hs_object_id: '10' }, destination, listA),
        buildInput(3, 'insert', { hs_object_id: '10' }, buildDestination('   '), listA),
      ]),
    );

    expect(result.successPayloads).toEqual([]);
    expect(result.errorPayloads.map((payload) => payload.error)).toEqual([
      'HubSpot list ID is invalid',
      'Unsupported record action',
      'HubSpot access token is required',
    ]);
    expect(result.errorPayloads.every((payload) => payload.statusCode === 400)).toBe(true);
    expect(JSON.stringify(result.errorPayloads)).not.toContain('upsert');
    expect(JSON.stringify(result.errorPayloads)).not.toContain('../secret');
    expect(mockHttpPost).not.toHaveBeenCalled();
  });

  it('does not fall back to email when the record id is invalid', async () => {
    mockHttpPost.mockImplementation(foundByEmail(() => '5'));
    const integration = new Integration(destination, listA);
    const result = await integration.transformEvents(
      asRouterInputs([
        buildInput(
          1,
          'insert',
          { hs_object_id: 'abc', email: 'alice@example.com' },
          destination,
          listA,
        ),
        buildInput(2, 'insert', { hs_object_id: LARGE_ID, email: 'nope' }, destination, listA),
      ]),
    );

    expect(mockHttpPost).not.toHaveBeenCalled();
    expect(result.errorPayloads[0].error).toBe('Invalid HubSpot Record ID');
    expect(result.successPayloads[0].body).toEqual({ operation: 'add', recordId: LARGE_ID });
  });
});

describe('HubSpot audience conflicts and lookup state', () => {
  const destination = buildDestination();
  const otherDestination = buildDestination('pat-other');
  const listA = buildConnection('list-a');
  const listB = buildConnection('list-b');

  beforeEach(() => {
    mockHttpPost.mockReset();
    mockHttpPost.mockImplementation(
      foundByEmail((email) => (email === 'shared@example.com' ? '55' : '99')),
    );
  });

  it('fails every row when a direct id and an email resolve to opposite operations', async () => {
    const integration = new Integration(destination, listA);
    const result = await integration.transformEvents(
      asRouterInputs([
        buildInput(1, 'insert', { hs_object_id: '55' }, destination, listA),
        buildInput(2, 'delete', { email: 'shared@example.com' }, destination, listA),
        buildInput(3, 'insert', { email: 'shared@example.com' }, destination, listA),
      ]),
    );

    expect(mockHttpPost).toHaveBeenCalledTimes(1);
    expect(result.successPayloads).toEqual([]);
    expect(result.errorPayloads.map((payload) => payload.error)).toEqual([
      'Conflicting membership operations for HubSpot contact',
      'Conflicting membership operations for HubSpot contact',
      'Conflicting membership operations for HubSpot contact',
    ]);
  });

  it('keeps opposite operations on different lists and preserves same-operation duplicates', async () => {
    const results = await processDestinationIntegration(
      [
        buildInput(2, 'insert', { hs_object_id: '55' }, destination, listA),
        buildInput(4, 'delete', { email: 'shared@example.com' }, destination, listB),
        buildInput(9, 'insert', { hs_object_id: '55' }, destination, listA),
      ],
      Integration,
      {},
    );

    expect(results.filter((result) => result.statusCode === 400)).toEqual([]);
    const addBatch = results.find((result) =>
      (result as { batchedRequest?: { endpoint?: string } }).batchedRequest?.endpoint?.includes(
        'list-a',
      ),
    );
    const removeBatch = results.find((result) =>
      (result as { batchedRequest?: { endpoint?: string } }).batchedRequest?.endpoint?.includes(
        'list-b',
      ),
    );
    expect(jsonBody(addBatch as never)).toEqual({
      recordIdsToAdd: ['55', '55'],
      recordIdsToRemove: [],
    });
    expect(
      (addBatch as { metadata: { jobId: number }[] }).metadata.map((item) => item.jobId),
    ).toEqual([2, 9]);
    expect(jsonBody(removeBatch as never)).toEqual({
      recordIdsToAdd: [],
      recordIdsToRemove: ['55'],
    });
  });

  it('reports a lookup miss differently for add and remove', async () => {
    mockHttpPost.mockResolvedValue(
      httpSuccess({
        status: 'COMPLETE',
        results: [],
        errors: [
          {
            category: 'OBJECT_NOT_FOUND',
            context: { ids: ['add@example.com', 'remove@example.com'] },
          },
        ],
      }),
    );
    const integration = new Integration(destination, listA);
    const result = await integration.transformEvents(
      asRouterInputs([
        buildInput(1, 'insert', { email: 'add@example.com' }, destination, listA),
        buildInput(2, 'delete', { email: 'remove@example.com' }, destination, listA),
      ]),
    );

    expect(result.errorPayloads.map((payload) => payload.error)).toEqual([
      'Contact not found in HubSpot',
      'Removal could not be confirmed: HubSpot identifier not found',
    ]);
    expect(result.errorPayloads.every((payload) => payload.statusCode === 400)).toBe(true);
  });

  it('does not let a failed middle chunk or a rejected token fail other rows', async () => {
    let call = 0;
    mockHttpPost.mockImplementation(async (_url: string, body: { inputs: { id: string }[] }) => {
      call += 1;
      if (call === 2) {
        return httpFailure(503, { message: 'raw-body-sentinel' });
      }
      return foundByEmail((email) => {
        const index = Number(email.match(/\d+/)?.[0] ?? 0);
        return String(5000 + index);
      })(_url, body);
    });

    const emailRows = Array.from({ length: 201 }, (_unused, index) =>
      buildInput(index + 2, 'insert', { email: `user${index}@example.com` }, destination, listA),
    );
    const integration = new Integration(destination, listA);
    const result = await integration.transformEvents(
      asRouterInputs([
        buildInput(1, 'insert', { hs_object_id: '42' }, destination, listA),
        ...emailRows,
      ]),
    );

    expect(mockHttpPost).toHaveBeenCalledTimes(3);
    const recordIds = result.successPayloads.map((payload) => payload.body.recordId);
    expect(recordIds[0]).toBe('42');
    expect(recordIds).toContain('5000');
    expect(recordIds).toContain('5200');
    expect(recordIds).not.toContain('5100');
    expect(result.errorPayloads).toHaveLength(100);
    expect(result.errorPayloads[0].error).toBe('HubSpot contact lookup is temporarily unavailable');
    expect(result.errorPayloads[0].statusCode).toBe(503);
    expect(result.errorPayloads[0].error).not.toContain('raw-body-sentinel');
    expect(result.successPayloads).toHaveLength(102);
  });

  it('does not share lookup state across invocations or credentials', async () => {
    let generation = 0;
    mockHttpPost.mockImplementation(
      async (_url: string, body: { inputs: { id: string }[] }, options) => {
        generation += 1;
        const token = options.headers.Authorization as string;
        const id = token.endsWith('pat-other') ? '2' : String(generation);
        return httpSuccess({
          status: 'COMPLETE',
          results: body.inputs.map((input) => ({ id, properties: { email: input.id } })),
          errors: [],
        });
      },
    );

    const integration = new Integration(destination, listA);
    const first = await integration.transformEvents(
      asRouterInputs([buildInput(1, 'insert', { email: 'a@example.com' }, destination, listA)]),
    );
    const second = await integration.transformEvents(
      asRouterInputs([buildInput(2, 'insert', { email: 'a@example.com' }, destination, listA)]),
    );
    const split = await integration.transformEvents(
      asRouterInputs([
        buildInput(3, 'insert', { email: 'a@example.com' }, destination, listA),
        buildInput(4, 'insert', { email: 'a@example.com' }, otherDestination, listA),
      ]),
    );

    expect(mockHttpPost).toHaveBeenCalledTimes(4);
    expect(first.successPayloads[0].body.recordId).toBe('1');
    expect(second.successPayloads[0].body.recordId).toBe('2');
    expect(split.successPayloads.map((payload) => payload.body.recordId).sort()).toEqual([
      '2',
      '3',
    ]);
    const authorizations = mockHttpPost.mock.calls.map((call) => call[2].headers.Authorization);
    expect(authorizations).toContain('Bearer pat-test');
    expect(authorizations).toContain('Bearer pat-other');
  });
});

describe('HubSpot audience batching', () => {
  const destination = buildDestination();
  const connection = buildConnection('list-a');

  beforeEach(() => {
    mockHttpPost.mockReset();
  });

  it('keeps duplicate ids in job order and emits one entry per job', async () => {
    const results = await processDestinationIntegration(
      [
        buildInput(2, 'insert', { hs_object_id: '5' }, destination, connection),
        buildInput(4, 'insert', { hs_object_id: '5' }, destination, connection),
        buildInput(9, 'insert', { hs_object_id: '7' }, destination, connection),
      ],
      Integration,
      {},
    );

    expect(results).toHaveLength(1);
    expect(jsonBody(results[0] as never)).toEqual({
      recordIdsToAdd: ['5', '5', '7'],
      recordIdsToRemove: [],
    });
    expect(
      (results[0] as { metadata: { jobId: number }[] }).metadata.map((item) => item.jobId),
    ).toEqual([2, 4, 9]);
    expect(mockHttpPost).not.toHaveBeenCalled();
  });

  it('splits 1001 ids into 1000 and 1 without dropping or deduping', async () => {
    const inputs = Array.from({ length: 1001 }, (_unused, index) =>
      buildInput(index + 1, 'insert', { hs_object_id: String(index + 1) }, destination, connection),
    );
    const results = await processDestinationIntegration(inputs, Integration, {});
    const batches = results.filter((result) => result.statusCode === 200);

    expect(batches).toHaveLength(2);
    const first = jsonBody(batches[0] as never).recordIdsToAdd;
    const second = jsonBody(batches[1] as never).recordIdsToAdd;
    expect(first).toHaveLength(1000);
    expect(second).toEqual(['1001']);
    expect(first[0]).toBe('1');
    expect(first[999]).toBe('1000');
    expect(
      (batches[0] as { metadata: { jobId: number }[] }).metadata.map((item) => item.jobId),
    ).toEqual(first.map((id) => Number(id)));
    expect(
      (batches[1] as { metadata: { jobId: number }[] }).metadata.map((item) => item.jobId),
    ).toEqual([1001]);
  });
});
