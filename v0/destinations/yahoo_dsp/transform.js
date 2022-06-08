const { BASE_ENDPOINT, ENDPOINTS } = require("./config");
const {
  defaultRequestConfig,
  CustomError,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents
} = require("../../util");

const {
  getAccessToken,
  populateIncludes,
  populateExcludes,
  createPayload
} = require("./util");

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

  /**
   * The below written switch case is used to build the response for each of the supported audience type.
   *  eg. ["email", "deviceId", "ipAddress", "mailDomain", "pointOfInterest"].
   */
  switch (audienceType) {
    case "email":
      // creating the output payload using the audience list and Config
      outputPayload = createPayload(listData[key], destination);
      break;
    case "deviceId":
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
      outputPayload = createPayload(listData[key], destination);
      // updatig seedListType here
      outputPayload = {
        ...outputPayload,
        seedListType
      };
      break;
    case "ipAddress":
      outputPayload = createPayload(listData[key], destination);
      // updating seedListType in outputPayload
      outputPayload = {
        ...outputPayload,
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
