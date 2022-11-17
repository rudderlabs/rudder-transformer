/* eslint-disable no-unused-vars */
const { default: axios } = require("axios");
const path = require("path");
const url = require("url");
const logger = require("../../logger");
const stats = require("../stats");

const FAAS_BASE_IMG = "rudderlabs/develop-openfaas-flask:latest";
const OPENFAAS_NAMESPACE = "openfaas-fn";

const FUNCTION_REQUEST_TYPE_HEADER = "X-REQUEST-TYPE";
const FUNCTION_REQUEST_TYPES = {
  code: "CODE",
  event: "EVENT"
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

async function isFunctionDeployed(functionName) {
  logger.info("Is function deployed?.");
  const deployedFunctions = await axios.get(
    new URL(
      path.join(process.env.OPENFAAS_GATEWAY_URL, "/system/functions")
    ).toString()
  );

  let matchFound = false;

  deployedFunctions.data.forEach(deployedFunction => {
    if (deployedFunction.name === functionName) matchFound = true;
  });

  return matchFound;
}

function invokeFunction(functionName, payload, requestType) {
  const headers = {};
  headers[FUNCTION_REQUEST_TYPE_HEADER] = requestType;

  return axios.post(
    new URL(
      path.join(process.env.OPENFAAS_GATEWAY_URL, "function", functionName)
    ).toString(),
    payload,
    {
      headers
    }
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

async function setupFunction(functionName, code, versionId, testMode) {
  if (!testMode) {
    if (await isFunctionDeployed(functionName)) {
      await deleteFunction(functionName);
    }
  }

  await deployFunction(functionName, code, versionId, testMode);
}

async function run(functionName, events, code, versionId, testMode) {
  if (testMode) {
    if (!code) {
      throw new Error(
        "Code not found for invoking test function: ",
        functionName
      );
    }

    await setupFunction(functionName, code, versionId, testMode);
  }

  let response;

  try {
    response = await invokeFunction(
      functionName,
      events,
      FUNCTION_REQUEST_TYPES.event
    );
  } finally {
    if (testMode) {
      deleteFunction(functionName).catch(_e => {});
    }
  }

  return Promise.resolve(response);
}

exports.run = run;
exports.setupFunction = setupFunction;
