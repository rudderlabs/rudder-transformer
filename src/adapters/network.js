/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */

const _ = require('lodash');
const http = require('http');
const https = require('https');
const axios = require('axios');
const log = require('../logger');
const { removeUndefinedValues } = require('../v0/util');
const { processAxiosResponse } = require('./utils/networkUtils');

const MAX_CONTENT_LENGTH = parseInt(process.env.MAX_CONTENT_LENGTH, 10) || 100000000;
const MAX_BODY_LENGTH = parseInt(process.env.MAX_BODY_LENGTH, 10) || 100000000;
// (httpsAgent, httpsAgent) ,these are deployment specific configs not request specific
const networkClientConfigs = {
  // `method` is the request method to be used when making the request
  method: 'get',

  // `timeout` specifies the number of milliseconds before the request times out. If the request takes longer than `timeout`, the request will be aborted.
  timeout: 1000 * 60,

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

/**
 * sends an http request with underlying client, expects request options
 * @param {*} options
 * @returns
 */
const httpSend = async (options) => {
  let clientResponse;
  // here the options argument K-Vs will take priority over requestOptions
  const requestOptions = {
    ...networkClientConfigs,
    ...options,
    maxContentLength: MAX_CONTENT_LENGTH,
    maxBodyLength: MAX_BODY_LENGTH,
  };
  try {
    const response = await axios(requestOptions);
    clientResponse = { success: true, response };
  } catch (err) {
    clientResponse = { success: false, response: err };
  }
  return clientResponse;
};

/**
 *
 * @param {*} url
 * @param {*} options
 * @returns
 *
 * handles http GET requests returns promise as a response throws error in case of non 2XX statuses
 */
const httpGET = async (url, options) => {
  let clientResponse;
  try {
    const response = await axios.get(url, options);
    clientResponse = { success: true, response };
  } catch (err) {
    clientResponse = { success: false, response: err };
  }
  return clientResponse;
};

/**
 *
 * @param {*} url
 * @param {*} options
 * @returns
 *
 * handles http DELETE requests returns promise as a response throws error in case of non 2XX statuses
 */
const httpDELETE = async (url, options) => {
  let clientResponse;
  try {
    const response = await axios.delete(url, options);
    clientResponse = { success: true, response };
  } catch (err) {
    clientResponse = { success: false, response: err };
  }
  return clientResponse;
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
const httpPOST = async (url, data, options) => {
  let clientResponse;
  try {
    const response = await axios.post(url, data, options);
    clientResponse = { success: true, response };
  } catch (err) {
    clientResponse = { success: false, response: err };
  }
  return clientResponse;
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
const httpPUT = async (url, data, options) => {
  let clientResponse;
  try {
    const response = await axios.put(url, data, options);
    clientResponse = { success: true, response };
  } catch (err) {
    clientResponse = { success: false, response: err };
  }
  return clientResponse;
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
const httpPATCH = async (url, data, options) => {
  let clientResponse;
  try {
    const response = await axios.patch(url, data, options);
    clientResponse = { success: true, response };
  } catch (err) {
    clientResponse = { success: false, response: err };
  }
  return clientResponse;
};

const getPayloadData = (body) => {
  let payload;
  let payloadFormat;
  Object.entries(body).forEach(([key, value]) => {
    if (!_.isEmpty(value)) {
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
  const { body, method, params, endpoint, headers } = request;
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
      log.debug(`body format ${payloadFormat} not supported`);
  }
  // Ref: https://github.com/rudderlabs/rudder-server/blob/master/router/network.go#L164
  headers['User-Agent'] = 'RudderLabs';
  return removeUndefinedValues({ endpoint, data, params, headers, method });
};

/**
 * depricating: handles proxying requests to destinations from server, expects requsts in "defaultRequestConfig"
 * note: needed for test api
 * @param {*} request
 * @returns
 */
const proxyRequest = async (request) => {
  const { endpoint, data, method, params, headers } = prepareProxyRequest(request);
  const requestOptions = {
    url: endpoint,
    data,
    params,
    headers,
    method,
  };
  const response = await httpSend(requestOptions);
  return response;
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
};
