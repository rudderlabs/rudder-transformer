import { NetworkError, NetworkInstrumentationError } from '@rudderstack/integrations-lib';
import { handleHttpRequest } from '../../../adapters/network';
import { isHttpStatusSuccess } from '../../util';

const get = require('get-value');
const set = require('set-value');
const {
  InstrumentationError,
  isDefinedAndNotNull,
  mapInBatches,
} = require('@rudderstack/integrations-lib');

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
  defaultPutRequestConfig,
  getEventType,
  getSuccessRespEvents,
  handleRtTfSingleEventError,
} = require('../../util');
const {
  getSourceName,
  createOrUpdateUser,
  getUserIdentities,
  deleteEmailFromUser,
  updatePrimaryEmailOfUser,
  getStatusCode,
  removeUserFromOrganizationMembership,
} = require('./util');
const logger = require('../../../logger');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');

const CONTEXT_TRAITS_KEY_PATH = 'context.traits';
const endpointPath = '/users/search.json';
const responseBuilder = (message, headers, payload, endpoint) => {
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
};

/**
 * It makes an API call to update the user's primary email.
 * And it returns the payload for updating primary email of user
 * @param {*} userIdentityId -> userIdentity Id
 * @param {*} userId -> userId of users
 * @param {*} headers -> Authorizations for API's call
 * @param {*} email -> email of user
 * @param {*} baseEndpoint
 * @param {*} metadata
 * @returns
 */
const responseBuilderToUpdatePrimaryAccount = async (
  userIdentityId,
  userId,
  headers,
  email,
  baseEndpoint,
  metadata,
  destinationConfig,
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
      verified: !!destinationConfig.createUsersAsVerified,
    },
  };
  // API call to update primary email of the user
  await updatePrimaryEmailOfUser(response.endpoint, response.body.JSON, response.headers, metadata);
  return response;
};

/**
 * It makes an API call to remove email from the user's account.
 * And it returns the payload for updating primary email of user
 * @param {*} userIdentityId -> userIdentity Id
 * @param {*} userId -> userId of users
 * @param {*} headers -> Authorizations for API's call
 * @param {*} baseEndpoint
 * @param {*} metadata
 * @returns
 */
const responseBuilderToRemoveEmailFromUser = async (
  userIdentityId,
  userId,
  headers,
  baseEndpoint,
  metadata,
) => {
  const response = defaultRequestConfig();
  const updatedHeaders = {
    ...headers,
    ...DEFAULT_HEADERS,
  };
  response.endpoint = `${baseEndpoint}users/${userId}/identities/${userIdentityId}`;
  response.method = defaultDeleteRequestConfig.requestMethod;
  response.headers = updatedHeaders;
  // API call to remove email from user
  await deleteEmailFromUser(response.endpoint, response.headers, metadata);
  return response;
};

/**
 * ref: https://developer.zendesk.com/api-reference/ticketing/users/user_identities/#list-identities
 * This function search id of primary email from userId and fetch its details.
 * It also removes duplicate email if found, and updates the new email as the primary email.
 * @param {*} userId -> userId of users
 * @param {*} headers -> Authorizations for API's call
 * @param {*} newEmail -> new email of the user
 * @param baseEndpoint
 * @param metadata
 * @returns it returns needed payloads for updating email
 */
const payloadBuilderforUpdatingEmail = async (
  userId,
  headers,
  newEmail,
  baseEndpoint,
  metadata,
  destinationConfig,
) => {
  // url for list all identities of user
  const url = `${baseEndpoint}users/${userId}/identities`;
  const respLists: unknown[] = [];
  let duplicateEmailIdentity;
  let currentPrimaryEmailIdentity;

  try {
    const identities = await getUserIdentities(url, headers, metadata);
    if (identities && Array.isArray(identities)) {
      duplicateEmailIdentity = identities.find(
        (identity) =>
          identity.type === 'email' && identity.value === newEmail && identity.primary !== true,
      );
      currentPrimaryEmailIdentity = identities.find(
        (identity) =>
          identity.type === 'email' && identity.value !== newEmail && identity.primary === true,
      );
    }
  } catch (error: unknown) {
    if (error instanceof NetworkError) {
      logger.debug(`${NAME}:: Error :`, error.message);
    } else {
      logger.debug(`${NAME}:: Error :`, error);
    }
    return [];
  }

  // Remove duplicate email if it exists
  if (duplicateEmailIdentity?.id) {
    const response = await responseBuilderToRemoveEmailFromUser(
      duplicateEmailIdentity.id,
      userId,
      headers,
      baseEndpoint,
      metadata,
    );
    respLists.push(response);
  }

  // update primary email if needed
  if (currentPrimaryEmailIdentity?.id) {
    const response = await responseBuilderToUpdatePrimaryAccount(
      currentPrimaryEmailIdentity.id,
      userId,
      headers,
      newEmail,
      baseEndpoint,
      metadata,
      destinationConfig,
    );
    respLists.push(response);
  }

  return respLists;
};

