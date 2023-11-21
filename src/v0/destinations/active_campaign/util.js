const { NetworkError } = require('@rudderstack/integrations-lib');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');

const errorHandler = (err, message) => {
  const {response, status} = processAxiosResponse(err);
  const stringifiedResponse = JSON.stringify(response);
  let msg = `${message} ${stringifiedResponse}`;
  if (response) {
    msg = `${message} (${err.response?.statusText},${stringifiedResponse})`;
  }
  throw new NetworkError(
    msg,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    response?.data,
  );
};

const offsetLimitVarPath = 'response.data.meta.total';
const eventDataVarPath = 'properties.eventData';

module.exports = { errorHandler, offsetLimitVarPath, eventDataVarPath };
