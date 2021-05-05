/* eslint-disable no-nested-ternary */
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
  getValueFromMessage,
  getFieldValueFromMessage,
  getDestinationExternalID,
  getErrorRespEvents,
  getSuccessRespEvents,
} = require("../../util");
const {
  getMergeEndpoint,
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  PERSONS_ENDPOINT,
  PIPEDRIVE_IDENTIFY_EXCLUSION,
  PIPEDRIVE_GROUP_EXCLUSION,
  PIPEDRIVE_TRACK_EXCLUSION,
  LEADS_ENDPOINT
} = require("./config");
const {
  createNewOrganisation,
  searchPersonByCustomId,
  searchOrganisationByCustomId,
  getFieldValueOrThrowError,
  updateOrganisationTraits,
  renameCustomFields,
  getUserIDorExternalID,
  createPerson,
  CustomError
} = require("./util");

const identifyResponseBuilder = async (message, category, { Config }) => {
  // name is required field for destination payload
  
  // destUserId is external Id or provided userId
  let destUserId = getDestinationExternalID(message, "person_id");

  if(!destUserId) {
    if (!get(Config, "userIdToken")) {
      throw new CustomError("userId Token is required", 400);
    }

    const userId = getFieldValueFromMessage(message, "userIdOnly");
    if(!userId) {
      throw new CustomError("userId or person_id required", 400);
    }
    destUserId = userId;
  }

  /**
   * If userId token not provided, user with provided Id exists
   * make an update call with that id.
   */

  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);

  if (!get(payload, "name")) {
    const fname = getFieldValueFromMessage(message, "firstName");
    const lname = getFieldValueFromMessage(message, "lastName");
    if (!fname && !lname) {
      throw new Error("no name field found");
    }
    const name = `${fname || ""} ${lname || ""}`.trim();
    set(payload, "name", name);
  }

  const renameExclusionKeys = Object.keys(payload);

  payload = extractCustomFields(
    message,
    payload,
    ["traits", "context.traits"],
    PIPEDRIVE_IDENTIFY_EXCLUSION
  );

  payload = renameCustomFields(
    payload,
    Config,
    "personsMap",
    renameExclusionKeys
  );

  if (!get(Config, "userIdToken")) {
    // in this case, destUserId would be a valid person_id

    const response = defaultRequestConfig();
    response.body.JSON = removeUndefinedAndNullValues(payload);
    response.method = defaultPutRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    response.endpoint = PERSONS_ENDPOINT;
    response.params = {
      api_token: Config.apiToken
    };

    return response;
  }

  const person = await searchPersonByCustomId(destUserId, Config);

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
      api_token: Config.apiToken
    };

    return response;
  }

  /**
   * If person does not exist
   * create a new person with just the name field
   * and let the router make the update call with
   * rest of the payload properties.
   */

  set(payload, Config.userIdToken, destUserId);

  const createPayload = { name: get(payload, "name") };
  // eslint-disable-next-line no-unused-vars
  const createdPerson = await createPerson(createPayload, Config);

  delete payload.name;
  delete payload.add_time;

  // update call from Router
  const response = defaultRequestConfig();
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.method = defaultPutRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  response.endpoint = `${PERSONS_ENDPOINT}/${createdPerson.id}`;
  response.params = {
    api_token: Config.apiToken
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
const groupResponseBuilder = async (message, category, { Config }) => {
  /**
   * check if the person actually exists
   * either userId or anonId is required for group call
   */

  const destUserId = await getUserIDorExternalID(
    message, 
    Config
  );
  
  let groupId; let groupPayload; let org;

  if (!get(Config, "groupIdToken")) {
    /**
    * if groupId token is not provided, extract the ExternalId val for org_id
    */
    groupId = getDestinationExternalID(message, "org_id");
    if(!groupId) {
      throw new Error("groupId or externalId required for group call");
    }

    groupPayload = constructPayload(message, MAPPING_CONFIG[category.name]);
    const renameExclusionKeys = Object.keys(groupPayload);

    groupPayload = extractCustomFields(
      message,
      groupPayload,
      ["traits"],
      PIPEDRIVE_GROUP_EXCLUSION
    );

    groupPayload = renameCustomFields(
      groupPayload,
      Config,
      "organizationMap",
      renameExclusionKeys
    );
    
    groupPayload = removeUndefinedAndNullValues(groupPayload);
    if (get(groupPayload, "add_time")) {
      delete groupPayload.add_time;
    }

    org = await updateOrganisationTraits(groupId, groupPayload, Config);
    
    const response = defaultRequestConfig();
    response.body.JSON = {
      org_id: groupId
    };
    response.method = defaultPutRequestConfig.requestMethod;
    response.endpoint = `${PERSONS_ENDPOINT}/${destUserId}`;
    response.params = {
      api_token: Config.apiToken
    };
    response.headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    return response;
  }

  groupId = getFieldValueOrThrowError(
    message,
    "groupId",
    new CustomError("groupId is required for group call", 400)
  );

  groupPayload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const renameExclusionKeys = Object.keys(groupPayload);

  groupPayload = extractCustomFields(
    message,
    groupPayload,
    ["traits"],
    PIPEDRIVE_GROUP_EXCLUSION
  );

  groupPayload = renameCustomFields(
    groupPayload,
    Config,
    "organizationMap",
    renameExclusionKeys
  );
  groupPayload = removeUndefinedAndNullValues(groupPayload);

  org = await searchOrganisationByCustomId(groupId, Config);

  /**
   * if org does not exist, create a new org,
   * else update existing org with new traits
   * throws error if create or udpate fails
   */
  if (!org) {
    set(groupPayload, Config.groupIdToken, groupId);
    org = await createNewOrganisation(groupPayload, Config);
  } else {
    if (get(groupPayload, "add_time")) {
      delete groupPayload.add_time;
    }
    org = await updateOrganisationTraits(org.id, groupPayload, Config);
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
  response.endpoint = `${PERSONS_ENDPOINT}/${destUserId}`;
  response.params = {
    api_token: Config.apiToken
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
const aliasResponseBuilder = async (message, category, { Config }) => {
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
  if (!previousId) throw new CustomError("error: cannot merge without previousId", 400);

  const userId = getFieldValueOrThrowError(
    message,
    "userIdOnly",
    new CustomError("error: cannot merge without userId", 400)
  );

  if (!get(Config, "userIdToken")) {
    // if userId token not supplied
    // both userId and previousId are expected to be valid Pipedrive id

    const response = defaultRequestConfig();
    response.method = defaultPutRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    response.body.JSON = {
      "merge_with_id": userId
    };
    response.endpoint = `${PERSONS_ENDPOINT}/${previousId}`;
    response.params = {
      api_token: Config.apiToken
    };

    return response;
  }

  /**
   * Need to extract the pipedrive side integer id for the provided userId
   * and previous Id, i.e mapping Rudder side userId to pipedrive integer id
   */
  const prevPerson = await searchPersonByCustomId(previousId, Config);
  if (!prevPerson) {
    throw new CustomError("person not found. cannot merge", 400);
  }

  const currPerson = await searchPersonByCustomId(userId, Config);
  if (currPerson) {
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
      api_token: Config.apiToken
    };

    return response;
  }

  const response = defaultRequestConfig();
  response.method = defaultPutRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  response.body.JSON = {
    [get(Config, "userIdToken")]: userId
  };
  response.endpoint = `${PERSONS_ENDPOINT}/${prevPerson.id}`;
  response.params = {
    api_token: Config.apiToken
  };

  return response;
};

/**
 * Creates a lead and links it to user for track call.
 * Supports Ecom Events: "product viewed", "order completed"
 * @param {*} message
 * @param {*} category
 * @param {*} destination
 * @returns
 */
const trackResponseBuilder = async (message, category, { Config }) => {
  // TODO: maybe drop this check
  if (!get(message, "event")) {
    throw new CustomError("event type not specified", 400);
  }

  let payload;
  let endpoint;

  const destUserId = await getUserIDorExternalID(
    message,
    Config,
    new CustomError("cannot add track event without userId or external Id", 400)
  );

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
    Config,
    "leadsMap",
    renameExclusionKeys
  );

  set(payload, "person_id", destUserId);
  endpoint = LEADS_ENDPOINT;

  /* map price and currency to value object
  * in destination payload
  */
  if (payload.amount && payload.currency) {
    const value = {
      amount: payload.amount,
      currency: payload.currency
    };
    set(payload, "value", value);
  }
  delete payload.amount;
  delete payload.currency;

  const response = defaultRequestConfig();
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = endpoint;
  response.params = {
    api_token: Config.apiToken
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
      throw new CustomError("invalid event type", 400);
  }

  return builderResponse;
}

async function process(event) {
  const { message, destination } = event;
  let category;

  if (!message.type) throw new CustomError("message type is invalid", 400);

  const messageType = message.type.toLowerCase().trim();
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.ALIAS:
      // dummy since alias does have a mapping json
      category = { type: "alias" };
      break;
    case EventType.GROUP:
      category = CONFIG_CATEGORIES.GROUP;
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new CustomError("invalid message type", 400);
  }
  const res = await responseBuilderSimple(message, category, destination);
  return res;
}

const processRouterDest = async inputs => {
  if(!Array.isArray(inputs) || inputs.length === 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid events array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 500,
          error.message || "Error occurred while processing event."
        );
      }
    })
  );

  return respList;
};


module.exports = { process, processRouterDest };
