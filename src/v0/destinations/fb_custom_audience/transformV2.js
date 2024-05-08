/* eslint-disable no-const-assign */
const lodash = require('lodash');
const get = require('get-value');
const {
  InstrumentationError,
  ConfigurationError,
  TransformationError,
} = require('@rudderstack/integrations-lib');
const { schemaFields, typeFields, subTypeFields, getEndPoint } = require('./config');
const { MappedToDestinationKey } = require('../../../constants');
const stats = require('../../../util/stats');
const {
  getDestinationExternalIDInfoForRetl,
  isDefinedAndNotNullAndNotEmpty,
  checkSubsetOfArray,
  defaultRequestConfig,
  returnArrayOfSubarrays,
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
} = require('../../util');
const {
  ensureApplicableFormat,
  getUpdatedDataElement,
  getSchemaForEventMappedToDest,
  batchingWithPayloadSize,
} = require('./util');

const responseBuilderSimple = (payload, audienceId) => {
  if (payload) {
    const responseParams = payload.responseField;
    const response = defaultRequestConfig();
    response.endpoint = getEndPoint(audienceId);

    if (payload.operationCategory === 'add') {
      response.method = defaultPostRequestConfig.requestMethod;
    }
    if (payload.operationCategory === 'remove') {
      response.method = defaultDeleteRequestConfig.requestMethod;
    }

    response.params = responseParams;
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError(`Payload could not be constructed`);
};

const processRecordEventArray = (
  recordChunksArray,
  userSchema,
  isHashRequired,
  disableFormat,
  paramsPayload,
  prepareParams,
  destination,
  operation,
) => {
  const toSendEvents = [];
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
      toSendEvents.push(wrappedResponse);
    });
  });

  return toSendEvents;
};

async function processRecordInputs(groupedRecordInputs) {
  const { destination } = groupedRecordInputs[0];
  const { message } = groupedRecordInputs[0];
  const { isHashRequired, accessToken, disableFormat, type, subType, isRaw, maxUserCount } =
    destination.Config;
  const prepareParams = {
    access_token: accessToken,
  };

  // maxUserCount validation
  const maxUserCountNumber = parseInt(maxUserCount, 10);
  if (Number.isNaN(maxUserCountNumber)) {
    throw new ConfigurationError('Batch size must be an Integer.');
  }

  // audience id validation
  const { audienceId } = destination.Config;
  let operationAudienceId = audienceId;
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (!operationAudienceId && mappedToDestination) {
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
  const dataSource = {};
  if (isRaw) {
    paramsPayload.is_raw = isRaw;
  }
  if (type && type !== 'NA' && typeFields.includes(type)) {
    dataSource.type = type;
  }
  if (subType && subType !== 'NA' && subTypeFields.includes(subType)) {
    dataSource.sub_type = subType;
  }
  if (Object.keys(dataSource).length > 0) {
    paramsPayload.data_source = dataSource;
  }

  const groupedRecordsByAction = lodash.groupBy(groupedRecordInputs, (record) =>
    record.message.action?.toLowerCase(),
  );

  const toSendEvents = [];

  if (groupedRecordsByAction.delete) {
    const deleteRecordChunksArray = returnArrayOfSubarrays(
      groupedRecordsByAction.delete,
      maxUserCountNumber,
    );
    toSendEvents.push(
      ...processRecordEventArray(
        deleteRecordChunksArray,
        userSchema,
        isHashRequired,
        disableFormat,
        paramsPayload,
        prepareParams,
        destination,
        'remove',
      ),
    );
  }

  if (groupedRecordsByAction.insert) {
    const insertRecordChunksArray = returnArrayOfSubarrays(
      groupedRecordsByAction.insert,
      maxUserCountNumber,
    );
    toSendEvents.push(
      ...processRecordEventArray(
        insertRecordChunksArray,
        userSchema,
        isHashRequired,
        disableFormat,
        paramsPayload,
        prepareParams,
        destination,
        'add',
      ),
    );
  }

  if (groupedRecordsByAction.update) {
    const updateRecordChunksArray = returnArrayOfSubarrays(
      groupedRecordsByAction.update,
      maxUserCountNumber,
    );
    toSendEvents.push(
      ...processRecordEventArray(
        updateRecordChunksArray,
        userSchema,
        isHashRequired,
        disableFormat,
        paramsPayload,
        prepareParams,
        destination,
        'add',
      ),
    );
  }

  const respList = [];
  toSendEvents.forEach((sendEvent) => {
    respList.push(responseBuilderSimple(sendEvent, operationAudienceId));
  });
  if (respList.length === 0) {
    throw new InstrumentationError(
      'Missing valid parameters, unable to generate transformed payload',
    );
  }
  return respList;
}

module.exports = {
  processRecordInputs,
  responseBuilderSimple,
};
