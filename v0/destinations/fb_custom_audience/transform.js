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
  CustomError
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

const ensureApplicableFormat = (
  userProperty,
  userInformation,
  disableValidation
) => {
  let updatedProperty;
  let userInformationTrimmed;
  let validationPassed = false;
  switch (userProperty) {
    case "EMAIL":
    case "EMAIL_SHA256":
      updatedProperty = userInformation.trim().toLowerCase();
      validationPassed = true;
      break;
    case "PHONE":
    case "PHONE_SHA256":
      // remove all non-numerical characters
      updatedProperty = userInformation.replace(/[^0-9]/g, "");
      // remove all leading zeros
      updatedProperty = updatedProperty.replace(/^0+/g, "");
      validationPassed = true;
      break;
    case "GEN":
      updatedProperty =
        userInformation.toLowerCase() === "f" ||
        userInformation.toLowerCase() === "female"
          ? "f"
          : "m";
      validationPassed = true;
      break;
    case "DOBY":
      if (
        !disableValidation &&
        userInformation
          .toString()
          .trim()
          .replace(/\./g, "").length === 4
      ) {
        updatedProperty = userInformation;
        validationPassed = true;
      }
      if (disableValidation) {
        updatedProperty = userInformation;
      }
      break;
    case "DOBM":
      // need to send as function in util index.js
      userInformationTrimmed = userInformation.replace(/\./g, "");
      if (
        !disableValidation &&
        userInformationTrimmed.toString().length === 2 &&
        parseInt(userInformationTrimmed, 10) > 0 &&
        parseInt(userInformationTrimmed, 10) <= 12
      ) {
        updatedProperty = userInformationTrimmed;
        validationPassed = true;
      }
      if (disableValidation) {
        updatedProperty = userInformation;
      }
      break;
    case "DOBD":
      userInformationTrimmed = userInformation.replace(/\./g, "");
      if (
        !disableValidation &&
        userInformationTrimmed.toString().length === 2 &&
        parseInt(userInformation, 10) > 0 &&
        parseInt(userInformation, 10) <= 31
      ) {
        updatedProperty = userInformationTrimmed;
        validationPassed = true;
      }
      if (disableValidation) {
        updatedProperty = userInformation;
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
      validationPassed = true;
      break;
    case "MADID":
    case "MOBILE_ADVERTISER_ID":
      updatedProperty = userInformation.toLowerCase();
      validationPassed = true;
      break;
    case "COUNTRY":
      if (userInformation.toLowerCase().length === 2 && !disableValidation) {
        updatedProperty = userInformation.toLowerCase();
        validationPassed = true;
      } else if (disableValidation) {
        updatedProperty = userInformation;
      }

      break;
    case "ZIP":
      userInformationTrimmed = userInformation.replace(/\s/g, "");
      updatedProperty = userInformationTrimmed.toLowerCase();
      validationPassed = true;
      break;
    case "ST":
      updatedProperty = userInformation
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/\s/g, "")
        .toLowerCase();
      validationPassed = true;
      break;
    default:
      throw new CustomError(
        `The property ${userProperty} is not supported`,
        400
      );
  }
  if (!disableValidation && !validationPassed) {
    throw new CustomError(
      `The allowed format for ${userProperty} is not maintained in one or more user records`
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
  disableValidation
) => {
  const data = [];
  let dataElement;
  userUpdateList.forEach(eachUser => {
    dataElement = [];
    userSchema.forEach(eachProperty => {
      if (isDefinedAndNotNullAndNotEmpty(eachUser[eachProperty])) {
        const updatedProperty = ensureApplicableFormat(
          eachProperty,
          eachUser[eachProperty],
          disableValidation
        );
        if (
          isHashRequired &&
          (eachProperty !== "MADID" || eachProperty !== "MOBILE_ADVERTISER_ID")
        ) {
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
  disableValidation
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
    disableValidation
  );
  return prepareFinalPayload;
};

// Function responsible for building the parameters for each event calls

const prepareResponse = (
  message,
  destination,
  isHashRequired = true,
  allowedAudienceArray
) => {
  const { accessToken, userSchema, disableValidation } = destination.Config;
  const prepareParams = {};
  let sessionPayload = {};
  // creating the parameters field
  let paramsPayload = {};
  let dataSource = {};
  sessionPayload = removeUndefinedAndNullValues(
    constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.SESSION.name])
  );

  // without all the mandatory fields present, session blocks can not be formed

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
    disableValidation
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
        allowedAudienceArray
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
        allowedAudienceArray
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

  const respList = Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          // eslint-disable-next-line no-nested-ternary
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
