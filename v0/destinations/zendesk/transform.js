const get = require("get-value");
const set = require("set-value");
const axios = require("axios");

const { EventType } = require("../../../constants");
const { ConfigCategory, mappingConfig, defaultFields } = require("./config");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig,
  defaultDeleteRequestConfig
} = require("../util");

var endPoint;

function responseBuilder(message, headers, payload, endpoint) {
  const response = defaultRequestConfig();

  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = headers;
  response.userId = message.userId ? message.userId : message.anonymousId;
  response.body.JSON = payload;

  return response;
}

async function createUserFields(url, config, newFields, fieldJson) {
  let fieldData;
  // removing trailing 's' from fieldJson
  fieldJson = fieldJson.slice(0, -1);
  newFields.forEach(async field => {
    // create payload for each new user field
    fieldData = {
      [fieldJson]: {
        title: field,
        active: true,
        key: field,
        description: field
      }
    };

    try {
      const response = await axios.post(url, fieldData, config);
      if (response.status !== 201) {
        console.log("Failed to create User Field : ", field);
      }
    } catch (error) {
      if (error.response && error.response.status !== 422) {
        console.log("Cannot create User field ", field, error);
      }
    }
  });
}

async function checkAndCreateUserFields(
  traits,
  categoryEndpoint,
  fieldJson,
  headers
) {
  let newFields = [];

  const url = endPoint + categoryEndpoint;
  const config = { headers };

  try {
    const response = await axios.get(url, config);
    const fields = get(response.data, fieldJson);
    if (response.data && fields) {
      // get existing user_fields and concatenate them with default fields
      let existingKeys = fields.map(field => field.key);
      existingKeys = existingKeys.concat(defaultFields[fieldJson]);

      // check for new fields
      const traitKeys = Object.keys(traits);
      newFields = traitKeys.filter(
        key => !(existingKeys.includes(key) || typeof traits[key] === "object") // to handle traits.company.remove
      );

      if (newFields.length > 0) {
        await createUserFields(url, config, newFields, fieldJson);
      }
    }
  } catch (error) {
    console.log("Error :", error.response ? error.response.data : error);
  }
}

function getIdentifyPayload(message, category, destinationConfig) {
  mappingJson = mappingConfig[category.name];
  const payload = {};

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(payload, mappingJson[sourceKey], get(message, sourceKey));
  });

  if (payload.user.external_id) {
    set(payload, "user.user_fields.id", payload.user.external_id);
  }
  // send fields not in sourceKeys as user fields
  const traitKeys = Object.keys(message.context.traits);
  const userFields = traitKeys.filter(
    trait =>
      !(
        sourceKeys.includes("context.traits." + trait) ||
        typeof message.context.traits[trait] == "object"
      )
  );
  userFields.forEach(field => {
    set(
      payload,
      "user.user_fields." + field,
      get(message, "context.traits." + field)
    );
  });

  payload.user = removeUndefinedValues(payload.user);

  if (destinationConfig.createUsersAsVerified) {
    set(payload, "user.verified", true);
  }

  return payload;
}

async function getUserId(message, headers) {
  const userEmail = message.context.traits.email;
  const url = endPoint + `users/search.json?query=${userEmail}`;
  // let url  = endPoint + `users/search.json?external_id=${externalId}`;
  const config = { headers };

  try {
    const resp = await axios.get(url, config);

    if (!resp || !resp.data || resp.data.count === 0) {
      console.log("User not found");
      return undefined;
    }

    const zendeskUserId = resp.data.users[0].id;
    return zendeskUserId;
  } catch (error) {
    console.log(
      `Cannot get userId for externalId : ${externalId}`,
      error.response
    );
    return undefined;
  }
}

async function isUserAlreadyAssociated(userId, orgId, headers) {
  const url = `${endPoint}/users/${userId}/organization_memberships.json`;
  const config = { headers };
  const response = await axios.get(url, config);
  if (
    response.data &&
    response.data.organization_memberships.length > 0 &&
    response.data.organization_memberships[0].id == orgId
  ) {
    return true;
  }
  return false;
}

