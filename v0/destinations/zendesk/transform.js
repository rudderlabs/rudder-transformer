const get = require("get-value");
const set = require("set-value");
const axios = require("axios");

const { EventType } = require("../../../constants");
const {
  ConfigCategory,
  mappingConfig,
  defaultFields,
  ZENDESK_MARKET_PLACE_NAME,
  ZENDESK_MARKET_PLACE_ORG_ID,
  ZENDESK_MARKET_PLACE_APP_ID
} = require("./config");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig,
  defaultDeleteRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  defaultPutRequestConfig
} = require("../../util");
const logger = require("../../../logger");
const { httpGET, httpPOST } = require("../../../adapters/network");

let endPoint;

function responseBuilder(message, headers, payload, endpoint) {
  const response = defaultRequestConfig();

  const updatedHeaders = {
    ...headers,
    "X-Zendesk-Marketplace-Name": ZENDESK_MARKET_PLACE_NAME,
    "X-Zendesk-Marketplace-Organization-Id": ZENDESK_MARKET_PLACE_ORG_ID,
    "X-Zendesk-Marketplace-App-Id": ZENDESK_MARKET_PLACE_APP_ID
  };

  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = updatedHeaders;
  response.userId = message.anonymousId;
  response.body.JSON = payload;

  return response;
}

/**
 * Returns the payload for updating primary email of users.
 * @param {*} userIdentityId -> userIdentity Id
 * @param {*} userId -> userId of users
 * @param {*} headers -> Authorizations for API's call
 * @returns
 */
const responseBuilderToSetPrimaryAccount = (
  userIdentityId,
  userId,
  headers
) => {
  const response = defaultRequestConfig();
  const updatedHeaders = {
    ...headers,
    "X-Zendesk-Marketplace-Name": ZENDESK_MARKET_PLACE_NAME,
    "X-Zendesk-Marketplace-Organization-Id": ZENDESK_MARKET_PLACE_ORG_ID,
    "X-Zendesk-Marketplace-App-Id": ZENDESK_MARKET_PLACE_APP_ID
  };
  response.endpoint = `${endPoint}users/${userId}/identities/${userIdentityId}/make_primary`;
  response.method = defaultPutRequestConfig.requestMethod;
  response.headers = updatedHeaders;
  return response;
};

/**
 * ref: https://developer.zendesk.com/api-reference/ticketing/users/user_identities/#list-identities
 * ref: https://developer.zendesk.com/api-reference/ticketing/users/user_identities/#create-identity
 * This function search identity from userId and fetch its details, if that identity doesn't exists
 * then it will create the identity and takes the id for it.
 * @param {*} userId -> userId of users
 * @param {*} primaryEmail -> primary email passed in payload used to set this email as primary account.
 * @param {*} headers -> Authorizations for API's call
 * @returns it returns identityId or undefined if it gives error.
 */
const getUserIdentityId = async (
  userId,
  primaryEmail,
  headers,
  destinationConfig
) => {
  const url = `${endPoint}users/${userId}/identities`;
  const config = { headers };
  try {
    const res = await httpGET(url, config);
    if (
      res.success === false ||
      !res.response ||
      !res.response.data ||
      res.response.data.count === 0
    ) {
      logger.debug("Failed in fetching Identity details");
      return undefined;
    }
    const { identities } = res.response?.data;
    if (identities && Array.isArray(identities)) {
      const identitiesDetails = identities.find(
        identitieslist => identitieslist.value === primaryEmail
      );
      if (identitiesDetails) {
        return identitiesDetails.id;
      }
    }
    // If Identity doesn't exists then it will create the Identity.
    const createIdentityUrl = `${endPoint}/users/${userId}/identities`;
    const payloadBody = {
      identity: {
        type: "email",
        value: primaryEmail
      }
    };
    if (destinationConfig.createUsersAsVerified)
      payloadBody.identity = { ...payloadBody.identity, verified: true };
    const responseIdentity = await httpPOST(
      createIdentityUrl,
      payloadBody,
      config
    );
    if (
      responseIdentity.success === false ||
      !responseIdentity.response ||
      !responseIdentity.response.data ||
      !responseIdentity.response.data.identity
    ) {
      logger.debug("Failed in creating Identity.");
      return undefined;
    }
    return responseIdentity.response.data?.identity?.id;
  } catch (error) {
    logger.debug("Error :", error.response ? error.response.data : error);
    return undefined;
  }
};

