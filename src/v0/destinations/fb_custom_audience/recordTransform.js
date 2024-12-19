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

const processRecordEventArray = (
  recordChunksArray,
  userSchema,
  isHashRequired,
  disableFormat,
  paramsPayload,
  prepareParams,
  destination,
  operation,
  audienceId,
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

      const builtResponse = responseBuilderSimple(wrappedResponse, audienceId);

      toSendEvents.push(builtResponse);
    });
  });

  const response = getSuccessRespEvents(toSendEvents, metadata, destination, true);

  return response;
};

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

  let insertResponse;
  let deleteResponse;
  let updateResponse;

  if (groupedRecordsByAction.delete) {
    const deleteRecordChunksArray = returnArrayOfSubarrays(
      groupedRecordsByAction.delete,
      MAX_USER_COUNT,
    );
    deleteResponse = processRecordEventArray(
      deleteRecordChunksArray,
      cleanUserSchema,
      isHashRequired,
      disableFormat,
      paramsPayload,
      prepareParams,
      destination,
      'remove',
      audienceId,
    );
  }

  if (groupedRecordsByAction.insert) {
    const insertRecordChunksArray = returnArrayOfSubarrays(
      groupedRecordsByAction.insert,
      MAX_USER_COUNT,
    );

    insertResponse = processRecordEventArray(
      insertRecordChunksArray,
      cleanUserSchema,
      isHashRequired,
      disableFormat,
      paramsPayload,
      prepareParams,
      destination,
      'add',
      audienceId,
    );
  }

  if (groupedRecordsByAction.update) {
    const updateRecordChunksArray = returnArrayOfSubarrays(
      groupedRecordsByAction.update,
      MAX_USER_COUNT,
    );
    updateResponse = processRecordEventArray(
      updateRecordChunksArray,
      cleanUserSchema,
      isHashRequired,
      disableFormat,
      paramsPayload,
      prepareParams,
      destination,
      'add',
      audienceId,
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

const processRecordInputsV2 = (groupedRecordInputs) => {
  const { connection, message } = groupedRecordInputs[0];
  const { isHashRequired, disableFormat, type, subType, isRaw, audienceId } =
    connection.config.destination;
  // Ref: https://www.notion.so/rudderstacks/VDM-V2-Final-Config-and-Record-EventPayload-8cc80f3d88ad46c7bc43df4b87a0bbff
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
