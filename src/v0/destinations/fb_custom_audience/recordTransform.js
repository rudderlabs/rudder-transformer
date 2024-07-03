/* eslint-disable no-const-assign */
const lodash = require('lodash');
const get = require('get-value');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { schemaFields } = require('./config');
const { MappedToDestinationKey } = require('../../../constants');
const stats = require('../../../util/stats');
const {
  getDestinationExternalIDInfoForRetl,
  isDefinedAndNotNullAndNotEmpty,
  checkSubsetOfArray,
  returnArrayOfSubarrays,
  getSuccessRespEvents,
} = require('../../util');
const { getErrorResponse, createFinalResponse } = require('../../util/recordUtils');
const {
  ensureApplicableFormat,
  getUpdatedDataElement,
  getSchemaForEventMappedToDest,
  batchingWithPayloadSize,
  responseBuilderSimple,
  getDataSource,
} = require('./util');

const processRecordEventArray = (
  recordChunksArray,
  userSchema,
  isHashRequired,
  disableFormat,
  paramsPayload,
  prepareParams,
  destination,
  operation,
  operationAudienceId,
) => {
  const toSendEvents = [];
  const metadata = [];
  recordChunksArray.forEach((recordArray) => {
    const data = [];
    recordArray.forEach((input) => {
      const { fields } = input.message;
      let dataElement = [];
      let nullUserData = true;

      userSchema.forEach((eachProperty) => {
        const userProperty = fields[eachProperty];
        let updatedProperty = userProperty;

        if (isHashRequired && !disableFormat) {
          updatedProperty = ensureApplicableFormat(eachProperty, userProperty);
        }

        dataElement = getUpdatedDataElement(
          dataElement,
          isHashRequired,
          eachProperty,
          updatedProperty,
        );

        if (dataElement[dataElement.length - 1]) {
          nullUserData = false;
        }
      });

      if (nullUserData) {
        stats.increment('fb_custom_audience_event_having_all_null_field_values_for_a_user', {
          destinationId: destination.ID,
          nullFields: userSchema,
        });
      }
      data.push(dataElement);
      metadata.push(input.metadata);
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

      const builtResponse = responseBuilderSimple(wrappedResponse, operationAudienceId);

      toSendEvents.push(builtResponse);
    });
  });

  const response = getSuccessRespEvents(toSendEvents, metadata, destination, true);

  return response;
};

async function processRecordInputs(groupedRecordInputs) {
  const { destination } = groupedRecordInputs[0];
  const { message } = groupedRecordInputs[0];
  const {
    isHashRequired,
    accessToken,
    disableFormat,
    type,
    subType,
    isRaw,
    maxUserCount,
    audienceId,
  } = destination.Config;
  const prepareParams = {
    access_token: accessToken,
  };

  // maxUserCount validation
  const maxUserCountNumber = parseInt(maxUserCount, 10);
  if (Number.isNaN(maxUserCountNumber)) {
    throw new ConfigurationError('Batch size must be an Integer.');
  }

  // audience id validation
  let operationAudienceId = audienceId;
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (mappedToDestination) {
    const { objectType } = getDestinationExternalIDInfoForRetl(message, 'FB_CUSTOM_AUDIENCE');
    operationAudienceId = objectType;
  }
  if (!isDefinedAndNotNullAndNotEmpty(operationAudienceId)) {
    throw new ConfigurationError('Audience ID is a mandatory field');
  }

  // user schema validation
  let { userSchema } = destination.Config;
  if (mappedToDestination) {
    userSchema = getSchemaForEventMappedToDest(message);
  }
  if (!Array.isArray(userSchema)) {
    userSchema = [userSchema];
  }
  if (!checkSubsetOfArray(schemaFields, userSchema)) {
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

  const groupedRecordsByAction = lodash.groupBy(groupedRecordInputs, (record) =>
    record.message.action?.toLowerCase(),
  );

  let insertResponse;
  let deleteResponse;
  let updateResponse;

  if (groupedRecordsByAction.delete) {
    const deleteRecordChunksArray = returnArrayOfSubarrays(
      groupedRecordsByAction.delete,
      maxUserCountNumber,
    );
    deleteResponse = processRecordEventArray(
      deleteRecordChunksArray,
      userSchema,
      isHashRequired,
      disableFormat,
      paramsPayload,
      prepareParams,
      destination,
      'remove',
      operationAudienceId,
    );
  }

  if (groupedRecordsByAction.insert) {
    const insertRecordChunksArray = returnArrayOfSubarrays(
      groupedRecordsByAction.insert,
      maxUserCountNumber,
    );

    insertResponse = processRecordEventArray(
      insertRecordChunksArray,
      userSchema,
      isHashRequired,
      disableFormat,
      paramsPayload,
      prepareParams,
      destination,
      'add',
      operationAudienceId,
    );
  }

  if (groupedRecordsByAction.update) {
    const updateRecordChunksArray = returnArrayOfSubarrays(
      groupedRecordsByAction.update,
      maxUserCountNumber,
    );
    updateResponse = processRecordEventArray(
      updateRecordChunksArray,
      userSchema,
      isHashRequired,
      disableFormat,
      paramsPayload,
      prepareParams,
      destination,
      'add',
      operationAudienceId,
    );
  }

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

module.exports = {
  processRecordInputs,
};
