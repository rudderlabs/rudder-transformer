/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */

const lodash = require('lodash');
const http = require('http');
const https = require('https');
const axios = require('axios');
const { isDefinedAndNotNull } = require('@rudderstack/integrations-lib');
const stats = require('../util/stats');
const {
  removeUndefinedValues,
  getErrorStatusCode,
  isDefinedAndNotNullAndNotEmpty,
} = require('../v0/util');
const logger = require('../logger');
const { processAxiosResponse } = require('./utils/networkUtils');
// Only for tests
const { setResponsesForMockAxiosAdapter } = require('../../test/testHelper');

const MAX_CONTENT_LENGTH = parseInt(process.env.MAX_CONTENT_LENGTH, 10) || 100000000;
const MAX_BODY_LENGTH = parseInt(process.env.MAX_BODY_LENGTH, 10) || 100000000;
const REQUEST_TIMEOUT_IN_MS = parseInt(process.env.REQUEST_TIMEOUT_IN_MS, 10) || 1000 * 60;
// (httpsAgent, httpsAgent) ,these are deployment specific configs not request specific
const networkClientConfigs = {
  // `method` is the request method to be used when making the request
  method: 'get',

  // `timeout` specifies the number of milliseconds before the request times out. If the request takes longer than `timeout`, the request will be aborted.
  timeout: REQUEST_TIMEOUT_IN_MS,

  // `withCredentials` indicates whether or not cross-site Access-Control requests should be made using credentials
  withCredentials: false,

  // `responseType` indicates the type of data that the server will respond with options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
  responseType: 'json',

  // `responseEncoding` indicates encoding to use for decoding responses (Node.js only),
  responseEncoding: 'utf8',

  // `maxBodyLength` (Node only option) defines the max size of the http request content in bytes allowed,
  maxBodyLength: 1000 * 1000 * 10,

  // `maxRedirects` defines the maximum number of redirects to follow in node.js,
  maxRedirects: 5,

  // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
  httpAgent: new http.Agent({ keepAlive: true }),

  // and https requests, respectively, in node.js. This allows options to be added like `keepAlive` that are not enabled by default.
  httpsAgent: new https.Agent({ keepAlive: true }),
};

const fireOutgoingReqStats = ({
  destType,
  feature,
  endpointPath,
  requestMethod,
  module,
  metadata = {},
  startTime,
  statusCode,
  clientResponse,
}) => {
  const logMetaInfo = logger.getLogMetadata(metadata);
  stats.timing('outgoing_request_latency', startTime, {
    ...logMetaInfo,
    feature,
    destType,
    endpointPath,
    requestMethod,
    module,
  });
  stats.counter('outgoing_request_count', 1, {
    ...logMetaInfo,
    feature,
    destType,
    endpointPath,
    success: clientResponse.success,
    statusCode,
    requestMethod,
    module,
  });
};

const fireHTTPStats = (clientResponse, startTime, statTags) => {
  const destType = statTags.destType ? statTags.destType : '';
  const feature = statTags.feature ? statTags.feature : '';
  const endpointPath = statTags.endpointPath ? statTags.endpointPath : '';
  const requestMethod = statTags.requestMethod ? statTags.requestMethod : '';
  const module = statTags.module ? statTags.module : '';
  const statusCode = clientResponse.success
    ? clientResponse.response.status
    : getErrorStatusCode(clientResponse.response);
  const defArgs = {
    destType,
    endpointPath,
    feature,
    module,
    requestMethod,
    statusCode,
    startTime,
    clientResponse,
  };
  if (statTags?.metadata && typeof statTags?.metadata === 'object') {
    const metadata = !Array.isArray(statTags?.metadata) ? [statTags.metadata] : statTags.metadata;
    metadata?.filter(isDefinedAndNotNull)?.forEach((m) => {
      fireOutgoingReqStats({
        ...defArgs,
        metadata: m,
      });
    });
    return;
  }
  fireOutgoingReqStats(defArgs);
};

const enhanceRequestOptions = (options) => {
  const requestOptions = {
    ...networkClientConfigs,
    ...options,
    maxContentLength: MAX_CONTENT_LENGTH,
    maxBodyLength: MAX_BODY_LENGTH,
  };

  return requestOptions;
};

