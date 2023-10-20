const { NetworkError } = require('@rudderstack/integrations-lib');
const {
  nodeSysErrorToStatus,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');

const errorHandler = (err, message) => {
  if (err.response) {
    throw new NetworkError(
      `${message} (${err.response?.statusText},${JSON.stringify(err.response?.data)})`,
      err.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(err.status),
      },
      err,
    );
  } else {
    const httpError = nodeSysErrorToStatus(err.code);
    throw new NetworkError(
      `${message} ${httpError.message}`,
      httpError.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(httpError.status),
      },
      err,
    );
  }
};

const offsetLimitVarPath = 'response.data.meta.total';
const eventDataVarPath = 'properties.eventData';

module.exports = { errorHandler, offsetLimitVarPath, eventDataVarPath };
