/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */

const _ = require("lodash");
const http = require("http");
const https = require("https");
const axios = require("axios");
const log = require("../logger");

const MAX_CONTENT_LENGTH =
  parseInt(process.env.MAX_CONTENT_LENGTH, 10) || 100000000;
const MAX_BODY_LENGTH = parseInt(process.env.MAX_BODY_LENGTH, 10) || 100000000;
// (httpsAgent, httpsAgent) ,these are deployment specific configs not request specific
const networkClientConfigs = {
  // `method` is the request method to be used when making the request
  method: "get",

  // `timeout` specifies the number of milliseconds before the request times out. If the request takes longer than `timeout`, the request will be aborted.
  timeout: 1000 * 60,

  // `withCredentials` indicates whether or not cross-site Access-Control requests should be made using credentials
  withCredentials: false,

  // `responseType` indicates the type of data that the server will respond with options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
  responseType: "json",

  // `responseEncoding` indicates encoding to use for decoding responses (Node.js only),
  responseEncoding: "utf8",

  // `maxBodyLength` (Node only option) defines the max size of the http request content in bytes allowed,
  maxBodyLength: 1000 * 1000 * 10,

  // `maxRedirects` defines the maximum number of redirects to follow in node.js,
  maxRedirects: 5,

  // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
  httpAgent: new http.Agent({ keepAlive: true }),

  // and https requests, respectively, in node.js. This allows options to be added like `keepAlive` that are not enabled by default.
  httpsAgent: new https.Agent({ keepAlive: true })
};

/**
 * sends an http request with underlying client, expects request options
 * @param {*} options
 * @returns
 */
const httpSend = async options => {
  let clientResponse;
  // here the options argument K-Vs will take priority over requestOptions
  const requestOptions = {
    ...networkClientConfigs,
    ...options,
    maxContentLength: MAX_CONTENT_LENGTH,
    maxBodyLength: MAX_BODY_LENGTH
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

/**
 * Prepares the proxy request
 * @param {*} request
 * @returns
 */
const prepareProxyRequest = request => {
  const { body, method, params, endpoint } = request;
  let { headers } = request;
  let data;
  let payload;
  let payloadFormat;
  for (const [key, value] of Object.entries(body)) {
    if (!_.isEmpty(value)) {
      payload = value;
      payloadFormat = key;
    }
  }

  switch (payloadFormat) {
    case "JSON_ARRAY":
      data = payload.batch;
      // TODO: add headers
      break;
    case "JSON":
      data = payload;
      headers = { ...headers, "Content-Type": "application/json" };
      break;
    case "XML":
      data = `${payload}`;
      headers = { ...headers, "Content-Type": "application/xml" };
      break;
    case "FORM":
      data = new URLSearchParams();
      Object.keys(payload).forEach(key => {
        let payloadValStr = `${payload[key]}`;
        if (typeof payload[key] === "object") {
          payloadValStr = JSON.stringify(payload[key]);
        }
        data.append(`${key}`, payloadValStr);
      });
      headers = {
        ...headers,
        "Content-Type": "application/x-www-form-urlencoded"
      };
      break;
    case "MULTIPART-FORM":
      // TODO:
      break;
    default:
      log.debug(`body format ${payloadFormat} not supported`);
  }
  // Ref: https://github.com/rudderlabs/rudder-server/blob/master/router/network.go#L164
  headers["User-Agent"] = "RudderLabs";
  return { endpoint, data, params, headers, method };
};

/**
 * depricating: handles proxying requests to destinations from server, expects requsts in "defaultRequestConfig"
 * note: needed for test api
 * @param {*} request
 * @returns
 */
const proxyRequest = async request => {
  const { endpoint, data, method, params, headers } = prepareProxyRequest(
    request
  );
  const requestOptions = {
    url: endpoint,
    data,
    params,
    headers,
    method
  };
  const response = await httpSend(requestOptions);
  return response;
};
module.exports = {
  httpSend,
  httpGET,
  httpDELETE,
  httpPOST,
  httpPUT,
  httpPATCH,
  proxyRequest
};
