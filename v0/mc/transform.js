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
const {
  defaultPostRequestConfig,
  defaultPutRequestConfig
} = require("../util");

function filterTagValue(tag) {
  const maxLength = 10;
  let newTag = tag.replace(/[^\w\s]/gi, "");
  if (newTag.length > maxLength) {
    return newTag.slice(0, 10);
  }
  return newTag;
}

async function checkIfMailExists(keysObj, email) {
  const hash = md5(email);
  const url = `${getEndpoint(
    keysObj.dataCenterId,
    keysObj.audienceId
  )}/members/${hash}`;

  let status;
  try {
    await axios.get(url, {
      auth: {
        username: "apiKey",
        password: `${keysObj.apiKey}`
      }
    });
    status = true;
  } catch (error) {
    status = false;
  }
  return status;
}

async function checkIfDoubleOptIn(keysObj) {
  const url = `${getEndpoint(keysObj.dataCenterId, keysObj.audienceId)}`;
  const response = await axios.get(url, {
    auth: {
      username: "apiKey",
      password: `${keysObj.apiKey}`
    }
  });
  return response.data.double_optin ? true : false;
}

// New User - make a post request to create the user with the userObj and api key
function getSubscribeUserUrl(keysObj) {
  return `${getEndpoint(keysObj.dataCenterId, keysObj.audienceId)}/members`;
}

// Existing user - make a put request to create the user with the userObj and api key
function getUpdateUserTraitsUrl(keysObj, email) {
  const hash = md5(email);
  return `${getEndpoint(
    keysObj.dataCenterId,
    keysObj.audienceId
  )}/members/${hash}`;
}

// Create Merge Field - make a post request to create a merge field. If tag is not provided, Use from name. Must be without numbers.
function getCustomMergeFieldsUrl(keysObj) {
  return `${getEndpoint(
    keysObj.dataCenterId,
    keysObj.audienceId
  )}/merge-fields`;
}

async function responseBuilderSimple(payload, message, keysObj) {
  let endpoint;
  let requestConfig;
  const email = message.context.traits.email;
  const emailExists = await checkIfMailExists(keysObj, email);

  if (emailExists) {
    if (keysObj.mergeFields) {
      endpoint = getCustomMergeFieldsUrl(keysObj);
      requestConfig = defaultPostRequestConfig;
    } else {
      endpoint = getUpdateUserTraitsUrl(keysObj, email);
      requestConfig = defaultPutRequestConfig;
    }
  } else {
    endpoint = getSubscribeUserUrl(keysObj);
    requestConfig = defaultPostRequestConfig;
  }
  let basicAuth = new Buffer("apiKey" + ":" + `${keysObj.apiKey}`).toString(
    "base64"
  );
  const response = {
    endpoint,
    header: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`
    },
    requestConfig,
    userId: message.userId ? message.userId : message.anonymousId,
    payload
  };

  return response;
}

async function getPayload(
  customMergeFields,
  traits,
  updateSubscription,
  message,
  emailExists,
  keysObj
) {
  let rawPayload = {};
  if (customMergeFields) {
    keysObj.mergeFields = true;
    Object.keys(message.context.traits.MergeFields).forEach(field => {
      if (field === "tag") {
        fieldValue = message.context.traits.MergeFields[field];
        set(rawPayload, field, filterTagValue(fieldValue));
      } else {
        set(rawPayload, field, message.context.traits.MergeFields[field]);
      }
      rawPayload.public = true;
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
      if (trait === "email") {
        rawPayload.email_address = message.context.traits[trait];
      }
    });
  } else if (traits && message.context.traits.email) {
    rawPayload.merge_fields = {};
    Object.keys(message.context.traits).forEach(trait => {
      if (trait === "email") {
        rawPayload.email_address = message.context.traits[trait];
      } else {
        rawPayload.merge_fields[trait.toUpperCase()] =
          message.context.traits[trait];
      }
    });
    if (!emailExists) {
      (await checkIfDoubleOptIn(keysObj))
        ? (rawPayload.status = subscriptionStatus.pending)
        : (rawPayload.status = subscriptionStatus.subscribed);
    }
  } else {
    throw "Not a valid object";
  }
  return rawPayload;
}

async function getTransformedJSON(message, keysObj) {
  const traits = get(message, "context.traits");
  const customMergeFields = get(message, "context.traits.MergeFields");
  const modifyAudienceId = get(message, "context.MailChimp");
  keysObj.updateSubscription = get(message, "integrations.MailChimp");

  const emailExists = await checkIfMailExists(
    keysObj,
    message.context.traits.email
  );

  modifyAudienceId
    ? (keysObj.audienceId = message.context.MailChimp.listId)
    : null;
  const rawPayload = await getPayload(
    customMergeFields,
    traits,
    keysObj.updateSubscription,
    message,
    emailExists,
    keysObj
  );
  return { ...rawPayload };
}

function setDestinationKeys(destination) {
  const keys = Object.keys(destination.Config);
  let keysObj = {};
  keys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.apiKey:
        keysObj.apiKey = `${destination.Config[key]}`;
        break;
      case destinationConfigKeys.audienceId:
        keysObj.audienceId = `${destination.Config[key]}`;
        break;
      case destinationConfigKeys.dataCenterId:
        keysObj.dataCenterId = `${destination.Config[key]}`;
        break;
      default:
        break;
    }
  });
  return keysObj;
}

async function processIdentify(message, destination) {
  const keysObj = setDestinationKeys(destination);
  const properties = await getTransformedJSON(message, keysObj);
  return responseBuilderSimple(properties, message, keysObj);
}

async function processSingleMessage(message, destination) {
  let response;
  if (message.type === EventType.IDENTIFY) {
    response = await processIdentify(message, destination);
  } else {
    response = {
      statusCode: 400,
      error: "message type " + message.type + " is not supported"
    };
  }
  return response;
}

async function process(events) {
  let respList = [];
  respList = await Promise.all(
    events.map(event => processSingleMessage(event.message, event.destination))
  );
  return respList;
}

exports.process = process;
