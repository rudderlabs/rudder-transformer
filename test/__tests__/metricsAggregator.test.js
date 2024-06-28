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
});
