const lodash = require('lodash');
const { ConfigurationError, NetworkError } = require('@rudderstack/integrations-lib');
const { handleHttpRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util');
const {
  DEL_MAX_BATCH_SIZE,
  DISTINCT_ID_MAX_BATCH_SIZE,
  DELETION_TASK_ALREADY_EXISTS_STATUS,
} = require('./config');
const { executeCommonValidations } = require('../../util/regulation-api');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { getUserIdBatches } = require('../../util/deleteUserUtils');
const { getBaseEndpoint, getCreateDeletionTaskEndpoint } = require('./util');

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
        {
          destType: 'mp',
          feature: 'deleteUsers',
          endpointPath,
          requestMethod: 'POST',
          module: 'deletion',
        },
      );
      // Mixpanel answers 409 Conflict when a deletion task already exists for a requested
      // distinct_id. For a single-id request that is unambiguous: this user is already scheduled
      // for deletion on their side, so the request has achieved what it was for. Retrying can only
      // ever return 409 again, so treating it as a failure burns every regulation-worker attempt
      // and aborts the job — the deletion is recorded as failed even though Mixpanel is deleting
      // the user. This mirrors the 404 ("nothing left to delete") handling in the
      // custify/intercom/iterable handlers.
      //
      // We deliberately do NOT extend this to multi-id requests. Mixpanel does not document 409,
      // so we cannot tell whether a conflict rejects the whole request or only the conflicting id.
      // If it rejects the whole request, swallowing it would mark every other user in the batch as
      // deleted when none of them were — a silent compliance gap. Failing the batch is the safe
      // side of that unknown.
      const alreadyDeletionScheduled =
        handledDelResponse.status === DELETION_TASK_ALREADY_EXISTS_STATUS &&
        batchEvent.length === 1;
      if (!isHttpStatusSuccess(handledDelResponse.status) && !alreadyDeletionScheduled) {
        throw new NetworkError(
          'User deletion request failed for `create deletion task` api',
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
