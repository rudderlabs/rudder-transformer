/* eslint-disable no-const-assign */
const lodash = require('lodash');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { schemaFields, MAX_USER_COUNT } = require('./config');
const stats = require('../../../util/stats');
const {
  getDestinationExternalIDInfoForRetl,
  isDefinedAndNotNullAndNotEmpty,
  checkSubsetOfArray,
  returnArrayOfSubarrays,
  getSuccessRespEvents,
  isEventSentByVDMV2Flow,
  isEventSentByVDMV1Flow,
} = require('../../util');
const { getErrorResponse, createFinalResponse } = require('../../util/recordUtils');
const {
  ensureApplicableFormat,
  getUpdatedDataElement,
  getSchemaForEventMappedToDest,
  batchingWithPayloadSize,
  responseBuilderSimple,
  getDataSource,
  generateAppSecretProof,
} = require('./util');

/**
 * Processes a single record and updates the data element.
 * @param {Object} record - The record to process.
 * @param {Array} userSchema - The schema defining user properties.
 * @param {boolean} isHashRequired - Whether hashing is required.
 * @param {boolean} disableFormat - Whether formatting is disabled.
 * @returns {Object} - The processed data element and metadata.
 */
const processRecord = (record, userSchema, isHashRequired, disableFormat) => {
  const { fields } = record.message;
  let dataElement = [];
  let nullUserData = true;

  userSchema.forEach((eachProperty) => {
    const userProperty = fields[eachProperty];
    let updatedProperty = userProperty;

    if (isHashRequired && !disableFormat) {
      updatedProperty = ensureApplicableFormat(eachProperty, userProperty);
    }

    dataElement = getUpdatedDataElement(dataElement, isHashRequired, eachProperty, updatedProperty);

    if (dataElement[dataElement.length - 1]) {
      nullUserData = false;
    }
  });

  if (nullUserData) {
    stats.increment('fb_custom_audience_event_having_all_null_field_values_for_a_user', {
      destinationId: record.destination.ID,
      nullFields: userSchema,
    });
  }

  return { dataElement, metadata: record.metadata };
};

/**
 * Processes an array of record chunks and prepares the payload for sending.
 * @param {Array} recordChunksArray - The array of record chunks.
 * @param {Object} config - Configuration object containing userSchema, isHashRequired, disableFormat, etc.
 * @param {Object} destination - The destination configuration.
 * @param {string} operation - The operation to perform (e.g., 'add', 'remove').
 * @param {string} audienceId - The audience ID.
 * @returns {Array} - The response events to send.
 */
const processRecordEventArray = (recordChunksArray, config, destination, operation, audienceId) => {
  const { userSchema, isHashRequired, disableFormat, paramsPayload, prepareParams } = config;
  const toSendEvents = [];
  const metadata = [];

  recordChunksArray.forEach((recordArray) => {
    const data = recordArray.map((input) => {
      const { dataElement, metadata: recordMetadata } = processRecord(
        input,
        userSchema,
        isHashRequired,
        disableFormat,
      );
      metadata.push(recordMetadata);
      return dataElement;
    });

    const prepareFinalPayload = lodash.cloneDeep(paramsPayload);
    prepareFinalPayload.schema = userSchema;
    prepareFinalPayload.data = data;
    const payloadBatches = batchingWithPayloadSize(prepareFinalPayload);

    payloadBatches.forEach((payloadBatch) => {
      const response = {
        ...prepareParams,
        payload: payloadBatch,
      };

      const wrappedResponse = {
        responseField: response,
        operationCategory: operation,
      };

      const builtResponse = responseBuilderSimple(wrappedResponse, audienceId);
      toSendEvents.push(builtResponse);
    });
  });

  return getSuccessRespEvents(toSendEvents, metadata, destination, true);
};

/**
 * Prepares the payload for the given events and configuration.
 * @param {Array} events - The events to process.
 * @param {Object} config - The configuration object.
 * @returns {Array} - The final response payload.
 */
