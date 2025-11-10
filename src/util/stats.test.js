const stats = require('./stats');
const prometheus = require('./prometheus');

// Mock the prometheus module
jest.mock('./prometheus');

describe('stats', () => {
  let mockStatsClient;

  beforeEach(() => {
    // Reset modules to ensure fresh state
    jest.clearAllMocks();

    // Create a mock stats client
    mockStatsClient = {
      timing: jest.fn(),
      timingSummary: jest.fn(),
      summary: jest.fn(),
      increment: jest.fn(),
      counter: jest.fn(),
      gauge: jest.fn(),
      histogram: jest.fn(),
      metricsController: jest.fn(),
      resetMetricsController: jest.fn(),
      shutdown: jest.fn(),
    };

    // Mock Prometheus constructor
    prometheus.Prometheus.mockImplementation(() => mockStatsClient);

    // Reinitialize stats module with mocked prometheus
    stats.init();
  });

  describe('init', () => {
    it('should initialize statsClient with Prometheus instance', () => {
      expect(prometheus.Prometheus).toHaveBeenCalled();
      expect(stats.statsClient).toBeDefined();
    });
  });

  describe('timing', () => {
    it('should call statsClient.timing with correct parameters', () => {
      const name = 'test_metric';
      const start = Date.now() - 1000;
      const tags = { destination: 'GA' };

      stats.timing(name, start, tags);

      expect(mockStatsClient.timing).toHaveBeenCalledWith(name, start, tags);
      expect(mockStatsClient.timing).toHaveBeenCalledTimes(1);
    });

    it('should call statsClient.timing with default empty tags', () => {
      const name = 'test_metric';
      const start = Date.now();

      stats.timing(name, start);

      expect(mockStatsClient.timing).toHaveBeenCalledWith(name, start, {});
    });

    it('should handle when statsClient methods are not called if client is null', () => {
      // Save original statsClient
      const originalStatsClient = stats.statsClient;
      
      // Temporarily set to null
      stats.statsClient = null;

      expect(() => {
        stats.timing('test', Date.now());
      }).not.toThrow();
      
      // Restore
      stats.statsClient = originalStatsClient;
    });
  });

  describe('timingSummary', () => {
    it('should call statsClient.timingSummary with correct parameters', () => {
      const name = 'test_summary_metric';
      const start = Date.now() - 2000;
      const tags = { workspaceId: '123' };

      stats.timingSummary(name, start, tags);

      expect(mockStatsClient.timingSummary).toHaveBeenCalledWith(name, start, tags);
      expect(mockStatsClient.timingSummary).toHaveBeenCalledTimes(1);
    });

    it('should call statsClient.timingSummary with default empty tags', () => {
      const name = 'test_summary';
      const start = Date.now();

      stats.timingSummary(name, start);

      expect(mockStatsClient.timingSummary).toHaveBeenCalledWith(name, start, {});
    });

    it('should handle when statsClient methods are not called if client is null', () => {
      const originalStatsClient = stats.statsClient;
      stats.statsClient = null;

      expect(() => {
        stats.timingSummary('test', Date.now());
      }).not.toThrow();
      
      stats.statsClient = originalStatsClient;
    });
  });

  describe('summary', () => {
    it('should call statsClient.summary with correct parameters', () => {
      const name = 'batch_size';
      const value = 100;
      const tags = { destination: 'Braze' };

      stats.summary(name, value, tags);

      expect(mockStatsClient.summary).toHaveBeenCalledWith(name, value, tags);
      expect(mockStatsClient.summary).toHaveBeenCalledTimes(1);
    });

    it('should call statsClient.summary with default empty tags', () => {
      const name = 'batch_size';
      const value = 50;

      stats.summary(name, value);

      expect(mockStatsClient.summary).toHaveBeenCalledWith(name, value, {});
    });

    it('should handle numeric values correctly', () => {
      stats.summary('test_metric', 0);
      expect(mockStatsClient.summary).toHaveBeenCalledWith('test_metric', 0, {});

      stats.summary('test_metric', -10);
      expect(mockStatsClient.summary).toHaveBeenCalledWith('test_metric', -10, {});

      stats.summary('test_metric', 999.99);
      expect(mockStatsClient.summary).toHaveBeenCalledWith('test_metric', 999.99, {});
    });

    it('should handle when statsClient methods are not called if client is null', () => {
      const originalStatsClient = stats.statsClient;
      stats.statsClient = null;

      expect(() => {
        stats.summary('test', 100);
      }).not.toThrow();
      
      stats.statsClient = originalStatsClient;
    });
  });

  describe('increment', () => {
    it('should call statsClient.increment with correct parameters', () => {
      const name = 'request_count';
      const tags = { status: 'success' };

      stats.increment(name, tags);

      expect(mockStatsClient.increment).toHaveBeenCalledWith(name, tags);
      expect(mockStatsClient.increment).toHaveBeenCalledTimes(1);
    });

    it('should call statsClient.increment with default empty tags', () => {
      const name = 'request_count';

      stats.increment(name);

      expect(mockStatsClient.increment).toHaveBeenCalledWith(name, {});
    });

    it('should handle when statsClient methods are not called if client is null', () => {
      const originalStatsClient = stats.statsClient;
      stats.statsClient = null;

      expect(() => {
        stats.increment('test');
      }).not.toThrow();
      
      stats.statsClient = originalStatsClient;
    });
  });

  describe('counter', () => {
    it('should call statsClient.counter with correct parameters', () => {
      const name = 'event_count';
      const delta = 5;
      const tags = { eventType: 'track' };

      stats.counter(name, delta, tags);

      expect(mockStatsClient.counter).toHaveBeenCalledWith(name, delta, tags);
      expect(mockStatsClient.counter).toHaveBeenCalledTimes(1);
    });

    it('should call statsClient.counter with default empty tags', () => {
      const name = 'event_count';
      const delta = 10;

      stats.counter(name, delta);

      expect(mockStatsClient.counter).toHaveBeenCalledWith(name, delta, {});
    });

    it('should handle different delta values', () => {
      stats.counter('test_counter', 0);
      expect(mockStatsClient.counter).toHaveBeenCalledWith('test_counter', 0, {});

      stats.counter('test_counter', -5);
      expect(mockStatsClient.counter).toHaveBeenCalledWith('test_counter', -5, {});

      stats.counter('test_counter', 100);
      expect(mockStatsClient.counter).toHaveBeenCalledWith('test_counter', 100, {});
    });

    it('should handle when statsClient methods are not called if client is null', () => {
      const originalStatsClient = stats.statsClient;
      stats.statsClient = null;

      expect(() => {
        stats.counter('test', 5);
      }).not.toThrow();
      
      stats.statsClient = originalStatsClient;
    });
  });

  describe('gauge', () => {
    it('should call statsClient.gauge with correct parameters', () => {
      const name = 'memory_usage';
      const value = 1024;
      const tags = { process: 'transformer' };

      stats.gauge(name, value, tags);

      expect(mockStatsClient.gauge).toHaveBeenCalledWith(name, value, tags);
      expect(mockStatsClient.gauge).toHaveBeenCalledTimes(1);
    });

    it('should call statsClient.gauge with default empty tags', () => {
      const name = 'cpu_usage';
      const value = 75.5;

      stats.gauge(name, value);

      expect(mockStatsClient.gauge).toHaveBeenCalledWith(name, value, {});
    });

    it('should handle different gauge values', () => {
      stats.gauge('test_gauge', 0);
      expect(mockStatsClient.gauge).toHaveBeenCalledWith('test_gauge', 0, {});

      stats.gauge('test_gauge', 100.5);
      expect(mockStatsClient.gauge).toHaveBeenCalledWith('test_gauge', 100.5, {});

      stats.gauge('test_gauge', -50);
      expect(mockStatsClient.gauge).toHaveBeenCalledWith('test_gauge', -50, {});
    });

    it('should handle when statsClient methods are not called if client is null', () => {
      const originalStatsClient = stats.statsClient;
      stats.statsClient = null;

      expect(() => {
        stats.gauge('test', 100);
      }).not.toThrow();
      
      stats.statsClient = originalStatsClient;
    });
  });

  describe('histogram', () => {
    it('should call statsClient.histogram with correct parameters', () => {
      const name = 'response_time';
      const value = 250;
      const tags = { endpoint: '/transform' };

      stats.histogram(name, value, tags);

      expect(mockStatsClient.histogram).toHaveBeenCalledWith(name, value, tags);
      expect(mockStatsClient.histogram).toHaveBeenCalledTimes(1);
    });

    it('should call statsClient.histogram with default empty tags', () => {
      const name = 'latency';
      const value = 150.5;

      stats.histogram(name, value);

      expect(mockStatsClient.histogram).toHaveBeenCalledWith(name, value, {});
    });

    it('should handle different histogram values', () => {
      stats.histogram('test_histogram', 0);
      expect(mockStatsClient.histogram).toHaveBeenCalledWith('test_histogram', 0, {});

      stats.histogram('test_histogram', 1000);
      expect(mockStatsClient.histogram).toHaveBeenCalledWith('test_histogram', 1000, {});

      stats.histogram('test_histogram', 0.001);
      expect(mockStatsClient.histogram).toHaveBeenCalledWith('test_histogram', 0.001, {});
    });

    it('should handle when statsClient methods are not called if client is null', () => {
      const originalStatsClient = stats.statsClient;
      stats.statsClient = null;

      expect(() => {
        stats.histogram('test', 100);
      }).not.toThrow();
      
      stats.statsClient = originalStatsClient;
    });
  });

  describe('metricsController', () => {
    it('should call statsClient.metricsController and return result', async () => {
      const mockCtx = { status: 200, body: '' };
      const expectedMetrics = 'metric_data';

      mockStatsClient.metricsController.mockResolvedValue(expectedMetrics);

      await stats.metricsController(mockCtx);

      expect(mockStatsClient.metricsController).toHaveBeenCalledWith(mockCtx);
      expect(mockStatsClient.metricsController).toHaveBeenCalledTimes(1);
    });

    it('should handle context object correctly', async () => {
      const mockCtx = { status: 200, body: '', type: '' };
      mockStatsClient.metricsController.mockResolvedValue('metrics_response');

      await stats.metricsController(mockCtx);

      expect(mockStatsClient.metricsController).toHaveBeenCalledWith(mockCtx);
    });
  });

  describe('resetMetricsController', () => {
    it('should call statsClient.resetMetricsController and return result', async () => {
      const mockCtx = { status: 200, body: '' };
      const expectedResponse = 'Metrics reset';

      mockStatsClient.resetMetricsController.mockResolvedValue(expectedResponse);

      await stats.resetMetricsController(mockCtx);

      expect(mockStatsClient.resetMetricsController).toHaveBeenCalledWith(mockCtx);
      expect(mockStatsClient.resetMetricsController).toHaveBeenCalledTimes(1);
    });

    it('should handle context object correctly', async () => {
      const mockCtx = { status: 200, body: '' };
      mockStatsClient.resetMetricsController.mockResolvedValue('reset_response');

      await stats.resetMetricsController(mockCtx);

      expect(mockStatsClient.resetMetricsController).toHaveBeenCalledWith(mockCtx);
    });
  });

  describe('shutdownMetricsClient', () => {
    it('should call statsClient.shutdown', async () => {
      mockStatsClient.shutdown.mockResolvedValue();

      await stats.shutdownMetricsClient();

      expect(mockStatsClient.shutdown).toHaveBeenCalledTimes(1);
    });

    it('should handle shutdown gracefully when statsClient is null', async () => {
      const originalStatsClient = stats.statsClient;
      stats.statsClient = null;

      await expect(stats.shutdownMetricsClient()).resolves.toBeUndefined();
      
      stats.statsClient = originalStatsClient;
    });

    it('should handle errors during shutdown', async () => {
      const error = new Error('Shutdown failed');
      mockStatsClient.shutdown.mockRejectedValue(error);

      await expect(stats.shutdownMetricsClient()).rejects.toThrow('Shutdown failed');
    });
  });

  describe('module exports', () => {
    it('should export all required functions', () => {
      expect(stats.init).toBeDefined();
      expect(typeof stats.init).toBe('function');

      expect(stats.timing).toBeDefined();
      expect(typeof stats.timing).toBe('function');

      expect(stats.timingSummary).toBeDefined();
      expect(typeof stats.timingSummary).toBe('function');

      expect(stats.summary).toBeDefined();
      expect(typeof stats.summary).toBe('function');

      expect(stats.increment).toBeDefined();
      expect(typeof stats.increment).toBe('function');

      expect(stats.counter).toBeDefined();
      expect(typeof stats.counter).toBe('function');

      expect(stats.gauge).toBeDefined();
      expect(typeof stats.gauge).toBe('function');

      expect(stats.histogram).toBeDefined();
      expect(typeof stats.histogram).toBe('function');

      expect(stats.metricsController).toBeDefined();
      expect(typeof stats.metricsController).toBe('function');

      expect(stats.resetMetricsController).toBeDefined();
      expect(typeof stats.resetMetricsController).toBe('function');

      expect(stats.shutdownMetricsClient).toBeDefined();
      expect(typeof stats.shutdownMetricsClient).toBe('function');
    });

    it('should have statsClient property', () => {
      // statsClient should be defined (can be an object or null)
      expect('statsClient' in stats).toBe(true);
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple metric operations in sequence', () => {
      const tags = { destination: 'GA', workspaceId: '123' };

      stats.increment('requests', tags);
      stats.counter('events', 5, tags);
      stats.gauge('memory', 1024, tags);
      stats.histogram('latency', 250, tags);

      expect(mockStatsClient.increment).toHaveBeenCalledTimes(1);
      expect(mockStatsClient.counter).toHaveBeenCalledTimes(1);
      expect(mockStatsClient.gauge).toHaveBeenCalledTimes(1);
      expect(mockStatsClient.histogram).toHaveBeenCalledTimes(1);
    });

    it('should handle timing operations with actual time calculations', () => {
      const start = Date.now();
      const name = 'operation_time';
      const tags = { operation: 'transform' };

      stats.timing(name, start, tags);

      expect(mockStatsClient.timing).toHaveBeenCalledWith(name, start, tags);
    });

    it('should handle empty tag objects consistently', () => {
      stats.increment('test1', {});
      stats.counter('test2', 1, {});
      stats.gauge('test3', 100, {});

      expect(mockStatsClient.increment).toHaveBeenCalledWith('test1', {});
      expect(mockStatsClient.counter).toHaveBeenCalledWith('test2', 1, {});
      expect(mockStatsClient.gauge).toHaveBeenCalledWith('test3', 100, {});
    });

    it('should handle complex tag objects with multiple properties', () => {
      const complexTags = {
        destination: 'GA',
        workspaceId: '123',
        sourceId: '456',
        feature: 'batch',
        module: 'router',
      };

      stats.increment('complex_metric', complexTags);

      expect(mockStatsClient.increment).toHaveBeenCalledWith('complex_metric', complexTags);
    });
  });
});