async function createUserFields(url, config, newFields, fieldJson) {
  let fieldData;
  // removing trailing 's' from fieldJson
  const fieldJsonSliced = fieldJson.slice(0, -1);
  newFields.forEach(async field => {
    // create payload for each new user field
    fieldData = {
      [fieldJsonSliced]: {
        title: field,
        active: true,
        key: field,
        description: field
      }
    };

    try {
      const response = await axios.post(url, fieldData, config);
      if (response.status !== 201) {
        logger.debug("Failed to create User Field : ", field);
      }
    } catch (error) {
      if (error.response && error.response.status !== 422) {
        logger.debug("Cannot create User field ", field, error);
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
    logger.debug("Error :", error.response ? error.response.data : error);
  }
}

function getIdentifyPayload(message, category, destinationConfig, type) {
  const mappingJson = mappingConfig[category.name];

  const traits =
    type === "group"
      ? get(message, "context.traits")
      : getFieldValueFromMessage(message, "traits");

  const payload = constructPayload(traits, mappingJson);
  if (!payload.user) {
    payload.user = {};
  }
  payload.user.external_id =
    get(traits, "userId") || get(traits, "id") || message.userId;

  const sourceKeys = defaultFields[ConfigCategory.IDENTIFY.userFieldsJson];

  if (payload.user.external_id) {
    set(payload, "user.user_fields.id", payload.user.external_id);
  }

  // send fields not in sourceKeys as user fields
  const userFields = Object.keys(traits).filter(
    trait => !(sourceKeys.includes(trait) || typeof traits[trait] === "object")
  );
  userFields.forEach(field => {
    set(payload, `user.user_fields.${field}`, get(traits, field));
  });

  payload.user = removeUndefinedValues(payload.user);

  if (destinationConfig.createUsersAsVerified) {
    set(payload, "user.verified", true);
  }

  return payload;
}

async function getUserId(message, headers, type) {
  const traits =
    type === "group"
      ? get(message, "context.traits")
      : getFieldValueFromMessage(message, "traits");
  const userEmail = traits?.email || traits?.primaryEmail;
  if (!userEmail) {
    logger.debug("Email ID is required for getting zenuserId");
    return undefined;
  }
  const url = `${endPoint}users/search.json?query=${userEmail}`;
  // let url  = endPoint + `users/search.json?external_id=${externalId}`;
  const config = { headers };

  try {
    const resp = await axios.get(url, config);
    if (!resp || !resp.data || resp.data.count === 0) {
      logger.debug("User not found");
      return undefined;
    }

    const zendeskUserId = resp.data.users[0].id;
    return zendeskUserId;
  } catch (error) {
    // logger.debug(
    //   `Cannot get userId for externalId : ${externalId}`,
    //   error.response
    // );
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
    response.data.organization_memberships[0].organization_id === orgId
  ) {
    return true;
  }
  return false;
}

async function createUser(message, headers, destinationConfig, type) {
  const traits =
    type === "group"
      ? get(message, "context.traits")
      : getFieldValueFromMessage(message, "traits");
  const { name, email } = traits;
  const userId = getFieldValueFromMessage(message, "userId");

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
      logger.debug(`Couldn't create User: ${name}`);
      throw new CustomError(
        "user not found",
        resp.status || resp.data.status || 400
      );
    }

    const userID = resp.data.user.id;
    const userEmail = resp.data.user.email;
    return { zendeskUserId: userID, email: userEmail };
  } catch (error) {
    logger.debug(error);
    logger.debug(`Couldn't find user: ${name}`);
    throw new CustomError(`Couldn't find user: ${name}`, error.status || 400);
  }
}

async function getUserMembershipPayload(
  message,
  headers,
  orgId,
  destinationConfig
) {
  // let zendeskUserID = await getUserId(message.userId, headers);
  let zendeskUserID = await getUserId(message, headers, "group");
  const traits = get(message, "context.traits");
  if (!zendeskUserID) {
    if (traits && traits.name && traits.email) {
      const { zendeskUserId } = await createUser(
        message,
        headers,
        destinationConfig,
        "group"
      );
      zendeskUserID = zendeskUserId;
    } else {
      throw new CustomError("User not found", 400);
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
  const mappingJson = mappingConfig[category.name];
  const payload = constructPayload(message, mappingJson);
  const sourceKeys = defaultFields[ConfigCategory.GROUP.organizationFieldsJson];

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
      !(sourceKeys.includes(trait) || typeof message.traits[trait] === "object")
  );
  organizationFields.forEach(field => {
    set(
      payload,
      `organization.organization_fields.${field}`,
      get(message, `traits.${field}`)
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
      logger.debug(`Couldn't create Organization: ${message.traits.name}`);
      return undefined;
    }

    const orgId = resp.data.organization.id;
    return orgId;
  } catch (error) {
    logger.debug(`Couldn't create Organization: ${message.traits.name}`);
    return undefined;
  }
}

function validateUserId(message) {
  if (!message.userId) {
    throw new CustomError(
      `Zendesk : UserId is a mandatory field for ${message.type}`,
      400
    );
  }
}

async function processIdentify(message, destinationConfig, headers) {
  validateUserId(message);
  const category = ConfigCategory.IDENTIFY;
  const traits = getFieldValueFromMessage(message, "traits");
  let primaryEmail;
  if (traits.primaryEmail) {
    primaryEmail = traits.primaryEmail;
    // deleting this primaryEmail from traits as it used only to set primary email
    delete traits.primaryEmail;
  }
  // create user fields if required
  await checkAndCreateUserFields(
    getFieldValueFromMessage(message, "traits"),
    category.userFieldsEndpoint,
    category.userFieldsJson,
    headers
  );

  const payload = getIdentifyPayload(
    message,
    category,
    destinationConfig,
    "identify"
  );
  const url = endPoint + category.createOrUpdateUserEndpoint;
  const returnList = [];

  const userId = await getUserId(message, headers);
  // If primaryEmail and userId both exists then it will set it as primary email.
  if (primaryEmail && userId) {
    const userIdentityId = await getUserIdentityId(
      userId,
      primaryEmail,
      headers,
      destinationConfig
    );
    if (userIdentityId) {
      returnList.push(
        responseBuilderToSetPrimaryAccount(userIdentityId, userId, headers)
      );
    }
  } else if (primaryEmail) {
    // if only primaryEmail exists then in the payload it will pass as user.identities
    // and it will set it as primary while creating the user.
    const primaryEmailPayload = {
      type: "email",
      value: primaryEmail
    };
    if (payload.user.identities && Array.isArray(payload.user.identities)) {
      payload.user.identities.push(primaryEmailPayload);
    } else {
      payload.user.identities = [primaryEmailPayload];
    }
  }

  if (
    traits.company &&
    traits.company.remove &&
    destinationConfig.removeUsersFromOrganization &&
    traits.company.id
  ) {
    const orgId = traits.company.id;
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
            orgId === response.data.organization_memberships[0].organization_id
          ) {
            const membershipId = response.data.organization_memberships[0].id;
            const deleteResponse = defaultRequestConfig();

            deleteResponse.endpoint = `${endPoint}users/${userId}/organization_memberships/${membershipId}.json`;
            deleteResponse.method = defaultDeleteRequestConfig.requestMethod;
            deleteResponse.headers = {
              ...headers,
              "X-Zendesk-Marketplace-Name": ZENDESK_MARKET_PLACE_NAME,
              "X-Zendesk-Marketplace-Organization-Id": ZENDESK_MARKET_PLACE_ORG_ID,
              "X-Zendesk-Marketplace-App-Id": ZENDESK_MARKET_PLACE_APP_ID
            };
            deleteResponse.userId = message.anonymousId;
            returnList.push(deleteResponse);
          }
        }
      } catch (error) {
        logger.debug(error);
      }
    }
  }

  returnList.push(responseBuilder(message, headers, payload, url));
  return returnList;
}

