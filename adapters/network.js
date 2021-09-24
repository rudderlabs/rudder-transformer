/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
const http = require("http");
const https = require("https");
const axios = require("axios");
const _ = require("lodash");
const log = require("../logger");

const send = async options => {
  // here the options argument K-Vs will take priority over requestOptions
  const requestOptions = {
    ...{
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
    },
    ...options
  };
  // Send a request
  let res;
  try {
    const response = await axios(requestOptions);
    res = { success: true, response };
  } catch (err) {
    res = { success: false, response: err };
  }
  return res;
};

/*
Request Structure
{
  "body": {
    "XML": {},
    "FORM": {},
    "JSON": {}
  },
  "type": "REST",
  "files": {},
  "method": "POST",
  "params": {},
  "userId": "8a7f781e-48ae-4584-8118-7d68f2009839",
  "headers": {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer undefined"
  },
  "version": "1",
  "endpoint": "https://rest.fra-01.braze.eu/users/track",
  "destination": "Braze" --> new addition
}
 */
const sendRequest = async request => {
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
      // data = new FormData();
      // TODO:
      break;
    default:
      log.debug(`body format ${payloadFormat} not supported`);
  }
  const rOptions = {
    url: endpoint,
    data,
    params,
    headers,
    method
  };
  const response = await send(rOptions);
  return response;
};
module.exports = { send, sendRequest };
