const lodash = require('lodash');
const set = require('set-value');
const get = require('get-value');
const {
  isDefinedNotNullNotEmpty,
  InstrumentationError,
  ConfigurationError,
} = require('@rudderstack/integrations-lib');
const {
  isDefined,
  constructPayload,
  getFullName,
  extractCustomFields,
  isAppleFamily,
  getBrowserInfo,
  toUnixTimestampInMS,
  batchMultiplexedEvents,
  getSuccessRespEvents,
  defaultBatchRequestConfig,
  IsGzipSupported,
  isObject,
  isDefinedAndNotNull,
  removeUndefinedValues,
} = require('../../util');
const {
  ConfigCategory,
  MP_IDENTIFY_EXCLUSION_LIST,
  GEO_SOURCE_ALLOWED_VALUES,
  mappingConfig,
  BASE_ENDPOINT_EU,
  BASE_ENDPOINT_IN,
  BASE_ENDPOINT,
  CREATE_DELETION_TASK_ENDPOINT_EU,
  CREATE_DELETION_TASK_ENDPOINT_IN,
  CREATE_DELETION_TASK_ENDPOINT,
  MAX_PROPERTY_KEYS_COUNT,
  MAX_ARRAY_ELEMENTS_COUNT,
  MAX_PAYLOAD_SIZE_BYTES,
} = require('./config');
const { CommonUtils } = require('../../../util/common');
const stats = require('../../../util/stats');

const mPIdentifyConfigJson = mappingConfig[ConfigCategory.IDENTIFY.name];
const mPProfileAndroidConfigJson = mappingConfig[ConfigCategory.PROFILE_ANDROID.name];
const mPProfileIosConfigJson = mappingConfig[ConfigCategory.PROFILE_IOS.name];
const mPSetOnceConfigJson = mappingConfig[ConfigCategory.SET_ONCE.name];

/**
 * Helper function that performs recursive validation of objects
 * @private
 */
function validateObjectRecursively(obj, path) {
  // Check number of keys
  const keys = Object.keys(obj);
  if (keys.length >= MAX_PROPERTY_KEYS_COUNT) {
    const location = path ? ` at ${path}` : '';
    throw new InstrumentationError(
      `Mixpanel properties${location} exceed the limit of ${MAX_PROPERTY_KEYS_COUNT} keys (found ${keys.length})`,
    );
  }

  // Check each property
  keys.forEach((key) => {
    const value = obj[key];
    const newPath = path ? `${path}.${key}` : key;

    if (Array.isArray(value)) {
      if (value.length > MAX_ARRAY_ELEMENTS_COUNT) {
        throw new InstrumentationError(
          `Mixpanel array property '${newPath}' exceeds the limit of ${MAX_ARRAY_ELEMENTS_COUNT} elements (found ${value.length})`,
        );
      }
      // Check objects within arrays
      value.forEach((item, index) => {
        if (isObject(item)) {
          validateObjectRecursively(item, `${newPath}[${index}]`);
        }
      });
    } else if (isObject(value)) {
      validateObjectRecursively(value, newPath);
    }
  });
}
/**
 * Validates that payload object adheres to Mixpanel's limits:
 * - Must be smaller than 1MB of uncompressed JSON
 * - Must have fewer than 255 properties
 * - All nested object payload must have fewer than 255 keys
 * - All array payload must have fewer than 255 elements
 *
 * @param {Object} payload - The payload object to validate
 * @throws {InstrumentationError} If any of the limits are exceeded
 */
const validateMixpanelPayloadLimits = (payload) => {
  if (!isDefinedAndNotNull(payload)) {
    return;
  }
  const payloadSize = Buffer.byteLength(JSON.stringify(payload));
  if (payloadSize > MAX_PAYLOAD_SIZE_BYTES) {
    throw new InstrumentationError(
      `Mixpanel payload exceeds the maximum size limit of 1MB (found ${Math.round(payloadSize / 1024)} KB)`,
    );
  }

  // Start the recursive validation
  validateObjectRecursively(payload, '');
};

/**
 * This method populates the payload with device fields based on mp mapping
 * @param message
 * @param rawPayload
 * @returns
 */
const populateDeviceFieldsInPayload = (message, rawPayload) => {
  const device = get(message, 'context.device');
  let payload = {};
  let updatedRawPayload = { ...rawPayload };
  if (device) {
    const deviceTokenArray = isDefinedAndNotNull(device.token) ? [device.token] : undefined;
    if (isAppleFamily(device.type)) {
      payload = constructPayload(message, mPProfileIosConfigJson);
      updatedRawPayload.$ios_devices = deviceTokenArray;
    } else if (device.type?.toLowerCase() === 'android') {
      payload = constructPayload(message, mPProfileAndroidConfigJson);
      updatedRawPayload.$android_devices = deviceTokenArray;
    }
    updatedRawPayload = removeUndefinedValues(updatedRawPayload);
  }
  return { ...updatedRawPayload, ...payload };
};

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

  rawPayload = populateDeviceFieldsInPayload(message, rawPayload);

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
    $time: toUnixTimestampInMS(message.timestamp || message.originalTimestamp),
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
  destination.Config.token ||
  (destination.Config.serviceAccountSecret &&
    destination.Config.serviceAccountUserName &&
    destination.Config.projectId);

