const {
  NetworkError,
  isDefinedAndNotNull,
  ConfigurationAuthError,
} = require('@rudderstack/integrations-lib');
const { httpPOST } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../util');
const { executeCommonValidations } = require('../../util/regulation-api');
const tags = require('../../util/tags');
const { getCustomIdBatches } = require('../../util/deleteUserUtils');
const {
  buildHeader,
  deduceCustomIdentifier,
  findRudderPropertyByEmersysProperty,
} = require('../../../cdk/v2/destinations/emarsys/utils');

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, email and phone
 * @param {*} config Destination.Config provided in dashboard
 * @returns
 */
const userDeletionHandler = async (userAttributes, config) => {
  const endpoint = 'https://api.emarsys.net/api/v2/contact/delete';
  const headers = buildHeader(config);
  const customIdentifier = deduceCustomIdentifier({}, config.emersysCustomIdentifier);
  const configuredPayloadProperty = findRudderPropertyByEmersysProperty(
    customIdentifier,
    config.fieldMapping,
  );
  if (!isDefinedAndNotNull(config.defaultContactList)) {
    throw new ConfigurationAuthError('No audience list is configured. Aborting');
  }
  /**
   * identifierBatches = [[u1,u2,u3,...batchSize],[u1,u2,u3,...batchSize]...]
   * Ref doc : https://dev.emarsys.com/docs/core-api-reference/szmq945esac90-delete-contacts
   */
  const identifierBatches = getCustomIdBatches(userAttributes, configuredPayloadProperty, 1000);
  // Note: we will only get 400 status code when no user deletion is present for given userIds so we will not throw error in that case
  // eslint-disable-next-line no-restricted-syntax
  for (const curBatch of identifierBatches) {
    const deleteContactPayload = {
      key_id: customIdentifier,
      contact_list_id: config.defaultContactList,
    };
    deleteContactPayload[`${customIdentifier}`] = curBatch;
    // eslint-disable-next-line no-await-in-loop
    const deletionResponse = await httpPOST(
      endpoint,
      {
        ...deleteContactPayload,
      },
      {
        headers,
      },
      {
        destType: 'emarsys',
        feature: 'deleteUsers',
        endpointPath: '/contact/delete',
        requestMethod: 'POST',
        module: 'deletion',
      },
    );
    const handledDelResponse = processAxiosResponse(deletionResponse);
    if (!isHttpStatusSuccess(handledDelResponse.status) && handledDelResponse.status !== 400) {
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
  }

  return {
    statusCode: 200,
    status: 'successful',
  };
};
const processDeleteUsers = async (event) => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = await userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };
