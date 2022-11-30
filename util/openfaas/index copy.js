/* eslint-disable no-unused-vars */
const { default: axios } = require("axios");
const NodeCache = require("node-cache");
const path = require("path");
const url = require("url");
const logger = require("../../logger");
const stats = require("../stats");

const { RespStatusError, RetryRequestError } = require("../utils");
const { getFunction } = require("./faasApi");

const FAAS_BASE_IMG = "rudderlabs/develop-openfaas-flask:latest";
const OPENFAAS_NAMESPACE = "openfaas-fn";

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

function deleteFunction(functionName) {
  return axios.delete(
    new URL(
      path.join(process.env.OPENFAAS_GATEWAY_URL, "/system/functions")
    ).toString(),
    {
      data: {
        functionName
      }
    }
  );
}

const isFunctionDeployed = async functionName => {
  try {
    await getFunction(functionName);
    return true;
  } catch (err) {
    return false;
  }
  // const deployedFunctions = await axios.get(
  //   new URL(
  //     path.join(process.env.OPENFAAS_GATEWAY_URL, "/system/functions")
  //   ).toString()
  // );

  // let matchFound = false;

  // deployedFunctions.data.forEach(deployedFunction => {
  //   if (deployedFunction.name === functionName) matchFound = true;
  // });

  // return matchFound;
};

function invokeFunction(functionName, payload) {
  return axios.post(
    new URL(
      path.join(process.env.OPENFAAS_GATEWAY_URL, "function", functionName)
    ).toString(),
    payload
  );
}

async function deployFunction(functionName, code, versionId, testMode) {
  let envProcess = "python index.py";

  if (!testMode) {
    let configHost = process.env.CONFIG_BACKEND_URL;

    const parsedUrl = url.parse(configHost);

    if (
      parsedUrl.hostname === "localhost" ||
      parsedUrl.hostname === "127.0.0.1"
    ) {
      configHost = `http://host.docker.internal:${
        parsedUrl.port ? parsedUrl.port : ""
      }`;
    }
    envProcess = `${envProcess} --vid ${versionId} --config-backend-url ${configHost}`;
  } else {
    envProcess = `${envProcess} --code "${code}"`;
  }

  const payload = {
    service: functionName,
    name: functionName,
    image: FAAS_BASE_IMG,
    namespace: OPENFAAS_NAMESPACE,
    envProcess,
    labels: {
      faas_function: functionName,
      "com.openfaas.scale.max": "100"
    },
    annotations: {
      "prometheus.io.scrape": "false"
    }
  };

  logger.info("Attempting to deploy function.");

  try {
    await axios.post(
      new URL(
        path.join(process.env.OPENFAAS_GATEWAY_URL, "/system/functions")
      ).toString(),
      payload
    );
  } catch (error) {
    logger.error(`Error trying to deploy function ${functionName}: `, error);
    throw error;
  }
}

async function setupFaasFunction(functionName, code, versionId, testMode) {
  // check function froom cache
  // deployfunction
  // store in cache
  // getfunction
  try {
    if (!testMode) {
      if (await isFunctionDeployed(functionName)) {
        logger.debug(`[Faas] Function ${functionName} already deployed`);
        return;
      }
    }

    logger.debug("[Faas] Deploying a faas function");
    await deployFunction(functionName, code, versionId, testMode);
    const funcList = functionListCache.get(FUNC_LIST_KEY) || [];
    funcList.push(functionName);
    functionListCache.set(FUNC_LIST_KEY, funcList);

    // exponential back off get function every 3 min
    const res = await getFunction(functionName);
    // return res;
    logger.debug(`[Faas] Finished deploying faas function ${functionName}`);
  } catch (error) {
    if (
      error.response &&
      error.response.status === 500 &&
      error.response.data.includes("already exists")
    ) {
      logger.error(error.response.data);
      throw new RetryRequestError("Conflict while trying to deploy function");
    }
    throw error;
  }
}

async function run(functionName, events, code, versionId, testMode) {
  // set function
  // invoke function
  // delete function
  if (testMode) {
    if (!code) {
      throw RespStatusError(
        `Code not found for invoking test function: ${functionName}`,
        400
      );
    }
  }

  await setupFaasFunction(functionName, code, versionId, testMode);

  let response;

  try {
    response = await invokeFunction(functionName, events);
  } finally {
    if (testMode) {
      deleteFunction(functionName).catch(error => {
        logger.error(
          `Error while trying to delete test function: ${functionName}`,
          error
        );
      });
    }
  }

  return Promise.resolve(response);
}

// module.exports = {
//   run,
//   // setupAndRunFaasFunction
//   // setupInvokeFaasFunction
//   // setupRunFaasFunction
//   setupFaasFunction
// };
