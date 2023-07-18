const set = require('set-value');
const get = require('get-value');
const {
  isDefined,
  constructPayload,
  getFullName,
  extractCustomFields,
  isAppleFamily,
  getBrowserInfo,
  toUnixTimestamp,
} = require('../../util');
const { CommonUtils } = require('../../../util/common');
const {
  ConfigCategory,
  MP_IDENTIFY_EXCLUSION_LIST,
  GEO_SOURCE_ALLOWED_VALUES,
  mappingConfig,
} = require('./config');
const { InstrumentationError } = require('../../util/errorTypes');

const mPIdentifyConfigJson = mappingConfig[ConfigCategory.IDENTIFY.name];
const mPProfileAndroidConfigJson = mappingConfig[ConfigCategory.PROFILE_ANDROID.name];
const mPProfileIosConfigJson = mappingConfig[ConfigCategory.PROFILE_IOS.name];

/**
 * this function has been used to create
 * @param {*} message rudderstack identify payload
 * @param {*} mappingJson identifyConfig.json
 * @param {*} useNewMapping a variable to support backward compatibility
 * @returns
 */
const getTransformedJSON = (message, mappingJson, useNewMapping) => {
  let rawPayload = constructPayload(message, mappingJson);
  if (
    isDefined(rawPayload.$geo_source) &&
    !GEO_SOURCE_ALLOWED_VALUES.includes(rawPayload.$geo_source)
  ) {
    throw new InstrumentationError("$geo_source value must be either null or 'reverse_geocoding' ");
  }
  const userName = get(rawPayload, '$name');
  if (!userName) {
    set(rawPayload, '$name', getFullName(message));
  }

  rawPayload = extractCustomFields(
    message,
    rawPayload,
    ['traits', 'context.traits'],
    MP_IDENTIFY_EXCLUSION_LIST,
  );

  /*
    we are adding backward compatibility using useNewMapping key.
    TODO :: This portion need to be removed after we deciding to stop
    support for old mapping.
    */
  if (!useNewMapping) {
    if (rawPayload.$first_name) {
      rawPayload.$firstName = rawPayload.$first_name;
      delete rawPayload.$first_name;
    }
    if (rawPayload.$last_name) {
      rawPayload.$lastName = rawPayload.$last_name;
      delete rawPayload.$last_name;
    }
  }

  const device = get(message, 'context.device');
  if (device && device.token) {
    let payload;
    if (isAppleFamily(device.type)) {
      payload = constructPayload(message, mPProfileIosConfigJson);
      rawPayload.$ios_devices = [device.token];
    } else if (device.type.toLowerCase() === 'android') {
      payload = constructPayload(message, mPProfileAndroidConfigJson);
      rawPayload.$android_devices = [device.token];
    }
    rawPayload = { ...rawPayload, ...payload };
  }
  if (message.channel === 'web' && message.context?.userAgent) {
    const browser = getBrowserInfo(message.context.userAgent);
    rawPayload.$browser = browser.name;
    rawPayload.$browser_version = browser.version;
  }

  return rawPayload;
};

/**
 * This function is used to generate identify response.
 * @param {*} message rudderstack identify payload
 * @param {*} type EventType (identify here)
 * @param {*} destination Config.destination
 * @param {*} responseBuilderSimple function to generate response
 * @returns
 */
const createIdentifyResponse = (message, type, destination, responseBuilderSimple) => {
  // this variable is used for supporting backward compatibility
  const { useNewMapping, token } = destination.Config;
  // user payload created
  const properties = getTransformedJSON(message, mPIdentifyConfigJson, useNewMapping);

  const payload = {
    $set: properties,
    $token: token,
    $distinct_id: message.userId || message.anonymousId,
    $ip: get(message, 'context.ip') || message.request_ip,
    $time: toUnixTimestamp(message.timestamp),
  };

  if (destination?.Config.identityMergeApi === 'simplified') {
    payload.$distinct_id = message.userId || `$device:${message.anonymousId}`;
  }

  if (message.context?.active === false) {
    payload.$ignore_time = true;
  }
  // Creating the response to create user
  return responseBuilderSimple(payload, message, type, destination.Config);
};

