const {
  BASE_ENDPOINT,
  ENDPOINTS,
  DSP_SUPPORTED_OPERATION,
  AUDIENCE_ATTRIBUTE
} = require("./config");
const {
  defaultRequestConfig,
  CustomError,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents
} = require("../../util");

const { getAccessToken, createPayload } = require("./util");

/**
 * This function is used for building the final response to be returned.
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const responseBuilder = async (message, destination) => {
  let dspListPayload = {};
  const { Config } = destination;
  const { listData } = message.properties;
  const { audienceId, audienceType, seedListType } = Config;

  const traitsList = listData[DSP_SUPPORTED_OPERATION];
  if (!traitsList) {
    throw new CustomError(
      `[Yahoo_DSP]:: The only supported operation for audience updation '${DSP_SUPPORTED_OPERATION}' is not present`,
      400
    );
  }

  /**
   * The below written switch case is used to build the response for each of the supported audience type.
   *  eg. ["email", "deviceId", "ipAddress"].
   */
  const audienceAttribute = AUDIENCE_ATTRIBUTE[audienceType];
  switch (audienceAttribute) {
    case "email":
      // creating the output payload using the audience list and Config
      dspListPayload = createPayload(traitsList, Config);
      break;
    case "deviceId":
      // throwing error if seedListType is not provided for deviceId type audience
      if (
        !seedListType ||
        (seedListType !== "IDFA" && seedListType !== "GPADVID")
      ) {
        throw new CustomError(
          `[Yahoo_DSP]:: seedListType is required for deviceId type audience and it should be any one of 'IDFA' and 'GPADVID'`,
          400
        );
      }
      dspListPayload = createPayload(traitsList, Config);
      dspListPayload = {
        ...dspListPayload,
        seedListType
      };
      break;
    case "ipAddress":
      dspListPayload = createPayload(traitsList, Config);
      dspListPayload = {
        ...dspListPayload,
        seedListType: "SHA256IP"
      };
      break;
    default:
      throw new CustomError(
        `[Yahoo_DSP]:: Audience Type "${audienceType}" is not supported`,
        400
      );
  }

  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}/traffic/audiences/${ENDPOINTS[audienceType]}/${audienceId}`;
  response.body.JSON = removeUndefinedAndNullValues(dspListPayload);
  response.method = defaultPutRequestConfig.requestMethod;
  const accessToken = await getAccessToken(destination);
  if (!accessToken) {
    throw new CustomError(`[Yahoo_DSP]:: access token is not available`, 400);
  }
  response.headers = {
    "X-Auth-Token": accessToken,
    "X-Auth-Method": "OAuth2",
    "Content-Type": "application/json"
  };
  return response;
};

const processEvent = async (message, destination) => {
  let response;
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
