const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  CustomError,
  defaultPostRequestConfig,
  constructPayload,
  defaultRequestConfig,
  extractCustomFields,
  isEmptyObject,
  flattenJson,
  getDestinationExternalID,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
  getFieldValueFromMessage
} = require("../../util");
const {
  ENDPOINT,
  trackCommonConfig,
  mappingConfig,
  ConfigCategory
} = require("./config");
const {
  msUnixTimestamp,
  isReservedEventName,
  GA4_RESERVED_PARAMETER_EXCLUSION,
  removeReservedParameterPrefixNames,
  GA4_RESERVED_USER_PROPERTY_EXCLUSION,
  removeReservedUserPropertyPrefixNames,
  isReservedWebCustomEventName,
  isReservedWebCustomPrefixName,
  getItemList,
  getGA4ExclusionList,
  getItem
} = require("./utils");

function trackResponseBuilder(message, { Config }) {
  let event = get(message, "event");
  if (!event) {
    throw new CustomError("Event name is required", 400);
  }

  // trim and replace spaces with "_"
  event = event.trim().replace(/\s+/g, "_");

  // reserved event names are not allowed
  if (isReservedEventName(event)) {
    throw new CustomError(
      "[Google Analytics 4] track:: Reserved event names are not allowed",
      400
    );
  }

  // get common top level rawPayload
  let rawPayload = constructPayload(message, trackCommonConfig);
  if (rawPayload.timestamp_micros) {
    rawPayload.timestamp_micros = msUnixTimestamp(rawPayload.timestamp_micros);
  }

  switch (Config.typesOfClient) {
    case "gtag":
      // gtag.js uses client_id
      // GA4 uses it as an identifier to distinguish site visitors.
      rawPayload.client_id =
        getDestinationExternalID(message, "ga4ClientId") ||
        get(message, "anonymousId") ||
        get(message, "messageId");
      if (!isDefinedAndNotNull(rawPayload.client_id)) {
        throw new CustomError(
          "ga4ClientId, anonymousId or messageId must be provided",
          400
        );
      }
      break;
    case "firebase":
      // firebase uses app_instance_id
      rawPayload.app_instance_id = getDestinationExternalID(
        message,
        "ga4AppInstanceId"
      );
      if (!isDefinedAndNotNull(rawPayload.app_instance_id)) {
        throw new CustomError(
          "ga4AppInstanceId must be provided under externalId",
          400
        );
      }
      break;
    default:
      throw CustomError("GA4: Invalid type of client", 400);
  }

  let payload = {};
  if (message.type === "track" && ConfigCategory[`${event.toUpperCase()}`]) {
    // GA4 standard events
    // get event specific parameters

    payload.name = ConfigCategory[`${event.toUpperCase()}`].event;

    if (mappingConfig[ConfigCategory[`${event.toUpperCase()}`].name]) {
      payload.params = constructPayload(
        message,
        mappingConfig[ConfigCategory[`${event.toUpperCase()}`].name]
      );
    }

    const { itemList } = ConfigCategory[`${event.toUpperCase()}`];
    const { item } = ConfigCategory[`${event.toUpperCase()}`];

    if (item === "YES") {
      payload.params.items = getItem(message, true);
    } else if (item === "NO") {
      payload.params.items = getItem(message, false);
    } else if (itemList === "YES") {
      payload.params.items = getItemList(message, true);
    } else if (itemList === "NO") {
      payload.params.items = getItemList(message, false);
    }

    if (payload.name === "select_item" || payload.name === "view_item") {
      let ITEM_EXCLUSION_LIST = getGA4ExclusionList(
        mappingConfig[ConfigCategory[`${event.toUpperCase()}`].name]
      );
      ITEM_EXCLUSION_LIST = ITEM_EXCLUSION_LIST.concat(
        getGA4ExclusionList(mappingConfig[ConfigCategory.ITEM.name])
      );
      payload.params = extractCustomFields(
        message,
        payload.params,
        ["properties"],
        ITEM_EXCLUSION_LIST
      );
    } else {
      payload.params = extractCustomFields(
        message,
        payload.params,
        ["properties"],
        getGA4ExclusionList(
          mappingConfig[ConfigCategory[`${event.toUpperCase()}`].name]
        )
      );
    }
  } else if (message.type === "identify") {
    payload.name = event;
    const traits = getFieldValueFromMessage(message, "traits");

    // exclusion list for login/signup and generate_lead
    const GA4_IDENTIFY_EXCLUSION = [];
    GA4_IDENTIFY_EXCLUSION.push(`${Config.signupTrait}`);
    GA4_IDENTIFY_EXCLUSION.push(`${Config.loginSignupMethod}`);
    GA4_IDENTIFY_EXCLUSION.push(`${Config.generateLeadValueTrait}`);
    GA4_IDENTIFY_EXCLUSION.push(`${Config.generateLeadCurrencyTrait}`);

    switch (event) {
      case "login":
      case "sign_up": {
        const method = traits[`${Config.loginSignupMethod}`];

        if (method) {
          payload.params = { method }; // method: "Google"
        }

        break;
      }
      case "generate_lead": {
        let parameter = {};
        parameter.value = parseFloat(
          traits[`${Config.generateLeadValueTrait}`]
        );
        parameter.currency = traits[`${Config.generateLeadCurrencyTrait}`];
        parameter = removeUndefinedAndNullValues(parameter);

        if (!isDefinedAndNotNull(parameter.value)) {
          throw new CustomError(
            `[GA4] Identify:: ${Config.generateLeadValueTrait} is a required field in traits`,
            400
          );
        }

        if (!isDefinedAndNotNull(parameter.currency)) {
          parameter.currency = "USD";
        }

        payload.params = parameter;
        break;
      }
      default:
        break;
    }

    let customParameters = {};
    customParameters = extractCustomFields(
      message,
      customParameters,
      ["traits", "context.traits"],
      GA4_IDENTIFY_EXCLUSION
    );

    if (customParameters) {
      payload.params = { ...payload.params, ...customParameters };
    }
  } else if (message.type === "group") {
    // group event
    payload.name = event;
    payload.params = constructPayload(
      message,
      mappingConfig[ConfigCategory.GROUP.name]
    );
    payload.params = extractCustomFields(
      message,
      payload.params,
      ["traits", "context.traits"],
      getGA4ExclusionList(mappingConfig[ConfigCategory.GROUP.name])
    );
  } else {
    // track
    // custom events category
    // Event names are case sensitive
    if (isReservedWebCustomEventName(event)) {
      throw new CustomError(
        "[Google Analytics 4] track:: Reserved custom event names are not allowed",
        400
      );
    }

    if (isReservedWebCustomPrefixName(event)) {
      throw new CustomError(
        "[Google Analytics 4] track:: Reserved custom prefix names are not allowed",
        400
      );
    }

    payload.name = event;

    // all extra parameters passed is incorporated inside params
    let customParameters = {};
    customParameters = extractCustomFields(
      message,
      customParameters,
      ["properties"],
      GA4_RESERVED_PARAMETER_EXCLUSION
    );
    if (!isEmptyObject(customParameters)) {
      customParameters = flattenJson(customParameters);
      payload.params = {
        ...payload.params,
        ...customParameters
      };
    }
  }

  removeReservedParameterPrefixNames(payload.params);

  if (payload.params) {
    payload.params = removeUndefinedAndNullValues(payload.params);
  }

  if (isEmptyObject(payload.params)) {
    delete payload.params;
  }

  // take GA4 user properties
  let userProperties = {};
  userProperties = extractCustomFields(
    message,
    userProperties,
    ["properties.user_properties"],
    GA4_RESERVED_USER_PROPERTY_EXCLUSION
  );
  if (!isEmptyObject(userProperties)) {
    userProperties = flattenJson(userProperties);
    rawPayload.user_properties = userProperties;
  }

  removeReservedUserPropertyPrefixNames(rawPayload.user_properties);

  payload = removeUndefinedAndNullValues(payload);
  rawPayload = { ...rawPayload, events: [payload] };

  // build response
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = ENDPOINT;
  response.headers = {
    HOST: "www.google-analytics.com",
    "Content-Type": "application/json"
  };
  response.params = {
    api_secret: Config.apiSecret
  };

  // setting response params as per client type
  switch (Config.typesOfClient) {
    case "gtag":
      response.params.measurement_id = Config.measurementId;
      break;
    case "firebase":
      response.params.firebase_app_id = Config.firebaseAppId;
      break;
    default:
      break;
  }

  response.body.JSON = rawPayload;
  return response;
}

