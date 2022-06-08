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

/**
 * 
 * @param {*} attributeArray  - It contains the audience lists to be added in the form of array". eg. [{"email": "abc@email.com"},{"email": "abc@email.com"},{"email": "abc@email.com"}] 
 * @param {*} Config
 * @returns The function returns an array of Audience List provided by the user like "email", "deviceId", "ipAddress". eg. [
    "251014dafc651f68edac7",
    "afbc34416ac6e7fbb9734",
    "42cbe7eebb412bbcd5b56",
    "379b4653a40878da7a584"
  ]
 */

const populateIdentifiers = (attributeArray, { Config }) => {
  const seedList = [];
  const { audienceType } = Config;
  const { hashRequired } = Config;
  let listType;
  if (isDefinedAndNotNullAndNotEmpty(attributeArray)) {
    // traversing through every element in the add array for the elements to be added.
    attributeArray.forEach(element => {
      // storing keys of an object inside the add array.
      const keys = Object.keys(element);
      // checking for the audience type the user wants to add is present in the input or not.
      keys.forEach(key => {
        if (key === audienceType) {
          listType = audienceType;
        }
      });
      // throwing error if the audience type the user wants to add is not present in the input.
      if (!listType) {
        throw new CustomError(
          `[Yahoo_DSP]:: Required property for ${audienceType} type audience is not available in an object`,
          400
        );
      }
      // here, hashing the data if is not hashed and pushing in the seedList array.
      if (hashRequired) {
        seedList.push(sha256(element[audienceType]));
      } else {
        seedList.push(element[audienceType]);
      }
    });
  }
  return seedList;
};

/**
 * This function is used for building the final response to be returned.
 * @param {*} message
 * @param {*} destination
 * @returns
 */

const responseBuilder = async (message, destination) => {
  const { listData } = message.properties;
  const {
    accountId,
    audienceId,
    audienceType,
    seedListType
  } = destination.Config;

  let listType;
  let outputPayload = {};
  // The only supported property for now is "add"
  const key = "add";

  const domains = [];
  const categoryIds = [];
  let seedList = [];

  /**
   * The below written switch case is used to build the response for each of the supported audience type.
   *  eg. ["email", "deviceId", "ipAddress", "mailDomain", "pointOfInterest"].
   */
  switch (audienceType) {
    case "email":
      // seedList contains the list of emails to be updated
      seedList = populateIdentifiers(listData[key], destination);
      if (seedList.length === 0) {
        throw new CustomError(
          `[Yahoo_DSP]:: No attributes are present in the '${key}' property.`,
          400
        );
      }
      outputPayload = { ...outputPayload, accountId, seedList };
      break;
    case "deviceId":
      // seedList contains the list of deviceIds to be updated
      seedList = populateIdentifiers(listData[key], destination);
      // throwing the error if nothing is present in the seedList
      if (seedList.length === 0) {
        throw new CustomError(
          `[Yahoo_DSP]:: No attributes are present in the '${key}' property.`,
          400
        );
      }
      // throwing error if seedListType is not provided for deviceId type audience
      if (
        !seedListType ||
        (seedListType && seedListType !== "IDFA" && seedListType !== "GPADVID")
      ) {
        throw new CustomError(
          `[Yahoo_DSP]:: seedListType is required for deviceId type audience and it should be any one of 'IDFA' and 'GPADVID'`,
          400
        );
      }
      outputPayload = {
        ...outputPayload,
        accountId,
        seedList,
        seedListType
      };
      break;
    case "ipAddress":
      // seedList contains the list of ipAddresses to be updated
      seedList = populateIdentifiers(listData[key], destination);
      // throwing the error if nothing is present in the seedList
      if (seedList.length === 0) {
        throw new CustomError(
          `[Yahoo_DSP]:: No attributes are present in the '${key}' property.`,
          400
        );
      }
      outputPayload = {
        ...outputPayload,
        accountId,
        seedList,
        seedListType: "SHA256IP"
      };
      break;
    case "mailDomain":
      // traversing through every element in the add array for the elements to be added.
      listData[key].forEach(element => {
        // storing keys of an object inside the add array.
        const keys = Object.keys(element);
        // For mailDomain the mailDomain or categoryIds must be present. throwing error if not present.
        keys.forEach(elementKey => {
          /**
           * If mailDomain is not provided categoryIds is required. The audience includes consumers who have received
           * mail from a domain belonging to the specified categories.
           * Reference for use case of categoryIds:
           * https://developer.yahooinc.com/dsp/api/docs/traffic/audience/mrt-audience.html#:~:text=Optional-,categoryIds,-Specifies%20an%20array
           */
          if (elementKey === audienceType || keys.includes("categoryIds")) {
            listType = audienceType;
          }
        });
        if (!listType) {
          throw new CustomError(
            `[Yahoo_DSP]:: Required property for ${audienceType} type audience is not available in an object`,
            400
          );
        }
        domains.push(element.mailDomain);
        categoryIds.push(element.categoryIds);
      });
      outputPayload = { accountId, domains, categoryIds };
      break;
    case "pointOfInterest":
      /**
       * Here, populating includes and excludes object which contains POI locations visited by the consumer The consumer is
       * added in the includes if the consumer has visited the POI location and is added in excludes if the
       * consumer has not visited the POI.
       */
      outputPayload.includes = populateIncludes(listData[key], audienceType);
      outputPayload.excludes = populateExcludes(listData[key], audienceType);
      outputPayload = { ...outputPayload, accountId };
      break;
    default:
      throw new CustomError(
        `[Yahoo_DSP]:: Audience Type "${audienceType}" is not supported`,
        400
      );
  }

  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}/traffic/audiences/${ENDPOINTS[audienceType]}/${audienceId}`;
  response.body.JSON = removeUndefinedAndNullValues(outputPayload);
  response.method = defaultPutRequestConfig.requestMethod;
  const accessToken = await getAccessToken(destination);
  response.headers = {
    "X-Auth-Token": accessToken,
    "X-Auth-Method": "OAuth2"
  };
  return response;
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "[Yahoo_DSP]:: Message Type is not present. Aborting message.",
      400
    );
  }
  if (!message.properties) {
    throw new CustomError(
      "[Yahoo_DSP]:: Message properties is not present. Aborting message.",
      400
    );
  }
  if (!message.properties.listData) {
    throw new CustomError(
      "[Yahoo_DSP]:: listData is not present inside properties. Aborting message.",
      400
    );
  }
  let response;
  if (message.type.toLowerCase() === "audiencelist") {
    response = await responseBuilder(message, destination);
  } else {
    throw new CustomError(
      `[Yahoo_DSP]:: Message type ${message.type} not supoorted`,
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
