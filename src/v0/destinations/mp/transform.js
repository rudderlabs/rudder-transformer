const get = require('get-value');
const { EventType } = require('../../../constants');
const {
  base64Convertor,
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getBrowserInfo,
  getEventTime,
  simpleProcessRouterDest,
  getTimeDifference,
  getValuesAsArrayFromConfig,
  isHttpStatusSuccess,
  removeUndefinedValues,
  toUnixTimestamp,
  getFieldValueFromMessage,
} = require('../../util');
const { ConfigCategory, mappingConfig, BASE_ENDPOINT, BASE_ENDPOINT_EU } = require('./config');
const { httpPOST } = require('../../../adapters/network');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const { createIdentifyResponse, isImportAuthCredentialsAvailable } = require('./util');
const { InstrumentationError, NetworkError, ConfigurationError } = require('../../util/errorTypes');
const tags = require('../../util/tags');

// ref: https://help.mixpanel.com/hc/en-us/articles/115004613766-Default-Properties-Collected-by-Mixpanel
const mPEventPropertiesConfigJson = mappingConfig[ConfigCategory.EVENT_PROPERTIES.name];

/**
 * This function is used to send the identify call to destination to create user,
 * when we need to merge the new user with anonymous user.
 * @param {*} response identify response from transformer
 * @returns
 */
const createUser = async (response) => {
  const url = response.endpoint;
  const { params } = response;
  const axiosResponse = await httpPOST(url, {}, { params });
  return processAxiosResponse(axiosResponse);
};

const setImportCredentials = (destConfig) => {
  const endpoint =
    destConfig.dataResidency === 'eu' ? `${BASE_ENDPOINT_EU}/import/` : `${BASE_ENDPOINT}/import/`;
  const headers = {};
  const params = {};
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

const responseBuilderSimple = (parameters, message, eventType, destConfig) => {
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.userId = message.userId || message.anonymousId;
  const encodedData = Buffer.from(JSON.stringify(removeUndefinedValues(parameters))).toString(
    'base64',
  );
  response.params = { data: encodedData };
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
        response.params.project_id = credentials.params?.projectId;
        break;
      }
      break;
    case 'merge':
      // eslint-disable-next-line no-case-declarations
      const credentials = setImportCredentials(destConfig);
      response.endpoint = credentials.endpoint;
      response.headers = credentials.headers;
      response.params.project_id = credentials.params?.projectId;
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
  const parameters = {
    $append: { $transactions: transactions },
    $token: destination.Config.token,
    $distinct_id: message.userId || message.anonymousId,
  };

  return responseBuilderSimple(parameters, message, 'revenue', destination.Config);
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

  const parameters = {
    event: message.event,
    properties,
  };

  return responseBuilderSimple(parameters, message, EventType.TRACK, destination.Config);
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
  let returnValue;

  // Creating the response to identify an user
  // https://developer.mixpanel.com/reference/profile-set
  returnValue = createIdentifyResponse(message, type, destination, responseBuilderSimple);

  if (
    destination.Config?.identityMergeApi !== 'simplified' &&
    message.userId &&
    message.anonymousId &&
    isImportAuthCredentialsAvailable(destination)
  ) {
    // If userId and anonymousId both are present and required credentials for /import
    // endpoint are available we are creating the merging response below
    // https://developer.mixpanel.com/reference/identity-merge
    const createUserResponse = await createUser(returnValue);
    const status = createUserResponse?.status || 400;
    if (!isHttpStatusSuccess(status)) {
      throw new NetworkError(
        'Unable to create the user',
        status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
        },
        createUserResponse.response,
      );
    }
    const trackParameters = {
      event: '$merge',
      properties: {
        $distinct_ids: [message.userId, message.anonymousId],
        token: destination.Config.token,
      },
    };
    const identifyTrackResponse = responseBuilderSimple(
      trackParameters,
      message,
      'merge',
      destination.Config,
    );
    returnValue = identifyTrackResponse;
  }

  return returnValue;
};

const processPageOrScreenEvents = (message, type, destination) => {
  const mappedProperties = constructPayload(message, mPEventPropertiesConfigJson);
  const properties = {
    ...get(message, 'context.traits'),
    ...message.properties,
    ...mappedProperties,
    token: destination.Config.token,
    distinct_id: message.userId || message.anonymousId,
    time: toUnixTimestamp(message.timestamp),
  };

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
  const parameters = {
    event: eventName,
    properties,
  };
  return responseBuilderSimple(parameters, message, type, destination.Config);
};

const processAliasEvents = (message, type, destination) => {
  if (!(message.previousId || message.anonymousId)) {
    throw new InstrumentationError(
      'Either previous id or anonymous id should be present in alias payload',
    );
  }
  const parameters = {
    event: '$create_alias',
    properties: {
      distinct_id: message.previousId || message.anonymousId,
      alias: message.userId,
      token: destination.Config.token,
    },
  };
  return responseBuilderSimple(parameters, message, type, destination.Config);
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
        const parameters = {
          $token: destination.Config.token,
          $distinct_id: message.userId || message.anonymousId,
          $set: {
            [groupKey]: groupKeyVal,
          },
        };
        const response = responseBuilderSimple(parameters, message, type, destination.Config);
        returnValue.push(response);

        groupKeyVal.forEach((value) => {
          const groupParameters = {
            $token: destination.Config.token,
            $group_key: groupKey,
            $group_id: value,
            $set: {
              ...message.traits,
            },
          };

          const groupResponse = responseBuilderSimple(
            groupParameters,
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
  return returnValue;
};

const processSingleMessage = async (message, destination) => {
  if (message.userId) {
    message.userId = String(message.userId);
  }
  if (message.anonymousId) {
    message.anonymousId = String(message.anonymousId);
  }
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  switch (message.type) {
    case EventType.TRACK:
      return processTrack(message, destination);
    case EventType.SCREEN:
    case EventType.PAGE:
      return processPageOrScreenEvents(message, message.type, destination);
    case EventType.IDENTIFY:
      return processIdentifyEvents(message, message.type, destination);
    case EventType.ALIAS:
      if (destination.Config?.identityMergeApi === 'simplified') {
        throw new InstrumentationError(
          `Event type '${EventType.ALIAS}' is not supported when 'Simplified ID merge' api is selected in webapp`,
        );
      }
      return processAliasEvents(message, message.type, destination);
    case EventType.GROUP:
      return processGroupEvents(message, message.type, destination);

    default:
      throw new InstrumentationError(`Event type ${message.type} is not supported`);
  }
};

const process = async (event) => processSingleMessage(event.message, event.destination);

// Documentation about how Mixpanel handles the utm parameters
// Ref: https://help.mixpanel.com/hc/en-us/articles/115004613766-Default-Properties-Collected-by-Mixpanel
// Ref: https://help.mixpanel.com/hc/en-us/articles/115004561786-Track-UTM-Tags
const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
