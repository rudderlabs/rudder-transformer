const { MetricsAggregator } = require('../../src/util/metricsAggregator');
const logger = require('../../src/logger');
const { Worker } = require('worker_threads');
const v8 = require('v8');
jest.mock('cluster');
const cluster = require('cluster');

describe('MetricsAggregator', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should create a worker thread and register callbacks on creation', async () => {
    const clusterOnSpy = jest.spyOn(cluster, 'on');
    const metricsAggregator = new MetricsAggregator();
    // check if the worker thread is a an instance of a worker
    expect(metricsAggregator.workerThread).toBeInstanceOf(Worker);
    // check if the cluster.on method was called with the right arguments
    expect(clusterOnSpy).toHaveBeenCalledWith('message', expect.any(Function));
    await metricsAggregator.shutdown();
  });

  it('periodic reset should reset metrics', async () => {
    jest.useFakeTimers();
    const metricsAggregator = new MetricsAggregator();
    const resetMetricsSpy = jest.spyOn(metricsAggregator, 'resetMetrics');
    metricsAggregator.registerCallbackForPeriodicReset(1);
    jest.advanceTimersByTime(1000);
    expect(resetMetricsSpy).toHaveBeenCalled();
    await metricsAggregator.shutdown();
  });

  it('should collect metrics from all workers and aggregate them', async () => {
    // mock the getMetricsAsJSON method to return a single metric
    const mockGetMetricsAsJSON = jest.fn().mockImplementation(() => {
      return [{
        help: "Total user CPU time spent in seconds.",
        name: "process_cpu_user_seconds_total",
        type: "counter",
        values: [
          {
            value: 1,
            labels: {
              instanceName: "localhost",
            },
          },
        ],
        aggregator: "sum",
      }];
    });
    
    // mock master's send - this functions simulates worker -> master communication
    // mockMasterSend(workerId) returns a function that simulates sending a message from a worker to the master
    // workerId is used to mark which worker sent the message
    const mockMasterSend = (workerId) => jest.fn().mockImplementation((message) => {
      metricsAggregator.onWorkerMessage({ id: workerId }, message);
    });

    // mock worker's send - this functions simulates master -> worker communication
    // mockSendForWorker(workerId) returns a function that simulates sending a message from the master to a worker
    // workerId is used to mark which worker to send the message to
    const mockSendForWorker = (workerId) => jest.fn().mockImplementation((message) => {
      // set the cluster.worker object so that the worker can use it to send a message to the master
      cluster.worker = { id: workerId, send: mockMasterSend(workerId) };
      metricsAggregator.onMasterMessage(message);
    });
    // the functions above are used to simulate the communication between the master and the workers
    
    // set cluster.workers object to simulate multiple workers
    cluster.workers = { 
      1: { send: mockSendForWorker(1), isConnected: () => true }, 
      2: { send: mockSendForWorker(2), isConnected: () => true },
      3: { send: mockSendForWorker(3), isConnected: () => true },
      4: { send: mockSendForWorker(4), isConnected: () => true },
    };
   
    // create metrics aggregator
    const metricsAggregator = new MetricsAggregator({ prometheusRegistry: {getMetricsAsJSON: mockGetMetricsAsJSON}});
    // start metric aggregation
    const metrics = await metricsAggregator.aggregateMetrics();
    // check if the metrics are aggregated correctly
    expect(metrics).toMatch(`process_cpu_user_seconds_total\{instanceName="localhost"\} ${Object.keys(cluster.workers).length}`);
    // shutdown the metrics aggregator
    await metricsAggregator.shutdown();
  });

  it('should handle errors during getMetricsAsJSON', async () => {
    logger.setLogLevel('info');
    jest.useFakeTimers();
    // mock the getMetricsAsJSON method to return a single metric
    const mockGetMetricsAsJSON = jest.fn().mockImplementation(() => {
      throw new Error('Get metrics error');
    });
    const mockResetMetrics = jest.fn();
    
    // mock master's send - this functions simulates worker -> master communication
    // mockMasterSend(workerId) returns a function that simulates sending a message from a worker to the master
    // workerId is used to mark which worker sent the message
    const mockMasterSend = (workerId) => jest.fn().mockImplementation((message) => {
      metricsAggregator.onWorkerMessage({ id: workerId }, message);
    });

    // mock worker's send - this functions simulates master -> worker communication
    // mockSendForWorker(workerId) returns a function that simulates sending a message from the master to a worker
    // workerId is used to mark which worker to send the message to
    const mockSendForWorker = (workerId) => jest.fn().mockImplementation((message) => {
      // set the cluster.worker object so that the worker can use it to send a message to the master
      cluster.worker = { id: workerId, send: mockMasterSend(workerId) };
      metricsAggregator.onMasterMessage(message);
    });


    cluster.workers = { 
      1: { send: mockSendForWorker(1), isConnected: () => true }, 
      2: { send: mockSendForWorker(2), isConnected: () => true },
      3: { send: mockSendForWorker(3), isConnected: () => true },
      4: { send: mockSendForWorker(4), isConnected: () => true },
    };
   
    // create metrics aggregator
    const metricsAggregator = new MetricsAggregator({ prometheusRegistry: {getMetricsAsJSON: mockGetMetricsAsJSON, resetMetrics: mockResetMetrics}});
    const metrics = metricsAggregator.aggregateMetrics();
    await expect(metrics).rejects.toBeInstanceOf(Error);

    await metricsAggregator.shutdown();
    
  });

  it('should timeout a request if it takes too long', async () => {
    logger.setLogLevel('info');
    jest.useFakeTimers();
    const mockResetMetrics = jest.fn()
    // mock the getMetricsAsJSON method to return a single metric
    const mockGetMetricsAsJSON = jest.fn().mockImplementation(() => {
      return [{
        help: "Total user CPU time spent in seconds.",
        name: "process_cpu_user_seconds_total",
        type: "counter",
        values: [
          {
            value: 1,
            labels: {
              instanceName: "localhost",
            },
          },
        ],
        aggregator: "sum",
      }];
    });
    
    // mock master's send - this functions simulates worker -> master communication
    // mockMasterSend(workerId) returns a function that simulates sending a message from a worker to the master
    // workerId is used to mark which worker sent the message
    const mockMasterSend = (workerId) => jest.fn().mockImplementation((message) => {
      metricsAggregator.onWorkerMessage({ id: workerId }, message);
    });

    // mock worker's send - this functions simulates master -> worker communication
    // mockSendForWorker(workerId) returns a function that simulates sending a message from the master to a worker
    // workerId is used to mark which worker to send the message to
    const mockSendForWorker = (workerId) => jest.fn().mockImplementation((message) => {
      // set the cluster.worker object so that the worker can use it to send a message to the master
      cluster.worker = { id: workerId, send: mockMasterSend(workerId) };
      metricsAggregator.onMasterMessage(message);
    });

    const mockSendForStuckWorker = jest.fn().mockImplementation((message) => {
      // ignore the message to simulate a stuck worker
    });

    const mockSendThatErrors = jest.fn().mockImplementation((message) => {
      throw new Error('Send error');
    });

    const mockSendThatRespondsWithErrorMessage = (workerId) => jest.fn().mockImplementation((message) => {
      const requestId = message.requestId;
      metricsAggregator.onWorkerMessage({ id: workerId }, {
        type: 'rudder-transformer:getMetricsRes',
        error: 'Send error',
        requestId: requestId,
      });
    });

    cluster.workers = { 
      1: { send: mockSendForWorker(1), isConnected: () => true }, 
      2: { send: mockSendForWorker(2), isConnected: () => true },
      3: { send: mockSendThatErrors, isConnected: () => true }, // this worker should be ignored because send throws an error
      4: { send: mockSendForStuckWorker, isConnected: () => true },
    };
   
    // create metrics aggregator
    const metricsAggregator = new MetricsAggregator({ prometheusRegistry: {getMetricsAsJSON: mockGetMetricsAsJSON, resetMetrics: mockResetMetrics}});
    // first request should timeout after 10 seconds
    const metrics1 = metricsAggregator.aggregateMetrics();

    // try to send a 2nd request at the same time
    const metrics2 = metricsAggregator.aggregateMetrics();
    await expect(metrics2).rejects.toBeInstanceOf(Error); // second call should throw an error since the first request is still pending

    jest.advanceTimersByTime(11000); // advance time to trigger timeout
    await expect(metrics1).rejects.toBeInstanceOf(Error);

    // now fourth worker should respond with an error message
    cluster.workers[4].send = mockSendThatRespondsWithErrorMessage(4);
    const metrics3 = metricsAggregator.aggregateMetrics();
    await expect(metrics3).rejects.toBeInstanceOf(Error);

    // mark the problematic worker as disconnected
    cluster.workers[4].isConnected = () => false;
    const metrics4 = await metricsAggregator.aggregateMetrics();
    expect(metrics4).toMatch(`process_cpu_user_seconds_total\{instanceName="localhost"\} 2`);
    
    metricsAggregator.resetMetrics(); // reset metrics to clear the buffer
    metricsAggregator.resetMetrics(); // reset metrics to clear the buffer
    
    await metricsAggregator.shutdown();
  });

  it('should handle error in workerThread.postMessage', async () => {
    logger.setLogLevel('info');
    jest.useFakeTimers();
    // mock the getMetricsAsJSON method to return a single metric
    const mockGetMetricsAsJSON = jest.fn().mockImplementation(() => {
      return [{
        help: "Total user CPU time spent in seconds.",
        name: "process_cpu_user_seconds_total",
        type: "counter",
        values: [
          {
            value: 1,
            labels: {
              instanceName: "localhost",
            },
          },
        ],
        aggregator: "sum",
      }];
    });
    
    // mock master's send - this functions simulates worker -> master communication
    // mockMasterSend(workerId) returns a function that simulates sending a message from a worker to the master
    // workerId is used to mark which worker sent the message
    const mockMasterSend = (workerId) => jest.fn().mockImplementation((message) => {
      metricsAggregator.onWorkerMessage({ id: workerId }, message);
    });

    // mock worker's send - this functions simulates master -> worker communication
    // mockSendForWorker(workerId) returns a function that simulates sending a message from the master to a worker
    // workerId is used to mark which worker to send the message to
    const mockSendForWorker = (workerId) => jest.fn().mockImplementation((message) => {
      // set the cluster.worker object so that the worker can use it to send a message to the master
      cluster.worker = { id: workerId, send: mockMasterSend(workerId) };
      metricsAggregator.onMasterMessage(message);
    });

    cluster.workers = { 
      1: { send: mockSendForWorker(1), isConnected: () => true }, 
    };
   
    // create metrics aggregator
    const metricsAggregator = new MetricsAggregator({ prometheusRegistry: {getMetricsAsJSON: mockGetMetricsAsJSON}});
    // first request should timeout after 10 seconds
    const metrics1 = await metricsAggregator.aggregateMetrics();
    expect(metrics1).toMatch(`process_cpu_user_seconds_total\{instanceName="localhost"\} 1`);
    

    metricsAggregator.workerThread.postMessage = jest.fn().mockImplementation(() => {
      throw new Error('Post message error');
    });
    
    // it should create a new worker thread
    const metrics2 = metricsAggregator.aggregateMetrics();
    await expect(metrics2).rejects.toBeInstanceOf(Error);

    await metricsAggregator.shutdown();
  });

  it('should handle exceptional scenarios in onWorkerThreadMessage', async () => {
    logger.setLogLevel('info');
    
    // create metrics aggregator
    const metricsAggregator = new MetricsAggregator({ prometheusRegistry: {}});
    // it should ignore messages for different request IDs
    metricsAggregator.onWorkerThreadMessage({
      type: 'rudder-transformer:aggregateMetricsRes', 
      requestId: -1
    });

    // it should ignore messages if resolveFunc is not defined
    metricsAggregator.onWorkerThreadMessage({
      type: 'rudder-transformer:aggregateMetricsRes', 
      requestId: 0
    });

    metricsAggregator.resolveFunc = jest.fn();
    const mockRejectFunc = jest.fn();
    metricsAggregator.rejectFunc = mockRejectFunc;
    metricsAggregator.onWorkerThreadMessage({
      type: 'rudder-transformer:aggregateMetricsRes', 
      requestId: 0, 
      error: 'Some error'
    });
    expect(mockRejectFunc).toHaveBeenCalledWith(expect.any(Error));
    expect(metricsAggregator.resolveFunc).toBeNull();

    await metricsAggregator.shutdown();
  });

  it('should restart a worker thread that dies', async () => {
    logger.setLogLevel('info');
    jest.useFakeTimers();
    // mock the getMetricsAsJSON method to return a single metric
    const mockGetMetricsAsJSON = jest.fn().mockImplementation(() => {
      return [{
        help: "Total user CPU time spent in seconds.",
        name: "process_cpu_user_seconds_total",
        type: "counter",
        values: [
          {
            value: 1,
            labels: {
              instanceName: "localhost",
            },
          },
        ],
        aggregator: "sum",
      }];
    });
    
    // mock master's send - this functions simulates worker -> master communication
    // mockMasterSend(workerId) returns a function that simulates sending a message from a worker to the master
    // workerId is used to mark which worker sent the message
    const mockMasterSend = (workerId) => jest.fn().mockImplementation((message) => {
      metricsAggregator.onWorkerMessage({ id: workerId }, message);
    });

    // mock worker's send - this functions simulates master -> worker communication
    // mockSendForWorker(workerId) returns a function that simulates sending a message from the master to a worker
    // workerId is used to mark which worker to send the message to
    const mockSendForWorker = (workerId) => jest.fn().mockImplementation((message) => {
      // set the cluster.worker object so that the worker can use it to send a message to the master
      cluster.worker = { id: workerId, send: mockMasterSend(workerId) };
      metricsAggregator.onMasterMessage(message);
    });

    cluster.workers = { 
      1: { send: mockSendForWorker(1), isConnected: () => true }, 
    };
   
    // create metrics aggregator
    const metricsAggregator = new MetricsAggregator({ prometheusRegistry: {getMetricsAsJSON: mockGetMetricsAsJSON}});
    // first request should timeout after 10 seconds
    const metrics1 = await metricsAggregator.aggregateMetrics();
    expect(metrics1).toMatch(`process_cpu_user_seconds_total\{instanceName="localhost"\} 1`);
    
    // simulate worker thread crash
    await metricsAggregator.workerThread.terminate();

    // it should create a new worker thread
    const metrics2 = await metricsAggregator.aggregateMetrics();
    expect(metrics2).toMatch(`process_cpu_user_seconds_total\{instanceName="localhost"\} 1`);

    // simulate worker thread crash again during shutdown
    metricsAggregator.shuttingDown = true; 
    await metricsAggregator.workerThread.terminate();

    await metricsAggregator.shutdown();


  });

  it('should handle error in onWorkerMessage when handleMetricsResponse throws', async () => {
    logger.setLogLevel('info');
    const metricsAggregator = new MetricsAggregator({ prometheusRegistry: {}});
    
    // Mock handleMetricsResponse to throw an error
    const originalHandleMetricsResponse = metricsAggregator.handleMetricsResponse;
    metricsAggregator.handleMetricsResponse = jest.fn().mockImplementation(() => {
      throw new Error('handleMetricsResponse error');
    });

    // Test that onWorkerMessage handles the error gracefully
    metricsAggregator.onWorkerMessage({ id: 1 }, { type: 'rudder-transformer:getMetricsRes' });
    
    // Restore original method
    metricsAggregator.handleMetricsResponse = originalHandleMetricsResponse;
    
    await metricsAggregator.shutdown();
  });

  it('should handle error in onWorkerThreadMessage', async () => {
    logger.setLogLevel('info');
    const metricsAggregator = new MetricsAggregator({ prometheusRegistry: {}});
    
    // Mock onWorkerThreadMessage to throw an error by making message handling fail
    const originalOnWorkerThreadMessage = metricsAggregator.onWorkerThreadMessage;
    
    // Create a message that will cause an error when processed
    const errorMessage = {
      type: 'rudder-transformer:aggregateMetricsRes',
      requestId: 0
    };
    
    // Set up state to cause an error during processing
    metricsAggregator.resolveFunc = null;
    metricsAggregator.rejectFunc = null;
    
    // Make resolveFunc a non-function to cause an error
    metricsAggregator.resolveFunc = 'not a function';
    
    // This should trigger the catch block in onWorkerThreadMessage
    metricsAggregator.onWorkerThreadMessage(errorMessage);
    
    await metricsAggregator.shutdown();
  });

  it('should handle error sending error response in onMasterMessage', async () => {
    logger.setLogLevel('info');
    
    // Mock cluster.worker to throw error when sending
    const cluster = require('cluster');
    const originalWorker = cluster.worker;
    cluster.worker = {
      id: 1,
      send: jest.fn().mockImplementation(() => {
        throw new Error('Send error response failed');
      })
    };

    // Mock getMetricsAsJSON to throw an error
    const mockGetMetricsAsJSON = jest.fn().mockImplementation(() => {
      throw new Error('Get metrics error');
    });
    const mockResetMetrics = jest.fn();

    const metricsAggregator = new MetricsAggregator({ 
      prometheusRegistry: { getMetricsAsJSON: mockGetMetricsAsJSON, resetMetrics: mockResetMetrics }
    });
    
    // Call onMasterMessage with GET_METRICS_REQ - this should trigger both error paths
    await metricsAggregator.onMasterMessage({
      type: 'rudder-transformer:getMetricsReq',
      requestId: 1
    });
    
    // Restore original cluster.worker
    cluster.worker = originalWorker;
    
    await metricsAggregator.shutdown();
  });

  it('should handle error resetting metrics in worker', async () => {
    logger.setLogLevel('info');
    
    const cluster = require('cluster');
    const originalWorker = cluster.worker;
    cluster.worker = {
      id: 1,
      send: jest.fn()
    };

    // Mock resetMetrics to throw an error
    const mockResetMetrics = jest.fn().mockImplementation(() => {
      throw new Error('Reset metrics error');
    });

    const metricsAggregator = new MetricsAggregator({ 
      prometheusRegistry: { resetMetrics: mockResetMetrics }
    });
    
    // Call onMasterMessage with RESET_METRICS_REQ - this should trigger error path
    await metricsAggregator.onMasterMessage({
      type: 'rudder-transformer:resetMetricsReq'
    });
    
    // Restore original cluster.worker
    cluster.worker = originalWorker;
    
    await metricsAggregator.shutdown();
  });

  it('should register worker callbacks when not primary', async () => {
    logger.setLogLevel('info');
    
    const cluster = require('cluster');
    const originalIsPrimary = cluster.isPrimary;
    const originalWorker = cluster.worker;
    
    // Mock cluster to simulate worker process
    cluster.isPrimary = false;
    cluster.worker = {
      id: 1,
      on: jest.fn()
    };

    const metricsAggregator = new MetricsAggregator({ prometheusRegistry: {}});
    
    // This should call registerCallbacks and trigger line 142
    metricsAggregator.registerCallbacks();
    
    expect(cluster.worker.on).toHaveBeenCalledWith('message', expect.any(Function));
    
    // Restore original cluster state
    cluster.isPrimary = originalIsPrimary;
    cluster.worker = originalWorker;
    
    // Don't call shutdown since workerThread is undefined in worker mode
  });

  it('should not register periodic reset when disabled', async () => {
    logger.setLogLevel('info');
    
    const cluster = require('cluster');
    const originalIsPrimary = cluster.isPrimary;
    
    // Mock cluster to simulate primary process
    cluster.isPrimary = true;
    cluster.on = jest.fn();

    // Create metricsAggregator and mock the config property directly
    const metricsAggregator = new MetricsAggregator({ prometheusRegistry: {}});
    
    // Mock the config to disable periodic reset by setting environment variable
    const originalEnv = process.env.METRICS_AGGREGATOR_PERIODIC_RESET_ENABLED;
    process.env.METRICS_AGGREGATOR_PERIODIC_RESET_ENABLED = 'false';
    
    // Create a new instance to pick up the environment variable change
    const metricsAggregator2 = new MetricsAggregator({ prometheusRegistry: {}});
    
    // Spy on registerCallbackForPeriodicReset
    const registerSpy = jest.spyOn(metricsAggregator2, 'registerCallbackForPeriodicReset');
    
    // This should call registerCallbacks and trigger line 137 (return without periodic reset)
    metricsAggregator2.registerCallbacks();
    
    expect(registerSpy).not.toHaveBeenCalled();
    
    // Restore original state
    process.env.METRICS_AGGREGATOR_PERIODIC_RESET_ENABLED = originalEnv;
    
    await metricsAggregator.shutdown();
    await metricsAggregator2.shutdown();
  });

  it('should handle worker thread errors during shutdown', async () => {
    logger.setLogLevel('info');
    
    const metricsAggregator = new MetricsAggregator({ prometheusRegistry: {}});
    
    // Set shuttingDown to true to trigger line 165
    metricsAggregator.shuttingDown = true;
    
    // Simulate worker thread error during shutdown
    metricsAggregator.workerThread.emit('error', new Error('Worker thread error during shutdown'));
    
    await metricsAggregator.shutdown();
  });

  it('should handle worker thread exit during shutdown', async () => {
    logger.setLogLevel('info');
    
    const metricsAggregator = new MetricsAggregator({ prometheusRegistry: {}});
    
    // Set shuttingDown to true to trigger lines 172-176
    metricsAggregator.shuttingDown = true;
    
    // Simulate worker thread exit during shutdown
    metricsAggregator.workerThread.emit('exit', 1);
    
    await metricsAggregator.shutdown();
  });

  it('should skip disconnected workers when resetting metrics', async () => {
    logger.setLogLevel('info');
    
    const cluster = require('cluster');
    const originalWorkers = cluster.workers;
    const originalIsPrimary = cluster.isPrimary;
    
    // Mock cluster to simulate primary process with disconnected workers
    cluster.isPrimary = true;
    cluster.workers = {
      1: { send: jest.fn(), isConnected: () => true },
      2: { send: jest.fn(), isConnected: () => false }, // Disconnected worker
      3: { send: jest.fn(), isConnected: () => true }
    };

    const metricsAggregator = new MetricsAggregator({ prometheusRegistry: {}});
    
    // This should trigger lines 286-287 for disconnected workers
    metricsAggregator.resetMetrics();
    
    // Verify that only connected workers received the reset message
    expect(cluster.workers[1].send).toHaveBeenCalled();
    expect(cluster.workers[2].send).not.toHaveBeenCalled(); // Disconnected worker
    expect(cluster.workers[3].send).toHaveBeenCalled();
    
    // Restore original cluster state
    cluster.workers = originalWorkers;
    cluster.isPrimary = originalIsPrimary;
    
    await metricsAggregator.shutdown();
  });

  it('should return all metrics without filtering', async () => {
    logger.setLogLevel('info');
    
    const cluster = require('cluster');
    const originalWorker = cluster.worker;
    cluster.worker = {
      id: 1,
      send: jest.fn()
    };

    const mockGetMetricsAsJSON = jest.fn().mockImplementation(() => {
      return [
        {
          name: 'safe_metric',
          value: 1
        },
        {
          name: 'unsafe_metric',
          value: 2
        }
      ];
    });

    const metricsAggregator = new MetricsAggregator({ 
      prometheusRegistry: { getMetricsAsJSON: mockGetMetricsAsJSON }
    });
    
    // Call onMasterMessage with GET_METRICS_REQ
    await metricsAggregator.onMasterMessage({
      type: 'rudder-transformer:getMetricsReq',
      requestId: 1
    });
    
    // Verify that all metrics are returned without filtering
    expect(cluster.worker.send).toHaveBeenCalledWith({
      type: 'rudder-transformer:getMetricsRes',
      metrics: [
        { name: 'safe_metric', value: 1 },
        { name: 'unsafe_metric', value: 2 }
      ],
      requestId: 1
    });
    
    // Restore original state
    cluster.worker = originalWorker;
    
    await metricsAggregator.shutdown();
  });

});