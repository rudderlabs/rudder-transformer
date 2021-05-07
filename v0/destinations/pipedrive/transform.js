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
  groupFieldMapping,
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  PERSONS_ENDPOINT,
  PIPEDRIVE_GROUP_EXCLUSION,
  PIPEDRIVE_TRACK_EXCLUSION,
  LEADS_ENDPOINT,
  FLATTEN_KEYS
} = require("./config");
const {
  createNewOrganisation,
  searchPersonByCustomId,
  searchOrganisationByCustomId,
  getFieldValueOrThrowError,
  updateOrganisationTraits,
  renameCustomFields,
  createPerson,
  extractPersonData,
  CustomError,
  selectAndFlatten
} = require("./util");

const identifyResponseBuilder = async (message, { Config }) => {
  // name is required field for destination payload
  
  const userIdToken = get(Config, "userIdToken");
  if (!userIdToken) {
    throw new CustomError("userId Token is required", 400);
  }

  const externalId = getDestinationExternalID(message, "pipedrivePersonId");
  let payload;

  if(externalId) {
    // if externalId provided, call update endpoint
    payload = extractPersonData(message, Config, ["traits", "context.traits"], true);
    set(payload, userIdToken, externalId);

    const response = defaultRequestConfig();
    response.body.JSON = removeUndefinedAndNullValues(payload);
    response.method = defaultPutRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    response.endpoint = `${PERSONS_ENDPOINT}/${externalId}`;
    response.params = {
      api_token: Config.apiToken
    };

    return response;
  }

  const userId = getFieldValueFromMessage(message, "userIdOnly");
  if(!userId) {
    throw new CustomError("userId or pipedrivePersonId required", 400);
  }

  let person = await searchPersonByCustomId(userId, Config);
  if(!person) {
    if(!Config.enableUserCreation) {
      throw new CustomError("person not found, and userCreation is turned off on dashboard", 400);
    }

    const createPayload = {
      [userIdToken]: userId,
      add_time: getValueFromMessage(message, [
        "traits.add_time", 
        "context.traits.add_time", 
        "originalTimestamp"
      ])
    };
  
    person = await createPerson(createPayload, Config);
    if (!person) {
      throw new CustomError("Person could not be created in Pipedrive");
    }
  }

  payload = extractPersonData(message, Config, ["traits", "context.traits"], true);

  // update person from router
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
};

/**
 * for group call, extracting from both traits and context.traits
 * VERIFY ONCE
 * @param {*} message
 * @param {*} category
 * @param {*} destination
 * @returns
 */