/**
 * Builds UTM parameters from a campaign object.
 *
 * @param {Object} campaign - The campaign object containing the campaign details.
 * @returns {Object} - The object containing the UTM parameters extracted from the campaign object.
 *
 * @example
 * const campaign = {
 *   name: 'summer_sale',
 *   source: 'newsletter',
 *   medium: 'email'
 * };
 * { utm_campaign: 'summer_sale', utm_source: 'newsletter', utm_medium: 'email' }
 */
const buildUtmParams = (campaign) => {
  const utmParams = {};
  if (isObject(campaign)) {
    Object.keys(campaign).forEach((key) => {
      if (key === 'name') {
        utmParams.utm_campaign = campaign[key];
      } else {
        utmParams[`utm_${key}`] = campaign[key];
      }
    });
  }

  return utmParams;
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
    importEvents: eventMap.import,
    batchErrorRespList,
  };
};

const generateBatchedPayloadForArray = (events, reqMetadata) => {
  const { batchedRequest } = defaultBatchRequestConfig();
  const firstEvent = events[0];
  batchedRequest.endpoint = firstEvent.endpoint;
  batchedRequest.endpointPath = firstEvent.endpointPath;
  batchedRequest.headers = firstEvent.headers;
  batchedRequest.params = firstEvent.params;

  const batchResponseList = events.flatMap((event) => JSON.parse(event.body.JSON_ARRAY.batch));

  if (IsGzipSupported(reqMetadata) && firstEvent.endpoint.includes('import')) {
    // Gzipping the payload for /import endpoint
    batchedRequest.body.GZIP = { payload: JSON.stringify(batchResponseList) };
  } else {
    batchedRequest.body.JSON_ARRAY = { batch: JSON.stringify(batchResponseList) };
  }

  return batchedRequest;
};

const batchEvents = (successRespList, maxBatchSize, reqMetadata) => {
  const batchedEvents = batchMultiplexedEvents(successRespList, maxBatchSize);
  return batchedEvents.map((batch) => {
    const batchedRequest = generateBatchedPayloadForArray(batch.events, reqMetadata);
    return getSuccessRespEvents(batchedRequest, batch.metadata, batch.destination, true);
  });
};

/**
 * Trims the traits and contextTraits objects based on the userProfileProperties array and returns an object containing the modified traits, contextTraits, and operationTransformedProperties properties.
 *
 * @param {object} traits - An object representing the traits.
 * @param {object} contextTraits - An object representing the context traits.
 * @param userProfileProperties
 * @returns {object} - An object containing the modified traits, contextTraits, and setOnce properties.
 *
 * @example
 * const traits = { name: 'John', age: 30 };
 * const contextTraits = { country: 'USA', language: 'English', address: { city: 'New York', state: 'NY' }}};
 * const userProfileProperties = ['name', 'country', 'address.city'];
 *
 * const result = trimTraits(traits, contextTraits, operationTransformedProperties);
 * // Output: { traits: { age: 30 }, contextTraits: { language: 'English' }, operationTransformedProperties: { $name: 'John', $country_code: 'USA', city: 'New York'} }
 */
function trimTraits(traits, contextTraits, userProfileProperties) {
  let operationTransformedPayload;
  // Create a copy of the original traits object
  const traitsCopy = { ...traits };
  const contextTraitsCopy = { ...contextTraits };

  // Initialize operation eligible object
  const operationEligibleProperties = {};

  // Step 1: find the k-v pairs of userProfileProperties in traits and contextTraits

  userProfileProperties.forEach((propertyPath) => {
    const propName = lodash.last(propertyPath.split('.'));

    const traitsValue = get(traitsCopy, propertyPath);
    const contextTraitsValue = get(contextTraitsCopy, propertyPath);

    if (isDefinedNotNullNotEmpty(traitsValue)) {
      operationEligibleProperties[propName] = traitsValue;
      lodash.unset(traitsCopy, propertyPath);
    }
    if (isDefinedNotNullNotEmpty(contextTraitsValue)) {
      if (!Object.hasOwn(operationEligibleProperties, propName)) {
        operationEligibleProperties[propName] = contextTraitsValue;
      }
      lodash.unset(contextTraitsCopy, propertyPath);
    }
  });

  if (operationEligibleProperties && Object.keys(operationEligibleProperties).length > 0) {
    // Step 2: transform properties eligible as per rudderstack declared identify event mapping
    // operationEligibleProperties should have all required traits from message.traits and message.context.traits by now
    operationTransformedPayload = constructPayload(
      operationEligibleProperties,
      mPSetOnceConfigJson,
    );

    // Step 3: combine the transformed and custom traits
    operationTransformedPayload = extractCustomFields(
      operationEligibleProperties,
      operationTransformedPayload,
      'root',
      MP_IDENTIFY_EXCLUSION_LIST,
    );
  }

  return {
    traits: traitsCopy,
    contextTraits: contextTraitsCopy,
    operationTransformedProperties: operationTransformedPayload || {},
  };
}

