const NodeCache = require('node-cache');
const {
  deleteFunction,
  deployFunction,
  invokeFunction,
  checkFunctionHealth,
} = require('./faasApi');
const logger = require('../../logger');
const { RetryRequestError, RespStatusError } = require('../utils');
const stats = require('../stats');
const { getMetadata, getTransformationMetadata } = require('../../v0/util');
const { HTTP_STATUS_CODES } = require('../../v0/util/constant');

const FAAS_BASE_IMG = process.env.FAAS_BASE_IMG || 'rudderlabs/openfaas-flask:main';
const FAAS_MAX_PODS_IN_TEXT = process.env.FAAS_MAX_PODS_IN_TEXT || '40';
const FAAS_MIN_PODS_IN_TEXT = process.env.FAAS_MIN_PODS_IN_TEXT || '1';
const FAAS_REQUESTS_CPU = process.env.FAAS_REQUESTS_CPU || '0.5';
const FAAS_REQUESTS_MEMORY = process.env.FAAS_REQUESTS_MEMORY || '140Mi';
const FAAS_LIMITS_CPU = process.env.FAAS_LIMITS_CPU || FAAS_REQUESTS_CPU;
const FAAS_LIMITS_MEMORY = process.env.FAAS_LIMITS_MEMORY || FAAS_REQUESTS_MEMORY;
const FAAS_MAX_INFLIGHT = process.env.FAAS_MAX_INFLIGHT || '4';
const FAAS_EXEC_TIMEOUT = process.env.FAAS_EXEC_TIMEOUT || '4s';
const FAAS_ENABLE_WATCHDOG_ENV_VARS = process.env.FAAS_ENABLE_WATCHDOG_ENV_VARS || 'true';
const CONFIG_BACKEND_URL = process.env.CONFIG_BACKEND_URL || 'https://api.rudderlabs.com';
const GEOLOCATION_URL = process.env.GEOLOCATION_URL || '';
const FAAS_AST_VID = 'ast';
const FAAS_AST_FN_NAME = 'fn-ast';
const CUSTOM_NETWORK_POLICY_WORKSPACE_IDS = process.env.CUSTOM_NETWORK_POLICY_WORKSPACE_IDS || '';
const customNetworkPolicyWorkspaceIds = CUSTOM_NETWORK_POLICY_WORKSPACE_IDS.split(',');

// Initialise node cache
const functionListCache = new NodeCache();
const FUNC_LIST_KEY = 'fn-list';
functionListCache.set(FUNC_LIST_KEY, []);

const DEFAULT_RETRY_DELAY_MS = 2000;
const DEFAULT_RETRY_THRESHOLD = 2;

