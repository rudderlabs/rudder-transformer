const lodash = require('lodash');
const get = require('get-value');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  base64Convertor,
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getBrowserInfo,
  getEventTime,
  getTimeDifference,
  getValuesAsArrayFromConfig,
  removeUndefinedValues,
  toUnixTimestamp,
  getFieldValueFromMessage,
  checkInvalidRtTfEvents,
  handleRtTfSingleEventError,
  groupEventsByType,
  parseConfigArray,
} = require('../../util');
const {
  ConfigCategory,
  mappingConfig,
  BASE_ENDPOINT,
  BASE_ENDPOINT_EU,
  IMPORT_MAX_BATCH_SIZE,
  TRACK_MAX_BATCH_SIZE,
  ENGAGE_MAX_BATCH_SIZE,
  GROUPS_MAX_BATCH_SIZE,
} = require('./config');
const {
  createIdentifyResponse,
  isImportAuthCredentialsAvailable,
  buildUtmParams,
  combineBatchRequestsWithSameJobIds,
  groupEventsByEndpoint,
  batchEvents,
  trimTraits,
} = require('./util');
const { CommonUtils } = require('../../../util/common');

// ref: https://help.mixpanel.com/hc/en-us/articles/115004613766-Default-Properties-Collected-by-Mixpanel
const mPEventPropertiesConfigJson = mappingConfig[ConfigCategory.EVENT_PROPERTIES.name];

const setImportCredentials = (destConfig) => {
  const endpoint =
    destConfig.dataResidency === 'eu' ? `${BASE_ENDPOINT_EU}/import/` : `${BASE_ENDPOINT}/import/`;
  const headers = { 'Content-Type': 'application/json' };
  const params = { strict: destConfig.strictMode ? 1 : 0 };
  const { apiSecret, serviceAccountUserName, serviceAccountSecret, projectId } = destConfig;
  if (apiSecret) {
    headers.Authorization = `Basic ${base64Convertor(`${apiSecret}:`)}`;
  } else if (serviceAccountUserName && serviceAccountSecret && projectId) {
    headers.Authorization = `Basic ${base64Convertor(
      `${serviceAccountUserName}:${serviceAccountSecret}`,
    )}`;
    params.projectId = projectId;
  } else {
    throw new InstrumentationError(
      'Event timestamp is older than 5 days and no API secret or service account credentials (i.e. username, secret and projectId) are provided in destination configuration',
    );
  }
  return { endpoint, headers, params };
};

const responseBuilderSimple = (payload, message, eventType, destConfig) => {
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.userId = message.userId || message.anonymousId;
  response.body.JSON_ARRAY = { batch: JSON.stringify([removeUndefinedValues(payload)]) };
  const { apiSecret, serviceAccountUserName, serviceAccountSecret, projectId, dataResidency } =
    destConfig;
  const duration = getTimeDifference(message.timestamp);
  switch (eventType) {
    case EventType.ALIAS:
    case EventType.TRACK:
    case EventType.SCREEN:
    case EventType.PAGE:
      if (
        !apiSecret &&
        !(serviceAccountUserName && serviceAccountSecret && projectId) &&
        duration.days <= 5
      ) {
        response.endpoint =
          dataResidency === 'eu' ? `${BASE_ENDPOINT_EU}/track/` : `${BASE_ENDPOINT}/track/`;
        response.headers = {};
      } else if (duration.years > 5) {
        throw new InstrumentationError('Event timestamp should be within last 5 years');
      } else {
        const credentials = setImportCredentials(destConfig);
        response.endpoint = credentials.endpoint;
        response.headers = credentials.headers;
        response.params = {
          project_id: credentials.params?.projectId,
          strict: credentials.params.strict,
        };
        break;
      }
      break;
    case 'merge':
      // eslint-disable-next-line no-case-declarations
      const credentials = setImportCredentials(destConfig);
      response.endpoint = credentials.endpoint;
      response.headers = credentials.headers;
      response.params = {
        project_id: credentials.params?.projectId,
        strict: credentials.params.strict,
      };
      break;
    default:
      response.endpoint =
        dataResidency === 'eu' ? `${BASE_ENDPOINT_EU}/engage/` : `${BASE_ENDPOINT}/engage/`;
      response.headers = {};
  }
  return response;
};

