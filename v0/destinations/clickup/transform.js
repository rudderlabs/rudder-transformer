const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getErrorRespEvents,
  getSuccessRespEvents,
  getDestinationExternalID,
  constructPayload,
  CustomError
} = require("../../util");
const {
  validatePriority,
  customFieldsBuilder,
  getDestinationExternalIDArray,
  eventFiltering
} = require("./util");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  createTaskEndPoint
} = require("./config");

const responseBuilder = async (payload, listId, apiToken) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = createTaskEndPoint(listId);
    response.headers = {
      "Content-Type": "application/json",
      Authorization: apiToken
    };
    response.method = "POST";
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
  // fail-safety for developer error
  throw new CustomError("Payload could not be constructed", 400);
};

const trackResponseBuilder = async (message, destination) => {
  const { apiToken, keyToCustomFieldName } = destination.Config;
  const { properties } = message;
  const externalListId = getDestinationExternalID(message, "clickUpListId");
  const listId = externalListId ?? destination.Config.listId;
  const assignees = getDestinationExternalIDArray(message, "clickUpAssigneeId");

  const customFields = await customFieldsBuilder(
    keyToCustomFieldName,
    properties,
    listId,
    apiToken
  );

  let payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]
  );

  payload = { ...payload, assignees, custom_fields: customFields };

  validatePriority(payload.priority);
  return responseBuilder(payload, listId, apiToken);
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  eventFiltering(message, destination);

  const messageType = message.type.toLowerCase();
  if (messageType === EventType.TRACK) {
    return trackResponseBuilder(message, destination);
  }
  throw new CustomError("Message type not supported", 400);
};

const process = async event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  return Promise.all(
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
          error.response ? error.response.status : error.code || 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
};

module.exports = { process, processRouterDest };
