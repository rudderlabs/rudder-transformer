/* eslint-disable @typescript-eslint/naming-convention */
const {
  removeUndefinedAndNullAndEmptyValues,
  handleRtTfSingleEventError,
  InstrumentationError,
} = require('@rudderstack/integrations-lib');
const { getAuthHeaderForRequest } = require('../twitter_ads/util');
const { defaultRequestConfig, defaultPostRequestConfig } = require('../../util');
const { BASE_URL } = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { getOAuthFields, batchEvents, getUserDetails } = require('./utils');

// Docs: https://developer.x.com/en/docs/x-ads-api/audiences/api-reference/custom-audience-user
const buildResponseWithJSON = (JSON, config, metadata) => {
  const response = defaultRequestConfig();
  response.endpoint = BASE_URL.replace(':account_id', config.accountId).replace(
    ':custom_audience_id',
    config.audienceId,
  );
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = JSON;
  // required to be in accordance with oauth package
  const request = {
    url: response.endpoint,
    method: response.method,
    body: response.body.JSON,
  };

  const oAuthObject = getOAuthFields(metadata);
  const authHeader = getAuthHeaderForRequest(request, oAuthObject).Authorization;
  response.headers = {
    Authorization: authHeader,
    'Content-Type': JSON_MIME_TYPE,
  };
  return response;
};
/**
 * This function returns audience object in the form of destination API
 * @param {*} message
 * @param {*} destination
 * @param {*} metadata
 */
const processRecordEvent = (message, config) => {
  const { fields, action } = message;
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

  if (message.type !== 'record') {
    throw new InstrumentationError(`[X AUDIENCE]: ${message.type} is not supported`);
  }
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
  const batchedResponseList = [];
  if (responseList.length > 0) {
    const batchedEvents = batchEvents(responseList, destination);
    batchedEvents.forEach((batch) => {
      batchedResponseList.push(buildResponseWithJSON(batch));
    });
  }
  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest, buildResponseWithJSON };
