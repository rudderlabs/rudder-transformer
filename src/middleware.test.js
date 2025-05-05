const Koa = require('koa'); // Import Koa
const {
  addStatMiddleware,
  addRequestSizeMiddleware,
  addProfilingMiddleware,
} = require('./middleware');

const Pyroscope = require('@rudderstack/pyroscope-nodejs').default;
const stats = require('./util/stats');
const { getDestTypeFromContext } = require('@rudderstack/integrations-lib');

// Mock dependencies
jest.mock('@rudderstack/pyroscope-nodejs', () => ({
  default: {
    init: jest.fn(),
    koaMiddleware: () => async (ctx, next) => {
      await next();
    },
  },
}));
jest.mock('./util/stats', () => ({
  timing: jest.fn(),
  histogram: jest.fn(),
}));
jest.mock('@rudderstack/integrations-lib', () => ({
  getDestTypeFromContext: jest.fn(),
}));

describe('Pyroscope', () => {
  it('should initialize Pyroscope with the correct app name', () => {
    expect(Pyroscope.init).toHaveBeenCalledWith({
      appName: 'rudder-transformer',
      wall: {
        collectCpuTime: true, // Enable CPU time collection
      },
    });
  });

  it('addProfilingMiddleware should add middleware', async () => {
    const app = new Koa();
    addProfilingMiddleware(app);

    const ctx = {
      method: 'GET',
      status: 200,
      request: { url: '/debug/pprof/heap' },
    };
    const next = jest.fn().mockResolvedValue(null);

    await app.middleware[0](ctx, next);

    expect(app.middleware).toHaveLength(1);
    expect(next).toHaveBeenCalled();
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

  it('should handle missing request and response bodies', async () => {
    const app = new Koa();
    addRequestSizeMiddleware(app);

    const ctx = {
      method: 'GET',
      status: 200,
      request: {
        url: '/test',
        // No body property
      },
      response: {
        // No body property
      },
    };
    const next = jest.fn().mockResolvedValue(null);

    await app.middleware[0](ctx, next);

    expect(stats.histogram).toHaveBeenCalledWith('http_request_size', 0, {
      method: 'GET',
      code: 200,
      route: '/test',
    });

    expect(stats.histogram).toHaveBeenCalledWith('http_response_size', 0, {
      method: 'GET',
      code: 200,
      route: '/test',
    });
  });

  it('should handle empty request and response bodies', async () => {
    const app = new Koa();
    addRequestSizeMiddleware(app);

    const ctx = {
      method: 'POST',
      status: 200,
      request: {
        url: '/test',
        body: {},
      },
      response: {
        body: {},
      },
    };
    const next = jest.fn().mockResolvedValue(null);

    await app.middleware[0](ctx, next);

    expect(stats.histogram).toHaveBeenCalledWith('http_request_size', 2, {
      // "{}" is 2 bytes
      method: 'POST',
      code: 200,
      route: '/test',
    });

    expect(stats.histogram).toHaveBeenCalledWith('http_response_size', 2, {
      // "{}" is 2 bytes
      method: 'POST',
      code: 200,
      route: '/test',
    });
  });
});
