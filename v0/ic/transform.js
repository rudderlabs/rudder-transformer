const get = require("get-value");
const set = require("set-value");
const md5 = require("md5");
const { EventType } = require("../../constants");
const { destinationConfigKeys, endpoints, mapPayload } = require("./config");
const {
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
  defaultGetRequestConfig,
  mapKeys
} = require("../util");
let apiKey;
let appId;
let mobileApiKey;
let collectContext;

function removeNullValues(payload) {
  let newPayload = {};
  var vals = Object.keys(payload);
  for (var i = 0; i < vals.length; i++) {
    let currentVal = vals[i];
    if (payload[currentVal] != (null || undefined)) {
      newPayload[currentVal] = payload[currentVal];
    }
  }
  return newPayload;
}

function responseBuilderSimple(payload, message) {
  let newPayload = removeNullValues(payload);
  let endpoint;
  let requestConfig;

  switch (message.type) {
    case EventType.IDENTIFY:
      requestConfig = defaultPostRequestConfig;
      endpoint = endpoints.userUrl;
      break;
    case EventType.TRACK:
      requestConfig = defaultPostRequestConfig;
      endpoint = endpoints.eventsUrl;
      break;
    case EventType.PAGE:
      requestConfig = defaultGetRequestConfig;
      endpoint = endpoints.conversationsUrl;
      break;
    case EventType.GROUP:
      requestConfig = defaultPostRequestConfig;
      endpoint = endpoints.companyUrl;
      break;
    case EventType.RESET:
      // Not Tested
      const email = get(message.context.traits.email);
      const userId = get(message.context.traits.userId);
      const params = email ? `email=${email}` : `user_id=${userId}`;
      requestConfig = defaultDeleteRequestConfig;
      endpoint = `${endpoints.userUrl}?${params}`;
    default:
      break;
  }

  const response = {
    endpoint,
    header: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json"
    },
    requestConfig,
    userId: message.userId ? message.userId : message.anonymousId,
    payload: newPayload
  };
  return response;
}

function addContext(payload, message) {
  const deviceExists = get(message.context.device);
  const osExists = get(message.context.os);
  const appExists = get(message.context.app);

  const deviceKeys = deviceExists ? Object.keys(deviceExists) : [];
  const osKeys = osExists ? Object.keys(osExists) : [];
  const appKeys = appExists ? Object.keys(appExists) : [];

  let customPayload = {};

  deviceKeys.forEach(key => {
    if (key != "id") {
      let deviceKeysMapping = mapPayload.collectContext.device;
      let value = message.context.device[key];
      mapKeys(key, deviceKeysMapping, value, customPayload);
    }
  });
  osKeys.forEach(key => {
    let osKeysMapping = mapPayload.collectContext.os;
    let value = message.context.os[key];
    mapKeys(key, osKeysMapping, value, customPayload);
  });
  appKeys.forEach(key => {
    let appKeysMapping = mapPayload.collectContext.app;
    let value = message.context.app[key];
    mapKeys(key, appKeysMapping, value, customPayload);
  });
  payload.custom_attributes = customPayload;
  return payload;
}

function getGroupPayload(message) {
  let rawPayload = {};
  let companyId = message.event;
  let companyFields = Object.keys(message.context.traits);
  companyFields.forEach(field => {
    let value = message.context.traits[field];
    mapKeys(field, mapPayload.group.main, value, rawPayload);
  });
  if (!companyFields.includes("id")) {
    set(rawPayload, company_id, md5(company.name));
  }
  rawPayload[company_id] = companyId;
  return rawPayload;
}

function getIdentifyPayload(message) {
  let rawPayload = {};
  const traits = Object.keys(message.context.traits);
  // TODO
  // let chatWidget = get(message, "context.traits");
  // const user_hash = get(message.integrations.Intercom.user_hash);
  traits.forEach(field => {
    let value = message.context.traits[field];
    if (field === "company") {
      let companies = [];
      let company = {};
      let companyFields = Object.keys(message.context.traits[field]);
      companyFields.forEach(companyTrait => {
        let value = message.context.traits[field][companyTrait];
        let replaceKeys = mapPayload.identify.sub;
        mapKeys(companyTrait, replaceKeys, value, company);
        company[companyTrait] = value;
      });
      if (!companyFields.includes("id")) {
        set(company, "company_id", md5(company.name));
      }
      companies.push(company);
      set(rawPayload, "companies", companies);
    } else if (field === "anonymousId") {
      let replaceKeys = mapPayload.identify.main;
      mapKeys(field, replaceKeys, value, rawPayload);
    } else {
      set(rawPayload, field, message.context.traits[field]);
    }
  });
  collectContext ? addContext(rawPayload) : null;
  return rawPayload;
}

function getTrackPayload(message) {
  let rawPayload = {};
  let price = {};
  let traits = Object.keys(message.context.traits);
  traits.forEach(field => {
    let value = message.context.traits[field];

    if (field === ("price" || "currency")) {
      mapKeys(field, mapPayload.track.sub, value, price);
      rawPayload.price.amount *= 100;
    } else {
      set(rawPayload, field, message.context.traits[field]);
    }
  });
  rawPayload.price = price;
  rawPayload.event_name = message.event;
  return rawPayload;
}

function getTransformedJSON(message) {
  let rawPayload;
  switch (message.type) {
    case EventType.PAGE:
      rawPayload = {};
      break;
    case EventType.TRACK:
      rawPayload = getTrackPayload(message);
      break;
    case EventType.IDENTIFY:
      rawPayload = getIdentifyPayload(message);
      break;
    case EventType.GROUP:
      rawPayload = getGroupPayload(message);
      break;
    case EventType.RESET:
      rawPayload = {};
      break;
    default:
      break;
  }
  return { ...rawPayload };
}

function setDestinationKeys(destination) {
  const keys = Object.keys(destination.Config);
  keys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.apiKey:
        apiKey = `${destination.Config[key]}`;
        break;
      case destinationConfigKeys.appId:
        appId = `${destination.Config[key]}`;
        break;
      case destinationConfigKeys.mobileApiKey:
        mobileApiKey = `${destination.Config[key]}`;
        break;
      case destinationConfigKeys.collectContext:
        collectContext = `${destination.Config[key]}`;
        break;
      default:
        break;
    }
  });
}

function processSingleMessage(message, destination) {
  setDestinationKeys(destination);
  const properties = getTransformedJSON(message);
  return responseBuilderSimple(properties, message);
}

function process(events) {
  let respList = [];
  events.forEach(event => {
    try {
      response = processSingleMessage(event.message, event.destination);
      respList.push(response);
    } catch (error) {
      respList.push({ statusCode: 400, error: error.message });
    }
  });
  return respList;
}

exports.process = process;
