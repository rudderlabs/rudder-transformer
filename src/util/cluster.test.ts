import cluster from 'cluster';
import { start, stuckWorkerRespawnFunc, workerShutdownFn } from './cluster';
import Koa from 'koa';

describe('cluster test', () => {
  beforeAll(() => {
    jest
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as (code?: number | undefined) => never);
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should be able to start a cluster and shutdown the cluster after killing one worker', async () => {
    if (cluster.isPrimary) {
      process.env.NUM_PROCS = '1';
      process.env.METRICS_PORT = '0';
      process.env.CLUSTER_MANAGER_SHUTDOWN_TIMEOUT = '1000';
      process.env.CLUSTER_MANAGER_MAX_KILLED_WORKER_RESTARTS = '0';
      process.env.CLUSTER_MANAGER_MAX_STUCK_WORKER_RESPAWNS = '0';
      process.env.STATS_CLIENT = 'prometheus';
      await start(0, new Koa(), new Koa());

      // wait untill all workers are started
      // wait until all workers are started
      const waitForWorkers = async (expectedCount: number, timeout = 5000) => {
        const start = Date.now();
        while (Object.keys(cluster.workers || {}).length < expectedCount) {
          if (Date.now() - start > timeout) {
            throw new Error('Timeout waiting for workers to start');
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      };
      await waitForWorkers(1);

      // kill the 1st worker
      const worker = Object.values(cluster.workers || {})[0];
      worker?.kill();

      // cluster should shutdown
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const waitForClusterShutdown = async (timeout = 5000) => {
        const start = Date.now();
        while (Object.keys(cluster.workers || {}).length > 0) {
          if (Date.now() - start > timeout) {
            throw new Error('Timeout waiting for cluster to shutdown');
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      };
      await waitForClusterShutdown();
    }
  });

  it('should be able to provide a proper stuckWorkerRespawnFunc', async () => {
    const fn = stuckWorkerRespawnFunc(1);
    expect(fn).toBeDefined();
    expect(fn()).toBe(true);
    expect(fn()).toBe(false);
  });

  it('should be able to provide a proper workerShutdownFn', async () => {
    const server = new Koa().listen(0);
    const fn = workerShutdownFn(() => server);
    expect(fn).toBeDefined();
    await expect(fn()).resolves.toBeUndefined;
    expect(server.listening).toBe(false);
  });
});
