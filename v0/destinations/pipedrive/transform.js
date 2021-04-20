/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
const get = require("get-value");
const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  constructPayload,
  extractCustomFields,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  getValueFromMessage
} = require("../../util");
const {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  PERSONS_ENDPOINT,
  PIPEDRIVE_IDENTIFY_EXCLUSION,
  PIPEDRIVE_GROUP_EXCLUSION,
  PIPEDRIVE_PRODUCT_VIEWED_EXCLUSION,
  PIPEDRIVE_TRACK_EXCLUSION,
  PIPEDRIVE_ORDER_COMPLETED_EXCLUSION,
  getMergeEndpoint,
  LEADS_ENDPOINT,
  PRODUCTS_ENDPOINT
} = require("./config");
const {
  createNewOrganisation,
  searchPersonByCustomId,
  searchOrganisationByCustomId,
  getFieldValueOrThrowError,
  updateOrganisationTraits,
  updatePerson,
  renameCustomFields
} = require("./util");

/**
 * Config structure so far
 * {
 *    "api_token": "asfaaf31423csaf",
 *    "groupIdToken": "sfhijsfh",
 *    "userIdToken": "nzoicb88714sCV"
 * }
 *
 * New potential Config structure
 * shall contain all custom field id vs api_key mappings
 * {
 *    "api_token": "asfaaf31423csaf",
 *    "r_group_id": "sfhijsfh",
 *    "r_user_id": "nzoicb88714sCV",
 *    "customFieldsMap": {
 *        "person": {
 *          "relation_status": "relstatusapi_key",
 *          "district": "distapi_key",
 *          ...
 *        },
 *        "product": {...},
 *        "leads": {...},
 *        "organization": {...},
 *        "track": {...}
 *     }
 * }
 *
 */
