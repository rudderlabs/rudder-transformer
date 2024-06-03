/* eslint-disable no-const-assign */
const lodash = require('lodash');
const get = require('get-value');
const {
  InstrumentationError,
  ConfigurationError,
  getErrorRespEvents,
} = require('@rudderstack/integrations-lib');
const { schemaFields } = require('./config');
const { MappedToDestinationKey } = require('../../../constants');
const stats = require('../../../util/stats');
const {
  getDestinationExternalIDInfoForRetl,
  isDefinedAndNotNullAndNotEmpty,
  checkSubsetOfArray,
  returnArrayOfSubarrays,
  getSuccessRespEvents,
  generateErrorObject,
} = require('../../util');
const {
  ensureApplicableFormat,
  getUpdatedDataElement,
  getSchemaForEventMappedToDest,
  batchingWithPayloadSize,
  responseBuilderSimple,
  getDataSource,
} = require('./util');

function getErrorMetaData(inputs, acceptedOperations) {
  const metadata = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key in inputs) {
    if (!acceptedOperations.includes(key)) {
      inputs[key].forEach((input) => {
        metadata.push(input.metadata);
      });
    }
  }
  return metadata;
}

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

  const finalResponse = [];

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

  const eventTypes = ['update', 'insert', 'delete'];
  const errorMetaData = [];
  const errorMetaDataObject = getErrorMetaData(groupedRecordsByAction, eventTypes);
  if (errorMetaDataObject.length > 0) {
    errorMetaData.push(errorMetaDataObject);
  }

  const error = new InstrumentationError('Invalid action type in record event');
  const errorObj = generateErrorObject(error);
  const errorResponseList = errorMetaData.map((metadata) =>
    getErrorRespEvents(metadata, errorObj.status, errorObj.message, errorObj.statTags),
  );

  if (deleteResponse && deleteResponse.batchedRequest.length > 0) {
    finalResponse.push(deleteResponse);
  }
  if (insertResponse && insertResponse.batchedRequest.length > 0) {
    finalResponse.push(insertResponse);
  }
  if (updateResponse && updateResponse.batchedRequest.length > 0) {
    finalResponse.push(updateResponse);
  }
  if (errorResponseList.length > 0) {
    finalResponse.push(...errorResponseList);
  }

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
