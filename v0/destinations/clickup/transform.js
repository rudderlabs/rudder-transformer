const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  getErrorRespEvents,
  getSuccessRespEvents,
  getDestinationExternalID,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedNullEmptyExclBoolInt,
  CustomError
} = require("../../util");
const {
  validatePriority,
  customFieldsBuilder,
  getListOfAssignees,
  checkEventIfUIMapped,
  removeUndefinedAndNullAndEmptyValues
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
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedNullEmptyExclBoolInt(payload);
    return response;
  }
  // fail-safety for developer error
  throw new CustomError("[ CLICKUP ]:: Payload could not be constructed", 400);
};

const trackResponseBuilder = async (message, destination) => {
  const { apiToken, keyToCustomFieldName } = destination.Config;
  const { properties } = message;
  const externalListId = getDestinationExternalID(message, "clickUpListId");
  const listId = externalListId || destination.Config.listId;
  const assignees = getListOfAssignees(message, "clickUpAssigneeId");

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
      "[ CLICKUP ]:: Message Type is not present. Aborting message.",
      400
    );
  }

  checkEventIfUIMapped(message, destination);

  const messageType = message.type.toLowerCase();
  if (messageType === EventType.TRACK) {
    return trackResponseBuilder(message, destination);
  }
  throw new CustomError("[ CLICKUP ]:: Message type not supported", 400);
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
