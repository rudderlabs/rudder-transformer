const _ = require('lodash');
const { handleHttpRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util');
const {
  DEL_MAX_BATCH_SIZE,
  getCreateDeletionTaskEndpoint,
  DISTINCT_ID_MAX_BATCH_SIZE,
  DEFAULT_COMPLIANCE_TYPE,
} = require('./config');
const { executeCommonValidations } = require('../../util/regulation-api');
const { ConfigurationError, NetworkError } = require('../../util/errorTypes');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');

const deleteProfile = async (userAttributes, config) => {
  const endpoint =
    config.dataResidency === 'eu'
      ? 'https://api-eu.mixpanel.com/engage'
      : 'https://api.mixpanel.com/engage';
  const data = [];
  const defaultValues = {
    $token: `${config.token}`,
    $delete: null,
    $ignore_alias: true,
  };
  userAttributes.forEach((userAttribute) => {
    // Dropping the user if userId is not present
    if (userAttribute.userId) {
      data.push({
        $distinct_id: userAttribute.userId,
        ...defaultValues,
      });
    }
  });
  const headers = {
    accept: 'text/plain',
    'content-type': JSON_MIME_TYPE,
  };

  // batchEvents = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  // ref : https://developer.mixpanel.com/reference/delete-profile
  const batchEvents = _.chunk(data, DEL_MAX_BATCH_SIZE);
  await Promise.all(
    batchEvents.map(async (batchEvent) => {
      const { processedResponse: handledDelResponse } = await handleHttpRequest(
        'post',
        endpoint,
        batchEvent,
        headers,
      );
      if (!isHttpStatusSuccess(handledDelResponse.status)) {
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
  return {
    statusCode: 200,
    status: 'successful',
  };
};

const createDeletionTask = async (userAttributes, config) => {
  const { token, gdprApiToken } = config;

  if (!gdprApiToken) {
    throw new ConfigurationError(
      'GDPR Api Token is a required field for creating deletion task in mixpanel',
    );
  }

  const endpoint = getCreateDeletionTaskEndpoint(token);
  const headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Bearer ${gdprApiToken}`,
  };

  const groupedUserAttributes = _.groupBy(
    userAttributes,
    (attribute) => attribute.complianceType || DEFAULT_COMPLIANCE_TYPE,
  );

  // chunkedUserIds = [[u1,u2,u3,..batchSize],[u1,u2,u3,..batchSize]..]
  // ref : https://developer.mixpanel.com/docs/privacy-security#create-a-deletion-task
  const chunkedUserIds = _.mapValues(groupedUserAttributes, (group) =>
    _.chunk(_.map(group, 'userId'), DISTINCT_ID_MAX_BATCH_SIZE),
  );
  await Promise.all(
    Object.keys(chunkedUserIds).map(async (complianceType) => {
      const batchEvents = chunkedUserIds[complianceType];
      await Promise.all(
        batchEvents.map(async (batchEvent) => {
          const request = {
            distinct_ids: batchEvent,
            compliance_type: complianceType,
          };
          const { processedResponse: handledDelResponse } = await handleHttpRequest(
            'post',
            endpoint,
            request,
            { headers },
          );
          if (!isHttpStatusSuccess(handledDelResponse.status)) {
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
    }),
  );

  return {
    statusCode: 200,
    status: 'successful',
  };
};

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, email and phone
 * @param {*} config Destination.Config provided in dashboard
 * @returns
 */
const userDeletionHandler = async (userAttributes, config) => {
  if (!config?.token) {
    throw new ConfigurationError('API Token is a required field for user deletion');
  }

  if (config?.userDeletionApi === 'task') {
    return createDeletionTask(userAttributes, config);
  }

  return deleteProfile(userAttributes, config);
};

const processDeleteUsers = (event) => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };
