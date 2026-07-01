import { Context, Next } from 'koa';
import { DestinationValidationMiddleware } from '../destinationValidation';
import logger from '../../logger';

const mockCtx = (body: unknown) =>
  ({
    request: { body },
    status: undefined,
    body: undefined,
  }) as unknown as Context;

const mockNext = () => jest.fn(async () => undefined) as jest.MockedFunction<Next>;

describe('DestinationValidationMiddleware', () => {
  const originalRejectUnknownDestinations = process.env.REJECT_UNKNOWN_DESTINATIONS;

  beforeEach(() => {
    delete process.env.REJECT_UNKNOWN_DESTINATIONS;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalRejectUnknownDestinations === undefined) {
      delete process.env.REJECT_UNKNOWN_DESTINATIONS;
    } else {
      process.env.REJECT_UNKNOWN_DESTINATIONS = originalRejectUnknownDestinations;
    }
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
    process.env.REJECT_UNKNOWN_DESTINATIONS = 'true';

    await DestinationValidationMiddleware.bodyDestType(ctx, next);

    expect(next).not.toHaveBeenCalled();
    expect(ctx.status).toBe(400);
    expect(ctx.body).toEqual({ error: 'Invalid destination: not_a_destination' });
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

    it('rejects unknown destination names in reject mode', async () => {
      const ctx = mockCtx([{ destType: 'ga' }, { destType: 'not_a_destination' }]);
      const next = mockNext();
      process.env.REJECT_UNKNOWN_DESTINATIONS = 'true';

      await DestinationValidationMiddleware.userDeletionBody(ctx, next);

      expect(next).not.toHaveBeenCalled();
      expect(ctx.status).toBe(400);
      expect(ctx.body).toEqual({ error: 'Invalid destination: not_a_destination' });
    });

    it('warns for every unknown destination name in warn-only mode', async () => {
      const ctx = mockCtx([
        { destType: 'unknown_one' },
        { destType: 'ga' },
        { destType: 'unknown_two' },
      ]);
      const next = mockNext();
      const warnSpy = jest.spyOn(logger, 'warn').mockImplementation(() => undefined);

      await DestinationValidationMiddleware.userDeletionBody(ctx, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(ctx.status).toBeUndefined();
      expect(ctx.body).toBeUndefined();
      expect(warnSpy).toHaveBeenCalledTimes(2);
      expect(warnSpy).toHaveBeenNthCalledWith(1, 'Unknown destination encountered: unknown_one');
      expect(warnSpy).toHaveBeenNthCalledWith(2, 'Unknown destination encountered: unknown_two');
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
