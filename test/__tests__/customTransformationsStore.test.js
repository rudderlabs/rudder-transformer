jest.mock('../../src/util/fetch', () => ({ fetchWithProxy: jest.fn() }));

const okResponse = (body) => ({ status: 200, json: async () => body });

// The store reads its TTL and constructs its caches at module load, so every scenario needs a
// fresh copy of the module -- and a fresh handle on the fetch mock that copy closed over, since
// isolateModules re-runs the jest.mock factory and produces a new jest.fn().
const loadStore = () => {
  let store;
  let fetchWithProxy;
  jest.isolateModules(() => {
    store = require('../../src/util/customTransformationsStore');
    ({ fetchWithProxy } = require('../../src/util/fetch'));
  });
  return { ...store, fetchWithProxy };
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
});

describe('cache TTL configuration via TRANSFORMATION_STORE_CACHE_TTL_SECONDS', () => {
  const savedTtl = process.env.TRANSFORMATION_STORE_CACHE_TTL_SECONDS;

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

    jest.advanceTimersByTime(61 * 1000);
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
});
