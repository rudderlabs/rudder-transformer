const { httpPOST } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');
const { isHttpStatusSuccess } = require('../../util');
const { executeCommonValidations } = require('../../util/regulation-api');
const { DEL_MAX_BATCH_SIZE } = require('./config');
const { getUserIdBatches } = require('../../util/deleteUserUtils');
const { NetworkError, ConfigurationError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

const userDeletionHandler = async (userAttributes, config) => {
  if (!config) {
    throw new ConfigurationError('Config for deletion not present');
  }
  const { dataCenter, restApiKey } = config;
  if (!dataCenter || !restApiKey) {
    throw new ConfigurationError('data center / api key for deletion not present');
  }
  // Endpoints different for different data centers.
  // DOC: https://www.braze.com/docs/user_guide/administrative/access_braze/braze_instances/
  let endPoint;
  const endpointPath = '/users/delete'; // TODO: to handle for destinations dynamically by extracting from endpoint
  const dataCenterArr = dataCenter.trim().split('-');
  if (dataCenterArr[0].toLowerCase() === 'eu') {
    endPoint = 'https://rest.fra-01.braze.eu/users/delete';
  } else {
    endPoint = `https://rest.iad-${dataCenterArr[1]}.braze.com/users/delete`;
  }

  // https://www.braze.com/docs/api/endpoints/user_data/post_user_delete/
  const batchEvents = getUserIdBatches(userAttributes, DEL_MAX_BATCH_SIZE);
  await Promise.all(
    batchEvents.map(async (batchEvent) => {
      const data = { external_ids: batchEvent };
      const requestOptions = {
        headers: {
          'Content-Type': JSON_MIME_TYPE,
          Authorization: `Bearer ${restApiKey}`,
        },
      };

      const resp = await httpPOST(endPoint, data, requestOptions, {
        destType: 'braze',
        feature: 'deleteUsers',
        endpointPath,
      });
      const handledDelResponse = processAxiosResponse(resp);
      if (!isHttpStatusSuccess(handledDelResponse.status) && handledDelResponse.status !== 404) {
        throw new NetworkError(
          'User deletion request failed',
          handledDelResponse.status,
          {
            [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(handledDelResponse.status),
          },
          handledDelResponse,
        );
      }
    }),
  );

  return { statusCode: 200, status: 'successful' };
};
const processDeleteUsers = async (event) => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = await userDeletionHandler(userAttributes, config);
  return resp;
};

module.exports = { processDeleteUsers };
