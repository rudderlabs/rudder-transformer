const lodash = require('lodash');
const get = require('get-value');
const {
  InstrumentationError,
  ConfigurationError,
  mapInBatches,
} = require('@rudderstack/integrations-lib');
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
  toUnixTimestampInMS,
  getFieldValueFromMessage,
  handleRtTfSingleEventError,
  groupEventsByType,
  parseConfigArray,
  combineBatchRequestsWithSameJobIds,
} = require('../../util');
const {
  ConfigCategory,
  mappingConfig,
  IMPORT_MAX_BATCH_SIZE,
  ENGAGE_MAX_BATCH_SIZE,
  GROUPS_MAX_BATCH_SIZE,
} = require('./config');
const {
  createIdentifyResponse,
  isImportAuthCredentialsAvailable,
  buildUtmParams,
  groupEventsByEndpoint,
  batchEvents,
  trimTraits,
  generatePageOrScreenCustomEventName,
  recordBatchSizeMetrics,
  getBaseEndpoint,
  validateMixpanelPayloadLimits,
} = require('./util');
const { CommonUtils } = require('../../../util/common');

// ref: https://help.mixpanel.com/hc/en-us/articles/115004613766-Default-Properties-Collected-by-Mixpanel
const mPEventPropertiesConfigJson = mappingConfig[ConfigCategory.EVENT_PROPERTIES.name];

