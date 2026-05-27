import { EventTesterService } from '../eventTester';
import { NativeIntegrationDestinationService } from '../../destination/nativeIntegration';
import { userTransformHandler } from '../../../routerUtils';

jest.mock('../../../routerUtils', () => ({
  ...jest.requireActual('../../../routerUtils'),
  userTransformHandler: jest.fn(),
}));

const mockUserTransformHandler = userTransformHandler as jest.Mock;

const sampleOutput = {
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint: 'https://api.example.com/x',
  headers: {},
  params: {},
  body: { JSON: { a: 1 }, JSON_ARRAY: {}, XML: {}, FORM: {} },
  files: {},
};

const buildV1Event = (overrides: Record<string, unknown> = {}) => ({
  message: { type: 'record' },
  destination: { workspaceId: 'ws-1', destinationDefinition: {} },
  connection: {},
  stage: { user_transform: false, dest_transform: false, send_to_destination: false },
  libraries: [],
  ...overrides,
});

describe('EventTesterService.testEvent', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('throws when events is not an array', async () => {
    await expect(EventTesterService.testEvent(null, 'v0', 'custom_audience')).rejects.toThrow(
      'events array is required in payload',
    );
  });

  it('returns dest_transformed_payload when only dest_transform is enabled', async () => {
    jest
      .spyOn(
        EventTesterService as unknown as {
          runDestTransform: (
            version: string,
            dest: string,
            events: unknown[],
          ) => Promise<Array<{ payload: unknown } | { error: string }>>;
        },
        'runDestTransform',
      )
      .mockResolvedValue([{ payload: sampleOutput }]);

    const result = await EventTesterService.testEvent(
      [
        buildV1Event({
          stage: { user_transform: false, dest_transform: true, send_to_destination: false },
        }),
      ],
      'v0',
      'custom_audience',
    );

    expect(result).toEqual([{ dest_transformed_payload: [sampleOutput] }]);
  });

  it('aborts dest_transform when user_transform fails', async () => {
    jest
      .spyOn(
        EventTesterService as unknown as {
          runUserTransform: (events: unknown[], libraries: unknown[]) => Promise<unknown[]>;
        },
        'runUserTransform',
      )
      .mockResolvedValue([{ error: 'transform compilation error' }]);

    const result = await EventTesterService.testEvent(
      [
        buildV1Event({
          stage: { user_transform: true, dest_transform: true, send_to_destination: false },
          destination: {
            workspaceId: 'ws-1',
            destinationDefinition: {},
            transformations: [{ versionId: 'v1' }],
          },
        }),
      ],
      'v0',
      'custom_audience',
    );

    expect(result).toEqual([
      {
        user_transformed_payload: { error: 'transform compilation error' },
        dest_transformed_payload: {
          error: 'error encountered in user_transformation stage. Aborting.',
        },
      },
    ]);
  });

  it('runs full pipeline: user_transform → dest_transform → send_to_destination', async () => {
    jest
      .spyOn(
        EventTesterService as unknown as {
          runUserTransform: (events: unknown[], libraries: unknown[]) => Promise<unknown[]>;
        },
        'runUserTransform',
      )
      .mockResolvedValue([{ message: { type: 'record', transformed: true } }]);

    jest
      .spyOn(
        EventTesterService as unknown as {
          runDestTransform: (
            version: string,
            dest: string,
            events: unknown[],
          ) => Promise<Array<{ payload: unknown } | { error: string }>>;
        },
        'runDestTransform',
      )
      .mockResolvedValue([{ payload: sampleOutput }]);

    jest
      .spyOn(
        EventTesterService as unknown as {
          sendPayloadsToDestination: (
            destination: string,
            transformedPayloads: unknown[],
          ) => Promise<{ responses: unknown[]; statuses: number[] }>;
        },
        'sendPayloadsToDestination',
      )
      .mockResolvedValue({ responses: ['ok'], statuses: [200] });

    const result = await EventTesterService.testEvent(
      [
        buildV1Event({
          stage: { user_transform: true, dest_transform: true, send_to_destination: true },
          destination: {
            workspaceId: 'ws-1',
            destinationDefinition: {},
            transformations: [{ versionId: 'v1' }],
          },
        }),
      ],
      'v0',
      'custom_audience',
    );

    expect(result).toEqual([
      {
        user_transformed_payload: { type: 'record', transformed: true },
        dest_transformed_payload: [sampleOutput],
        destination_response: ['ok'],
        destination_response_status: [200],
      },
    ]);
  });

  it('aborts send_to_destination when dest_transform fails', async () => {
    jest
      .spyOn(
        EventTesterService as unknown as {
          runDestTransform: (
            version: string,
            dest: string,
            events: unknown[],
          ) => Promise<Array<{ payload: unknown } | { error: string }>>;
        },
        'runDestTransform',
      )
      .mockResolvedValue([{ error: 'batch transform failed' }]);

    const result = await EventTesterService.testEvent(
      [
        buildV1Event({
          stage: { user_transform: false, dest_transform: true, send_to_destination: true },
        }),
      ],
      'v0',
      'custom_audience',
    );

    expect(result).toEqual([
      {
        dest_transformed_payload: { error: 'batch transform failed' },
        destination_response: {
          error: 'error encountered in dest_transformation stage. Aborting.',
        },
      },
    ]);
  });
});