const processRevenueEvents = (message, destination, revenueValue) => {
  const transactions = {
    $time: getEventTime(message),
    $amount: revenueValue,
  };
  const payload = {
    $append: { $transactions: transactions },
    $token: destination.Config.token,
    $distinct_id: message.userId || message.anonymousId,
  };

  if (destination?.Config.identityMergeApi === 'simplified') {
    payload.$distinct_id = message.userId || `$device:${message.anonymousId}`;
  }

  return responseBuilderSimple(payload, message, 'revenue', destination.Config);
};

/**
 * This function is used to process the incremental properties
 * ref :- https://developer.mixpanel.com/reference/profile-numerical-add
 * @param {*} message
 * @param {*} destination
 * @param {*} propIncrements
 * @returns
 */
const processIncrementalProperties = (message, destination, propIncrements) => {
  const payload = {
    $add: {},
    $token: destination.Config.token,
    $distinct_id: message.userId || message.anonymousId,
  };

  if (destination?.Config.identityMergeApi === 'simplified') {
    payload.$distinct_id = message.userId || `$device:${message.anonymousId}`;
  }

  if (message.properties) {
    Object.keys(message.properties).forEach((prop) => {
      const value = message.properties[prop];
      if (value && propIncrements.includes(prop)) {
        payload.$add[prop] = value;
      }
    });
  }

  return Object.keys(payload.$add).length > 0
    ? responseBuilderSimple(payload, message, 'incremental_properties', destination.Config)
    : null;
};

const getEventValueForTrackEvent = (message, destination) => {
  const mappedProperties = constructPayload(message, mPEventPropertiesConfigJson);
  // This is to conform with SDKs sending timestamp component with messageId
  // example: "1662363980287-168cf720-6227-4b56-a98e-c49bdc7279e9"
  if (mappedProperties.$insert_id) {
    mappedProperties.$insert_id = mappedProperties.$insert_id.slice(-36);
  }
  const unixTimestamp = toUnixTimestamp(message.timestamp);
  let properties = {
    ...message.properties,
    ...get(message, 'context.traits'),
    ...mappedProperties,
    token: destination.Config.token,
    distinct_id: message.userId || message.anonymousId,
    time: unixTimestamp,
    ...buildUtmParams(message.context?.campaign),
  };

  if (destination.Config?.identityMergeApi === 'simplified') {
    properties = {
      ...properties,
      distinct_id: message.userId || `$device:${message.anonymousId}`,
      $device_id: message.anonymousId,
      $user_id: message.userId,
    };
  }

  if (message.channel === 'web' && message.context?.userAgent) {
    const browser = getBrowserInfo(message.context.userAgent);
    properties.$browser = browser.name;
    properties.$browser_version = browser.version;
  }

  const payload = {
    event: message.event,
    properties,
  };

  return responseBuilderSimple(payload, message, EventType.TRACK, destination.Config);
};

const processTrack = (message, destination) => {
  const returnValue = [];

  const revenue = get(message, 'properties.revenue');

  if (revenue) {
    returnValue.push(processRevenueEvents(message, destination, revenue));
  }

  if (Array.isArray(destination.Config.propIncrements)) {
    const propIncrements = destination.Config.propIncrements.map((item) => item.property);
    const response = processIncrementalProperties(message, destination, propIncrements);
    if (response) {
      returnValue.push(response);
    }
  }
  returnValue.push(getEventValueForTrackEvent(message, destination));
  return returnValue;
};

const createSetOnceResponse = (message, type, destination, setOnce) => {
  const payload = {
    $set_once: setOnce,
    $token: destination.Config.token,
    $distinct_id: message.userId || message.anonymousId,
  };

  if (destination?.Config.identityMergeApi === 'simplified') {
    payload.$distinct_id = message.userId || `$device:${message.anonymousId}`;
  }

  return responseBuilderSimple(payload, message, type, destination.Config);
};

