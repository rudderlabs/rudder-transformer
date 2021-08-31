/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */

const _ = require("lodash");
const log = require("../logger");
const customAxios = require("./networkClient");

const send = async options => {
  // here the options argument K-Vs will take priority over requestOptions
  // Send a request
  let res;
  try {
    const response = await customAxios(options);
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
