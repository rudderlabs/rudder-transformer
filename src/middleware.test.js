const Koa = require('koa'); // Import Koa
const {
  addStatMiddleware,
  addRequestSizeMiddleware,
  getHeapProfile,
  getCPUProfile,
  initPyroscope,
} = require('./middleware');

const Pyroscope = require('@pyroscope/nodejs');
const stats = require('./util/stats');
const { getDestTypeFromContext } = require('@rudderstack/integrations-lib');

// Mock dependencies
jest.mock('@pyroscope/nodejs', () => ({
  init: jest.fn(),
  startHeapProfiling: jest.fn(),
  stopHeapProfiling: jest.fn().mockResolvedValue({}),
  startCpuProfiling: jest.fn(),
  stopCpuProfiling: jest.fn().mockResolvedValue({}),
}));
jest.mock('./util/stats', () => ({
  timing: jest.fn(),
  histogram: jest.fn(),
}));
jest.mock('@rudderstack/integrations-lib', () => ({
  getDestTypeFromContext: jest.fn(),
}));

describe('Pyroscope Initialization', () => {
  it('should initialize Pyroscope with the correct app name', () => {
    initPyroscope();
    expect(Pyroscope.init).toHaveBeenCalledWith({ appName: 'rudder-transformer' });
    expect(Pyroscope.startHeapProfiling).toHaveBeenCalled();
  });
});

describe('getCPUProfile', () => {
  it('should start and stop CPU profiling after specified seconds', async () => {
    jest.useFakeTimers();
    const seconds = 5;
    const profilePromise = getCPUProfile(seconds);

    expect(Pyroscope.startCpuProfiling).toHaveBeenCalled();
    jest.advanceTimersByTime(seconds * 1000);

    await profilePromise;
    expect(Pyroscope.stopCpuProfiling).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should return the result of stopCpuProfiling', async () => {
    const mockProfileData = { profile: 'data' };
    Pyroscope.stopCpuProfiling.mockResolvedValue(mockProfileData);

    const result = await getCPUProfile(1);

    expect(result).toBe(mockProfileData);
  });
});

describe('getHeapProfile', () => {
  it('should start and stop heap profiling', async () => {
    await getHeapProfile();

    expect(Pyroscope.startHeapProfiling).toHaveBeenCalled();
    expect(Pyroscope.stopHeapProfiling).toHaveBeenCalled();
  });

  it('should return the result of stopHeapProfiling', async () => {
    const mockHeapData = { heap: 'data' };
    Pyroscope.stopHeapProfiling.mockResolvedValue(mockHeapData);

    const result = await getHeapProfile();

    expect(result).toBe(mockHeapData);
  });
});

describe('durationMiddleware', () => {
  it('should record the duration of the request', async () => {
    // Mock getDestTypeFromContext to return a fixed value
    getDestTypeFromContext.mockReturnValue('mock-destination-type');

    const app = new Koa(); // Create a Koa app instance
    addStatMiddleware(app); // Pass the app instance to the middleware

    const ctx = {
      method: 'GET',
      status: 200,
      request: { url: '/test' },
    };
    const next = jest.fn().mockResolvedValue(null);

    // Simulate the middleware execution
    await app.middleware[0](ctx, next);

    expect(stats.timing).toHaveBeenCalledWith('http_request_duration', expect.any(Date), {
      method: 'GET',
      code: 200,
      route: '/test',
      destType: 'mock-destination-type', // Mocked value
    });
  });
});

describe('requestSizeMiddleware', () => {
  it('should record the size of the request and response', async () => {
    const app = new Koa(); // Create a Koa app instance
    addRequestSizeMiddleware(app); // Pass the app instance to the middleware

    const ctx = {
      method: 'POST',
      status: 200,
      request: {
        url: '/test',
        body: { key: 'value' },
      },
      response: {
        body: { success: true },
      },
    };
    const next = jest.fn().mockResolvedValue(null);

    // Simulate the middleware execution
    await app.middleware[0](ctx, next);

    expect(stats.histogram).toHaveBeenCalledWith('http_request_size', expect.any(Number), {
      method: 'POST',
      code: 200,
      route: '/test',
    });

    expect(stats.histogram).toHaveBeenCalledWith('http_response_size', expect.any(Number), {
      method: 'POST',
      code: 200,
      route: '/test',
    });
  });
});