describe('EventTesterService.testEventV2', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('runs user transform per event and forwards only successful events into batch dest transform', async () => {
    const runUserTransformSpy = jest
      .spyOn(
        EventTesterService as unknown as {
          runUserTransform: (events: unknown[], libraries: unknown[]) => Promise<unknown[]>;
        },
        'runUserTransform',
      )
      .mockResolvedValue([
        { message: { type: 'record', id: 'ok-1' } },
        { error: 'user transform failed' },
        { message: { type: 'record', id: 'ok-2' } },
      ]);

    const runDestTransformSpy = jest
      .spyOn(
        EventTesterService as unknown as {
          runDestTransform: (
            version: string,
            dest: string,
            events: unknown[],
          ) => Promise<Array<{ payload: unknown } | { error: string }>>;
        },
        'runDestTransform',
      )
      .mockResolvedValue([{ payload: sampleOutput }]);

    const result = await EventTesterService.testEventV2(
      {
        events: [{ type: 'record' }, { type: 'record' }, { type: 'record' }],
        destination: {
          workspaceId: 'ws-1',
          destinationDefinition: {},
          transformations: [{ versionId: 'transform-1' }],
        },
        connection: {},
        stage: { user_transform: true, dest_transform: true, send_to_destination: false },
        libraries: [{ versionId: 'lib-1' }],
      },
      'v0',
      'custom_audience',
    );

    expect(runUserTransformSpy).toHaveBeenCalledTimes(1);
    expect(runDestTransformSpy).toHaveBeenCalledWith(
      'v0',
      'custom_audience',
      expect.arrayContaining([
        expect.objectContaining({ message: { type: 'record', id: 'ok-1' } }),
        expect.objectContaining({ message: { type: 'record', id: 'ok-2' } }),
      ]),
    );
    expect(runDestTransformSpy.mock.calls[0][2]).toHaveLength(2);
    expect(result).toEqual({
      user_transformed_payload: [
        { type: 'record', id: 'ok-1' },
        { error: 'user transform failed' },
        { type: 'record', id: 'ok-2' },
      ],
      dest_transform_output: [{ dest_transformed_payload: sampleOutput }],
    });
  });

  it('maps destination responses/statuses 1:1 to batched transformed payloads', async () => {
    jest
      .spyOn(
        EventTesterService as unknown as {
          runDestTransform: (
            version: string,
            dest: string,
            events: unknown[],
          ) => Promise<Array<{ payload: unknown } | { error: string }>>;
        },
        'runDestTransform',
      )
      .mockResolvedValue([
        { payload: sampleOutput },
        { payload: { ...sampleOutput, endpoint: 'https://api.example.com/y' } },
      ]);

    jest
      .spyOn(
        EventTesterService as unknown as {
          sendPayloadsToDestination: (
            destination: string,
            transformedPayloads: unknown[],
          ) => Promise<{ responses: unknown[]; statuses: number[] }>;
        },
        'sendPayloadsToDestination',
      )
      .mockResolvedValue({ responses: ['ok-1', 'ok-2'], statuses: [200, 202] });

    const result = await EventTesterService.testEventV2(
      {
        events: [{ type: 'record' }, { type: 'record' }],
        destination: { workspaceId: 'ws-1', destinationDefinition: {} },
        connection: {},
        stage: { user_transform: false, dest_transform: true, send_to_destination: true },
        libraries: [],
      },
      'v0',
      'custom_audience',
    );

    expect(result).toEqual({
      user_transformed_payload: [],
      dest_transform_output: [
        {
          dest_transformed_payload: sampleOutput,
          destination_response: 'ok-1',
          destination_response_status: 200,
        },
        {
          dest_transformed_payload: { ...sampleOutput, endpoint: 'https://api.example.com/y' },
          destination_response: 'ok-2',
          destination_response_status: 202,
        },
      ],
    });
  });

  it('returns error and aborts send when dest transform fails', async () => {
    jest
      .spyOn(
        EventTesterService as unknown as {
          runDestTransform: (
            version: string,
            dest: string,
            events: unknown[],
          ) => Promise<Array<{ payload: unknown } | { error: string }>>;
        },
        'runDestTransform',
      )
      .mockResolvedValue([{ error: 'template evaluation failed' }]);

    const result = await EventTesterService.testEventV2(
      {
        events: [{ type: 'record' }],
        destination: { workspaceId: 'ws-1', destinationDefinition: {} },
        connection: {},
        stage: { user_transform: false, dest_transform: true, send_to_destination: true },
        libraries: [],
      },
      'v0',
      'custom_audience',
    );

    expect(result).toEqual({
      user_transformed_payload: [],
      dest_transform_output: [
        { dest_transformed_payload: { error: 'template evaluation failed' } },
      ],
    });
  });

  it('interleaves successes and errors when dest transform partially fails', async () => {
    const failedOutput = { error: 'invalid field mapping' };
    jest
      .spyOn(
        EventTesterService as unknown as {
          runDestTransform: (
            version: string,
            dest: string,
            events: unknown[],
          ) => Promise<Array<{ payload: unknown } | { error: string }>>;
        },
        'runDestTransform',
      )
      .mockResolvedValue([
        { payload: sampleOutput },
        { error: 'invalid field mapping' },
        { payload: { ...sampleOutput, endpoint: 'https://api.example.com/y' } },
      ]);

    jest
      .spyOn(
        EventTesterService as unknown as {
          sendPayloadsToDestination: (
            destination: string,
            transformedPayloads: unknown[],
          ) => Promise<{ responses: unknown[]; statuses: number[] }>;
        },
        'sendPayloadsToDestination',
      )
      .mockResolvedValue({ responses: ['ok-1', 'ok-2'], statuses: [200, 202] });

    const result = await EventTesterService.testEventV2(
      {
        events: [{ type: 'record' }, { type: 'record' }, { type: 'record' }],
        destination: { workspaceId: 'ws-1', destinationDefinition: {} },
        connection: {},
        stage: { user_transform: false, dest_transform: true, send_to_destination: true },
        libraries: [],
      },
      'v0',
      'custom_audience',
    );

    // each entry groups its payload with its destination response; failed entries have no response
    expect(result.dest_transform_output).toEqual([
      {
        dest_transformed_payload: sampleOutput,
        destination_response: 'ok-1',
        destination_response_status: 200,
      },
      { dest_transformed_payload: failedOutput },
      {
        dest_transformed_payload: { ...sampleOutput, endpoint: 'https://api.example.com/y' },
        destination_response: 'ok-2',
        destination_response_status: 202,
      },
    ]);
  });
});

