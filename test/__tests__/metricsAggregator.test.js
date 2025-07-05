const { MetricsAggregator } = require('../../src/util/metricsAggregator');
const logger = require('../../src/logger');
const { Worker } = require('worker_threads');
jest.mock('cluster');
const cluster = require('cluster');
const exp = require('constants');
const { set } = require('lodash');
const { error } = require('console');
const { any } = require('is');

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
    const mockMetrics = [{
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
    const mockGetMetricsAsJSON = jest.fn().mockImplementation(() => mockMetrics);
    
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
    const metricsAggregator = new MetricsAggregator({ 
      prometheusRegistry: {getMetricsAsJSON: mockGetMetricsAsJSON},
      getChangedMetricsAsJSON: jest.fn().mockResolvedValue(mockMetrics),
      clearMetrics: jest.fn()
    });
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
    const metricsAggregator = new MetricsAggregator({ 
      prometheusRegistry: {getMetricsAsJSON: mockGetMetricsAsJSON},
      getChangedMetricsAsJSON: jest.fn().mockRejectedValue(new Error('Get metrics error')),
      clearMetrics: jest.fn()
    });
    const metrics = metricsAggregator.aggregateMetrics();
    await expect(metrics).rejects.toBeInstanceOf(Error);

    await metricsAggregator.shutdown();

  });

  it('should timeout a request if it takes too long', async () => {
    logger.setLogLevel('info');
    jest.useFakeTimers();
    const mockResetMetrics = jest.fn()
    // mock the getMetricsAsJSON method to return a single metric
    const mockMetrics = [{
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
    const mockGetMetricsAsJSON = jest.fn().mockImplementation(() => mockMetrics);
    
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
    const metricsAggregator = new MetricsAggregator({ 
      prometheusRegistry: {getMetricsAsJSON: mockGetMetricsAsJSON, resetMetrics: mockResetMetrics},
      getChangedMetricsAsJSON: jest.fn().mockResolvedValue(mockMetrics),
      clearMetrics: jest.fn()
    });
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

  it('should handle an error in workerThread.postMessage', async () => {
    logger.setLogLevel('info');
    jest.useFakeTimers();
    // mock the getMetricsAsJSON method to return a single metric
    const mockMetrics = [{
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
    const mockGetMetricsAsJSON = jest.fn().mockImplementation(() => mockMetrics);
    
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
    const metricsAggregator = new MetricsAggregator({ 
      prometheusRegistry: {getMetricsAsJSON: mockGetMetricsAsJSON},
      getChangedMetricsAsJSON: jest.fn().mockResolvedValue(mockMetrics),
      clearMetrics: jest.fn()
    });
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
    const metricsAggregator = new MetricsAggregator({ 
      prometheusRegistry: {},
      getChangedMetricsAsJSON: jest.fn().mockResolvedValue([]),
      clearMetrics: jest.fn()
    });
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
    mockRejectFunc = jest.fn();
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
    const mockMetrics = [{
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
    const mockGetMetricsAsJSON = jest.fn().mockImplementation(() => mockMetrics);
    
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
    const metricsAggregator = new MetricsAggregator({ 
      prometheusRegistry: {getMetricsAsJSON: mockGetMetricsAsJSON},
      getChangedMetricsAsJSON: jest.fn().mockResolvedValue(mockMetrics),
      clearMetrics: jest.fn()
    });
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

});
