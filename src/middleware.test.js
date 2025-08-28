const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const request = require('supertest');
const { addStatMiddleware, addRequestSizeMiddleware } = require('./middleware');

const stats = require('./util/stats');
const { getDestTypeFromContext } = require('@rudderstack/integrations-lib');

jest.mock('./util/stats', () => ({
  timing: jest.fn(),
  histogram: jest.fn(),
}));
jest.mock('@rudderstack/integrations-lib', () => ({
  getDestTypeFromContext: jest.fn(),
}));

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
