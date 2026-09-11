const lodash = require('lodash');
const { ConfigurationError, NetworkError } = require('@rudderstack/integrations-lib');
const { handleHttpRequest } = require('../../../adapters/network');
const logger = require('../../../logger');
const { isHttpStatusSuccess } = require('../../util');
const { DEL_MAX_BATCH_SIZE, DISTINCT_ID_MAX_BATCH_SIZE } = require('./config');
const { executeCommonValidations } = require('../../util/regulation-api');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');
const { HTTP_STATUS_CODES, JSON_MIME_TYPE } = require('../../util/constant');
const { getUserIdBatches } = require('../../util/deleteUserUtils');
const { getBaseEndpoint, getCreateDeletionTaskEndpoint } = require('./util');

// The create deletion task API allows one request per second; a faster request gets
// 429 "Too Many Requests, this API is limited to 1 req/s".
const DELETION_TASK_REQUEST_INTERVAL_MS = 1000;

const deleteProfile = async (userAttributes, config) => {
  const endpoint = `${getBaseEndpoint(config)}/engage`;
  const endpointPath = '/engage';
  const defaultValues = {
    $token: `${config.token}`,
    $delete: null,
    $ignore_alias: true,
  };
  const data = userAttributes
    .filter((attr) => attr.userId)
    .map((userAttribute) => ({
      $distinct_id: userAttribute.userId,
      ...defaultValues,
    }));
  const headers = {
    accept: 'text/plain',
    'content-type': JSON_MIME_TYPE,
  };

  // batchEvents = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  // ref : https://developer.mixpanel.com/reference/delete-profile
  const batchEvents = lodash.chunk(data, DEL_MAX_BATCH_SIZE);
  await Promise.all(
    batchEvents.map(async (batchEvent) => {
      const { processedResponse: handledDelResponse } = await handleHttpRequest(
        'post',
        endpoint,
        batchEvent,
        { headers },
        {
          destType: 'mp',
          feature: 'deleteUsers',
          endpointPath,
          requestMethod: 'POST',
          module: 'deletion',
        },
      );
      if (!isHttpStatusSuccess(handledDelResponse.status)) {
        throw new NetworkError(
          'User deletion request failed for `delete profile` api',
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
  return {
    statusCode: 200,
    status: 'successful',
  };
};

const createDeletionTask = async (userAttributes, config) => {
  const { token, gdprApiToken, dataResidency } = config;

  if (!gdprApiToken) {
    throw new ConfigurationError(
      'GDPR API Token is a required field for creating deletion task in mixpanel',
    );
  }

  const endpoint = getCreateDeletionTaskEndpoint(config, token);
  const endpointPath = '/api/app/data-deletions/v3.0/';
  const headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Bearer ${gdprApiToken}`,
  };
  const complianceType = dataResidency === 'eu' ? 'GDPR' : 'CCPA';

  // batchEvents = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  // ref : https://developer.mixpanel.com/docs/privacy-security#create-a-deletion-task
  const batchEvents = getUserIdBatches(userAttributes, DISTINCT_ID_MAX_BATCH_SIZE);
  let requestCount = 0;
  // Requests are sent one at a time to stay within the API's rate limit.
  for (const batchEvent of batchEvents) {
    let distinctIds = batchEvent;
    while (distinctIds.length > 0) {
      if (requestCount > 0) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
          setTimeout(resolve, DELETION_TASK_REQUEST_INTERVAL_MS);
        });
      }
      requestCount += 1;
      // eslint-disable-next-line no-await-in-loop
      const { processedResponse: handledDelResponse } = await handleHttpRequest(
        'post',
        endpoint,
        { distinct_ids: distinctIds, compliance_type: complianceType },
        { headers },
        {
          destType: 'mp',
          feature: 'deleteUsers',
          endpointPath,
          requestMethod: 'POST',
          module: 'deletion',
        },
      );
      if (isHttpStatusSuccess(handledDelResponse.status)) {
        break;
      }

      // A 409 rejects the whole request and names the ids that already have a deletion task running:
      // { status: 'error', error: { conflicting_distinct_ids: ['u1'], conflicting_task_ids: ['<task id>'], error: '...' } }
      // Those users are already being deleted, so only the rest are resubmitted.
      const conflictingIds = handledDelResponse.response?.error?.conflicting_distinct_ids;
      const remainingIds =
        handledDelResponse.status === HTTP_STATUS_CODES.CONFLICT && Array.isArray(conflictingIds)
          ? lodash.difference(distinctIds, conflictingIds)
          : distinctIds;
      // Any other failure, including a 409 that names none of these ids, fails the request.
      if (remainingIds.length === distinctIds.length) {
        throw new NetworkError(
          'User deletion request failed for `create deletion task` api',
          handledDelResponse.status,
          {
            [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(handledDelResponse.status),
          },
          handledDelResponse,
        );
      }
      logger.info(
        '[MP] Deletion task already running for some distinct ids, resubmitting the rest',
        {
          conflictingCount: distinctIds.length - remainingIds.length,
          remainingCount: remainingIds.length,
          conflictingTaskIds: handledDelResponse.response.error.conflicting_task_ids,
        },
      );
      distinctIds = remainingIds;
    }
  }

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

const processDeleteUsers = async (event) => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = await userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };
