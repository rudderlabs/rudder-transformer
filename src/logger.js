/* istanbul ignore file */
const { LOGLEVELS, structuredLogger } = require('@rudderstack/integrations-lib');
const { getMatchedMetadata } = require('./util/logger');
// LOGGER_IMPL can be `console` or `winston`
const loggerImpl = process.env.LOGGER_IMPL ?? 'winston';

let logLevel = (process.env.LOG_LEVEL ?? 'error').toLowerCase();

const logger = structuredLogger({
  level: logLevel,
  fillExcept: [
    'destinationId',
    'sourceId',
    'destinationType',
    'workspaceId',
    'module',
    'implementation',
    'feature',
    'destType',
  ],
});

const getLogger = () => {
  switch (loggerImpl) {
    case 'winston':
      return logger;
    case 'console':
      return console;
  }
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
  const destType = reqMeta?.destType || reqMeta?.destinationType;
  return {
    ...(reqMeta?.destinationId && { destinationId: reqMeta.destinationId }),
    ...(reqMeta?.sourceId && { sourceId: reqMeta.sourceId }),
    ...(reqMeta?.workspaceId && { workspaceId: reqMeta.workspaceId }),
    ...(destType && { destType }),
    ...(reqMeta?.module && { module: reqMeta.module }),
    ...(reqMeta?.implementation && { implementation: reqMeta.implementation }),
    ...(reqMeta?.feature && { feature: reqMeta.feature }),
  };
};

const formLogArgs = (args) => {
  let msg = '';
  let otherArgs = [];
  args.forEach((arg) => {
    if (typeof arg !== 'object') {
      msg += ' ' + arg;
      return;
    }
    otherArgs.push(arg);
  });
  return [msg, ...otherArgs];
};

/**
 * Perform logging operation on logMethod passed
 *
 * **Good practices**:
 * - Do not have more than one array args in logger
 * @param {*} logMethod
 *  - instance method reference
 *  - The logger should implement all of debug/info/warn/error methods
 * @param {*} logArgs
 *  - the arguments that needs to be passed to logger instance method
 */
const log = (logMethod, logArgs) => {
  const [message, ...args] = formLogArgs(logArgs);
  const [logInfo, ...otherArgs] = args;
  if (logInfo) {
    const { metadata, ...otherLogInfoArgs } = logInfo;
    if (Array.isArray(metadata)) {
      metadata
        .filter((m) => typeof m === 'object' && !Array.isArray(m))
        .forEach((m) => {
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
  if (LOGLEVELS.debug <= LOGLEVELS[logLevel]) {
    log(logger.debug, args);
  }
};

const info = (...args) => {
  const logger = getLogger();
  if (LOGLEVELS.info <= LOGLEVELS[logLevel]) {
    log(logger.info, args);
  }
};

const warn = (...args) => {
  const logger = getLogger();
  if (LOGLEVELS.warn <= LOGLEVELS[logLevel]) {
    log(logger.warn, args);
  }
};

const error = (...args) => {
  const logger = getLogger();
  if (LOGLEVELS.error <= LOGLEVELS[logLevel]) {
    log(logger.error, args);
  }
};

const requestLog = (identifierMsg, { metadata, requestDetails: { url, body, method } }) => {
  const logger = getLogger();
  const filteredMetadata = getMatchedMetadata(metadata);
  if (filteredMetadata.length > 0) {
    const reqLogArgs = [identifierMsg, { metadata: filteredMetadata, url, body, method }];
    log(logger.info, reqLogArgs);
  }
};

const responseLog = (identifierMsg, { metadata, responseDetails: { body, status, headers } }) => {
  const logger = getLogger();
  const filteredMetadata = getMatchedMetadata(metadata);
  if (filteredMetadata.length > 0) {
    const resLogArgs = [identifierMsg, { metadata: filteredMetadata, body, status, headers }];
    log(logger.info, resLogArgs);
  }
};

module.exports = {
  debug,
  info,
  warn,
  error,
  setLogLevel,
  responseLog,
  getLogMetadata,
  requestLog,
};