async function createUserFields(url, config, newFields, fieldJson, metadata) {
  let fieldData;
  // removing trailing 's' from fieldJson
  const fieldJsonSliced = fieldJson.slice(0, -1);
  await Promise.all(
    newFields.map(async (field) => {
      // create payload for each new user field
      fieldData = {
        [fieldJsonSliced]: {
          title: field,
          active: true,
          key: field,
          description: field,
        },
      };

      const { processedResponse } = await handleHttpRequest('post', url, fieldData, config, {
        destType: 'zendesk',
        feature: 'transformation',
        endpointPath: '/users/userId/identities',
        requestMethod: 'POST',
        module: 'router',
        metadata,
      });
      if (!isHttpStatusSuccess(processedResponse.status)) {
        logger.error(`${NAME}:: Failed to create user field: ${processedResponse.response.error}`);
      }
    }),
  );
}

async function checkAndCreateUserFields(
  traits,
  categoryEndpoint,
  fieldJson,
  headers,
  baseEndpoint,
  metadata,
) {
  let newFields: unknown[] = [];

  const url = baseEndpoint + categoryEndpoint;
  const config = { headers };

  const { processedResponse: response } = await handleHttpRequest('get', url, config, {
    destType: 'zendesk',
    feature: 'transformation',
    requestMethod: 'POST',
    module: 'router',
    metadata,
  });

  if (!isHttpStatusSuccess(response.status)) {
    logger.warn(`${NAME}:: Failed to check user fields: ${response.response.error}`);
    return;
  }
  const fields = get(response.response, fieldJson);
  if (response.response && fields) {
    // Fields is expected to be an array, but in production we've observed it
    // being returned as a string for one of the destinations. String type was not
    // reproducible in local testing.
    if (typeof fields === 'string') {
      logger.info(`${NAME}:: Fields is not an array. It's type is ${typeof fields}`);
      return;
    }
    // get existing user_fields and concatenate them with default fields
    let existingKeys = fields.map((field) => field.key);
    existingKeys = existingKeys.concat(defaultFields[fieldJson]);

    // check for new fields
    const traitKeys = Object.keys(traits);
    newFields = traitKeys.filter(
      (key) => !(existingKeys.includes(key) || typeof traits[key] === 'object'), // to handle traits.company.remove
    );
    if (newFields.length > 0) {
      await createUserFields(url, config, newFields, fieldJson, metadata);
    }
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
  for (const field of userFields) {
    set(payload, `user.user_fields.${field}`, get(traits, field));
  }

  payload.user = removeUndefinedValues(payload.user);

  if (destinationConfig.createUsersAsVerified) {
    set(payload, 'user.verified', true);
  }

  return payload;
}

async function getUserId(message, headers, baseEndpoint, type, metadata) {
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

  const { processedResponse: resp } = await handleHttpRequest('get', url, config, {
    destType: 'zendesk',
    feature: 'transformation',
    endpointPath,
    requestMethod: 'GET',
    module: 'router',
    metadata,
  });
  if (!isHttpStatusSuccess(resp.status)) {
    logger.debug(`${NAME}:: Cannot get user id: ${resp.response}`);
    return undefined;
  }
  if (!resp || !resp.response || resp.response.count === 0) {
    logger.debug(`${NAME}:: User not found`);
    return undefined;
  }

  const zendeskUserId = resp?.response?.users?.[0]?.id;
  return zendeskUserId;
}

async function isUserAlreadyAssociated(userId, orgId, headers, baseEndpoint, metadata) {
  const url = `${baseEndpoint}/users/${userId}/organization_memberships.json`;
  const config = { headers };
  const { processedResponse: response } = await handleHttpRequest('get', url, config, {
    destType: 'zendesk',
    feature: 'transformation',
    endpointPath: '/users/userId/organization_memberships.json',
    requestMethod: 'GET',
    module: 'router',
    metadata,
  });
  return response?.response?.organization_memberships?.[0]?.organization_id === orgId;
}

async function createUser(
  message,
  headers,
  destinationConfig,
  baseEndpoint,
  type,
  metadata,
): Promise<{ zendeskUserId?: string; email?: string }> {
  const traits =
    type === 'group'
      ? get(message, CONTEXT_TRAITS_KEY_PATH)
      : getFieldValueFromMessage(message, 'traits');
  const { name, email } = traits;
  const userId = getFieldValueFromMessage(message, 'userId');

  const userObject: { verified?: boolean; name: unknown; external_id: unknown; email: unknown } = {
    name,
    external_id: userId,
    email,
  };
  if (destinationConfig.createUsersAsVerified) {
    userObject.verified = true;
  }
  const category = ConfigCategory.IDENTIFY;
  const url = baseEndpoint + category.createOrUpdateUserEndpoint;
  const config = { headers };
  const payload = { user: userObject };

  const { processedResponse: resp } = await handleHttpRequest('post', url, payload, config, {
    destType: 'zendesk',
    feature: 'transformation',
    endpointPath: '/users/create_or_update.json',
    requestMethod: 'POST',
    module: 'router',
    metadata,
  });

  if (!isHttpStatusSuccess(resp.status) || !resp.response?.user?.id) {
    logger.debug(`${NAME}:: Couldn't create User: ${name}`);
    throw new NetworkInstrumentationError(`Couldn't find user: ${name}`);
  }

  const userID = resp?.response?.user?.id;
  const userEmail = resp?.response?.user.email;
  return { zendeskUserId: userID, email: userEmail };
}

async function getUserMembershipPayload(
  message,
  headers,
  orgId,
  destinationConfig,
  baseEndpoint,
  metadata,
) {
  // let zendeskUserID = await getUserId(message.userId, headers);
  let zendeskUserID = await getUserId(message, headers, baseEndpoint, 'group', metadata);
  const traits = get(message, CONTEXT_TRAITS_KEY_PATH);
  if (!zendeskUserID) {
    if (traits && traits.name && traits.email) {
      const { zendeskUserId } = await createUser(
        message,
        headers,
        destinationConfig,
        baseEndpoint,
        'group',
        metadata,
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

async function createOrganization(
  message,
  category,
  headers,
  destinationConfig,
  baseEndpoint,
  metadata,
) {
  if (!isDefinedAndNotNull(message.traits)) {
    throw new InstrumentationError('Organisation Traits are missing. Aborting.');
  }
  await checkAndCreateUserFields(
    message.traits,
    category.organizationFieldsEndpoint,
    category.organizationFieldsJson,
    headers,
    baseEndpoint,
    metadata,
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

  for (const field of organizationFields) {
    set(payload, `organization.organization_fields.${field}`, get(message, `traits.${field}`));
  }

  payload.organization = removeUndefinedValues(payload.organization);

  if (destinationConfig.sendGroupCallsWithoutUserId && !message.userId) {
    return payload;
  }

  const url = baseEndpoint + category.createEndpoint;
  const config = { headers };

  const { processedResponse: resp } = await handleHttpRequest('post', url, payload, config, {
    destType: 'zendesk',
    feature: 'transformation',
    endpointPath: '/organizations/create_or_update.json',
    requestMethod: 'POST',
    module: 'router',
    metadata,
  });

  if (!isHttpStatusSuccess(resp.status) || !resp.response?.organization) {
    logger.debug(`${NAME}:: Couldn't create organization: ${message.traits.name}`);
    return undefined;
  }

  const orgId = resp?.response?.organization?.id;
  return orgId;
}

function validateUserId(message) {
  if (!message.userId) {
    throw new InstrumentationError(`UserId is a mandatory field for ${message.type}`, 400);
  }
}

async function processIdentify(message, destinationConfig, headers, baseEndpoint, metadata) {
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
    metadata,
  );

  const payload = getIdentifyPayload(message, category, destinationConfig, 'identify');
  const url = baseEndpoint + category.createOrUpdateUserEndpoint;
  const returnList: unknown[] = [];

  // create or update the user
  const userIdByZendesk = await createOrUpdateUser(payload, url, headers, metadata);

  // handle primary email update if required
  const userEmail = traits?.email;
  const shouldUpdateUsersPrimaryEmail =
    destinationConfig.searchByExternalId && userIdByZendesk && userEmail;
  if (shouldUpdateUsersPrimaryEmail) {
    const payloadsForUpdatingEmail = await payloadBuilderforUpdatingEmail(
      userIdByZendesk,
      headers,
      userEmail,
      baseEndpoint,
      metadata,
      destinationConfig,
    );
    if (payloadsForUpdatingEmail?.length > 0) returnList.push(...payloadsForUpdatingEmail);
  }

  if (
    traits.company &&
    traits.company.remove &&
    destinationConfig.removeUsersFromOrganization &&
    traits.company.id
  ) {
    const orgId = traits.company.id;
    const userId = await getUserId(message, headers, baseEndpoint, 'identify', metadata);
    if (userId) {
      const membershipUrl = `${baseEndpoint}users/${userId}/organization_memberships.json`;
      try {
        const config = { headers };
        const { processedResponse: response } = await handleHttpRequest(
          'get',
          membershipUrl,
          config,
          {
            destType: 'zendesk',
            feature: 'transformation',
            endpointPath: '/users/userId/organization_memberships.json',
            requestMethod: 'GET',
            module: 'router',
            metadata,
          },
        );
        if (
          response.response &&
          response.response.organization_memberships &&
          response.response.organization_memberships.length > 0 &&
          orgId === response.response.organization_memberships[0].organization_id
        ) {
          const membershipId = response.response.organization_memberships[0]?.id;
          const deleteResponse = defaultRequestConfig();

          deleteResponse.endpoint = `${baseEndpoint}users/${userId}/organization_memberships/${membershipId}.json`;
          deleteResponse.method = defaultDeleteRequestConfig.requestMethod;
          deleteResponse.headers = {
            ...headers,
            ...DEFAULT_HEADERS,
          };
          deleteResponse.userId = message.anonymousId;
          await removeUserFromOrganizationMembership(deleteResponse.endpoint, headers, metadata);
          returnList.push(deleteResponse);
        }
      } catch (error: unknown) {
        logger.debug(`${NAME}:: ${error}`);
      }
    }
  }

  returnList.push(responseBuilder(message, headers, payload, url));
  return returnList;
}

async function processTrack(message, destinationConfig, headers, baseEndpoint, metadata) {
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
  const { processedResponse: userResponse } = await handleHttpRequest('get', url, config, {
    destType: 'zendesk',
    feature: 'transformation',
    endpointPath,
    requestMethod: 'GET',
    module: 'router',
    metadata,
  });
  if (!isHttpStatusSuccess(userResponse.status)) {
    throw new NetworkError(
      `Failed to fetch user with email: ${userEmail} due to ${userResponse.response.error}`,
      userResponse.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(userResponse.status),
      },
    );
  }
  try {
    if (!get(userResponse, 'response.users.0.id') || userResponse.response.count === 0) {
      const { zendeskUserId, email } = await createUser(
        message,
        headers,
        destinationConfig,
        baseEndpoint,
        'track',
        metadata,
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
    zendeskUserID = zendeskUserID || userResponse?.response?.users?.[0]?.id;
  } catch (error: unknown) {
    if (error instanceof NetworkInstrumentationError) {
      throw new NetworkError(
        `Failed to fetch user with email: ${userEmail} due to ${error?.message}`,
        error.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(error.status),
        },
      );
    }
    throw error;
  }

  const sourceName = getSourceName(destinationConfig);
  const eventObject = {
    description: message.event,
    type: message.event,
    source: sourceName,
    properties: message.properties,
  };

  const profileObject = {
    type: message.event,
    source: sourceName,
    identifiers: [{ type: 'email', value: userEmail }],
  };

  const eventPayload = { event: eventObject, profile: profileObject };
  const eventEndpoint = `${baseEndpoint}users/${zendeskUserID}/events`;

  const response = responseBuilder(message, headers, eventPayload, eventEndpoint);
  return response;
}

async function processGroup(message, destinationConfig, headers, baseEndpoint, metadata) {
  const category = ConfigCategory.GROUP;
  let payload;
  let url;

  if (destinationConfig.sendGroupCallsWithoutUserId && !message.userId) {
    payload = await createOrganization(
      message,
      category,
      headers,
      destinationConfig,
      baseEndpoint,
      metadata,
    );
    url = baseEndpoint + category.createEndpoint;
  } else {
    validateUserId(message);
    const orgId = await createOrganization(
      message,
      category,
      headers,
      destinationConfig,
      baseEndpoint,
      metadata,
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
      metadata,
    );
    url = baseEndpoint + category.userMembershipEndpoint;

    const userId = payload.organization_membership.user_id;
    if (await isUserAlreadyAssociated(userId, orgId, headers, baseEndpoint, metadata)) {
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

  const { message, metadata } = event;
  const evType = getEventType(message);
  switch (evType) {
    case EventType.IDENTIFY:
      return processIdentify(message, destinationConfig, headers, baseEndpoint, metadata);
    case EventType.GROUP:
      return processGroup(message, destinationConfig, headers, baseEndpoint, metadata);
    case EventType.TRACK:
      return processTrack(message, destinationConfig, headers, baseEndpoint, metadata);
    default:
      throw new InstrumentationError(`Event type ${evType} is not supported`);
  }
}

async function processEvent(event) {
  const resp = await processSingleMessage(event);
  return resp;
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await mapInBatches(
    inputs,
    async (input) => {
      try {
        let resp = input.message;
        // transform if not already done
        if (!input.message.statusCode) {
          resp = await processEvent(input);
        }

        return getSuccessRespEvents(
          resp,
          [input.metadata],
          input.destination,
          false,
          getStatusCode(input),
        );
      } catch (error) {
        return handleRtTfSingleEventError(input, error, reqMetadata);
      }
    },
    { sequentialProcessing: true },
  );
  return respList;
};

module.exports = { process: processEvent, processRouterDest };
