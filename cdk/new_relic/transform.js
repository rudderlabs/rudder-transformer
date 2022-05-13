// const { flattenJson } = require("../../v0/util");
const { boolean } = require("is");
const { isBoolean, isDate } = require("lodash");
const { Utils } = require("rudder-transformer-cdk");

function commonPostMapper(event, mappedPayload, rudderContext) {
  const { message, destination } = event;
  const payload = mappedPayload;
  const destConfig = destination.Config;

  // If user provided a eventType name, then we will include it in the payload directly
  if (destConfig.customEventType) {
    payload.eventType = destConfig.customEventType;
  } else {
    // If eventType is not provided by the user, by default it is 'rudderstack'
    payload.eventType = "rudderstack";
  }

  // If user enables 'sendUserIdanonymousId', then we include userId and anonymousId into the payload
  if (destConfig.sendUserIdanonymousId) {
    if (message.userId || message.context.userId || message.context.id) {
      payload.userId = message.userId;
    }
    if (message.anonymousId) {
      payload.anonymousId = message.anonymousId;
    }
  }

  // These are NRQL reserved words in New Relic
  const reservedNrqlWords = [
    "ago",
    "and",
    "as",
    "auto",
    "begin",
    "begintime",
    "compare",
    "day",
    "days",
    "end",
    "endtime",
    "explain",
    "facet",
    "from",
    "hour",
    "hours",
    "in",
    "is",
    "like",
    "limit",
    "minute",
    "minutes",
    "month",
    "months",
    "not",
    "null",
    "offset",
    "or",
    "raw",
    "second",
    "seconds",
    "select",
    "since",
    "timeseries",
    "until",
    "week",
    "weeks",
    "where",
    "with"
  ];
  const reservedWords = ["accountId", "appId", "eventType", "timestamp"];

  const delKeys = [];

  Object.keys(payload).forEach(item => {
    if (reservedNrqlWords.includes(item)) {
      const str = `'${item}'`;
      payload[str] = payload[item];
      delKeys.push(item);
    }

    if (reservedWords.includes(item)) {
      delKeys.push(item);
    }

    if (isBoolean(payload[item])) {
      payload[item] = payload[item].toString();
    }
  });

  for (let i = 0; i < delKeys.length; i++) {
    const v = delKeys[i];
    delete payload.v;
  }

  // Upon users choice for data center, we are updating the endpoint accordingly
  switch (destConfig.dataCenter) {
    case "eu":
      rudderContext.endpoint = `https://insights-collector.eu01.nr-data.net/v1/accounts/${destConfig.accountId}/events`;
      break;
    default:
      rudderContext.endpoint = `https://insights-collector.newrelic.com/v1/accounts/${destConfig.accountId}/events`;
      break;
  }

  rudderContext.insertKey = destConfig.insertKey;

  // If user enables 'sendDeviceContext', then we are delimiting context fields and include them in responseBody
  let flattenedContext = {};
  let responseBody;
  if (destConfig.sendDeviceContext) {
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
