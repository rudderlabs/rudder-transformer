const {
  removeUndefinedAndNullValues,
  simpleProcessRouterDest
} = require("../../util");
const {
  ConfigurationError,
  TransformationError
} = require("../../util/errorTypes");

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
  if (event.destination?.Config) {
    return removeUndefinedAndNullValues({
      DetailType: event.destination.Config.detailType,
      Detail: JSON.stringify(event.message),
      EventBusName: event.destination.Config.eventBusName,
      Resources: getResouceList(event.destination.Config.resourceID),
      Source: "rudderstack",
      userId: event.message.userId || event.message.anonymousId
    });
  }

  // drop event if config is empty
  throw new ConfigurationError(
    "EventBridge: received empty config, dropping event",
    400
  );
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
