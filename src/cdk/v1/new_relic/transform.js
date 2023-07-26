/* eslint-disable no-param-reassign */
const { isBoolean } = require('lodash');
const { Utils } = require('rudder-transformer-cdk');

function commonPostMapper(event, mappedPayload, rudderContext) {
  const { message, destination } = event;
  const payload = mappedPayload;
  const destConfig = destination.Config;
  const reservedNrqlWords = [
    'ago',
    'and',
    'as',
    'auto',
    'begin',
    'begintime',
    'compare',
    'day',
    'days',
    'end',
    'endtime',
    'explain',
    'facet',
    'from',
    'hour',
    'hours',
    'in',
    'is',
    'like',
    'limit',
    'minute',
    'minutes',
    'month',
    'months',
    'not',
    'null',
    'offset',
    'or',
    'raw',
    'second',
    'seconds',
    'select',
    'since',
    'timeseries',
    'until',
    'week',
    'weeks',
    'where',
    'with',
  ];
  const reservedWords = ['accountId', 'appId', 'eventType'];

  Object.keys(payload).forEach((item) => {
    if (reservedNrqlWords.includes(item) && isBoolean(payload[item])) {
      const str = `'${item}'`;
      payload[str] = payload[item].toString();
      delete payload[item];
    } else if (reservedNrqlWords.includes(item)) {
      const str = `'${item}'`;
      payload[str] = payload[item];
      delete payload[item];
    } else if (reservedWords.includes(item)) {
      delete payload[item];
    } else if (isBoolean(payload[item])) {
      payload[item] = payload[item].toString();
    }
  });

  // If user provided a eventType name, then we will include it in the payload directly
  if (destConfig.customEventType) {
    payload.eventType = destConfig.customEventType;
  } else {
    // If eventType is not provided by the user, by default it is 'rudderstack'
    payload.eventType = 'rudderstack';
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

  // Upon users choice for data center, we are updating the endpoint accordingly
  rudderContext.endpoint =
    destConfig.dataCenter === 'eu'
      ? `https://insights-collector.eu01.nr-data.net/v1/accounts/${destConfig.accountId}/events`
      : `https://insights-collector.newrelic.com/v1/accounts/${destConfig.accountId}/events`;

  rudderContext.insertKey = destConfig.insertKey;

  // If user enables 'sendDeviceContext', then we are delimiting context fields and include them in responseBody
  let flattenedContext = {};
  let responseBody;
  if (destConfig.sendDeviceContext) {
    flattenedContext = Utils.flattenJson(message.context);
    responseBody = {
      ...payload,
      ...flattenedContext,
    };
  } else {
    responseBody = {
      ...payload,
    };
  }

  return responseBody; // this flows onto the next stage in the yaml
}

module.exports = { commonPostMapper };
