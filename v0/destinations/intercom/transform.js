const get = require("get-value");
const set = require("set-value");
const md5 = require("md5");
const { EventType } = require("../../../constants");
const { destinationConfigKeys, endpoints } = require("./config");
const { mapPayload } = require("./data/eventMapping");
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  updatePayload,
  removeUndefinedAndNullValues
} = require("../util");

function responseBuilder(payload, message, intercomConfig) {
  let response = defaultRequestConfig();

  switch (message.type) {
    case EventType.IDENTIFY:
      response.method = defaultPostRequestConfig.requestMethod;
      response.endpoint = endpoints.userUrl;
      response.body.JSON = removeUndefinedAndNullValues(payload);
      break;
    case EventType.TRACK:
      response.method = defaultPostRequestConfig.requestMethod;
      response.endpoint = endpoints.eventsUrl;
      response.body.JSON = removeUndefinedAndNullValues(payload);
      break;
    case EventType.GROUP:
      response.method = defaultPostRequestConfig.requestMethod;
      response.endpoint = endpoints.companyUrl;
      response.body.JSON = removeUndefinedAndNullValues(payload);
      break;
    default:
      break;
  }

  const resp = {
    ...response,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${intercomConfig.accessToken}`,
      Accept: "application/json"
    },
    userId: message.userId ? message.userId : message.anonymousId
  };

  // console.log(resp);

  return resp;
}

function addContext(payload, message) {
  const deviceExists = get(message, "context.device");
  const osExists = get(message, "context.os");
  const appExists = get(message, "context.app");

  const deviceKeys = deviceExists ? Object.keys(deviceExists) : [];
  const osKeys = osExists ? Object.keys(osExists) : [];
  const appKeys = appExists ? Object.keys(appExists) : [];

  let customPayload = {};

  deviceKeys.forEach(key => {
    if (key != "id") {
      const deviceKeysMapping = mapPayload.collectContext.device;
      const value = message.context.device[key];
      updatePayload(key, deviceKeysMapping, value, customPayload);
    }
  });
  osKeys.forEach(key => {
    const osKeysMapping = mapPayload.collectContext.os;
    const value = message.context.os[key];
    updatePayload(key, osKeysMapping, value, customPayload);
  });
  appKeys.forEach(key => {
    const appKeysMapping = mapPayload.collectContext.app;
    const value = message.context.app[key];
    updatePayload(key, appKeysMapping, value, customPayload);
  });
  payload.custom_attributes = customPayload;
  return removeUndefinedAndNullValues(payload);
}

function getGroupPayload(message, intercomConfig) {
  let rawPayload = {};

  const companyFields = get(message, "context.traits")
    ? Object.keys(message.context.traits)
    : undefined;

  if (companyFields) {
    companyFields.forEach(field => {
      const value = message.context.traits[field];
      updatePayload(field, mapPayload.group.main, value, rawPayload);
    });

    const companyId = message.event ? message.event : undefined;
    rawPayload["company_id"] = companyId ? companyId : md5(rawPayload["name"]);
  }

  return rawPayload;
}

function getIdentifyPayload(message, intercomConfig) {
  let rawPayload = {};

  const traits = get(message.context, "traits");

  if (get(message.context, "Intercom")) {
    const userHash = get(message.context, "Intercom.user_hash");
    if (userHash) {
      set(rawPayload, "user_hash", userHash);
    }
  }

  // unsubscribe user from mail
  if (get(message.context, "traits.context")) {
    const context = get(message.context, "traits.context");
    const unsubscribe = get(context, "Intercom.unsubscribedFromEmails");
    if (unsubscribe) {
      set(rawPayload, "unsubscribed_from_emails", unsubscribe);
    }
  }

  Object.keys(traits).forEach(field => {
    const value = traits[field];

    if (field === "company") {
      let companies = [];
      let company = {};
      const companyFields = Object.keys(traits[field]);

      companyFields.forEach(companyTrait => {
        const companyValue = traits[field][companyTrait];
        // console.log(companyValue);
        const replaceKeys = mapPayload.identify.company;
        // console.log(replaceKeys);
        updatePayload(companyTrait, replaceKeys, companyValue, company);
      });

      // console.log(company);
      if (!companyFields.includes("id")) {
        set(company, "company_id", md5(company.name));
      }

      companies.push(company);
      set(rawPayload, "companies", companies);
    }

    const replaceKeys = mapPayload.identify.main;
    updatePayload(field, replaceKeys, value, rawPayload);
  });

  intercomConfig.collectContext ? addContext(rawPayload, message) : null;
  // // console.log(message.userId);
  if (!rawPayload.user_id) {
    rawPayload.user_id = message.userId ? message.userId : message.anonymousId;
  }
  // console.log("============================");
  // console.log(rawPayload);
  // console.log("============================");
  return rawPayload;
}

function getTrackPayload(message, intercomConfig) {
  let rawPayload = {};
  const properties = get(message, "properties")
    ? Object.keys(message.properties)
    : undefined;

  if (properties) {
    let metadata = {};
    let price = {};
    let order_number = {};

    properties.forEach(property => {
      const value = message.properties[property];

      metadata[property] = value;
      if (property === "price" || property === "currency") {
        updatePayload(property, mapPayload.track.price, value, price);
        price.amount *= 100;
        metadata.price = price;
      }

      if (property === "order_ID" || property === "order_url") {
        updatePayload(property, mapPayload.track.order, value, order_number);
        metadata.order_number = order_number;
      }
    });
    rawPayload.metadata = metadata;
  }

  rawPayload.event_name = message.event ? message.event : undefined;
  rawPayload.user_id = message.userId ? message.userId : message.anonymousId;
  rawPayload.created_at = Math.floor(
    new Date(message.originalTimestamp).getTime() / 1000
  );

  return rawPayload;
}

function getTransformedJSON(message, intercomConfig) {
  let rawPayload;
  switch (message.type) {
    case EventType.TRACK:
      rawPayload = getTrackPayload(message, intercomConfig);
      break;
    case EventType.IDENTIFY:
      rawPayload = getIdentifyPayload(message, intercomConfig);
      break;
    case EventType.GROUP:
      rawPayload = getGroupPayload(message, intercomConfig);
      break;
    default:
      break;
  }
  return { ...rawPayload };
}

function getDestinationKeys(destination) {
  let intercomConfig = {};
  const configKeys = Object.keys(destination.Config);
  configKeys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.accessToken:
        intercomConfig.accessToken = `${destination.Config[key]}`;
        break;
      case destinationConfigKeys.appId:
        intercomConfig.appId = `${destination.Config[key]}`;
        break;
      case destinationConfigKeys.mobileApiKey:
        intercomConfig.mobileApiKey = `${destination.Config[key]}`;
        break;
      case destinationConfigKeys.collectContext:
        intercomConfig.collectContext = `${destination.Config[key]}`;
        break;
      default:
        break;
    }
  });
  return intercomConfig;
}

function process(event) {
  const intercomConfig = getDestinationKeys(event.destination);
  const properties = getTransformedJSON(event.message, intercomConfig);
  return responseBuilder(properties, event.message, intercomConfig);
}

exports.process = process;