describe('EventTesterService.runUserTransform', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('reads camelCase versionId from transformed destination and calls userTransformHandler', async () => {
    // transformDestination capitalises top-level keys only:
    //   { transformations: [{ versionId: '...' }] }
    //   → { Transformations: [{ versionId: '...' }] }   (array contents untouched)
    //
    // runUserTransform must read Transformations[0]?.versionId (camelCase v)
    // to find the value and pass it to userTransformHandler.
    const innerHandler = jest
      .fn()
      .mockResolvedValue([{ transformedEvent: { type: 'record', transformed: true } }]);
    mockUserTransformHandler.mockReturnValue(innerHandler);

    const result = await EventTesterService.testEvent(
      [
        buildV1Event({
          stage: { user_transform: true, dest_transform: false, send_to_destination: false },
          destination: {
            workspaceId: 'ws-1',
            destinationDefinition: {},
            transformations: [{ versionId: 'transform-v1' }],
          },
        }),
      ],
      'v0',
      'custom_audience',
    );

    expect(innerHandler).toHaveBeenCalledWith([expect.anything()], 'transform-v1', []);
    expect(result).toEqual([{ user_transformed_payload: { type: 'record', transformed: true } }]);
  });

  it('continues to dest_transform after successful user_transform', async () => {
    const innerHandler = jest
      .fn()
      .mockResolvedValue([{ transformedEvent: { type: 'record', transformed: true } }]);
    mockUserTransformHandler.mockReturnValue(innerHandler);

    jest
      .spyOn(NativeIntegrationDestinationService.prototype, 'doRouterTransformation')
      .mockResolvedValue([
        {
          batchedRequest: sampleOutput,
          metadata: [{}] as any,
          destination: {} as any,
          batched: false,
          statusCode: 200,
        },
      ]);

    const result = await EventTesterService.testEvent(
      [
        buildV1Event({
          stage: { user_transform: true, dest_transform: true, send_to_destination: false },
          destination: {
            workspaceId: 'ws-1',
            destinationDefinition: {},
            transformations: [{ versionId: 'transform-v1' }],
          },
        }),
      ],
      'v0',
      'custom_audience',
    );

    expect(result).toEqual([
      {
        user_transformed_payload: { type: 'record', transformed: true },
        dest_transformed_payload: [sampleOutput],
      },
    ]);
  });

  it('runs full pipeline when user_transform succeeds', async () => {
    const innerHandler = jest
      .fn()
      .mockResolvedValue([{ transformedEvent: { type: 'record', transformed: true } }]);
    mockUserTransformHandler.mockReturnValue(innerHandler);

    jest
      .spyOn(NativeIntegrationDestinationService.prototype, 'doRouterTransformation')
      .mockResolvedValue([
        {
          batchedRequest: sampleOutput,
          metadata: [{}] as any,
          destination: {} as any,
          batched: false,
          statusCode: 200,
        },
      ]);

    jest
      .spyOn(
        EventTesterService as unknown as {
          sendPayloadsToDestination: (
            destination: string,
            transformedPayloads: unknown[],
          ) => Promise<{ responses: unknown[]; statuses: number[] }>;
        },
        'sendPayloadsToDestination',
      )
      .mockResolvedValue({ responses: ['ok'], statuses: [200] });

    const result = await EventTesterService.testEvent(
      [
        buildV1Event({
          stage: { user_transform: true, dest_transform: true, send_to_destination: true },
          destination: {
            workspaceId: 'ws-1',
            destinationDefinition: {},
            transformations: [{ versionId: 'transform-v1' }],
          },
        }),
      ],
      'v0',
      'custom_audience',
    );

    expect(result).toEqual([
      {
        user_transformed_payload: { type: 'record', transformed: true },
        dest_transformed_payload: [sampleOutput],
        destination_response: ['ok'],
        destination_response_status: [200],
      },
    ]);
  });
});

