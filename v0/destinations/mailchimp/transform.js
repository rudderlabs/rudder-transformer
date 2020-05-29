const get = require("get-value");
const axios = require("axios");
const set = require("set-value");
const md5 = require("md5");
const { EventType } = require("../../../constants");
let {
  getEndpoint,
  destinationConfigKeys,
  subscriptionStatus
} = require("./config");
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultPutRequestConfig
} = require("../util");

// Converts to upper case and removes spaces
function filterTagValue(tag) {
  const maxLength = 10;
  let newTag = tag.replace(/[^\w\s]/gi, "");
  if (newTag.length > maxLength) {
    return newTag.slice(0, 10);
  }
  return newTag.toUpperCase();
}

function getMailChimpEndpoint(mailChimpConfig) {
  return getEndpoint(mailChimpConfig.dataCenterId, mailChimpConfig.audienceId);
}

async function checkIfMailExists(mailChimpConfig, email) {
  if (!email) {
    return false;
  }
  const hash = md5(email);
  const url = `${getMailChimpEndpoint(mailChimpConfig)}/members/${hash}`;

  let status = false;
  try {
    await axios.get(url, {
      auth: {
        username: "apiKey",
        password: `${mailChimpConfig.apiKey}`
      }
    });
    status = true;
  } catch (error) {}
  return status;
}

async function checkIfDoubleOptIn(mailChimpConfig) {
  const url = `${getMailChimpEndpoint(mailChimpConfig)}`;
  const response = await axios.get(url, {
    auth: {
      username: "apiKey",
      password: `${mailChimpConfig.apiKey}`
    }
  });
  return response.data.double_optin ? true : false;
}

// New User - make a post request to create the user with the userObj and api key
function getSubscribeUserUrl(mailChimpConfig) {
  return `${getMailChimpEndpoint(mailChimpConfig)}/members`;
}

// Existing user - make a put request to create the user with the userObj and api key
function getUpdateUserTraitsUrl(mailChimpConfig, email) {
  const hash = md5(email);
  return `${getMailChimpEndpoint(mailChimpConfig)}/members/${hash}`;
}

async function responseBuilderSimple(payload, message, mailChimpConfig) {
  const email = message.context.traits.email;
  const emailExists = await checkIfMailExists(mailChimpConfig, email);

  let response = defaultRequestConfig();
  if (emailExists) {
    response.endpoint = getUpdateUserTraitsUrl(mailChimpConfig, email);
    response.method = defaultPutRequestConfig.requestMethod;
  } else {
    response.endpoint = getSubscribeUserUrl(mailChimpConfig);
    response.method = defaultPostRequestConfig.requestMethod;
  }
  response.body.JSON = payload;
  const basicAuth = Buffer.from(
    "apiKey" + ":" + `${mailChimpConfig.apiKey}`
  ).toString("base64");
  return {
    ...response,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`
    },
    userId: message.userId ? message.userId : message.anonymousId
  };
}

async function getPayload(
  traits,
  updateSubscription,
  message,
  emailExists,
  mailChimpConfig
) {
  if (updateSubscription != undefined && emailExists) {
    let rawPayload = {};
    Object.keys(message.integrations.MailChimp).forEach(field => {
      if (field === "subscriptionStatus") {
        rawPayload["status"] = message.integrations.MailChimp[field];
      } else {
        rawPayload[field] = message.integrations.MailChimp[field];
      }
    });
    Object.keys(message.context.traits).forEach(trait => {
      if (trait === "email") {
        rawPayload["email_address"] = message.context.traits[trait];
      }
    });
    return rawPayload;
  }

  if (traits && message.context.traits.email) {
    let rawPayload = {};
    rawPayload["merge_fields"] = {};

    Object.keys(message.context.traits).forEach(trait => {
      if (trait === "email") {
        rawPayload["email_address"] = message.context.traits[trait];
      } else {
        let tag = filterTagValue(trait);
        rawPayload["merge_fields"][tag] = message.context.traits[trait];
      }
    });
    if (!emailExists) {
      const isDoubleOptin = await checkIfDoubleOptIn(mailChimpConfig);
      rawPayload.status = isDoubleOptin
        ? subscriptionStatus.pending
        : subscriptionStatus.subscribed;
    }
    return rawPayload;
  }
}

async function getTransformedJSON(message, mailChimpConfig) {
  const traits = get(message, "context.traits");

  const updateSubscription = get(message, "integrations.MailChimp")
    ? message.integrations.MailChimp
    : undefined;

  const emailExists = await checkIfMailExists(
    mailChimpConfig,
    message.context.traits.email
  );

  const rawPayload = await getPayload(
    traits,
    updateSubscription,
    message,
    emailExists,
    mailChimpConfig
  );
  return { ...rawPayload };
}

function getMailChimpConfig(message, destination) {
  const configKeys = Object.keys(destination.Config);
  let mailChimpConfig = {};
  configKeys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.apiKey:
        mailChimpConfig.apiKey = `${destination.Config[key]}`;
        break;
      case destinationConfigKeys.audienceId:
        mailChimpConfig.audienceId = `${destination.Config[key]}`;
        break;
      case destinationConfigKeys.dataCenterId:
        mailChimpConfig.dataCenterId = `${destination.Config[key]}`;
        break;
      default:
        console.log("MailChimp: Unknown key type: ", key);
        break;
    }
  });

  const mailChimpExists = get(message, "context.MailChimp");
  if (mailChimpExists) {
    const listIdExists = get(message, "context.MailChimp.listId");
    if (listIdExists) {
      mailChimpConfig.audienceId = message.context.MailChimp.listId;
    }
  }
  return mailChimpConfig;
}

async function processIdentify(message, destination) {
  const mailChimpConfig = getMailChimpConfig(message, destination);
  const properties = await getTransformedJSON(message, mailChimpConfig);
  return responseBuilderSimple(properties, message, mailChimpConfig);
}

async function processSingleMessage(message, destination) {
  if (message.type !== EventType.IDENTIFY) {
    throw new Error("message type " + message.type + " is not supported");
  }

  return processIdentify(message, destination);
}

async function process(event) {
  return processSingleMessage(event.message, event.destination);
}

exports.process = process;
