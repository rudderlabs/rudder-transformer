import { z } from 'zod';
import { responseSchemaValidationMiddleware } from '../responseSchemaValidation';
import logger from '../../logger';

jest.mock('../../logger', () => ({
  error: jest.fn(),
}));

const mockLogger = logger as jest.Mocked<typeof logger>;

describe('responseSchemaValidationMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows valid responses', async () => {
    const ctx = { body: { output: 'ok' }, status: 200 } as any;
    const next = jest.fn(async () => {
      ctx.body = { output: 'ok' };
    });

    await responseSchemaValidationMiddleware({
      endpoint: 'test endpoint',
      schema: z.object({ output: z.string() }),
    })(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).not.toHaveBeenCalled();
    expect(ctx.body).toEqual({ output: 'ok' });
  });

  it('validates a selected response payload', async () => {
    const ctx = { body: { output: { status: 200 } }, status: 200 } as any;
    const next = jest.fn(async () => undefined);

    await responseSchemaValidationMiddleware({
      endpoint: 'wrapped endpoint',
      schema: z.object({ status: z.number() }),
      selectPayload: (koaCtx) => (koaCtx.body as { output: unknown }).output,
    })(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('logs and throws when response validation fails', async () => {
    const ctx = { body: { output: 123 }, status: 200 } as any;
    const next = jest.fn(async () => undefined);
    const middleware = responseSchemaValidationMiddleware({
      endpoint: 'invalid endpoint',
      schema: z.object({ output: z.string() }),
    });

    await expect(middleware(ctx, next)).rejects.toMatchObject({
      message: expect.stringContaining('Response schema validation failed for invalid endpoint'),
      status: 500,
    });

    expect(next).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledWith('Response schema validation failed', {
      endpoint: 'invalid endpoint',
      error: 'output: Expected string, received number',
      status: 200,
    });
  });
});
