const OneIVMPerTransformationIdStrategy = require('./strategies/isolate');
const PersistentIsolateStrategy = require('./strategies/persistent');
const logger = require('../../logger');

const IvmCacheStrategyFactory = {
  STRATEGIES: {
    isolate: OneIVMPerTransformationIdStrategy,
    persistent: PersistentIsolateStrategy,
  },

  /**
   * Create cache strategy based on configuration
   * @param {Object} options Strategy options
   * @returns {Object} Cache strategy instance
   */
  create(options = {}) {
    const strategyName = this.getStrategyName();
    const StrategyClass = this.STRATEGIES[strategyName];

    if (!StrategyClass) {
      logger.error('Unknown IVM cache strategy, falling back to isolate', {
        requested: strategyName,
        available: Object.keys(this.STRATEGIES),
      });

      return new OneIVMPerTransformationIdStrategy(options);
    }

    logger.info('Creating IVM cache strategy', {
      strategy: strategyName,
      options: {
        maxSize: options.maxSize || process.env.IVM_CACHE_MAX_SIZE || '100',
        ttlMs: options.ttlMs || process.env.IVM_CACHE_TTL_MS || '600000', // 10 minutes
      },
    });

    return new StrategyClass(options);
  },

  /**
   * Get strategy name from environment or default
   * @returns {string} Strategy name
   */
  getStrategyName() {
    const envStrategy = process.env.IVM_CACHE_STRATEGY || 'isolate';
    return envStrategy.toLowerCase().trim();
  },

  /**
   * Validate strategy configuration
   * @param {string} strategyName Strategy to validate
   * @returns {Object} Validation result
   */
  validateStrategy(strategyName) {
    const strategy = strategyName?.toLowerCase()?.trim();

    if (!strategy) {
      return {
        valid: false,
        error: 'Strategy name is required',
        recommendation: 'Set IVM_CACHE_STRATEGY environment variable',
      };
    }

    if (!this.STRATEGIES[strategy]) {
      return {
        valid: false,
        error: `Unknown strategy: ${strategy}`,
        available: Object.keys(this.STRATEGIES),
        recommendation: 'Use one of the available strategies',
      };
    }

    return {
      valid: true,
      strategy,
    };
  },
};

module.exports = IvmCacheStrategyFactory;