function process(event) {
  const { message, destination } = event;
  const { Config } = destination;

  if (!Config.typesOfClient) {
    throw new CustomError("Client type not found. Aborting ", 400);
  }
  if (!Config.apiSecret) {
    throw new CustomError("API Secret not found. Aborting ", 400);
  }
  if (Config.typesOfClient === "gtag" && !Config.measurementId) {
    throw new CustomError("measurementId must be provided. Aborting", 400);
  }
  if (Config.typesOfClient === "firebase" && !Config.firebaseAppId) {
    throw new CustomError("firebaseAppId must be provided. Aborting", 400);
  }

  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = [];
      // 1. send login/signup event based on config
      if (Config.sendLoginSignup) {
        const traits = getFieldValueFromMessage(message, "traits");
        const firstLogin = traits[`${Config.signupTrait}`];
        if (!isDefinedAndNotNull(firstLogin)) {
          throw new CustomError(
            `[GA4] Idenitfy:: ${Config.signupTrait} is a required field in traits`,
            400
          );
        }
        if (firstLogin) {
          message.event = "sign_up";
        } else {
          message.event = "login";
        }

        response.push(trackResponseBuilder(message, destination));
      }

      // 2. send generate_lead based on config
      if (Config.generateLead) {
        message.event = "generate_lead";
        response.push(trackResponseBuilder(message, destination));
      }

      if (response.length === 0) {
        throw new CustomError(
          "[GA4] Idenitfy:: Server side identify is not enabled",
          400
        );
      }

      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    case EventType.PAGE:
      // GA4 custom event (page_view) is fired for page
      message.event = "page_view";
      response = trackResponseBuilder(message, destination);
      break;
    case EventType.GROUP:
      // GA4 standard event (join_group) is fired for group
      message.event = "join_group";
      response = trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
}

module.exports = { process };
