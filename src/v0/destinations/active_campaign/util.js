const { NetworkError } = require('@rudderstack/integrations-lib');
const truncateUtf8Bytes = require('truncate-utf8-bytes');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');
const { isHttpStatusSuccess } = require('../../util');
const { HTTP_STATUS_CODES } = require('../../util/constant');

// A 2xx status on an error path means the destination returned a success code with an
// unexpected/non-JSON body (e.g. an HTML login page when the API key is invalid/expired).
// errorHandler is shared by both the processor and router flows, and surfacing a 2xx as an error
// breaks their response contract: a 2xx transform status must carry an output payload (router:
// `batchedRequest`, processor: `output`). rudder-server treats statusCode 200 as deliverable and
// then fails to unmarshal the absent payload ("unexpected EOF"), while a 2xx != 200 is silently
// marked succeeded (data loss). Coerce any 2xx to a retryable 5xx so the failure is reported
// honestly and events are not dropped.
const getNormalizedErrorStatus = (status) =>
  isHttpStatusSuccess(status) ? HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR : status;

const RESPONSE_LIMIT_BYTES = 4 * 1024;
const TRUNCATED = '... [truncated]';
const TRUNCATED_STRUCTURED_RESPONSE = '[truncated ActiveCampaign response]';

const truncateUtf8 = (text) => {
  if (Buffer.byteLength(text, 'utf8') <= RESPONSE_LIMIT_BYTES) return text;
  const budget = RESPONSE_LIMIT_BYTES - Buffer.byteLength(TRUNCATED, 'utf8');
  return truncateUtf8Bytes(text, budget) + TRUNCATED;
};

const boundResponse = (response) => {
  if (typeof response === 'string') return truncateUtf8(response);
  if (!response || typeof response !== 'object') return response;

  // Stop visiting a large JSON tree early, before stringify can build an unbounded copy.
  const tooLarge = new Error('Response exceeds ActiveCampaign error budget');
  let budget = RESPONSE_LIMIT_BYTES;
  try {
    const serialized = JSON.stringify(response, (key, value) => {
      if (typeof value === 'string') {
        budget -= Buffer.byteLength(value, 'utf8');
      }
      budget -= Buffer.byteLength(key, 'utf8') + 1;
      if (budget < 0) throw tooLarge;
      return value;
    });
    return Buffer.byteLength(serialized, 'utf8') <= RESPONSE_LIMIT_BYTES
      ? response
      : TRUNCATED_STRUCTURED_RESPONSE;
  } catch (err) {
    if (err !== tooLarge) throw err;
    return TRUNCATED_STRUCTURED_RESPONSE;
  }
};

const errorHandler = (httpCallError, message) => {
  const { response, status } = processAxiosResponse(httpCallError);
  const destinationResponse = boundResponse(response);
  let msg = message;
  if (response) {
    const excerpt = truncateUtf8(JSON.stringify(destinationResponse));
    msg = `${message} (${httpCallError.response?.statusText},${excerpt})`;
  }
  const errorStatus = getNormalizedErrorStatus(status);
  throw new NetworkError(
    msg,
    errorStatus,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errorStatus),
    },
    destinationResponse,
  );
};

const offsetLimitVarPath = 'response.data.meta.total';
const eventDataVarPath = 'properties.eventData';

module.exports = {
  errorHandler,
  getNormalizedErrorStatus,
  offsetLimitVarPath,
  eventDataVarPath,
};
