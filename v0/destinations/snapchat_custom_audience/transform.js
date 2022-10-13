const sha256 = require("sha256");
const {
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
  CustomError
} = require("../../util");
const ErrorBuilder = require("../../util/error");
const { BASE_URL } = require("./config");

/**
 * Get access token to be bound to the event req headers
 *
 * Note:
 * This method needs to be implemented particular to the destination
 * As the schema that we'd get in `metadata.secret` can be different
 * for different destinations
 *
 * @param {Object} metadata
 * @returns
 */
const getAccessToken = metadata => {
  // OAuth for this destination
  const { secret } = metadata;
  // we would need to verify if secret is present and also if the access token field is present in secret
  if (!secret || !secret.access_token) {
    throw new ErrorBuilder()
      .setStatus(500)
      .setMessage("Empty/Invalid access token")
      .build();
  }
  return secret.access_token;
};

/**
 * Verifies whether the input payload is in right format or not
 * @param {Object} message
 * @returns
 */
const validatePayload = message => {
  if (!message.type) {
    throw new ErrorBuilder()
      .setMessage(
        "[snapchat_custom_audience]::Message Type is not present. Aborting message."
      )
      .setStatus(400)
      .build();
  }
  if (!message.properties) {
    throw new ErrorBuilder()
      .setMessage(
        "[snapchat_custom_audience]::Message properties is not present. Aborting message."
      )
      .setStatus(400)
      .build();
  }
  if (!message.properties.listData) {
    throw new ErrorBuilder()
      .setMessage(
        "[snapchat_custom_audience]::listData is not present inside properties. Aborting message."
      )
      .setStatus(400)
      .build();
  }
  if (message.type.toLowerCase() !== "audiencelist") {
    throw new ErrorBuilder()
      .setMessage(
        `[snapchat_custom_audience]::Message Type ${message.type} not supported.`
      )
      .setStatus(400)
      .build();
  }
  if (!message.properties.listData.add && !message.properties.listData.remove) {
    throw new ErrorBuilder()
      .setMessage(
        "[snapchat_custom_audience]::Neither 'add' nor 'remove' property is present inside 'listData'. Aborting message."
      )
      .setStatus(400)
      .build();
  }
};

const responseBuilder = (metadata, message, { Config }, type) => {
  const { schema, segmentId } = Config;
  const payload = { users: [] };
  const userPayload = { schema: [], data: [] };
  let schemaType;
  let hashedProperty;
  // Normalizing and hashing ref: https://marketingapi.snapchat.com/docs/#normalizing-hashing

  let userArray;
  if (type === "add") {
    userArray = message.properties.listData.add;
  } else if (type === "remove") {
    userArray = message.properties.listData.remove;
  }

  switch (schema) {
    case "email":
      schemaType = "EMAIL_SHA256";
      userArray.forEach(element => {
        hashedProperty = element?.email;
        // what if email is not present in all cases?
        hashedProperty = sha256(hashedProperty.toLowerCase().trim());
        userPayload.data.push([hashedProperty]);
      });
      break;

    case "phone":
      schemaType = "PHONE_SHA256";
      userArray.forEach(element => {
        hashedProperty = element?.phone || element?.mobile;
        hashedProperty = sha256(
          hashedProperty
            .toLowerCase()
            .trim()
            .replace(/^0+/, "")
            .replace(/[^0-9]/g, "")
        );
        userPayload.data.push([hashedProperty]);
      });
      break;

    case "mobileAdId":
      schemaType = "MOBILE_AD_ID_SHA256";
      userArray.forEach(element => {
        hashedProperty =
          element?.mobileId || element?.mobileAdId || element?.mobile_id;
        hashedProperty = sha256(hashedProperty.toLowerCase());
        userPayload.data.push([hashedProperty]);
      });
      break;

    default:
      throw new CustomError("Invalid schema", 400);
  }

  userPayload.schema.push(schemaType);
  payload.users.push(userPayload);

  const response = defaultRequestConfig();
  if (type === "remove") {
    response.method = "DELETE";
    payload.users[0].id = `${segmentId}`;
  }

  response.endpoint = `${BASE_URL}/segments/${segmentId}/users`;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  const accessToken = getAccessToken(metadata);
  //   response.params = { segmentId: Config.segmentId };
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  };

  return response;
};

const processEvent = (metadata, message, destination) => {
  const response = [];
  validatePayload(message);

  let payload;
  if (message.properties.listData.add) {
    payload = responseBuilder(metadata, message, destination, "add");
    response.push(payload);
  }
  if (message.properties.listData.remove) {
    payload = responseBuilder(metadata, message, destination, "remove");
    response.push(payload);
  }

  return response;
};

const process = event => {
  return processEvent(event.metadata, event.message, event.destination);
};
const processRouterDest = async inputs => {
  const respList = await simpleProcessRouterDest(
    inputs,
    "snapchat_custom_audience",
    process
  );
  return respList;
};

module.exports = { process, processRouterDest };
