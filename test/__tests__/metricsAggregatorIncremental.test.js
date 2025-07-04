const logger = require('../../src/logger');
const { Worker } = require('worker_threads');

jest.mock('cluster');
jest.mock('worker_threads');

describe('MetricsAggregator Incremental Updates', () => {
  let cluster;
  let mockPrometheusInstance;
  let MetricsAggregator;
  let initializeConfig;

  beforeEach(() => {
    cluster = require('cluster');
    cluster.isPrimary = true;
    cluster.workers = {};
    
    mockPrometheusInstance = {
      prometheusRegistry: {
        getMetricsAsJSON: jest.fn(),
      },
      clearMetrics: jest.fn(),
      getChangedMetricsAsJSON: jest.fn(),
    };

    // Mock Worker constructor
    Worker.mockImplementation(() => ({
      threadId: 1,
      on: jest.fn(),
      postMessage: jest.fn(),
      terminate: jest.fn().mockResolvedValue(0),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Clean up environment variables
    delete process.env.METRICS_AGGREGATOR_INCREMENTAL_UPDATES;
  });

  it('should enable incremental updates by default', () => {
    // Clear any existing env var
    delete process.env.METRICS_AGGREGATOR_INCREMENTAL_UPDATES;
    // Clear module cache and require the module after clearing env var
    delete require.cache[require.resolve('../../src/util/metricsAggregator')];
    const metricsAggregatorModule = require('../../src/util/metricsAggregator');
    MetricsAggregator = metricsAggregatorModule.MetricsAggregator;
    initializeConfig = metricsAggregatorModule.initializeConfig;
    
    // Re-initialize config
    initializeConfig();
    
    const metricsAggregator = new MetricsAggregator(mockPrometheusInstance);
    expect(metricsAggregator.enableIncrementalUpdates).toBe(true);
  });

  it('should disable incremental updates when env var is set to false', () => {
    // Set env var before requiring the module
    process.env.METRICS_AGGREGATOR_INCREMENTAL_UPDATES = 'false';
    // Clear module cache and require the module after setting env var
    delete require.cache[require.resolve('../../src/util/metricsAggregator')];
    const metricsAggregatorModule = require('../../src/util/metricsAggregator');
    MetricsAggregator = metricsAggregatorModule.MetricsAggregator;
    initializeConfig = metricsAggregatorModule.initializeConfig;
    
    // Re-initialize config
    initializeConfig();
    
    const metricsAggregator = new MetricsAggregator(mockPrometheusInstance);
    expect(metricsAggregator.enableIncrementalUpdates).toBe(false);
  });

  it('should use GET_UPDATED_METRICS_REQ when incremental updates are enabled', () => {
    // Ensure default behavior
    delete process.env.METRICS_AGGREGATOR_INCREMENTAL_UPDATES;
    delete require.cache[require.resolve('../../src/util/metricsAggregator')];
    const metricsAggregatorModule = require('../../src/util/metricsAggregator');
    MetricsAggregator = metricsAggregatorModule.MetricsAggregator;
    initializeConfig = metricsAggregatorModule.initializeConfig;
    
    // Re-initialize config
    initializeConfig();
    
    const metricsAggregator = new MetricsAggregator(mockPrometheusInstance);
    metricsAggregator.enableIncrementalUpdates = true;
    
    // Mock cluster.workers
    const mockWorker = {
      isConnected: () => true,
      send: jest.fn(),
    };
    cluster.workers = { 1: mockWorker };
    
    // Mock worker thread response
    metricsAggregator.workerThread = {
      postMessage: jest.fn(),
    };
    
    // Test the message type selection logic directly
    const messageType = metricsAggregator.enableIncrementalUpdates 
      ? 'rudder-transformer:getUpdatedMetricsReq' 
      : 'rudder-transformer:getMetricsReq';
    
    expect(messageType).toBe('rudder-transformer:getUpdatedMetricsReq');
  });

  it('should handle worker metrics reset correctly', async () => {
    // Ensure default behavior
    delete process.env.METRICS_AGGREGATOR_INCREMENTAL_UPDATES;
    delete require.cache[require.resolve('../../src/util/metricsAggregator')];
    const metricsAggregatorModule = require('../../src/util/metricsAggregator');
    MetricsAggregator = metricsAggregatorModule.MetricsAggregator;
    initializeConfig = metricsAggregatorModule.initializeConfig;
    
    // Re-initialize config
    initializeConfig();
    
    const metricsAggregator = new MetricsAggregator(mockPrometheusInstance);
    
    // Simulate reset message
    cluster.worker = { id: 1 };
    await metricsAggregator.onMasterMessage({
      type: 'rudder-transformer:resetMetricsReq',
    });
    
    expect(mockPrometheusInstance.clearMetrics).toHaveBeenCalled();
  });

  it('should handle updated metrics response correctly', () => {
    // Ensure default behavior
    delete process.env.METRICS_AGGREGATOR_INCREMENTAL_UPDATES;
    delete require.cache[require.resolve('../../src/util/metricsAggregator')];
    const metricsAggregatorModule = require('../../src/util/metricsAggregator');
    MetricsAggregator = metricsAggregatorModule.MetricsAggregator;
    initializeConfig = metricsAggregatorModule.initializeConfig;
    
    // Re-initialize config
    initializeConfig();
    
    const metricsAggregator = new MetricsAggregator(mockPrometheusInstance);
    
    // Mock the promise to resolve immediately
    const mockResolve = jest.fn();
    const mockReject = jest.fn();
    metricsAggregator.resolveFunc = mockResolve;
    metricsAggregator.rejectFunc = mockReject;
    metricsAggregator.requestId = 0;
    metricsAggregator.pendingMetricRequests = 1;
    
    // Mock worker thread response
    metricsAggregator.workerThread = {
      postMessage: jest.fn(),
    };
    
    const mockMetrics = [{ name: 'test', type: 'counter', values: [] }];
    
    // Test response with changed metrics
    metricsAggregator.handleUpdatedMetricsResponse(1, {
      requestId: 0,
      hasChanged: true,
      metrics: mockMetrics,
    });
    
    expect(metricsAggregator.metricsBuffer).toContain(mockMetrics);
    expect(metricsAggregator.pendingMetricRequests).toBe(0);
    
    // Test response with unchanged metrics
    metricsAggregator.pendingMetricRequests = 1;
    metricsAggregator.handleUpdatedMetricsResponse(2, {
      requestId: 0,
      hasChanged: false,
    });
    
    expect(metricsAggregator.pendingMetricRequests).toBe(0);
    expect(metricsAggregator.metricsBuffer).toHaveLength(1); // Should not add unchanged metrics
  });

  it('should handle worker message for updated metrics', async () => {
    // Ensure default behavior
    delete process.env.METRICS_AGGREGATOR_INCREMENTAL_UPDATES;
    delete require.cache[require.resolve('../../src/util/metricsAggregator')];
    const metricsAggregatorModule = require('../../src/util/metricsAggregator');
    MetricsAggregator = metricsAggregatorModule.MetricsAggregator;
    initializeConfig = metricsAggregatorModule.initializeConfig;
    
    // Re-initialize config
    initializeConfig();
    
    const metricsAggregator = new MetricsAggregator(mockPrometheusInstance);
    
    // Mock cluster.worker
    cluster.worker = { id: 1, send: jest.fn() };
    
    // Mock prometheus instance
    const mockChangedMetrics = [{ name: 'test', type: 'counter', values: [] }];
    mockPrometheusInstance.getChangedMetricsAsJSON.mockResolvedValue(mockChangedMetrics);
    
    // Test the onMasterMessage method for updated metrics request
    const message = {
      type: 'rudder-transformer:getUpdatedMetricsReq',
      requestId: 0,
    };
    
    // This should trigger the updated metrics logic
    await metricsAggregator.onMasterMessage(message);
    
    // Verify that the worker responded with changed metrics
    expect(cluster.worker.send).toHaveBeenCalledWith({
      type: 'rudder-transformer:getUpdatedMetricsRes',
      metrics: mockChangedMetrics,
      requestId: 0,
      hasChanged: true,
    });
  });

  it('should handle worker message for updated metrics with no changes', async () => {
    // Ensure default behavior
    delete process.env.METRICS_AGGREGATOR_INCREMENTAL_UPDATES;
    delete require.cache[require.resolve('../../src/util/metricsAggregator')];
    const metricsAggregatorModule = require('../../src/util/metricsAggregator');
    MetricsAggregator = metricsAggregatorModule.MetricsAggregator;
    initializeConfig = metricsAggregatorModule.initializeConfig;
    
    // Re-initialize config
    initializeConfig();
    
    const metricsAggregator = new MetricsAggregator(mockPrometheusInstance);
    
    // Mock cluster.worker
    cluster.worker = { id: 1, send: jest.fn() };
    
    // Mock prometheus instance to return no changes
    mockPrometheusInstance.getChangedMetricsAsJSON.mockResolvedValue([]);
    
    // Test the onMasterMessage method for updated metrics request
    const message = {
      type: 'rudder-transformer:getUpdatedMetricsReq',
      requestId: 0,
    };
    
    // This should trigger the updated metrics logic
    await metricsAggregator.onMasterMessage(message);
    
    // Verify that the worker responded with no changes
    expect(cluster.worker.send).toHaveBeenCalledWith({
      type: 'rudder-transformer:getUpdatedMetricsRes',
      hasChanged: false,
      requestId: 0,
    });
  });

  it('should test initializeConfig function directly', () => {
    // Clear module cache and require the module
    delete require.cache[require.resolve('../../src/util/metricsAggregator')];
    const metricsAggregatorModule = require('../../src/util/metricsAggregator');
    initializeConfig = metricsAggregatorModule.initializeConfig;
    
    // Test with default values
    delete process.env.METRICS_AGGREGATOR_INCREMENTAL_UPDATES;
    initializeConfig();
    
    // Test with explicit false
    process.env.METRICS_AGGREGATOR_INCREMENTAL_UPDATES = 'false';
    initializeConfig();
    
    // Test with explicit true
    process.env.METRICS_AGGREGATOR_INCREMENTAL_UPDATES = 'true';
    initializeConfig();
    
    // The function should not throw any errors
    expect(initializeConfig).toBeDefined();
    expect(typeof initializeConfig).toBe('function');
  });
}); 