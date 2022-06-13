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

const responseBuilder = (message, { Config }) => {
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
  const eventConfig = ConfigCategory[`${event.toUpperCase()}`];
  if (message.type === "track" && eventConfig) {
    // GA4 standard events
    // get event specific parameters

    payload.name = eventConfig.event;
    payload.params = constructPayload(message, mappingConfig[eventConfig.name]);

    const { itemList, item } = eventConfig;
    if (item) {
      // item
      payload.params.items = getItem(message, item === "YES");
    } else if (itemList) {
      // itemList
      payload.params.items = getItemList(message, itemList === "YES");
    }

    // for select_item and view_item event we take custom properties from properties
    // excluding items/product properties
    if (payload.name === "select_item" || payload.name === "view_item") {
      // exclude event properties
      let ITEM_EXCLUSION_LIST = getGA4ExclusionList(
        mappingConfig[eventConfig.name]
      );
      // exclude items/product properties
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
        getGA4ExclusionList(mappingConfig[eventConfig.name])
      );
    }
  } else if (message.type === "identify") {
    payload.name = event;
    const traits = getFieldValueFromMessage(message, "traits");

    // exclusion list for login/signup and generate_lead
    // identify has newOrExistingUserTrait, loginSignupMethod
    // generateLeadValueTrait, generateLeadCurrencyTrait property
    const GA4_IDENTIFY_EXCLUSION = [
      `${Config.newOrExistingUserTrait}`,
      `${Config.loginSignupMethod}`,
      `${Config.generateLeadValueTrait}`,
      `${Config.generateLeadCurrencyTrait}`
    ];

    switch (event) {
      case "login":
      case "sign_up": {
        // taking method property from traits
        // depending on loginSignupMethod key defined in Config
        const method = traits[`${Config.loginSignupMethod}`];

        if (method) {
          // params for login and sign_up event
          payload.params = { method }; // method: "Google"
        }
        break;
      }
      case "generate_lead": {
        let parameter = {};
        // taking value parameter
        // depending on generateLeadValueTrait key defined in Config
        parameter.value = traits[`${Config.generateLeadValueTrait}`];
        // taking currency paramter
        // depending on generateLeadCurrencyTrait key defined in Config
        parameter.currency = traits[`${Config.generateLeadCurrencyTrait}`];
        parameter = removeUndefinedAndNullValues(parameter);

        if (!isDefinedAndNotNull(parameter.value)) {
          throw new CustomError(
            `[GA4] Identify:: ${Config.generateLeadValueTrait} is a required field in traits for 'generate_lead' event`,
            400
          );
        }

        if (!isDefinedAndNotNull(parameter.currency)) {
          parameter.currency = "USD";
        }

        parameter.value = parseFloat(parameter.value);
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
};

const process = event => {
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
      if (Config.enableServerSideIdentify) {
        response = [];
        // 1. send login/signup event based on config
        // Convert identify event to Login or Signup event
        const traits = getFieldValueFromMessage(message, "traits");
        // newOrExistingUserTrait can be 'firstLogin' keyword - true/false
        const firstLogin = traits[`${Config.newOrExistingUserTrait}`];
        if (!isDefinedAndNotNull(firstLogin)) {
          throw new CustomError(
            `[GA4] Identify:: ${Config.newOrExistingUserTrait} is a required field in traits`,
            400
          );
        }

        if (Config.sendLoginSignup) {
          if (firstLogin) {
            message.event = "sign_up";
          } else {
            message.event = "login";
          }

          response.push(responseBuilder(message, destination));
        }

        // 2. send generate_lead based on config
        if (Config.generateLead && firstLogin === true) {
          message.event = "generate_lead";
          response.push(responseBuilder(message, destination));
        }
      } else {
        throw new CustomError(
          "[GA4] Identify:: Server side identify is not enabled",
          400
        );
      }
      break;
    case EventType.TRACK:
      response = responseBuilder(message, destination);
      break;
    case EventType.PAGE:
      // GA4 custom event 'page_view' is fired for page
      message.event = "page_view";
      response = responseBuilder(message, destination);
      break;
    case EventType.GROUP:
      // GA4 standard event 'join_group' is fired for group
      message.event = "join_group";
      response = responseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
};

module.exports = { process };
