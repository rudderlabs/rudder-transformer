import { Context, Next } from 'koa';
import { DestinationValidationMiddleware } from '../destinationValidation';
import logger from '../../logger';

jest.mock('../../logger', () => ({
  error: jest.fn(),
}));

const mockCtx = (body: unknown) =>
  ({
    request: { body },
    status: undefined,
    body: undefined,
  }) as unknown as Context;

const mockNext = () => jest.fn(async () => undefined) as jest.MockedFunction<Next>;

describe('DestinationValidationMiddleware', () => {
  const mockLogger = logger as jest.Mocked<typeof logger>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lets malformed router payloads without destType use existing request validation', async () => {
    const ctx = mockCtx({ input: {} });
    const next = mockNext();

    await DestinationValidationMiddleware.bodyDestType(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(ctx.status).toBeUndefined();
    expect(ctx.body).toBeUndefined();
  });

  it('rejects supplied unknown body destType values', async () => {
    const ctx = mockCtx({ input: [], destType: 'not_a_destination' });
    const next = mockNext();

    await DestinationValidationMiddleware.bodyDestType(ctx, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Unknown destination encountered: not_a_destination',
    );
    expect(ctx.status).toBe(404);
    expect(ctx.body).toEqual({ error: 'Unknown destination: not_a_destination' });
  });

  describe('userDeletionBody', () => {
    it('accepts a valid deletion batch', async () => {
      const ctx = mockCtx([{ destType: 'ga' }, { destType: 'braze' }]);
      const next = mockNext();

      await DestinationValidationMiddleware.userDeletionBody(ctx, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(ctx.status).toBeUndefined();
      expect(ctx.body).toBeUndefined();
    });

    it('rejects unknown destination names', async () => {
      const ctx = mockCtx([{ destType: 'ga' }, { destType: 'not_a_destination' }]);
      const next = mockNext();

      await DestinationValidationMiddleware.userDeletionBody(ctx, next);

      expect(next).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Unknown destination encountered: not_a_destination',
      );
      expect(ctx.status).toBe(404);
      expect(ctx.body).toEqual({ error: 'Unknown destination: not_a_destination' });
    });

    it.each([
      { name: 'empty array', body: [] },
      { name: 'non-array body', body: { destType: 'ga' } },
    ])('lets payload-shape validation happen downstream: $name', async ({ body }) => {
      const ctx = mockCtx(body);
      const next = mockNext();

      await DestinationValidationMiddleware.userDeletionBody(ctx, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(ctx.status).toBeUndefined();
      expect(ctx.body).toBeUndefined();
    });
  });
});
