/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const _ = require("lodash");
const logger = require("./logger");
const { proxyRequest } = require("./adapters/network");
const {
  nodeSysErrorToStatus,
  parseDestJSONResponse
} = require("./adapters/utils/networkUtils");
const { populateErrStat } = require("./v0/util/index");

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
  // flow should never reach the below (if) its a desperate fall-back
  if (!destNetHandler || !destNetHandler.responseTransform) {
    ctx.status = 404;
    ctx.body = `${destination} doesn't support response transformation`;
    return ctx.body;
  }
  let response;
  const parsedDestResponse = parseDestJSONResponse(destResponse);
  const destStatus = destResponse.status;
  try {
    response = destNetHandler.responseTransform(
      parsedDestResponse,
      destStatus,
      destination
    );
  } catch (err) {
    // eslint-disable-next-line no-ex-assign
    err = populateErrStat(err, destination, false);
    response = {
      status: err.status || 400,
      message: err.message,
      destinationResponse: err.destinationResponse || {
        response: parsedDestResponse,
        status: destStatus
      },
      statTags: err.statTags
    };
    if (!err.responseTransformFailure) {
      response.message = `[Error occurred while processing destinationresponse for destination ${destination}]: ${err.message}`;
    }
  }
  ctx.body = { output: response };
  ctx.status = 200;
  return ctx.body;
}

async function handleDestinationNetwork(destination, payload) {
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
      response: error.message || "Error occurred while processing payload."
    };
  }
  return parsedResponse;
}

module.exports = {
  handleDestinationNetwork,
  handleResponseTransform,
  userTransformHandler
};
