jest.mock('node-fetch');
jest.mock('./stats');
jest.mock('dns', () => ({
  promises: {
    Resolver: jest.fn().mockImplementation(() => ({
      resolve4: jest.fn().mockResolvedValue([{ address: '93.184.216.34', ttl: 300 }]),
    })),
  },
}));

const fetch = require('node-fetch');
const stats = require('./stats');
const { staticLookup, dnsCallbackStorage, fetchWithDnsWrapper } = require('./utils');

describe('staticLookup', () => {
  const RECORD_TYPE_A = 4;
  const HOST_NAME = 'example.com';
  const fetchAddressFromHostName = jest.fn();
  const onDnsResolved = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    {
      name: 'should resolve the hostname and return the IP address',
      mockResponse: { address: '192.168.1.1', cacheHit: true },
      expectedArgs: [null, '192.168.1.1', RECORD_TYPE_A],
      expectedDnsResolvedCall: { cacheHit: true, error: false },
    },
    {
      name: 'should resolve the hostname and return the IP address with all option',
      options: { all: true },
      mockResponse: { address: '192.168.1.1', cacheHit: true },
      expectedArgs: [null, [{ address: '192.168.1.1', family: RECORD_TYPE_A }]],
      expectedDnsResolvedCall: { cacheHit: true, error: false },
    },
    {
      name: 'should handle errors from fetchAddressFromHostName',
      mockResponse: { error: 'DNS error', errorCode: 'ENOTFOUND' },
      expectedArgs: [new Error(`unable to resolve IP address for ${HOST_NAME}`), null],
      expectedDnsResolvedCall: { cacheHit: false, error: true },
    },
    {
      name: 'should handle empty address',
      mockResponse: { address: '', cacheHit: true },
      expectedArgs: [new Error(`resolved empty list of IP address for ${HOST_NAME}`), null],
      expectedDnsResolvedCall: { cacheHit: true, error: false },
    },
    {
      name: 'should handle localhost address',
      mockResponse: { address: '127.0.0.1', cacheHit: true },
      expectedArgs: [new Error(`cannot use 127.0.0.1 as IP address`), null],
      expectedDnsResolvedCall: { cacheHit: true, error: false },
    },
  ];

  testCases.forEach(({ name, options, mockResponse, expectedArgs, expectedDnsResolvedCall }) => {
    it(name, async () => {
      if (mockResponse.error) {
        const error = new Error(mockResponse.error);
        error.code = mockResponse.errorCode;
        fetchAddressFromHostName.mockRejectedValueOnce(error);
      } else {
        fetchAddressFromHostName.mockResolvedValueOnce(mockResponse);
      }

      const resolve = staticLookup(fetchAddressFromHostName);
      const callback = (...args) => {
        expect(fetchAddressFromHostName).toHaveBeenCalledWith(HOST_NAME);
        expect(args).toEqual(expectedArgs);
        expect(onDnsResolved).toHaveBeenCalledWith(
          expect.objectContaining(expectedDnsResolvedCall),
        );
      };

      dnsCallbackStorage.run(onDnsResolved, () => {
        resolve(HOST_NAME, options, callback);
      });
    });
  });
});

describe('fetchWithDnsWrapper', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    fetch.mockResolvedValue({ ok: true, status: 200 });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should set up onDnsResolved callback that calls stats.timing with transformation tags', async () => {
    process.env.DNS_RESOLVE_FETCH_HOST = 'true';
    const transformationTags = { workspaceId: 'ws123', transformationId: 'tr456' };

    // Capture the callback stored in dnsCallbackStorage during the fetch
    let capturedCallback;
    const originalRun = dnsCallbackStorage.run.bind(dnsCallbackStorage);
    jest.spyOn(dnsCallbackStorage, 'run').mockImplementation((callback, fn) => {
      capturedCallback = callback;
      return originalRun(callback, fn);
    });

    await fetchWithDnsWrapper(transformationTags, 'https://example.com/api');

    // Simulate DNS resolution callback
    capturedCallback({ resolveStartTime: new Date(), cacheHit: true, error: false });

    expect(stats.timing).toHaveBeenCalledWith(
      'fetch_dns_resolve_time',
      expect.any(Date),
      expect.objectContaining({
        workspaceId: 'ws123',
        transformationId: 'tr456',
        cacheHit: true,
      }),
    );
  });

  it('should use shared https agent for https URLs', async () => {
    process.env.DNS_RESOLVE_FETCH_HOST = 'true';

    await fetchWithDnsWrapper({}, 'https://example.com/api');

    expect(fetch).toHaveBeenCalledWith(
      'https://example.com/api',
      expect.objectContaining({
        agent: expect.any(Object),
      }),
    );

    const firstCallAgent = fetch.mock.calls[0][1].agent;

    await fetchWithDnsWrapper({}, 'https://example.com/other');

    const secondCallAgent = fetch.mock.calls[1][1].agent;
    expect(secondCallAgent).toBe(firstCallAgent);
  });

  it('should use shared http agent for http URLs', async () => {
    process.env.DNS_RESOLVE_FETCH_HOST = 'true';

    await fetchWithDnsWrapper({}, 'http://example.com/api');
    const firstCallAgent = fetch.mock.calls[0][1].agent;

    await fetchWithDnsWrapper({}, 'http://example.com/other');
    const secondCallAgent = fetch.mock.calls[1][1].agent;

    expect(secondCallAgent).toBe(firstCallAgent);
  });

  it('should bypass DNS wrapper when DNS_RESOLVE_FETCH_HOST is not true', async () => {
    process.env.DNS_RESOLVE_FETCH_HOST = 'false';

    await fetchWithDnsWrapper({}, 'https://example.com/api');

    expect(fetch).toHaveBeenCalledWith('https://example.com/api');
    expect(stats.timing).not.toHaveBeenCalled();
  });
});
