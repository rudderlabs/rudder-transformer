/* eslint-disable no-unused-vars */
const { default: axios } = require("axios");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const logger = require("../logger");
const stats = require("./stats");

const FUNCTION_REPOSITORY = "rudderlabs/user-functions-test";
const FAAS_BASE_IMG = "rudderlabs/user-functions-test:flask-plain-handler";
const OPENFAAS_NAMESPACE = "openfaas-fn";
const DESTRUCTION_TIMEOUT_IN_MS = 2 * 60 * 1000;

const FUNCTION_REQUEST_TYPE_HEADER = "X-REQUEST-TYPE";
const FUNCTION_REQUEST_TYPES = {
  code: "CODE",
  event: "EVENT"
};

const resourcesBasePath = path.join(__dirname, "..", "resources", "openfaas");
const buildsFolderPrefix = "openfaas-builds-";

function hash(value) {
  return crypto
    .createHash("sha256")
    .update(value)
    .digest("hex");
}

function weakHash(value) {
  return crypto
    .createHash("sha1")
    .update(value)
    .digest("hex");
}

function buildFunctionName(transformationName, id) {
  let fnName = transformationName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  if (id) {
    fnName += `-${id.trim().replace(/\s+/g, "")}`;
  }

  return fnName;
}

function buildImageName(versionId, code, testMode) {
  if (testMode) return FAAS_BASE_IMG;

  let tagName = versionId;

  if (versionId === "testVersionId") {
    tagName = `test-${hash(code)}`;
  }

  return `${FUNCTION_REPOSITORY}:${tagName}`;
}

async function containerizeAndPush(imageName, functionName, code) {
  const startTime = new Date();

  logger.info("Build OCI Image.");
  const response = await axios.post(
    new URL(
      path.join(
        process.env.OCI_IMAGE_BUILDER_URL,
        "api/v1/podman/faas/build-push/"
      )
    ).toString(),
    {
      imageName,
      code
    }
  );

  if (![200, 201, 204].includes(response.status)) {
    throw Error(`Build/Push for image ${imageName} failed.`);
  }

  stats.timing("image_build_push_latency", startTime, {
    imageName,
    functionName
  });
}

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

async function deployFunction(imageName, functionName) {
  const payload = {
    service: functionName,
    name: functionName,
    image: imageName,
    namespace: OPENFAAS_NAMESPACE,
    envProcess: "python index.py",
    labels: {
      faas_function: functionName,
      "com.openfaas.scale.max": "5"
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
  }
}

async function deployCode(functionName, code) {
  try {
    await invokeFunction(functionName, { code }, FUNCTION_REQUEST_TYPES.code);
  } catch (error) {
    logger.error(`Error trying to deploy code to function ${functionName}: `, error);
  }
}

async function faasDeploymentHandler(imageName, functionName, code, testMode) {
  if (!testMode) {
    await containerizeAndPush(imageName, functionName, code);
  }

  await deployFunction(imageName, functionName, testMode);

  if (testMode) {
    deployCode(functionName, code);
  }
}

async function faasInvocationHandler(
  functionName,
  transformationName,
  code,
  versionId,
  events = [],
  testMode = false,
  override = false
) {
  let derivedFunctionName = functionName;
  let shouldSkipDeploymentProcess = false;

  if (derivedFunctionName) {
    shouldSkipDeploymentProcess = true;
  } else {
    derivedFunctionName = buildFunctionName(
      transformationName,
      versionId === "testVersionId" ? weakHash(code) : versionId
    );
  }

  const isFnDeployed = await isFunctionDeployed(derivedFunctionName);

  if (!isFnDeployed && shouldSkipDeploymentProcess) {
    throw Error("No deployment found for specified function: ", derivedFunctionName);
  }

  if ((!isFnDeployed || override) && !shouldSkipDeploymentProcess) {
    const imageName = buildImageName(versionId, code, testMode);

    if (override) {
      await deleteFunction(derivedFunctionName).catch(error => {
        logger.error(error.message);
      });
    }

    await faasDeploymentHandler(imageName, derivedFunctionName, code, testMode);
  }

  const startTime = new Date();

  logger.info("Invoking function: ", derivedFunctionName);

  const response = await invokeFunction(
    derivedFunctionName,
    events,
    FUNCTION_REQUEST_TYPES.event
  );

  if (testMode && !shouldSkipDeploymentProcess) {
    deleteFunction(derivedFunctionName).catch(_e => {});
  }

  stats.timing("deployed_function_execution_time", startTime, {
    derivedFunctionName
  });

  return Promise.resolve(response);
}

exports.faasDeploymentHandler = faasDeploymentHandler;
exports.faasInvocationHandler = faasInvocationHandler;
