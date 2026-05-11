import { isBatchingFrameworkEnabled } from '../../../constants/batchedDestinationsMap';
import { FetchHandler } from '../../../helpers/fetchHandlers';
import { processBatchedDestination } from '../../destination/nativeBatching/processBatchedDestination';
import type { BatchDestinationConstructor } from '../../destination/nativeBatching/batchDestination';
import { EventTesterService } from '../eventTester';

jest.mock('../../../constants/batchedDestinationsMap');
jest.mock('../../destination/nativeBatching/processBatchedDestination');

const runDestTransform = (
  EventTesterService as unknown as {
    runDestTransform: (v: string, d: string, ev: unknown) => Promise<unknown[]>;
  }
).runDestTransform.bind(EventTesterService);

const mockIsBatchingEnabled = isBatchingFrameworkEnabled as jest.Mock;
const mockProcessBatched = processBatchedDestination as jest.Mock;

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

    it('returns batchedRequest payloads as a flat array on success', async () => {
      mockProcessBatched.mockResolvedValue([{ batchedRequest: sampleOutput }]);

      const result = await runDestTransform('v0', 'custom_audience', {
        message: { type: 'record' },
        destination: { WorkspaceId: 'ws-1' },
        connection: {},
      });

      expect(result).toEqual([sampleOutput]);
    });

    it('throws with the error message when a response carries an error', async () => {
      mockProcessBatched.mockResolvedValue([{ error: 'message.type: expected "record"' }]);

      await expect(
        runDestTransform('v0', 'custom_audience', { destination: { WorkspaceId: 'ws-1' } }),
      ).rejects.toThrow('message.type: expected "record"');
    });

    it('passes the event with synthetic metadata into processBatchedDestination', async () => {
      mockProcessBatched.mockResolvedValue([{ batchedRequest: sampleOutput }]);

      const ev = {
        message: { type: 'record' },
        destination: { WorkspaceId: 'ws-1' },
        connection: { foo: 'bar' },
      };
      await runDestTransform('v0', 'custom_audience', ev);

      expect(mockProcessBatched).toHaveBeenCalledWith(
        [{ ...ev, metadata: { workspaceId: 'ws-1' } }],
        expect.any(Function),
        {},
      );
    });
  });

  describe('legacy processor path', () => {
    beforeEach(() => {
      mockIsBatchingEnabled.mockReturnValue(false);
    });

    it.each([
      { name: 'single object', mockOutput: sampleOutput, expected: [sampleOutput] },
      {
        name: 'array of outputs',
        mockOutput: [sampleOutput, { ...sampleOutput, endpoint: '/y' }],
        expected: [sampleOutput, { ...sampleOutput, endpoint: '/y' }],
      },
    ])('normalizes process() $name into an array', async ({ mockOutput, expected }) => {
      jest
        .spyOn(
          EventTesterService as unknown as { getDestHandler: (...a: unknown[]) => unknown },
          'getDestHandler',
        )
        .mockReturnValue({ process: jest.fn().mockResolvedValue(mockOutput) });

      const result = await runDestTransform('v0', 'webhook', {
        destination: { WorkspaceId: 'ws-1' },
      });

      expect(result).toEqual(expected);
    });

    it('forwards version and destination to getDestHandler and passes ev to process', async () => {
      const processSpy = jest.fn().mockResolvedValue(sampleOutput);
      const getDestHandlerSpy = jest
        .spyOn(
          EventTesterService as unknown as { getDestHandler: (...a: unknown[]) => unknown },
          'getDestHandler',
        )
        .mockReturnValue({ process: processSpy });

      const ev = { message: { type: 'track' }, destination: { WorkspaceId: 'ws-1' } };
      await runDestTransform('v0', 'webhook', ev);

      expect(getDestHandlerSpy).toHaveBeenCalledWith('v0', 'webhook');
      expect(processSpy).toHaveBeenCalledWith(ev);
    });
  });
});
