const sha256 = require("sha256");

const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
  constructPayload,
  checkSubsetOfArray,
  isDefinedAndNotNull,
  countNumberOfObjects,
  isDefinedAndNotNullAndNotEmpty
} = require("../../util");

const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  getEndPoint,
  schemaFiels,
  CustomError,
  sessionBlockField,
  userUpdateOptions,
  MAX_USER_COUNT,
  typeFields,
  subTypeFields,
  getAudienceId
} = require("./config");

const logger = require("../../../logger");

function responseBuilderSimple(payload, userOperation, audienceId) {
  if (payload) {
    const responseBody = payload;
    const response = defaultRequestConfig();
    response.endpoint = getEndPoint(audienceId);

    userOperation.forEach(operation => {
      if (operation === "userListAdd") {
        response.method = defaultPostRequestConfig.requestMethod;
      }
      if (operation === "userListDelete") {
        response.method = defaultDeleteRequestConfig.requestMethod;
      }
    });
    response.params = responseBody;
    return response;
  }
  // fail-safety for developer error
  throw new CustomError(`Payload could not be constructed`, 400);
}

function setupSessionBlock(preparedBufferPayload) {
  const sessionBlock = {};
  sessionBlockField.forEach(key => {
    sessionBlock[key] = preparedBufferPayload[key];
  });

  if (preparedBufferPayload.estimated_num_total) {
    sessionBlock.estimated_num_total =
      preparedBufferPayload.estimated_num_total;
  }
  return sessionBlock;
}

function ensureApplicableFormat(userProperty, userInformation) {
  let updatedProperty;
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
          .trim()
          .replace(/\./g, "")
          .length() === 4
      ) {
        updatedProperty = parseInt(userInformation, 10);
      } else {
        throw new CustomError(" The year of birth should be in YYYY", 400);
      }
      break;
    case "DOBM":
      // need to send as function in util index.js
      if (
        userInformation.replace(/\./g, "").length() === 2 &&
        parseInt(userInformation, 10) > 0 &&
        parseInt(userInformation, 10) <= 12
      ) {
        updatedProperty = parseInt(userInformation, 10);
      } else {
        throw new CustomError("Please follow the ideal MM month format");
      }
      break;
    case "DOBD":
      if (
        userInformation.replace(/\./g, "").length() === 2 &&
        parseInt(userInformation, 10) > 0 &&
        parseInt(userInformation, 10) <= 31
      ) {
        updatedProperty = parseInt(userInformation, 10);
      } else {
        throw new CustomError("Please follow the ideal MM month format");
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
      if (userInformation.toLowerCase().length() === 2) {
        updatedProperty = userInformation.toLowerCase();
      } else
        throw new CustomError(
          "Country code should be in 2-letters in ISO 3166-1 alpha-2. ",
          400
        );
      break;
    case "ZIP":
      updatedProperty = userInformation.replace(/\s/g, "").toLowerCase();
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

function prepareDataField(userSchema, userUpdateList) {
  const data = [];
  let dataElement;
  if (countNumberOfObjects(userUpdateList) < MAX_USER_COUNT) {
    userUpdateList.forEach(eachUser => {
      dataElement = [];
      userSchema.forEach(eachProperty => {
        const updatedProperty = ensureApplicableFormat(
          eachProperty,
          eachUser[eachProperty]
        );
        if (
          eachProperty !== "MADID" ||
          eachProperty !== "MOBILE_ADVERTISER_ID"
        ) {
          dataElement.push(sha256(updatedProperty));
        } else {
          dataElement.push(updatedProperty);
        }
      });
      data.push(dataElement);
    });
  }
  return data;
}

function preparePayload(userUpdateList, userSchema, bufferPayload) {
  const payload = {};
  Array.isArray(userSchema)
    ? (payload.schema = userSchema)
    : (payload.schema = [userSchema]);
  payload.data = prepareDataField(userSchema, userUpdateList);
  if (isDefinedAndNotNull(bufferPayload.is_raw)) {
    if (typeof bufferPayload.is_raw === "boolean") {
      payload.is_raw = bufferPayload.is_raw;
    } else {
      logger.debug("is_raw field is not boolean, so dropping it");
    }
  }
  if (
    isDefinedAndNotNull(bufferPayload.type) &&
    isDefinedAndNotNull(bufferPayload.sub_type) &&
    typeFields.includes(bufferPayload.type) &&
    subTypeFields.includes(bufferPayload.sub_type)
  ) {
    payload.data_source = {
      type: bufferPayload.type,
      sub_type: bufferPayload.sub_type
    };
  }
  return payload;
}

function prepareResponse(message, destination, category, userUpdateCategory) {
  const { accessToken, userSchema } = destination.Config;
  const prepareParams = {};
  let bufferPayload = {};
  bufferPayload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (
    checkSubsetOfArray(
      Object.getOwnPropertyNames(bufferPayload),
      sessionBlockField
    )
  ) {
    prepareParams.session = setupSessionBlock(bufferPayload);
  }
  prepareParams.access_token = accessToken;
  if (checkSubsetOfArray(schemaFiels, userSchema)) {
    prepareParams.payload = preparePayload(
      message.properties[userUpdateCategory],
      userSchema,
      bufferPayload
    );
  } else
    throw new CustomError(
      "One or more of the schema fields are not supported",
      400
    );

  return prepareParams;
}

const processEvent = (message, destination) => {
  let category;
  let response;
  let responseOptionIndex = 0;
  const respList = [];
  const toSendEvents = [];
  const operationList = [];
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const operationAudienceId = getAudienceId(message.event, destination);
  if (
    message.type === "track" &&
    isDefinedAndNotNullAndNotEmpty(operationAudienceId)
  ) {
    category = CONFIG_CATEGORIES.EVENT;
    const { properties } = message;
    while (responseOptionIndex <= 1) {
      if (
        isDefinedAndNotNullAndNotEmpty(
          properties[userUpdateOptions[responseOptionIndex]]
        )
      ) {
        response = prepareResponse(
          message,
          destination,
          category,
          userUpdateOptions[responseOptionIndex]
        );
        toSendEvents.push(response);
        operationList.push(userUpdateOptions[responseOptionIndex]);
      }
      responseOptionIndex += 1;
    }
  } else if (message.type !== "track") {
    throw new CustomError(
      `The message type ${message.type} is not supported`,
      400
    );
  } else {
    throw new CustomError(
      `The event name does not match with configured audience ids'`,
      400
    );
  }
  toSendEvents.forEach(sendEvent => {
    respList.push(
      responseBuilderSimple(sendEvent, operationList, operationAudienceId)
    );
  });
  return respList;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
