const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  CustomError,
  base64Convertor,
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getBrowserInfo,
  getErrorRespEvents,
  getEventTime,
  getSuccessRespEvents,
  getTimeDifference,
  getValuesAsArrayFromConfig,
  isHttpStatusSuccess,
  removeUndefinedValues,
  toUnixTimestamp
} = require("../../util");
const {
  ConfigCategory,
  mappingConfig,
  BASE_ENDPOINT,
  BASE_ENDPOINT_EU
} = require("./config");
const { httpPOST } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const {
  createIdentifyResponse,
  isImportAuthCredentialsAvailable
} = require("./util");
// ref: https://help.mixpanel.com/hc/en-us/articles/115004613766-Default-Properties-Collected-by-Mixpanel
const mPEventPropertiesConfigJson =
  mappingConfig[ConfigCategory.EVENT_PROPERTIES.name];

/**
 * This function is used to send the identify call to destination to create user,
 * when we need to merge the new user with anonymous user.
 * @param {*} response identify response from transformer
 * @returns
 */
const createUser = async response => {
  const url = response.endpoint;
  const { params } = response;
  const axiosResponse = await httpPOST(url, {}, { params });
  const processedResponse = processAxiosResponse(axiosResponse);
  if (processedResponse.response === 1) {
    return processedResponse.status;
  }
  return processedResponse.status || 400;
};

const setImportCredentials = destConfig => {
  const endpoint =
    destConfig.dataResidency === "eu"
      ? `${BASE_ENDPOINT_EU}/import/`
      : `${BASE_ENDPOINT}/import/`;
  const headers = {};
  const params = {};
  const {
    apiSecret,
    serviceAccountUserName,
    serviceAccountSecret,
    projectId
  } = destConfig;
  if (apiSecret) {
    headers.Authorization = `Basic ${base64Convertor(`${apiSecret}:`)}`;
  } else if (serviceAccountUserName && serviceAccountSecret && projectId) {
    headers.Authorization = `Basic ${base64Convertor(
      `${serviceAccountUserName}:${serviceAccountSecret}`
    )}`;
    params.projectId = projectId;
  } else {
    throw new CustomError(
      "Event timestamp is older than 5 days and no apisecret or service account credentials (i.e. username, secret and projectId) is provided in destination config.",
      400
    );
  }
  return { endpoint, headers, params };
};

const responseBuilderSimple = (parameters, message, eventType, destConfig) => {
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.userId = message.anonymousId || message.userId;
  const encodedData = Buffer.from(
    JSON.stringify(removeUndefinedValues(parameters))
  ).toString("base64");
  response.params = { data: encodedData };
  const {
    apiSecret,
    serviceAccountUserName,
    serviceAccountSecret,
    projectId
  } = destConfig;
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
          destConfig.dataResidency === "eu"
            ? `${BASE_ENDPOINT_EU}/track/`
            : `${BASE_ENDPOINT}/track/`;
        response.headers = {};
      } else if (duration.years > 5) {
        throw new CustomError(
          "Event timestamp should be within last 5 years",
          400
        );
      } else {
        const credentials = setImportCredentials(destConfig);
        response.endpoint = credentials.endpoint;
        response.headers = credentials.headers;
        response.params.project_id = credentials.params?.projectId;
        break;
      }
      break;
    case "merge":
      // eslint-disable-next-line no-case-declarations
      const credentials = setImportCredentials(destConfig);
      response.endpoint = credentials.endpoint;
      response.headers = credentials.headers;
      response.params.project_id = credentials.params?.projectId;
      break;
    default:
      response.endpoint =
        destConfig.dataResidency === "eu"
          ? `${BASE_ENDPOINT_EU}/engage/`
          : `${BASE_ENDPOINT}/engage/`;
      response.headers = {};
  }
  return response;
};

const processRevenueEvents = (message, destination, revenueValue) => {
  const transactions = {
    $time: getEventTime(message),
    $amount: revenueValue
  };
  const parameters = {
    $append: { $transactions: transactions },
    $token: destination.Config.token,
    $distinct_id: message.userId || message.anonymousId
  };

  return responseBuilderSimple(
    parameters,
    message,
    "revenue",
    destination.Config
  );
};

const getEventValueForTrackEvent = (message, destination) => {
  const mappedProperties = constructPayload(
    message,
    mPEventPropertiesConfigJson
  );
  // This is to conform with SDKs sending timestamp component with messageId
  // example: "1662363980287-168cf720-6227-4b56-a98e-c49bdc7279e9"
  if (mappedProperties.$insert_id) {
    mappedProperties.$insert_id = mappedProperties.$insert_id.slice(-36);
  }
  const unixTimestamp = toUnixTimestamp(message.timestamp);
  const properties = {
    ...message.properties,
    ...get(message, "context.traits"),
    ...mappedProperties,
    token: destination.Config.token,
    distinct_id: message.userId || message.anonymousId,
    time: unixTimestamp
  };

  if (message.channel === "web" && message.context?.userAgent) {
    const browser = getBrowserInfo(message.context.userAgent);
    properties.$browser = browser.name;
    properties.$browser_version = browser.version;
  }

  const parameters = {
    event: message.event,
    properties
  };

  return responseBuilderSimple(
    parameters,
    message,
    EventType.TRACK,
    destination.Config
  );
};

const processTrack = (message, destination) => {
  const returnValue = [];

  const revenue = get(message, "properties.revenue");

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
  returnValue = createIdentifyResponse(
    message,
    type,
    destination,
    responseBuilderSimple
  );

  // If userId and anonymousId both are present and required credentials for /import
  // endpoint are available we are creating the merging response below
  // https://developer.mixpanel.com/reference/identity-merge
  if (
    message.userId &&
    message.anonymousId &&
    isImportAuthCredentialsAvailable(destination)
  ) {
    const responseStatus = await createUser(returnValue);
    if (!isHttpStatusSuccess(responseStatus)) {
      throw new CustomError("Unable to create the user.", responseStatus);
    }
    const trackParameters = {
      event: "$merge",
      properties: {
        $distinct_ids: [message.userId, message.anonymousId],
        token: destination.Config.token
      }
    };
    const identifyTrackResponse = responseBuilderSimple(
      trackParameters,
      message,
      "merge",
      destination.Config
    );
    returnValue = identifyTrackResponse;
  }

  return returnValue;
};

const processPageOrScreenEvents = (message, type, destination) => {
  const mappedProperties = constructPayload(
    message,
    mPEventPropertiesConfigJson
  );
  const properties = {
    ...get(message, "context.traits"),
    ...message.properties,
    ...mappedProperties,
    token: destination.Config.token,
    distinct_id: message.userId || message.anonymousId,
    time: toUnixTimestamp(message.timestamp)
  };

  if (message.name) {
    properties.name = message.name;
  }
  if (message.category) {
    properties.category = message.category;
  }
  if (message.channel === "web" && message.context?.userAgent) {
    const browser = getBrowserInfo(message.context.userAgent);
    properties.$browser = browser.name;
    properties.$browser_version = browser.version;
  }

  const eventName = type === "page" ? "Loaded a Page" : "Loaded a Screen";
  const parameters = {
    event: eventName,
    properties
  };
  return responseBuilderSimple(parameters, message, type, destination.Config);
};

const processAliasEvents = (message, type, destination) => {
  if (!(message.previousId || message.anonymousId)) {
    throw new CustomError(
      "Either previous id or anonymous id should be present in alias payload",
      400
    );
  }
  const parameters = {
    event: "$create_alias",
    properties: {
      distinct_id: message.previousId || message.anonymousId,
      alias: message.userId,
      token: destination.Config.token
    }
  };
  return responseBuilderSimple(parameters, message, type, destination.Config);
};

const processGroupEvents = (message, type, destination) => {
  const returnValue = [];
  const groupKeys = getValuesAsArrayFromConfig(
    destination.Config.groupKeySettings,
    "groupKey"
  );
  let groupKeyVal;
  if (groupKeys.length > 0) {
    groupKeys.forEach(groupKey => {
      groupKeyVal = get(message.traits, groupKey);
      if (groupKeyVal) {
        const parameters = {
          $token: destination.Config.token,
          $distinct_id: message.userId || message.anonymousId,
          $set: {
            [groupKey]: [get(message.traits, groupKey)]
          }
        };
        const response = responseBuilderSimple(
          parameters,
          message,
          type,
          destination.Config
        );
        returnValue.push(response);

        const groupParameters = {
          $token: destination.Config.token,
          $group_key: groupKey,
          $group_id: get(message.traits, groupKey),
          $set: {
            ...message.traits
          }
        };

        const groupResponse = responseBuilderSimple(
          groupParameters,
          message,
          type,
          destination.Config
        );

        groupResponse.endpoint =
          destination.Config.dataResidency === "eu"
            ? `${BASE_ENDPOINT_EU}/groups/`
            : `${BASE_ENDPOINT}/groups/`;

        returnValue.push(groupResponse);
      }
    });
  } else {
    throw new CustomError(
      "[MP] Group:: Group Key Settings is not configured",
      400
    );
  }
  return returnValue;
};

const processSingleMessage = async (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
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
      return processAliasEvents(message, message.type, destination);
    case EventType.GROUP:
      return processGroupEvents(message, message.type, destination);

    default:
      throw new CustomError("message type not supported", 400);
  }
};

const process = async event => {
  return processSingleMessage(event.message, event.destination);
};

// Documentation about how Mixpanel handles the utm parameters
// Ref: https://help.mixpanel.com/hc/en-us/articles/115004613766-Default-Properties-Collected-by-Mixpanel
// Ref: https://help.mixpanel.com/hc/en-us/articles/115004561786-Track-UTM-Tags
const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
