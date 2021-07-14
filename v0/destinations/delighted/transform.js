const {
  getFieldValueFromMessage,
  CustomError,
  defaultRequestConfig,
  defaultPostRequestConfig,
  extractCustomFields,
  removeUndefinedAndNullValues,
  getDestinationExternalID,
  constructPayload
} = require("../../util");
const {
  ENDPOINT,
  DELIGHTED_EXCLUSION_FIELDS,
  identifyMapping
} = require("./config");

function ValidateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function ValidatePhone(phone) {
  const phoneformat = /^\+[1-9]\d{10,14}$/;
  return phoneformat.test(String(phone));
}

const identifyResponseBuilder = async (message, { destination }) => {
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  if (!userId) {
    throw new CustomError("userId is required for identify", 400);
  }
  let channel =
    getDestinationExternalID(message, "delightedChannelType") ||
    destination.Config.channel;
  channel = channel.toLowerCase();

  // validate userId
  if (channel === "email") {
    if (!ValidateEmail(userId)) {
      throw new CustomError("Email format is not correct.", 400);
    }
  } else if (channel === "phone") {
    if (!ValidatePhone(userId)) {
      throw new CustomError("Phone number format must be E.164.", 400);
    }
  }

  let payload = constructPayload(message, identifyMapping);

  payload.send = false;
  payload.channel = channel;
  payload.delay = destination.Config.delay || message.context.traits.delay || 0;
  // payload.last_sent_at = message.timestamp;

  if (!payload.name) {
    const fName = getFieldValueFromMessage(message, "firstName");
    const lName = getFieldValueFromMessage(message, "lastName");
    const name = fName.concat(lName);
    if (name) payload.name = name;
    else payload.name = userId;
  }
  // not sure if this is how we will extract the custom properties
  let properties = {};
  properties = extractCustomFields(
    message,
    properties,
    ["context.traits"],
    DELIGHTED_EXCLUSION_FIELDS
  );
  payload = {
    ...payload,
    properties
  };
  // update/create the user
  const response = defaultRequestConfig();
  response.headers = {
    Authorization: destination.Config.apiKey,
    "Content-Type": "application/json"
  };
  response.method = defaultPostRequestConfig.requestMethd;
  response.endpoint = `${ENDPOINT}`; // since ENDPOINT remains same
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const trackResponseBuilder = (message, { destination }) => {
  let payload = constructPayload(message, trackMapping);
};
const process = async event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const { apiKey } = destination.Config;
  if (!apiKey) {
    throw new CustomError("Inavalid API Key. Aborting message.", 400);
  }

  const messageType = message.type.toLowerCase();

  let reponse;
  switch (messageType) {
  }
};
