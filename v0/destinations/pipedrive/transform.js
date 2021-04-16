/* eslint-disable camelcase */
const get = require("get-value");
const {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  PERSONS_ENDPOINT,
  PIPEDRIVE_IDENTIFY_EXCLUSION,
  PIPEDRIVE_GROUP_EXCLUSION,
  getMergeEndpoint
} = require("./config");
const { EventType } = require("../../../constants");
const {
  constructPayload,
  extractCustomFields,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  getValueFromMessage,
  getFieldValueFromMessage
} = require("../../util");
const {
  createNewOrganisation,
  searchPersonByCustomId,
  searchOrganisationByCustomId
} = require("./util");
const set = require("set-value");

const identifyResponseBuilder = async (message, category, destination) => {
  // name is required field. If name is not present, construct payload will
  // throw error
  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  payload = extractCustomFields(
    message,
    payload,
    ["traits", "context.traits"],
    PIPEDRIVE_IDENTIFY_EXCLUSION
  );

  const userIdValue = getFieldValueFromMessage(message, "userId");
  const person = await searchPersonByCustomId(userIdValue, destination);

  // update person since person already exists
  if (person) {
    const response = defaultRequestConfig();
    response.method = defaultPutRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    response.body.JSON = removeUndefinedAndNullValues(payload);
    response.endpoint = `${PERSONS_ENDPOINT}/${person.id}`;
    response.params = {
      api_token: destination.Config.api_token
    };

    return response;
  }

  // mapping userId to custom userId key field
  // in destination payload
  set(payload, destination.Config.userIdKey, userIdValue);

  // create a new person
  const response = defaultRequestConfig();
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  response.endpoint = PERSONS_ENDPOINT;
  response.params = {
    api_token: destination.Config.api_token
  };

  return response;
};

// for group call, only extracting from traits, and not context.traits
// verify once
const groupResponseBuilder = async (message, category, destination) => {
  // name is required field. If name is not present, construct payload will
  // throw error

  const groupId = getFieldValueFromMessage(message, "groupId");
  if (!groupId) throw new Error("groupId is required for group call");

  let groupPayload = constructPayload(message, MAPPING_CONFIG[category.name]);

  groupPayload = extractCustomFields(
    message,
    groupPayload,
    ["traits", "context.traits"],
    PIPEDRIVE_GROUP_EXCLUSION
  );

  let org = await searchOrganisationByCustomId(groupId, destination);

  // if org does not exist, create a new org
  // and add the person to that org
  if (!org) {
    org = await createNewOrganisation(groupPayload, destination);
    // set custom org Id field value to groupId
    set(org, destination.Config.groupIdKey, groupId);
  }

  // check if the person actually exists
  // either userId or anonId is required for group call
  const userIdVal = getFieldValueFromMessage(message, "userId");
  const person = await searchPersonByCustomId(userIdVal, destination);

  if (!person) throw new Error("person not found");

  // TODO: should the group be updated with the new traits if any ?

  // update org_id field for that person
  const response = defaultRequestConfig();
  response.body.JSON = {
    org_id: org.id
  };
  response.method = defaultPutRequestConfig.requestMethod;
  response.endpoint = `${PERSONS_ENDPOINT}/${person.id}`;
  response.params = {
    api_token: destination.Config.api_token
  };

  return response;
};

const aliasResponseBuilder = async (message, category, destination) => {
  /**
   * merge previous Id to userId
   * merge id to merge_with_id
   * destination payload structure: { "merge_with_id": "userId"}
   */
  const previousId = getValueFromMessage(mesage, "previousId");
  if (!previousId) throw new Error("error: cannot merge without previousId");

  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  const response = defaultRequestConfig();
  response.method = defaultPutRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.endpoint = getMergeEndpoint(previousId);
  response.params = {
    api_token: destination.Config.api_token
  };

  return response;
};

async function responseBuilderSimple(message, category, destination) {
  let builderResponse;

  switch (category.type) {
    case EventType.IDENTIFY:
      builderResponse = await identifyResponseBuilder(
        message,
        category,
        destination
      );
      break;

    case EventType.GROUP:
      builderResponse = await groupResponseBuilder(
        message,
        category,
        destination
      );
      break;

    case EventType.ALIAS:
      builderResponse = await aliasResponseBuilder(
        message,
        category,
        destination
      );
      break;

    default:
      break;
  }

  return builderResponse;
}

async function process(event) {
  const { message, destination } = event;
  let category;

  if (!message.type) throw new Error("message type is invalid");

  const messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.ALIAS:
      category = CONFIG_CATEGORIES.ALIAS;
      break;
    default:
      throw new Error("invalid message type");
  }
  const res = await responseBuilderSimple(message, category, destination);
  return res;
}

exports.process = process;
