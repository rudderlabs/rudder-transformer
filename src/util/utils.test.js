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

describe('asyncHooks behaviour', () => {
  it('should propagate correctly', () => {
    const { AsyncLocalStorage } = require('async_hooks');
    const ctx = new AsyncLocalStorage();

    let count = 0;
    const someFunction = () => {
      const data = ctx.getStore();
      if (count === 0) {
        expect(data).toBe('test1');
      } else {
        expect(data).toBe('test2');
      }
      count++;
    };
    ctx.run('test1', someFunction);
    ctx.run('test2', someFunction);
  });
});

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
      expectedArgs: [new Error(`cannot use empty as IP address for ${HOST_NAME}`), null],
      expectedDnsResolvedCall: { cacheHit: true, error: false },
    },
    {
      name: 'should handle localhost address',
      mockResponse: { address: '127.0.0.1', cacheHit: true },
      expectedArgs: [new Error(`cannot use 127.0.0.1 as IP address for ${HOST_NAME}`), null],
      expectedDnsResolvedCall: { cacheHit: true, error: false },
    },
    {
      name: 'should block 0.0.0.0 (unspecified address)',
      mockResponse: { address: '0.0.0.0', cacheHit: false },
      expectedArgs: [new Error(`cannot use 0.0.0.0 as IP address for ${HOST_NAME}`), null],
      expectedDnsResolvedCall: { cacheHit: false, error: false },
    },
    {
      name: 'should block 127.x.x.x range (e.g. 127.0.0.2)',
      mockResponse: { address: '127.0.0.2', cacheHit: false },
      expectedArgs: [new Error(`cannot use 127.0.0.2 as IP address for ${HOST_NAME}`), null],
      expectedDnsResolvedCall: { cacheHit: false, error: false },
    },
    {
      name: 'should block 127.255.255.255 (end of loopback range)',
      mockResponse: { address: '127.255.255.255', cacheHit: false },
      expectedArgs: [new Error(`cannot use 127.255.255.255 as IP address for ${HOST_NAME}`), null],
      expectedDnsResolvedCall: { cacheHit: false, error: false },
    },
    {
      name: 'should allow public IP address',
      mockResponse: { address: '8.8.8.8', cacheHit: false },
      expectedArgs: [null, '8.8.8.8', RECORD_TYPE_A],
      expectedDnsResolvedCall: { cacheHit: false, error: false },
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
    await fetchWithDnsWrapper({}, 'http://example.com/api');
    const firstCallAgent = fetch.mock.calls[0][1].agent;

    await fetchWithDnsWrapper({}, 'http://example.com/other');
    const secondCallAgent = fetch.mock.calls[1][1].agent;

    expect(secondCallAgent).toBe(firstCallAgent);
  });
});

describe('blockLocalhostRequests via fetchWithDnsWrapper', () => {
  const blockedUrls = [
    { url: 'http://localhost/path', label: 'localhost' },
    { url: 'http://127.0.0.1/path', label: '127.0.0.1' },
    { url: 'http://0.0.0.0/path', label: '0.0.0.0' },
    { url: 'http://[::]/path', label: '[::]' },
    { url: 'http://[::1]/path', label: '[::1]' },
    { url: 'http://[::ffff:127.0.0.1]/path', label: '[::ffff:127.0.0.1]' },
    { url: 'http://[::ffff:7f00:1]/path', label: '[::ffff:7f00:1]' },
  ];

  blockedUrls.forEach(({ url, label }) => {
    it(`should block requests to ${label}`, async () => {
      await expect(fetchWithDnsWrapper({}, url)).rejects.toThrow(
        'localhost requests are not allowed',
      );
    });
  });

  it('should block invalid protocols', async () => {
    await expect(fetchWithDnsWrapper({}, 'ftp://example.com')).rejects.toThrow(
      'invalid protocol, only http and https are supported',
    );
  });
});
