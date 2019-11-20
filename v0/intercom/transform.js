const get = require("get-value");
const set = require("set-value");
const md5 = require("md5");
const { EventType } = require("../../constants");
const { destinationConfigKeys, endpoints } = require("./config");
const { mapPayload } = require("./data/eventMapping");
const {
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
  defaultGetRequestConfig,
  updatePayload
} = require("../util");

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

// function getNewMessages(intercomConfig) {
//   const response = await axios.get(endpoints.conversationsUrl, {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${intercomConfig.apiKey}`,
//     Accept: "application/json"
//   });
//   const conversationsArr = response.data.conversations;
//   conversationsArr.map(conversation =>{

//   })
// }

function responseBuilderSimple(payload, message, intercomConfig) {
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
      Authorization: `Bearer ${intercomConfig.apiKey}`,
      Accept: "application/json"
    },
    requestConfig,
    userId: message.userId ? message.userId : message.anonymousId,
    payload: newPayload
  };
  return response;
}

function addContext(payload, message) {
  console.log(JSON.stringify(message));

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
  return payload;
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

  const traits = get(message.context.traits.traits)
    ? message.context.traits.traits
    : message.context.traits;

  // userhash and widget
  if (get(message.context.Intercom)) {
    const userHash = get(message.context.Intercom.user_hash);
    const widget = get(message.context.Intercom.hideDefaultLauncher);
    if (userHash) {
      set(rawPayload, "user_hash", userHash);
    }

    if (widget) {
      //  set(rawPayload, "hide_default_launcher", widget); To test
    }
  }

  // unsubscribe user from mail
  if (get(message.context.traits.context)) {
    const context = get(message.context.traits.context);
    const unsubscribe = get(context.Intercom.unsubscribedFromEmails);
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
        const replaceKeys = mapPayload.identify.company;
        updatePayload(companyTrait, replaceKeys, companyValue, company);
      });
      if (!companyFields.includes("id")) {
        set(company, "company_id", md5(company.name));
      }
      companies.push(company);
      set(rawPayload, "companies", companies);
    } else {
      let replaceKeys = mapPayload.identify.main;
      updatePayload(field, replaceKeys, value, rawPayload);
    }
  });

  intercomConfig.collectContext ? addContext(rawPayload, message) : null;
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

    properties.forEach(prop => {
      let value = message.properties[prop];
      if (prop === "price" || prop === "currency") {
        updatePayload(prop, mapPayload.track.price, value, price);
        price.amount *= 100;
      } else if (prop === "order_ID" || prop === "order_url") {
        updatePayload(prop, mapPayload.track.order, value, order_number);
      } else {
        metadata[prop] = value;
      }
    });
    metadata.price = price;
    metadata.order_number = order_number;
    rawPayload.metadata = metadata;
  }

  rawPayload.event_name = message.event ? message.event : undefined;
  rawPayload.user_id = message.userId ? message.userId : message.anonymousId;
  rawPayload.created_at = Math.floor(new Date().getTime() / 1000);

  return rawPayload;
}

function getTransformedJSON(message, intercomConfig) {
  let rawPayload;
  switch (message.type) {
    case EventType.PAGE:
      // Not Tested
      rawPayload = {};
      break;
    case EventType.TRACK:
      rawPayload = getTrackPayload(message, intercomConfig);
      break;
    case EventType.IDENTIFY:
      rawPayload = getIdentifyPayload(message, intercomConfig);
      break;
    case EventType.GROUP:
      rawPayload = getGroupPayload(message, intercomConfig);
      break;
    case EventType.RESET:
      // Not Tested
      rawPayload = {};
      break;
    default:
      break;
  }
  return { ...rawPayload };
}

function setDestinationKeys(destination) {
  let intercomConfig = {};
  const configKeys = Object.keys(destination.Config);
  configKeys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.apiKey:
        intercomConfig.apiKey = `${destination.Config[key]}`;
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

function processSingleMessage(message, destination) {
  const intercomConfig = setDestinationKeys(destination);
  const properties = getTransformedJSON(message, intercomConfig);
  return responseBuilderSimple(properties, message, intercomConfig);
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
