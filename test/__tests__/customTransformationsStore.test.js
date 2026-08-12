jest.mock('../../src/util/fetch', () => ({ fetchWithProxy: jest.fn() }));
jest.mock('../../src/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

const okResponse = (body) => ({ status: 200, json: async () => body });
const statusResponse = (status) => ({ status, json: async () => ({}) });

// The store reads its TTL and constructs its caches at module load, so every scenario needs a
// fresh copy of the module -- and fresh handles on the mocks that copy closed over, since
// isolateModules re-runs each jest.mock factory and produces new jest.fn()s.
const loadStore = () => {
  let store;
  let fetchWithProxy;
  let logger;
  jest.isolateModules(() => {
    store = require('../../src/util/customTransformationsStore');
    ({ fetchWithProxy } = require('../../src/util/fetch'));
    logger = require('../../src/logger');
  });
  return { ...store, fetchWithProxy, logger };
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

describe('custom transformation store caching', () => {
  it('caches the transformation, so a repeated versionId does not refetch', async () => {
    const { getTransformationCode, fetchWithProxy } = loadStore();
    fetchWithProxy.mockResolvedValue(okResponse({ code: 'transformation-code' }));

    const first = await getTransformationCode('tr-1');
    const second = await getTransformationCode('tr-1');

    expect(first).toEqual({ code: 'transformation-code' });
    expect(second).toEqual(first);
    expect(fetchWithProxy).toHaveBeenCalledTimes(1);
  });

  it('caches the library, so a repeated versionId does not refetch', async () => {
    const { getLibraryCode, fetchWithProxy } = loadStore();
    fetchWithProxy.mockResolvedValue(okResponse({ name: 'lib', code: 'library-code' }));

    const first = await getLibraryCode('lib-1');
    const second = await getLibraryCode('lib-1');

    expect(first).toEqual({ name: 'lib', code: 'library-code' });
    expect(second).toEqual(first);
    expect(fetchWithProxy).toHaveBeenCalledTimes(1);
  });

  it('caches the rudder library, so a repeated importName does not refetch', async () => {
    const { getRudderLibByImportName, fetchWithProxy } = loadStore();
    fetchWithProxy.mockResolvedValue(okResponse({ importName: '@rs/lib/v1', code: 'rudder-code' }));

    const first = await getRudderLibByImportName('@rs/lib/v1');
    const second = await getRudderLibByImportName('@rs/lib/v1');

    expect(first).toEqual({ importName: '@rs/lib/v1', code: 'rudder-code' });
    expect(second).toEqual(first);
    expect(fetchWithProxy).toHaveBeenCalledTimes(1);
  });

  // Transformations and libraries are both keyed by versionId. They must not share a cache,
  // otherwise whichever is fetched first would be served for the other.
  it('keeps transformations and libraries apart when they share a versionId', async () => {
    const { getTransformationCode, getLibraryCode, fetchWithProxy } = loadStore();
    const sharedVersionId = 'same-version-id';

    fetchWithProxy.mockResolvedValueOnce(okResponse({ code: 'transformation-code' }));
    const transformation = await getTransformationCode(sharedVersionId);

    fetchWithProxy.mockResolvedValueOnce(okResponse({ name: 'lib', code: 'library-code' }));
    const library = await getLibraryCode(sharedVersionId);

    expect(transformation).toEqual({ code: 'transformation-code' });
    expect(library).toEqual({ name: 'lib', code: 'library-code' });
    expect(fetchWithProxy).toHaveBeenCalledTimes(2);
  });

  // A body the backend legitimately returns as falsy must still count as a cache hit, otherwise
  // that key refetches on every single call for as long as the process lives.
  it('caches a falsy response body instead of treating it as a miss', async () => {
    const { getTransformationCode, fetchWithProxy } = loadStore();
    fetchWithProxy.mockResolvedValue(okResponse(null));

    expect(await getTransformationCode('tr-null')).toBeNull();
    expect(await getTransformationCode('tr-null')).toBeNull();

    expect(fetchWithProxy).toHaveBeenCalledTimes(1);
  });

  it('coalesces concurrent lookups of the same key into a single request', async () => {
    const { getTransformationCode, fetchWithProxy } = loadStore();
    let resolveFetch;
    fetchWithProxy.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );

    // Both calls are issued before the fetch settles, so the second must join the first.
    const first = getTransformationCode('tr-concurrent');
    const second = getTransformationCode('tr-concurrent');
    resolveFetch(okResponse({ code: 'transformation-code' }));

    expect(await first).toEqual({ code: 'transformation-code' });
    expect(await second).toEqual({ code: 'transformation-code' });
    expect(fetchWithProxy).toHaveBeenCalledTimes(1);
  });
});

describe('config backend request URLs', () => {
  const urlCases = [
    {
      name: 'transformation',
      fetchCode: (store) => store.getTransformationCode('tr-1'),
      expectedPath: '/transformation/getByVersionId?versionId=tr-1',
    },
    {
      name: 'library',
      fetchCode: (store) => store.getLibraryCode('lib-1'),
      expectedPath: '/transformationLibrary/getByVersionId?versionId=lib-1',
    },
    {
      // `@rs/lib/v1` is split into a name path segment and a version query param.
      name: 'rudder library',
      fetchCode: (store) => store.getRudderLibByImportName('@rs/lib/v1'),
      expectedPath: '/rudderstackTransformationLibraries/lib?version=v1',
    },
  ];

  it.each(urlCases)('requests the $name from $expectedPath', async ({ fetchCode, expectedPath }) => {
    const store = loadStore();
    store.fetchWithProxy.mockResolvedValue(okResponse({ code: 'some-code' }));

    await fetchCode(store);

    expect(store.fetchWithProxy).toHaveBeenCalledWith(
      `${store.CONFIG_BACKEND_URL}${expectedPath}`,
      expect.any(Object),
    );
  });
});

describe('config backend failures', () => {
  const failureCases = [
    {
      name: '401 unauthorized',
      response: statusResponse(401),
      expectedError: /Config backend returned 401 while fetching Transformation :: tr-fail/,
    },
    {
      name: '403 forbidden',
      response: statusResponse(403),
      expectedError: /Config backend returned 403 while fetching Transformation :: tr-fail/,
    },
    {
      name: '500 server error',
      response: statusResponse(500),
      expectedError: /Error occurred while fetching Transformation :: tr-fail/,
    },
    {
      name: '404 not found',
      response: statusResponse(404),
      expectedError: /Transformation not found at .*versionId=tr-fail/,
    },
  ];

  it.each(failureCases)('propagates a $name', async ({ response, expectedError }) => {
    const { getTransformationCode, fetchWithProxy } = loadStore();
    fetchWithProxy.mockResolvedValue(response);

    await expect(getTransformationCode('tr-fail')).rejects.toThrow(expectedError);
  });

  it('propagates a network failure', async () => {
    const { getTransformationCode, fetchWithProxy } = loadStore();
    fetchWithProxy.mockRejectedValue(new Error('ECONNREFUSED'));

    await expect(getTransformationCode('tr-fail')).rejects.toThrow('ECONNREFUSED');
  });

  it('propagates a malformed JSON body', async () => {
    const { getTransformationCode, fetchWithProxy } = loadStore();
    fetchWithProxy.mockResolvedValue({
      status: 200,
      json: async () => {
        throw new SyntaxError('Unexpected token < in JSON');
      },
    });

    await expect(getTransformationCode('tr-fail')).rejects.toThrow('Unexpected token < in JSON');
  });

  it('logs the failure with the versionId that caused it', async () => {
    const { getTransformationCode, fetchWithProxy, logger } = loadStore();
    fetchWithProxy.mockRejectedValue(new Error('ECONNREFUSED'));

    await expect(getTransformationCode('tr-fail')).rejects.toThrow('ECONNREFUSED');

    expect(logger.error).toHaveBeenCalledWith(
      'Error fetching transformation code for versionId: tr-fail',
      'ECONNREFUSED',
    );
  });

  // A failed fetch must not be cached -- otherwise one transient outage would keep the key
  // broken for the rest of the TTL.
  it('does not cache a failure, so the next call retries', async () => {
    const { getTransformationCode, fetchWithProxy } = loadStore();
    fetchWithProxy.mockRejectedValueOnce(new Error('ECONNREFUSED'));

    await expect(getTransformationCode('tr-retry')).rejects.toThrow('ECONNREFUSED');

    fetchWithProxy.mockResolvedValueOnce(okResponse({ code: 'transformation-code' }));
    expect(await getTransformationCode('tr-retry')).toEqual({ code: 'transformation-code' });
    expect(fetchWithProxy).toHaveBeenCalledTimes(2);
  });

  it('does not leave a failed fetch in flight, blocking later callers', async () => {
    const { getLibraryCode, fetchWithProxy } = loadStore();
    fetchWithProxy.mockRejectedValueOnce(new Error('ECONNREFUSED'));

    await expect(getLibraryCode('lib-retry')).rejects.toThrow('ECONNREFUSED');

    fetchWithProxy.mockResolvedValueOnce(okResponse({ code: 'library-code' }));
    expect(await getLibraryCode('lib-retry')).toEqual({ code: 'library-code' });
  });
});

describe('cache TTL configuration via TRANSFORMATION_STORE_CACHE_TTL_SECONDS', () => {
  const savedTtl = process.env.TRANSFORMATION_STORE_CACHE_TTL_SECONDS;

  // Each of these parses in a way that would silently break the cache if passed to NodeCache:
  // 'abc' becomes NaN ("never expires"), '-1' makes every entry expire on write, and parseInt
  // truncates '1e10'/'1h' to a 1 second TTL.
  const invalidTtls = ['abc', '-1', '1e10', '1h', '1.5', ' '];

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    if (savedTtl === undefined) {
      delete process.env.TRANSFORMATION_STORE_CACHE_TTL_SECONDS;
    } else {
      process.env.TRANSFORMATION_STORE_CACHE_TTL_SECONDS = savedTtl;
    }
  });

  it('serves from cache while the configured TTL has not elapsed', async () => {
    process.env.TRANSFORMATION_STORE_CACHE_TTL_SECONDS = '60';
    const { getTransformationCode, fetchWithProxy } = loadStore();
    fetchWithProxy.mockResolvedValue(okResponse({ code: 'transformation-code' }));

    await getTransformationCode('tr-ttl');
    jest.advanceTimersByTime(59 * 1000);
    await getTransformationCode('tr-ttl');

    expect(fetchWithProxy).toHaveBeenCalledTimes(1);
  });

  it('refetches once the configured TTL has elapsed', async () => {
    process.env.TRANSFORMATION_STORE_CACHE_TTL_SECONDS = '60';
    const { getTransformationCode, fetchWithProxy } = loadStore();
    fetchWithProxy.mockResolvedValue(okResponse({ code: 'transformation-code' }));

    await getTransformationCode('tr-ttl');
    jest.advanceTimersByTime(61 * 1000);
    await getTransformationCode('tr-ttl');

    expect(fetchWithProxy).toHaveBeenCalledTimes(2);
  });

  it('applies the configured TTL to libraries and rudder libraries as well', async () => {
    process.env.TRANSFORMATION_STORE_CACHE_TTL_SECONDS = '60';
    const { getLibraryCode, getRudderLibByImportName, fetchWithProxy } = loadStore();
    fetchWithProxy.mockResolvedValue(okResponse({ code: 'library-code' }));

    await getLibraryCode('lib-ttl');
    await getRudderLibByImportName('@rs/lib/v1');
    expect(fetchWithProxy).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(59 * 1000);
    await getLibraryCode('lib-ttl');
    await getRudderLibByImportName('@rs/lib/v1');
    expect(fetchWithProxy).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(2 * 1000);
    await getLibraryCode('lib-ttl');
    await getRudderLibByImportName('@rs/lib/v1');
    expect(fetchWithProxy).toHaveBeenCalledTimes(4);
  });

  it('falls back to a 24h TTL when the env var is unset', async () => {
    delete process.env.TRANSFORMATION_STORE_CACHE_TTL_SECONDS;
    const { getTransformationCode, fetchWithProxy } = loadStore();
    fetchWithProxy.mockResolvedValue(okResponse({ code: 'transformation-code' }));

    await getTransformationCode('tr-default');
    jest.advanceTimersByTime(ONE_DAY_MS - 60 * 1000);
    await getTransformationCode('tr-default');
    expect(fetchWithProxy).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(2 * 60 * 1000);
    await getTransformationCode('tr-default');
    expect(fetchWithProxy).toHaveBeenCalledTimes(2);
  });

  // parseInt on an explicit '0' yields a falsy 0, so a `||` fallback would silently replace it
  // with the default. NodeCache treats stdTTL 0 as "never expire".
  it('treats an explicit 0 as no expiry rather than falling back to the default', async () => {
    process.env.TRANSFORMATION_STORE_CACHE_TTL_SECONDS = '0';
    const { getTransformationCode, fetchWithProxy } = loadStore();
    fetchWithProxy.mockResolvedValue(okResponse({ code: 'transformation-code' }));

    await getTransformationCode('tr-forever');
    jest.advanceTimersByTime(10 * ONE_DAY_MS);
    await getTransformationCode('tr-forever');

    expect(fetchWithProxy).toHaveBeenCalledTimes(1);
  });

  // Asserting on both sides of the 24h boundary rules out every silent failure mode at once:
  // a still-cached entry proves the TTL was not truncated to seconds or negated, and an expiring
  // one proves it did not become NaN.
  it.each(invalidTtls)('falls back to the default TTL when set to %p', async (invalidTtl) => {
    process.env.TRANSFORMATION_STORE_CACHE_TTL_SECONDS = invalidTtl;
    const { getTransformationCode, fetchWithProxy } = loadStore();
    fetchWithProxy.mockResolvedValue(okResponse({ code: 'transformation-code' }));

    await getTransformationCode('tr-invalid');
    jest.advanceTimersByTime(ONE_DAY_MS - 60 * 1000);
    await getTransformationCode('tr-invalid');
    expect(fetchWithProxy).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(2 * 60 * 1000);
    await getTransformationCode('tr-invalid');
    expect(fetchWithProxy).toHaveBeenCalledTimes(2);
  });

  it.each(invalidTtls)('warns that %p was ignored', (invalidTtl) => {
    process.env.TRANSFORMATION_STORE_CACHE_TTL_SECONDS = invalidTtl;
    const { logger } = loadStore();

    expect(logger.warn).toHaveBeenCalledWith(
      `Ignoring invalid TRANSFORMATION_STORE_CACHE_TTL_SECONDS "${invalidTtl}": expected a non-negative integer`,
    );
  });

  it('does not warn about a valid TTL', () => {
    process.env.TRANSFORMATION_STORE_CACHE_TTL_SECONDS = '60';
    const { logger } = loadStore();

    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Transformation store cache TTL: 60s');
  });

  it('reports no expiry in the startup log when the TTL is 0', () => {
    process.env.TRANSFORMATION_STORE_CACHE_TTL_SECONDS = '0';
    const { logger } = loadStore();

    expect(logger.info).toHaveBeenCalledWith('Transformation store cache TTL: 0s (no expiry)');
  });
});
