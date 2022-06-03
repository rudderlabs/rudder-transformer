const sha256 = require("sha256");
const { BASE_ENDPOINT, ENDPOINTS } = require("./config");
const {
  defaultRequestConfig,
  CustomError,
  isDefinedAndNotNullAndNotEmpty,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues
} = require("../../util");

const populateIdentifiers = (attributeArray, { Config }) => {
  const seedList = [];
  const { audienceType } = Config;
  const { hashRequired } = Config;
  let listType;
  const AUDIENCE_LIST = ["email", "deviceId", "ipAddress"];
  if (isDefinedAndNotNullAndNotEmpty(attributeArray)) {
    // traversing through every element in the add array
    attributeArray.forEach(element => {
      if (AUDIENCE_LIST.includes(audienceType)) {
        listType = audienceType;
      }
      if (!listType) {
        throw new CustomError(`${audienceType} not provided`, 400);
      }
      switch (audienceType) {
        case "email":
          if (hashRequired) {
            seedList.push(sha256(element.email));
          } else {
            seedList.push(element.eamil);
          }
          break;
        case "deviceId":
          if (hashRequired) {
            seedList.push(sha256(element.deviceId));
          } else {
            seedList.push(element.deviceId);
          }
          break;
        case "ipAddress":
          if (hashRequired) {
            seedList.push(sha256(element.ipAddress));
          } else {
            seedList.push(element.ipAddress);
          }
          break;
        default:
          throw new CustomError(
            `Audience Type "${audienceType}" is not supported`,
            400
          );
      }
    });
  }
  return seedList;
};

const responseBuilder = (message, destination) => {
  const { listData } = message.properties;
  const { accountId, audienceId, audienceType } = destination.Config;

  let outputPayload = {};
  const typeOfOperation = Object.keys(listData);
  typeOfOperation.forEach(key => {
    if (key === "add") {
      const seedList = populateIdentifiers(listData[key], destination);
      if (seedList.length === 0) {
        throw new CustomError(
          `[Yahoo_DSP]:: No attributes are present in the '${key}' property.`,
          400
        );
      }
      if (audienceType === "ipAddress") {
        outputPayload = { ...outputPayload, seedListType: "SHA256IP" };
      }
      outputPayload = { ...outputPayload, accountId, seedList };
    } else {
      throw new CustomError(
        `listData "${key}" is not valid. Supported types are "add" only`
      );
    }
  });
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}/traffic/audiences/${ENDPOINTS[audienceType]}/${audienceId}`;
  response.body.JSON = removeUndefinedAndNullValues(outputPayload);
  response.method = defaultPutRequestConfig;
  //   const accessToken = getAccessToken(metadata);
  response.headers = {
    // Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  };
  return response;
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "[Yahoo_DSP]::Message Type is not present. Aborting message.",
      400
    );
  }
  if (!message.properties) {
    throw new CustomError(
      "[Yahoo_DSP]::Message properties is not present. Aborting message.",
      400
    );
  }
  if (!message.properties.listData) {
    throw new CustomError(
      "[Yahoo_DSP]::listData is not present inside properties. Aborting message.",
      400
    );
  }
  let response;
  if (message.type.toLowerCase() === "audiencelist") {
    response = responseBuilder(message, destination);
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};
exports.process = process;
