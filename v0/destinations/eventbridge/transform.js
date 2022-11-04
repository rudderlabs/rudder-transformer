const {
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");

function getResouceList(config) {
  let resource;
  const resourceList = [];
  const key = "arn";
  if (config) {
    config.forEach(obj => {
      resource = obj[key];
      if (resource) {
        resourceList.push(resource);
      }
    });
  }
  return resourceList;
}

function process(event) {
  // TODO: Use JSON mapping
  let response;
  try {
    if (event.destination && event.destination.Config) {
      response = {
        DetailType: event.destination.Config.detailType,
        Detail: JSON.stringify(event.message),
        EventBusName: event.destination.Config.eventBusName,
        Resources: getResouceList(event.destination.Config.resourceID),
        Source: "rudderstack",
        userId: event.message.userId || event.message.anonymousId
      };
    } else {
      // drop event if config is empty
      throw new CustomError(
        "EventBridge: received empty config, dropping event",
        400
      );
    }
  } catch (error) {
    throw new CustomError(
      error.message || "EventBridge: Unknown error",
      error.status || 400
    );
  }
  return removeUndefinedAndNullValues(response);
}

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
