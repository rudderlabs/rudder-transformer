const get = require('get-value');
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
  batchMultiplexedEvents,
  getSuccessRespEvents,
  defaultBatchRequestConfig,
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
  combineBatchRequestsWithSameJobIds,
} = require('./util');
const { InstrumentationError, ConfigurationError } = require('../../util/errorTypes');
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
      'Event timestamp is older than 5 days and no apisecret or service account credentials (i.e. username, secret and projectId) is provided in destination config',
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
  returnValue.push(getEventValueForTrackEvent(message, destination));
  return returnValue;
};

const processIdentifyEvents = async (message, type, destination) => {
  const returnValue = [];

  // Creating the user profile
  // https://developer.mixpanel.com/reference/profile-set
  returnValue.push(createIdentifyResponse(message, type, destination, responseBuilderSimple));

  if (
    destination.Config?.identityMergeApi !== 'simplified' &&
    message.userId &&
    message.anonymousId &&
    isImportAuthCredentialsAvailable(destination)
  ) {
    // If userId and anonymousId both are present and required credentials for /import
    // endpoint are available then we are creating the merging response below
    // https://developer.mixpanel.com/reference/identity-merge
    const trackPayload = {
      event: '$merge',
      properties: {
        $distinct_ids: [message.userId, message.anonymousId],
        token: destination.Config.token,
      },
    };
    const identifyTrackResponse = responseBuilderSimple(
      trackPayload,
      message,
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
      'Either previous id or anonymous id should be present in alias payload',
    );
  }

  if (aliasId === message.userId) {
    throw new InstrumentationError('One of previousId/anonymousId is same as userId');
  }

  const payload = {
    event: '$create_alias',
    properties: {
      distinct_id: message.userId,
      alias: aliasId,
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
    throw new ConfigurationError('Group Key Settings is not configured');
  }
  if (returnValue.length === 0) {
    throw new InstrumentationError('Group Key is not present. Aborting message');
  }
  return returnValue;
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
  const batchResponseList = [];
  const batchedEvents = batchMultiplexedEvents(successRespList, maxBatchSize);
  batchedEvents.forEach((batch) => {
    const batchedRequest = generateBatchedPayloadForArray(batch.events);
    batchResponseList.push(
      getSuccessRespEvents(batchedRequest, batch.metadata, batch.destination, true),
    );
  });
  return batchResponseList;
};

const processSingleMessage = async (message, destination) => {
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
        throw new InstrumentationError(
          `Event type '${EventType.ALIAS}' is not supported when 'Simplified ID merge' api is selected in webapp`,
        );
      }
      return processAliasEvents(message, message.type, destination);
    case EventType.GROUP:
      return processGroupEvents(clonedMessage, clonedMessage.type, destination);
    default:
      throw new InstrumentationError(`Event type ${clonedMessage.type} is not supported`);
  }
};

const process = async (event) => processSingleMessage(event.message, event.destination);

const processEvents = async (inputs, reqMetadata) =>
  await Promise.all(
    inputs.map(async (event) => {
      try {
        if (event.message.statusCode) {
          // already transformed event
          return { output: event };
        }

        // if not transformed
        return {
          output: {
            message: await process(event),
            metadata: event.metadata,
            destination: event.destination,
          },
        };
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
        return { error: errRespEvent };
      }
    }),
  );

const processAndChunkEvents = async (inputs, reqMetadata) => {
  const processedEvents = await processEvents(inputs, reqMetadata);
  const engageEventChunks = [];
  const groupsEventChunks = [];
  const trackEventChunks = [];
  const importEventChunks = [];
  const batchErrorRespList = [];
  processedEvents.forEach((result) => {
    if (result.output) {
      const event = result.output;
      const { destination, metadata } = event;
      let { message } = event;
      message = CommonUtils.toArray(message);
      message.forEach((msg) => {
        // eslint-disable-next-line default-case
        switch (true) {
          case msg.endpoint.includes('engage'):
            engageEventChunks.push({ message: msg, destination, metadata });
            break;
          case msg.endpoint.includes('groups'):
            groupsEventChunks.push({ message: msg, destination, metadata });
            break;
          case msg.endpoint.includes('track'):
            trackEventChunks.push({ message: msg, destination, metadata });
            break;
          case msg.endpoint.includes('import'):
            importEventChunks.push({ message: msg, destination, metadata });
            break;
        }
      });
    } else if (result.error) {
      batchErrorRespList.push(result.error);
    }
  });
  return {
    engageEventChunks,
    groupsEventChunks,
    trackEventChunks,
    importEventChunks,
    batchErrorRespList,
  };
};

// Documentation about how Mixpanel handles the utm parameters
// Ref: https://help.mixpanel.com/hc/en-us/articles/115004613766-Default-Properties-Collected-by-Mixpanel
// Ref: https://help.mixpanel.com/hc/en-us/articles/115004561786-Track-UTM-Tags
const processRouterDest = async (inputs, reqMetadata) => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }

  const {
    engageEventChunks,
    groupsEventChunks,
    trackEventChunks,
    importEventChunks,
    batchErrorRespList,
  } = await processAndChunkEvents(inputs, reqMetadata);

  const engageRespList = batchEvents(engageEventChunks, ENGAGE_MAX_BATCH_SIZE);
  const groupsRespList = batchEvents(groupsEventChunks, GROUPS_MAX_BATCH_SIZE);
  const trackRespList = batchEvents(trackEventChunks, TRACK_MAX_BATCH_SIZE);
  const importRespList = batchEvents(importEventChunks, IMPORT_MAX_BATCH_SIZE);

  let batchSuccessRespList = [
    ...engageRespList,
    ...groupsRespList,
    ...trackRespList,
    ...importRespList,
  ];
  batchSuccessRespList = combineBatchRequestsWithSameJobIds(batchSuccessRespList);

  return [...batchSuccessRespList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
