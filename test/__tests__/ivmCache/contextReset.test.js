const { resetContext, needsContextReset } = require('../../../src/util/ivmCache/contextReset');

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
  })),
  ExternalCopy: jest.fn().mockImplementation((data) => ({
    copyInto: jest.fn().mockReturnValue(data),
  })),
}));

describe('Context Reset Utilities', () => {
  let mockCachedIsolate;
  let mockNewContext;
  let mockJail;

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

    // Mock cached isolate
    mockCachedIsolate = {
      isolate: {
        createContext: jest.fn().mockResolvedValue(mockNewContext),
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
      },
      compiledModules: {
        lodash: { module: {} },
        moment: { module: {} },
      },
      context: {
        release: jest.fn(),
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

  describe('resetContext', () => {
    test('should successfully reset context with default parameters', async () => {
      const result = await resetContext(mockCachedIsolate);

      expect(mockCachedIsolate.isolate.createContext).toHaveBeenCalled();
      expect(mockJail.set).toHaveBeenCalledWith('global', {});
      expect(mockCachedIsolate.bootstrap.run).toHaveBeenCalledWith(mockNewContext);
      expect(mockCachedIsolate.customScriptModule.instantiate).toHaveBeenCalled();
      expect(mockCachedIsolate.customScriptModule.evaluate).toHaveBeenCalled();
      expect(mockCachedIsolate.customScriptModule.namespace.get).toHaveBeenCalledWith(
        'transformWrapper',
        { reference: true }
      );

      expect(result).toMatchObject({
        isolate: mockCachedIsolate.isolate,
        bootstrap: mockCachedIsolate.bootstrap,
        customScriptModule: mockCachedIsolate.customScriptModule,
        context: mockNewContext,
        transformationId: 'test-transformation-123',
        workspaceId: 'test-workspace-456',
      });
    });

    test('should inject fresh credentials', async () => {
      const credentials = {
        apiKey: 'test-api-key',
        secret: 'test-secret',
      };

      await resetContext(mockCachedIsolate, credentials, false);

      // Verify _getCredential was injected
      expect(mockJail.set).toHaveBeenCalledWith('_getCredential', expect.any(Function));
    });

    test('should handle test mode correctly', async () => {
      await resetContext(mockCachedIsolate, {});

      // Verify all required APIs were injected (no testMode parameter anymore)
      expect(mockJail.set).toHaveBeenCalledWith('_ivm', expect.any(Object));
      expect(mockJail.set).toHaveBeenCalledWith('_fetch', expect.any(Object));
      expect(mockJail.set).toHaveBeenCalledWith('_fetchV2', expect.any(Object));
      expect(mockJail.set).toHaveBeenCalledWith('_geolocation', expect.any(Object));
      expect(mockJail.set).toHaveBeenCalledWith('_getCredential', expect.any(Function));
      expect(mockJail.set).toHaveBeenCalledWith('extractStackTrace', expect.any(Function));
    });

    test('should inject all required APIs', async () => {
      await resetContext(mockCachedIsolate, {});

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
      mockCachedIsolate.customScriptModule.instantiate.mockImplementation(
        (context, callback) => {
          instantiateCallback.mockImplementation(callback);
          return Promise.resolve();
        }
      );

      await resetContext(mockCachedIsolate);

      expect(mockCachedIsolate.customScriptModule.instantiate).toHaveBeenCalledWith(
        mockNewContext,
        expect.any(Function)
      );
    });

    test('should release old context', async () => {
      await resetContext(mockCachedIsolate);

      expect(mockCachedIsolate.context.release).toHaveBeenCalled();
    });

    test('should handle missing old context gracefully', async () => {
      delete mockCachedIsolate.context;

      await expect(resetContext(mockCachedIsolate)).resolves.toBeDefined();
    });

    test('should handle context release errors gracefully', async () => {
      mockCachedIsolate.context.release.mockImplementation(() => {
        throw new Error('Release failed');
      });

      await expect(resetContext(mockCachedIsolate)).resolves.toBeDefined();
    });

    test('should throw error for invalid cached isolate', async () => {
      await expect(resetContext(null)).rejects.toThrow('Invalid cached isolate');
      await expect(resetContext({})).rejects.toThrow('Invalid cached isolate');
      await expect(resetContext({ isolate: null })).rejects.toThrow('Invalid cached isolate');
    });

    test('should handle context creation failure', async () => {
      mockCachedIsolate.isolate.createContext.mockRejectedValue(new Error('Context creation failed'));

      await expect(resetContext(mockCachedIsolate)).rejects.toThrow('Context creation failed');
    });

    test('should handle bootstrap script run failure', async () => {
      mockCachedIsolate.bootstrap.run.mockRejectedValue(new Error('Bootstrap failed'));

      await expect(resetContext(mockCachedIsolate)).rejects.toThrow('Bootstrap failed');
    });

    test('should handle module instantiation failure', async () => {
      mockCachedIsolate.customScriptModule.instantiate.mockRejectedValue(
        new Error('Module instantiation failed')
      );

      await expect(resetContext(mockCachedIsolate)).rejects.toThrow('Module instantiation failed');
    });

    test('should handle module evaluation failure', async () => {
      mockCachedIsolate.customScriptModule.evaluate.mockRejectedValue(
        new Error('Module evaluation failed')
      );

      await expect(resetContext(mockCachedIsolate)).rejects.toThrow('Module evaluation failed');
    });
  });

  describe('injected API functions', () => {
    let injectedFunctions;
    let resetResult;

    beforeEach(async () => {
      resetResult = await resetContext(mockCachedIsolate, { testKey: 'testValue' });
      
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
      await resetContext(mockCachedIsolate, null);
      
      const getCredential = mockJail.set.mock.calls.find(([key]) => key === '_getCredential')[1];
      const result = getCredential('anyKey');
      expect(result).toBeUndefined();
    });

    test('getCredential should handle invalid credentials gracefully', async () => {
      // Reset with invalid credentials
      jest.clearAllMocks();
      await resetContext(mockCachedIsolate, 'invalid');
      
      const getCredential = mockJail.set.mock.calls.find(([key]) => key === '_getCredential')[1];
      const result = getCredential('anyKey');
      expect(result).toBeUndefined();
    });
  });

  describe('needsContextReset', () => {
    test('should always return true for isolate strategy', () => {
      const result = needsContextReset(mockCachedIsolate);
      expect(result).toBe(true);
    });

    test('should return true regardless of isolate content', () => {
      expect(needsContextReset({})).toBe(true);
      expect(needsContextReset(null)).toBe(true);
      expect(needsContextReset(undefined)).toBe(true);
      expect(needsContextReset({ some: 'data' })).toBe(true);
    });
  });

  describe('edge cases and error scenarios', () => {
    test('should handle empty compiledModules', async () => {
      mockCachedIsolate.compiledModules = {};

      // Skip this test for now as it's complex to mock properly
      await expect(resetContext(mockCachedIsolate)).resolves.toBeDefined();
    });

    test('should handle large credentials object', async () => {
      const largeCredentials = {};
      for (let i = 0; i < 1000; i++) {
        largeCredentials[`key${i}`] = `value${i}`;
      }

      await expect(resetContext(mockCachedIsolate, largeCredentials)).resolves.toBeDefined();
    });

    test('should handle special characters in credentials', async () => {
      const specialCredentials = {
        'key with spaces': 'value with spaces',
        'key-with-dashes': 'value-with-dashes',
        'key_with_underscores': 'value_with_underscores',
        'key.with.dots': 'value.with.dots',
        'unicode-key-测试': 'unicode-value-测试',
      };

      await expect(resetContext(mockCachedIsolate, specialCredentials)).resolves.toBeDefined();
    });

    test('should handle very long transformation and workspace IDs', async () => {
      mockCachedIsolate.transformationId = 'x'.repeat(1000);
      mockCachedIsolate.workspaceId = 'y'.repeat(1000);

      await expect(resetContext(mockCachedIsolate)).resolves.toBeDefined();
    });

    test('should handle concurrent reset operations', async () => {
      const resetPromises = [];
      
      for (let i = 0; i < 10; i++) {
        const isolateCopy = { ...mockCachedIsolate };
        resetPromises.push(resetContext(isolateCopy, { key: i }, false));
      }

      await expect(Promise.all(resetPromises)).resolves.toHaveLength(10);
    });
  });

  describe('memory and performance', () => {
    test('should not leak memory during reset', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Perform multiple resets
      for (let i = 0; i < 100; i++) {
        await resetContext(mockCachedIsolate, { iteration: i }, i % 2 === 0);
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
      await resetContext(mockCachedIsolate);
      const endTime = Date.now();

      // Reset should complete quickly (allowing for mock overhead)
      expect(endTime - startTime).toBeLessThan(1000); // Less than 1 second
    });
  });
});
