const sha256 = require("sha256");
const { BASE_ENDPOINT, ENDPOINTS } = require("./config");
const {
  defaultRequestConfig,
  CustomError,
  isDefinedAndNotNullAndNotEmpty,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents
} = require("../../util");

const {
  getAccessToken,
  populateIncludes,
  populateExcludes
} = require("./util");

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
  const {
    accountId,
    audienceId,
    audienceType,
    clientId,
    clientSecret
  } = destination.Config;

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

  const domains = [];

  switch (audienceType) {
    case "mailDomain":
      listData[key].forEach(element => {
        const keys = Object.keys(element);
        keys.forEach(elementKey => {
          if (elementKey === audienceType || elementKey === categoryIds) {
            listType = audienceType;
          }
        });
        if (!listType) {
          throw new CustomError(
            `Audience type ${audienceType} not provided`,
            400
          );
        }
        domains.push(element?.mailDomain);
        categoryIds.push(element?.categoryIds);
      });
      outputPayload = { accountId, domains, categoryIds };
      break;
    case "pointOfInterest":
      outputPayload.includes = populateIncludes(listData[key], audienceType);
      outputPayload.excludes = populateExcludes(listData[key], audienceType);
      outputPayload = { ...outputPayload, accountId };
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
  response.method = defaultPutRequestConfig.requestMethod;
  response.params = {
    clientId: clientId,
    clientSecret: clientSecret,
    destinationId: destination.ID
  };
  const accessToken = await getAccessToken(response.params);
  response.headers = {
    "X-Auth-Token" : accessToken,
    "X-Auth-Method": "OAuth2",
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
  } else {
    throw new CustomError(
      `[Yahoo_DSP]::Message type ${message.type} not supoorted`,
      400
    );
  }
  return response;
};

const process = async event => {
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
          // eslint-disable-next-line no-nested-ternary
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : error.status || 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
