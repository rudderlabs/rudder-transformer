const { MetricsAggregator } = require('../../src/util/metricsAggregator');
const { Worker } = require('worker_threads');
jest.mock('cluster');
const cluster = require('cluster');

describe('MetricsAggregator', () => {
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
      1: { send: mockSendForWorker(1) }, 
      2: { send: mockSendForWorker(2) },
      3: { send: mockSendForWorker(3) },
      4: { send: mockSendForWorker(4) },
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
});
