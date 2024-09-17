/* eslint-disable @typescript-eslint/naming-convention */
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { handleRtTfSingleEventError } = require('../../util');
const { batchEvents, buildResponseWithUsers, getUserDetails } = require('./utils');
/**
 * This function returns the user traits list required in request for
 * making a call to create a group of users in amazon_audience
 * @param {*} record
 * @param {*} destination
 * @param {*} metadata
 */
const processRecord = (record, config) => {
  const { fields, action, type } = record;
  if (type !== 'record') {
    throw new InstrumentationError(`[AMAZON AUDIENCE]: ${type} is not supported`);
  }
  return { user: getUserDetails(fields, config), action: action !== 'delete' ? 'add' : 'remove' };
};

// This function is used to process a single record
const process = (event) => {
  const { message, destination, metadata } = event;
  const { Config } = destination;
  const { user, action } = processRecord(message, Config);
  return buildResponseWithUsers([user], action, Config, [metadata.jobId], metadata.secret);
};
// This function is used to process multiple records
const processRouterDest = async (inputs, reqMetadata) => {
  const responseList = []; // list containing all successful responses
  const errorRespList = []; // list of error
  const { destination } = inputs[0];
  const { Config } = destination;
  inputs.map(async (event) => {
    try {
      if (event.message.statusCode) {
        // already transformed event
        responseList.push(event);
      } else {
        // if not transformed
        responseList.push({
          message: processRecord(event.message, Config),
          metadata: event.metadata,
          destination,
        });
      }
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
      errorRespList.push(errRespEvent);
    }
  });
  let batchedResponseList = [];
  if (responseList.length > 0) {
    batchedResponseList = batchEvents(responseList, destination);
  }
  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };
