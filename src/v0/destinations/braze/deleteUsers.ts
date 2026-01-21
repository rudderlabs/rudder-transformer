import { NetworkError, ConfigurationError } from '@rudderstack/integrations-lib';
import { httpPOST } from '../../../adapters/network';
import { processAxiosResponse, getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import tags from '../../util/tags';
import { isHttpStatusSuccess } from '../../util';
import { executeCommonValidations } from '../../util/regulation-api';
import { DEL_MAX_BATCH_SIZE } from './config';
import { getUserIdBatches } from '../../util/deleteUserUtils';
import { JSON_MIME_TYPE } from '../../util/constant';
import type { BrazeDeleteUserEvent, BrazeDestinationConfig } from './types';

const userDeletionHandler = async (
  userAttributes: BrazeDeleteUserEvent['userAttributes'],
  config: BrazeDestinationConfig,
) => {
  if (!config) {
    throw new ConfigurationError('Config for deletion not present');
  }
  const { dataCenter, restApiKey } = config;
  if (!dataCenter || !restApiKey) {
    throw new ConfigurationError('data center / api key for deletion not present');
  }
  // Endpoints different for different data centers.
  // DOC: https://www.braze.com/docs/user_guide/administrative/access_braze/braze_instances/
  // Example Data Center: "EU-01", "US-01"
  let endPoint;
  const endpointPath = '/users/delete';
  const dataCenterArr = dataCenter.trim().split('-');
  if (dataCenterArr[0].toLowerCase() === 'eu') {
    endPoint = `https://rest.fra-${dataCenterArr[1]}.braze.eu/users/delete`;
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
        requestMethod: 'POST',
        module: 'deletion',
      });
      const handledDelResponse = processAxiosResponse(resp);
      if (!isHttpStatusSuccess(handledDelResponse.status) && handledDelResponse.status !== 404) {
        throw new NetworkError(
          'User deletion request failed',
          handledDelResponse.status,
          {
            [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(handledDelResponse.status),
            [tags.TAG_NAMES.STATUS]: handledDelResponse.status,
          },
          handledDelResponse,
        );
      }
    }),
  );

  return { statusCode: 200, status: 'successful' };
};
const processDeleteUsers = async (event: BrazeDeleteUserEvent) => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = await userDeletionHandler(userAttributes, config);
  return resp;
};

export { processDeleteUsers };
