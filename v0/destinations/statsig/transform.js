const {
  defaultPostRequestConfig,
  defaultRequestConfig
} = require("../../util");
const { ENDPOINT } = require("./config");

function process(event) {
  const { message, destination } = event;
  const response = defaultRequestConfig();
  const { secretKey } = destination.Config;

  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = message;
  response.headers = {
    "content-type": "application/json",
    "STATSIG-API-KEY": secretKey
  };

  response.endpoint = ENDPOINT;

  return response;
}

exports.process = process;
