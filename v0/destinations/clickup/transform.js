const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  getErrorRespEvents,
  getSuccessRespEvents,
  getDestinationExternalID,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedNullEmptyExclBoolInt,
  TransformationError
} = require("../../util");
const {
  validatePriority,
  customFieldsBuilder,
  getListOfAssignees,
  checkEventIfUIMapped
} = require("./util");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  createTaskEndPoint,
  DESTINATION
} = require("./config");
const { TRANSFORMER_METRIC } = require("../../util/constant");

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
  throw new TransformationError(
    "Something went wrong while constructing the payload",
    400,
    {
      scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
      meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
    },
    DESTINATION
  );
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
    throw new TransformationError(
      "Event type is required",
      400,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
      },
      DESTINATION
    );
  }

  checkEventIfUIMapped(message, destination);

  const messageType = message.type.toLowerCase();
  if (messageType === EventType.TRACK) {
    return trackResponseBuilder(message, destination);
  }

  throw new TransformationError(
    `Event type "${messageType}" is not supported`,
    400,
    {
      scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
      meta:
        TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.INSTRUMENTATION
    },
    DESTINATION
  );
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
