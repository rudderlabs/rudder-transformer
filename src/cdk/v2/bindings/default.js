const {
  InstrumentationError,
  ConfigurationError,
  NetworkError,
} = require('../../../v0/util/errorTypes');
const { isHttpStatusSuccess } = require('../../../v0/util');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');

const SUPPORTED_EVENT_TYPES = ['track', 'page', 'screen', 'group', 'identify', 'alias'];

/**
 * Checks if the event type is valid
 * @param {*} event RudderStack standard event object
 * @returns true if the event type is supported, otherwise false
 */
function isValidEventType(event) {
  const eventType = event.event;
  if (!eventType || typeof eventType !== 'string') return false;

  const sanitizedEventType = eventType.trim().toLowerCase();
  return SUPPORTED_EVENT_TYPES.includes(sanitizedEventType);
}

function assert(val, message) {
  if (!val) {
    throw new InstrumentationError(message);
  }
}

function assertConfig(val, message) {
  if (!val) {
    throw new ConfigurationError(message);
  }
}

function assertHttpResp(processedResponse, message) {
  if (!isHttpStatusSuccess(processedResponse.status)) {
    throw new NetworkError(
      message,
      processedResponse.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedResponse.status),
      },
      processedResponse.response,
    );
  }
}

module.exports = {
  isValidEventType,
  assert,
  assertConfig,
  assertHttpResp,
};
