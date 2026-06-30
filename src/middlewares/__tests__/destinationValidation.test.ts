import { Context, Next } from 'koa';
import { DestinationValidationMiddleware } from '../destinationValidation';

const mockCtx = (body: unknown) =>
  ({
    request: { body },
    status: undefined,
    body: undefined,
  }) as unknown as Context;

const mockNext = () => jest.fn(async () => undefined) as jest.MockedFunction<Next>;

describe('DestinationValidationMiddleware', () => {
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
    expect(ctx.status).toBe(400);
    expect(ctx.body).toEqual({ error: 'Invalid destination: not_a_destination' });
  });
});
