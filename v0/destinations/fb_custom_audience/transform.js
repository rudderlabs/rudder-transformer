const sha256 = require("sha256");

const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
  constructPayload,
  checkSubsetOfArray,
  isDefinedAndNotNullAndNotEmpty,
  getSuccessRespEvents,
  getErrorRespEvents,
  removeUndefinedAndNullValues,
  returnArrayOfSubarrays,
  CustomError,
  isDefinedAndNotNull,
  flattenMap
} = require("../../util");

const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  getEndPoint,
  schemaFields,
  sessionBlockField,
  MAX_USER_COUNT,
  getAudienceId,
  USER_ADD,
  USER_DELETE
} = require("./config");

const logger = require("../../../logger");

const responseBuilderSimple = (payload, audienceId) => {
  if (payload) {
    const responseParams = payload.responseField;
    const response = defaultRequestConfig();
    response.endpoint = getEndPoint(audienceId);

    if (payload.operationCategory === "userListAdd") {
      response.method = defaultPostRequestConfig.requestMethod;
    }
    if (payload.operationCategory === "userListDelete") {
      response.method = defaultDeleteRequestConfig.requestMethod;
    }

    response.params = responseParams;
    return response;
  }
  // fail-safety for developer error
  throw new CustomError(`Payload could not be constructed`, 400);
};

// function responsible to ensure the user inputs are passed according to the allowed format

