/* istanbul ignore file */

const logger = require('../src/logger');

logger.setLogLevel(Number.POSITIVE_INFINITY);

const debug = (...args) => {
  logger.setLogLevel('debug');
  logger.debug(...args);
  logger.setLogLevel(Number.POSITIVE_INFINITY);
};

const info = (...args) => {
  logger.setLogLevel('info');
  logger.info(...args);
  logger.setLogLevel(Number.POSITIVE_INFINITY);
};

const warn = (...args) => {
  logger.setLogLevel('warn');
  logger.warn(...args);
  logger.setLogLevel(Number.POSITIVE_INFINITY);
};

const error = (...args) => {
  logger.setLogLevel('error');
  logger.error(...args);
  logger.setLogLevel(Number.POSITIVE_INFINITY);
};

module.exports = {
  debug,
  info,
  warn,
  error,
};
