/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const _ = require("lodash");
const { lstatSync, readdirSync } = require("fs");
const logger = require("./logger");
const { DestHandlerMap } = require("./constants/destinationCanonicalNames");

let areFunctionsEnabled = -1;
const functionsEnabled = () => {
  if (areFunctionsEnabled === -1) {
    areFunctionsEnabled = process.env.ENABLE_FUNCTIONS === "false" ? 0 : 1;
  }
  return areFunctionsEnabled === 1;
};

const userTransformHandler = () => {
  if (functionsEnabled()) {
    return require("./util/customTransformer").userTransformHandler;
  }
  throw new Error("Functions are not enabled");
};

const getDestNetHander = (version, dest) => {
  const destination = _.toLower(dest);
  let destNetHandler;
  try {
    destNetHandler = require(`./${version}/destinations/${destination}/nethandler`);
    if (!destNetHandler && !destNetHandler.sendData) {
      destNetHandler = require("./adapters/networkhandler/genericnethandler");
    }
  } catch (err) {
    destNetHandler = require("./adapters/networkhandler/genericnethandler");
  }
  return destNetHandler;
};

async function handleDestinationNetwork(version, destination, ctx) {
  const destNetHandler = getDestNetHander(version, destination);
  // flow should never reach the below (if) its a desperate fall-back
  if (!destNetHandler || !destNetHandler.sendData) {
    ctx.status = 404;
    ctx.body = `${destination} doesn't support transformer proxy`;
    return ctx.body;
  }
  let response;
  logger.info("Request recieved for destination", destination);
  try {
    response = await destNetHandler.sendData(ctx.request.body);
  } catch (err) {
    response = {
      status: 500, // keeping retryable default
      error: err.message || "Error occurred while processing payload."
    };
    // error from network failure should directly parsable as response
    if (err.networkFailure) {
      response = { ...err };
    }
  }

  ctx.body = { output: response };
  ctx.status = response.status;
  return ctx.body;
}

const isDirectory = source => {
  return lstatSync(source).isDirectory();
};

const getIntegrations = type =>
  readdirSync(type).filter(destName => isDirectory(`${type}/${destName}`));

const getDestHandler = (version, dest) => {
  if (DestHandlerMap.hasOwnProperty(dest)) {
    return require(`./${version}/destinations/${DestHandlerMap[dest]}/transform`);
  }
  return require(`./${version}/destinations/${dest}/transform`);
};

const getDestFileUploadHandler = (version, dest) => {
  return require(`./${version}/destinations/${dest}/fileUpload`);
};

const getPollStatusHandler = (version, dest) => {
  return require(`./${version}/destinations/${dest}/poll`);
};

const getJobStatusHandler = (version, dest) => {
  return require(`./${version}/destinations/${dest}/fetchJobStatus`);
};

module.exports = {
  getIntegrations,
  getDestHandler,
  getDestFileUploadHandler,
  getPollStatusHandler,
  getJobStatusHandler,
  handleDestinationNetwork,
  userTransformHandler
};
