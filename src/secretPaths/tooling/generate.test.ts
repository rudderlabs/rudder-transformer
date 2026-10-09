import type { SecretPaths } from '..';
import {
  Baseline,
  decoyOf,
  collapseKeyFamily,
  FlattenedOutput,
  flattenRequests,
  fetchedCredentialsOnAuthSurface,
  hasSameShape,
  locationsForKey,
  Movement,
  nonHttpSecretCarriersIn,
  serialise,
  toSecretPaths,
  validateSecretPaths,
  valuesFor,
} from './generate';

const AUTHORIZATION_LOCATION = 'req[0]|headers.Authorization';
const AUTHORIZATION_PATH = 'headers.Authorization';
const ENDPOINT_LOCATION = 'req[0]|endpoint';
const DESTINATION_ENDPOINT = 'https://destination.example';
const INVALID_PATH_MESSAGE = 'Invalid secret path';
const PARAM_TOKEN = 'param+token';
const NON_HTTP_SECRET = 'test-account-id';
const CHARACTER_CLASSES = [/[a-z]/, /[A-Z]/, /\d/, /[^\dA-Za-z]/];
const PUNCTUATION = /[^\dA-Za-z]/;

const flattened = (entries: Record<string, string>, requestCount = 1): FlattenedOutput => ({
  leaves: new Map(Object.entries(entries)),
  requestCount,
});

const baseline = (entries: Record<string, string>, nonDeterministic: string[] = []): Baseline => ({
  runA: flattened(entries),
  nonDeterministic: new Set(nonDeterministic),
});

const movement = (path: string): Movement => ({ loc: `req[0]|${path}` });

