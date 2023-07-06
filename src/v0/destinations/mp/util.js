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

const combineBatchRequestsWithSameJobIds = (batches) => {
  const combinedRequests = {};

  // Iterate over the response list
  for (const batch of batches) {
    const { metadata } = batch;

    // Find any existing request with matching job IDs
    const matchingBatchRequestWithSameJobId = Object.values(combinedRequests).find((request) => {
      const existingJobIds = request.metadata.map((obj) => obj.jobId);
      // Check if any of the job IDs in the existing request match the current batch's job IDs
      return metadata.some((obj) => existingJobIds.includes(obj.jobId));
    });

    if (matchingBatchRequestWithSameJobId) {
      // If a matching request is found, combine the unique metadata arrays and append the batchedRequest

      // Filter out the metadata objects that are already present in the matching request
      const uniqueMetadata = metadata.filter(
        (obj) =>
          !matchingBatchRequestWithSameJobId.metadata.some(
            (existingObj) => existingObj.jobId === obj.jobId,
          ),
      );

      // Append the unique metadata to the existing request's metadata array
      matchingBatchRequestWithSameJobId.metadata.push(...uniqueMetadata);

      // Combine the batchedRequest into an array

      // Check if the existing request's batchedRequest is already an array
      matchingBatchRequestWithSameJobId.batchedRequest = [
        ...(Array.isArray(matchingBatchRequestWithSameJobId.batchedRequest)
          ? matchingBatchRequestWithSameJobId.batchedRequest
          : [matchingBatchRequestWithSameJobId.batchedRequest]),
        batch.batchedRequest,
      ];
    } else {
      // If no matching request is found, create a new entry for the current batch

      // Generate a unique key for the combinedRequests object based on the job IDs
      const jobIds = metadata.map((obj) => obj.jobId);
      const key = jobIds.join('_');

      // Create a new entry with the batchedRequest, metadata, and other properties
      combinedRequests[key] = {
        batchedRequest: batch.batchedRequest,
        metadata,
        destination: batch.destination,
        batched: batch.batched,
        statusCode: batch.statusCode,
      };
    }
  }

  // Convert the combinedRequests object into an array
  const combinedRequestList = Object.values(combinedRequests);
  return combinedRequestList;
};

module.exports = {
  createIdentifyResponse,
  isImportAuthCredentialsAvailable,
  combineBatchRequestsWithSameJobIds,
};
