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

const addUserResponseBuilder = (metadata, message, { Config }) => {
  const { schema, audienceId } = Config;
  //   const resp = constructPayload(
  //     message,
  //     mappingConfig[ConfigCategory.AUDIENCE_LIST.name]
  //   );

  const payload = { schema: [], data: [] };
  let schemaType;
  let hashedProperty;
  switch (schema) {
    case "email":
      schemaType = "EMAIL_SHA256";
      hashedProperty = message.properties.listData.add[0].email;
      hashedProperty = sha256(hashedProperty.toLowerCase().trim());
      break;
    case "phone":
      schemaType = "PHONE_SHA256";
      hashedProperty =
        message.properties.listData.add.phone ||
        message.properties.listData.add.mobile;
      hashedProperty = sha256(
        hashedProperty
          .toLowerCase()
          .trim()
          .replace(/^0+/, "")
          .replace(/[^0-9]/g, "")
      );
      break;
    case "mobileAdId":
      schemaType = "MOBILE_AD_ID_SHA256";
      hashedProperty =
        message.properties.listData.add.mobileId ||
        message.properties.listData.add.mobileAdId ||
        message.properties.listData.add.mobile_id;
      hashedProperty = sha256(hashedProperty.toLowerCase());
      break;
    default:
      throw new CustomError("Invalid schema", 400);
  }

  payload.schema.push(schemaType);
  payload.data.push(hashedProperty);

  const response = defaultRequestConfig();

  response.endpoint = `${BASE_URL}/segments/${audienceId}/users`;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  const accessToken = getAccessToken(metadata);
  //   response.params = { listId: Config.listId, customerId: filteredCustomerId };
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  };

  return response;
};

const removeUserResponseBuilder = (metadata, message, { Config }) => {
  const { schema, audienceId } = Config;

  const payload = { id: `${audienceId}`, schema: [], data: [] };
  let schemaType;
  let hashedProperty;
  switch (schema) {
    case "email":
      schemaType = "EMAIL_SHA256";
      hashedProperty = message.properties.listData.add[0].email;
      hashedProperty = sha256(hashedProperty.toLowerCase().trim());
      break;
    case "phone":
      schemaType = "PHONE_SHA256";
      hashedProperty =
        message.properties.listData.add.phone ||
        message.properties.listData.add.mobile;
      hashedProperty = sha256(
        hashedProperty
          .toLowerCase()
          .trim()
          .replace(/^0+/, "")
          .replace(/[^0-9]/g, "")
      );
      break;
    case "mobileAdId":
      schemaType = "MOBILE_AD_ID_SHA256";
      hashedProperty =
        message.properties.listData.add.mobileId ||
        message.properties.listData.add.mobileAdId ||
        message.properties.listData.add.mobile_id;
      hashedProperty = sha256(hashedProperty.toLowerCase());
      break;
    default:
      throw new CustomError("Invalid schema", 400);
  }

  payload.schema.push(schemaType);
  payload.data.push(hashedProperty);

  const response = {
    version: "1",
    type: "REST",
    method: "DELETE",
    endpoint: "",
    headers: {},
    params: {},
    body: {
      JSON: {},
      JSON_ARRAY: {},
      XML: {},
      FORM: {}
    },
    files: {}
  };

  response.endpoint = `${BASE_URL}/segments/${audienceId}/users`;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  const accessToken = getAccessToken(metadata);
  //   response.params = { listId: Config.listId, customerId: filteredCustomerId };
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  };

  return response;
};

const processEvent = async (metadata, message, destination) => {
  const response = [];
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
  if (message.type.toLowerCase() === "audiencelist") {
    let payload;
    if (message.properties.listData.add) {
      payload = addUserResponseBuilder(metadata, message, destination);
    } else if (message.properties.listData.remove) {
      payload = removeUserResponseBuilder(metadata, message, destination);
    } else {
      throw new ErrorBuilder()
        .setMessage(
          "[snapchat_custom_audience]:: Neither 'add' nor 'remove' property is present inside 'listData'. Aborting message."
        )
        .setStatus(400)
        .build();
    }

    response.push(payload);
    return response;
  }

  throw new ErrorBuilder()
    .setMessage(
      `[snapchat_custom_audience]::Message Type ${message.type} not supported.`
    )
    .setStatus(400)
    .build();
};

const process = async event => {
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
