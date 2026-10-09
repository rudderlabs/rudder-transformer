import { findSurvivorIds, maskAt, secretValuesFor } from './validate';

const TENANT_SECRET = 'tenant-secret';

describe('secret-path survivor masking', () => {
  it('extracts runtime credentials only from metadata.secret', () => {
    expect(
      secretValuesFor(
        {
          message: { properties: { secret: { token: 'customer-secret-value' } } },
          metadata: { secret: { access_token: 'runtime-secret-value' } },
        },
        [],
      ),
    ).toEqual([{ source: 'metadata.secret.access_token', value: 'runtime-secret-value' }]);
  });

  it('reports survivor source and leaf path instead of value only', () => {
    expect(
      findSurvivorIds(
        {
          endpoint: 'https://example.com',
          headers: { Authorization: 'Bearer token-secret' },
          body: { JSON: { token: 'token-secret' } },
        },
        ['headers.Authorization'],
        [{ source: 'metadata.secret.access_token', value: 'token-secret' }],
      ),
    ).toEqual(['metadata.secret.access_token at body.JSON.token: token-secret']);
  });

  it('covers tenant-chosen credential header names through a containing-object path', () => {
    const request = { headers: { 'X-Customer-Token': TENANT_SECRET } };
    const secret = [{ source: 'config.apiKeyValue', value: TENANT_SECRET }];

    expect(findSurvivorIds(request, ['headers.x-api-key'], secret)).toEqual([
      `config.apiKeyValue at headers.X-Customer-Token: ${TENANT_SECRET}`,
    ]);
    expect(findSurvivorIds(request, ['headers'], secret)).toEqual([]);
  });

  it.each([
    {
      path: 'headers.Authorization',
      request: { headers: { Authorization: 'Bearer secret', other: 'visible' } },
      expected: { headers: { Authorization: '******', other: 'visible' } },
    },
    {
      path: 'body.JSON.messages.#.token',
      request: { body: { JSON: { messages: [{ token: 'a' }, { token: 'b' }] } } },
      expected: {
        body: { JSON: { messages: [{ token: '******' }, { token: '******' }] } },
      },
    },
    {
      path: 'headers',
      request: { headers: { 'X-Customer-Token': TENANT_SECRET, other: 'visible' } },
      expected: { headers: '******' },
    },
    {
      path: 'headers.X-Api\\.Key',
      request: { headers: { 'X-Api.Key': 'secret' } },
      expected: { headers: { 'X-Api.Key': '******' } },
    },
    {
      path: 'metadata.#.secret.accessToken',
      request: {
        metadata: [{ secret: { accessToken: 'first' } }, { secret: { accessToken: 'second' } }],
      },
      expected: {
        metadata: [{ secret: { accessToken: '******' } }, { secret: { accessToken: '******' } }],
      },
    },
  ])('masks $path', ({ path, request, expected }) => {
    maskAt(request, path);
    expect(request).toEqual(expected);
  });
});