async function processTrack(message, destinationConfig, headers) {
  validateUserId(message);
  const traits = getFieldValueFromMessage(message, "traits");
  let userEmail;
  if (traits) {
    userEmail = traits.email ? traits.email : null;
  }
  if (!userEmail) {
    throw new CustomError("email not found in traits.", 400);
  }
  let zendeskUserID;

  let url = `${endPoint}users/search.json?query=${userEmail}`;
  const config = { headers };
  const userResponse = await axios.get(url, config);
  if (!get(userResponse, "data.users.0.id") || userResponse.data.count === 0) {
    const { zendeskUserId, email } = await createUser(
      message,
      headers,
      destinationConfig
    );
    if (!zendeskUserId) {
      throw new CustomError("user not found", 400);
    }
    if (!email) {
      throw new CustomError("user email not found", 400);
    }
    zendeskUserID = zendeskUserId;
    userEmail = email;
  }
  zendeskUserID = zendeskUserID || userResponse.data.users[0].id;

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
  url = `${endPoint}users/${zendeskUserID}/events`;

  const response = responseBuilder(message, headers, eventPayload, url);
  return response;
}

async function processGroup(message, destinationConfig, headers) {
  const category = ConfigCategory.GROUP;
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
    validateUserId(message);
    const orgId = await createOrganization(
      message,
      category,
      headers,
      destinationConfig
    );
    if (!orgId) {
      throw new CustomError(
        `Couldn't create user membership for user having external id ${message.userId} as Organization ${message.traits.name} wasn't created`,
        400
      );
    }
    // adds an organization against a user and can add multiple organisation. the last one does not override but adds to the previously added organizations.
    // Docs: https://developer.zendesk.com/rest_api/docs/support/organization_memberships#create-membership
    payload = await getUserMembershipPayload(
      message,
      headers,
      orgId,
      destinationConfig
    );
    url = endPoint + category.userMembershipEndpoint;

    const userId = payload.organization_membership.user_id;
    if (await isUserAlreadyAssociated(userId, orgId, headers)) {
      throw new CustomError(
        "user is already associated with organization",
        400
      );
    }
  }

  // not removing this code - as it is a different implementation for group membership - may be needed later.
  // this implementation does not let you add more than one organization to a particular user. The last one overrides the previously added organization.

  // category = ConfigCategory.IDENTIFY;
  // payload = getIdentifyPayload(message, category, destinationConfig, "group");
  // payload.user.organization_id = orgId;
  // url = endPoint + category.createOrUpdateUserEndpoint;
  // return responseBuilder(message, headers, payload, url);

  return responseBuilder(message, headers, payload, url);
}

async function processSingleMessage(event) {
  const { message } = event;
  const destinationConfig = event.destination.Config;
  const messageType = message.type.toLowerCase();
  const unencodedBase64Str = `${destinationConfig.email}/token:${destinationConfig.apiToken}`;
  const headers = {
    Authorization: `Basic ${Buffer.from(unencodedBase64Str).toString(
      "base64"
    )}`,
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
      throw new CustomError("Message type not supported", 400);
  }
}

async function process(event) {
  endPoint = `https://${event.destination.Config.domain}.zendesk.com/api/v2/`;
  const resp = await processSingleMessage(event);
  return resp;
}

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          // eslint-disable-next-line no-nested-ternary
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
