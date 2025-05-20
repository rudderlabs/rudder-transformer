import Piscina from 'piscina';
import path from 'path';
import { ProcessorTransformationRequest, UserTransformationServiceResponse } from '../../types';
import { FeatureFlags } from '../../middlewares/featureFlag';
import logger from '../../logger';
import stats from '../../util/stats';

const isTest = process.env.NODE_ENV === 'test';

type PiscinaConfig = {
  maxThreads?: number;
  minThreads?: number;
  idleTimeout?: number;
  maxQueue?: number;
  concurrentTasksPerWorker?: number;
};

class PiscinaService {
  private static instance: PiscinaService;

  private piscina: Piscina | null = null;

  private isInitialized = false;

  private metricsInterval: NodeJS.Timeout | null = null;

  private static getInstance(): PiscinaService {
    if (!PiscinaService.instance) {
      PiscinaService.instance = new PiscinaService();
    }
    return PiscinaService.instance;
  }

  private getPiscinaConfig(): PiscinaConfig {
    const config: PiscinaConfig = {};

    if (process.env.PISCINA_MAX_THREADS) {
      config.maxThreads = parseInt(process.env.PISCINA_MAX_THREADS, 10);
    }
    if (process.env.PISCINA_MIN_THREADS) {
      config.minThreads = parseInt(process.env.PISCINA_MIN_THREADS, 10);
    }
    if (process.env.PISCINA_IDLE_TIMEOUT) {
      config.idleTimeout = parseInt(process.env.PISCINA_IDLE_TIMEOUT, 10);
    }
    if (process.env.PISCINA_MAX_QUEUE) {
      config.maxQueue = parseInt(process.env.PISCINA_MAX_QUEUE, 10);
    }
    if (process.env.PISCINA_CONCURRENT_TASKS_PER_WORKER) {
      config.concurrentTasksPerWorker = parseInt(
        process.env.PISCINA_CONCURRENT_TASKS_PER_WORKER,
        10,
      );
    }

    return config;
  }

  private getPiscinaInstance(): Piscina {
    if (!this.isInitialized || !this.piscina) {
      throw new Error('Piscina worker pool not initialized. Call initialize first.');
    }
    return this.piscina;
  }

  public static initialize(): void {
    const service = PiscinaService.getInstance();

    if (!service.isInitialized) {
      const config = service.getPiscinaConfig();
      service.piscina = new Piscina({
        filename: path.resolve(__dirname, `transform${isTest ? '.ts' : '.js'}`),
        execArgv: isTest ? ['-r', 'ts-node/register'] : undefined,
        ...config,
      });
      service.isInitialized = true;
      logger.info('Piscina worker pool initialized');

      // TODO metrics
      // Start collecting Piscina metrics
      // service.startMetricsCollection();
    }
  }

  private startMetricsCollection(): void {
    if (!this.piscina) return;

    // Clear any existing interval
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }

    // Set up interval to collect metrics
    this.metricsInterval = setInterval(() => {
      try {
        // Get queue size from Piscina instance
        const queueSize = this.piscina?.queueSize || 0;

        // Update queue size
        stats.gauge('piscina_queue_size', queueSize);
      } catch (error) {
        logger.error('Error collecting Piscina metrics:', error);
      }
    }, 5000); // Collect metrics every 5 seconds
  }

  public static async terminate(): Promise<void> {
    const service = PiscinaService.getInstance();

    if (service.isInitialized && service.piscina) {
      logger.info('Terminating Piscina worker pool');
      // Clear metrics interval
      if (service.metricsInterval) {
        clearInterval(service.metricsInterval);
        service.metricsInterval = null;
      }
      await service.piscina.destroy();
      service.piscina = null;
      service.isInitialized = false;
    }
  }

  public static async transform(
    events: ProcessorTransformationRequest[],
    features: FeatureFlags,
    requestSize: number,
  ): Promise<UserTransformationServiceResponse> {
    const service = PiscinaService.getInstance();
    return service.getPiscinaInstance().run({ events, features, requestSize });
  }

  public static async transformWithRawBody(
    body: string,
    features: FeatureFlags,
    requestSize: number,
  ): Promise<UserTransformationServiceResponse> {
    const service = PiscinaService.getInstance();
    return service.getPiscinaInstance().run({ body, features, requestSize });
  }
}

export const initializePiscina = PiscinaService.initialize;
export const terminatePiscina = PiscinaService.terminate;
export const transformWithPiscina = PiscinaService.transform;
export const transformWithPiscinaRawBody = PiscinaService.transformWithRawBody;
