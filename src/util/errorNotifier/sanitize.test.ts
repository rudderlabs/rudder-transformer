import { sanitizeMetadata } from './sanitize';

describe('sanitizeMetadata', () => {
  it('reduces nested metadata to the allowlist in a v1 delivery error payload (the INT-6476 shape)', () => {
    const payload = {
      status: 500,
      message: 'Some delivery error',
      statTags: { errorCategory: 'transformation' },
      response: [
        {
          error: 'Some delivery error',
          statusCode: 500,
          metadata: {
            jobId: 65488902,
            userId: '',
            attemptNum: 0,
            dontBatch: false,
            sourceId: 'src-1',
            workspaceId: 'ws-1',
            destinationId: 'dst-1',
            secret: {
              access_token: 'ya29.secret-access-token',
              refresh_token: '1//secret-refresh-token',
              developer_token: 'secret-developer-token',
            },
          },
        },
      ],
    };

    const result = sanitizeMetadata(payload);

    expect(result).toEqual({
      status: 500,
      message: 'Some delivery error',
      statTags: { errorCategory: 'transformation' },
      response: [
        {
          error: 'Some delivery error',
          statusCode: 500,
          metadata: { sourceId: 'src-1', destinationId: 'dst-1', workspaceId: 'ws-1' },
        },
      ],
    });
    // no secret/token value survives anywhere in the serialized output
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('secret');
    expect(serialized).not.toContain('access_token');
    expect(serialized).not.toContain('jobId');
  });

  it('reduces a top-level metadata object to the allowlist', () => {
    const payload = {
      status: 400,
      metadata: {
        sourceId: 's',
        destinationId: 'd',
        workspaceId: 'w',
        secret: { access_token: 'x' },
      },
    };
    expect(sanitizeMetadata(payload)).toEqual({
      status: 400,
      metadata: { sourceId: 's', destinationId: 'd', workspaceId: 'w' },
    });
  });

  it('reduces each element when metadata is an array of objects', () => {
    const payload = {
      metadata: [
        { sourceId: 's1', destinationId: 'd1', workspaceId: 'w1', secret: { token: 'a' } },
        { sourceId: 's2', destinationId: 'd2', workspaceId: 'w2', jobId: 9 },
      ],
    };
    expect(sanitizeMetadata(payload)).toEqual({
      metadata: [
        { sourceId: 's1', destinationId: 'd1', workspaceId: 'w1' },
        { sourceId: 's2', destinationId: 'd2', workspaceId: 'w2' },
      ],
    });
  });

  it('only includes allowlisted fields that are actually present', () => {
    const payload = { metadata: { sourceId: 's', secret: { token: 'x' } } };
    expect(sanitizeMetadata(payload)).toEqual({ metadata: { sourceId: 's' } });
  });

  it('preserves non-metadata fields', () => {
    const payload = { status: 400, message: 'bad', statTags: { errorType: 'aborted' } };
    expect(sanitizeMetadata(payload)).toEqual(payload);
  });

  it('does not mutate the original input', () => {
    const payload = {
      response: [{ statusCode: 500, metadata: { sourceId: 's', secret: { token: 'x' } } }],
    };
    const snapshot = JSON.parse(JSON.stringify(payload));

    sanitizeMetadata(payload);

    expect(payload).toEqual(snapshot);
    expect(payload.response[0].metadata.secret).toBeDefined();
  });

  it('supports a custom allowlist', () => {
    const payload = { metadata: { sourceId: 's', jobId: 1 } };
    expect(sanitizeMetadata(payload, ['jobId'])).toEqual({ metadata: { jobId: 1 } });
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['number', 42],
    ['string', 'hello'],
    ['boolean', true],
  ])('returns %s primitives unchanged', (_name, value) => {
    expect(sanitizeMetadata(value)).toBe(value);
  });

  it('drops a primitive metadata value rather than forwarding it', () => {
    const payload = { metadata: 'secret-token' };
    expect(sanitizeMetadata(payload)).toEqual({ metadata: {} });
  });

  it('preserves a shared (non-circular) object reference instead of dropping it', () => {
    const shared = { statusCode: 500 };
    const payload = { first: shared, second: shared };
    expect(sanitizeMetadata(payload)).toEqual({
      first: { statusCode: 500 },
      second: { statusCode: 500 },
    });
  });

  it('handles circular references without throwing', () => {
    const payload: Record<string, unknown> = { status: 500 };
    payload.self = payload;
    expect(() => sanitizeMetadata(payload)).not.toThrow();
  });
});
