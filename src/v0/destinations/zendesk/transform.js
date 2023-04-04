const get = require('get-value');
const set = require('set-value');
const axios = require('axios');

const { EventType } = require('../../../constants');
const {
  ConfigCategory,
  mappingConfig,
  defaultFields,
  NAME,
  getBaseEndpoint,
  DEFAULT_HEADERS,
} = require('./config');
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig,
  defaultDeleteRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  simpleProcessRouterDest,
  defaultPutRequestConfig,
  isEmptyObject,
  getEventType,
} = require('../../util');
const logger = require('../../../logger');
const { httpGET } = require('../../../adapters/network');
const {
  NetworkInstrumentationError,
  InstrumentationError,
  NetworkError,
} = require('../../util/errorTypes');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');

const CONTEXT_TRAITS_KEY_PATH = 'context.traits';

function responseBuilder(message, headers, payload, endpoint) {
  const response = defaultRequestConfig();

  const updatedHeaders = {
    ...headers,
    ...DEFAULT_HEADERS,
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
 * @param {*} email -> email of user
 * @returns
 */
const responseBuilderToUpdatePrimaryAccount = (
  userIdentityId,
  userId,
  headers,
  email,
  baseEndpoint,
) => {
  const response = defaultRequestConfig();
  const updatedHeaders = {
    ...headers,
    ...DEFAULT_HEADERS,
  };
  response.endpoint = `${baseEndpoint}users/${userId}/identities/${userIdentityId}`;
  response.method = defaultPutRequestConfig.requestMethod;
  response.headers = updatedHeaders;
  response.body.JSON = {
    identity: {
      type: 'email',
      value: `${email}`,
    },
  };
  return response;
};

/**
 * ref: https://developer.zendesk.com/api-reference/ticketing/users/user_identities/#list-identities
 * This function search id of primary email from userId and fetch its details.
 * @param {*} message -> message
 * @param {*} userId -> userId of users
 * @param {*} headers -> Authorizations for API's call
 * @returns it return payloadbuilder for updating email
 */
const payloadBuilderforUpdatingEmail = async (userId, headers, userEmail, baseEndpoint) => {
  // url for list all identities of user
  const url = `${baseEndpoint}users/${userId}/identities`;
  const config = { headers };
  try {
    const res = await httpGET(url, config);
    if (res?.response?.data?.count > 0) {
      const { identities } = res.response.data;
      if (identities && Array.isArray(identities)) {
        const identitiesDetails = identities.find(
          (identitieslist) => identitieslist.primary === true && identitieslist.value !== userEmail,
        );
        if (identitiesDetails?.id && userEmail) {
          return responseBuilderToUpdatePrimaryAccount(
            identitiesDetails.id,
            userId,
            headers,
            userEmail,
            baseEndpoint,
          );
        }
      }
    }
    logger.debug(`${NAME}:: Failed in fetching Identity details`);
  } catch (error) {
    logger.debug(`${NAME}:: Error :`, error.response ? error.response.data : error);
  }
  return {};
};

async function createUserFields(url, config, newFields, fieldJson) {
  let fieldData;
  // removing trailing 's' from fieldJson
  const fieldJsonSliced = fieldJson.slice(0, -1);
  newFields.forEach(async (field) => {
    // create payload for each new user field
    fieldData = {
      [fieldJsonSliced]: {
        title: field,
        active: true,
        key: field,
        description: field,
      },
    };

    try {
      const response = await axios.post(url, fieldData, config);
      if (response.status !== 201) {
        logger.debug(`${NAME}:: Failed to create User Field : `, field);
      }
    } catch (error) {
      if (error.response && error.response.status !== 422) {
        logger.debug(`${NAME}:: Cannot create User field `, field, error);
      }
    }
  });
}

async function checkAndCreateUserFields(
  traits,
  categoryEndpoint,
  fieldJson,
  headers,
  baseEndpoint,
) {
  let newFields = [];

  const url = baseEndpoint + categoryEndpoint;
  const config = { headers };

  try {
    const response = await axios.get(url, config);
    const fields = get(response.data, fieldJson);
    if (response.data && fields) {
      // get existing user_fields and concatenate them with default fields
      let existingKeys = fields.map((field) => field.key);
      existingKeys = existingKeys.concat(defaultFields[fieldJson]);

      // check for new fields
      const traitKeys = Object.keys(traits);
      newFields = traitKeys.filter(
        (key) => !(existingKeys.includes(key) || typeof traits[key] === 'object'), // to handle traits.company.remove
      );

      if (newFields.length > 0) {
        await createUserFields(url, config, newFields, fieldJson);
      }
    }
  } catch (error) {
    logger.debug(`${NAME}:: Error :`, error.response ? error.response.data : error);
  }
}

function getIdentifyPayload(message, category, destinationConfig, type) {
  const mappingJson = mappingConfig[category.name];

  const traits =
    type === 'group'
      ? get(message, CONTEXT_TRAITS_KEY_PATH)
      : getFieldValueFromMessage(message, 'traits');

  const payload = constructPayload(traits, mappingJson);
  if (!payload.user) {
    payload.user = {};
  }
  payload.user.external_id = get(traits, 'userId') || get(traits, 'id') || message.userId;

  const sourceKeys = defaultFields[ConfigCategory.IDENTIFY.userFieldsJson];

  if (payload.user.external_id) {
    set(payload, 'user.user_fields.id', payload.user.external_id);
  }

  // send fields not in sourceKeys as user fields
  const userFields = Object.keys(traits).filter(
    (trait) => !(sourceKeys.includes(trait) || typeof traits[trait] === 'object'),
  );
  userFields.forEach((field) => {
    set(payload, `user.user_fields.${field}`, get(traits, field));
  });

  payload.user = removeUndefinedValues(payload.user);

  if (destinationConfig.createUsersAsVerified) {
    set(payload, 'user.verified', true);
  }

  return payload;
}
/**
 * ref: https://developer.zendesk.com/api-reference/ticketing/users/users/#search-users
 * @param {*} message message
 * @param {*} headers headers for authorizations
 * @returns
 */
const getUserIdByExternalId = async (message, headers, baseEndpoint) => {
  const externalId = getFieldValueFromMessage(message, 'userIdOnly');
  if (!externalId) {
    logger.debug(`${NAME}:: externalId is required for getting zenuserId`);
    return undefined;
  }
  const url = `${baseEndpoint}users/search.json?query=${externalId}`;
  const config = { headers };

  try {
    const resp = await httpGET(url, config);

    if (resp?.response?.data?.count > 0) {
      const zendeskUserId = get(resp, 'response.data.users.0.id');
      return zendeskUserId;
    }
    logger.debug(`${NAME}:: Failed in fetching User details`);
  } catch (error) {
    logger.debug(`${NAME}:: Cannot get userId for externalId : ${externalId}`, error.response);
  }
  return undefined;
};

async function getUserId(message, headers, baseEndpoint, type) {
  const traits =
    type === 'group'
      ? get(message, CONTEXT_TRAITS_KEY_PATH)
      : getFieldValueFromMessage(message, 'traits');
  const userEmail = traits?.email || traits?.primaryEmail;
  if (!userEmail) {
    logger.debug(`${NAME}:: Email ID is required for getting zenuserId`);
    return undefined;
  }
  const url = `${baseEndpoint}users/search.json?query=${userEmail}`;
  const config = { headers };

  try {
    const resp = await axios.get(url, config);
    if (!resp || !resp.data || resp.data.count === 0) {
      logger.debug(`${NAME}:: User not found`);
      return undefined;
    }

    const zendeskUserId = resp?.data?.users?.[0]?.id;
    return zendeskUserId;
  } catch (error) {
    // logger.debug(
    //   `Cannot get userId for externalId : ${externalId}`,
    //   error.response
    // );
    return undefined;
  }
}

async function isUserAlreadyAssociated(userId, orgId, headers, baseEndpoint) {
  const url = `${baseEndpoint}/users/${userId}/organization_memberships.json`;
  const config = { headers };
  try {
    const response = await axios.get(url, config);
    if (response?.data?.organization_memberships?.[0]?.organization_id === orgId) {
      return true;
    }
  } catch (error) {
    logger.debug(`${NAME}:: Error :`);
    logger.debug(error?.response?.data || error);
  }
  return false;
}

async function createUser(message, headers, destinationConfig, baseEndpoint, type) {
  const traits =
    type === 'group'
      ? get(message, CONTEXT_TRAITS_KEY_PATH)
      : getFieldValueFromMessage(message, 'traits');
  const { name, email } = traits;
  const userId = getFieldValueFromMessage(message, 'userId');

  const userObject = { name, external_id: userId, email };
  if (destinationConfig.createUsersAsVerified) {
    userObject.verified = true;
  }
  const category = ConfigCategory.IDENTIFY;
  const url = baseEndpoint + category.createOrUpdateUserEndpoint;
  const config = { headers };
  const payload = { user: userObject };

  try {
    const resp = await axios.post(url, payload, config);

    if (!resp.data || !resp.data.user || !resp.data.user.id) {
      logger.debug(`${NAME}:: Couldn't create User: ${name}`);
      throw new NetworkInstrumentationError('user not found');
    }

    const userID = resp?.data?.user?.id;
    const userEmail = resp?.data?.user.email;
    return { zendeskUserId: userID, email: userEmail };
  } catch (error) {
    logger.debug(error);
    logger.debug(`Couldn't find user: ${name}`);
    throw new NetworkInstrumentationError(`Couldn't find user: ${name}`);
  }
}

async function getUserMembershipPayload(message, headers, orgId, destinationConfig, baseEndpoint) {
  // let zendeskUserID = await getUserId(message.userId, headers);
  let zendeskUserID = await getUserId(message, headers, baseEndpoint, 'group');
  const traits = get(message, CONTEXT_TRAITS_KEY_PATH);
  if (!zendeskUserID) {
    if (traits && traits.name && traits.email) {
      const { zendeskUserId } = await createUser(
        message,
        headers,
        destinationConfig,
        baseEndpoint,
        'group',
      );
      zendeskUserID = zendeskUserId;
    } else {
      throw new InstrumentationError('User not found');
    }
  }
  const payload = {
    organization_membership: {
      user_id: zendeskUserID,
      organization_id: orgId,
    },
  };

  return payload;
}

async function createOrganization(message, category, headers, destinationConfig, baseEndpoint) {
  await checkAndCreateUserFields(
    message.traits,
    category.organizationFieldsEndpoint,
    category.organizationFieldsJson,
    headers,
    baseEndpoint,
  );
  const mappingJson = mappingConfig[category.name];
  const payload = constructPayload(message, mappingJson);
  const sourceKeys = defaultFields[ConfigCategory.GROUP.organizationFieldsJson];

  if (payload?.organization?.external_id) {
    set(payload, 'organization.organization_fields.id', payload.organization.external_id);
  }
  const traitKeys = Object.keys(message.traits);
  const organizationFields = traitKeys.filter(
    (trait) => !(sourceKeys.includes(trait) || typeof message.traits[trait] === 'object'),
  );
  organizationFields.forEach((field) => {
    set(payload, `organization.organization_fields.${field}`, get(message, `traits.${field}`));
  });

  payload.organization = removeUndefinedValues(payload.organization);

  if (destinationConfig.sendGroupCallsWithoutUserId && !message.userId) {
    return payload;
  }

  const url = baseEndpoint + category.createEndpoint;
  const config = { headers };

  try {
    const resp = await axios.post(url, payload, config);

    if (!resp.data || !resp.data.organization) {
      logger.debug(`${NAME}:: Couldn't create Organization: ${message.traits.name}`);
      return undefined;
    }

    const orgId = resp?.data?.organization?.id;
    return orgId;
  } catch (error) {
    logger.debug(`${NAME}:: Couldn't create Organization: ${message.traits.name}`);
    return undefined;
  }
}

function validateUserId(message) {
  if (!message.userId) {
    throw new InstrumentationError(`UserId is a mandatory field for ${message.type}`, 400);
  }
}

async function processIdentify(message, destinationConfig, headers, baseEndpoint) {
  validateUserId(message);
  const category = ConfigCategory.IDENTIFY;
  const traits = getFieldValueFromMessage(message, 'traits');

  // create user fields if required
  await checkAndCreateUserFields(
    getFieldValueFromMessage(message, 'traits'),
    category.userFieldsEndpoint,
    category.userFieldsJson,
    headers,
    baseEndpoint,
  );

  const payload = getIdentifyPayload(message, category, destinationConfig, 'identify');
  const url = baseEndpoint + category.createOrUpdateUserEndpoint;
  const returnList = [];

  if (destinationConfig.searchByExternalId) {
    const userIdByExternalId = await getUserIdByExternalId(message, headers, baseEndpoint);
    const userEmail = traits?.email;
    if (userIdByExternalId && userEmail) {
      const payloadForUpdatingEmail = await payloadBuilderforUpdatingEmail(
        userIdByExternalId,
        headers,
        userEmail,
        baseEndpoint,
      );
      if (!isEmptyObject(payloadForUpdatingEmail)) returnList.push(payloadForUpdatingEmail);
    }
  }

  if (
    traits.company &&
    traits.company.remove &&
    destinationConfig.removeUsersFromOrganization &&
    traits.company.id
  ) {
    const orgId = traits.company.id;
    const userId = await getUserId(message, headers, baseEndpoint);
    if (userId) {
      const membershipUrl = `${baseEndpoint}users/${userId}/organization_memberships.json`;
      try {
        const config = { headers };
        const response = await axios.get(membershipUrl, config);
        if (
          response.data &&
          response.data.organization_memberships &&
          response.data.organization_memberships.length > 0 &&
          orgId === response.data.organization_memberships[0].organization_id
        ) {
          const membershipId = response.data.organization_memberships[0]?.id;
          const deleteResponse = defaultRequestConfig();

          deleteResponse.endpoint = `${baseEndpoint}users/${userId}/organization_memberships/${membershipId}.json`;
          deleteResponse.method = defaultDeleteRequestConfig.requestMethod;
          deleteResponse.headers = {
            ...headers,
            ...DEFAULT_HEADERS,
          };
          deleteResponse.userId = message.anonymousId;
          returnList.push(deleteResponse);
        }
      } catch (error) {
        logger.debug(`${NAME}:: ${error}`);
      }
    }
  }

  returnList.push(responseBuilder(message, headers, payload, url));
  return returnList;
}

async function processTrack(message, destinationConfig, headers, baseEndpoint) {
  validateUserId(message);
  const traits = getFieldValueFromMessage(message, 'traits');
  let userEmail;
  if (traits) {
    userEmail = traits.email ? traits.email : null;
  }
  if (!userEmail) {
    throw new InstrumentationError('email not found in traits.', 400);
  }
  let zendeskUserID;

  const url = `${baseEndpoint}users/search.json?query=${userEmail}`;
  const config = { headers };
  try {
    const userResponse = await axios.get(url, config);
    if (!get(userResponse, 'data.users.0.id') || userResponse.data.count === 0) {
      const { zendeskUserId, email } = await createUser(
        message,
        headers,
        destinationConfig,
        baseEndpoint,
      );
      if (!zendeskUserId) {
        throw new NetworkInstrumentationError('User not found');
      }
      if (!email) {
        throw new NetworkInstrumentationError('User email not found', 400);
      }
      zendeskUserID = zendeskUserId;
      userEmail = email;
    }
    zendeskUserID = zendeskUserID || userResponse?.data?.users?.[0]?.id;
  } catch (error) {
    throw new NetworkError(
      `Failed to fetch user with email: ${userEmail} due to ${error.message}`,
      error.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(error.status),
      },
      error?.response?.data || error?.response || error,
    );
  }

  const eventObject = {
    description: message.event,
    type: message.event,
    source: 'Rudder',
    properties: message.properties,
  };

  const profileObject = {
    type: message.event,
    source: 'Rudder',
    identifiers: [{ type: 'email', value: userEmail }],
  };

  const eventPayload = { event: eventObject, profile: profileObject };
  const eventEndpoint = `${baseEndpoint}users/${zendeskUserID}/events`;

  const response = responseBuilder(message, headers, eventPayload, eventEndpoint);
  return response;
}

async function processGroup(message, destinationConfig, headers, baseEndpoint) {
  const category = ConfigCategory.GROUP;
  let payload;
  let url;

  if (destinationConfig.sendGroupCallsWithoutUserId && !message.userId) {
    payload = await createOrganization(message, category, headers, destinationConfig, baseEndpoint);
    url = baseEndpoint + category.createEndpoint;
  } else {
    validateUserId(message);
    const orgId = await createOrganization(
      message,
      category,
      headers,
      destinationConfig,
      baseEndpoint,
    );
    if (!orgId) {
      throw new NetworkInstrumentationError(
        `Couldn't create user membership for user having external id ${message.userId} as Organization ${message.traits.name} wasn't created`,
      );
    }
    // adds an organization against a user and can add multiple organisation. the last one does not override but adds to the previously added organizations.
    // Docs: https://developer.zendesk.com/rest_api/docs/support/organization_memberships#create-membership
    payload = await getUserMembershipPayload(
      message,
      headers,
      orgId,
      destinationConfig,
      baseEndpoint,
    );
    url = baseEndpoint + category.userMembershipEndpoint;

    const userId = payload.organization_membership.user_id;
    if (await isUserAlreadyAssociated(userId, orgId, headers, baseEndpoint)) {
      throw new InstrumentationError('User is already associated with organization');
    }
  }

  // not removing this code - as it is a different implementation for group membership - may be needed later.
  // this implementation does not let you add more than one organization to a particular user. The last one overrides the previously added organization.

  // category = ConfigCategory.IDENTIFY;
  // payload = getIdentifyPayload(message, category, destinationConfig, "group");
  // payload.user.organization_id = orgId;
  // url = baseEndpoint + category.createOrUpdateUserEndpoint;
  // return responseBuilder(message, headers, payload, url);

  return responseBuilder(message, headers, payload, url);
}

async function processSingleMessage(event) {
  const destinationConfig = event.destination.Config;
  const unencodedBase64Str = `${destinationConfig.email}/token:${destinationConfig.apiToken}`;
  const baseEndpoint = getBaseEndpoint(destinationConfig.domain);
  const headers = {
    Authorization: `Basic ${Buffer.from(unencodedBase64Str).toString('base64')}`,
    'Content-Type': JSON_MIME_TYPE,
  };

  const { message } = event;
  const evType = getEventType(message);
  switch (evType) {
    case EventType.IDENTIFY:
      return processIdentify(message, destinationConfig, headers, baseEndpoint);
    case EventType.GROUP:
      return processGroup(message, destinationConfig, headers, baseEndpoint);
    case EventType.TRACK:
      return processTrack(message, destinationConfig, headers, baseEndpoint);
    default:
      throw new InstrumentationError(`Event type ${evType} is not supported`);
  }
}

async function process(event) {
  const resp = await processSingleMessage(event);
  return resp;
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
