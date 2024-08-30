/* eslint-disable @typescript-eslint/naming-convention */
const {
  removeUndefinedAndNullAndEmptyValues,
  InstrumentationError,
} = require('@rudderstack/integrations-lib');
const { handleRtTfSingleEventError } = require('../../util');
const { batchEvents, buildResponseWithJSON, getUserDetails } = require('./utils');
/**
 * This function returns audience object in the form of destination API
 * @param {*} message
 * @param {*} destination
 * @param {*} metadata
 */
const processRecordEvent = (message, config) => {
  const { fields, action, type } = message;
  if (type !== 'record') {
    throw new InstrumentationError(`[X AUDIENCE]: ${type} is not supported`);
  }
  const { effective_at, expires_at } = fields;
  const users = [getUserDetails(fields, config)];

  return {
    operation_type: action !== 'delete' ? 'Update' : 'Delete',
    params: removeUndefinedAndNullAndEmptyValues({
      effective_at,
      expires_at,
      users,
    }),
  };
};
const process = (event) => {
  const { message, destination, metadata } = event;
  const { config } = destination;
  const payload = [processRecordEvent(message, config)];
  return buildResponseWithJSON(payload, config, metadata);
};
const processRouterDest = async (inputs, reqMetadata) => {
  const responseList = []; // list containing single track event payload
  const errorRespList = []; // list of error
  const { destination } = inputs[0];
  inputs.map(async (event) => {
    try {
      if (event.message.statusCode) {
        // already transformed event
        responseList.push(event);
      } else {
        // if not transformed
        responseList.push({
          message: processRecordEvent(event.message, destination?.config),
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

module.exports = { process, processRouterDest, buildResponseWithJSON };
