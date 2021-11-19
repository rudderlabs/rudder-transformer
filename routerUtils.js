/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const _ = require("lodash");
const logger = require("./logger");
const { proxyRequest } = require("./adapters/network");
const { nodeSysErrorToStatus } = require("./adapters/utils/networkUtils");
const { parseDestResponse } = require("./adapters/utils/networkUtils");
const { DestHandlerMap } = require("./constants/destinationCanonicalNames");
const { generateErrorObject } = require("./v0/util");
const { TRANSFORMER_METRIC } = require("./v0/util/constant");

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
    destNetHandler = require(`./${version}/destinations/${destination}/networkResponseHandler`);
    if (DestHandlerMap.hasOwnProperty(destination)) {
      destNetHandler = require(`./${version}/destinations/${DestHandlerMap[destination]}/networkResponseHandler`);
    }
    if (!destNetHandler && !destNetHandler.responseTransform) {
      destNetHandler = require("./adapters/networkhandler/genericNetworkResponseHandler");
    }
  } catch (err) {
    destNetHandler = require("./adapters/networkhandler/genericNetworkResponseHandler");
  }
  return destNetHandler;
};

function handleResponseTransform(version, destination, ctx) {
  const destResponse = ctx.request.body;
  const destNetHandler = getDestNetHander(version, destination);
  let response;
  try {
    const parsedDestResponse = parseDestResponse(destResponse, destination);
    response = destNetHandler.responseTransform(
      parsedDestResponse,
      destination
    );
  } catch (err) {
    response = generateErrorObject(
      err,
      destination,
      TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM
    );
    response = { ...response, destinationResponse: destResponse };
    if (!err.responseTransformFailure) {
      response.message = `[Error occurred while processing destinationresponse for destination ${destination}]: ${err.message}`;
    }
  }
  ctx.body = { output: response };
  ctx.status = 200;
  return ctx.body;
}

async function sendToDestination(destination, payload) {
  let parsedResponse;
  logger.info("Request recieved for destination", destination);
  const resp = await proxyRequest(payload);

  if (resp.success) {
    const { response } = resp;
    parsedResponse = {
      response: response.data,
      status: response.status
    };
    return parsedResponse;
  }

  const { response: error } = resp;
  // handling axios error case
  if (!error.response && error.code) {
    const nodeSysErr = nodeSysErrorToStatus(error.code);
    parsedResponse = {
      networkFailure: true,
      response: nodeSysErr.message,
      status: nodeSysErr.status
    };
  } else {
    parsedResponse = {
      status: error.response.status,
      response:
        error.response.data || "Error occurred while processing payload."
    };
  }
  return parsedResponse;
}

module.exports = {
  sendToDestination,
  userTransformHandler,
  handleResponseTransform
};
