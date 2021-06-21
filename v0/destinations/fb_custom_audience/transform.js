const sha256 = require("sha256");

const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
  constructPayload,
  checkSubsetOfArray,
  isDefinedAndNotNull,
  isDefinedAndNotNullAndNotEmpty,
  getSuccessRespEvents,
  getErrorRespEvents,
  removeUndefinedAndNullValues,
  returnArrayOfSubarrays
} = require("../../util");

const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  getEndPoint,
  schemaFiels,
  CustomError,
  sessionBlockField,
  MAX_USER_COUNT,
  typeFields,
  subTypeFields,
  getAudienceId,
  USER_ADD,
  USER_DELETE
} = require("./config");

const logger = require("../../../logger");

function responseBuilderSimple(payload, audienceId) {
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
}

function ensureApplicableFormat(userProperty, userInformation) {
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
      updatedProperty = userInformation.replace(/^0+/g, "");
      break;
    case "GEN":
      updatedProperty =
        userInformation.lowerCase() === "f" ||
          userInformation.lowerCase() === "female"
          ? "f"
          : "m";
      break;
    case "DOBY":
      if (
        userInformation
          .toString()
          .trim()
          .replace(/\./g, "").length === 4
      ) {
        updatedProperty = userInformation;
      } else {
        throw new CustomError(" The year of birth should be in YYYY", 400);
      }
      break;
    case "DOBM":
      // need to send as function in util index.js
      userInformationTrimmed = userInformation.replace(/\./g, "");
      if (
        userInformationTrimmed.toString().length === 2 &&
        parseInt(userInformationTrimmed, 10) > 0 &&
        parseInt(userInformationTrimmed, 10) <= 12
      ) {
        updatedProperty = userInformationTrimmed;
      } else {
        throw new CustomError("Please follow the ideal MM month format", 400);
      }
      break;
    case "DOBD":
      userInformationTrimmed = userInformation.replace(/\./g, "");
      if (
        userInformationTrimmed.toString().length === 2 &&
        parseInt(userInformation, 10) > 0 &&
        parseInt(userInformation, 10) <= 31
      ) {
        updatedProperty = userInformationTrimmed;
      } else {
        throw new CustomError("Please follow the ideal DD date format", 400);
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
      if (userInformation.toLowerCase().length === 2) {
        updatedProperty = userInformation.toLowerCase();
      } else
        throw new CustomError(
          "Country code should be in 2-letters in ISO 3166-1 alpha-2. ",
          400
        );
      break;
    case "ZIP":
      userInformationTrimmed = userInformation.replace(/\s/g, "");
      updatedProperty = userInformationTrimmed.toLowerCase();
      break;
    case "ST":
      updatedProperty = userInformation
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/\s/g, "")
        .toLowerCase();
      break;
    default:
      throw new CustomError(
        `The property ${userProperty} is not supported`,
        400
      );
  }
  return updatedProperty;
}

function prepareDataField(userSchema, userUpdateList, isHashRequired) {
  const data = [];
  let dataElement;
  userUpdateList.forEach(eachUser => {
    dataElement = [];
    userSchema.forEach(eachProperty => {
      if (isDefinedAndNotNullAndNotEmpty(eachUser[eachProperty])) {
        const updatedProperty = ensureApplicableFormat(
          eachProperty,
          eachUser[eachProperty]
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
}

function preparePayload(
  userUpdateList,
  userSchema,
  paramsPayload,
  isHashRequired
) {
  // the schema value in the payload field has to be an array
  const prepareFinalPayload = paramsPayload;
  if (Array.isArray(userSchema)) {
    prepareFinalPayload.schema = userSchema;
  } else {
    prepareFinalPayload.schema = [userSchema];
  }

  prepareFinalPayload.data = prepareDataField(
    userSchema,
    userUpdateList,
    isHashRequired
  );
  return prepareFinalPayload;
}

function prepareResponse(
  message,
  destination,
  isHashRequired = true,
  allowedAudienceArray
) {
  const { accessToken, userSchema } = destination.Config;
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

  if (
    (isDefinedAndNotNull(dataSource.type) &&
      typeFields.includes(dataSource.type)) ||
    (isDefinedAndNotNull(dataSource.sub_type) &&
      subTypeFields.includes(dataSource.sub_type))
  ) {
    paramsPayload.data_source = dataSource;
  }

  prepareParams.payload = preparePayload(
    allowedAudienceArray,
    userSchema,
    paramsPayload,
    isHashRequired
  );

  return prepareParams;
}

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
  if (!checkSubsetOfArray(schemaFiels, userSchema)) {
    throw new CustomError(
      "One or more of the schema fields are not supported",
      400
    );
  }
  const { properties } = message;

  // While user wants to add to audience_id

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

  // while user wants to delete from audience_id

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

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
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
