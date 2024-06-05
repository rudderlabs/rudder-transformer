const lodash = require('lodash');
const get = require('get-value');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const {
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
  generateAppSecretProof,
  responseBuilderSimple,
  getDataSource,
} = require('./util');
const { schemaFields, USER_ADD, USER_DELETE } = require('./config');

const { MappedToDestinationKey } = require('../../../constants');
const { processRecordInputs } = require('./recordTransform');
const logger = require('../../../logger');

function checkForUnsupportedEventTypes(dictionary, keyList) {
  const unsupportedEventTypes = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key in dictionary) {
    if (!keyList.includes(key)) {
      unsupportedEventTypes.push(key);
    }
  }
  return unsupportedEventTypes;
}

// Function responsible prepare the payload field of every event parameter
const preparePayload = (
  userUpdateList,
  userSchema,
  paramsPayload,
  isHashRequired,
  disableFormat,
  destinationId,
) => {
  const prepareFinalPayload = lodash.cloneDeep(paramsPayload);
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
  const { accessToken, disableFormat, type, subType, isRaw, appSecret } = destination.Config;

  const mappedToDestination = get(message, MappedToDestinationKey);

  // If mapped to destination, use the mapped fields instead of destination userschema
  if (mappedToDestination) {
    // eslint-disable-next-line no-param-reassign
    userSchema = getSchemaForEventMappedToDest(message);
  }

  const prepareParams = {};
  // creating the parameters field
  const paramsPayload = {};

  prepareParams.access_token = accessToken;

  if (isDefinedAndNotNullAndNotEmpty(appSecret)) {
    const dateNow = Date.now();
    prepareParams.appsecret_time = Math.floor(dateNow / 1000); // Get current Unix time in seconds
    prepareParams.appsecret_proof = generateAppSecretProof(accessToken, appSecret, dateNow);
  }

  // creating the payload field for parameters
  if (isRaw) {
    paramsPayload.is_raw = isRaw;
  }
  // creating the data_source block

  const dataSource = getDataSource(type, subType);
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
  const respList = [];
  const groupedInputs = lodash.groupBy(inputs, (input) => input.message.type?.toLowerCase());
  let transformedRecordEvent = [];
  let transformedAudienceEvent = [];

  const eventTypes = ['record', 'audiencelist'];
  const unsupportedEventList = checkForUnsupportedEventTypes(groupedInputs, eventTypes);
  if (unsupportedEventList.length > 0) {
    logger.info(`unsupported events found ${unsupportedEventList}`);
    throw new ConfigurationError('unsupported events present in the event');
  }

  if (groupedInputs.record) {
    transformedRecordEvent = await processRecordInputs(groupedInputs.record, reqMetadata);
  }

  if (groupedInputs.audiencelist) {
    transformedAudienceEvent = await simpleProcessRouterDest(
      groupedInputs.audiencelist,
      process,
      reqMetadata,
    );
  }

  respList.push(...transformedRecordEvent, ...transformedAudienceEvent);
  return flattenMap(respList);
};

module.exports = { process, processRouterDest };
