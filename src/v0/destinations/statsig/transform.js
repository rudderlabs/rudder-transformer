const { EventType } = require('../../../constants');
const { defaultPostRequestConfig, defaultRequestConfig } = require('../../util');
const { ENDPOINT } = require('./config');
const { InstrumentationError } = require('../../util/errorTypes');

function process(event) {
  const { message, destination } = event;

  if (!message.type) {
    throw new InstrumentationError('Event type not present');
  }
  const messageType = message.type;

  switch (messageType.toLowerCase()) {
    case EventType.IDENTIFY:
    case EventType.PAGE:
    case EventType.SCREEN:
    case EventType.TRACK:
    case EventType.ALIAS:
    case EventType.GROUP:
      break;
    default:
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }

  const response = defaultRequestConfig();
  const { secretKey } = destination.Config;

  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = message;
  response.headers = {
    'content-type': 'application/json',
    'STATSIG-API-KEY': secretKey,
  };

  response.endpoint = ENDPOINT;

  return response;
}

exports.process = process;