async function createUser(message, headers, destinationConfig) {
  const name = message.context.traits.name;
  const userId = message.userId ? message.userId : message.anonymousId;
  const email = message.context.traits.email;

  const userObject = { name, external_id: userId, email };
  if (destinationConfig.createUsersAsVerified) {
    userObject.verified = true;
  }
  const category = ConfigCategory.IDENTIFY;
  const url = endPoint + category.createOrUpdateUserEndpoint;
  const config = { headers };
  const payload = { user: userObject };

  try {
    const resp = await axios.post(url, payload, config);

    if (!resp.data || !resp.data.user || !resp.data.user.id) {
      console.log(`Couldn't create User: ${message.traits.name}`);
      throw new Error("user not found");
    }

    const userID = resp.data.user.id;
    const userEmail = resp.data.user.email;
    return { zendeskUserId: userID, email: userEmail };
  } catch (error) {
    console.log(error);
    console.log(`Couldn't find user: ${message.context.traits.name}`);
    throw new Error(`Couldn't find user: ${message.context.traits.name}`);
  }
}

async function getUserMembershipPayload(
  message,
  headers,
  orgId,
  destinationConfig
) {
  // let zendeskUserID = await getUserId(message.userId, headers);
  let zendeskUserID = await getUserId(message, headers);

  if (!zendeskUserID) {
    if (message.context.traits.name && message.context.traits.email) {
      const { zendeskUserId } = await createUser(
        message,
        headers,
        destinationConfig
      );
      zendeskUserID = zendeskUserId;
    }
  }

  const payload = {
    organization_membership: {
      user_id: zendeskUserID,
      organization_id: orgId
    }
  };

  return payload;
}

async function createOrganization(
  message,
  category,
  headers,
  destinationConfig
) {
  await checkAndCreateUserFields(
    message.traits,
    category.organizationFieldsEndpoint,
    category.organizationFieldsJson,
    headers
  );
  mappingJson = mappingConfig[category.name];
  const payload = {};

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(payload, mappingJson[sourceKey], get(message, sourceKey));
  });
  // console.log(payload);
  if (payload.organization.external_id) {
    set(
      payload,
      "organization.organization_fields.id",
      payload.organization.external_id
    );
  }
  const traitKeys = Object.keys(message.traits);
  const organizationFields = traitKeys.filter(
    trait =>
      !(
        sourceKeys.includes("traits." + trait) ||
        typeof message.context.traits[trait] == "object"
      )
  );
  organizationFields.forEach(field => {
    set(
      payload,
      "organization.organization_fields." + field,
      get(message, "traits." + field)
    );
  });

  payload.organization = removeUndefinedValues(payload.organization);

  if (destinationConfig.sendGroupCallsWithoutUserId && !message.userId) {
    return payload;
  }

  const url = endPoint + category.createEndpoint;
  const config = { headers };

  try {
    const resp = await axios.post(url, payload, config);

    if (!resp.data || !resp.data.organization) {
      console.log(`Couldn't create Organization: ${message.traits.name}`);
      return undefined;
    }

    const orgId = resp.data.organization.id;
    return orgId;
  } catch (error) {
    console.log(`Couldn't create Organization: ${message.traits.name}`);
    return undefined;
  }
}

function validateUserId(message) {
  if (!message.userId) {
    throw new Error(
      `Zendesk : UserId is a mandatory field for ${message.type}`
    );
  }
}

async function processIdentify(message, destinationConfig, headers) {
  validateUserId(message);
  const category = ConfigCategory.IDENTIFY;
  // create user fields if required
  await checkAndCreateUserFields(
    message.context.traits,
    category.userFieldsEndpoint,
    category.userFieldsJson,
    headers
  );

  const payload = getIdentifyPayload(message, category, destinationConfig);
  const url = endPoint + category.createOrUpdateUserEndpoint;
  const returnList = [];

  const traits = message.context.traits;
  if (
    traits.company &&
    traits.company.remove &&
    destinationConfig.removeUsersFromOrganization &&
    traits.company.id
  ) {
    const orgId = traits.company.id;
    const userId = await getUserId(message, headers);
    if (userId) {
      const membershipUrl = `${endPoint}users/${userId}/organization_memberships.json`;
      try {
        const config = { headers };
        const response = await axios.get(membershipUrl, config);
        if (
          response.data &&
          response.data.organization_memberships &&
          response.data.organization_memberships.length > 0
        ) {
          if (
            orgId == response.data.organization_memberships[0].organization_id
          ) {
            const membershipId = response.data.organization_memberships[0].id;
            const deleteResponse = defaultRequestConfig();

            deleteResponse.endpoint = `${endPoint}users/${userId}/organization_memberships/${membershipId}.json`;
            deleteResponse.method = defaultDeleteRequestConfig.requestMethod;
            deleteResponse.headers = headers;
            deleteResponse.userId = message.userId
              ? message.userId
              : message.anonymousId;
            returnList.push(deleteResponse);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  returnList.push(responseBuilder(message, headers, payload, url));
  return returnList;
}

async function processTrack(message, destinationConfig, headers) {
  validateUserId(message);
  let userEmail = message.context.traits.email;
  let zendeskUserID;
  // let url = endPoint + "users/search.json?external_id=" + userId;
  let url = endPoint + `users/search.json?query=${userEmail}`;
  const config = { headers };
  const userResponse = await axios.get(url, config);
  if (!userResponse || !userResponse.data || userResponse.data.count == 0) {
    const { zendeskUserId, email } = await createUser(
      message,
      headers,
      destinationConfig
    );
    if (!zendeskUserId) {
      throw new Error("user not found");
    }
    zendeskUserID = zendeskUserId;
    userEmail = email;
  }
  zendeskUserID = zendeskUserID || userResponse.data.users[0].id;
  userEmail = userEmail || userResponse.data.users[0].email;

  const eventObject = {};
  eventObject.description = message.event;
  eventObject.type = message.event;
  eventObject.source = "Rudder";
  eventObject.properties = message.properties;

  const profileObject = {};
  profileObject.type = message.event;
  profileObject.source = "Rudder";
  profileObject.identifiers = [{ type: "email", value: userEmail }];

  const eventPayload = { event: eventObject, profile: profileObject };
  url = endPoint + "users/" + zendeskUserID + "/events";

  const response = responseBuilder(message, headers, eventPayload, url);
  return response;
}

async function processGroup(message, destinationConfig, headers) {
  validateUserId(message);
  let category = ConfigCategory.GROUP;
  let payload;
  let url;

  if (destinationConfig.sendGroupCallsWithoutUserId && !message.userId) {
    payload = await createOrganization(
      message,
      category,
      headers,
      destinationConfig
    );
    url = endPoint + category.createEndpoint;
  } else {
    const orgId = await createOrganization(
      message,
      category,
      headers,
      destinationConfig
    );
    if (!orgId) {
      throw new Error(
        `Couldn't create user membership for user having external id ${message.userId} as Organization ${message.traits.name} wasn't created`
      );
    }
    // not removing this code - as it is a different implementation for group membership - may be needed later.
    /* payload = await getUserMembershipPayload(message, headers, orgId, destinationConfig);
    url = endPoint + category.userMembershipEndpoint;

    const userId = payload.organization_membership.user_id;
    if(isUserAlreadyAssociated(userId, orgId, headers)){
      throw new Error("user is already associated with organization");
    } */
    category = ConfigCategory.IDENTIFY;
    payload = getIdentifyPayload(message, category, destinationConfig);
    payload.user.organization_id = orgId;
    url = endPoint + category.createOrUpdateUserEndpoint;
    // return responseBuilder(message, headers, payload, url);
  }

  return responseBuilder(message, headers, payload, url);
}

async function processSingleMessage(event) {
  const message = event.message;
  const destinationConfig = event.destination.Config;
  const messageType = message.type.toLowerCase();
  const unencodedBase64Str =
    destinationConfig.email + "/token:" + destinationConfig.apiToken;
  const headers = {
    Authorization:
      "Basic " + Buffer.from(unencodedBase64Str).toString("base64"),
    "Content-Type": "application/json"
  };

  switch (messageType) {
    case EventType.IDENTIFY:
      return processIdentify(message, destinationConfig, headers);
    case EventType.GROUP:
      return processGroup(message, destinationConfig, headers);
    case EventType.TRACK:
      return processTrack(message, destinationConfig, headers);
    default:
      throw new Error("Message type not supported");
  }
}

async function process(event) {
  endPoint = `https://${event.destination.Config.domain}.zendesk.com/api/v2/`;
  const resp = await processSingleMessage(event);
  return resp;
}

exports.process = process;
