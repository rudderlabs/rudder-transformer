import gracefulShutdown from 'http-graceful-shutdown';
import { ClusterManager } from '@rudderstack/integrations-lib';
import logger from '../logger';
import { logProcessInfo } from './utils';
import { RedisDB } from './redis/redisConnector';
import { shutdownMetricsClient } from './stats';

/**
 * workerShutdownFn is called during worker shutdown.
 * It will log the process info, shutdown the http server, shutdown the metrics client,
 * and disconnect the Redis client.
 * @param {() => any} serverFn a function that returns the http server instance
 * @returns an async function that will be called during worker shutdown
 */
export function workerShutdownFn(serverFn: () => any): (signal?: string) => Promise<void> {
  return async () => {
    // This function runs on each worker process during shutdown
    logProcessInfo();
    logger.info(`Shutting down http server for worker (pid: ${process.pid})`);
    const shutdownServer = gracefulShutdown(serverFn(), {
      signals: '', // no signals to listen for
      timeout: 30000, // timeout: 30 secs
    });
    await shutdownServer();
    logger.info(`Shutting down metrics client for worker (pid: ${process.pid})`);
    await shutdownMetricsClient();
    logger.info(`Shutting down redis client for worker (pid: ${process.pid})`);
    await RedisDB.disconnect();
  };
}

/**
 * stuckWorkerRespawnFunc generates a function that is called when a worker is stuck.
 * It will return true if the worker should be respawned, and false if the maximum
 * number of stuck worker respawns has been reached. The generated function will return
 * true up to the specified maximum number of respawns, after which it will return false.
 *
 * @param {number} maxStuckWorkerRespawns the maximum number of times a stuck
 * worker can be respawned
 */
export function stuckWorkerRespawnFunc(maxStuckWorkerRespawns: number): () => boolean {
  let stuckWorkerRespawns = 0; // Counter for stuck worker respawns
  return () => {
    if (stuckWorkerRespawns < maxStuckWorkerRespawns) {
      stuckWorkerRespawns += 1;
      return true; // Indicate that the worker should be respawned
    }
    return false; // Do not respawn the worker if the limit is reached
  };
}

/**
 * Start the cluster manager.
 *
 * The following environment variables can be set to configure the cluster manager:
 * - `NUM_PROCS`: Number of worker processes to spawn (default: 1)
 * - `CLUSTER_MANAGER_SHUTDOWN_TIMEOUT`: Maximum time in ms to wait for graceful shutdown (default: 30000)
 * - `CLUSTER_MANAGER_MAX_KILLED_WORKER_RESTARTS`: Maximum number of times a worker that dies unexpectedly will be restarted (default: 3)
 * - `CLUSTER_MANAGER_MAX_STUCK_WORKER_RESPAWNS`: Maximum number of times stuck workers will be respawned (default: 3)
 * - `STATS_CLIENT`: If set to 'prometheus', a metrics app will be started on a different port METRICS_PORT (default: 9091).
 *
 * @param {*} port the port to start the app on
 * @param {*} app the app instance
 * @param {*} metricsApp the app instance for metrics, it will be started on a different port (METRICS_PORT)
 */
export async function start(port: any, app: any, metricsApp: any) {
  // Enable diagnostic reporting on SIGUSR2 signal for debugging stuck processes
  if (process.report) {
    process.report.reportOnSignal = true;
  }

  const numWorkers = parseInt(process.env.NUM_PROCS || '1', 10);

  const metricsPort = parseInt(process.env.METRICS_PORT || '9091', 10);

  // Set the maximum number of ms to wait for graceful shutdown
  const shutdownTimeout = parseInt(process.env.CLUSTER_MANAGER_SHUTDOWN_TIMEOUT || '30000', 10);

  // Set the maximum number of times that a worker that dies unexpectedly will be restarted.
  // If the worker dies more than this number of times, the cluster will shutdown.
  const maxKilledWorkerRestarts = parseInt(
    process.env.CLUSTER_MANAGER_MAX_KILLED_WORKER_RESTARTS || '3',
    10,
  );

  // Set the maximum number of times that stuck workers will be respawned.
  // Any more than this number of times, the cluster will shutdown.
  const maxStuckWorkerRespawns = parseInt(
    process.env.CLUSTER_MANAGER_MAX_STUCK_WORKER_RESPAWNS || '3',
    10,
  );

  const getSerialization = () => {
    if (process.env.CLUSTER_MANAGER_SERIALIZATION === 'json') {
      return 'json';
    }
    return 'advanced';
  };

  const usePrometheus = process.env.STATS_CLIENT === 'prometheus';
  let server: any = null; // Will hold the http server instance
  const clusterManager = new ClusterManager({
    numWorkers,
    pingFrequency: 10000, // 10 seconds
    pingTimeout: 90000, // 90 seconds
    stuckWorkerRespawnFunc: stuckWorkerRespawnFunc(maxStuckWorkerRespawns),
    restartMaxTimes: maxKilledWorkerRestarts,
    shutdownTimeout,
    shutdownSignals: ['SIGINT', 'SIGTERM'],
    primaryFn: () => {
      // This function runs on the primary process
      if (usePrometheus) {
        server = metricsApp.listen(metricsPort);
      }
    },
    primaryShutdownFn: async () => {
      // This function runs on the primary process during shutdown
      logProcessInfo();
      if (server) {
        logger.info('Shutting down metrics http server on primary process');
        const shutdownServer = gracefulShutdown(server, {
          signals: '', // no signals to listen for
          timeout: 30000, // timeout: 30 secs
        });
        await shutdownServer();
        logger.info('Shutting down metrics client on primary process');
        await shutdownMetricsClient();
      }
    },
    workerFn: () => {
      // This function runs on each worker process
      server = app.listen(port);
    },
    workerShutdownFn: workerShutdownFn(() => server),
    serialization: getSerialization(),
  });

  await clusterManager.start();
}
