const NodeCache = require("node-cache");
const {
  getFunction,
  deleteFunction,
  deployFunction,
  invokeFunction
} = require("./faasApi");
const logger = require("../../logger");
const { RetryRequestError } = require("../utils");

const FAAS_BASE_IMG =
  process.env.FAAS_BASE_IMG || "rudderlabs/develop-openfaas-flask:latest";
const FAAS_SCALE_MAX_PODS = process.env.FAAS_SCALE_MAX_PODS || 100;
const CONFIG_BACKEND_URL =
  process.env.CONFIG_BACKEND_URL || "https://api.rudderlabs.com";

const functionListCache = new NodeCache();
const FUNC_LIST_KEY = "fn-list";

const delayInMs = async (ms = 2000) =>
  new Promise(resolve => setTimeout(resolve, ms));

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

const isFunctionDeployed = functionName => {
  const funcList = functionListCache.get(FUNC_LIST_KEY) || [];
  return funcList.includes(functionName);
};

const setFunctionInCache = functionName => {
  const funcList = functionListCache.get(FUNC_LIST_KEY) || [];
  funcList.push(functionName);
  functionListCache.set(FUNC_LIST_KEY, funcList);
};

const deployFaasFunction = async (functionName, code, versionId, testMode) => {
  try {
    logger.debug("[Faas] Deploying a faas function");
    let envProcess = "python index.py";

    if (!testMode) {
      envProcess = `${envProcess} --vid ${versionId} --config-backend-url ${CONFIG_BACKEND_URL}`;
    } else {
      envProcess = `${envProcess} --code "${code}"`;
    }
    // TODO: investigate and add more required labels and annotations
    const payload = {
      service: functionName,
      name: functionName,
      image: FAAS_BASE_IMG,
      envProcess,
      labels: {
        faas_function: functionName,
        "com.openfaas.scale.max": FAAS_SCALE_MAX_PODS,
        "parent-component": "openfaas"
      },
      annotations: {
        "prometheus.io.scrape": "true"
      }
    };

    await deployFunction(payload);
    logger.debug("[Faas] Deployed a faas function");
  } catch (error) {
    logger.error(
      `[Faas] Error while deploying ${functionName}: ${error.message}`
    );
    // To handle concurrent create requests,
    // throw retry error if already exists so that request can be retried
    if (error.message.includes("already exists")) {
      setFunctionInCache(functionName);
      throw new RetryRequestError(`${functionName} already exists`);
    }
    throw error;
  }
};

async function setupFaasFunction(functionName, code, versionId, testMode) {
  try {
    if (!testMode) {
      if (isFunctionDeployed(functionName)) {
        logger.debug(`[Faas] Function ${functionName} already deployed`);
        return;
      }
    }
    // deploy faas function
    await deployFaasFunction(functionName, code, versionId, testMode);

    // check if function is spinned
    await callWithRetry(getFunction, 0, functionName);

    setFunctionInCache(functionName);
    logger.debug(`[Faas] Finished deploying faas function ${functionName}`);
  } catch (error) {
    logger.error(
      `[Faas] Error while setting function ${functionName}: ${error.message}`
    );
    throw error;
  }
}

const executeFaasFunction = async (functionName, events, testMode) => {
  try {
    logger.debug("[Faas] Invoking faas function");
    const res = await invokeFunction(functionName, events);
    logger.debug("[Faas] Invoked faas function");
    return res;
  } catch (error) {
    logger.error(
      `[Faas] Error while invoking ${functionName}: ${error.message}`
    );
    throw error;
  } finally {
    if (testMode) {
      deleteFunction(functionName).catch(err => {
        logger.error(
          `[Faas] Error while deleting ${functionName}: ${err.message}`
        );
      });
    }
  }
};

module.exports = {
  executeFaasFunction,
  setupFaasFunction
};
