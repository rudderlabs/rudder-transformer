const { flattenQueryParams, TransformationError } = require('@rudderstack/integrations-lib');
const { CommonUtils } = require('../../util/common');
const logger = require('../../logger');
const { processPayload } = require('./core');

/**
 * Extracts and flattens query parameters from the webhook request
 * @param {Object} inputRequest - The incoming webhook request object
 * @returns {Object} Flattened query parameters
 * @throws {TransformationError} If request or query_parameters are missing
 */
const getPayloadFromRequest = (inputRequest) => {
  const { request } = inputRequest;
  if (!request) {
    throw new TransformationError('request field is missing from webhook V2 payload');
  }

  const { query_parameters: qParams } = request;
  logger.debug(`[Adjust] Input event: query_params: ${JSON.stringify(qParams)}`);
  if (!qParams || Object.keys(qParams).length === 0) {
    throw new TransformationError('Query_parameters is missing');
  }

  return flattenQueryParams(qParams);
};

/**
 * Processes incoming webhook requests from Adjust
 * @param {Object|Array} requests - Single request object or array of webhook requests
 * @returns {Array} Array of transformed payloads ready to be sent to rudder-server
 * @description
 * This function:
 * - converts incoming payload to array
 * - extracts params and constructs payload
 * - sends it to processPayload for transformation
 */
const process = (requests) => {
  const requestsArray = CommonUtils.toArray(requests);
  return requestsArray.map((inputRequest) => {
    const formattedPayload = getPayloadFromRequest(inputRequest);
    return processPayload(formattedPayload);
  });
};

module.exports = { process };
