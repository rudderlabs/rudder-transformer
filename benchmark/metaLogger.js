/* istanbul ignore file */

const logger = require('../src/logger');

logger.setLogLevel('random');

const debug = (...args) => {
  logger.setLogLevel('debug');
  logger.debug(...args);
  logger.setLogLevel('random');
};

const info = (...args) => {
  logger.setLogLevel('info');
  logger.info(...args);
  logger.setLogLevel('random');
};

const warn = (...args) => {
  logger.setLogLevel('warn');
  logger.warn(...args);
  logger.setLogLevel('random');
};

const error = (...args) => {
  logger.setLogLevel('error');
  logger.error(...args);
  logger.setLogLevel('random');
};

module.exports = {
  debug,
  info,
  warn,
  error,
};
