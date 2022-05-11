// const { flattenJson } = require("../../v0/util");
const { Utils } = require("rudder-transformer-cdk");

function commonPostMapper(event, mappedPayload, rudderContext) {
  const { message, destination } = event;
  const payload = mappedPayload;

  // If user provided a eventType name, then we will include it in the payload directly
  if (destination.Config.customEventType) {
    payload.eventType = destination.Config.customEventType;
  } else {
    // If eventType is not provided by the user, by default it is 'rudderstack'
    payload.eventType = "rudderstack";
  }

  // If user enables 'sendUserIdanonymousId', then we include userId and anonymousId into the payload
  if (destination.Config.sendUserIdanonymousId) {
    if (message.userId) {
      payload.userId = message.userId;
    }
    if (message.anonymousId) {
      payload.anonymousId = message.anonymousId;
    }
  }

  // Upon users choice for data center, we are updating the endpoint accordingly
  if (destination.Config.dataCenter === "eu") {
    rudderContext.endpoint = `https://insights-collector.eu01.nr-data.net/v1/accounts/${destination.Config.accountId}/events`;
  } else {
    // data center=US--standard endpoint
    rudderContext.endpoint = `https://insights-collector.newrelic.com/v1/accounts/${destination.Config.accountId}/events`;
  }

  rudderContext.insertKey = destination.Config.insertKey;

  // If user enables 'sendDeviceContext', then we are delimiting context fields and include them in responseBody
  let flattenedContext = {};
  let responseBody;
  if (destination.Config.sendDeviceContext) {
    flattenedContext = Utils.flattenJson(message.context);
    responseBody = {
      ...payload,
      ...flattenedContext
    };
  } else {
    responseBody = {
      ...payload
    };
  }

  return responseBody; // this flows onto the next stage in the yaml
}

module.exports = { commonPostMapper };