const delayInMs = async (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

const callWithRetry = async (
  fn,
  count = 0,
  delay = DEFAULT_RETRY_DELAY_MS,
  retryThreshold = DEFAULT_RETRY_THRESHOLD,
  ...args
) => {
  try {
    return await fn(...args);
  } catch (err) {
    if (count > retryThreshold) {
      throw err;
    }
    await delayInMs(delay);
    return callWithRetry(fn, count + 1, delay, retryThreshold, args);
  }
};

const awaitFunctionReadiness = async (
  functionName,
  maxWaitInMs = 22000,
  waitBetweenIntervalsInMs = 250,
) => {
  const executionPromise = new Promise(async (resolve) => {
    try {
      await callWithRetry(
        checkFunctionHealth,
        0,
        waitBetweenIntervalsInMs,
        Math.floor(maxWaitInMs / waitBetweenIntervalsInMs),
        functionName,
      );

      resolve(true);
    } catch (error) {
      logger.error(`Error while waiting for function ${functionName} to be ready: ${error}`);
      resolve(error.message);
    }
  });

  let setTimeoutHandle;
  const timeoutPromise = new Promise((resolve) => {
    setTimeoutHandle = setTimeout(() => {
      resolve('Timedout');
    }, maxWaitInMs);
  });

  return Promise.race([executionPromise, timeoutPromise]).finally(() =>
    clearTimeout(setTimeoutHandle),
  );
};

const isFunctionDeployed = (functionName) => {
  const funcList = functionListCache.get(FUNC_LIST_KEY) || [];
  return funcList.includes(functionName);
};

const setFunctionInCache = (functionName) => {
  const funcList = functionListCache.get(FUNC_LIST_KEY) || [];
  if (funcList.includes(functionName)) return;
  const funcListSet = new Set(funcList);
  funcListSet.add(functionName);
  functionListCache.set(FUNC_LIST_KEY, Array.from(funcListSet));
};

const removeFunctionFromCache = (functionName) => {
  const funcList = functionListCache.get(FUNC_LIST_KEY) || [];
  if (!funcList.includes(functionName)) return;
  const funcListSet = new Set(funcList);
  funcListSet.delete(functionName);
  functionListCache.set(FUNC_LIST_KEY, Array.from(funcListSet));
};

const invalidateFnCache = () => {
  functionListCache.set(FUNC_LIST_KEY, []);
};

const deployFaasFunction = async (
  functionName,
  code,
  versionId,
  libraryVersionIDs,
  testMode,
  trMetadata = {},
) => {
  try {
    logger.debug('[Faas] Deploying a faas function');
    let envProcess = 'python index.py';

    const lvidsString = libraryVersionIDs.join(',');

    if (!testMode) {
      envProcess = `${envProcess} --vid ${versionId} --config-backend-url ${CONFIG_BACKEND_URL} --lvids "${lvidsString}"`;
    } else {
      envProcess = `${envProcess} --code "${code}" --config-backend-url ${CONFIG_BACKEND_URL} --lvids "${lvidsString}"`;
    }

    const envVars = {};
    if (FAAS_ENABLE_WATCHDOG_ENV_VARS.trim().toLowerCase() === 'true') {
      envVars.max_inflight = FAAS_MAX_INFLIGHT;
      envVars.exec_timeout = FAAS_EXEC_TIMEOUT;
    }
    if (GEOLOCATION_URL) {
      envVars.geolocation_url = GEOLOCATION_URL;
    }
    // labels
    const labels = {
      'openfaas-fn': 'true',
      'parent-component': 'openfaas',
      'com.openfaas.scale.max': FAAS_MAX_PODS_IN_TEXT,
      'com.openfaas.scale.min': FAAS_MIN_PODS_IN_TEXT,
      transformationId: trMetadata.transformationId,
      workspaceId: trMetadata.workspaceId,
    };
    if (
      trMetadata.workspaceId &&
      customNetworkPolicyWorkspaceIds.includes(trMetadata.workspaceId)
    ) {
      labels['custom-network-policy'] = 'true';
    }

    // TODO: investigate and add more required labels and annotations
    const payload = {
      service: functionName,
      name: functionName,
      image: FAAS_BASE_IMG,
      envProcess,
      envVars,
      labels,
      annotations: {
        'prometheus.io.scrape': 'true',
      },
      limits: {
        memory: FAAS_LIMITS_MEMORY,
        cpu: FAAS_LIMITS_CPU,
      },
      requests: {
        memory: FAAS_REQUESTS_MEMORY,
        cpu: FAAS_REQUESTS_CPU,
      },
    };

    await deployFunction(payload);
    logger.debug('[Faas] Deployed a faas function');
  } catch (error) {
    logger.error(`[Faas] Error while deploying ${functionName}: ${error.message}`);
    // To handle concurrent create requests,
    // throw retry error if deployment or service already exists so that request can be retried
    if (
      (error.statusCode === 500 || error.statusCode === 400) &&
      error.message.includes('already exists')
    ) {
      setFunctionInCache(functionName);
      throw new RetryRequestError(`${functionName} already exists`);
    }
    throw error;
  }
};

async function setupFaasFunction(
  functionName,
  code,
  versionId,
  libraryVersionIDs,
  testMode,
  trMetadata = {},
) {
  try {
    if (!testMode && isFunctionDeployed(functionName)) {
      logger.debug(`[Faas] Function ${functionName} already deployed`);
      return;
    }
    // deploy faas function
    await deployFaasFunction(
      functionName,
      code,
      versionId,
      libraryVersionIDs,
      testMode,
      trMetadata,
    );

    // This api call is only used to check if function is spinned correctly
    await awaitFunctionReadiness(functionName);

    setFunctionInCache(functionName);
    logger.debug(`[Faas] Finished deploying faas function ${functionName}`);
  } catch (error) {
    logger.error(`[Faas] Error while setting function ${functionName}: ${error.message}`);
    throw error;
  }
}

const executeFaasFunction = async (
  name,
  events,
  versionId,
  libraryVersionIDs,
  testMode,
  trMetadata = {},
) => {
  logger.debug(`Executing faas function: ${name}`);

  const startTime = new Date();
  let errorRaised;

  try {
    if (testMode) await awaitFunctionReadiness(name);
    return await invokeFunction(name, events);

  } catch (error) {
    logger.error(`Error while invoking ${name}: ${error.message}`);
    errorRaised = error;

    if (
      error.statusCode === 404 &&
      error.message.includes(`error finding function ${name}`)
    ) {
      removeFunctionFromCache(name);
      await setupFaasFunction(
        name,
        null,
        versionId,
        libraryVersionIDs,
        testMode,
        trMetadata,
      );
      throw new RetryRequestError(`${name} not found`);
    }

    if (error.statusCode === 429) {
      throw new RetryRequestError(`Rate limit exceeded for ${name}`);
    }

    if (error.statusCode === 500 || error.statusCode === 503) {
      throw new RetryRequestError(error.message);
    }

    if (error.statusCode === 504) {
      throw new RespStatusError(`${name} timed out`, 504);
    }

    throw error;
  } finally {
    // delete the function created, if it's called as part of testMode
    if (testMode) {
      deleteFunction(name).catch((err) => 
        logger.error(`[Faas] Error while deleting ${name}: ${err.message}`))
    }

    // setup the tags for observability and then fire the stats
    const tags = {
      identifier: "openfaas",
      testMode: testMode,
      errored: errorRaised ? true : false,
      statusCode: errorRaised ? errorRaised.statusCode : HTTP_STATUS_CODES.OK, // default statuscode is 200OK
      ...events.length && events[0].metadata ? getMetadata(events[0].metadata) : {},
      ...events.length && events[0].metadata ? getTransformationMetadata(events[0].metadata) : {},
    }

    stats.counter('user_transform_function_input_events', events.length, tags)
    stats.timing('user_transform_function_latency', startTime, tags)
  }
};

module.exports = {
  awaitFunctionReadiness,
  executeFaasFunction,
  setupFaasFunction,
  invalidateFnCache,
  FAAS_AST_VID,
  FAAS_AST_FN_NAME,
};