describe('EventTesterService.runDestTransform', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('delegates to NativeIntegrationDestinationService.doRouterTransformation', async () => {
    const doRouterSpy = jest
      .spyOn(NativeIntegrationDestinationService.prototype, 'doRouterTransformation')
      .mockResolvedValue([
        {
          batchedRequest: sampleOutput,
          metadata: [{}] as any,
          destination: {} as any,
          batched: false,
          statusCode: 200,
        },
      ]);

    const result = await EventTesterService.testEvent(
      [
        buildV1Event({
          stage: { user_transform: false, dest_transform: true, send_to_destination: false },
          destination: { workspaceId: 'ws-1', destinationDefinition: {} },
        }),
      ],
      'v0',
      'custom_audience',
    );

    expect(doRouterSpy).toHaveBeenCalledTimes(1);
    expect(doRouterSpy).toHaveBeenCalledWith(
      [expect.objectContaining({ metadata: expect.objectContaining({ workspaceId: 'ws-1' }) })],
      'custom_audience',
      'v0',
      {},
    );
    expect(result).toEqual([{ dest_transformed_payload: [sampleOutput] }]);
  });

  it('flattens array-valued batchedRequest entries to a uniform level', async () => {
    const output2 = { ...sampleOutput, endpoint: 'https://api.example.com/y' };
    jest
      .spyOn(NativeIntegrationDestinationService.prototype, 'doRouterTransformation')
      .mockResolvedValue([
        {
          batchedRequest: sampleOutput,
          metadata: [{}] as any,
          destination: {} as any,
          batched: false,
          statusCode: 200,
        },
        {
          batchedRequest: [sampleOutput, output2],
          metadata: [{}] as any,
          destination: {} as any,
          batched: true,
          statusCode: 200,
        },
      ]);

    const result = await EventTesterService.testEvent(
      [
        buildV1Event({
          stage: { user_transform: false, dest_transform: true, send_to_destination: false },
          destination: { workspaceId: 'ws-1', destinationDefinition: {} },
        }),
      ],
      'v0',
      'custom_audience',
    );

    // flatMap normalizes: single object + array both become top-level entries
    expect(result).toEqual([{ dest_transformed_payload: [sampleOutput, sampleOutput, output2] }]);
  });
});
