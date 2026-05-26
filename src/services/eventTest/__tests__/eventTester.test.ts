import { isBatchingFrameworkEnabled } from '../../../constants/batchedDestinationsMap';
import { FetchHandler } from '../../../helpers/fetchHandlers';
import { sendToDestination } from '../../../routerUtils';
import { processBatchedDestination } from '../../destination/nativeBatching/processBatchedDestination';
import type { BatchDestinationConstructor } from '../../destination/nativeBatching/batchDestination';
import { EventTesterService } from '../eventTester';

jest.mock('../../../constants/batchedDestinationsMap');
jest.mock('../../destination/nativeBatching/processBatchedDestination');
jest.mock('../../../routerUtils', () => ({
  ...jest.requireActual('../../../routerUtils'),
  sendToDestination: jest.fn(),
  userTransformHandler: jest.fn(() => jest.fn()),
}));

const runDestTransform = (
  EventTesterService as unknown as {
    runDestTransform: (v: string, d: string, ev: unknown[]) => Promise<unknown[]>;
  }
).runDestTransform.bind(EventTesterService);

const mockIsBatchingEnabled = isBatchingFrameworkEnabled as jest.Mock;
const mockProcessBatched = processBatchedDestination as jest.Mock;
const mockSendToDestination = sendToDestination as jest.Mock;

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

describe('EventTesterService.runDestTransform', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('batching-framework path', () => {
    beforeEach(() => {
      mockIsBatchingEnabled.mockReturnValue(true);
      jest
        .spyOn(FetchHandler, 'getBatchDestinationHandler')
        .mockReturnValue(class FakeIntegration {} as unknown as BatchDestinationConstructor);
    });

    it('returns batchedRequest payloads with source indices on success', async () => {
      mockProcessBatched.mockResolvedValue([
        {
          batchedRequest: sampleOutput,
          metadata: [{ jobId: 1 }, { jobId: 2 }],
        },
      ]);

      const result = await runDestTransform('v0', 'custom_audience', [
        {
          message: { type: 'record' },
          destination: { WorkspaceId: 'ws-1' },
          connection: {},
          metadata: { workspaceId: 'ws-1', jobId: 1 },
        },
        {
          message: { type: 'record' },
          destination: { WorkspaceId: 'ws-1' },
          connection: {},
          metadata: { workspaceId: 'ws-1', jobId: 2 },
        },
      ]);

      expect(result).toEqual([{ payload: sampleOutput, source_event_indexes: [0, 1] }]);
    });

    it('throws with the error message when a response carries an error', async () => {
      mockProcessBatched.mockResolvedValue([{ error: 'message.type: expected "record"' }]);

      await expect(
        runDestTransform('v0', 'custom_audience', [
          {
            destination: { WorkspaceId: 'ws-1' },
            metadata: { workspaceId: 'ws-1', jobId: 1 },
          },
        ]),
      ).rejects.toThrow('message.type: expected "record"');
    });
  });

  describe('legacy processor path', () => {
    beforeEach(() => {
      mockIsBatchingEnabled.mockReturnValue(false);
    });

    it('uses processRouterDest when available and preserves metadata mapping', async () => {
      jest
        .spyOn(
          EventTesterService as unknown as { getDestHandler: (...a: unknown[]) => unknown },
          'getDestHandler',
        )
        .mockReturnValue({
          processRouterDest: jest.fn().mockResolvedValue([
            {
              batchedRequest: [sampleOutput, { ...sampleOutput, endpoint: '/y' }],
              metadata: [{ jobId: 1 }, { jobId: 2 }],
            },
          ]),
        });

      const result = await runDestTransform('v0', 'webhook', [
        {
          message: { type: 'track' },
          destination: { WorkspaceId: 'ws-1' },
          metadata: { workspaceId: 'ws-1', jobId: 1 },
        },
        {
          message: { type: 'track' },
          destination: { WorkspaceId: 'ws-1' },
          metadata: { workspaceId: 'ws-1', jobId: 2 },
        },
      ]);

      expect(result).toEqual([
        { payload: sampleOutput, source_event_indexes: [0, 1] },
        { payload: { ...sampleOutput, endpoint: '/y' }, source_event_indexes: [0, 1] },
      ]);
    });
  });
});

