/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const logger = require('./logger');
const { proxyRequest } = require('./adapters/network');
const { nodeSysErrorToStatus } = require('./adapters/utils/networkUtils');

let areFunctionsEnabled = -1;
const functionsEnabled = () => {
  if (areFunctionsEnabled === -1) {
    areFunctionsEnabled = process.env.ENABLE_FUNCTIONS === 'false' ? 0 : 1;
  }
  return areFunctionsEnabled === 1;
};

const userTransformHandler = () => {
  if (functionsEnabled()) {
    return require('./util/customTransformer').userTransformHandler;
  }
  throw new Error('Functions are not enabled');
};

async function sendToDestination(destination, payload) {
  let parsedResponse;
  logger.info('Request recieved for destination', destination);
  const resp = await proxyRequest(payload);

  if (resp.success) {
    const { response } = resp;
    parsedResponse = {
      headers: response.headers,
      response: response.data,
      status: response.status,
    };
    return parsedResponse;
  }

  const { response: error } = resp;
  // handling axios error case
  if (!error.response && error.code) {
    const nodeSysErr = nodeSysErrorToStatus(error.code);
    parsedResponse = {
      headers: null,
      networkFailure: true,
      response: nodeSysErr.message,
      status: nodeSysErr.status,
    };
  } else {
    parsedResponse = {
      headers: error.response.headers,
      status: error.response.status,
      response: error.response.data || 'Error occurred while processing payload.',
    };
  }
  return parsedResponse;
}

module.exports = {
  sendToDestination,
  userTransformHandler,
};