/**
 * This function is checking availability of service account credentials, and secret token.
 * https://developer.mixpanel.com/reference/authentication
 * @param {*} destination inputs from dashboard
 * @returns
 */
const isImportAuthCredentialsAvailable = (destination) =>
  destination.Config.apiSecret ||
  (destination.Config.serviceAccountSecret &&
    destination.Config.serviceAccountUserName &&
    destination.Config.projectId);

/**
 * Combines batched requests with the same JobIds.
 * @param {Array<Object>} batches - The array of batched request objects.
 * @returns {Array<Object>} - The combined batched request objects with merged JobIds.
 *
 */

function combineBatchRequestsWithSameJobIds(batches) {
  const combinedBatches = [...batches];
  const processedBatches = new Array(combinedBatches.length).fill(false);

  // Iterate over each batch
  combinedBatches.forEach((batch1, i) => {
    if (processedBatches[i]) return;

    // Check for common JobIds with other batches
    combinedBatches
      .filter((_, j) => i !== j && !processedBatches[j])
      .forEach((batch2) => {
        const metadata1 = batch1.metadata;
        const metadata2 = batch2.metadata;

        // Check if there are common JobIds
        const hasCommonJobId = metadata1.some((meta1) =>
          metadata2.some((meta2) => meta1.jobId === meta2.jobId),
        );

        if (hasCommonJobId) {
          // Merge batchedRequests arrays
          batch1.batchedRequest = [
            ...(Array.isArray(batch1.batchedRequest)
              ? batch1.batchedRequest
              : [batch1.batchedRequest]),
            ...(Array.isArray(batch2.batchedRequest)
              ? batch2.batchedRequest
              : [batch2.batchedRequest]),
          ];

          // Mark the second batch as processed
          processedBatches[combinedBatches.indexOf(batch2)] = true;

          const uniqueJobIds = new Set(metadata1.map((meta) => meta.jobId));
          // Filter out duplicate JobIds from metadata2
          const metadataToAdd = metadata2.filter((meta) => !uniqueJobIds.has(meta.jobId));
          metadata1.push(...metadataToAdd);
        }
      });
  });

  // Filter out processed batches
  return combinedBatches.filter((_, index) => !processedBatches[index]);
}

function combineBatchRequestsWithSameJobIds2(batches) {
  const mergedBatches = [];
  const metadataMap = new Map();

  batches.forEach((batch) => {
    batch.batchedRequest = CommonUtils.toArray(batch.batchedRequest);
    let existingBatch = null;

    for (const metadataItem of batch.metadata) {
      if (metadataMap.has(metadataItem.jobId)) {
        existingBatch = metadataMap.get(metadataItem.jobId);
        break;
      }
    }

    if (existingBatch) {
      // Merge metadata
      batch.metadata.forEach((metadataItem) => {
        if (!metadataMap.has(metadataItem.jobId)) {
          metadataMap.set(metadataItem.jobId, existingBatch);
        }
        existingBatch.metadata.push(metadataItem);
        existingBatch.batchedRequest.push(...batch.batchedRequest);
      });
    } else {
      mergedBatches.push(batch);
      batch.metadata.forEach((metadataItem) => {
        metadataMap.set(metadataItem.jobId, batch);
      });
    }
  });

  // Remove duplicate metadata within each merged object
  mergedBatches.forEach((batch) => {
    const metadataMap = new Map();
    batch.metadata = batch.metadata.filter((metadataItem) => {
      if (!metadataMap.has(metadataItem.jobId)) {
        metadataMap.set(metadataItem.jobId, true);
        return true;
      }
      return false;
    });
  });

  return mergedBatches;
}

module.exports = {
  createIdentifyResponse,
  isImportAuthCredentialsAvailable,
  combineBatchRequestsWithSameJobIds,
  combineBatchRequestsWithSameJobIds2,
};