const processIdentifyEvents = async (message, type, destination) => {
  const messageClone = { ...message };
  let seggregatedTraits = {};
  const returnValue = [];
  let setOnceProperties = [];

  // making payload for set_once properties
  if (destination.Config.setOnceProperties && destination.Config.setOnceProperties.length > 0) {
    setOnceProperties = parseConfigArray(destination.Config.setOnceProperties, 'property');
    seggregatedTraits = trimTraits(
      messageClone.traits,
      messageClone.context.traits,
      setOnceProperties,
    );
    messageClone.traits = seggregatedTraits.traits;
    messageClone.context.traits = seggregatedTraits.contextTraits;
    if (Object.keys(seggregatedTraits.setOnce).length > 0) {
      returnValue.push(
        createSetOnceResponse(messageClone, type, destination, seggregatedTraits.setOnce),
      );
    }
  }

  // Creating the user profile
  // https://developer.mixpanel.com/reference/profile-set
  returnValue.push(createIdentifyResponse(messageClone, type, destination, responseBuilderSimple));

  if (
    destination.Config?.identityMergeApi !== 'simplified' &&
    messageClone.userId &&
    messageClone.anonymousId &&
    isImportAuthCredentialsAvailable(destination)
  ) {
    // If userId and anonymousId both are present and required credentials for /import
    // endpoint are available then we are creating the merging response below
    // https://developer.mixpanel.com/reference/identity-merge
    const trackPayload = {
      event: '$merge',
      properties: {
        $distinct_ids: [messageClone.userId, messageClone.anonymousId],
        token: destination.Config.token,
      },
    };
    const identifyTrackResponse = responseBuilderSimple(
      trackPayload,
      messageClone,
      'merge',
      destination.Config,
    );
    returnValue.push(identifyTrackResponse);
  }
  return returnValue;
};

const processPageOrScreenEvents = (message, type, destination) => {
  const mappedProperties = constructPayload(message, mPEventPropertiesConfigJson);
  let properties = {
    ...get(message, 'context.traits'),
    ...message.properties,
    ...mappedProperties,
    token: destination.Config.token,
    distinct_id: message.userId || message.anonymousId,
    time: toUnixTimestamp(message.timestamp),
    ...buildUtmParams(message.context?.campaign),
  };
  if (destination.Config?.identityMergeApi === 'simplified') {
    properties = {
      ...properties,
      distinct_id: message.userId || `$device:${message.anonymousId}`,
      $device_id: message.anonymousId,
      $user_id: message.userId,
    };
  }
  if (message.name) {
    properties.name = message.name;
  }
  if (message.category) {
    properties.category = message.category;
  }
  if (message.channel === 'web' && message.context?.userAgent) {
    const browser = getBrowserInfo(message.context.userAgent);
    properties.$browser = browser.name;
    properties.$browser_version = browser.version;
  }
  const eventName = type === 'page' ? 'Loaded a Page' : 'Loaded a Screen';
  const payload = {
    event: eventName,
    properties,
  };
  return responseBuilderSimple(payload, message, type, destination.Config);
};

const processAliasEvents = (message, type, destination) => {
  const aliasId = message.previousId || message.anonymousId;
  if (!aliasId) {
    throw new InstrumentationError(
      'Either `previousId` or `anonymousId` should be present in alias payload',
    );
  }

  if (aliasId === message.userId) {
    throw new InstrumentationError(
      'One of `previousId` or `anonymousId` is same as `userId`. Aborting',
    );
  }

  const payload = {
    event: '$create_alias',
    properties: {
      distinct_id: aliasId,
      alias: message.userId,
      token: destination.Config.token,
    },
  };
  return responseBuilderSimple(payload, message, type, destination.Config);
};

const processGroupEvents = (message, type, destination) => {
  const returnValue = [];
  const groupKeys = getValuesAsArrayFromConfig(destination.Config.groupKeySettings, 'groupKey');
  let groupKeyVal;
  if (groupKeys.length > 0) {
    groupKeys.forEach((groupKey) => {
      groupKeyVal =
        groupKey === 'groupId'
          ? getFieldValueFromMessage(message, 'groupId')
          : get(message.traits, groupKey);
      if (groupKeyVal && !Array.isArray(groupKeyVal)) {
        groupKeyVal = [groupKeyVal];
      }
      if (groupKeyVal) {
        const payload = {
          $token: destination.Config.token,
          $distinct_id: message.userId || message.anonymousId,
          $set: {
            [groupKey]: groupKeyVal,
          },
          $ip: get(message, 'context.ip'),
        };
        if (destination?.Config.identityMergeApi === 'simplified') {
          payload.$distinct_id = message.userId || `$device:${message.anonymousId}`;
        }
        const response = responseBuilderSimple(payload, message, type, destination.Config);
        returnValue.push(response);
        groupKeyVal.forEach((value) => {
          const groupPayload = {
            $token: destination.Config.token,
            $group_key: groupKey,
            $group_id: value,
            $set: {
              ...message.traits,
            },
          };
          const groupResponse = responseBuilderSimple(
            groupPayload,
            message,
            type,
            destination.Config,
          );
          groupResponse.endpoint =
            destination.Config.dataResidency === 'eu'
              ? `${BASE_ENDPOINT_EU}/groups/`
              : `${BASE_ENDPOINT}/groups/`;
          returnValue.push(groupResponse);
        });
      }
    });
  } else {
    throw new ConfigurationError('`Group Key Settings` is not configured in destination');
  }
  if (returnValue.length === 0) {
    throw new InstrumentationError(
      'Group Key is not present. Please ensure that the group key is included in the payload as configured in the `Group Key Settings` in destination',
    );
  }
  return returnValue;
};

