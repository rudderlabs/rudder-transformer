/* eslint-disable @typescript-eslint/naming-convention */
const sha256 = require('sha256');
const {
  removeUndefinedAndNullAndEmptyValues,
  handleRtTfSingleEventError,
} = require('@rudderstack/integrations-lib');
const { getSuccessRespEvents } = require('../../util');
const { validateRequest, buildResponseWithJSON, batchEvents } = require('./utils');

/**
 * This function returns audience object in the form of destination API
 * @param {*} message
 * @param {*} destination
 * @param {*} metadata
 */
const processRecordEvent = (message, config) => {
  const { fields, operation } = message;
  const {
    effective_at,
    expires_at,
    email,
    phone_number,
    handle,
    device_id,
    twitter_id,
    partner_user_id,
  } = fields;
  const { enableHash } = config;
  const users = removeUndefinedAndNullAndEmptyValues({
    email: enableHash ? email.split(',').map(sha256) : email.split(','),
    phone_number: enableHash ? phone_number.split(',').map(sha256) : phone_number.split(','),
    handle: enableHash ? handle.split(',').map(sha256) : handle.split(','),
    device_id: enableHash ? device_id.split(',').map(sha256) : device_id.split(','),
    twitter_id: enableHash ? twitter_id.split(',').map(sha256) : twitter_id.split(','),
    partner_user_id: [partner_user_id.split(',')],
  });

  return {
    operation_type: operation !== 'delete' ? 'Update' : 'Delete',
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

  validateRequest(message);
  const payload = processRecordEvent(message, config);
  return buildResponseWithJSON(payload, config, metadata);
};
const processRouterDest = async (inputs, reqMetadata) => {
  const responseList = []; // list containing single track event payload
  const errorRespList = []; // list of error
  inputs.map(async (event) => {
    try {
      if (event.message.statusCode) {
        // already transformed event
        responseList.push(event);
      } else {
        // if not transformed
        responseList.push({
          message: processRecordEvent(event.message, event.destination?.config),
          metadata: event.metadata,
          destination: event.destination,
        });
      }
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
      errorRespList.push(errRespEvent);
    }
  });
  const batchedResponseList = [];
  if (responseList.length > 0) {
    const batchedEvents = batchEvents(responseList);
    batchedEvents.forEach((batch) => {
      const batchedRequest = buildResponseWithJSON(batch);
      batchedResponseList.push(
        getSuccessRespEvents(batchedRequest, batch.metadata, batch.destination, true),
      );
    });
  }
  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };
