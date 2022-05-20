/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */

const _ = require("lodash");
const http = require("http");
const https = require("https");
const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");
const log = require("../logger");
const { skipProxy } = require("../util/fetch");

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
 * check if proxy is present or not and return the options accordingly
 * @param {*} url
 * @param {*} options
 * @returns
 */
const getProxyOptions = (url, options = {}) => {
  if (!skipProxy(url) && !!process.env.HTTPS_PROXY) {
    // eslint-disable-next-line no-param-reassign
    options = {
      ...options,
      proxy: false,
      httpsAgent: new HttpsProxyAgent(`${process.env.HTTPS_PROXY}`)
    };
  }
  return options;
};

/**
 * sends an http request with underlying client, expects request options
 * @param {*} options
 * @returns
 */
const httpSend = async options => {
  let clientResponse;
  try {
    // here the options argument K-Vs will take priority over requestOptions
    options = getProxyOptions(options.url, options);
    const requestOptions = {
      ...networkClientConfigs,
      ...options,
      maxContentLength: MAX_CONTENT_LENGTH,
      maxBodyLength: MAX_BODY_LENGTH
    };
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
    // eslint-disable-next-line no-param-reassign
    options = getProxyOptions(url, options);
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
    options = getProxyOptions(url, options);
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
    options = getProxyOptions(url, options);
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
    options = getProxyOptions(url, options);
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
    options = getProxyOptions(url, options);
    const response = await axios.patch(url, data, options);
    clientResponse = { success: true, response };
  } catch (err) {
    clientResponse = { success: false, response: err };
  }
  return clientResponse;
};

/**
 * depricating: handles proxying requests to destinations from server, expects requsts in "defaultRequestConfig"
 * note: needed for test api
 * @param {*} request
 * @returns
 */
const proxyRequest = async request => {
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
        data.append(`${key}`, `${payload[key]}`);
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
