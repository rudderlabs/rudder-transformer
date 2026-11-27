import { RouterTransformationResponseSchema } from './zodTypes';

const response = {
  metadata: [{ jobId: 1 }],
  destination: { ID: 'dest-1' },
  batched: false,
};

const request = {
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint: 'https://api.test.com/events',
};

describe('RouterTransformationResponseSchema', () => {
  it('accepts request-free 299 responses', () => {
    expect(
      RouterTransformationResponseSchema.safeParse({ ...response, statusCode: 299 }).success,
    ).toBe(true);
  });

  it.each([200, 201, 202, 298])('rejects request-free success status %i', (statusCode) => {
    expect(RouterTransformationResponseSchema.safeParse({ ...response, statusCode }).success).toBe(
      false,
    );
  });

  it('still accepts a 299 with a request', () => {
    expect(
      RouterTransformationResponseSchema.safeParse({
        ...response,
        statusCode: 299,
        batchedRequest: request,
      }).success,
    ).toBe(true);
  });
});