const groupResponseBuilder = async (message, { Config }) => {

  let groupId;
  let userId;
  let groupPayload;
  let org;

  const externalGroupId = getDestinationExternalID(message, "pipedriveGroupId");
  const externalUserId = getDestinationExternalID(message, "pipedrivePersonId");

  if(!externalGroupId) {
    if(!get(Config, "groupIdToken")) {
      throw new CustomError("groupIdToken token required", 400);
    }
    groupId = getFieldValueOrThrowError(
      message,
      "groupId",
      new CustomError("groupId is required for group call", 400)
    );
  }

  if(!externalUserId) {
    if(!get(Config, "userIdToken")) {
      throw new CustomError("userIdToken token required", 400);
    }
    userId = await getFieldValueOrThrowError(
      message,
      "userIdOnly",
      new CustomError("userId is required for group call", 400)
    );
  }

  groupPayload = constructPayload(message, groupFieldMapping);
  const renameExclusionKeys = Object.keys(groupPayload);

  groupPayload = extractCustomFields(
    message,
    groupPayload,
    ["traits"],
    PIPEDRIVE_GROUP_EXCLUSION,
    FLATTEN_KEYS
  );

  groupPayload = selectAndFlatten(groupPayload, ["address", "Address"]);

  groupPayload = renameCustomFields(
    groupPayload,
    Config,
    "organizationMap",
    renameExclusionKeys
  );

  groupPayload = removeUndefinedAndNullValues(groupPayload);

  let destGroupId;

  if(externalGroupId) {
    if (get(groupPayload, "add_time")) {
      delete groupPayload.add_time;
    }
    org = await updateOrganisationTraits(externalGroupId, groupPayload, Config);
    destGroupId = externalGroupId;
  } else {
    // search group with custom Id
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

    destGroupId = org.id;
  }

  if (externalUserId) {
    const response = defaultRequestConfig();
    response.body.JSON = {
      org_id: destGroupId
    };
    response.method = defaultPutRequestConfig.requestMethod;
    response.endpoint = `${PERSONS_ENDPOINT}/${externalUserId}`;
    response.params = {
      api_token: Config.apiToken
    };
    response.headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    return response;
  }

  // if custom userId is provided, search for person
  const person = await searchPersonByCustomId(userId, Config);

  // create user if not found and flag is on
  let personId;
  if(!person) {
    if(Config.enableUserCreation) {
      const personPayload = extractPersonData(message, Config, ["context.traits"]);
      // set userId
      set(personPayload, Config.userIdToken, userId);
      const createdPerson = await createPerson(personPayload, Config);
      personId = createdPerson.id;
    }
    else {
      throw new CustomError("person not found for group call", 400);
    }
  }
  else {
    personId = person.id;
  }

  const response = defaultRequestConfig();
  response.body.JSON = {
    org_id: destGroupId
  };
  response.method = defaultPutRequestConfig.requestMethod;
  response.endpoint = `${PERSONS_ENDPOINT}/${personId}`;
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

  // extracting all for brevity
  const prevPipedriveId = getDestinationExternalID(message, "prev_person_id");
  const currPipedriveId = getDestinationExternalID(message, "curr_person_id");
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  const previousId = getValueFromMessage(message, [
    "previousId",
    "traits.previousId",
    "context.traits.previousId"
  ]);

  let prevId;
  let currId;

  if(prevPipedriveId) {
    prevId = prevPipedriveId
  }
  else if(previousId) {
    if(!get(Config, "userIdToken")) {
      throw new CustomError("userId token not found", 400);
    }
    const person = await searchPersonByCustomId(previousId, Config);
    if(!person) {
      throw new CustomError("previous user not found", 400);
    }

    prevId = person.id;
  }
  else {
    throw new CustomError("previous id not found", 400);
  }


  if(currPipedriveId) {
    currId = currPipedriveId
  }
  else if (userId) {
    if(!get(Config, "userIdToken")) {
      throw new CustomError("userId token not found", 400);
    }

    const person = await searchPersonByCustomId(userId, Config);
    if (!person) {
      // update the prevPipedriveId user with `userId` as new custom user id

      const response = defaultRequestConfig();
      response.method = defaultPutRequestConfig.requestMethod;
      response.headers = {
        "Content-Type": "application/json",
        Accept: "application/json"
      };
      response.body.JSON = {
        [get(Config, "userIdToken")]: userId
      };
      response.endpoint = `${PERSONS_ENDPOINT}/${prevId}`;
      response.params = {
        api_token: Config.apiToken
      };
      response.body.JSON = {
        [get(Config, "userIdToken")]: userId
      };
      return response;
    }

    currId = person.id;
  }
  else {
    throw new CustomError("userId not found", 400);
  }

  const response = defaultRequestConfig();
  response.method = defaultPutRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  response.body.JSON = {
    "merge_with_id": currId
  };
  response.endpoint = getMergeEndpoint(prevId);
  response.params = {
    api_token: Config.apiToken
  };
  return response;
};

/**
 * Creates a lead and links it to user for track call.
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

  let pipedrivePersonId = getDestinationExternalID(message, "pipedrivePersonId");

  if (!pipedrivePersonId) {
    if (!get(Config, "userIdToken")) {
      throw new CustomError("userId Token is required", 400);
    }

    const userId = getFieldValueFromMessage(message, "userIdOnly");
    if (!userId) {
      throw new CustomError("userId or person_id required", 400);
    }

    const person = await searchPersonByCustomId(userId, Config);
    if(!person) {
      if(!Config.enableUserCreation) {
        throw new CustomError("person not found", 400);
      }

      // create new person if flag enabled
      const createPayload = extractPersonData(message, Config, ["context.traits"]);
      
      // set userId and timestamp
      set(createPayload, Config.userIdToken, userId);
      set(createPayload, "add_time", getValueFromMessage(message, [
        "traits.add_time", 
        "context.traits.add_time", 
        "originalTimestamp"
      ]));

      const createdPerson = await createPerson(createPayload, Config);
      pipedrivePersonId = createdPerson.id;
    } 
    else {
      pipedrivePersonId = person.id;
    }
  }

  let payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const renameExclusionKeys = Object.keys(payload);

  payload = extractCustomFields(
    message,
    payload,
    ["properties"],
    PIPEDRIVE_TRACK_EXCLUSION,
    true
  );

  payload = renameCustomFields(
    payload,
    Config,
    "leadsMap",
    renameExclusionKeys
  );

  set(payload, "person_id", pipedrivePersonId);

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
  response.endpoint = LEADS_ENDPOINT;
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
        destination
      );
      break;

    case EventType.GROUP:
      builderResponse = await groupResponseBuilder(
        message,
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

  if (!message.type) {
    throw new CustomError("message type is invalid", 400);
  }

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
