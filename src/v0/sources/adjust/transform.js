const { TransformationError } = require('@rudderstack/integrations-lib');
const logger = require('../../../logger');
const { CommonUtils } = require('../../../util/common');
const { flattenParams } = require('./utils');
const { processPayload } = require('./core');

const getPayloadFromEvent = (event) => {
  // This function extracts the query_parameters from the event
  // and flattens it to get the payload
  const { query_parameters: qParams } = event;
  logger.debug(`[Adjust] Input event: query_params: ${JSON.stringify(qParams)}`);
  if (!qParams) {
    throw new TransformationError('Query_parameters is missing');
  }
  return flattenParams(qParams);
};

const process = (events) => {
  // This function just converts the
  //  - incoming payload to array if not an array
  //  - extracts params and constructs payload
  //  - sends it to processPayload for transformation
  const eventsArray = CommonUtils.toArray(events);
  return eventsArray.map((inputEvent) => {
    const formattedPayload = getPayloadFromEvent(inputEvent);
    return processPayload(formattedPayload);
  });
};

module.exports = { process };
