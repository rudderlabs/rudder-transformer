const md5 = require("md5");
const { EventType } = require("../../../constants");
const {
  ConfigCategory,
  MappingConfig,
  ReservedTraitsProperties,
  ReservedCompanyProperties
} = require("./config");
const {
  constructPayload,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage
} = require("../../util");

// function responseBuilder(payload, message, intercomConfig) {
//   const response = defaultRequestConfig();
//
//   switch (message.type) {
//     case EventType.IDENTIFY:
//       response.method = defaultPostRequestConfig.requestMethod;
//       response.endpoint = endpoints.userUrl;
//       response.body.JSON = removeUndefinedAndNullValues(payload);
//       break;
//     case EventType.TRACK:
//       response.method = defaultPostRequestConfig.requestMethod;
//       response.endpoint = endpoints.eventsUrl;
//       response.body.JSON = removeUndefinedAndNullValues(payload);
//       break;
//     case EventType.GROUP:
//       response.method = defaultPostRequestConfig.requestMethod;
//       response.endpoint = endpoints.companyUrl;
//       response.body.JSON = removeUndefinedAndNullValues(payload);
//       break;
//     default:
//       break;
//   }
//
//   const resp = {
//     ...response,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${intercomConfig.accessToken}`,
//       Accept: "application/json"
//     },
//     userId: message.anonymousId
//   };
//
//
//   return resp;
// }
//
// function addContext(payload, message) {
//   const deviceExists = get(message, "context.device");
//   const osExists = get(message, "context.os");
//   const appExists = get(message, "context.app");
//
//   const deviceKeys = deviceExists ? Object.keys(deviceExists) : [];
//   const osKeys = osExists ? Object.keys(osExists) : [];
//   const appKeys = appExists ? Object.keys(appExists) : [];
//
//   const customPayload = {};
//
//   deviceKeys.forEach(key => {
//     if (key !== "id") {
//       const deviceKeysMapping = mapPayload.collectContext.device;
//       const value = message.context.device[key];
//       updatePayload(key, deviceKeysMapping, value, customPayload);
//     }
//   });
//   osKeys.forEach(key => {
//     const osKeysMapping = mapPayload.collectContext.os;
//     const value = message.context.os[key];
//     updatePayload(key, osKeysMapping, value, customPayload);
//   });
//   appKeys.forEach(key => {
//     const appKeysMapping = mapPayload.collectContext.app;
//     const value = message.context.app[key];
//     updatePayload(key, appKeysMapping, value, customPayload);
//   });
//   payload.custom_attributes = customPayload;
//   return removeUndefinedAndNullValues(payload);
// }
//
// function getGroupPayload(message) {
//   const rawPayload = {};
//
//   const companyFields = getFieldValueFromMessage(message, "traits");
//
//   if (companyFields) {
//     companyFields.forEach(field => {
//       const value = companyFields[field];
//       updatePayload(field, mapPayload.group.main, value, rawPayload);
//     });
//
//     const companyId = message.event ? message.event : undefined;
//     rawPayload.company_id = companyId || md5(rawPayload.name);
//   }
//
//   return rawPayload;
// }
//
// function getIdentifyPayload(message, intercomConfig) {
//   const rawPayload = {};
//
//   const traits = getFieldValueFromMessage(message, "traits");
//
//   if (get(message.context, "Intercom")) {
//     const userHash = get(message.context, "Intercom.user_hash");
//     if (userHash) {
//       set(rawPayload, "user_hash", userHash);
//     }
//   }
//
//   // unsubscribe user from mail
//   if (get(traits, "traits.context")) {
//     const context = get(traits, "traits.context");
//     const unsubscribe = get(context, "Intercom.unsubscribedFromEmails");
//     if (unsubscribe) {
//       set(rawPayload, "unsubscribed_from_emails", unsubscribe);
//     }
//   }
//
//   Object.keys(traits).forEach(field => {
//     const value = traits[field];
//
//     if (field === "company") {
//       const companies = [];
//       const company = {};
//       const companyFields = Object.keys(traits[field]);
//
//       companyFields.forEach(companyTrait => {
//         const companyValue = traits[field][companyTrait];
//         const replaceKeys = mapPayload.identify.company;
//         updatePayload(companyTrait, replaceKeys, companyValue, company);
//       });
//
//       if (!companyFields.includes("id")) {
//         set(company, "company_id", md5(company.name));
//       }
//
//       companies.push(company);
//       set(rawPayload, "companies", companies);
//     }
//
//     const replaceKeys = mapPayload.identify.main;
//     updatePayload(field, replaceKeys, value, rawPayload);
//   });
//
//   intercomConfig.collectContext ? addContext(rawPayload, message) : null;
//   if (!rawPayload.user_id) {
//     rawPayload.user_id = message.userId ? message.userId : message.anonymousId;
//   }
//   return rawPayload;
// }
//
// function getTrackPayload(message, intercomConfig) {
//   const rawPayload = {};
//   const properties = get(message, "properties")
//     ? Object.keys(message.properties)
//     : undefined;
//
//   if (properties) {
//     const metadata = {};
//     const price = {};
//     const order_number = {};
//
//     properties.forEach(property => {
//       const value = message.properties[property];
//
//       metadata[property] = value;
//       if (property === "price" || property === "currency") {
//         updatePayload(property, mapPayload.track.price, value, price);
//         price.amount *= 100;
//         metadata.price = price;
//       }
//
//       if (property === "order_ID" || property === "order_url") {
//         updatePayload(property, mapPayload.track.order, value, order_number);
//         metadata.order_number = order_number;
//       }
//     });
//     rawPayload.metadata = metadata;
//   }
//
//   rawPayload.event_name = message.event ? message.event : undefined;
//   rawPayload.user_id = message.userId ? message.userId : message.anonymousId;
//   rawPayload.created_at = Math.floor(
//     new Date(message.originalTimestamp).getTime() / 1000
//   );
//
//   return rawPayload;
// }
//
// function getTransformedJSON(message, intercomConfig) {
//   let rawPayload;
//   switch (message.type) {
//     case EventType.TRACK:
//       rawPayload = getTrackPayload(message, intercomConfig);
//       break;
//     case EventType.IDENTIFY:
//       rawPayload = getIdentifyPayload(message, intercomConfig);
//       break;
//     case EventType.GROUP:
//       rawPayload = getGroupPayload(message, intercomConfig);
//       break;
//     default:
//       break;
//   }
//   return { ...rawPayload };
// }
//
// function getDestinationKeys(destination) {
//   const intercomConfig = {};
//   const configKeys = Object.keys(destination.Config);
//   configKeys.forEach(key => {
//     switch (key) {
//       case destinationConfigKeys.accessToken:
//         intercomConfig.accessToken = `${destination.Config[key]}`;
//         break;
//       case destinationConfigKeys.appId:
//         intercomConfig.appId = `${destination.Config[key]}`;
//         break;
//       case destinationConfigKeys.mobileApiKey:
//         intercomConfig.mobileApiKey = `${destination.Config[key]}`;
//         break;
//       case destinationConfigKeys.collectContext:
//         intercomConfig.collectContext = `${destination.Config[key]}`;
//         break;
//       default:
//         break;
//     }
//   });
//   return intercomConfig;
// }
//
// function process(event) {
//   const intercomConfig = getDestinationKeys(event.destination);
//   const properties = getTransformedJSON(event.message, intercomConfig);
//   return responseBuilder(properties, event.message, intercomConfig);
// }

