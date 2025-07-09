import Koa from 'koa';
import request from 'supertest';
import { errorHandlerMiddleware } from '../errorHandler';
import logger from '../../logger';

jest.mock('../../logger', () => ({
  error: jest.fn(),
}));

describe('errorHandlerMiddleware Integration', () => {
  const mockLogger = logger as jest.Mocked<typeof logger>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles errors in route handlers', async () => {
    const app = new Koa();
    app.use(errorHandlerMiddleware());

    // Add a route that throws an error
    app.use(async (ctx) => {
      if (ctx.path === '/error') {
        throw new Error('Route error');
      }
      ctx.body = { message: 'success' };
    });

    const response = await request(app.callback()).get('/error').expect(500);

    expect(response.body).toEqual({
      error: 'Internal Server Error',
      message: 'Route error',
    });

    expect(mockLogger.error).toHaveBeenCalledWith('Unhandled error in middleware stack', {
      error: 'Route error',
      stack: expect.any(String),
      url: '/error',
      method: 'GET',
      status: expect.any(Number),
      userAgent: expect.any(String),
      ip: expect.any(String),
      requestId: expect.any(String),
    });
  });

  it('handles async errors in route handlers', async () => {
    const app = new Koa();
    app.use(errorHandlerMiddleware());

    app.use(async (ctx) => {
      if (ctx.path === '/async-error') {
        await Promise.reject(new Error('Async error'));
      }
      ctx.body = { message: 'success' };
    });

    const response = await request(app.callback()).get('/async-error').expect(500);

    expect(response.body).toEqual({
      error: 'Internal Server Error',
      message: 'Async error',
    });
  });

  it('preserves custom status codes', async () => {
    const app = new Koa();
    app.use(errorHandlerMiddleware());

    app.use(async (ctx) => {
      if (ctx.path === '/not-found') {
        const error = new Error('Not Found');
        (error as any).status = 404;
        throw error;
      }
      ctx.body = { message: 'success' };
    });

    const response = await request(app.callback()).get('/not-found').expect(404);

    expect(response.body).toEqual({
      error: 'Internal Server Error',
      message: 'Not Found',
    });
  });

  it('handles successful requests normally', async () => {
    const app = new Koa();
    app.use(errorHandlerMiddleware());

    app.use(async (ctx) => {
      ctx.body = { message: 'success' };
    });

    const response = await request(app.callback()).get('/success').expect(200);

    expect(response.body).toEqual({ message: 'success' });
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('sanitizes error messages in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const app = new Koa();
    app.use(errorHandlerMiddleware());

    app.use(async (ctx) => {
      if (ctx.path === '/sensitive-error') {
        throw new Error('Database password: secret123');
      }
      ctx.body = { message: 'success' };
    });

    const response = await request(app.callback()).get('/sensitive-error').expect(500);

    expect(response.body).toEqual({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });

    process.env.NODE_ENV = originalEnv;
  });
});
