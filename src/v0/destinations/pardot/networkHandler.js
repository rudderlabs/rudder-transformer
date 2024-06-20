const { NetworkError } = require('@rudderstack/integrations-lib');
const { removeUndefinedValues } = require('../../util');
const { prepareProxyRequest, getPayloadData, httpSend } = require('../../../adapters/network');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../util/index');
const { REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');
const tags = require('../../util/tags');

/**
 * Example Response from pardot
 *
  {
    "@attributes": {
      "stat": "fail",
      "version": 1,
      "err_code": 59
    },
    "err": "A CRM connector was detected"
  }
 *
 *
 */

const getAuthErrCategory = (code) => {
  if (code === 184) {
    return REFRESH_TOKEN;
  }
  return '';
};
const RETRYABLE_CODES = [85, 116, 120, 121, 183, 184, 214];

const getStatus = (code) => {
  if (RETRYABLE_CODES.includes(code)) {
    return {
      status: 500,
    };
  }
  return {
    status: 400,
  };
};

const pardotRespHandler = (destResponse, stageMsg) => {
  const { status, response } = destResponse;
  const respAttributes = response['@attributes'];

  // to handle errors like service unavilable, wrong url, no response
  if (!respAttributes) {
    throw new NetworkError(
      `${JSON.stringify(response)} ${stageMsg}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      response,
    );
  }

  const { stat, err_code: errorCode } = respAttributes;

  if (isHttpStatusSuccess(status) && stat !== 'fail') {
    // Mostly any error will not have a status of 2xx
    return response;
  }
  const destinationStatus = getStatus(errorCode);
  const destinationStatusCode = destinationStatus?.status || 400;
  throw new NetworkError(
    `${response.err} ${stageMsg}`,
    destinationStatusCode,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(destinationStatusCode),
    },
    response,
    getAuthErrCategory(errorCode),
  );
};

const responseHandler = (responseParams) => {
  const { destinationResponse } = responseParams;
  const message = 'Request Processed Successfully';
  const { status } = destinationResponse;
  // else successfully return status, message and original destination response
  pardotRespHandler(destinationResponse, 'during Pardot response transformation');
  return {
    status,
    message,
    destinationResponse,
  };
};

const prepareProxyReq = (request) => {
  const { body } = request;
  // Build the destination request data using the generic method
  const { endpoint, data, method, params, headers } = prepareProxyRequest(request);

  // Modify the data
  const { payloadFormat } = getPayloadData(body);
  if (payloadFormat === 'FORM') {
    data.append('format', 'json');
  }

  return removeUndefinedValues({
    endpoint,
    data,
    params,
    headers,
    method,
  });
};

/**
 * depricating: handles proxying requests to destinations from server, expects requsts in "defaultRequestConfig"
 * note: needed for test api
 * @param {*} request
 * @returns
 */
const pardotProxyRequest = async (request) => {
  const { metadata } = request;
  const { endpoint, data, method, params, headers } = prepareProxyReq(request);

  const requestOptions = {
    url: endpoint,
    data,
    params,
    headers,
    method,
  };
  const response = await httpSend(requestOptions, {
    feature: 'proxy',
    destType: 'pardot',
    metadata,
  });
  return response;
};

function networkHandler() {
  this.responseHandler = responseHandler;
  this.proxy = pardotProxyRequest;
  this.prepareProxy = prepareProxyReq;
  this.processAxiosResponse = processAxiosResponse;
}

module.exports = {
  networkHandler,
};
