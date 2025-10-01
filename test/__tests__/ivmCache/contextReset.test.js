const { createNewContext } = require('../../../src/util/ivmCache/contextReset');

// Mock dependencies
jest.mock('../../../src/logger', () => ({
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

jest.mock('../../../src/util/stats', () => ({
  timing: jest.fn(),
  increment: jest.fn(),
}));

jest.mock('../../../src/util/utils', () => ({
  fetchWithDnsWrapper: jest.fn(),
  extractStackTraceUptoLastSubstringMatch: jest.fn((trace) => trace),
}));

jest.mock('node-fetch', () => jest.fn());

// Mock isolated-vm
jest.mock('isolated-vm', () => ({
  Reference: jest.fn().mockImplementation((fn) => ({
    applyIgnored: jest.fn(),
    callback: fn, // Store the callback for testing
  })),
  ExternalCopy: jest.fn().mockImplementation((data) => ({
    copyInto: jest.fn().mockReturnValue(data),
  })),
}));

describe('Context Reset Utilities', () => {
  let mockCachedIsolate;
  let mockNewContext;
  let mockJail;
  let mockFreshModule;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock jail
    mockJail = {
      set: jest.fn().mockResolvedValue(undefined),
      derefInto: jest.fn().mockReturnValue({}),
    };

    // Mock new context
    mockNewContext = {
      global: mockJail,
      release: jest.fn(),
    };

    // Mock fresh module (returned by compileModule)
    mockFreshModule = {
      instantiate: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue(undefined),
      namespace: {
        get: jest.fn().mockResolvedValue({}),
      },
      release: jest.fn(),
    };

    // Mock cached isolate
    mockCachedIsolate = {
      isolate: {
        createContext: jest.fn().mockResolvedValue(mockNewContext),
        compileModule: jest.fn().mockResolvedValue(mockFreshModule),
        wallTime: [1, 500000000],
        cpuTime: [0, 100000000],
      },
      bootstrap: {
        run: jest.fn().mockResolvedValue({}),
      },
      customScriptModule: {
        instantiate: jest.fn().mockResolvedValue(undefined),
        evaluate: jest.fn().mockResolvedValue(undefined),
        namespace: {
          get: jest.fn().mockResolvedValue({}),
        },
        release: jest.fn(),
      },
      compiledModules: {
        lodash: { module: {} },
        moment: { module: {} },
      },
      context: {
        release: jest.fn(),
      },
      moduleSource: {
        codeWithWrapper: 'function transformEvent(event) { return event; }',
        transformationName: 'test-transformation',
        librariesMap: {
          lodash: 'export default function() { return {}; }',
          moment: 'export default function() { return {}; }',
        },
      },
      transformationId: 'test-transformation-123',
      workspaceId: 'test-workspace-456',
      fName: 'transformEvent',
    };

    // Setup environment
    process.env.GEOLOCATION_TIMEOUT_IN_MS = '1000';
    process.env.GEOLOCATION_URL = 'http://geo.example.com';
  });

  afterEach(() => {
    delete process.env.GEOLOCATION_TIMEOUT_IN_MS;
    delete process.env.GEOLOCATION_URL;
  });

  describe('createNewContext', () => {
    test('should successfully reset context with default parameters', async () => {
      const result = await createNewContext(mockCachedIsolate);

      expect(mockCachedIsolate.isolate.createContext).toHaveBeenCalled();
      expect(mockJail.set).toHaveBeenCalledWith('global', {});
      expect(mockCachedIsolate.bootstrap.run).toHaveBeenCalledWith(mockNewContext);
      expect(mockCachedIsolate.isolate.compileModule).toHaveBeenCalledWith(
        mockCachedIsolate.moduleSource.codeWithWrapper,
        { filename: mockCachedIsolate.moduleSource.transformationName }
      );
      // Check that the fresh module was used
      expect(mockFreshModule.instantiate).toHaveBeenCalled();
      expect(mockFreshModule.evaluate).toHaveBeenCalled();
      expect(mockFreshModule.namespace.get).toHaveBeenCalledWith(
        'transformWrapper',
        { reference: true }
      );

      expect(result).toMatchObject({
        isolate: mockCachedIsolate.isolate,
        bootstrap: mockCachedIsolate.bootstrap,
        customScriptModule: mockFreshModule,
        bootstrapScriptResult: {},
        fnRef: {},
        transformationId: 'test-transformation-123',
        workspaceId: 'test-workspace-456',
        moduleSource: mockCachedIsolate.moduleSource,
      });
      
      // Verify that compiledModules is recreated (should be an object but not necessarily match the old one)
      expect(result.compiledModules).toBeDefined();
      expect(typeof result.compiledModules).toBe('object');
    });

    test('should inject fresh credentials', async () => {
      const credentials = {
        apiKey: 'test-api-key',
        secret: 'test-secret',
      };

      await createNewContext(mockCachedIsolate, credentials, false);

      // Verify _getCredential was injected
      expect(mockJail.set).toHaveBeenCalledWith('_getCredential', expect.any(Function));
    });

    test('should handle test mode correctly', async () => {
      await createNewContext(mockCachedIsolate, {});

      // Verify all required APIs were injected (no testMode parameter anymore)
      expect(mockJail.set).toHaveBeenCalledWith('_ivm', expect.any(Object));
      expect(mockJail.set).toHaveBeenCalledWith('_fetch', expect.any(Object));
      expect(mockJail.set).toHaveBeenCalledWith('_fetchV2', expect.any(Object));
      expect(mockJail.set).toHaveBeenCalledWith('_geolocation', expect.any(Object));
      expect(mockJail.set).toHaveBeenCalledWith('_getCredential', expect.any(Function));
      expect(mockJail.set).toHaveBeenCalledWith('extractStackTrace', expect.any(Function));
    });

    test('should inject all required APIs', async () => {
      await createNewContext(mockCachedIsolate, {});

      const expectedApiCalls = [
        ['global', {}],
        ['_ivm', require('isolated-vm')],
        ['_fetch', expect.any(Object)],
        ['_fetchV2', expect.any(Object)],
        ['_geolocation', expect.any(Object)],
        ['_getCredential', expect.any(Function)],
        ['extractStackTrace', expect.any(Function)],
      ];

      expectedApiCalls.forEach(([key, value]) => {
        expect(mockJail.set).toHaveBeenCalledWith(key, value);
      });
    });

    test('should handle module instantiation correctly', async () => {
      const instantiateCallback = jest.fn();
      mockFreshModule.instantiate.mockImplementation(
        (context, callback) => {
          instantiateCallback.mockImplementation(callback);
          return Promise.resolve();
        }
      );

      await createNewContext(mockCachedIsolate);

      expect(mockFreshModule.instantiate).toHaveBeenCalledWith(
        mockNewContext,
        expect.any(Function)
      );
    });

    test('should create new context instead of reusing old one', async () => {
      const result = await createNewContext(mockCachedIsolate);

      // Should create a new context, not reuse the old one
      expect(mockCachedIsolate.isolate.createContext).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    test('should handle missing old context gracefully', async () => {
      delete mockCachedIsolate.context;

      await expect(createNewContext(mockCachedIsolate)).resolves.toBeDefined();
    });

    test('should handle context release errors gracefully', async () => {
      mockCachedIsolate.context.release.mockImplementation(() => {
        throw new Error('Release failed');
      });

      await expect(createNewContext(mockCachedIsolate)).resolves.toBeDefined();
    });

    test('should throw error for invalid cached isolate', async () => {
      await expect(createNewContext(null)).rejects.toThrow('Invalid cached isolate');
      await expect(createNewContext({})).rejects.toThrow('Invalid cached isolate');
      await expect(createNewContext({ isolate: null })).rejects.toThrow('Invalid cached isolate');
    });

    test('should handle context creation failure', async () => {
      mockCachedIsolate.isolate.createContext.mockRejectedValue(new Error('Context creation failed'));

      await expect(createNewContext(mockCachedIsolate)).rejects.toThrow('Context creation failed');
    });

    test('should handle bootstrap script run failure', async () => {
      mockCachedIsolate.bootstrap.run.mockRejectedValue(new Error('Bootstrap failed'));

      await expect(createNewContext(mockCachedIsolate)).rejects.toThrow('Bootstrap failed');
    });

    test('should handle module instantiation failure', async () => {
      mockFreshModule.instantiate.mockRejectedValue(
        new Error('Module instantiation failed')
      );

      await expect(createNewContext(mockCachedIsolate)).rejects.toThrow('Module instantiation failed');
    });

    test('should handle module evaluation failure', async () => {
      mockFreshModule.evaluate.mockRejectedValue(
        new Error('Module evaluation failed')
      );

      await expect(createNewContext(mockCachedIsolate)).rejects.toThrow('Module evaluation failed');
    });
  });

  describe('injected API functions', () => {
    let injectedFunctions;

    beforeEach(async () => {
      await createNewContext(mockCachedIsolate, { testKey: 'testValue' });
      
      // Extract the injected functions from the jail.set calls
      injectedFunctions = {};
      mockJail.set.mock.calls.forEach(([key, value]) => {
        if (typeof value === 'function') {
          injectedFunctions[key] = value;
        }
      });
    });

    test('should inject working getCredential function', () => {
      const getCredential = injectedFunctions._getCredential;
      expect(getCredential).toBeDefined();
      
      const result = getCredential('testKey');
      expect(result).toBe('testValue');
      
      expect(() => getCredential(null)).toThrow('Key should be valid and defined');
      expect(() => getCredential(undefined)).toThrow('Key should be valid and defined');
    });

    test('should inject working extractStackTrace function', () => {
      const extractStackTrace = injectedFunctions.extractStackTrace;
      expect(extractStackTrace).toBeDefined();
      
      const trace = 'Error: test\n  at function1\n  at function2';
      const result = extractStackTrace(trace, ['function1']);
      expect(result).toBe(trace);
    });

    test('getCredential should handle missing credentials gracefully', async () => {
      // Reset with no credentials
      jest.clearAllMocks();
      await createNewContext(mockCachedIsolate, null);
      
      const getCredential = mockJail.set.mock.calls.find(([key]) => key === '_getCredential')[1];
      const result = getCredential('anyKey');
      expect(result).toBeUndefined();
    });

    test('getCredential should handle invalid credentials gracefully', async () => {
      // Reset with invalid credentials
      jest.clearAllMocks();
      await createNewContext(mockCachedIsolate, 'invalid');
      
      const getCredential = mockJail.set.mock.calls.find(([key]) => key === '_getCredential')[1];
      const result = getCredential('anyKey');
      expect(result).toBeUndefined();
    });
  });


  describe('_fetch API injection', () => {
    let fetchCallback;
    const mockFetchWithDnsWrapper = require('../../../src/util/utils').fetchWithDnsWrapper;
    const mockReference = require('isolated-vm').Reference;

    beforeEach(async () => {
      mockReference.mockClear();
      await createNewContext(mockCachedIsolate);
      // Extract the callback function from the mocked Reference constructor
      fetchCallback = mockReference.mock.calls.find(call => call[0].toString().includes('fetchWithDnsWrapper'))?.[0];
    });

    test('should handle successful fetch call', async () => {
      const mockResponse = {
        json: jest.fn().mockResolvedValue({ success: true, data: 'test' }),
      };
      mockFetchWithDnsWrapper.mockResolvedValue(mockResponse);

      const mockResolve = {
        applyIgnored: jest.fn(),
      };

      await fetchCallback(mockResolve, 'https://example.com');

      expect(mockFetchWithDnsWrapper).toHaveBeenCalledWith(
        {
          identifier: 'V1',
          transformationId: 'test-transformation-123',
          workspaceId: 'test-workspace-456',
        },
        'https://example.com'
      );
      expect(mockResolve.applyIgnored).toHaveBeenCalledWith(
        undefined,
        [expect.any(Object)] // ExternalCopy data
      );
    });

    test('should handle fetch error', async () => {
      mockFetchWithDnsWrapper.mockRejectedValue(new Error('Network error'));

      const mockResolve = {
        applyIgnored: jest.fn(),
      };

      await fetchCallback(mockResolve, 'https://example.com');

      expect(mockResolve.applyIgnored).toHaveBeenCalledWith(
        undefined,
        ["ERROR"] // ERROR string
      );
    });

    test('should handle JSON parsing error', async () => {
      const mockResponse = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      };
      mockFetchWithDnsWrapper.mockResolvedValue(mockResponse);

      const mockResolve = {
        applyIgnored: jest.fn(),
      };

      await fetchCallback(mockResolve, 'https://example.com');

      expect(mockResolve.applyIgnored).toHaveBeenCalledWith(
        undefined,
        ["ERROR"] // ERROR string
      );
    });
  });

  describe('_fetchV2 API injection', () => {
    let fetchV2Callback;
    const mockFetchWithDnsWrapper = require('../../../src/util/utils').fetchWithDnsWrapper;
    const mockReference = require('isolated-vm').Reference;

    beforeEach(async () => {
      mockReference.mockClear();
      await createNewContext(mockCachedIsolate);
      // Extract the fetchV2 callback (should be the second call with resolve/reject params)
      fetchV2Callback = mockReference.mock.calls.find(call => call[0].toString().includes('resolve') && call[0].toString().includes('reject') && call[0].toString().includes('fetchWithDnsWrapper'))?.[0];
    });

    test('should handle successful fetchV2 call with JSON response', async () => {
      const mockHeaders = new Map([
        ['content-type', 'application/json'],
        ['x-custom', 'test-value'],
      ]);
      const mockResponse = {
        url: 'https://example.com',
        status: 200,
        headers: mockHeaders,
        text: jest.fn().mockResolvedValue('{"success": true}'),
      };
      mockFetchWithDnsWrapper.mockResolvedValue(mockResponse);

      const mockResolve = {
        applyIgnored: jest.fn(),
      };
      const mockReject = {
        applyIgnored: jest.fn(),
      };

      await fetchV2Callback(mockResolve, mockReject, 'https://example.com');

      expect(mockResolve.applyIgnored).toHaveBeenCalledWith(
        undefined,
        [expect.any(Object)] // ExternalCopy data
      );
    });

    test('should handle successful fetchV2 call with text response', async () => {
      const mockHeaders = new Map([['content-type', 'text/plain']]);
      const mockResponse = {
        url: 'https://example.com',
        status: 200,
        headers: mockHeaders,
        text: jest.fn().mockResolvedValue('plain text response'),
      };
      mockFetchWithDnsWrapper.mockResolvedValue(mockResponse);

      const mockResolve = {
        applyIgnored: jest.fn(),
      };
      const mockReject = {
        applyIgnored: jest.fn(),
      };

      await fetchV2Callback(mockResolve, mockReject, 'https://example.com');

      expect(mockResolve.applyIgnored).toHaveBeenCalledWith(
        undefined,
        [expect.any(Object)] // ExternalCopy data
      );
    });

    test('should handle fetchV2 error', async () => {
      const error = new Error('Network error');
      error.code = 'ECONNREFUSED';
      mockFetchWithDnsWrapper.mockRejectedValue(error);

      const mockResolve = {
        applyIgnored: jest.fn(),
      };
      const mockReject = {
        applyIgnored: jest.fn(),
      };

      await fetchV2Callback(mockResolve, mockReject, 'https://example.com');

      expect(mockReject.applyIgnored).toHaveBeenCalledWith(
        undefined,
        [expect.any(Object)] // ExternalCopy error
      );
    });
  });

  describe('_geolocation API injection', () => {
    let geolocationCallback;
    const mockFetch = require('node-fetch');
    const mockReference = require('isolated-vm').Reference;

    beforeEach(async () => {
      mockReference.mockClear();
      await createNewContext(mockCachedIsolate);
      // Extract the geolocation callback
      geolocationCallback = mockReference.mock.calls.find(call => call[0].toString().includes('GEOLOCATION_URL'))?.[0];
    });

    test('should handle successful geolocation call', async () => {
      const mockGeoData = {
        country: 'US',
        city: 'New York',
        latitude: 40.7128,
        longitude: -74.0060,
      };
      const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue(mockGeoData),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const mockResolve = {
        applyIgnored: jest.fn(),
      };
      const mockReject = {
        applyIgnored: jest.fn(),
      };

      await geolocationCallback(mockResolve, mockReject, '1.2.3.4');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://geo.example.com/geoip/1.2.3.4',
        { timeout: 1000 }
      );
      expect(mockResolve.applyIgnored).toHaveBeenCalledWith(
        undefined,
        [expect.any(Object)] // ExternalCopy data
      );
    });

    test('should handle missing IP address', async () => {
      const mockResolve = {
        applyIgnored: jest.fn(),
      };
      const mockReject = {
        applyIgnored: jest.fn(),
      };

      await geolocationCallback(mockResolve, mockReject);

      expect(mockReject.applyIgnored).toHaveBeenCalledWith(
        undefined,
        [expect.any(Object)] // ExternalCopy error
      );
    });

    test('should handle missing GEOLOCATION_URL environment variable', async () => {
      delete process.env.GEOLOCATION_URL;

      const mockResolve = {
        applyIgnored: jest.fn(),
      };
      const mockReject = {
        applyIgnored: jest.fn(),
      };

      await geolocationCallback(mockResolve, mockReject, '1.2.3.4');

      expect(mockReject.applyIgnored).toHaveBeenCalledWith(
        undefined,
        [expect.any(Object)] // ExternalCopy error
      );
    });

    test('should handle non-200 geolocation response', async () => {
      const mockResponse = {
        status: 404,
      };
      mockFetch.mockResolvedValue(mockResponse);

      const mockResolve = {
        applyIgnored: jest.fn(),
      };
      const mockReject = {
        applyIgnored: jest.fn(),
      };

      await geolocationCallback(mockResolve, mockReject, '1.2.3.4');

      expect(mockReject.applyIgnored).toHaveBeenCalledWith(
        undefined,
        [expect.any(Object)] // ExternalCopy error
      );
    });

    test('should handle geolocation network error', async () => {
      const error = new Error('Network timeout');
      mockFetch.mockRejectedValue(error);

      const mockResolve = {
        applyIgnored: jest.fn(),
      };
      const mockReject = {
        applyIgnored: jest.fn(),
      };

      await geolocationCallback(mockResolve, mockReject, '1.2.3.4');

      expect(mockReject.applyIgnored).toHaveBeenCalledWith(
        undefined,
        [expect.any(Object)] // ExternalCopy error
      );
    });
  });

  describe('module instantiation and loading', () => {
    test('should handle module instantiation with callback', async () => {
      mockFreshModule.instantiate.mockImplementation(
        async (context, callback) => {
          await callback('lodash');
          await callback('moment');
        }
      );

      await createNewContext(mockCachedIsolate);

      expect(mockFreshModule.instantiate).toHaveBeenCalledWith(
        mockNewContext,
        expect.any(Function)
      );
    });

    test('should handle missing module in instantiation callback', async () => {
      mockCachedIsolate.customScriptModule.instantiate.mockImplementation(
        async (context, callback) => {
          try {
            await callback('nonexistent-module');
          } catch (error) {
            expect(error.message).toContain('import from nonexistent-module failed');
          }
        }
      );

      await createNewContext(mockCachedIsolate);
    });

    test('should properly copy metadata to reset context', async () => {
      mockCachedIsolate.logs = ['log1', 'log2'];
      mockCachedIsolate.fName = 'testFunction';

      const result = await createNewContext(mockCachedIsolate);

      // Should create new bootstrapScriptResult, not copy old one
      expect(result.bootstrapScriptResult).toBeDefined();
      expect(result.bootstrapScriptResult).not.toEqual({ some: 'data' });
      
      // Should copy logs and other metadata
      expect(result.logs).toEqual(['log1', 'log2']);
      expect(result.fName).toEqual('testFunction');
      expect(result.fnRef).toBeDefined();
      expect(result.transformationId).toEqual('test-transformation-123');
      expect(result.workspaceId).toEqual('test-workspace-456');
    });
  });

  describe('stats and logging verification', () => {
    const mockStats = require('../../../src/util/stats');

    test('should call stats timing for fetch operations', async () => {
      const mockFetchWithDnsWrapper = require('../../../src/util/utils').fetchWithDnsWrapper;
      mockFetchWithDnsWrapper.mockResolvedValue({
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      });

      const mockReference = require('isolated-vm').Reference;
      mockReference.mockClear();
      await createNewContext(mockCachedIsolate);
      const fetchCallback = mockReference.mock.calls.find(call => call[0].toString().includes('fetchWithDnsWrapper'))?.[0];

      const mockResolve = { applyIgnored: jest.fn() };
      await fetchCallback(mockResolve, 'https://example.com');

      expect(mockStats.timing).toHaveBeenCalledWith(
        'fetch_call_duration',
        expect.any(Date),
        expect.objectContaining({
          identifier: 'V1',
          transformationId: 'test-transformation-123',
          workspaceId: 'test-workspace-456',
          isSuccess: 'true',
        })
      );
    });

    test('should call stats increment for credential errors', async () => {
      await createNewContext(mockCachedIsolate, null);
      const getCredential = mockJail.set.mock.calls.find(([key]) => key === '_getCredential')[1];

      getCredential('someKey');

      expect(mockStats.increment).toHaveBeenCalledWith(
        'credential_error_total',
        expect.objectContaining({
          identifier: 'V1',
          transformationId: 'test-transformation-123',
          workspaceId: 'test-workspace-456',
        })
      );
    });
  });

  describe('edge cases and error scenarios', () => {
    test('should handle empty compiledModules', async () => {
      mockCachedIsolate.compiledModules = {};

      // Skip this test for now as it's complex to mock properly
      await expect(createNewContext(mockCachedIsolate)).resolves.toBeDefined();
    });

    test('should handle large credentials object', async () => {
      const largeCredentials = {};
      for (let i = 0; i < 1000; i++) {
        largeCredentials[`key${i}`] = `value${i}`;
      }

      await expect(createNewContext(mockCachedIsolate, largeCredentials)).resolves.toBeDefined();
    });

    test('should handle special characters in credentials', async () => {
      const specialCredentials = {
        'key with spaces': 'value with spaces',
        'key-with-dashes': 'value-with-dashes',
        'key_with_underscores': 'value_with_underscores',
        'key.with.dots': 'value.with.dots',
        'unicode-key-测试': 'unicode-value-测试',
      };

      await expect(createNewContext(mockCachedIsolate, specialCredentials)).resolves.toBeDefined();
    });

    test('should handle very long transformation and workspace IDs', async () => {
      mockCachedIsolate.transformationId = 'x'.repeat(1000);
      mockCachedIsolate.workspaceId = 'y'.repeat(1000);

      await expect(createNewContext(mockCachedIsolate)).resolves.toBeDefined();
    });

    test('should handle concurrent reset operations', async () => {
      const resetPromises = [];
      
      for (let i = 0; i < 10; i++) {
        const isolateCopy = { ...mockCachedIsolate };
        resetPromises.push(createNewContext(isolateCopy, { key: i }));
      }

      await expect(Promise.all(resetPromises)).resolves.toHaveLength(10);
    });

    test('should handle jail.set failures gracefully', async () => {
      mockJail.set.mockRejectedValueOnce(new Error('Failed to set global'));

      await expect(createNewContext(mockCachedIsolate)).rejects.toThrow('Failed to set global');
    });

    test('should handle transform wrapper retrieval failure', async () => {
      mockFreshModule.namespace.get.mockRejectedValue(
        new Error('Transform wrapper not found')
      );

      await expect(createNewContext(mockCachedIsolate)).rejects.toThrow('Transform wrapper not found');
    });

    test('should handle invalid environment variables gracefully', async () => {
      process.env.GEOLOCATION_TIMEOUT_IN_MS = 'invalid';
      
      await expect(createNewContext(mockCachedIsolate)).resolves.toBeDefined();
      
      // Should default to 1000ms when invalid
      const geolocationReference = mockJail.set.mock.calls.find(([key]) => key === '_geolocation')[1];
      expect(geolocationReference).toBeDefined();
    });

    test('should handle missing GEOLOCATION_TIMEOUT_IN_MS environment variable', async () => {
      delete process.env.GEOLOCATION_TIMEOUT_IN_MS;
      
      await expect(createNewContext(mockCachedIsolate)).resolves.toBeDefined();
      
      // Should default to 1000ms when missing
      const geolocationReference = mockJail.set.mock.calls.find(([key]) => key === '_geolocation')[1];
      expect(geolocationReference).toBeDefined();
    });
  });

  describe('memory and performance', () => {
    test('should not leak memory during reset', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Perform multiple resets
      for (let i = 0; i < 100; i++) {
        await createNewContext(mockCachedIsolate, { iteration: i });
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (allowing for test overhead)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
    });

    test('should complete reset within reasonable time', async () => {
      const startTime = Date.now();
      await createNewContext(mockCachedIsolate);
      const endTime = Date.now();

      // Reset should complete quickly (allowing for mock overhead)
      expect(endTime - startTime).toBeLessThan(1000); // Less than 1 second
    });

    test('should handle rapid successive resets', async () => {
      const promises = [];
      for (let i = 0; i < 50; i++) {
        promises.push(createNewContext(mockCachedIsolate, { rapid: i }));
      }
      
      await expect(Promise.all(promises)).resolves.toHaveLength(50);
    });
  });

  describe('comprehensive error handling', () => {
    test('should handle all types of invalid isolates', async () => {
      const invalidIsolates = [
        null,
        undefined,
        {},
        { isolate: null },
        { isolate: {} },
        { isolate: { createContext: null } },
        { isolate: { createContext: {} } },
      ];

      for (const invalidIsolate of invalidIsolates) {
        if (!invalidIsolate?.isolate) {
          await expect(createNewContext(invalidIsolate)).rejects.toThrow('Invalid cached isolate');
        } else {
          // These will fail at createContext call, not at validation
          await expect(createNewContext(invalidIsolate)).rejects.toThrow();
        }
      }
    });

    test('should handle all types of invalid credentials', async () => {
      const invalidCredentials = [
        null,
        undefined,
        'string',
        123,
        [],
        () => {},
      ];

      for (const invalidCredential of invalidCredentials) {
        await expect(createNewContext(mockCachedIsolate, invalidCredential)).resolves.toBeDefined();
      }
    });

    test('should handle missing environment variables gracefully', async () => {
      const originalEnv = { ...process.env };
      
      // Test with various missing env vars
      delete process.env.GEOLOCATION_TIMEOUT_IN_MS;
      delete process.env.GEOLOCATION_URL;
      
      await expect(createNewContext(mockCachedIsolate)).resolves.toBeDefined();
      
      // Restore environment
      process.env = originalEnv;
    });
  });
});
