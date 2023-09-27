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
  batchMultiplexedEvents,
  getSuccessRespEvents,
  defaultBatchRequestConfig,
} = require('../../util');
const {
  ConfigCategory,
  MP_IDENTIFY_EXCLUSION_LIST,
  GEO_SOURCE_ALLOWED_VALUES,
  mappingConfig,
} = require('./config');
const { InstrumentationError } = require('../../util/errorTypes');
const { CommonUtils } = require('../../../util/common');

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
 * Finds an existing batch based on metadata JobIds from the provided batch and metadataMap.
 * @param {*} batch
 * @param {*} metadataMap The map containing metadata items indexed by JobIds.
 * @returns
 */
const findExistingBatch = (batch, metadataMap) => {
  let existingBatch = null;

  // eslint-disable-next-line no-restricted-syntax
  for (const metadataItem of batch.metadata) {
    if (metadataMap.has(metadataItem.jobId)) {
      existingBatch = metadataMap.get(metadataItem.jobId);
      break;
    }
  }

  return existingBatch;
};

/**
 * Removes duplicate metadata within each merged batch object.
 * @param {*} mergedBatches An array of merged batch objects.
 */
const removeDuplicateMetadata = (mergedBatches) => {
  mergedBatches.forEach((batch) => {
    const metadataSet = new Set();
    // eslint-disable-next-line no-param-reassign
    batch.metadata = batch.metadata.filter((metadataItem) => {
      if (!metadataSet.has(metadataItem.jobId)) {
        metadataSet.add(metadataItem.jobId);
        return true;
      }
      return false;
    });
  });
};

/**
 * Group events with the same endpoint together in batches
 * @param {*} events - An array of events
 * @returns
 */
const groupEventsByEndpoint = (events) => {
  const eventMap = {
    engage: [],
    groups: [],
    track: [],
    import: [],
  };
  const batchErrorRespList = [];

  events.forEach((result) => {
    if (result.message) {
      const { destination, metadata } = result;
      const message = CommonUtils.toArray(result.message);

      message.forEach((msg) => {
        const endpoint = Object.keys(eventMap).find((key) => msg.endpoint.includes(key));

        if (endpoint) {
          eventMap[endpoint].push({ message: msg, destination, metadata });
        }
      });
    } else if (result.error) {
      batchErrorRespList.push(result);
    }
  });

  return {
    engageEvents: eventMap.engage,
    groupsEvents: eventMap.groups,
    trackEvents: eventMap.track,
    importEvents: eventMap.import,
    batchErrorRespList,
  };
};

const generateBatchedPayloadForArray = (events) => {
  const { batchedRequest } = defaultBatchRequestConfig();
  const batchResponseList = events.flatMap((event) => JSON.parse(event.body.JSON_ARRAY.batch));
  batchedRequest.body.JSON_ARRAY = { batch: JSON.stringify(batchResponseList) };
  batchedRequest.endpoint = events[0].endpoint;
  batchedRequest.headers = events[0].headers;
  batchedRequest.params = events[0].params;
  return batchedRequest;
};

const batchEvents = (successRespList, maxBatchSize) => {
  const batchedEvents = batchMultiplexedEvents(successRespList, maxBatchSize);
  return batchedEvents.map((batch) => {
    const batchedRequest = generateBatchedPayloadForArray(batch.events);
    return getSuccessRespEvents(batchedRequest, batch.metadata, batch.destination, true);
  });
};

/**
 * Combines batched requests with the same JobIds.
 * @param {*} inputBatches The array of batched request objects.
 * @returns  The combined batched requests with merged JobIds.
 *
 */
const combineBatchRequestsWithSameJobIds = (inputBatches) => {
  const combineBatches = (batches) => {
    const clonedBatches = [...batches];
    const mergedBatches = [];
    const metadataMap = new Map();

    clonedBatches.forEach((batch) => {
      const existingBatch = findExistingBatch(batch, metadataMap);

      if (existingBatch) {
        // Merge batchedRequests arrays
        existingBatch.batchedRequest = [
          ...(Array.isArray(existingBatch.batchedRequest)
            ? existingBatch.batchedRequest
            : [existingBatch.batchedRequest]),
          ...(Array.isArray(batch.batchedRequest) ? batch.batchedRequest : [batch.batchedRequest]),
        ];

        // Merge metadata
        batch.metadata.forEach((metadataItem) => {
          if (!metadataMap.has(metadataItem.jobId)) {
            metadataMap.set(metadataItem.jobId, existingBatch);
          }
          existingBatch.metadata.push(metadataItem);
        });
      } else {
        mergedBatches.push(batch);
        batch.metadata.forEach((metadataItem) => {
          metadataMap.set(metadataItem.jobId, batch);
        });
      }
    });

    // Remove duplicate metadata within each merged object
    removeDuplicateMetadata(mergedBatches);

    return mergedBatches;
  };
  // We need to run this twice because in first pass some batches might not get merged
  // and in second pass they might get merged
  // Example: [[{jobID:1}, {jobID:2}], [{jobID:3}], [{jobID:1}, {jobID:3}]]
  // 1st pass: [[{jobID:1}, {jobID:2}, {jobID:3}], [{jobID:3}]]
  // 2nd pass: [[{jobID:1}, {jobID:2}, {jobID:3}]]
  return combineBatches(combineBatches(inputBatches));
};

module.exports = {
  createIdentifyResponse,
  isImportAuthCredentialsAvailable,
  groupEventsByEndpoint,
  batchEvents,
  combineBatchRequestsWithSameJobIds,
};
