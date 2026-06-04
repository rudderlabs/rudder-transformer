const { stripKeysDeep } = require('./sanitize');

describe('stripKeysDeep', () => {
  it('removes nested metadata from a v1 delivery error payload (the INT-6476 leak shape)', () => {
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
            workspaceId: 'ws-1',
            secret: {
              access_token: 'ya29.secret-access-token',
              refresh_token: '1//secret-refresh-token',
              developer_token: 'secret-developer-token',
            },
          },
        },
      ],
    };

    const result = stripKeysDeep(payload);

    expect(result).toEqual({
      status: 500,
      message: 'Some delivery error',
      statTags: { errorCategory: 'transformation' },
      response: [{ error: 'Some delivery error', statusCode: 500 }],
    });
    // no secret/token value survives anywhere in the serialized output
    expect(JSON.stringify(result)).not.toContain('secret');
    expect(JSON.stringify(result)).not.toContain('access_token');
  });

  it('removes a top-level metadata key', () => {
    const payload = { status: 400, metadata: { secret: { access_token: 'x' } } };
    expect(stripKeysDeep(payload)).toEqual({ status: 400 });
  });

  it('preserves non-metadata fields', () => {
    const payload = { status: 400, message: 'bad', statTags: { errorType: 'aborted' } };
    expect(stripKeysDeep(payload)).toEqual(payload);
  });

  it('does not mutate the original input', () => {
    const payload = { response: [{ statusCode: 500, metadata: { secret: { token: 'x' } } }] };
    const snapshot = JSON.parse(JSON.stringify(payload));

    stripKeysDeep(payload);

    expect(payload).toEqual(snapshot);
    expect(payload.response[0].metadata).toBeDefined();
  });

  it('supports custom keys to strip', () => {
    const payload = { keep: 'yes', secret: { token: 'x' } };
    expect(stripKeysDeep(payload, ['secret'])).toEqual({ keep: 'yes' });
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['number', 42],
    ['string', 'hello'],
    ['boolean', true],
  ])('returns %s primitives unchanged', (_name, value) => {
    expect(stripKeysDeep(value)).toBe(value);
  });

  it('handles circular references without throwing', () => {
    const payload = { status: 500 };
    payload.self = payload;
    expect(() => stripKeysDeep(payload)).not.toThrow();
  });
});
