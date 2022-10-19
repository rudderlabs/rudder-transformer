const sha256 = require("sha256");
const {
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
  CustomError,
  isDefinedAndNotNullAndNotEmpty
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

const generateResponse = (
  groupedData,
  schemaType,
  segmentId,
  metadata,
  type
) => {
  const payload = { users: [] };
  const userPayload = { schema: [schemaType], data: groupedData };
  payload.users.push(userPayload);
  const response = defaultRequestConfig();
  if (type === "remove") {
    response.method = "DELETE";
    payload.users[0].id = `${segmentId}`;
  }

  response.endpoint = `${BASE_URL}/segments/${segmentId}/users`;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  const accessToken = getAccessToken(metadata);
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  };

  return response;
};

const responseBuilder = (metadata, message, { Config }, type) => {
  const { schema, segmentId } = Config;
  let data = [[]];
  let index = 0;
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
        if (!isDefinedAndNotNullAndNotEmpty(hashedProperty)) {
          return;
        }
        hashedProperty = sha256(hashedProperty.toLowerCase().trim());
        if (data[index].length >= 100000) {
          data.push([]);
          index += 1;
        }
        data[index].push([hashedProperty]);
      });
      break;

    case "phone":
      schemaType = "PHONE_SHA256";
      userArray.forEach(element => {
        hashedProperty = element?.phone || element?.mobile;
        if (!isDefinedAndNotNullAndNotEmpty(hashedProperty)) {
          return;
        }
        hashedProperty = sha256(
          hashedProperty
            .toLowerCase()
            .trim()
            .replace(/^0+/, "")
            .replace(/[^0-9]/g, "")
        );
        if (data[index].length >= 100000) {
          data.push([]);
          index += 1;
        }
        data[index].push([hashedProperty]);
      });
      break;

    case "mobileAdId":
      schemaType = "MOBILE_AD_ID_SHA256";
      userArray.forEach(element => {
        hashedProperty =
          element?.mobileId || element?.mobileAdId || element?.mobile_id;
        if (!isDefinedAndNotNullAndNotEmpty(hashedProperty)) {
          return;
        }
        hashedProperty = sha256(hashedProperty.toLowerCase());
        if (data[index].length >= 100000) {
          data.push([]);
          index += 1;
        }
        data[index].push([hashedProperty]);
      });
      break;

    default:
      throw new CustomError("Invalid schema", 400);
  }

  // if required field is not present in all the cases
  if (data[0].length === 0) {
    throw new ErrorBuilder()
      .setMessage(
        "[snapchat_custom_audience]::Required field(email/phone/mobileAdId) for the chosen schema should be sent."
      )
      .setStatus(400)
      .build();
  }

  let finalResponse = [];
  data.forEach(groupedData => {
    finalResponse.push(
      generateResponse(groupedData, schemaType, segmentId, metadata, type)
    );
  });
  return finalResponse;
};

const processEvent = (metadata, message, destination) => {
  const response = [];
  validatePayload(message);

  let payload;
  if (message.properties.listData.add) {
    payload = responseBuilder(metadata, message, destination, "add");
    response.push(...payload);
  }
  if (message.properties.listData.remove) {
    payload = responseBuilder(metadata, message, destination, "remove");
    response.push(...payload);
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
