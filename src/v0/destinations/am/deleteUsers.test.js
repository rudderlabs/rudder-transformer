const { httpPOST } = require('../../../adapters/network');
const {
  NativeIntegrationDestinationService,
} = require('../../../services/destination/nativeIntegration');
const { ErrorReportingService } = require('../../../services/errorReporting');
const { processDeleteUsers } = require('./deleteUsers');

jest.mock('../../../adapters/network', () => ({ httpPOST: jest.fn() }));

const success = { success: true, response: { status: 200, data: {} } };
const rateLimited = {
  success: false,
  response: { response: { status: 429, data: { message: 'rate limited' } } },
};
const deletionJob = (count) => ({
  destType: 'AM',
  userAttributes: Array.from({ length: count }, (_, index) => ({ userId: `user-${index}` })),
  config: { apiKey: 'api-key', apiSecret: 'api-secret' },
});

describe('Amplitude user deletion pacing', () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: 0 });
    httpPOST.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('sends 1,000 users as 10 ordered, non-overlapping requests at least one second apart', async () => {
    const starts = [];
    let inFlight = 0;
    let maxInFlight = 0;
    httpPOST.mockImplementation(async () => {
      starts.push(Date.now());
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 400));
      inFlight -= 1;
      return success;
    });

    const result = processDeleteUsers(deletionJob(1000));
    expect(httpPOST).toHaveBeenCalledTimes(1);
    await jest.advanceTimersByTimeAsync(999);
    expect(httpPOST).toHaveBeenCalledTimes(1);
    await jest.advanceTimersByTimeAsync(1);
    expect(httpPOST).toHaveBeenCalledTimes(2);
    await jest.advanceTimersByTimeAsync(8400);

    await expect(result).resolves.toEqual({ statusCode: 200, status: 'successful' });
    expect(httpPOST).toHaveBeenCalledTimes(10);
    expect(starts).toEqual(Array.from({ length: 10 }, (_, index) => index * 1000));
    expect(maxInFlight).toBe(1);
    httpPOST.mock.calls.forEach(([url, data, options, statTags], index) => {
      expect(url).toBe('https://amplitude.com/api/2/deletions/users');
      expect(data).toEqual({
        user_ids: Array.from({ length: 100 }, (_, offset) => `user-${index * 100 + offset}`),
        requester: 'RudderStack',
        ignore_invalid_id: 'true',
      });
      expect(options.headers).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Basic YXBpLWtleTphcGktc2VjcmV0',
      });
      expect(statTags).toEqual({
        destType: 'am',
        feature: 'deleteUsers',
        endpointPath: '/api/2/deletions/users',
        requestMethod: 'POST',
        module: 'deletion',
      });
    });
    expect(jest.getTimerCount()).toBe(0);
  });

  it('does not wait after a response taking more than one second', async () => {
    const starts = [];
    httpPOST.mockImplementation(async () => {
      starts.push(Date.now());
      await new Promise((resolve) => setTimeout(resolve, 1300));
      return success;
    });

    const result = processDeleteUsers(deletionJob(200));
    await jest.advanceTimersByTimeAsync(2600);

    await expect(result).resolves.toEqual({ statusCode: 200, status: 'successful' });
    expect(starts).toEqual([0, 1300]);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('keeps request starts spaced when the wall clock jumps forward', async () => {
    const starts = [];
    httpPOST.mockImplementation(() => {
      starts.push(performance.now());
      return Promise.resolve(success);
    });

    const result = processDeleteUsers(deletionJob(200));
    expect(starts).toEqual([0]);
    jest.setSystemTime(60_000);
    await jest.advanceTimersByTimeAsync(999);
    expect(starts).toEqual([0]);
    await jest.advanceTimersByTimeAsync(1);

    await expect(result).resolves.toEqual({ statusCode: 200, status: 'successful' });
    expect(starts).toEqual([0, 1000]);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('stops on a middle-batch 429 and returns 429 to the worker', async () => {
    jest.spyOn(ErrorReportingService, 'reportError').mockImplementation(() => {});
    httpPOST.mockResolvedValueOnce(success).mockResolvedValueOnce(rateLimited);

    const response = new NativeIntegrationDestinationService().processUserDeletion(
      [deletionJob(300)],
      'am',
    );
    await jest.advanceTimersByTimeAsync(1000);
    await jest.runOnlyPendingTimersAsync(); // mapInBatches yields with setImmediate after handling the job.

    await expect(response).resolves.toEqual([
      { statusCode: 429, error: 'User deletion request failed' },
    ]);
    expect(httpPOST).toHaveBeenCalledTimes(2);
    expect(httpPOST.mock.calls.map(([, data]) => data.user_ids[0])).toEqual(['user-0', 'user-100']);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('sends a single batch immediately without a timer', async () => {
    httpPOST.mockResolvedValue(success);

    const response = processDeleteUsers(deletionJob(100));

    expect(httpPOST).toHaveBeenCalledTimes(1);
    await expect(response).resolves.toEqual({ statusCode: 200, status: 'successful' });
    expect(jest.getTimerCount()).toBe(0);
  });
});