const processSingleMessage = (message, destination) => {
  const clonedMessage = { ...message };
  if (clonedMessage.userId) {
    clonedMessage.userId = String(clonedMessage.userId);
  }
  if (clonedMessage.anonymousId) {
    clonedMessage.anonymousId = String(clonedMessage.anonymousId);
  }
  if (!clonedMessage.type) {
    throw new InstrumentationError('Event type is required');
  }
  switch (clonedMessage.type) {
    case EventType.TRACK:
      return processTrack(clonedMessage, destination);
    case EventType.SCREEN:
    case EventType.PAGE:
      return processPageOrScreenEvents(clonedMessage, clonedMessage.type, destination);
    case EventType.IDENTIFY:
      return processIdentifyEvents(clonedMessage, clonedMessage.type, destination);
    case EventType.ALIAS:
      if (destination.Config?.identityMergeApi === 'simplified') {
        throw new InstrumentationError('Alias call is deprecated in `Simplified ID merge`');
      }
      return processAliasEvents(message, message.type, destination);
    case EventType.GROUP:
      return processGroupEvents(clonedMessage, clonedMessage.type, destination);
    default:
      throw new InstrumentationError(`Event type '${clonedMessage.type}' is not supported`);
  }
};

const process = (event) => processSingleMessage(event.message, event.destination);

// Documentation about how Mixpanel handles the utm parameters
// Ref: https://help.mixpanel.com/hc/en-us/articles/115004613766-Default-Properties-Collected-by-Mixpanel
// Ref: https://help.mixpanel.com/hc/en-us/articles/115004561786-Track-UTM-Tags
const processRouterDest = async (inputs, reqMetadata) => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }

  const groupedEvents = groupEventsByType(inputs);
  const response = await Promise.all(
    groupedEvents.map(async (listOfEvents) => {
      let transformedPayloads = await Promise.all(
        listOfEvents.map(async (event) => {
          try {
            if (event.message.statusCode) {
              // already transformed event
              return {
                message: event.message,
                metadata: event.metadata,
                destination: event.destination,
              };
            }
            let processedEvents = await process(event);
            processedEvents = CommonUtils.toArray(processedEvents);
            return processedEvents.map((res) => ({
              message: res,
              metadata: event.metadata,
              destination: event.destination,
            }));
          } catch (error) {
            return handleRtTfSingleEventError(event, error, reqMetadata);
          }
        }),
      );

      transformedPayloads = lodash.flatMap(transformedPayloads);
      const { engageEvents, groupsEvents, trackEvents, importEvents, batchErrorRespList } =
        groupEventsByEndpoint(transformedPayloads);

      const engageRespList = batchEvents(engageEvents, ENGAGE_MAX_BATCH_SIZE, reqMetadata);
      const groupsRespList = batchEvents(groupsEvents, GROUPS_MAX_BATCH_SIZE, reqMetadata);
      const trackRespList = batchEvents(trackEvents, TRACK_MAX_BATCH_SIZE, reqMetadata);
      const importRespList = batchEvents(importEvents, IMPORT_MAX_BATCH_SIZE, reqMetadata);
      const batchSuccessRespList = [
        ...engageRespList,
        ...groupsRespList,
        ...trackRespList,
        ...importRespList,
      ];

      return [...batchSuccessRespList, ...batchErrorRespList];
    }),
  );

  // Flatten the response array containing batched events from multiple groups
  const allBatchedEvents = lodash.flatMap(response);
  return combineBatchRequestsWithSameJobIds(allBatchedEvents);
};

module.exports = { process, processRouterDest };
