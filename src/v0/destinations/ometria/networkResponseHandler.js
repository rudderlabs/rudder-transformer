const { NetworkError } = require('@rudderstack/integrations-lib');
const { getDynamicErrorType, trimResponse } = require('../../../adapters/utils/networkUtils');
const { isDefinedAndNotNull } = require('../../util');
const { isEmpty } = require('../../util/index');
const tags = require('../../util/tags');

const responseTransform = (destResponse) => {
  let respBody;
  try {
    respBody = JSON.parse(destResponse.Body);
  } catch (err) {
    respBody = isEmpty(!destResponse.Body) ? destResponse.Body : null;
  }
  const { data } = trimResponse(respBody);
  if (respBody && respBody.success && isDefinedAndNotNull(data.rejected) && data.rejected > 0) {
    const status = destResponse?.Status || 400;
    throw new NetworkError(
      `${data.rejected} requests rejected`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      { ...respBody, success: false },
    );
  } else if (respBody && !respBody.success) {
    const status = destResponse?.Status || 400;
    throw new NetworkError(
      `"Request failed for Ometria"`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      { ...respBody, success: false },
    );
  }
  const status = destResponse.Status;
  const message = respBody.message || 'Event delivered successfuly';
  const destinationResponse = { ...respBody, status: destResponse.Status };
  const { apiLimit } = respBody;
  return {
    status,
    message,
    destinationResponse,
    apiLimit,
  };
};

module.exports = { responseTransform };
