const _ = require('lodash');
const get = require('get-value');
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
  checkSubsetOfArray,
  isDefinedAndNotNullAndNotEmpty,
  returnArrayOfSubarrays,
  flattenMap,
  simpleProcessRouterDest,
  getDestinationExternalIDInfoForRetl,
} = require('../../util');
const {
  prepareDataField,
  getSchemaForEventMappedToDest,
  batchingWithPayloadSize,
} = require('./util');
const {
  getEndPoint,
  schemaFields,
  USER_ADD,
  USER_DELETE,
  typeFields,
  subTypeFields,
} = require('./config');

const { MappedToDestinationKey } = require('../../../constants');
const {
  InstrumentationError,
  TransformationError,
  ConfigurationError,
} = require('../../util/errorTypes');

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

// Function responsible prepare the payload field of every event parameter

const preparePayload = (
  userUpdateList,
  userSchema,
  paramsPayload,
  isHashRequired,
  disableFormat,
  destinationId,
) => {
  const prepareFinalPayload = _.cloneDeep(paramsPayload);
  if (Array.isArray(userSchema)) {
    prepareFinalPayload.schema = userSchema;
  } else {
    prepareFinalPayload.schema = [userSchema];
  }

  prepareFinalPayload.data = prepareDataField(
    userSchema,
    userUpdateList,
    isHashRequired,
    disableFormat,
    destinationId,
  );
  return batchingWithPayloadSize(prepareFinalPayload);
};

// Function responsible for building the parameters for each event calls

const prepareResponse = (
  message,
  destination,
  allowedAudienceArray,
  userSchema,
  isHashRequired = true,
) => {
  const { accessToken, disableFormat, type, subType, isRaw } = destination.Config;

  const mappedToDestination = get(message, MappedToDestinationKey);

  // If mapped to destination, use the mapped fields instead of destination userschema
  if (mappedToDestination) {
    // eslint-disable-next-line no-param-reassign
    userSchema = getSchemaForEventMappedToDest(message);
  }

  const prepareParams = {};
  // creating the parameters field
  const paramsPayload = {};
  const dataSource = {};

  prepareParams.access_token = accessToken;

  // creating the payload field for parameters
  if (isRaw) {
    paramsPayload.is_raw = isRaw;
  }
  // creating the data_source block

  if (type && type !== 'NA' && typeFields.includes(type)) {
    dataSource.type = type;
  }

  if (subType && subType !== 'NA' && subTypeFields.includes(subType)) {
    dataSource.sub_type = subType;
  }
  if (Object.keys(dataSource).length > 0) {
    paramsPayload.data_source = dataSource;
  }
  const payloadBatches = preparePayload(
    allowedAudienceArray,
    userSchema,
    paramsPayload,
    isHashRequired,
    disableFormat,
    destination.ID,
  );
  // paramsPayload.schema = userSchema;
  const respList = [];
  payloadBatches.forEach((payloadBatch) => {
    const response = {
      ...prepareParams,
      payload: payloadBatch,
    };
    respList.push(response);
  });
  return respList;
};

/**
 * Prepare to send events array
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const prepareToSendEvents = (
  message,
  destination,
  audienceChunksArray,
  userSchema,
  isHashRequired,
  operation,
) => {
  const toSendEvents = [];
  audienceChunksArray.forEach((allowedAudienceArray) => {
    const responseArray = prepareResponse(
      message,
      destination,
      allowedAudienceArray,
      userSchema,
      isHashRequired,
    );
    responseArray.forEach((response) => {
      const wrappedResponse = {
        responseField: response,
        operationCategory: operation,
      };
      toSendEvents.push(wrappedResponse);
    });
  });
  return toSendEvents;
};
const processEvent = (message, destination) => {
  const respList = [];
  let toSendEvents = [];
  let { userSchema } = destination.Config;
  const { isHashRequired, audienceId, maxUserCount } = destination.Config;
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  const maxUserCountNumber = parseInt(maxUserCount, 10);

  if (Number.isNaN(maxUserCountNumber)) {
    throw new ConfigurationError('Batch size must be an Integer.');
  }
  if (message.type.toLowerCase() !== 'audiencelist') {
    throw new InstrumentationError(` ${message.type} call is not supported `);
  }
  let operationAudienceId = audienceId;
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (!operationAudienceId && mappedToDestination) {
    const { objectType } = getDestinationExternalIDInfoForRetl(message, 'FB_CUSTOM_AUDIENCE');
    operationAudienceId = objectType;
  }
  if (!isDefinedAndNotNullAndNotEmpty(operationAudienceId)) {
    throw new ConfigurationError('Audience ID is a mandatory field');
  }

  // If mapped to destination, use the mapped fields instead of destination userschema
  if (mappedToDestination) {
    userSchema = getSchemaForEventMappedToDest(message);
  }

  // When one single schema field is added in the webapp, it does not appear to be an array
  if (!Array.isArray(userSchema)) {
    userSchema = [userSchema];
  }

  // when configured schema field is different from the allowed fields
  if (!checkSubsetOfArray(schemaFields, userSchema)) {
    throw new ConfigurationError('One or more of the schema fields are not supported');
  }
  const { listData } = message.properties;

  // when "remove" is present in the payload
  if (isDefinedAndNotNullAndNotEmpty(listData[USER_DELETE])) {
    const audienceChunksArray = returnArrayOfSubarrays(listData[USER_DELETE], maxUserCountNumber);
    toSendEvents = prepareToSendEvents(
      message,
      destination,
      audienceChunksArray,
      userSchema,
      isHashRequired,
      USER_DELETE,
    );
  }

  // When "add" is present in the payload
  if (isDefinedAndNotNullAndNotEmpty(listData[USER_ADD])) {
    const audienceChunksArray = returnArrayOfSubarrays(listData[USER_ADD], maxUserCountNumber);
    toSendEvents.push(
      ...prepareToSendEvents(
        message,
        destination,
        audienceChunksArray,
        userSchema,
        isHashRequired,
        USER_ADD,
      ),
    );
  }
  toSendEvents.forEach((sendEvent) => {
    respList.push(responseBuilderSimple(sendEvent, operationAudienceId));
  });
  // When userListAdd or userListDelete is absent or both passed as empty arrays
  if (respList.length === 0) {
    throw new InstrumentationError(
      'Missing valid parameters, unable to generate transformed payload',
    );
  }
  return respList;
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return flattenMap(respList);
};

module.exports = { process, processRouterDest };
