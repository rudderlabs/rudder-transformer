const dotenv = require('dotenv');

/* istanbul ignore file */
const { /* LOGLEVELS */ structuredLogger } = require('@rudderstack/integrations-lib');

const LOGLEVELS = {
  debug: 0, // Most verbose logging level
  info: 1, // Logs about state of the application
  warn: 2, // Logs about warnings which dont immediately halt the application
  error: 3, // Logs about errors which dont immediately halt the application
};

// any value greater than levelError will work as levelNone
const loggerImpl = process.env.LOGGER_IMPL ?? 'winston';

let logLevel = process.env.LOG_LEVEL ?? 'error';

const logger = structuredLogger({ level: logLevel });

logger.error('(error) Loglevel is:', logLevel);
logger.warn('(warn) Loglevel is:', logLevel);

const getLogger = () => {
  return loggerImpl === 'winston' ? logger : console;
};

const setLogLevel = (level) => {
  const logger = getLogger();
  logLevel = level || logLevel;
  logger?.setLogLevel(logLevel);
};

/**
 * obtains the metadata for logging
 *
 * @param {*} metadata
 * @returns { destinationId:string, sourceId:string, workspaceId: string, destType:string, module:string, implementation:string, feature:string }
 */
const getLogMetadata = (metadata) => {
  let reqMeta = metadata;
  if (Array.isArray(metadata)) {
    [reqMeta] = metadata;
  }
  return {
    ...(reqMeta?.destinationId && { destinationId: reqMeta.destinationId }),
    ...(reqMeta?.sourceId && { sourceId: reqMeta.sourceId }),
    ...(reqMeta?.workspaceId && { workspaceId: reqMeta.workspaceId }),
    ...(reqMeta?.destType && { destType: reqMeta.destType }),
    ...(reqMeta?.module && { module: reqMeta.module }),
    ...(reqMeta?.implementation && { implementation: reqMeta.implementation }),
    ...(reqMeta?.feature && { feature: reqMeta.feature }),
  };
};

const log = (logMethod, args) => {
  const [message, logInfo, ...otherArgs] = args;
  if (logInfo) {
    const { metadata, ...otherLogInfoArgs } = logInfo;
    if (Array.isArray(metadata)) {
      metadata.forEach((m) => {
        logMethod(
          message,
          {
            ...getLogMetadata(m),
            ...otherLogInfoArgs,
          },
          ...otherArgs,
        );
      });
      return;
    }
    logMethod(
      message,
      {
        ...getLogMetadata(metadata),
        ...otherLogInfoArgs,
      },
      ...otherArgs,
    );
    return;
  }
  logMethod(message);
};

const debug = (...args) => {
  const logger = getLogger();
  if (LOGLEVELS.debug >= logLevel) {
    log(logger.debug, args);
  }
};

const info = (...args) => {
  const logger = getLogger();
  if (LOGLEVELS.info >= LOGLEVELS[logLevel]) {
    log(logger.info, args);
  }
};

const warn = (...args) => {
  const logger = getLogger();
  if (LOGLEVELS.warn >= LOGLEVELS[logLevel]) {
    log(logger.warn, args);
  }
};

const error = (...args) => {
  const logger = getLogger();
  if (LOGLEVELS.error >= LOGLEVELS[logLevel]) {
    log(logger.error, args);
  }
};

const requestLog = (identifierMsg, { metadata, requestDetails: { url, body, method } }) => {
  const logger = getLogger();
  if (LOGLEVELS[logLevel] === LOGLEVELS.warn) {
    const reqLogArgs = [identifierMsg, { metadata, url, body, method }];
    log(logger.warn, reqLogArgs);
  }
};

const responseLog = (
  identifierMsg,
  { metadata, responseDetails: { response: body, status, headers } },
) => {
  const logger = getLogger();
  if (LOGLEVELS[logLevel] === LOGLEVELS.warn) {
    const resLogArgs = [identifierMsg, { metadata, body, status, headers }];
    log(logger.warn, resLogArgs);
  }
};

module.exports = {
  debug,
  info,
  warn,
  error,
  setLogLevel,
  // levelDebug,
  // levelInfo,
  // levelWarn,
  // levelError,
  responseLog,
  getLogMetadata,
  requestLog,
};
