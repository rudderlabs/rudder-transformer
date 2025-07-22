const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const request = require('supertest');
const {
  addStatMiddleware,
  addRequestSizeMiddleware,
  addProfilingMiddleware,
  PYROSCOPE_WALL_SAMPLING_DURATION_MS,
  PYROSCOPE_WALL_SAMPLING_INTERVAL_MICROS,
  PYROSCOPE_HEAP_SAMPLING_INTERVAL_BYTES,
  PYROSCOPE_HEAP_STACK_DEPTH,
  parseEnvInt,
} = require('./middleware');

const Pyroscope = require('@rudderstack/pyroscope-nodejs').default;
const stats = require('./util/stats');
const { getDestTypeFromContext } = require('@rudderstack/integrations-lib');

// Mock dependencies
jest.mock('@rudderstack/pyroscope-nodejs', () => ({
  default: {
    init: jest.fn(),
    start: jest.fn(),
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
        collectCpuTime: true, // Enable CPU time collection - REQUIRED for CPU profiling
        samplingDurationMs: PYROSCOPE_WALL_SAMPLING_DURATION_MS, // Duration of a single wall profile (60 seconds)
        samplingIntervalMicros: PYROSCOPE_WALL_SAMPLING_INTERVAL_MICROS, // Interval between samples (10ms in microseconds)
      },
      heap: {
        samplingIntervalBytes: PYROSCOPE_HEAP_SAMPLING_INTERVAL_BYTES, // 512KB - heap sampling interval
        stackDepth: PYROSCOPE_HEAP_STACK_DEPTH, // Reduced stack depth to limit deep node_modules traces
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
    const responseBody = { response: 'bar' };
    const requestBody = { request: 'foo' };
    const requestBodySize = Buffer.byteLength(JSON.stringify(requestBody));
    const responseBodySize = Buffer.byteLength(JSON.stringify(responseBody));

    const app = new Koa();
    app.use(bodyParser({ jsonLimit: '200mb' }));
    addRequestSizeMiddleware(app);
    app.use(async (ctx) => {
      ctx.response.body = responseBody;
    });

    const res = await request(app.callback())
      .post('/test')
      .send(requestBody)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(responseBody);

    expect(stats.histogram).toHaveBeenCalledWith('http_request_size', requestBodySize, {
      method: 'POST',
      code: 200,
      route: '/test',
    });

    expect(stats.histogram).toHaveBeenCalledWith('http_response_size', responseBodySize, {
      method: 'POST',
      code: 200,
      route: '/test',
    });
  });

  it('should handle missing request and response bodies', async () => {
    const app = new Koa();
    app.use(bodyParser({ jsonLimit: '200mb' }));
    addRequestSizeMiddleware(app);
    app.use(async (ctx) => {
      ctx.status = 200;
    });

    const res = await request(app.callback()).get('/test');
    expect(res.status).toBe(200);

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
    const responseBody = {};
    const requestBody = {};
    const requestBodySize = Buffer.byteLength(JSON.stringify(requestBody));
    const responseBodySize = Buffer.byteLength(JSON.stringify(responseBody));

    const app = new Koa();
    app.use(bodyParser({ jsonLimit: '200mb' }));
    addRequestSizeMiddleware(app);
    app.use(async (ctx) => {
      ctx.response.body = responseBody;
    });

    const res = await request(app.callback())
      .post('/test')
      .send(requestBody)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(responseBody);

    expect(stats.histogram).toHaveBeenCalledWith('http_request_size', requestBodySize, {
      method: 'POST',
      code: 200,
      route: '/test',
    });

    expect(stats.histogram).toHaveBeenCalledWith('http_response_size', responseBodySize, {
      method: 'POST',
      code: 200,
      route: '/test',
    });
  });
});

describe('parseEnvInt', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('when environment variable is not set', () => {
    it('should return default value when env var is undefined', () => {
      delete process.env.TEST_VAR;
      expect(parseEnvInt('TEST_VAR', 100)).toBe(100);
    });

    it('should return default value when env var is empty string', () => {
      process.env.TEST_VAR = '';
      expect(parseEnvInt('TEST_VAR', 200)).toBe(200);
    });
  });

  describe('when environment variable contains valid integers', () => {
    it('should parse positive integers', () => {
      process.env.TEST_VAR = '42';
      expect(parseEnvInt('TEST_VAR', 100)).toBe(42);
    });

    it('should parse zero', () => {
      process.env.TEST_VAR = '0';
      expect(parseEnvInt('TEST_VAR', 100)).toBe(0);
    });

    it('should parse negative integers', () => {
      process.env.TEST_VAR = '-10';
      expect(parseEnvInt('TEST_VAR', 100)).toBe(-10);
    });

    it('should parse large integers', () => {
      process.env.TEST_VAR = '999999';
      expect(parseEnvInt('TEST_VAR', 100)).toBe(999999);
    });
  });

  describe('when environment variable contains invalid values', () => {
    it('should return default value for non-numeric strings', () => {
      process.env.TEST_VAR = 'abc';
      expect(parseEnvInt('TEST_VAR', 100)).toBe(100);
    });

    it('should return default value for mixed alphanumeric', () => {
      process.env.TEST_VAR = '123abc';
      expect(parseEnvInt('TEST_VAR', 100)).toBe(100);
    });

    it('should return default value for floating point numbers', () => {
      process.env.TEST_VAR = '12.34';
      expect(parseEnvInt('TEST_VAR', 100)).toBe(100);
    });

    it('should return default value for special values', () => {
      process.env.TEST_VAR = 'null';
      expect(parseEnvInt('TEST_VAR', 100)).toBe(100);
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace-only strings', () => {
      process.env.TEST_VAR = '   ';
      expect(parseEnvInt('TEST_VAR', 100)).toBe(100);
    });

    it('should parse integers with leading/trailing whitespace', () => {
      process.env.TEST_VAR = '  42  ';
      expect(parseEnvInt('TEST_VAR', 100)).toBe(42);
    });

    it('should work with different default value types', () => {
      process.env.TEST_VAR = 'invalid';
      expect(parseEnvInt('TEST_VAR', 0)).toBe(0);
      expect(parseEnvInt('TEST_VAR', -1)).toBe(-1);
    });
  });
});
