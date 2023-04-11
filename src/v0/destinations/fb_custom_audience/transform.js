const sha256 = require('sha256');
const get = require('get-value');

const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
  checkSubsetOfArray,
  isDefinedAndNotNullAndNotEmpty,
  returnArrayOfSubarrays,
  isDefinedAndNotNull,
  flattenMap,
  simpleProcessRouterDest,
  getDestinationExternalIDInfoForRetl,
} = require('../../util');

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

const getSchemaForEventMappedToDest = (message) => {
  const mappedSchema = get(message, 'context.destinationFields');
  if (!mappedSchema) {
    throw new InstrumentationError(
      'context.destinationFields is required property for events mapped to destination ',
    );
  }
  // context.destinationFields has 2 possible values. An Array of fields or Comma seperated string with field names
  let userSchema = Array.isArray(mappedSchema) ? mappedSchema : mappedSchema.split(',');
  userSchema = userSchema.map((field) => field.trim());
  return userSchema;
};

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

// function responsible to ensure the user inputs are passed according to the allowed format

const ensureApplicableFormat = (userProperty, userInformation) => {
  let updatedProperty;
  let userInformationTrimmed;
  userInformation = userInformation.toString();
  switch (userProperty) {
    case 'EMAIL':
      updatedProperty = userInformation.trim().toLowerCase();
      break;
    case 'PHONE':
      // remove all non-numerical characters
      updatedProperty = userInformation.replace(/\D/g, '');
      // remove all leading zeros
      updatedProperty = updatedProperty.replace(/^0+/g, '');
      break;
    case 'GEN':
      updatedProperty =
        userInformation.toLowerCase() === 'f' || userInformation.toLowerCase() === 'female'
          ? 'f'
          : 'm';
      break;
    case 'DOBY':
      updatedProperty = userInformation.trim().replace(/\./g, '');
      break;
    case 'DOBM':
      userInformationTrimmed = userInformation.replace(/\./g, '');
      if (userInformationTrimmed.length < 2) {
        updatedProperty = `0${userInformationTrimmed}`;
      } else {
        updatedProperty = userInformationTrimmed;
      }
      break;
    case 'DOBD':
      userInformationTrimmed = userInformation.replace(/\./g, '');
      if (userInformationTrimmed.length < 2) {
        updatedProperty = `0${userInformationTrimmed}`;
      } else {
        updatedProperty = userInformationTrimmed;
      }
      break;
    case 'LN':
    case 'FN':
    case 'FI':
      if (userProperty !== 'FI') {
        updatedProperty = userInformation.toLowerCase().replace(/[!#$%&@A-Za-z]/g, '');
      } else {
        updatedProperty = userInformation.toLowerCase().replace(/[^!#$%&,.?@A-Za-z]/g, '');
      }
      break;
    case 'MADID':
      updatedProperty = userInformation.toLowerCase();
      break;
    case 'COUNTRY':
      updatedProperty = userInformation.toLowerCase();
      break;
    case 'ZIP':
      userInformationTrimmed = userInformation.replace(/\s/g, '');
      updatedProperty = userInformationTrimmed.toLowerCase();
      break;
    case 'ST':
    case 'CT':
      updatedProperty = userInformation
        .replace(/[^ A-Za-z]/g, '')
        .replace(/\s/g, '')
        .toLowerCase();
      break;
    case 'EXTERN_ID':
      updatedProperty = userInformation;
      break;
    default:
      throw new ConfigurationError(`The property ${userProperty} is not supported`);
  }
  return updatedProperty;
};

// Function responsible for making the data field without payload object
// Based on the "isHashRequired" value hashing is explicitly enabled or disabled

const prepareDataField = (
  userSchema,
  userUpdateList,
  isHashRequired,
  disableFormat,
  skipVerify,
) => {
  const data = [];
  let updatedProperty;
  let dataElement;
  userUpdateList.forEach((eachUser) => {
    dataElement = [];
    userSchema.forEach((eachProperty) => {
      // if skip verify is true we replace undefined/null user properties with empty string
      let userProperty = eachUser[eachProperty];
      if (skipVerify && !isDefinedAndNotNull(userProperty)) {
        userProperty = '';
      }
      if (isDefinedAndNotNull(userProperty)) {
        if (isHashRequired) {
          if (!disableFormat) {
            // when user requires formatting
            updatedProperty = ensureApplicableFormat(eachProperty, userProperty);
          } else {
            // when user requires hashing but does not require formatting
            updatedProperty = userProperty;
          }
        } else {
          // when hashing is not required
          updatedProperty = userProperty;
        }
        if (isHashRequired && eachProperty !== 'MADID' && eachProperty !== 'EXTERN_ID') {
          // for MOBILE_ADVERTISER_ID, MADID,EXTERN_ID hashing is not required ref: https://developers.facebook.com/docs/marketing-api/audiences/guides/custom-audiences#hash
          updatedProperty = `${updatedProperty}`;
          dataElement.push(sha256(updatedProperty));
        } else {
          dataElement.push(updatedProperty);
        }
      } else {
        throw new ConfigurationError(
          `Configured Schema field ${eachProperty} is missing in one or more user records`,
        );
      }
    });
    data.push(dataElement);
  });

  return data;
};

// Function responsible prepare the payload field of every event parameter

const preparePayload = (
  userUpdateList,
  userSchema,
  paramsPayload,
  isHashRequired,
  disableFormat,
  skipVerify,
) => {
  const prepareFinalPayload = paramsPayload;
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
    skipVerify,
  );
  return prepareFinalPayload;
};

// Function responsible for building the parameters for each event calls

const prepareResponse = (
  message,
  destination,
  allowedAudienceArray,
  userSchema,
  isHashRequired = true,
) => {
  const { accessToken, disableFormat, type, subType, isRaw, skipVerify } = destination.Config;

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
  prepareParams.payload = preparePayload(
    allowedAudienceArray,
    userSchema,
    paramsPayload,
    isHashRequired,
    disableFormat,
    skipVerify,
  );

  return prepareParams;
};

const processEvent = (message, destination) => {
  let response;
  const respList = [];
  const toSendEvents = [];
  let wrappedResponse = {};

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
    audienceChunksArray.forEach((allowedAudienceArray) => {
      response = prepareResponse(
        message,
        destination,
        allowedAudienceArray,
        userSchema,
        isHashRequired,
      );
      wrappedResponse = {
        responseField: response,
        operationCategory: USER_DELETE,
      };
      toSendEvents.push(wrappedResponse);
    });
  }

  // When "add" is present in the payload
  if (isDefinedAndNotNullAndNotEmpty(listData[USER_ADD])) {
    const audienceChunksArray = returnArrayOfSubarrays(listData[USER_ADD], maxUserCountNumber);
    audienceChunksArray.forEach((allowedAudienceArray) => {
      response = prepareResponse(
        message,
        destination,
        allowedAudienceArray,
        userSchema,
        isHashRequired,
      );
      wrappedResponse = {
        responseField: response,
        operationCategory: USER_ADD,
      };
      toSendEvents.push(wrappedResponse);
    });
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
