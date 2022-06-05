const sha256 = require("sha256");
const { BASE_ENDPOINT, ENDPOINTS } = require("./config");
const {
  defaultRequestConfig,
  CustomError,
  isDefinedAndNotNullAndNotEmpty,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues
} = require("../../util");

const { getAccessToken } = require("./util");

const populateIdentifiers = (attributeArray, { Config }) => {
  const seedList = [];
  const { audienceType } = Config;
  const { hashRequired } = Config;
  let listType;
  if (isDefinedAndNotNullAndNotEmpty(attributeArray)) {
    // traversing through every element in the add array
    attributeArray.forEach(element => {
      const keys = Object.keys(element);
      keys.forEach(key => {
        if (key === audienceType) {
          listType = audienceType;
        }
      });
      if (!listType) {
        throw new CustomError(
          `Audience type ${audienceType} not provided`,
          400
        );
      }
      if (hashRequired) {
        seedList.push(sha256(element[audienceType]));
      } else {
        seedList.push(element[audienceType]);
      }
    });
  }
  return seedList;
};

const responseBuilder = async (message, destination) => {
  const { listData } = message.properties;
  const { accountId, audienceId, audienceType } = destination.Config;

  let outputPayload = {};
  const key = "add";

  const seedListRequired = ["email", "deviceId", "ipAddress"];

  if (seedListRequired.includes(audienceType)) {
    const seedList = populateIdentifiers(listData[key], destination);
    if (seedList.length === 0) {
      throw new CustomError(
        `[Yahoo_DSP]:: No attributes are present in the '${key}' property.`,
        400
      );
    }
    outputPayload = { ...outputPayload, accountId, seedList };
    if (audienceType === "ipAddress") {
      outputPayload = { seedListType: "SHA256IP" };
    }
  }
  let listType;
  const domains = [];
  const categoryIds = [];
  switch (audienceType) {
    case "mailDomain":
      listData[key].forEach(element => {
        const keys = Object.keys(element);
        keys.forEach(elementKey => {
          if (elementKey === audienceType) {
            listType = audienceType;
          }
        });
        if (!listType) {
          throw new CustomError(
            `Audience type ${audienceType} not provided`,
            400
          );
        }
        domains.push(element.mailDomain);
        categoryIds.push(element.categoryIds);
        outputPayload = { domains, categoryIds };
      });
      break;
    case "pointOfInterest":
      break;
    default:
      if (!seedListRequired.includes(audienceType)) {
        throw new CustomError(
          `Audience Type "${audienceType}" is not supported`,
          400
        );
      }
  }

  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}/traffic/audiences/${ENDPOINTS[audienceType]}/${audienceId}`;
  response.body.JSON = removeUndefinedAndNullValues(outputPayload);
  response.method = defaultPutRequestConfig;
  const accessToken = await getAccessToken(destination.Config);
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  };
  return response;
};

const processEvent = async (message, destination) => {
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
    response = await responseBuilder(message, destination);
  }
  return response;
};

const process = async event => {
  return processEvent(event.message, event.destination);
};
exports.process = process;
