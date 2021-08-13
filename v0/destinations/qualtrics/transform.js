const axios = require("axios");
const logger = require("../../../logger");

const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  CONTACT_KEY_LIST,
  getEndpoint
} = require("./config");
const { EventType } = require("../../../constants");
const {
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  defaultRequestConfig,
  constructPayload,
  getFieldValueFromMessage,
  isDefinedAndNotNull,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  getDestinationExternalID
} = require("../../util");

// function responsible to check if the contact exists wrt the extRef key
async function contactExists(dataCenterId, directoryId, apiToken, extRef) {
  let flag = true;
  let res;
  let contactInfo;
  const url = `https://${dataCenterId}.qualtrics.com/API/v3/directories/${directoryId}/contacts/search`;
  console.log(url);

  const searchCallBody = {
    filter: {
      comparison: "eq",
      filterType: "extRef",
      value: extRef
    }
  };

  const searchCallHeader = {
    headers: {
      "X-API-TOKEN": apiToken,
      "Content-Type": "application/json"
    }
  };

  try {
    // eslint-disable-next-line no-unused-vars
    res = await axios.post(url, searchCallBody, searchCallHeader);
    if (res.result.elements.length === 0) {
      flag = false;
      contactInfo = null;
    } else {
      contactInfo = res.result.elements[0].id;
    }
  } catch (error) {
    console.error(error.response.data);
    console.error(error.response.status);
    throw new CustomError("Axios call fails", 400);
  }
  console.log(JSON.stringify(res));

  const contactUpdate = {
    contactId: contactInfo,
    requireUpdate: flag
  };

  return contactUpdate;
}

function responseBuilderSimple(wrappedResponse, destination, type) {
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
          const contactInfo = contactExists(
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
}

// embeddedData contains every other trait fields that are not listed inside schema
function populateEmbeddedData(traitsObject) {
  const embeddedDataBlock = {};
  Object.keys(traitsObject).forEach(key => {
    if (!CONTACT_KEY_LIST.includes(key))
      embeddedDataBlock[key] = traitsObject[key];
  });

  return embeddedDataBlock;
}

// function responsible to prepare the payload
function prepareResponse(message, category) {
  console.log("inside prepareResponse");
  let embeddedData = {};

  let outputPayload = {};

  outputPayload = constructPayload(message, MAPPING_CONFIG[category.name]);

  const traits = getFieldValueFromMessage(message, "traits");
  if (isDefinedAndNotNull(traits)) {
    embeddedData = populateEmbeddedData(traits);
  }
  outputPayload.embeddedData = embeddedData;

  return outputPayload;
}

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
      console.log("inside identify");
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
