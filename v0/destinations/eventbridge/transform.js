const { removeUndefinedAndNullValues } = require("../util");

function process(event) {
  // TODO: Use JSON mapping
  // TODO: remove list in Resources after changing in config be
  let response;
  try {
    if (event.destination && event.destination.Config) {
      response = {
        DetailType: event.destination.Config.detailType,
        Detail: JSON.stringify(event.message),
        EventBusName: event.destination.Config.eventBusName,
        Resources: [event.destination.Config.resourceID],
        Source: "rudderstack"
      };
    } else {
      // return empty object if config is not present or is invalid
      response = {};
    }
  } catch (error) {
    throw new Error(error.message || "Unknown error");
  }
  return removeUndefinedAndNullValues(response);
}

exports.process = process;
