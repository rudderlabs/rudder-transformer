const get = require("get-value");
const axios = require("axios");
const set = require("set-value");
const md5 = require("md5");
const { EventType } = require("../../constants");
let {
  getEndpoint,
  destinationConfigKeys,
  subscriptionStatus
} = require("./config");
let audienceId;
let dataCenterId;
let apiKey;
let mergeFields;
const { defaultPostRequestConfig, removeUndefinedValues } = require("../util");

function filterTagValue(tag) {
  const maxLength = 10;
  let newTag = tag.replace(/[^\w\s]/gi, "");
  if (newTag.length > maxLength) {
    return newTag.slice(0, 10);
  }
  return newTag;
}

async function checkIfMailExists(email) {
  const url = `${getEndpoint(dataCenterId, audienceId)}/members`;
  const response = await axios.get(url, {
    auth: {
      username: "apiKey",
      password: `${apiKey}`
    }
  });
  let check = false;
  response.data.members.forEach(member => {
    if (member.email_address === email) {
      check = true;
    }
  });
  return check;
}

// New User - make a post request to create the user with the userObj and api key
function getSubscribeUserUrl() {
  return `${getEndpoint(dataCenterId, audienceId)}/members`;
}

// Existing user - make a put request to create the user with the userObj and api key
function getUpdateUserTraitsUrl(email) {
  const hash = md5(email);
  return `${getEndpoint(dataCenterId, audienceId)}/members/${hash}`;
}

// Create Merge Field - make a post request to create a merge field. If tag is not provided, Use from name. Must be without numbers.
function getCustomMergeFieldsUrl() {
  return `${getEndpoint(dataCenterId, audienceId)}/merge-fields`;
}

// // Modify Merge Field
// function modifyCustomMergeFields(userObj, audienceId, dataCenterId) {
//   // Get all merge fields
//   const url = `${endpoint}/merge-fields/${mergeId}`;
// }

function responseBuilderSimple(payload, message, eventType, destination) {
  let endpoint;
  let requestConfig;
  const email = message.context.traits.email;
  const emailExists = checkIfMailExists(email);

  if (emailExists) {
    if (mergeFields) {
      endpoint = getCustomMergeFieldsUrl();
      requestConfig = defaultPostRequestConfig;
    } else {
      endpoint = getUpdateUserTraitsUrl(email);
      requestConfig = defaultPostRequestConfig;
    }
  } else {
    endpoint = getSubscribeUserUrl();
    requestConfig = defaultPostRequestConfig;
  }

  const headerPayload = {
    auth: {
      username: "apiKey",
      password: `${apiKey}`
    }
  };

  return {
    endpoint,
    header: headerPayload,
    userId: message.anonymousId,
    requestConfig,
    payload: removeUndefinedValues(payload)
  };
}

function getPropertyValueForIdentify(propMap) {
  return Object.keys(propMap).map(key => {
    return { property: key, value: propMap[key] };
  });
}

function getPayload(
  customMergeFields,
  traits,
  updateSubscription,
  message,
  emailExists
) {
  let rawPayload = {};
  if (customMergeFields) {
    mergeFields = true;
    Object.keys(message.context.traits.MergeFields).forEach(field => {
      if (field === "tag") {
        fieldValue = message.context.traits.MergeFields[field];
        set(rawPayload, field, filterTagValue(fieldValue));
      } else {
        set(rawPayload, field, message.context.traits.MergeFields[field]);
      }
    });
  } else if (updateSubscription && emailExists) {
    Object.keys(message.integrations.MailChimp).forEach(field => {
      if (field === "subscriptionStatus") {
        rawPayload.status = message.integrations.MailChimp[field];
      } else {
        rawPayload[field] = message.integrations.MailChimp[field];
      }
    });
    Object.keys(message.context.traits).forEach(trait => {
      set(rawPayload, trait, message.context.traits[trait]);
    });
  } else if (traits && message.context.traits.email) {
    Object.keys(message.context.traits).forEach(trait => {
      set(rawPayload, trait, message.context.traits[trait]);
    });
    if (!emailExists) {
      rawPayload.status = subscriptionStatus.subscribed;
    }
  } else {
    throw "Error";
  }
  return rawPayload;
}

async function getTransformedJSON(message) {
  const traits = get(message, "context.traits");
  const customMergeFields = get(message, "context.traits.MergeFields");
  const modifyAudienceId = get(message, "context.MailChimp");
  updateSubscription = get(message, "integrations");
  const emailExists = await checkIfMailExists(message.context.traits.email);

  if (modifyAudienceId) {
    modifyAudienceId ? (audienceId = message.context.MailChimp.listId) : null;
  }

  const rawPayload = getPayload(
    customMergeFields,
    traits,
    updateSubscription,
    message,
    emailExists
  );
  return { ...rawPayload, ...message.user_properties };
}

function setDestinationKeys(destination) {
  const keys = Object.keys(destination.Config);
  keys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.apiKey:
        apiKey = `${destination.Config[key]}`;
        break;
      case destinationConfigKeys.audienceId:
        audienceId = `${destination.Config[key]}`;
        break;
      case destinationConfigKeys.dataCenterId:
        dataCenterId = `${destination.Config[key]}`;
        break;
      default:
        break;
    }
  });
}

async function processIdentify(message, destination) {
  setDestinationKeys(destination);
  const userProperties = await getTransformedJSON(message);
  const properties = getPropertyValueForIdentify(userProperties);
  return responseBuilderSimple(
    { properties },
    message,
    EventType.IDENTIFY,
    destination
  );
}

function processSingleMessage(message, destination) {
  let response;
  if (message.type === EventType.IDENTIFY) {
    response = processIdentify(message, destination);
  } else {
    console.log("could not determine type");
    response = {
      statusCode: 400,
      error: "message type " + message.type + " is not supported"
    };
  }
  return response;
}

function process(events) {
  const respList = [];
  let resp;
  events.forEach(event => {
    try {
      resp = processSingleMessage(event.message, event.destination);
      // console.log(resp);
      if (!resp.statusCode) {
        resp.statusCode = 200;
      }
    } catch (e) {
      console.log("error occurred while processing payload for MailChimp: ", e);
      resp = {
        statusCode: 400,
        error: "error occurred while processing payload."
      };
    }
    respList.push(resp);
  });
  return respList;
}