describe('EventTesterService.testEvent batching', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('groups events by destination+connection+stage and returns group-level response', async () => {
    jest
      .spyOn(
        EventTesterService as unknown as {
          runDestTransform: (...a: unknown[]) => Promise<unknown>;
        },
        'runDestTransform',
      )
      .mockResolvedValueOnce([{ payload: sampleOutput, source_event_indexes: [0, 1] }])
      .mockResolvedValueOnce([
        { payload: { ...sampleOutput, endpoint: '/z' }, source_event_indexes: [0] },
      ]);
    mockSendToDestination.mockResolvedValue({
      status: 200,
      headers: { 'content-type': 'application/json' },
      response: { ok: true },
    });

    const events = [
      {
        message: { type: 'track' },
        destination: { id: 'd1', destinationDefinition: { name: 'test' } },
        connection: { config: { destination: { key: 'v1' } } },
        stage: { dest_transform: true, send_to_destination: true },
      },
      {
        message: { type: 'track' },
        destination: { id: 'd1', destinationDefinition: { name: 'test' } },
        connection: { config: { destination: { key: 'v1' } } },
        stage: { dest_transform: true, send_to_destination: true },
      },
      {
        message: { type: 'track' },
        destination: { id: 'd2', destinationDefinition: { name: 'test' } },
        connection: { config: { destination: { key: 'v2' } } },
        stage: { dest_transform: true, send_to_destination: true },
      },
    ];

    const result = await EventTesterService.testEvent(events as never[], 'v0', 'webhook');

    expect(result).toHaveLength(2);
    expect(result[0].source_event_indexes).toEqual([0, 1]);
    expect(result[0].dest_transformed_payload).toEqual([
      { payload: sampleOutput, source_event_indexes: [0, 1] },
    ]);
    expect(result[1].source_event_indexes).toEqual([2]);
    expect(mockSendToDestination).toHaveBeenCalledTimes(2);
  });

  it('separates groups when send_to_destination differs and only sends enabled groups', async () => {
    jest
      .spyOn(
        EventTesterService as unknown as {
          runDestTransform: (...a: unknown[]) => Promise<unknown>;
        },
        'runDestTransform',
      )
      .mockResolvedValueOnce([{ payload: sampleOutput, source_event_indexes: [0] }])
      .mockResolvedValueOnce([{ payload: sampleOutput, source_event_indexes: [0] }]);
    mockSendToDestination.mockResolvedValue({
      status: 200,
      headers: { 'content-type': 'application/json' },
      response: { ok: true },
    });

    const events = [
      {
        message: { type: 'track' },
        destination: { id: 'd1', destinationDefinition: { name: 'test' } },
        connection: { config: { destination: { key: 'v1' } } },
        stage: { dest_transform: true, send_to_destination: true },
      },
      {
        message: { type: 'track' },
        destination: { id: 'd1', destinationDefinition: { name: 'test' } },
        connection: { config: { destination: { key: 'v1' } } },
        stage: { dest_transform: true, send_to_destination: false },
      },
    ];

    const result = await EventTesterService.testEvent(events as never[], 'v0', 'webhook');

    expect(result).toHaveLength(2);
    expect(result[0].destination_response).toEqual([{ ok: true }]);
    expect(result[1].destination_response).toBeUndefined();
    expect(mockSendToDestination).toHaveBeenCalledTimes(1);
  });

  it('throws when a single batched payload maps to mixed send_to_destination flags', () => {
    const validateSendFlags = (
      EventTesterService as unknown as {
        validateSendFlags: (batchOutputs: unknown[], groupEvents: unknown[]) => void;
      }
    ).validateSendFlags.bind(EventTesterService);

    expect(() =>
      validateSendFlags(
        [{ source_event_indexes: [0, 1] }],
        [
          { source: { stage: { send_to_destination: true } } },
          { source: { stage: { send_to_destination: false } } },
        ],
      ),
    ).toThrow(
      'Mixed send_to_destination flags within a batched destination payload are not supported.',
    );
  });
});
