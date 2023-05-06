const get = require('get-value');
const set = require('set-value');
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  isDefinedAndNotNull,
} = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');

function process(event) {
  const { message, destination } = event;
  // set context.ip from request_ip if it is missing
  if (!get(message, 'context.ip') && isDefinedAndNotNull(message.request_ip)) {
    set(message, 'context.ip', message.request_ip);
  }
  const response = defaultRequestConfig();
  const { webhookUrl, authHeader } = destination.Config;

  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = message;
  response.headers = {
    'content-type': JSON_MIME_TYPE,
    authorization: authHeader,
  };

  response.userId = message.anonymousId;
  response.endpoint = webhookUrl;

  return response;
}

exports.process = process;
