const { Utils } = require("rudder-transformer-cdk");
const ErrorBuilder = require("../../v0/util/error");
const { TRANSFORMER_METRIC } = require("../../v0/util/constant");
const { defaultRequestConfig } = require("../../v0/util");

function identifyPostMapper(event, mappedPayload, rudderContext) {
  const { message } = event;
  const payload = mappedPayload;

  let responseBody;
  const customPayload = message.traits || message.context.traits;
  const response = defaultRequestConfig();
  return response;
}

module.exports = { identifyPostMapper };