/**
 * Generates a custom event name for a page or screen.
 *
 * @param {Object} message - The message object
 * @param {string} userDefinedEventTemplate - The user-defined event template to be used for generating the event name.
 * @throws {ConfigurationError} If the event template is missing.
 * @returns {string} The generated custom event name.
 * @example
 * const userDefinedEventTemplate = "Viewed {{ category }} {{ name }} Page";
 * const message = {name: 'Home', properties: {category: 'Index'}};
 * output: "Viewed Index Home Page"
 */
const generatePageOrScreenCustomEventName = (message, userDefinedEventTemplate) => {
  if (!userDefinedEventTemplate) {
    throw new ConfigurationError(
      'Event name template is not configured. Please provide a valid value for the `Page/Screen Event Name Template` in the destination dashboard.',
    );
  }

  let eventName = userDefinedEventTemplate;

  if (isDefinedAndNotNull(message.properties?.category)) {
    // Replace {{ category }} with actual values
    eventName = eventName.replace(/{{\s*category\s*}}/g, message.properties.category);
  } else {
    // find {{ category }} surrounded by whitespace characters and replace it with a single whitespace character
    eventName = eventName.replace(/\s{{\s*category\s*}}\s/g, ' ');
  }

  if (isDefinedAndNotNull(message.name)) {
    // Replace {{ name }} with actual values
    eventName = eventName.replace(/{{\s*name\s*}}/g, message.name);
  } else {
    // find {{ name }} surrounded by whitespace characters and replace it with a single whitespace character
    eventName = eventName.replace(/\s{{\s*name\s*}}\s/g, ' ');
  }

  return eventName;
};

/**
 * Records the batch size metrics for different endpoints.
 *
 * @param {Object} batchSize - The object containing the batch size for different endpoints.
 * @param {number} batchSize.engage - The batch size for engage endpoint.
 * @param {number} batchSize.groups - The batch size for group endpoint.
 * @param {number} batchSize.import - The batch size for import endpoint.
 * @param {string} destinationId - The ID of the destination.
 * @returns {void}
 */
const recordBatchSizeMetrics = (batchSize, destinationId) => {
  stats.gauge('mixpanel_batch_engage_pack_size', batchSize.engage, {
    destination_id: destinationId,
  });
  stats.gauge('mixpanel_batch_group_pack_size', batchSize.groups, {
    destination_id: destinationId,
  });
  stats.gauge('mixpanel_batch_import_pack_size', batchSize.import, {
    destination_id: destinationId,
  });
};

const getBaseEndpoint = (config) => {
  const dataResidency = config?.dataResidency;
  switch (dataResidency) {
    case 'eu':
      return BASE_ENDPOINT_EU;
    case 'in':
      return BASE_ENDPOINT_IN;
    default:
      return BASE_ENDPOINT;
  }
};

const getDeletionTaskBaseEndpoint = (config) => {
  const dataResidency = config?.dataResidency;
  switch (dataResidency) {
    case 'eu':
      return CREATE_DELETION_TASK_ENDPOINT_EU;
    case 'in':
      return CREATE_DELETION_TASK_ENDPOINT_IN;
    default:
      return CREATE_DELETION_TASK_ENDPOINT;
  }
};

const getCreateDeletionTaskEndpoint = (config, projectToken) =>
  `${getDeletionTaskBaseEndpoint(config)}?token=${projectToken}`;

module.exports = {
  createIdentifyResponse,
  isImportAuthCredentialsAvailable,
  buildUtmParams,
  groupEventsByEndpoint,
  generateBatchedPayloadForArray,
  batchEvents,
  trimTraits,
  generatePageOrScreenCustomEventName,
  recordBatchSizeMetrics,
  getTransformedJSON,
  getBaseEndpoint,
  getDeletionTaskBaseEndpoint,
  getCreateDeletionTaskEndpoint,
  validateMixpanelPayloadLimits,
};
