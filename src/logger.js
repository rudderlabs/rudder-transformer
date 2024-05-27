/* istanbul ignore file */
const { structuredLogger: logger } = require('@rudderstack/integrations-lib');
const { getLoggableData } = require('./v0/util');

const levelDebug = 0; // Most verbose logging level
const levelInfo = 1; // Logs about state of the application
const levelWarn = 2; // Logs about warnings which dont immediately halt the application
const levelError = 3; // Logs about errors which dont immediately halt the application
// any value greater than levelError will work as levelNone
const loggerImpl = process.env.LOGGER_IMPL ?? 'winston';

let logLevel = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL, 10) : levelInfo;

const setLogLevel = (level) => {
  const logger = getLogger();
  logLevel = level || logLevel;
  logger?.setLogLevel(`${loglevel}`);
};

const getLogger = () => {
  return loggerImpl === 'winston' ? logger : console;
};

const debug = (...args) => {
  const logger = getLogger();
  if (levelDebug >= logLevel) {
    logger.debug(...args);
  }
};

const info = (...args) => {
  const logger = getLogger();
  if (levelInfo >= logLevel) {
    logger.info(...args);
  }
};

const warn = (...args) => {
  const logger = getLogger();
  if (levelWarn >= logLevel) {
    logger.warn(...args);
  }
};

const error = (...args) => {
  const logger = getLogger();
  if (levelError >= logLevel) {
    logger.error(...args);
  }
};

const responseLog = (
  identifierMsg,
  { metadata, responseDetails: { response: responseBody, status, headers: responseHeaders } },
) => {
  const logger = getLogger();
  if (levelError >= logLevel) {
    logger.debug(identifierMsg, {
      ...getLoggableData(metadata),
      ...(responseBody ? { responseBody } : {}),
      ...(responseHeaders ? { responseHeaders } : {}),
      status,
    });
  }
};

module.exports = {
  debug,
  info,
  warn,
  error,
  setLogLevel,
  levelDebug,
  levelInfo,
  levelWarn,
  levelError,
  responseLog,
};
