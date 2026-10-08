import {
  Baseline,
  decoyOf,
  collapseDynamicConfigHeader,
  collapseKeyFamily,
  FlattenedOutput,
  flattenRequests,
  hasSameShape,
  locationsForKey,
  Movement,
  serialise,
  toSecretPaths,
  validateSecretPaths,
  valuesFor,
} from './generate';

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
      expect(
        [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z\d]/].findIndex((group) => group.test(character)),
      ).toBe(
        [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z\d]/].findIndex((group) => group.test(first[index])),
      );
      if (/[^A-Za-z\d]/.test(character)) expect(first[index]).toBe(character);
    });
  });

  it('requires two distinct decoy outputs before attributing a location', () => {
    const real = baseline({ 'req[0]|headers.Authorization': 'Bearer real' });
    const first = flattened({ 'req[0]|headers.Authorization': 'Bearer decoy-a' });

    expect(
      locationsForKey(
        'apiKey',
        real,
        first,
        flattened({ 'req[0]|headers.Authorization': 'Bearer decoy-b' }),
      ),
    ).toEqual([
      {
        loc: 'req[0]|headers.Authorization',
        source: 'apiKey',
        evidence: { real: 'Bearer real', decoy: 'Bearer decoy-a' },
      },
    ]);
    expect(locationsForKey('apiKey', real, first, first)).toEqual([]);
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

  it('collapses destination-configured secret header names to the containing object', () => {
    expect(collapseDynamicConfigHeader('HTTP', 'headers.x-api-key', 'apiKeyValue')).toBe('headers');
    expect(collapseDynamicConfigHeader('WEBHOOK', 'headers.test2', 'headers.to')).toBe('headers');
    expect(collapseDynamicConfigHeader('PIPEDREAM', 'headers.test2', 'headers.to')).toBe('headers');
    expect(collapseDynamicConfigHeader('HTTP', 'headers.Authorization', 'bearerToken')).toBe(
      'headers.Authorization',
    );
  });

  it('normalizes, orders, deduplicates, and excludes endpoint paths', () => {
    expect(
      toSecretPaths([
        movement('params.z'),
        movement('endpoint'),
        movement('endpoint.token'),
        movement('body.JSON.messages.#0.token'),
        movement('params.bd[0]'),
        movement('headers.Authorization'),
        movement('body.JSON.messages.#1.token'),
        movement('params.z'),
      ]),
    ).toEqual(['body.JSON.messages.#.token', 'headers.Authorization', 'params']);
  });

  it('collapses dynamic config-header locations when paths are emitted', () => {
    expect(
      toSecretPaths(
        [
          { loc: 'req[0]|headers.x-api-key', source: 'apiKeyValue' },
          { loc: 'req[0]|headers.Authorization', source: 'bearerToken' },
        ],
        'HTTP',
      ),
    ).toEqual(['headers']);
  });

  it('loads definition files lazily so pure helpers stay checkout-free', () => {
    expect(decoyOf('Abc123', 1)).toHaveLength(6);
    expect(
      valuesFor({ kind: 'runtime' }, { message: { properties: { secret: 'not-runtime' } } }),
    ).toEqual([]);
  });

  it('serialises sorted paths and JSON null without a wildcard sentinel', () => {
    expect(serialise({ EMPTY: [], UNRESOLVED: null })).toBe(
      '{\n  "EMPTY": [],\n  "UNRESOLVED": null\n}\n',
    );
  });

  it.each([
    [{ B: [], A: [] }, 'destination keys'],
    [{ TEST: ['params.z', 'headers.Authorization'] }, 'unique and sorted'],
    [{ TEST: ['headers.Authorization', 'headers.Authorization'] }, 'unique and sorted'],
    [{ TEST: ['*'] }, 'Invalid secret path'],
    [{ TEST: ['endpoint.token'] }, 'Invalid secret path'],
    [{ TEST: ['headers.X*Token'] }, 'Invalid secret path'],
  ])('rejects invalid artifact output %#', (secretPaths, message) => {
    expect(() => validateSecretPaths(secretPaths)).toThrow(message);
  });
});