const setImportCredentials = (destConfig) => {
  const endpointPath = 'import';
  const endpointDetails = {
    endpoint: `${getBaseEndpoint(destConfig)}/${endpointPath}/`,
    path: endpointPath,
  };
  const params = {
    strict: destConfig.strictMode ? 1 : 0,
  };
  const { serviceAccountUserName, serviceAccountSecret, projectId, token } = destConfig;
  let credentials;
  if (token) {
    credentials = `${token}:`;
  } else if (serviceAccountUserName && serviceAccountSecret && projectId) {
    credentials = `${serviceAccountUserName}:${serviceAccountSecret}`;
    params.projectId = projectId;
  }
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${base64Convertor(credentials)}`,
  };
  return { endpointDetails, headers, params };
};

const responseBuilderSimple = (payload, message, eventType, destConfig) => {
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.userId = message.userId || message.anonymousId;
  response.body.JSON_ARRAY = { batch: JSON.stringify([removeUndefinedValues(payload)]) };
  const duration = getTimeDifference(message.timestamp);

  const setCredentials = () => {
    const { endpointDetails, headers, params } = setImportCredentials(destConfig);
    response.endpoint = endpointDetails.endpoint;
    response.endpointPath = endpointDetails.path;
    response.headers = headers;
    response.params = {
      project_id: params?.projectId,
      strict: params.strict,
    };
  };

  switch (eventType) {
    case EventType.ALIAS:
    case EventType.TRACK:
    case EventType.SCREEN:
    case EventType.PAGE: {
      if (duration.years > 5) {
        throw new InstrumentationError('Event timestamp should be within last 5 years');
      }
      setCredentials();
      break;
    }
    case 'merge': {
      setCredentials();
      break;
    }
    default:
      response.endpointPath = 'engage';
      response.endpoint = `${getBaseEndpoint(destConfig)}/${response.endpointPath}/`;
      response.headers = {
        'Content-Type': 'application/json',
      };
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
  // messageId is there, it should be of type string
  if (message.messageId && typeof message.messageId !== 'string') {
    throw new InstrumentationError('messageId should be of type string');
  }

  const mappedProperties = constructPayload(message, mPEventPropertiesConfigJson);
  // SDKs send timestamp in messageId
  // example: "1662363980287-168cf720-6227-4b56-a98e-c49bdc7279e9"
  // https://developer.mixpanel.com/reference/track-event#body-params
  if (mappedProperties.$insert_id) {
    mappedProperties.$insert_id = mappedProperties.$insert_id.slice(-36);
  }

  const unixTimestamp = toUnixTimestampInMS(message.timestamp || message.originalTimestamp);

  const traits = destination.Config?.dropTraitsInTrackEvent ? {} : { ...message?.context?.traits };

  let properties = {
    ...message.properties,
    ...traits,
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
  validateMixpanelPayloadLimits(properties);
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

const buildUserProfileResponse = (userProfileParams) => {
  const { message, type, destination, properties, operation } = userProfileParams;
  const payload = {
    [operation]: properties,
    $token: destination.Config.token,
    $distinct_id: message.userId || message.anonymousId,
  };

  if (destination?.Config.identityMergeApi === 'simplified') {
    payload.$distinct_id = message.userId || `$device:${message.anonymousId}`;
  }

  return responseBuilderSimple(payload, message, type, destination.Config);
};

const handleUserProfileOperation = (userProfileParams) => {
  const { message, type, destination, propertiesConfig, operation } = userProfileParams;

  if (!propertiesConfig || propertiesConfig.length === 0) {
    return null;
  }
  const operationProperties = parseConfigArray(propertiesConfig, 'property');
  const segregatedTraits = trimTraits(message.traits, message.context.traits, operationProperties);

  message.traits = segregatedTraits.traits;
  message.context.traits = segregatedTraits.contextTraits;

  const finalOperationProperties =
    operation === '$union'
      ? Object.fromEntries(
          Object.entries(segregatedTraits.operationTransformedProperties).map(([key, value]) => [
            key,
            CommonUtils.toArray(value),
          ]),
        )
      : segregatedTraits.operationTransformedProperties;

  if (Object.keys(finalOperationProperties).length > 0) {
    return buildUserProfileResponse({
      message,
      type,
      destination,
      properties: finalOperationProperties,
      operation,
    });
  }
  return null;
};

const processIdentifyEvents = async (message, type, destination) => {
  const messageClone = { ...message };
  const returnValue = [];

  // Set Once Properties
  const setOnceResponse = handleUserProfileOperation({
    message: messageClone,
    type,
    destination,
    propertiesConfig: destination.Config?.setOnceProperties,
    operation: '$set_once',
  });
  if (setOnceResponse) returnValue.push(setOnceResponse);

  // Union Properties
  const unionResponse = handleUserProfileOperation({
    message: messageClone,
    type,
    destination,
    propertiesConfig: destination.Config?.unionProperties,
    operation: '$union',
  });
  if (unionResponse) returnValue.push(unionResponse);

  // Append Properties
  const appendResponse = handleUserProfileOperation({
    message: messageClone,
    type,
    destination,
    propertiesConfig: destination.Config?.appendProperties,
    operation: '$append',
  });
  if (appendResponse) returnValue.push(appendResponse);

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
  const {
    token,
    identityMergeApi,
    useUserDefinedPageEventName,
    userDefinedPageEventTemplate,
    useUserDefinedScreenEventName,
    userDefinedScreenEventTemplate,
  } = destination.Config;
  const mappedProperties = constructPayload(message, mPEventPropertiesConfigJson);
  let properties = {
    ...get(message, 'context.traits'),
    ...message.properties,
    ...mappedProperties,
    token,
    distinct_id: message.userId || message.anonymousId,
    time: toUnixTimestampInMS(message.timestamp || message.originalTimestamp),
    ...buildUtmParams(message.context?.campaign),
  };
  if (identityMergeApi === 'simplified') {
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

  let eventName;
  if (type === 'page') {
    eventName = useUserDefinedPageEventName
      ? generatePageOrScreenCustomEventName(message, userDefinedPageEventTemplate)
      : 'Loaded a Page';
  } else {
    eventName = useUserDefinedScreenEventName
      ? generatePageOrScreenCustomEventName(message, userDefinedScreenEventTemplate)
      : 'Loaded a Screen';
  }

  validateMixpanelPayloadLimits(properties);
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

  const properties = {
    distinct_id: aliasId,
    alias: message.userId,
    token: destination.Config.token,
  };

  const payload = {
    event: '$create_alias',
    properties,
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
        const setPayload = {
          [groupKey]: groupKeyVal,
        };

        const payload = {
          $token: destination.Config.token,
          $distinct_id: message.userId || message.anonymousId,
          $set: setPayload,
          $ip: get(message, 'context.ip') || message.request_ip,
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
          groupResponse.endpointPath = 'groups';
          groupResponse.endpoint = `${getBaseEndpoint(destination?.Config)}/${groupResponse.endpointPath}/`;
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
        throw new InstrumentationError(
          'The use of the alias call in the context of the `Simplified ID merge` feature is not supported anymore.',
        );
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
  const batchSize = {
    engage: 0,
    groups: 0,
    import: 0,
  };

  const groupedEvents = groupEventsByType(inputs);
  const response = await mapInBatches(
    groupedEvents,
    async (listOfEvents) => {
      let transformedPayloads = await mapInBatches(
        listOfEvents,
        async (event) => {
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
        },
        { sequentialProcessing: false }, // concurrent processing
      );

      transformedPayloads = lodash.flatMap(transformedPayloads);
      const { engageEvents, groupsEvents, importEvents, batchErrorRespList } =
        groupEventsByEndpoint(transformedPayloads);

      const engageRespList = batchEvents(engageEvents, ENGAGE_MAX_BATCH_SIZE, reqMetadata);
      const groupsRespList = batchEvents(groupsEvents, GROUPS_MAX_BATCH_SIZE, reqMetadata);
      const importRespList = batchEvents(importEvents, IMPORT_MAX_BATCH_SIZE, reqMetadata);
      const batchSuccessRespList = [...engageRespList, ...groupsRespList, ...importRespList];

      batchSize.engage += engageRespList.length;
      batchSize.groups += groupsRespList.length;
      batchSize.import += importRespList.length;

      return [...batchSuccessRespList, ...batchErrorRespList];
    },
    { sequentialProcessing: false }, // concurrent processing
  );

  // Flatten the response array containing batched events from multiple groups
  const allBatchedEvents = lodash.flatMap(response);

  const { destination } = allBatchedEvents[0];
  recordBatchSizeMetrics(batchSize, destination.ID);
  return combineBatchRequestsWithSameJobIds(allBatchedEvents);
};

module.exports = { process, processRouterDest };