const ensureApplicableFormat = (userProperty, userInformation) => {
  let updatedProperty;
  let userInformationTrimmed;
  switch (userProperty) {
    case "EMAIL":
    case "EMAIL_SHA256":
      updatedProperty = userInformation.trim().toLowerCase();
      break;
    case "PHONE":
    case "PHONE_SHA256":
      // remove all non-numerical characters
      updatedProperty = userInformation.replace(/[^0-9]/g, "");
      // remove all leading zeros
      updatedProperty = updatedProperty.replace(/^0+/g, "");
      break;
    case "GEN":
      updatedProperty =
        userInformation.toLowerCase() === "f" ||
        userInformation.toLowerCase() === "female"
          ? "f"
          : "m";
      break;
    case "DOBY":
      updatedProperty = userInformation
        .toString()
        .trim()
        .replace(/\./g, "");
      break;
    case "DOBM":
      userInformationTrimmed = userInformation.replace(/\./g, "");
      if (userInformationTrimmed.toString().length < 2) {
        updatedProperty = `0${userInformationTrimmed}`;
      } else {
        updatedProperty = userInformationTrimmed;
      }
      break;
    case "DOBD":
      userInformationTrimmed = userInformation.replace(/\./g, "");
      if (userInformationTrimmed.toString().length < 2) {
        updatedProperty = `0${userInformationTrimmed}`;
      } else {
        updatedProperty = userInformationTrimmed;
      }
      break;
    case "LN":
    case "FN":
    case "FI":
      if (userProperty !== "FI") {
        updatedProperty = userInformation
          .toLowerCase()
          .replace(/[^a-zA-Z@#$%&!]/g, "");
      } else {
        updatedProperty = userInformation
          .toLowerCase()
          .replace(/[^a-zA-Z@#$%&!,.?]/g, "");
      }
      break;
    case "MADID":
    case "MOBILE_ADVERTISER_ID":
      updatedProperty = userInformation.toLowerCase();
      break;
    case "COUNTRY":
      updatedProperty = userInformation.toLowerCase();
      break;
    case "ZIP":
      userInformationTrimmed = userInformation.replace(/\s/g, "");
      updatedProperty = userInformationTrimmed.toLowerCase();
      break;
    case "ST":
    case "CT":
      updatedProperty = userInformation
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/\s/g, "")
        .toLowerCase();
      break;
    case "EXTERN_ID":
      updatedProperty = userInformation;
      break;
    default:
      throw new CustomError(
        `The property ${userProperty} is not supported`,
        400
      );
  }
  return updatedProperty;
};

// Function responsible for making the data field without payload object
// Based on the "isHashRequired" value hashing is explicitly enabled or disabled

const prepareDataField = (
  userSchema,
  userUpdateList,
  isHashRequired,
  disableFormat
) => {
  const data = [];
  let updatedProperty;
  let dataElement;
  userUpdateList.forEach(eachUser => {
    dataElement = [];
    userSchema.forEach(eachProperty => {
      if (isDefinedAndNotNull(eachUser[eachProperty])) {
        if (isHashRequired) {
          if (!disableFormat) {
            // when user requires formatting
            updatedProperty = ensureApplicableFormat(
              eachProperty,
              eachUser[eachProperty]
            );
          } else {
            // when user requires hashing but does not require formatting
            updatedProperty = eachUser[eachProperty];
          }
        } else {
          // when hashing is not required
          updatedProperty = eachUser[eachProperty];
        }
        if (
          isHashRequired &&
          eachProperty !== "MADID" &&
          eachProperty !== "MOBILE_ADVERTISER_ID" &&
          eachProperty !== "EXTERN_ID"
        ) {
          updatedProperty = `${updatedProperty}`;
          dataElement.push(sha256(updatedProperty));
        } else {
          dataElement.push(updatedProperty);
        }
      } else {
        throw new CustomError(
          `Configured Schema field ${eachProperty} is missing in one or more user records`,
          400
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
  disableFormat
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
    disableFormat
  );
  return prepareFinalPayload;
};

// Function responsible for building the parameters for each event calls

const prepareResponse = (
  message,
  destination,
  isHashRequired = true,
  allowedAudienceArray,
  audienceOperation
) => {
  const { accessToken, userSchema, disableFormat } = destination.Config;
  const { properties } = message;
  const prepareParams = {};
  let sessionPayload = {};
  // creating the parameters field
  let paramsPayload = {};
  let dataSource = {};
  sessionPayload = removeUndefinedAndNullValues(
    constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.SESSION.name])
  );

  // without all the mandatory fields present, session blocks can not be formed
  const sessionId =
    audienceOperation === "userListAdd"
      ? parseInt(properties.sessionIdAdd, 10)
      : parseInt(properties.sessionIdDelete, 10);
  // eslint-disable-next-line no-restricted-globals
  if (isDefinedAndNotNull(sessionId) && !isNaN(sessionId)) {
    sessionPayload.session_id = sessionId;
  }
  if (
    checkSubsetOfArray(
      Object.getOwnPropertyNames(sessionPayload),
      sessionBlockField
    )
  ) {
    prepareParams.session = sessionPayload;
  } else {
    logger.debug("All required fields for session block is not present");
  }
  prepareParams.access_token = accessToken;

  // creating the payload field for parameters

  paramsPayload = removeUndefinedAndNullValues(
    constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.EVENT.name])
  );
  dataSource = removeUndefinedAndNullValues(
    constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.DATA_SOURCE.name]
    )
  );
  if (Object.keys(dataSource).length > 0) {
    paramsPayload.data_source = dataSource;
  }
  prepareParams.payload = preparePayload(
    allowedAudienceArray,
    userSchema,
    paramsPayload,
    isHashRequired,
    disableFormat
  );

  return prepareParams;
};

const processEvent = (message, destination) => {
  let response;
  const respList = [];
  const toSendEvents = [];
  let wrappedResponse = {};
  const { userSchema, isHashRequired } = destination.Config;
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  if (message.type !== "track") {
    throw new CustomError(` ${message.type} call is not supported `, 400);
  }
  const operationAudienceId = getAudienceId(message.event, destination);

  // when no event to audience_id mapping is found
  if (!isDefinedAndNotNullAndNotEmpty(operationAudienceId)) {
    throw new CustomError(
      `The event name does not match with configured audience ids'`,
      400
    );
  }
  // when configured schema field is different from the allowed fields
  if (!checkSubsetOfArray(schemaFields, userSchema)) {
    throw new CustomError(
      "One or more of the schema fields are not supported",
      400
    );
  }
  const { properties } = message;

  if (isDefinedAndNotNullAndNotEmpty(properties[USER_ADD])) {
    const audienceChunksArray = returnArrayOfSubarrays(
      properties[USER_ADD],
      MAX_USER_COUNT
    );
    audienceChunksArray.forEach(allowedAudienceArray => {
      response = prepareResponse(
        message,
        destination,
        isHashRequired,
        allowedAudienceArray,
        USER_ADD
      );
      wrappedResponse = {
        responseField: response,
        operationCategory: USER_ADD
      };
      toSendEvents.push(wrappedResponse);
    });
  }

  if (isDefinedAndNotNullAndNotEmpty(properties[USER_DELETE])) {
    const audienceChunksArray = returnArrayOfSubarrays(
      properties[USER_DELETE],
      MAX_USER_COUNT
    );
    audienceChunksArray.forEach(allowedAudienceArray => {
      response = prepareResponse(
        message,
        destination,
        isHashRequired,
        allowedAudienceArray,
        USER_DELETE
      );
      wrappedResponse = {
        responseField: response,
        operationCategory: USER_DELETE
      };
      toSendEvents.push(wrappedResponse);
    });
  }
  toSendEvents.forEach(sendEvent => {
    respList.push(responseBuilderSimple(sendEvent, operationAudienceId));
  });
  if (respList.length === 0) {
    throw new CustomError(
      "missing valid parameters, unable to generate transformed payload",
      400
    );
  }
  return respList;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }
  const respList = inputs.map(input => {
    try {
      if (input.message.statusCode) {
        // already transformed event
        return getSuccessRespEvents(
          input.message,
          [input.metadata],
          input.destination
        );
      }
      const transformedList = process(input);
      const responseList = transformedList.map(transformedPayload => {
        return getSuccessRespEvents(
          transformedPayload,
          [input.metadata],
          input.destination
        );
      });
      return responseList;
    } catch (error) {
      return getErrorRespEvents(
        [input.metadata],
        // eslint-disable-next-line no-nested-ternary
        400,
        error.message || "Error occurred while processing payload."
      );
    }
  });
  return flattenMap(respList);
};

module.exports = { process, processRouterDest };
