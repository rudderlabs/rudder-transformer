const { TransformationError } = require('@rudderstack/integrations-lib');
const { CommonUtils } = require('../../util/common');
const logger = require('../../logger');
const { flattenParams } = require('../../v0/sources/adjust/utils');
const { processPayload } = require('../../v0/sources/adjust/core');

const getPayloadFromRequest = (inputRequest) => {
  // This function extracts the query_parameters from the request
  // and flattens it to get the payload

  const { request } = inputRequest;
  if (!request) {
    throw new TransformationError('request field is missing from webhook V2 payload');
  }

  const { query_parameters: qParams } = request;
  logger.debug(`[Adjust] Input event: query_params: ${JSON.stringify(qParams)}`);
  if (!qParams) {
    throw new TransformationError('Query_parameters is missing');
  }

  return flattenParams(qParams);
};

const process = (requests) => {
  // This function just converts the
  //  - incoming payload to array
  //  - extracts params and constructs payload
  //  - sends it to processPayload for transformation
  const requestsArray = CommonUtils.toArray(requests);
  return requestsArray.map((inputRequest) => {
    const formattedPayload = getPayloadFromRequest(inputRequest);
    return processPayload(formattedPayload);
  });
};

module.exports = { process };
