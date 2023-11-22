const { NetworkError } = require('@rudderstack/integrations-lib');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');

const errorHandler = (httpCallError, message) => {
  const {response, status} = processAxiosResponse(httpCallError);
  let msg = message;
  if (response) {
    msg = `${message} (${httpCallError.response?.statusText},${JSON.stringify(response)})`;
  }
  throw new NetworkError(
    msg,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    response,
  );
};

const offsetLimitVarPath = 'response.data.meta.total';
const eventDataVarPath = 'properties.eventData';

module.exports = { errorHandler, offsetLimitVarPath, eventDataVarPath };