const identifyResponseBuilder = async (message, category, destination) => {
  // name is required field. If name is not present, construct payload will
  // throw error
  const userIdValue = getFieldValueOrThrowError(
    message,
    "userId",
    new Error("userId is required")
  );

  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const renameExclusionKeys = Object.keys(payload);

  payload = extractCustomFields(
    message,
    payload,
    ["traits", "context.traits"],
    PIPEDRIVE_IDENTIFY_EXCLUSION
  );

  payload = renameCustomFields(
    payload, 
    destination.Config.fieldsMap, 
    "person",
    renameExclusionKeys
  );

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

/**
 * for group call, extracting from both traits and context.traits
 * VERIFY ONCE
 * @param {*} message
 * @param {*} category
 * @param {*} destination
 * @returns
 */
const groupResponseBuilder = async (message, category, destination) => {
  /**
   * check if the person actually exists
   * either userId or anonId is required for group call
   */
  const userIdVal = getFieldValueOrThrowError(
    message,
    "userId",
    new Error("error: userId is required")
  );

  const person = await searchPersonByCustomId(userIdVal, destination);
  if (!person) throw new Error("person not found");

  const groupId = getFieldValueOrThrowError(
    message,
    "groupId",
    new Error("groupId is required for group call")
  );

  let groupPayload = constructPayload(message, MAPPING_CONFIG[category.name]);
  groupPayload = removeUndefinedAndNullValues(groupPayload);
  
  const renameExclusionKeys = Object.keys(groupPayload);

  groupPayload = extractCustomFields(
    message,
    groupPayload,
    ["traits", "context.traits"],
    PIPEDRIVE_GROUP_EXCLUSION
  );

  groupPayload = renameCustomFields(
    groupPayload,
    destination.Config.fieldsMap,
    "organization",
    renameExclusionKeys
  );

  let org = await searchOrganisationByCustomId(groupId, destination);

  /**
   * if org does not exist, create a new org,
   * else update existing org with new traits
   * throws error if create or udpate fails
   */
  if (!org) {
    org = await createNewOrganisation(groupPayload, destination);
    set(org, destination.Config.groupIdKey, groupId);
  } else {
    if (get(groupPayload, "add_time")) delete groupPayload.add_time;
    await updateOrganisationTraits(groupId, groupPayload, destination);
  }

  /**
   * Add the person to that org
   * update org_id field for that person
   */
  const response = defaultRequestConfig();
  response.body.JSON = {
    org_id: org.id
  };
  response.method = defaultPutRequestConfig.requestMethod;
  response.endpoint = `${PERSONS_ENDPOINT}/${person.id}`;
  response.params = {
    api_token: destination.Config.api_token
  };
  response.headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  return response;
};

/**
 * Merges two Persons
 * @param {*} message
 * @param {*} category
 * @param {*} destination
 * @returns
 */
const aliasResponseBuilder = async (message, category, destination) => {
  /**
   * merge previous Id to userId
   * merge id to merge_with_id
   * destination payload structure: { "merge_with_id": "userId"}
   */
  const previousId = getValueFromMessage(message, [
    "previousId",
    "traits.previousId",
    "context.traits.previousId"
  ]);
  if (!previousId) throw new Error("error: cannot merge without previousId");

  const userId = getFieldValueOrThrowError(
    message,
    "userId",
    new Error("error: cannot merge without userId")
  );

  /**
   * Need to extract the pipedrive side integer id for the provided userId
   * and previous Id, i.e mapping Rudder side userId to pipedrive integer id
   */
  const prevPerson = await searchPersonByCustomId(previousId, destination);
  if (!prevPerson) throw new Error("person not found. cannot merge");

  const currPerson = await searchPersonByCustomId(userId, destination);
  if (!currPerson) throw new Error("person not found. cannot merge");

  let updatePayload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const renameExclusionKeys = Object.keys(updatePayload);

  updatePayload = extractCustomFields(
    message,
    updatePayload,
    ["traits", "context.traits"],
    PIPEDRIVE_IDENTIFY_EXCLUSION
  );

  updatePayload = renameCustomFields(
    updatePayload,
    destination.Config.fieldsMap,
    "person",
    renameExclusionKeys
  );

  updatePayload = removeUndefinedAndNullValues(updatePayload);

  /**
   * if traits is not empty, update the current person first
   * and then call the merge endpoint
   */
  if (Object.keys(updatePayload).length !== 0)
    updatePerson(currPerson.id, updatePayload, destination);

  const response = defaultRequestConfig();
  response.method = defaultPutRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  response.body.JSON = {
    merge_with_id: currPerson.id
  };
  response.endpoint = getMergeEndpoint(prevPerson.id);
  response.params = {
    api_token: destination.Config.api_token
  };

  return response;
};

/**
 * Creates a lead and links it to user.
 * Supports Ecom Events: "product viewed", "order completed"
 * @param {*} message
 * @param {*} category
 * @param {*} destination
 * @returns
 */
const trackResponseBuilder = async (message, category, destination) => {

  let event = get(message, "event");
  if (!event) throw new Error("event type not specified");

  let payload;
  let endpoint;
  event = event.toLowerCase().trim();

  if (event === "product viewed") {
    payload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.PRODUCT_VIEWED.name]
    );

    const renameExclusionKeys = Object.keys(payload);

    payload = extractCustomFields(
      message,
      payload,
      ["properties"],
      PIPEDRIVE_PRODUCT_VIEWED_EXCLUSION
    );

    payload = renameCustomFields(
      payload,
      destination.Config.fieldsMap,
      "product",
      renameExclusionKeys
    );
    set(payload, "active_flag", 0);

    endpoint = PRODUCTS_ENDPOINT;
  } 
  else if (event === "order completed") {
    payload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.ORDER_COMPLETED.name]
    );

    const renameExclusionKeys = Object.keys(payload);

    payload = extractCustomFields(
      message,
      payload,
      ["properties"],
      PIPEDRIVE_ORDER_COMPLETED_EXCLUSION
    );

    payload = renameCustomFields(
      payload,
      destination.Config.fieldsMap,
      "product",
      renameExclusionKeys
    );
    set(payload, "active_flag", 1);

    endpoint = PRODUCTS_ENDPOINT;
  } 
  else {
    const userId = getFieldValueOrThrowError(
      message,
      "userId",
      new Error("userId required for event tracking")
    );

    const person = await searchPersonByCustomId(userId, destination);
    if (!person) {
      throw new Error("person not found, cannot add track event");
    }

    payload = constructPayload(message, MAPPING_CONFIG[category.name]);
    const renameExclusionKeys = Object.keys(payload);

    payload = extractCustomFields(
      message,
      payload,
      ["properties"],
      PIPEDRIVE_TRACK_EXCLUSION
    );
    
    payload = renameCustomFields(
      payload,
      destination.Config.fieldsMap,
      "track",
      renameExclusionKeys
    );

    set(payload, "person_id", person.id);
    endpoint = LEADS_ENDPOINT;
  }

  const response = defaultRequestConfig();
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = endpoint;
  response.params = {
    api_token: destination.Config.api_token
  };
  response.headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
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

    case EventType.TRACK:
      builderResponse = await trackResponseBuilder(
        message,
        category,
        destination
      );
      break;

    default:
      throw new Error("invalid event type");
  }

  return builderResponse;
}

async function process(event) {
  const { message, destination } = event;
  let category;

  if (!message.type) throw new Error("message type is invalid");

  const messageType = message.type.toLowerCase().trim();
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.ALIAS:
      category = CONFIG_CATEGORIES.ALIAS;
      break;
    case EventType.GROUP:
      category = CONFIG_CATEGORIES.GROUP;
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new Error("invalid message type");
  }
  const res = await responseBuilderSimple(message, category, destination);
  return res;
}

exports.process = process;
