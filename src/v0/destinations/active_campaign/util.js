const { NetworkError } = require('@rudderstack/integrations-lib');
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

const errorHandler = (httpCallError, message) => {
  const { response, status } = processAxiosResponse(httpCallError);
  let msg = message;
  if (response) {
    msg = `${message} (${httpCallError.response?.statusText},${JSON.stringify(response)})`;
  }
  const errorStatus = getNormalizedErrorStatus(status);
  throw new NetworkError(
    msg,
    errorStatus,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errorStatus),
    },
    response,
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
