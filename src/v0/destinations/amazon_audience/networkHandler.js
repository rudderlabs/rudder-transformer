const {
  NetworkError,
  ThrottledError,
  AbortedError,
  RetryableError,
} = require('@rudderstack/integrations-lib');
const { prepareProxyRequest, handleHttpRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util/index');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');
const { DESTINATION, CREATE_USERS_URL, ASSOCIATE_USERS_URL } = require('./config');
const { TAG_NAMES } = require('../../util/tags');

const amazonAudienceRespHandler = (destResponse, stageMsg) => {
  const { status, response } = destResponse;

  // to handle the case when authorization-token is invalid
  // docs for error codes: https://advertising.amazon.com/API/docs/en-us/reference/concepts/errors#tag/Audiences/operation/dspCreateAudiencesPost
  if (status === 401) {
    // 401 takes place in case of authorization isue meaning token is epxired or access is not enough.
    // Since acces is configured from dashboard only refresh token makes sense
    throw new NetworkError(
      `${response?.message} ${stageMsg}`,
      status,
      {
        [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      response,
      REFRESH_TOKEN,
    );
  } else if (status === 429) {
    throw new ThrottledError(
      `Request Failed: ${stageMsg} - due to Request Limit exceeded, (Throttled)`,
      destResponse,
    );
  } else if (status === 504 || status === 502 || status === 500) {
    // see if its 5xx internal error
    throw new RetryableError(`Request Failed: ${stageMsg} (Retryable)`, 500, destResponse);
  }
  // else throw the error
  throw new AbortedError(
    `Request Failed: ${stageMsg} with status "${status}" due to "${JSON.stringify(
      response,
    )}", (Aborted) `,
    400,
    destResponse,
  );
};

const responseHandler = (responseParams) => {
  const { destinationResponse } = responseParams;
  const message = `[${DESTINATION} Response Handler] - Request Processed Successfully`;
  const { status } = destinationResponse;

  if (!isHttpStatusSuccess(status)) {
    // if error, successfully return status, message and original destination response
    amazonAudienceRespHandler(
      destinationResponse,
      'during amazon_audience response transformation',
    );
  }
  return {
    status,
    message,
    destinationResponse,
  };
};

const makeRequest = async (url, data, headers, metadata, method) => {
  const { httpResponse } = await handleHttpRequest(
    method,
    url,
    data,
    { headers },
    {
      destType: 'amazon_audience',
      feature: 'proxy',
      endpointPath: '/records/hashed',
      requestMethod: 'POST',
      module: 'dataDelivery',
      metadata,
    },
  );
  return httpResponse;
};

const amazonAudienceProxyRequest = async (request) => {
  const { body, metadata } = request;
  const { headers } = request;
  const { JSON } = body;
  const { createUsers, associateUsers } = JSON;

  // step 1: Create users
  const firstResponse = await makeRequest(CREATE_USERS_URL, createUsers, headers, metadata, 'post');
  // validate response success
  if (!firstResponse.success && !isHttpStatusSuccess(firstResponse?.response?.status)) {
    amazonAudienceRespHandler(
      {
        response: firstResponse.response?.response?.data || firstResponse,
        status: firstResponse.response?.response?.status || firstResponse,
      },
      'during creating users',
    );
  }
  // we are returning above in case of failure because if first step is not executed then there is no sense of executing second step
  // step2: Associate Users to Audience Id
  return makeRequest(ASSOCIATE_USERS_URL, associateUsers, headers, metadata, 'patch');
};
// eslint-disable-next-line @typescript-eslint/naming-convention
class networkHandler {
  constructor() {
    this.responseHandler = responseHandler;
    this.proxy = amazonAudienceProxyRequest;
    this.prepareProxy = prepareProxyRequest;
    this.processAxiosResponse = processAxiosResponse;
  }
}

module.exports = {
  networkHandler,
};
