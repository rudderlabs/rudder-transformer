const { CONFIG_CATEGORIES, getEndpoint } = require("./config");
const { contactExists, prepareResponse } = require("./util");
const { EventType } = require("../../../constants");
const {
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  defaultRequestConfig,
  isDefinedAndNotNull,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  getDestinationExternalID
} = require("../../util");

const responseBuilderSimple = async (wrappedResponse, destination, type) => {
  if (wrappedResponse.res) {
    let requireUpdate;
    const { apiToken, eventEndPoint, dataCenterId } = destination.Config;

    const responseBody = wrappedResponse.res;
    const response = defaultRequestConfig();

    switch (type) {
      case EventType.IDENTIFY:
        // if context.externalId contains contactId then contact will be updated
        if (isDefinedAndNotNull(wrappedResponse.contactId)) {
          response.endpoint = getEndpoint(
            dataCenterId,
            wrappedResponse.directoryId,
            wrappedResponse.contactId
          );
          response.method = defaultPutRequestConfig.requestMethod;
        } else {
          // otherwise, contact will be searched using extRef
          const contactInfo = await contactExists(
            dataCenterId,
            wrappedResponse.directoryId,
            apiToken,
            responseBody.extRef
          );
          // requireUpdate is "true" when contactId wrt extRef is found and update can be done. It is false otherwise.
          requireUpdate = contactInfo.requireUpdate;
          if (requireUpdate) {
            response.endpoint = getEndpoint(
              dataCenterId,
              wrappedResponse.directoryId,
              contactInfo.contactId
            );
            response.method = defaultPutRequestConfig.requestMethod;
          } else {
            // if not found both in context.externalId and using search call, then new contact will be created.
            response.endpoint = getEndpoint(
              dataCenterId,
              wrappedResponse.directoryId,
              null
            );
            response.method = defaultPostRequestConfig.requestMethod;
          }
        }

        break;
      case EventType.TRACK:
        response.endpoint = eventEndPoint;
        response.method = defaultPostRequestConfig.requestMethod;
        break;
      default:
        throw new CustomError("Message type not supported", 400);
    }

    response.headers = {
      "Content-Type": "application/json",
      "X-API-TOKEN": apiToken
    };
    response.body.JSON = removeUndefinedAndNullValues(responseBody);
    return response;
  }
  // fail-safety for developer error
  throw new CustomError("Payload could not be constructed", 400);
};

const processEvent = (message, destination) => {
  const { type } = message;

  if (!type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const category = CONFIG_CATEGORIES.CONTACT;

  let contactIdExt;
  let directoryIdExt;
  const wrappedResponse = {};

  switch (type) {
    case EventType.IDENTIFY:
      contactIdExt = getDestinationExternalID(message, "qualtricsContactId");
      directoryIdExt = getDestinationExternalID(
        message,
        "qualtricsDirectoryId"
      );

      if (!destination.Config.directoryId && !directoryIdExt) {
        throw new CustomError(
          "Directory ID is mandatory while processing contacts"
        );
      }

      wrappedResponse.res = prepareResponse(message, category);
      wrappedResponse.contactId = contactIdExt;

      wrappedResponse.directoryId = isDefinedAndNotNull(directoryIdExt)
        ? directoryIdExt
        : destination.Config.directoryId;

      break;
    case EventType.TRACK:
      wrappedResponse.res = message.properties;
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }

  // build the response
  return responseBuilderSimple(wrappedResponse, destination, type);
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
