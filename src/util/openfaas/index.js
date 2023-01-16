const NodeCache = require('node-cache');
const { getFunction, deleteFunction, deployFunction, invokeFunction } = require('./faasApi');
const logger = require('../../logger');
const { RetryRequestError, RespStatusError } = require('../utils');

const FAAS_BASE_IMG = process.env.FAAS_BASE_IMG || 'rudderlabs/openfaas-flask:main';
const FAAS_MAX_PODS_IN_TEXT = process.env.FAAS_MAX_PODS_IN_TEXT || '40';
const FAAS_REQUESTS_CPU = process.env.FAAS_REQUESTS_CPU || '0.5';
const FAAS_REQUESTS_MEMORY = process.env.FAAS_REQUESTS_MEMORY || '140Mi';
const FAAS_LIMITS_CPU = process.env.FAAS_LIMITS_CPU || FAAS_REQUESTS_CPU;
const FAAS_LIMITS_MEMORY = process.env.FAAS_LIMITS_MEMORY || FAAS_REQUESTS_MEMORY;
const FAAS_MAX_INFLIGHT = process.env.FAAS_MAX_INFLIGHT || '4';
const FAAS_EXEC_TIMEOUT = process.env.FAAS_EXEC_TIMEOUT || '4s';
const FAAS_ENABLE_WATCHDOG_ENV_VARS = process.env.FAAS_ENABLE_WATCHDOG_ENV_VARS || 'true';
const CONFIG_BACKEND_URL = process.env.CONFIG_BACKEND_URL || 'https://api.rudderlabs.com';

// Initialise node cache
const functionListCache = new NodeCache();
const FUNC_LIST_KEY = 'fn-list';
functionListCache.set(FUNC_LIST_KEY, []);

const delayInMs = async (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

const callWithRetry = async (fn, count = 0, ...args) => {
  try {
    return await fn(...args);
  } catch (err) {
    if (count > 2) {
      throw err;
    }
    await delayInMs();
    return callWithRetry(fn, count + 1);
  }
};

const isFunctionDeployed = (functionName) => {
  const funcList = functionListCache.get(FUNC_LIST_KEY) || [];
  return funcList.includes(functionName);
};

const setFunctionInCache = (functionName) => {
  const funcList = functionListCache.get(FUNC_LIST_KEY) || [];
  funcList.push(functionName);
  functionListCache.set(FUNC_LIST_KEY, funcList);
};

const invalidateFnCache = () => {
  functionListCache.set(FUNC_LIST_KEY, []);
};

const deployFaasFunction = async (functionName, code, versionId, testMode) => {
  try {
    logger.debug('[Faas] Deploying a faas function');
    let envProcess = 'python index.py';

    if (!testMode) {
      envProcess = `${envProcess} --vid ${versionId} --config-backend-url ${CONFIG_BACKEND_URL}`;
    } else {
      envProcess = `${envProcess} --code "${code}"`;
    }

    const envVars = {};
    if (FAAS_ENABLE_WATCHDOG_ENV_VARS.trim().toLowerCase() === 'true') {
      envVars.max_inflight = FAAS_MAX_INFLIGHT;
      envVars.exec_timeout = FAAS_EXEC_TIMEOUT;
    }
    // TODO: investigate and add more required labels and annotations
    const payload = {
      service: functionName,
      name: functionName,
      image: FAAS_BASE_IMG,
      envProcess,
      envVars,
      labels: {
        'openfaas-fn': 'true',
        'parent-component': 'openfaas',
        'com.openfaas.scale.max': FAAS_MAX_PODS_IN_TEXT,
      },
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
    // throw retry error if already exists so that request can be retried
    if (error.statusCode === 500 && error.message.includes('already exists')) {
      setFunctionInCache(functionName);
      throw new RetryRequestError(`${functionName} already exists`);
    }
    throw error;
  }
};

async function setupFaasFunction(functionName, code, versionId, testMode) {
  try {
    if (!testMode && isFunctionDeployed(functionName)) {
      logger.debug(`[Faas] Function ${functionName} already deployed`);
      return;
    }
    // deploy faas function
    await deployFaasFunction(functionName, code, versionId, testMode);

    // This api call is only used to check if function is spinned eventually
    // TODO: call health endpoint instead of get function to get correct status
    await callWithRetry(getFunction, 0, functionName);

    setFunctionInCache(functionName);
    logger.debug(`[Faas] Finished deploying faas function ${functionName}`);
  } catch (error) {
    logger.error(`[Faas] Error while setting function ${functionName}: ${error.message}`);
    throw error;
  }
}

const executeFaasFunction = async (functionName, events, versionId, testMode) => {
  try {
    logger.debug('[Faas] Invoking faas function');
    const res = await invokeFunction(functionName, events);
    logger.debug('[Faas] Invoked faas function');
    return res;
  } catch (error) {
    logger.error(`[Faas] Error while invoking ${functionName}: ${error.message}`);
    if (
      error.statusCode === 404 &&
      error.message.includes(`error finding function ${functionName}`)
    ) {
      await setupFaasFunction(functionName, null, versionId, testMode);
      throw new RetryRequestError(`${functionName} not found`);
    }

    if (error.statusCode === 429) {
      throw new RetryRequestError(`Rate limit exceeded for ${functionName}`);
    }

    if (error.statusCode === 500 || error.statusCode === 503) {
      throw new RetryRequestError(error.message);
    }

    if (error.statusCode === 504) {
      throw new RespStatusError('Timed out');
    }

    throw error;
  } finally {
    if (testMode) {
      deleteFunction(functionName).catch((err) => {
        logger.error(`[Faas] Error while deleting ${functionName}: ${err.message}`);
      });
    }
  }
};

module.exports = {
  executeFaasFunction,
  setupFaasFunction,
  invalidateFnCache,
};