const getResponseDetails = (clientResponse) => {
  if (!clientResponse.success) {
    const { response } = clientResponse.response;
    // non 2xx status handling for axios response
    if (response) {
      const { data, status, headers } = response;
      return {
        body: data || '',
        status: status || 500,
        ...(isDefinedAndNotNullAndNotEmpty(headers) ? { headers } : {}),
      };
    }
    return {};
  }
  const { data, status, headers } = clientResponse.response;
  return {
    body: data || '',
    status: status || 500,
    ...(isDefinedAndNotNullAndNotEmpty(headers) ? { headers } : {}),
  };
};

const getHttpMethodArgs = (method, { url, data, requestOptions }) => {
  const requestMethod = method?.toLowerCase?.();
  switch (requestMethod) {
    case 'post':
    case 'put':
    case 'patch':
      return [url, data, requestOptions];
    case 'get':
    case 'delete':
      return [url, requestOptions];
    default: // constructor
      return [requestOptions];
  }
};
const commonHandler = async (axiosMethod, { statTags, method, ...args }) => {
  let clientResponse;
  const { url, data, options, requestOptions } = args;
  const commonMsg = `[${statTags?.destType?.toUpperCase?.() || ''}] ${statTags?.endpointPath || ''}`;

  logger.requestLog(`${commonMsg} request`, {
    metadata: statTags?.metadata,
    requestDetails: {
      url: url || requestOptions?.url,
      body: data || requestOptions?.data,
      method,
    },
  });
  const startTime = new Date();
  try {
    const response = await axiosMethod(...getHttpMethodArgs(method, args));
    clientResponse = { success: true, response };
  } catch (err) {
    clientResponse = { success: false, response: err };
  } finally {
    logger.responseLog(`${commonMsg} response`, {
      metadata: statTags?.metadata,
      responseDetails: getResponseDetails(clientResponse),
    });
    fireHTTPStats(clientResponse, startTime, statTags);
  }

  setResponsesForMockAxiosAdapter({ url, data, method, options }, clientResponse);
  return clientResponse;
};

/**
 * sends an http request with underlying client, expects request options
 * @param {*} options
 * @returns
 */
const httpSend = async (options, statTags = {}) => {
  const requestOptions = enhanceRequestOptions(options);
  return commonHandler(axios, { statTags, options, requestOptions });
};

/**
 *
 * @param {*} url
 * @param {*} options
 * @returns
 *
 * handles http GET requests returns promise as a response throws error in case of non 2XX statuses
 */
const httpGET = async (url, options, statTags = {}) => {
  const requestOptions = enhanceRequestOptions(options);
  return commonHandler(axios.get, { statTags, method: 'get', url, options, requestOptions });
};

/**
 *
 * @param {*} url
 * @param {*} options
 * @returns
 *
 * handles http DELETE requests returns promise as a response throws error in case of non 2XX statuses
 */
const httpDELETE = async (url, options, statTags = {}) => {
  const requestOptions = enhanceRequestOptions(options);
  return commonHandler(axios.delete, { statTags, method: 'delete', url, options, requestOptions });
};

/**
 *
 * @param {*} url
 * @param {*} data
 * @param {*} options
 * @returns
 *
 * handles http POST requests returns promise as a response throws error in case of non 2XX statuses
 */
const httpPOST = async (url, data, options, statTags = {}) => {
  const requestOptions = enhanceRequestOptions(options);
  return commonHandler(axios.post, {
    statTags,
    url,
    method: 'post',
    data,
    options,
    requestOptions,
  });
};

/**
 *
 * @param {*} url
 * @param {*} data
 * @param {*} options
 * @returns
 *
 * handles http PUT requests returns promise as a response throws error in case of non 2XX statuses
 */
const httpPUT = async (url, data, options, statTags = {}) => {
  const requestOptions = enhanceRequestOptions(options);
  return commonHandler(axios.put, { statTags, url, data, method: 'put', options, requestOptions });
};

/**
 *
 * @param {*} url
 * @param {*} data
 * @param {*} options
 * @returns
 *
 * handles http PATCH requests returns promise as a response throws error in case of non 2XX statuses
 */
const httpPATCH = async (url, data, options, statTags = {}) => {
  const requestOptions = enhanceRequestOptions(options);
  return commonHandler(axios.patch, {
    statTags,
    url,
    method: 'patch',
    data,
    options,
    requestOptions,
  });
};

const getPayloadData = (body) => {
  let payload;
  let payloadFormat;
  Object.entries(body).forEach(([key, value]) => {
    if (!lodash.isEmpty(value)) {
      payload = value;
      payloadFormat = key;
    }
  });
  return { payload, payloadFormat };
};

