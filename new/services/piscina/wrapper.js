const Piscina = require('piscina');
const path = require('path');

/**
 * Configuration options for Piscina
 * @typedef {Object} PiscinaConfig
 * @property {number} [maxThreads] - Maximum number of threads
 * @property {number} [minThreads] - Minimum number of threads
 * @property {number} [idleTimeout] - Idle timeout in milliseconds
 * @property {number} [concurrentTasksPerWorker] - Number of concurrent tasks per worker
 */

/**
 * Service class for managing Piscina worker pool
 */
class PiscinaService {
  static instance;
  
  /**
   * Get the singleton instance of PiscinaService
   * @returns {PiscinaService}
   */
  static getInstance() {
    if (!PiscinaService.instance) {
      PiscinaService.instance = new PiscinaService();
    }
    return PiscinaService.instance;
  }
  
  constructor() {
    this.piscina = null;
    this.isInitialized = false;
  }
  
  /**
   * Get Piscina configuration from environment variables
   * @returns {PiscinaConfig}
   */
  getPiscinaConfig() {
    const config = {};
    
    if (process.env.PISCINA_MAX_THREADS) {
      config.maxThreads = parseInt(process.env.PISCINA_MAX_THREADS, 10);
    }
    
    if (process.env.PISCINA_MIN_THREADS) {
      config.minThreads = parseInt(process.env.PISCINA_MIN_THREADS, 10);
    }
    
    if (process.env.PISCINA_IDLE_TIMEOUT) {
      config.idleTimeout = parseInt(process.env.PISCINA_IDLE_TIMEOUT, 10);
    }
    
    if (process.env.PISCINA_CONCURRENT_TASKS_PER_WORKER) {
      config.concurrentTasksPerWorker = parseInt(process.env.PISCINA_CONCURRENT_TASKS_PER_WORKER, 10);
    }
    
    return config;
  }
  
  /**
   * Get the Piscina instance, throwing an error if not initialized
   * @returns {Piscina}
   */
  getPiscinaInstance() {
    if (!this.isInitialized || !this.piscina) {
      throw new Error('Piscina worker pool not initialized. Call initialize first.');
    }
    return this.piscina;
  }
  
  /**
   * Initialize the Piscina worker pool
   */
  static initialize() {
    const service = PiscinaService.getInstance();
    
    if (!service.isInitialized) {
      const config = service.getPiscinaConfig();
      service.piscina = new Piscina({
        filename: path.resolve(__dirname, 'transform.js'),
        ...config,
      });
      service.isInitialized = true;
      console.log('Piscina worker pool initialized', config);
    }
  }
  
  /**
   * Terminate the Piscina worker pool
   * @returns {Promise<void>}
   */
  static async terminate() {
    const service = PiscinaService.getInstance();
    
    if (service.isInitialized && service.piscina) {
      console.log('Terminating Piscina worker pool');
      await service.piscina.destroy();
      service.piscina = null;
      service.isInitialized = false;
    }
  }
  
  /**
   * Transform events using Piscina worker pool
   * @param {string} body - Request body containing the events to transform
   * @param {Object} features - Feature flags
   * @param {number} requestSize - Request size
   * @returns {Promise<Object>}
   */
  static async transform(body, features = {}, requestSize = 0) {
    const service = PiscinaService.getInstance();
    return service.getPiscinaInstance().run({ body, features, requestSize });
  }
}

module.exports = {
  initializePiscina: PiscinaService.initialize,
  terminatePiscina: PiscinaService.terminate,
  transformWithPiscina: PiscinaService.transform,
};