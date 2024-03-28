/* istanbul ignore file */

const logger = require('../src/logger');

logger.setLogLevel(Number.POSITIVE_INFINITY);

const debug = (...args) => {
  logger.setLogLevel(logger.levelDebug);
  logger.debugw(...args);
  logger.setLogLevel(Number.POSITIVE_INFINITY);
};

const info = (...args) => {
  logger.setLogLevel(logger.levelInfo);
  logger.infow(...args);
  logger.setLogLevel(Number.POSITIVE_INFINITY);
};

const warn = (...args) => {
  logger.setLogLevel(logger.levelWarn);
  logger.warn(...args);
  logger.setLogLevel(Number.POSITIVE_INFINITY);
};

const error = (...args) => {
  logger.setLogLevel(logger.levelError);
  logger.errorw(...args);
  logger.setLogLevel(Number.POSITIVE_INFINITY);
};

module.exports = {
  debug,
  info,
  warn,
  error,
};
