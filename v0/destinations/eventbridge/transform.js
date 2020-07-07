const { removeUndefinedAndNullValues } = require("../util");

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
      // return empty object if config is not present or is invalid
      response = {};
    }
  } catch (error) {
    throw new Error(error.message || "Unknown error");
  }
  return removeUndefinedAndNullValues(response);
}

exports.process = process;