/**
 * Method for stringification of query parameters
 * To understand the use-case for this method, please take a look at the below mentioned link:
 * https://github.com/rudderlabs/rudder-transformer/pull/1244#issuecomment-1158900136
 *
 * @param {*} value
 * @returns {String}
 */
function stringifyQueryParam(value) {
  let stringifiedValue = `${value}`;
  if (Array.isArray(value)) {
    stringifiedValue = value.map((v) => stringifyQueryParam(v)).join(',');
    return `[${stringifiedValue}]`;
  }
  if (value && typeof value === 'object') {
    // check for value is being done to avoid null inside since typeof null = "object"
    stringifiedValue = JSON.stringify(value);
  }
  return stringifiedValue;
}

/**
 * Obtain FORM payload-format data to send the data to destination
 *
 * @param {Object} payload
 * @returns {String}
 */
function getFormData(payload) {
  const data = new URLSearchParams();
  Object.keys(payload).forEach((key) => {
    const payloadValStr = stringifyQueryParam(payload[key]);
    data.append(key, payloadValStr);
  });
  return data;
}

/**
 * Prepares the proxy request
 * @param {*} request
 * @returns
 */
const prepareProxyRequest = (request) => {
  const { body, method, params, endpoint, headers, destinationConfig: config } = request;
  const { payload, payloadFormat } = getPayloadData(body);
  let data;

  switch (payloadFormat) {
    case 'JSON_ARRAY':
      data = payload.batch;
      // TODO: add headers
      break;
    case 'JSON':
      data = payload;
      break;
    case 'XML':
      data = payload.payload;
      break;
    case 'FORM':
      data = getFormData(payload);
      break;
    case 'MULTIPART-FORM':
      // TODO:
      break;
    default:
      logger.debug(`body format ${payloadFormat} not supported`);
  }
  // Ref: https://github.com/rudderlabs/rudder-server/blob/master/router/network.go#L164
  headers['User-Agent'] = 'RudderLabs';
  return removeUndefinedValues({ endpoint, data, params, headers, method, config });
};

/**
 * handles http request and sends the response in a simple format that is followed in transformer
 *
 * @param {string} requestType - http request type like post, get etc,.
 * @param {any} httpArgs - arguments that should be sent to the request. This is a variadic argument(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
 * @returns {Promise<{httpResponse: Promise<any>, processedResponse: any}>}
 *  - __httpResponse__: indicates the response we get from httpGET or httpPOST methods
 *  - __processedResponse__: indicates a wrapeed response object returned from processedAxiosResponse
 * @example
 *  handleHttpRequest("post", "https://example.com", {})
 *  handleHttpRequest("constructor",{
      method: "post",
      url: "https://myapi.com/api/2/deletions/users",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic sdineciuneu839eu3i9/=`
      },
      data: {
        // request body data
        "key": 1,
        "ke": 2
      }
    })
 */
const handleHttpRequest = async (requestType = 'post', ...httpArgs) => {
  let httpWrapperMethod;
  switch (requestType.toLowerCase()) {
    case 'get':
      httpWrapperMethod = httpGET;
      break;
    case 'put':
      httpWrapperMethod = httpPUT;
      break;
    case 'patch':
      httpWrapperMethod = httpPATCH;
      break;
    case 'delete':
      httpWrapperMethod = httpDELETE;
      break;
    case 'constructor':
      httpWrapperMethod = httpSend;
      break;
    default:
      httpWrapperMethod = httpPOST;
      break;
  }
  const httpResponse = await httpWrapperMethod(...httpArgs);
  const processedResponse = processAxiosResponse(httpResponse);
  return { httpResponse, processedResponse };
};

/**
 * depricating: handles proxying requests to destinations from server, expects requsts in "defaultRequestConfig"
 * note: needed for test api
 * @param {*} request
 * @returns
 */
const proxyRequest = async (request, destType) => {
  const { metadata } = request;
  const { endpoint, data, method, params, headers } = prepareProxyRequest(request);
  const requestOptions = {
    url: endpoint,
    data,
    params,
    headers,
    method,
  };
  const response = await httpSend(requestOptions, {
    feature: 'proxy',
    destType,
    metadata,
  });
  return response;
};

module.exports = {
  httpSend,
  httpGET,
  httpDELETE,
  httpPOST,
  httpPUT,
  httpPATCH,
  proxyRequest,
  prepareProxyRequest,
  getPayloadData,
  getFormData,
  handleHttpRequest,
  enhanceRequestOptions,
  fireHTTPStats,
};