describe('secret-path generator utilities', () => {
  it('produces distinct format-preserving decoys', () => {
    const value = 'Ab9-z_.?';
    const first = decoyOf(value, 1);
    const second = decoyOf(value, 2);

    expect(first).toHaveLength(value.length);
    expect(second).toHaveLength(value.length);
    expect(new Set([value, first, second]).size).toBe(3);
    [...value].forEach((character, index) => {
      expect(CHARACTER_CLASSES.findIndex((group) => group.test(character))).toBe(
        CHARACTER_CLASSES.findIndex((group) => group.test(first[index])),
      );
      if (PUNCTUATION.test(character)) expect(first[index]).toBe(character);
    });
  });

  it('requires two distinct decoy outputs before attributing a location', () => {
    const real = baseline({ [AUTHORIZATION_LOCATION]: 'Bearer real' });
    const first = flattened({ [AUTHORIZATION_LOCATION]: 'Bearer decoy-a' });

    expect(
      locationsForKey(
        real,
        first,
        flattened({ [AUTHORIZATION_LOCATION]: 'Bearer decoy-b' }),
        'apiKey',
      ),
    ).toEqual([{ loc: AUTHORIZATION_LOCATION }]);
    expect(locationsForKey(real, first, first, 'apiKey')).toEqual([]);
  });

  it('keeps before-and-after evidence only for the endpoint', () => {
    const real = baseline({
      [ENDPOINT_LOCATION]: 'https://x.example/?k=real',
      [AUTHORIZATION_LOCATION]: 'a',
    });

    expect(
      locationsForKey(
        real,
        flattened({
          [ENDPOINT_LOCATION]: 'https://x.example/?k=dcy1',
          [AUTHORIZATION_LOCATION]: 'b',
        }),
        flattened({
          [ENDPOINT_LOCATION]: 'https://x.example/?k=dcy2',
          [AUTHORIZATION_LOCATION]: 'c',
        }),
      ),
    ).toEqual([
      {
        loc: ENDPOINT_LOCATION,
        evidence: { real: 'https://x.example/?k=real', decoy: 'https://x.example/?k=dcy1' },
      },
      { loc: AUTHORIZATION_LOCATION },
    ]);
  });

  it('retains request and leaf counts for shape-stability checks', () => {
    const output = flattenRequests({
      output: [
        { endpoint: 'https://one.example', headers: { Authorization: 'first' } },
        { endpoint: 'https://two.example', headers: { Authorization: 'second' } },
      ],
    });

    expect(output).toEqual({
      requestCount: 2,
      leaves: new Map([
        [ENDPOINT_LOCATION, 'https://one.example'],
        [AUTHORIZATION_LOCATION, 'first'],
        ['req[1]|endpoint', 'https://two.example'],
        ['req[1]|headers.Authorization', 'second'],
      ]),
    });
    expect(hasSameShape(output, flattened({ [ENDPOINT_LOCATION]: 'changed' }, 1))).toBe(false);
    expect(hasSameShape(output, flattened({ [ENDPOINT_LOCATION]: 'changed' }, 2))).toBe(false);
  });

  it('flattens only fields delivered to the destination', () => {
    const output = flattenRequests({
      endpoint: DESTINATION_ENDPOINT,
      headers: { Authorization: 'Bearer delivered-secret' },
      params: { api_key: 'delivered-param' },
      body: { token: 'delivered-body' },
      metadata: [{ secret: { accessToken: 'source-only-secret' } }],
      destinationConfig: { apiKey: 'source-only-config' },
      accessKey: 'source-only-access-key',
      accessSecret: 'source-only-access-secret',
    });

    expect(output).toEqual({
      requestCount: 1,
      leaves: new Map([
        [AUTHORIZATION_LOCATION, 'Bearer delivered-secret'],
        ['req[0]|params.api_key', 'delivered-param'],
        ['req[0]|body.token', 'delivered-body'],
        [ENDPOINT_LOCATION, DESTINATION_ENDPOINT],
      ]),
    });
  });

  it('does not mistake nested destination config for another delivered request', () => {
    const output = flattenRequests({
      batchedRequest: {
        endpoint: DESTINATION_ENDPOINT,
        headers: { Authorization: 'Basic delivered-secret' },
      },
      destination: {
        Config: {
          endpoint: 'https://configuration.example',
          accessKey: 'source-only-access-key',
          accessSecret: 'source-only-access-secret',
        },
      },
    });

    expect(output.requestCount).toBe(1);
    expect(output.leaves).toEqual(
      new Map([
        [AUTHORIZATION_LOCATION, 'Basic delivered-secret'],
        [ENDPOINT_LOCATION, DESTINATION_ENDPOINT],
      ]),
    );
  });

  it('finds secrets in top-level non-http delivery fields', () => {
    expect(
      nonHttpSecretCarriersIn(
        [
          { output: { payload: JSON.stringify({ account_id: NON_HTTP_SECRET }) } },
          { batchedRequest: { payload: Buffer.from(NON_HTTP_SECRET).toString('base64') } },
        ],
        [NON_HTTP_SECRET],
      ),
    ).toEqual({ fields: ['payload'], unaddressable: false });
  });

  it('fails closed when a non-http result containing a secret has no addressable field', () => {
    expect(nonHttpSecretCarriersIn([{ output: NON_HTTP_SECRET }], [NON_HTTP_SECRET])).toEqual({
      fields: [],
      unaddressable: true,
    });
  });

  it('collapses dynamic key families to their containing object', () => {
    expect(collapseKeyFamily('params.bd[12]')).toBe('params');
    expect(collapseKeyFamily('bd[12]')).toBeNull();
    expect(collapseKeyFamily('params.fixed')).toBe('params.fixed');
  });

  it('records dynamic header evidence from destination config values', () => {
    const real = baseline({ 'req[0]|headers.x-api-key': 'real-secret' });

    expect(
      locationsForKey(
        real,
        flattened({ 'req[0]|headers.x-api-key': 'decoy-a' }),
        flattened({ 'req[0]|headers.x-api-key': 'decoy-b' }),
        'apiKeyValue',
        new Set(['x-api-key']),
      ),
    ).toEqual([{ loc: 'req[0]|headers.x-api-key', headerNameFromConfig: true }]);
  });

  it('normalizes, orders, deduplicates, and excludes endpoint paths', () => {
    expect(
      toSecretPaths([
        movement('params.z'),
        movement('endpoint'),
        movement('endpoint.token'),
        movement('body.JSON.messages.#0.token'),
        movement('params.bd[0]'),
        movement(AUTHORIZATION_PATH),
        movement('body.JSON.messages.#1.token'),
        movement('params.z'),
      ]),
    ).toEqual(['body.JSON.messages.#.token', AUTHORIZATION_PATH, 'params']);
  });

  it('collapses dynamic config-header locations when paths are emitted', () => {
    expect(
      toSecretPaths([
        { loc: 'req[0]|headers.x-api-key', headerNameFromConfig: true },
        { loc: AUTHORIZATION_LOCATION },
      ]),
    ).toEqual(['headers']);
  });

  it('reads runtime secrets only from a metadata.secret bag', () => {
    expect(
      valuesFor({ kind: 'runtime' }, { message: { properties: { secret: 'not-runtime' } } }),
    ).toEqual([]);
  });

  it('keeps fetched candidates only when they reach baseline headers or params', () => {
    const real = baseline({
      [AUTHORIZATION_LOCATION]: 'Bearer session-token',
      'req[0]|params.api_key': encodeURIComponent(PARAM_TOKEN),
      'req[0]|body.JSON.key': 'birthday',
    });

    expect(
      fetchedCredentialsOnAuthSurface(real, ['session-token', PARAM_TOKEN, 'birthday']),
    ).toEqual(['session-token', PARAM_TOKEN]);
  });

  it('serialises a direct map containing only path arrays', () => {
    expect(serialise({ EMPTY: [], MASKED: [AUTHORIZATION_PATH] })).toBe(
      '{ "EMPTY": [], "MASKED": ["headers.Authorization"] }\n',
    );
  });

  it('rejects null artifact entries', () => {
    expect(() => validateSecretPaths({ UNRESOLVED: null } as unknown as SecretPaths)).toThrow(
      'Secret paths for UNRESOLVED must be an array',
    );
  });

  it('accepts the confirmed non-http payload field', () => {
    expect(() => validateSecretPaths({ TEST: ['payload'] })).not.toThrow();
  });

  it.each([
    [{ B: [], A: [] }, 'destination keys'],
    [{ TEST: ['params.z', AUTHORIZATION_PATH] }, 'unique and sorted'],
    [{ TEST: [AUTHORIZATION_PATH, AUTHORIZATION_PATH] }, 'unique and sorted'],
    [{ TEST: ['*'] }, INVALID_PATH_MESSAGE],
    [{ TEST: ['endpoint.token'] }, INVALID_PATH_MESSAGE],
    [{ TEST: ['metadata.#.secret.accessToken'] }, INVALID_PATH_MESSAGE],
    [{ TEST: ['destinationConfig.apiKey'] }, INVALID_PATH_MESSAGE],
    [{ TEST: ['accessKey'] }, INVALID_PATH_MESSAGE],
    [{ TEST: ['headers.X*Token'] }, INVALID_PATH_MESSAGE],
  ])('rejects invalid artifact output %#', (secretPaths, message) => {
    expect(() => validateSecretPaths(secretPaths)).toThrow(message);
  });
});
