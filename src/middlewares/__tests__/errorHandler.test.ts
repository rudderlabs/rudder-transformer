import { errorHandlerMiddleware } from '../errorHandler';
import logger from '../../logger';

jest.mock('../../logger', () => ({
  error: jest.fn(),
}));

describe('errorHandlerMiddleware', () => {
  const mockLogger = logger as jest.Mocked<typeof logger>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockCtx() {
    return {
      url: '/test-endpoint',
      method: 'POST',
      status: 200,
      body: undefined,
      headers: {},
      get(header: string) {
        return this.headers[header];
      },
      set(header: string, value: string) {
        this.headers[header] = value;
      },
      app: {
        emit: jest.fn(),
      },
    } as any;
  }

  it('calls next when no error occurs', async () => {
    const ctx = mockCtx();
    const next = jest.fn();

    await errorHandlerMiddleware()(ctx, next);

    expect(next).toHaveBeenCalled();
    expect(mockLogger.error).not.toHaveBeenCalled();
    expect(ctx.status).toBe(200);
    expect(ctx.body).toBeUndefined();
  });

  it('handles Error objects and logs with context', async () => {
    const error = new Error('Database connection failed');
    const ctx = mockCtx();
    const next = jest.fn().mockRejectedValue(error);

    await errorHandlerMiddleware()(ctx, next);

    expect(mockLogger.error).toHaveBeenCalledWith('Unhandled error in middleware stack', {
      error: 'Database connection failed',
      stack: error.stack,
      url: '/test-endpoint',
      method: 'POST',
      status: 200,
      userAgent: undefined,
      ip: undefined,
      requestId: undefined,
    });
    expect(ctx.status).toBe(500);
    expect(ctx.body).toEqual({
      error: 'Internal Server Error',
      message: 'Database connection failed',
    });
    expect(ctx.app.emit).toHaveBeenCalledWith('error', error, ctx);
  });

  it('handles non-Error objects', async () => {
    const error = 'String error message';
    const ctx = mockCtx();
    const next = jest.fn().mockRejectedValue(error);

    await errorHandlerMiddleware()(ctx, next);

    expect(mockLogger.error).toHaveBeenCalledWith('Unhandled error in middleware stack', {
      error: 'String error message',
      stack: undefined,
      url: '/test-endpoint',
      method: 'POST',
      status: 200,
      userAgent: undefined,
      ip: undefined,
      requestId: undefined,
    });
    expect(ctx.status).toBe(500);
    expect(ctx.body).toEqual({
      error: 'Internal Server Error',
      message: 'String error message',
    });
  });

  it('preserves error status code when available', async () => {
    const error = new Error('Not Found');
    (error as any).status = 404;
    const ctx = mockCtx();
    const next = jest.fn().mockRejectedValue(error);

    await errorHandlerMiddleware()(ctx, next);

    expect(ctx.status).toBe(404);
    expect(ctx.body).toEqual({
      error: 'Internal Server Error',
      message: 'Not Found',
    });
  });

  it('includes request context in error logs', async () => {
    const error = new Error('Test error');
    const ctx = mockCtx();
    ctx.url = '/api/users';
    ctx.method = 'GET';
    ctx.status = 200;
    ctx.headers['User-Agent'] = 'Mozilla/5.0';
    ctx.ip = '192.168.1.1';
    ctx.headers['X-Request-ID'] = 'req-123';
    const next = jest.fn().mockRejectedValue(error);

    await errorHandlerMiddleware()(ctx, next);

    expect(mockLogger.error).toHaveBeenCalledWith('Unhandled error in middleware stack', {
      error: 'Test error',
      stack: error.stack,
      url: '/api/users',
      method: 'GET',
      status: 200,
      userAgent: 'Mozilla/5.0',
      ip: '192.168.1.1',
      requestId: 'req-123',
    });
  });

  it('sanitizes error message in production environment', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const error = new Error('Database password: secret123');
    const ctx = mockCtx();
    const next = jest.fn().mockRejectedValue(error);

    await errorHandlerMiddleware()(ctx, next);

    expect(ctx.body).toEqual({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });

    process.env.NODE_ENV = originalEnv;
  });

  it('shows detailed error message in development environment', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const error = new Error('Detailed error message');
    const ctx = mockCtx();
    const next = jest.fn().mockRejectedValue(error);

    await errorHandlerMiddleware()(ctx, next);

    expect(ctx.body).toEqual({
      error: 'Internal Server Error',
      message: 'Detailed error message',
    });

    process.env.NODE_ENV = originalEnv;
  });

  it('handles null and undefined errors', async () => {
    const ctx = mockCtx();
    const next = jest.fn().mockRejectedValue(null);

    await errorHandlerMiddleware()(ctx, next);

    expect(mockLogger.error).toHaveBeenCalledWith('Unhandled error in middleware stack', {
      error: 'null',
      stack: undefined,
      url: '/test-endpoint',
      method: 'POST',
      status: 200,
      userAgent: undefined,
      ip: undefined,
      requestId: undefined,
    });
    expect(ctx.status).toBe(500);
    expect(ctx.body).toEqual({
      error: 'Internal Server Error',
      message: 'null',
    });
  });

  it('handles circular reference errors safely', async () => {
    const error = new Error('Circular error');
    (error as any).self = error; // Create circular reference
    const ctx = mockCtx();
    const next = jest.fn().mockRejectedValue(error);

    await errorHandlerMiddleware()(ctx, next);

    expect(mockLogger.error).toHaveBeenCalledWith('Unhandled error in middleware stack', {
      error: 'Circular error',
      stack: error.stack,
      url: '/test-endpoint',
      method: 'POST',
      status: 200,
      userAgent: undefined,
      ip: undefined,
      requestId: undefined,
    });
    expect(ctx.status).toBe(500);
  });

  it('emits error event to app', async () => {
    const error = new Error('Test error');
    const ctx = mockCtx();
    const next = jest.fn().mockRejectedValue(error);

    await errorHandlerMiddleware()(ctx, next);

    expect(ctx.app.emit).toHaveBeenCalledWith('error', error, ctx);
  });
});