function getCompanyAttribute(company) {
  const companiesList = [];
  if (company.name || company.id) {
    const customAttributes = {};
    Object.keys(company).forEach(key => {
      // the key is not in ReservedCompanyProperties
      if (!ReservedCompanyProperties.includes(key)) {
        const val = company[key];
        if (val) {
          customAttributes[key] = company[key];
        }
      }
    });

    companiesList.push({
      company_id: company.id || md5(company.name),
      custom_attributes: customAttributes,
      name: company.name,
      industry: company.industry
    });
  }
  return companiesList;
}

function validateIdentify(message, payload) {
  const finalPayload = payload;

  finalPayload.role = "user";
  if (payload.external_id || payload.email) {
    if (payload.name === undefined || payload.name === "") {
      const firstName = getFieldValueFromMessage(message, "firstName");
      const lastName = getFieldValueFromMessage(message, "lastName");
      if (firstName && lastName) {
        finalPayload.name = `${firstName} ${lastName}`;
      } else {
        finalPayload.name = firstName ? `${firstName}` : `${lastName}`;
      }
    }

    if (finalPayload.custom_attributes.company) {
      finalPayload.companies = getCompanyAttribute(
        finalPayload.custom_attributes.company
      );
    }
    ReservedTraitsProperties.forEach(trait => {
      delete finalPayload.custom_attributes[trait];
    });

    return finalPayload;
  }
  throw new Error("Email or userId is mandatory");
}

function validateTrack(message, payload) {
  // pass only string, number, boolean properties
  if (payload.user_id || payload.email) {
    const metadata = {};
    if (message.properties) {
      Object.keys(message.properties).forEach(key => {
        const val = message.properties[key];
        if (val && typeof val !== "object" && !Array.isArray(val)) {
          metadata[key] = val;
        }
      });
    }
    return { ...payload, metadata };
  }
  throw new Error("Email or userId is mandatory");
}

function validateAndBuildResponse(message, payload, category, destination) {
  const messageType = message.type.toLowerCase();
  const response = defaultRequestConfig();
  switch (messageType) {
    case EventType.IDENTIFY:
      response.body.JSON = removeUndefinedAndNullValues(
        validateIdentify(message, payload)
      );
      break;
    case EventType.TRACK:
      response.body.JSON = removeUndefinedAndNullValues(
        validateTrack(message, payload)
      );
      break;
    default:
      throw new Error("Message type not supported");
  }

  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = category.endpoint;
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${destination.Config.accessToken}`,
    Accept: "application/json"
  };
  response.userId = message.anonymousId;
  return response;
}

function processSingleMessage(message, destination) {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();
  let category;

  switch (messageType) {
    case EventType.IDENTIFY:
      category = ConfigCategory.IDENTIFY;
      break;
    case EventType.TRACK:
      category = ConfigCategory.TRACK;
      break;
    case EventType.GROUP:
      category = ConfigCategory.GROUP;
      break;
    default:
      throw new Error("Message type not supported");
  }

  // build the response and return
  const payload = constructPayload(message, MappingConfig[category.name]);
  return validateAndBuildResponse(message, payload, category, destination);
}

function process(event) {
  let response;
  try {
    response = processSingleMessage(event.message, event.destination);
  } catch (error) {
    throw new Error(error.message || "Unknown error");
  }
  return response;
}

exports.process = process;
