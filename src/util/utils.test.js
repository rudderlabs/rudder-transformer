jest.mock('node-fetch');
jest.mock('./stats');
jest.mock('dns', () => ({
  promises: {
    Resolver: jest.fn().mockImplementation(() => ({
      resolve4: jest.fn().mockResolvedValue([{ address: '93.184.216.34', ttl: 300 }]),
    })),
  },
}));

// BLOCK_IP_RANGES is additive on top of the always-on core. Set it before utils
// is required (the denylist is built at module load) to exercise the
// config-appended ranges. The core ranges (loopback, metadata, unspecified,
// link-local) are deliberately omitted here, so the cases that rely on them also
// prove the core blocks with no configuration.
process.env.BLOCK_IP_RANGES =
  '10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,100.64.0.0/10,fc00::/7,255.255.255.255/32';
process.env.BLOCK_HOST_NAMES = 'blocked.example.com';

const fetch = require('node-fetch');
const stats = require('./stats');
const {
  staticLookup,
  dnsCallbackStorage,
  fetchWithDnsWrapper,
  isBlockedIP,
  ssrfSafeAgentFactory,
} = require('./utils');

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
      mockResponse: { address: '1.1.1.1', cacheHit: true },
      expectedArgs: [null, '1.1.1.1', RECORD_TYPE_A],
      expectedDnsResolvedCall: { cacheHit: true, error: false },
    },
    {
      name: 'should resolve the hostname and return the IP address with all option',
      options: { all: true },
      mockResponse: { address: '1.1.1.1', cacheHit: true },
      expectedArgs: [null, [{ address: '1.1.1.1', family: RECORD_TYPE_A }]],
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
    {
      name: 'should block RFC1918 private 10.0.0.0/8 (e.g. 10.1.2.3)',
      mockResponse: { address: '10.1.2.3', cacheHit: false },
      expectedArgs: [new Error(`cannot use 10.1.2.3 as IP address for ${HOST_NAME}`), null],
      expectedDnsResolvedCall: { cacheHit: false, error: false },
    },
    {
      name: 'should block RFC1918 private 172.16.0.0/12 (e.g. 172.16.5.5)',
      mockResponse: { address: '172.16.5.5', cacheHit: false },
      expectedArgs: [new Error(`cannot use 172.16.5.5 as IP address for ${HOST_NAME}`), null],
      expectedDnsResolvedCall: { cacheHit: false, error: false },
    },
    {
      name: 'should block RFC1918 private 192.168.0.0/16 (e.g. 192.168.1.1)',
      mockResponse: { address: '192.168.1.1', cacheHit: false },
      expectedArgs: [new Error(`cannot use 192.168.1.1 as IP address for ${HOST_NAME}`), null],
      expectedDnsResolvedCall: { cacheHit: false, error: false },
    },
    {
      name: 'should block link-local cloud metadata 169.254.169.254 (DNS rebinding)',
      mockResponse: { address: '169.254.169.254', cacheHit: false },
      expectedArgs: [new Error(`cannot use 169.254.169.254 as IP address for ${HOST_NAME}`), null],
      expectedDnsResolvedCall: { cacheHit: false, error: false },
    },
    {
      name: 'should block carrier-grade NAT 100.64.0.0/10 (e.g. 100.64.0.1)',
      mockResponse: { address: '100.64.0.1', cacheHit: false },
      expectedArgs: [new Error(`cannot use 100.64.0.1 as IP address for ${HOST_NAME}`), null],
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
        agent: expect.any(Function),
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
  // Localhost / internal literals are now blocked by the IP-layer guard
  // (see the ssrfSafeAgentFactory and staticLookup suites), not here.
  it('should block denylisted hostnames (BLOCK_HOST_NAMES)', async () => {
    await expect(fetchWithDnsWrapper({}, 'http://blocked.example.com/path')).rejects.toThrow(
      'blocked host requests are not allowed',
    );
  });

  it('should block invalid protocols', async () => {
    await expect(fetchWithDnsWrapper({}, 'ftp://example.com')).rejects.toThrow(
      'invalid protocol, only http and https are supported',
    );
  });
});

describe('isBlockedIP', () => {
  it.each([
    // loopback / unspecified / broadcast
    ['127.0.0.1', true],
    ['127.255.255.255', true],
    ['0.0.0.0', true],
    ['255.255.255.255', true],
    // RFC1918 private
    ['10.1.2.3', true],
    ['172.16.5.5', true],
    ['192.168.1.1', true],
    // link-local (cloud metadata) + carrier-grade NAT
    ['169.254.169.254', true],
    ['100.64.0.1', true],
    // alternate encodings normalize before matching
    ['2130706433', true], // decimal form of 127.0.0.1
    // IPv6 internal + IPv4-mapped loopback
    ['::1', true],
    ['fe80::1', true],
    ['fc00::1', true],
    ['::ffff:127.0.0.1', true],
    // unparsable / empty fail closed
    ['', true],
    ['not-an-ip', true],
    // public unicast is allowed
    ['8.8.8.8', false],
    ['1.1.1.1', false],
    ['142.250.80.46', false],
    ['2606:4700:4700::1111', false],
    ['2001:4860:4860::8888', false],
  ])('classifies %s as blocked=%s', (ip, blocked) => {
    expect(isBlockedIP(ip)).toBe(blocked);
  });
});

describe('ssrfSafeAgentFactory', () => {
  const http = require('http');
  const https = require('https');
  const url = (str) => new URL(str);

  it('throws for non-http(s) protocols', () => {
    expect(() => ssrfSafeAgentFactory(url('ftp://example.com'))).toThrow(
      'invalid protocol, only http and https are supported',
    );
  });

  it.each([
    'http://127.0.0.1:9090/health', // the redirect-target exploit
    'http://169.254.169.254/latest/meta-data/', // cloud metadata
    'https://10.0.0.5/internal',
    'http://192.168.1.1/admin',
    'http://[::1]/', // IPv6 literal (brackets stripped)
    'http://[::ffff:127.0.0.1]/', // bracketed IPv4-mapped loopback (strip + unwrap)
    'http://2130706433/', // decimal-encoded loopback
  ])('blocks literal internal address %s', (target) => {
    expect(() => ssrfSafeAgentFactory(url(target))).toThrow(
      'blocked request to non-public address',
    );
  });

  it('returns the https agent for public https URLs', () => {
    expect(ssrfSafeAgentFactory(url('https://example.com/api'))).toBeInstanceOf(https.Agent);
  });

  it('returns the http agent for public http URLs', () => {
    expect(ssrfSafeAgentFactory(url('http://8.8.8.8/api'))).toBeInstanceOf(http.Agent);
  });

  it('defers hostname validation to DNS lookup (does not throw for names)', () => {
    expect(() => ssrfSafeAgentFactory(url('https://example.com/api'))).not.toThrow();
  });

  it('returns a stable agent instance across calls (per scheme)', () => {
    const a = ssrfSafeAgentFactory(url('https://a.example.com'));
    const b = ssrfSafeAgentFactory(url('https://b.example.com'));
    expect(a).toBe(b);
  });
});
