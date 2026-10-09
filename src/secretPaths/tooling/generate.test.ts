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
  serialise,
  toSecretPaths,
  validateSecretPaths,
  valuesFor,
} from './generate';

const AUTHORIZATION_LOCATION = 'req[0]|headers.Authorization';
const AUTHORIZATION_PATH = 'headers.Authorization';
const INVALID_PATH_MESSAGE = 'Invalid secret path';
const PARAM_TOKEN = 'param+token';
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
    const endpoint = 'req[0]|endpoint';
    const real = baseline({
      [endpoint]: 'https://x.example/?k=real',
      [AUTHORIZATION_LOCATION]: 'a',
    });

    expect(
      locationsForKey(
        real,
        flattened({ [endpoint]: 'https://x.example/?k=dcy1', [AUTHORIZATION_LOCATION]: 'b' }),
        flattened({ [endpoint]: 'https://x.example/?k=dcy2', [AUTHORIZATION_LOCATION]: 'c' }),
      ),
    ).toEqual([
      {
        loc: endpoint,
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
        ['req[0]|endpoint', 'https://one.example'],
        ['req[0]|headers.Authorization', 'first'],
        ['req[1]|endpoint', 'https://two.example'],
        ['req[1]|headers.Authorization', 'second'],
      ]),
    });
    expect(hasSameShape(output, flattened({ 'req[0]|endpoint': 'changed' }, 1))).toBe(false);
    expect(hasSameShape(output, flattened({ 'req[0]|endpoint': 'changed' }, 2))).toBe(false);
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
      'req[0]|headers.Authorization': 'Bearer session-token',
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

  it.each([
    [{ B: [], A: [] }, 'destination keys'],
    [{ TEST: ['params.z', AUTHORIZATION_PATH] }, 'unique and sorted'],
    [{ TEST: [AUTHORIZATION_PATH, AUTHORIZATION_PATH] }, 'unique and sorted'],
    [{ TEST: ['*'] }, INVALID_PATH_MESSAGE],
    [{ TEST: ['endpoint.token'] }, INVALID_PATH_MESSAGE],
    [{ TEST: ['headers.X*Token'] }, INVALID_PATH_MESSAGE],
  ])('rejects invalid artifact output %#', (secretPaths, message) => {
    expect(() => validateSecretPaths(secretPaths)).toThrow(message);
  });
});
