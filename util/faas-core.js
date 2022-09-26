/* eslint-disable no-unused-vars */
const { default: axios } = require("axios");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const shell = require("shelljs");
const dockerUtils = require("./docker-utils");
const logger = require("../logger");

const FUNCTION_REPOSITORY = "rudderlabs/user-functions-test";
const OPENFAAS_NAMESPACE = "openfaas-fn";

const resourcesBasePath = path.join(__dirname, "..", "resources", "openfaas");
const buildsFolderPrefix = "openfaas-builds-";

function normalizeTransformationName(transformationName) {
  return transformationName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

function buildImageName(transformationName) {
  const tagName = normalizeTransformationName(transformationName);

  return `${FUNCTION_REPOSITORY}:${tagName}`;
}

async function buildContext(code) {
  const buildDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), buildsFolderPrefix)
  );
  const funcDir = path.join(buildDir, "function");

  await fs.promises.mkdir(funcDir);
  await fs.copy(resourcesBasePath, buildDir);

  await fs.promises.writeFile(path.join(funcDir, "__init__.py"), "");
  await fs.promises.writeFile(path.join(funcDir, "handler.py"), code);

  logger.debug("Done building context at: ", buildDir);
  return buildDir;
}

async function dockerizeAndPush(buildDir, imageName) {
  shell.cd(buildDir);

  await dockerUtils.buildImage(".", "-t", imageName);
  await dockerUtils.pushImage(imageName);
}

async function deployImage(imageName, transformationName) {
  const normalizedTransformationName = normalizeTransformationName(transformationName);

  const payload = {
    service: normalizedTransformationName,
    name: normalizedTransformationName,
    image: imageName,
    namespace: OPENFAAS_NAMESPACE,
    envProcess: "python index.py",
    labels: {
      faas_function: normalizedTransformationName,
      "com.openfaas.scale.max": "3"
    },
    annotations: {
      "prometheus.io.scrape": "false"
    }
  };

  await axios.post(
    new URL(
      path.join(process.env.OPENFAAS_GATEWAY_URL, "/system/functions")
    ).toString(),
    payload
  );
}

function undeployFunction(functionName) {
  return axios.delete(
    new URL(
      path.join(process.env.OPENFAAS_GATEWAY_URL, "/system/functions")
    ).toString(),
    {
      functionName
    }
  );
}

async function faasDeploymentHandler(transformationName, code) {
  const imageName = buildImageName(transformationName);

  try {
    await dockerUtils.pullImage(imageName);
    await undeployFunction(
      normalizeTransformationName(transformationName)
    ).catch(_ => {});

    return;
  } catch (error) {
    logger.error(`Error pulling image ${imageName}.`);
  }

  const buildDir = await buildContext(code);
  await dockerizeAndPush(buildDir, imageName);
  await deployImage(imageName, transformationName);

  fs.rmdir(buildDir, { recursive: true, force: true });
}

async function faasInvocationHandler(transformationName, code, events = []) {
  await faasDeploymentHandler(transformationName, code);

  const promises = [];

  events.forEach(event => {
    const promise = axios.post(
      new URL(
        path.join(
          process.env.OPENFAAS_GATEWAY_URL,
          "function",
          normalizeTransformationName(transformationName)
        )
      ).toString(),
      event
    );

    promises.push(promise);
  });

  return Promise.all(promises);
}

exports.faasDeploymentHandler = faasDeploymentHandler;
exports.faasInvocationHandler = faasInvocationHandler;