function preparePayload(events, config) {
  const { audienceId, userSchema, isRaw, type, subType, isHashRequired, disableFormat } = config;
  const { destination } = events[0];
  const { accessToken, appSecret } = destination.Config;
  const prepareParams = {
    access_token: accessToken,
  };

  if (isDefinedAndNotNullAndNotEmpty(appSecret)) {
    const dateNow = Date.now();
    prepareParams.appsecret_time = Math.floor(dateNow / 1000); // Get current Unix time in seconds
    prepareParams.appsecret_proof = generateAppSecretProof(accessToken, appSecret, dateNow);
  }

  const cleanUserSchema = userSchema.map((field) => field.trim());

  if (!isDefinedAndNotNullAndNotEmpty(audienceId)) {
    throw new ConfigurationError('Audience ID is a mandatory field');
  }
  if (!checkSubsetOfArray(schemaFields, cleanUserSchema)) {
    throw new ConfigurationError('One or more of the schema fields are not supported');
  }

  const paramsPayload = {};

  if (isRaw) {
    paramsPayload.is_raw = isRaw;
  }

  const dataSource = getDataSource(type, subType);
  if (Object.keys(dataSource).length > 0) {
    paramsPayload.data_source = dataSource;
  }

  const groupedRecordsByAction = lodash.groupBy(events, (record) =>
    record.message.action?.toLowerCase(),
  );

  const processAction = (action, operation) => {
    if (groupedRecordsByAction[action]) {
      const recordChunksArray = returnArrayOfSubarrays(
        groupedRecordsByAction[action],
        MAX_USER_COUNT,
      );
      return processRecordEventArray(
        recordChunksArray,
        {
          userSchema: cleanUserSchema,
          isHashRequired,
          disableFormat,
          paramsPayload,
          prepareParams,
        },
        destination,
        operation,
        audienceId,
      );
    }
    return null;
  };

  const deleteResponse = processAction('delete', 'remove');
  const insertResponse = processAction('insert', 'add');
  const updateResponse = processAction('update', 'add');

  const errorResponse = getErrorResponse(groupedRecordsByAction);

  const finalResponse = createFinalResponse(
    deleteResponse,
    insertResponse,
    updateResponse,
    errorResponse,
  );
  if (finalResponse.length === 0) {
    throw new InstrumentationError(
      'Missing valid parameters, unable to generate transformed payload',
    );
  }
  return finalResponse;
}

/**
 * Processes record inputs for V1 flow.
 * @param {Array} groupedRecordInputs - The grouped record inputs.
 * @returns {Array} - The processed payload.
 */
function processRecordInputsV1(groupedRecordInputs) {
  const { destination } = groupedRecordInputs[0];
  const { message } = groupedRecordInputs[0];
  const { isHashRequired, disableFormat, type, subType, isRaw, audienceId, userSchema } =
    destination.Config;

  let operationAudienceId = audienceId;
  let updatedUserSchema = userSchema;
  if (isEventSentByVDMV1Flow(groupedRecordInputs[0])) {
    const { objectType } = getDestinationExternalIDInfoForRetl(message, 'FB_CUSTOM_AUDIENCE');
    operationAudienceId = objectType;
    updatedUserSchema = getSchemaForEventMappedToDest(message);
  }

  return preparePayload(groupedRecordInputs, {
    audienceId: operationAudienceId,
    userSchema: updatedUserSchema,
    isRaw,
    type,
    subType,
    isHashRequired,
    disableFormat,
  });
}

/**
 * Processes record inputs for V2 flow.
 * @param {Array} groupedRecordInputs - The grouped record inputs.
 * @returns {Array} - The processed payload.
 */
const processRecordInputsV2 = (groupedRecordInputs) => {
  const { connection, message } = groupedRecordInputs[0];
  const { isHashRequired, disableFormat, type, subType, isRaw, audienceId } =
    connection.config.destination;
  const identifiers = message?.identifiers;
  let userSchema;
  if (identifiers) {
    userSchema = Object.keys(identifiers);
  }
  const events = groupedRecordInputs.map((record) => ({
    ...record,
    message: {
      ...record.message,
      fields: record.message.identifiers,
    },
  }));
  return preparePayload(events, {
    audienceId,
    userSchema,
    isRaw,
    type,
    subType,
    isHashRequired,
    disableFormat,
  });
};

/**
 * Processes record inputs based on the flow type.
 * @param {Array} groupedRecordInputs - The grouped record inputs.
 * @returns {Array} - The processed payload.
 */
function processRecordInputs(groupedRecordInputs) {
  const event = groupedRecordInputs[0];
  // First check for rETL flow and second check for ES flow
  if (isEventSentByVDMV1Flow(event) || !isEventSentByVDMV2Flow(event)) {
    return processRecordInputsV1(groupedRecordInputs);
  }
  return processRecordInputsV2(groupedRecordInputs);
}

module.exports = {
  processRecordInputs,
};
