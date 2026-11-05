const md5 = require('md5');
const get = require('get-value');
const {
  NetworkError,
  ConfigurationError,
  InstrumentationError,
  ThrottledError,
  info,
  warn,
} = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../../constants');
const tags = require('../../../../v0/util/tags');
const { httpGET, httpPOST, handleHttpRequest } = require('../../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../../adapters/utils/networkUtils');
const {
  flattenJson,
  getIntegrationsObj,
  isDefinedAndNotNull,
  isHttpStatusSuccess,
  defaultRequestConfig,
  getFieldValueFromMessage,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
} = require('../../../../v0/util');
const { JSON_MIME_TYPE } = require('../../../../v0/util/constant');
const {
  BASE_ENDPOINT,
  MetadataTypes,
  BASE_EU_ENDPOINT,
  BASE_AU_ENDPOINT,
  ReservedAttributes,
  SEARCH_CONTACT_ENDPOINT,
  ReservedCompanyProperties,
  CREATE_OR_UPDATE_COMPANY_ENDPOINT,
  TAGS_ENDPOINT,
} = require('./config');

/**
 * method to handle error during api call
 * ref docs: https://developers.intercom.com/docs/references/rest-api/errors/error-codes/
 *           https://developers.intercom.com/docs/references/rest-api/errors/error-objects/
 *           https://developers.intercom.com/docs/references/rest-api/errors/http-responses/
 * e.g.
 * 400 - code: parameter_not_found (or parameter_invalid), message: company not specified
 * 401 - code: unauthorized, message: Access Token Invalid
 * 404 - code: company_not_found, message: Company Not Found
 * @param {*} message
 * @param {*} processedResponse
 */
const intercomErrorHandler = (message, processedResponse) => {
  const errorMessages = JSON.stringify(processedResponse.response);
  if (processedResponse.status === 400) {
    throw new InstrumentationError(`${message} : ${errorMessages}`);
  }
  if (processedResponse.status === 401) {
    throw new ConfigurationError(`${message} : ${errorMessages}`);
  }
  if (processedResponse.status === 404) {
    throw new InstrumentationError(`${message} : ${errorMessages}`);
  }
  throw new NetworkError(
    `${message} : ${errorMessages}`,
    processedResponse.status,
    {
      [tags]: getDynamicErrorType(processedResponse.status),
    },
    processedResponse,
  );
};

/**
 * Returns destination request headers
 * @param {*} destination
 * @param {*} apiVersion
 * @returns
 */
const getHeaders = (destination, apiVersion) => ({
  'Content-Type': JSON_MIME_TYPE,
  Authorization: `Bearer ${destination.Config.apiKey}`,
  Accept: JSON_MIME_TYPE,
  'Intercom-Version': apiVersion === 'v1' ? '1.4' : '2.10',
  'User-Agent': process.env.INTERCOM_USER_AGENT_HEADER ?? 'RudderStack',
});

/**
 * Returns destination request base endpoint
 * @param {*} destination
 * @returns
 */
const getBaseEndpoint = (destination) => {
  const { apiServer } = destination.Config;
  let { apiVersion } = destination.Config;
  apiVersion = isDefinedAndNotNull(apiVersion) ? apiVersion : 'v2';

  if (apiVersion === 'v1') return BASE_ENDPOINT;
  switch (apiServer) {
    case 'eu':
      return BASE_EU_ENDPOINT;
    case 'au':
      return BASE_AU_ENDPOINT;
    default:
      return BASE_ENDPOINT;
  }
};

/**
 * Returns contact lookup field
 * @param {*} message
 * @returns
 */
const getLookUpField = (message) => {
  let lookupField = 'email';
  const integrationsObj = getIntegrationsObj(message, 'INTERCOM');
  if (integrationsObj && isDefinedAndNotNull(integrationsObj.lookup)) {
    lookupField = integrationsObj.lookup;
  }
  return lookupField;
};

/**
 * Returns the value of name field
 * @param {*} message
 * @returns
 */
const getName = (message) => {
  const name = message?.traits?.name || message?.context?.traits?.name;
  if (name) return name;
  const firstName = getFieldValueFromMessage(message, 'firstName');
  const lastName = getFieldValueFromMessage(message, 'lastName');
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  if (firstName || lastName) {
    return firstName || lastName;
  }
  return undefined;
};

/**
 * Returns company payload
 * @param {*} payload
 * @returns
 */
const getCompaniesList = (payload) => {
  const company = get(payload, 'custom_attributes.company');
  if (!company) return undefined;
  const companiesList = [];
  if (company.name || company.id) {
    const customAttributes = {};
    Object.keys(company).forEach((key) => {
      // If key is not in ReservedCompanyProperties
      if (!ReservedCompanyProperties.includes(key)) {
        const val = company[key];
        if (val !== Object(val)) {
          customAttributes[key] = val;
        } else {
          customAttributes[key] = JSON.stringify(val);
        }
      }
    });

    companiesList.push({
      company_id: company.id || md5(company.name),
      custom_attributes: removeUndefinedAndNullValues(customAttributes),
      name: company.name,
      industry: company.industry,
      remove: company.remove,
    });
  }
  return companiesList;
};

/**
 * Returns if email or userId is present in payload or not
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const checkIfEmailOrUserIdPresent = (message, Config) => {
  const { context, anonymousId } = message;
  let { userId } = message;
  if (Config.sendAnonymousId && !userId) {
    userId = anonymousId;
  }
  return !!(userId || context?.traits?.email);
};

/**
 * Returns add user to company payload
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const attachUserAndCompany = (message, Config) => {
  if (!checkIfEmailOrUserIdPresent(message, Config)) return undefined;
  const email = message.context?.traits?.email;
  const { userId, anonymousId, traits, groupId } = message;
  const requestBody = {};
  if (userId) {
    requestBody.user_id = userId;
  }
  if (Config.sendAnonymousId && !userId) {
    requestBody.user_id = anonymousId;
  }
  if (email) {
    requestBody.email = email;
  }
  const companyObj = {
    company_id: groupId,
  };
  if (traits?.name) {
    companyObj.name = traits.name;
  }
  requestBody.companies = [companyObj];
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = `${BASE_ENDPOINT}/users`;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Bearer ${Config.apiKey}`,
    Accept: JSON_MIME_TYPE,
    'Intercom-Version': '1.4',
    'User-Agent': process.env.INTERCOM_USER_AGENT_HEADER ?? 'RudderStack',
  };
  response.body.JSON = requestBody;
  response.userId = anonymousId;
  return response;
};

/**
 * Returns custom attributes for identify and group calls (for contact and company in intercom)
 * @param {*} payload
 * @param {*} type
 * @returns
 */
const filterCustomAttributes = (payload, type, destination, message) => {
  let ReservedAttributesList;
  let { apiVersion } = destination.Config;
  apiVersion = isDefinedAndNotNull(apiVersion) ? apiVersion : 'v2';
  // we are discarding the lookup field from custom attributes
  const lookupField = getLookUpField(message);
  if (type === 'user') {
    ReservedAttributesList = [
      ...(apiVersion === 'v1'
        ? ReservedAttributes.v1UserAttributes
        : ReservedAttributes.v2UserAttributes),
      lookupField,
    ];
  } else {
    ReservedAttributesList = [
      ...(apiVersion === 'v1'
        ? ReservedAttributes.v1CompanyAttributes
        : ReservedAttributes.v2CompanyAttributes),
      lookupField !== 'email' && lookupField,
    ];
  }
  let customAttributes = { ...get(payload, 'custom_attributes') };
  if (customAttributes) {
    ReservedAttributesList.forEach((trait) => {
      if (trait in customAttributes) delete customAttributes[trait];
    });
    if (isDefinedAndNotNull(customAttributes) && Object.keys(customAttributes).length > 0) {
      customAttributes =
        apiVersion === 'v1' ? flattenJson(customAttributes) : flattenJson(customAttributes, '_');
    }
  }
  return Object.keys(customAttributes).length === 0 ? undefined : customAttributes;
};

/**
 * Runs Intercom's contact search for the given lookups
 * @param {*} lookups
 * @param {*} destination
 * @param {*} metadata
 * @returns the matching contacts
 */
const fetchContacts = async (lookups, destination, metadata) => {
  const lookupOperator = lookups.length > 1 ? 'OR' : 'AND';
  const lookupQueries = lookups.map((lookup) => ({
    field: lookup.field,
    operator: '=',
    value: lookup.value,
  }));
  const data = JSON.stringify({
    query: {
      operator: lookupOperator,
      value: lookupQueries,
    },
  });

  const headers = getHeaders(destination);
  const baseEndPoint = getBaseEndpoint(destination);
  const endpoint = `${baseEndPoint}/${SEARCH_CONTACT_ENDPOINT}`;
  const response = await httpPOST(
    endpoint,
    data,
    {
      headers,
    },
    {
      destType: 'intercom',
      feature: 'transformation',
      endpointPath: '/contacts/search',
      requestMethod: 'POST',
      module: 'router',
      metadata,
    },
  );
  const processedUserResponse = processAxiosResponse(response);
  if (isHttpStatusSuccess(processedUserResponse.status)) {
    return processedUserResponse.response?.data;
  }

  throw new NetworkError(
    `Unable to search contact due to : ${JSON.stringify(processedUserResponse?.response?.errors)}`,
    processedUserResponse?.status,
    {
      [tags]: getDynamicErrorType(processedUserResponse?.status),
    },
    processedUserResponse,
  );
};

/**
 * Resolve the ID from the same traits that rEtlPayload sends. A selected external_id overwrites
 * that trait in addExternalIdToTraits, so its selected value takes precedence even before that step.
 */
const getRetlExternalId = (message) =>
  message.context?.externalId?.[0]?.identifierType === 'external_id'
    ? message.context.externalId[0].id
    : getFieldValueFromMessage(message, 'traits')?.external_id;

/**
 * Whether a mapped rETL identify should match by external_id while also carrying an email.
 * A v2 mapper selection or an explicit lookup override opts in; other explicit lookups win.
 * @param {*} message
 * @returns {boolean}
 */
const isRetlIdentifyWithMappedExternalId = (message) => {
  const lookup = getIntegrationsObj(message, 'INTERCOM')?.lookup;
  const externalId = getRetlExternalId(message);
  return Boolean(
    message.context?.mappedToDestination &&
      externalId &&
      ['string', 'number'].includes(typeof externalId) &&
      getFieldValueFromMessage(message, 'traits')?.email &&
      message.type?.toLowerCase() === EventType.IDENTIFY &&
      (lookup === 'external_id' ||
        (!lookup && message.context?.externalId?.[0]?.identifierType === 'external_id')),
  );
};

/**
 * Reads a contact directly, because search results lag behind writes and can't show that a contact
 * is still unclaimed.
 * @param {string} contactId
 * @param {*} destination
 * @param {*} metadata
 * @returns the contact, or null when it no longer exists
 */
const fetchContact = async (contactId, destination, metadata) => {
  const response = await httpGET(
    `${getBaseEndpoint(destination)}/contacts/${contactId}`,
    { headers: getHeaders(destination) },
    {
      destType: 'intercom',
      feature: 'transformation',
      endpointPath: '/contacts/{id}',
      requestMethod: 'GET',
      module: 'router',
      metadata,
    },
  );
  const processedResponse = processAxiosResponse(response);
  if (isHttpStatusSuccess(processedResponse.status)) {
    return processedResponse.response;
  }
  if (processedResponse.status === 404) {
    return null;
  }
  throw new NetworkError(
    `Unable to fetch contact due to : ${JSON.stringify(processedResponse?.response?.errors)}`,
    processedResponse?.status,
    {
      [tags]: getDynamicErrorType(processedResponse?.status),
    },
    processedResponse,
  );
};

// Intercom's search returns this many contacts per page when no page size is set.
const SEARCH_PAGE_SIZE = 50;

/**
 * Finds the contact an opted-in rETL identify (see isRetlIdentifyWithMappedExternalId) should update,
 * with one search by external_id or email. The contact that holds the row's external_id wins. Failing
 * that, the row claims a contact that holds its email with no external_id: Intercom answers 409 to a
 * create in that state, but accepts one when the email belongs to a different external_id. Intercom
 * has no conditional update, and a PUT silently replaces an external_id. So a claim reads the contact
 * directly first, because search can be stale about both its external_id and its email. That leaves
 * only rows racing on different router workers able to collide.
 * @param {*} message
 * @param {*} destination
 * @param {*} metadata
 * @returns {{contactId: string|null, matchedBy: 'external_id'|'email'|null}}
 */
const findRetlContact = async (message, destination, metadata) => {
  const { email } = getFieldValueFromMessage(message, 'traits');
  const externalId = getRetlExternalId(message);
  const normalizedEmail = typeof email === 'string' ? email.toLowerCase() : null;
  const idLookup = { field: 'external_id', value: externalId };
  const lookups = normalizedEmail
    ? [idLookup, { field: 'email', value: normalizedEmail }]
    : [idLookup];
  const holdsId = (contact) =>
    isDefinedAndNotNull(contact.external_id) && String(contact.external_id) === String(externalId);

  const contacts = (await fetchContacts(lookups, destination, metadata)) || [];
  let byId = contacts.find(holdsId);
  // A full page can push the external_id match past it, behind other users sharing the email.
  if (!byId && normalizedEmail && contacts.length >= SEARCH_PAGE_SIZE) {
    byId = (await fetchContacts([idLookup], destination, metadata))?.find?.(holdsId);
  }
  if (byId) {
    return { contactId: byId.id, matchedBy: 'external_id' };
  }

  const notFound = { contactId: null, matchedBy: null };
  const candidate =
    normalizedEmail &&
    contacts.find(
      (contact) => !contact.external_id && contact.email?.toLowerCase() === normalizedEmail,
    );
  if (!candidate) {
    return notFound;
  }
  const contact = await fetchContact(candidate.id, destination, metadata);
  if (!contact || contact.external_id || contact.email?.toLowerCase() !== normalizedEmail) {
    return notFound;
  }
  info('[INTERCOM] Adopting a contact without external_id', {
    sourceId: metadata.sourceId,
    destinationId: metadata.destinationId,
    workspaceId: metadata.workspaceId,
    contactId: candidate.id,
  });
  return { contactId: candidate.id, matchedBy: 'email' };
};

/**
 * Lets only the first opted-in row in a router call write an external_id onto a contact. All rows search
 * before any is delivered, so several rows sharing an email can claim one contact, and each PUT would
 * replace the last one's external_id. The other rows retry, and then see that the contact is taken.
 * They answer 429 because rudder-server's rETL retry limit applies only from 500 up, so a row that
 * has not been sent yet can't run out of retries while the first row is still being delivered.
 * @param {Array} transformResults the per-row results of the transform step
 * @param {Array} inputs the router input, in the same order
 * @returns the results, with any repeat claim replaced by a throttled error
 */
const deferRepeatClaims = (transformResults, inputs) => {
  const claims = new Map();
  return transformResults.map((result, index) => {
    const { method, endpoint, body } = result.output || {};
    const externalId = body?.JSON?.external_id;
    if (
      method !== 'PUT' ||
      !externalId ||
      !isRetlIdentifyWithMappedExternalId(inputs[index].message)
    ) {
      return result;
    }
    const claimedBy = claims.get(endpoint);
    if (claimedBy === undefined) {
      claims.set(endpoint, externalId);
      return result;
    }
    if (claimedBy === externalId) {
      return result;
    }
    return {
      error: new ThrottledError(
        '[Intercom] Another row in this batch is claiming the same contact, retrying',
      ),
    };
  });
};

/**
 * Api call to search contact in intercom to returns id of contact
 * Ref doc : https://developers.intercom.com/docs/references/rest-api/api.intercom.io/Contacts/SearchContacts/
 * @param {*} message
 * @param {*} destination
 * @param {*} metadata
 * @returns the contact id, or null when the message should create a contact
 */
const searchContact = async (message, destination, metadata) => {
  const lookups = [];
  const addLookup = (field, value) => {
    if (value) {
      lookups.push({
        field,
        value,
      });
    }
  };

  // In rEtl flow, search only by a mapped external_id when the payload will carry it.
  // Searching email as well would match another user sharing that email.
  const traits = getFieldValueFromMessage(message, 'traits');
  const externalId = getRetlExternalId(message);
  const isRetlExternalIdMapping =
    isRetlIdentifyWithMappedExternalId(message) ||
    (message.context?.mappedToDestination && externalId && !traits?.email);
  if (isRetlExternalIdMapping) {
    addLookup('external_id', externalId);
  } else {
    // Get lookup field and value from message and traits
    // In case of email, we convert it to lowercase as INTERCOM API expects email in lowercase
    // If external_id is present, we add it to the lookups
    const lookupField = getLookUpField(message);
    let lookupFieldValue =
      getFieldValueFromMessage(message, lookupField) || message?.context?.traits?.[lookupField];

    if (lookupField === 'email' && lookupFieldValue && typeof lookupFieldValue === 'string') {
      lookupFieldValue = lookupFieldValue.toLowerCase();
    }
    addLookup(lookupField, lookupFieldValue);
    if (lookupField !== 'external_id' && !getIntegrationsObj(message, 'INTERCOM')?.lookup) {
      addLookup('external_id', getFieldValueFromMessage(message, 'userIdOnly'));
    }
  }

  if (lookups.length === 0) {
    warn('[INTERCOM] No lookups found in the message', {
      sourceId: metadata.sourceId,
      destinationId: metadata.destinationId,
      workspaceId: metadata.workspaceId,
    });
    return null;
  }

  const invalidLookups = lookups.filter(
    (lookup) =>
      !isDefinedAndNotNull(lookup.value) ||
      (typeof lookup.value !== 'string' &&
        typeof lookup.value !== 'number' &&
        typeof lookup.value !== 'boolean'),
  );
  if (invalidLookups.length > 0) {
    warn('[INTERCOM] Invalid lookups found in the message', {
      sourceId: metadata.sourceId,
      destinationId: metadata.destinationId,
      workspaceId: metadata.workspaceId,
      invalidLookups,
    });
    return null;
  }

  const contacts = await fetchContacts(lookups, destination, metadata);
  if (contacts?.length > 1) {
    warn('[INTERCOM] Multiple contacts found for the message', {
      sourceId: metadata.sourceId,
      destinationId: metadata.destinationId,
      workspaceId: metadata.workspaceId,
    });
  }
  const explicitLookup = getIntegrationsObj(message, 'INTERCOM')?.lookup;
  // Only accept a contact whose email matches the explicit lookup, even if search returns
  // stale or mixed results.
  const contact =
    explicitLookup === 'email'
      ? contacts?.find((result) => result.email?.toLowerCase() === lookups[0]?.value)
      : contacts?.[0];
  return contact?.id || null;
};

/**
 * Api call to create or update companies in intercom
 * Ref doc : https://developers.intercom.com/docs/references/rest-api/api.intercom.io/Companies/createOrUpdateCompany/
 * @param {*} payload
 * @param {*} destination
 * @returns
 */
const createOrUpdateCompany = async (payload, destination, metadata) => {
  const { apiVersion } = destination.Config;
  const headers = getHeaders(destination, apiVersion);
  const finalPayload = JSON.stringify(removeUndefinedAndNullValues(payload));
  const baseEndPoint = getBaseEndpoint(destination);
  const endpoint = `${baseEndPoint}/${CREATE_OR_UPDATE_COMPANY_ENDPOINT}`;
  const response = await httpPOST(
    endpoint,
    finalPayload,
    {
      headers,
    },
    {
      metadata,
      destType: 'intercom',
      feature: 'transformation',
      endpointPath: '/companies',
      requestMethod: 'POST',
      module: 'router',
    },
  );

  const processedResponse = processAxiosResponse(response);
  if (isHttpStatusSuccess(processedResponse.status)) {
    return processedResponse.response?.id;
  }

  throw new NetworkError(
    `Unable to Create or Update Company due to : ${JSON.stringify(
      processedResponse?.response?.errors,
    )}`,
    processedResponse?.status,
    {
      [tags]: getDynamicErrorType(processedResponse?.status),
    },
    processedResponse,
  );
};

/**
 * Returns metadata object
 * @param {*} metadata
 * @returns
 */
const separateReservedAndRestMetadata = (metadata) => {
  const reservedMetadata = {};
  const restMetadata = {};
  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        const hasMonetaryAmountKeys = MetadataTypes.monetaryAmount.every((type) => type in value);
        const hasRichLinkKeys = MetadataTypes.richLink.every((type) => type in value);
        if (hasMonetaryAmountKeys || hasRichLinkKeys) {
          reservedMetadata[key] = value;
        } else {
          restMetadata[key] = value;
        }
      } else {
        restMetadata[key] = value;
      }
    });
  }

  // Return the separated metadata objects
  return { reservedMetadata, restMetadata };
};

/**
 * Returns final payload with metadata
 * @param {*} payload
 * @returns
 */
const addMetadataToPayload = (payload) => {
  let finalPayload = payload;
  if (finalPayload.metadata) {
    // reserved metadata contains JSON objects that does not requires flattening
    const { reservedMetadata, restMetadata } = separateReservedAndRestMetadata(
      finalPayload.metadata,
    );
    finalPayload = {
      ...finalPayload,
      metadata: { ...reservedMetadata, ...flattenJson(restMetadata) },
    };
  }
  return finalPayload;
};

/**
 * Api call to attach user to the company
 * Ref doc v1: https://developers.intercom.com/docs/references/1.4/rest-api/users/companies-and-users/
 * Ref doc v2: https://developers.intercom.com/docs/references/2.10/rest-api/api.intercom.io/Contacts/attachContactToACompany/
 * @param {*} payload
 * @param {*} endpoint
 * @param {*} destination
 */
const attachContactToCompany = async (payload, endpoint, { destination, metadata }) => {
  let { apiVersion } = destination.Config;
  apiVersion = isDefinedAndNotNull(apiVersion) ? apiVersion : 'v2';
  let endpointPath = '/contact/{id}/companies';
  if (apiVersion === 'v1') {
    endpointPath = '/users';
  }
  const commonStatTags = {
    destType: 'intercom',
    feature: 'transformation',
    requestMethod: 'POST',
    module: 'router',
  };
  const headers = getHeaders(destination, apiVersion);
  const finalPayload = JSON.stringify(removeUndefinedAndNullValues(payload));
  const response = await httpPOST(
    endpoint,
    finalPayload,
    {
      headers,
    },
    {
      ...commonStatTags,
      endpointPath,
      metadata,
    },
  );

  const processedResponse = processAxiosResponse(response);
  if (!isHttpStatusSuccess(processedResponse.status)) {
    intercomErrorHandler('Unable to attach Contact or User to Company due to', processedResponse);
  }
};

/**
 * Api calls to add or update tags to the company
 * Ref doc v1: https://developers.intercom.com/docs/references/1.4/rest-api/tags/tag-or-untag-users-companies-leads-contacts/
 * Ref doc v2: https://developers.intercom.com/docs/references/2.10/rest-api/api.intercom.io/Tags/createTag/
 * @param message
 * @param destination
 * @param id
 * @returns
 */
const addOrUpdateTagsToCompany = async ({ message, destination, metadata }, id) => {
  const companyTags = message?.context?.traits?.tags;
  if (!companyTags) return;
  const { apiVersion } = destination.Config;
  const headers = getHeaders(destination, apiVersion);
  const baseEndPoint = getBaseEndpoint(destination);
  const endpoint = `${baseEndPoint}/${TAGS_ENDPOINT}`;
  const statTags = {
    destType: 'intercom',
    feature: 'transformation',
    endpointPath: '/tags',
    requestMethod: 'POST',
    module: 'router',
    metadata,
  };
  await Promise.all(
    companyTags.map(async (tag) => {
      const finalPayload = {
        name: tag,
        companies: [
          {
            id,
          },
        ],
      };
      const response = await httpPOST(
        endpoint,
        finalPayload,
        {
          headers,
        },
        statTags,
      );
      const processedResponse = processAxiosResponse(response);
      if (!isHttpStatusSuccess(processedResponse.status)) {
        intercomErrorHandler(
          'Unable to Add or Update the Tag to Company due to',
          processedResponse,
        );
      }
    }),
  );
};

/**
 * Api call to get company id provided by intercom
 * Ref doc v1: https://developers.intercom.com/docs/references/1.4/rest-api/companies/view-a-company
 * Ref doc v2: https://developers.intercom.com/docs/references/2.10/rest-api/api.intercom.io/companies/retrievecompany
 * @param {*} company
 * @param {*} destination
 * @returns
 */
const getCompanyId = async (company, destination) => {
  if (!company.id && !company.name) return undefined;
  const { apiVersion } = destination.Config;
  const headers = getHeaders(destination, apiVersion);
  const baseEndPoint = getBaseEndpoint(destination);

  const queryParam = company.id ? `company_id=${company.id}` : `name=${company.name}`;
  const endpoint = `${baseEndPoint}/companies?${queryParam}`;

  const statTags = {
    destType: 'intercom',
    feature: 'transformation',
    endpointPath: '/companies',
    requestMethod: 'GET',
    module: 'router',
  };

  const { processedResponse: response } = await handleHttpRequest(
    'GET',
    endpoint,
    {
      headers,
    },
    statTags,
  );

  if (isHttpStatusSuccess(response.status)) {
    return response.response.id;
  }
  intercomErrorHandler('Unable to get company id due to', response);
  return undefined;
};

/**
 * Api call to detach contact and company for intercom api version v2 (version 2.10)
 * Ref doc: https://developers.intercom.com/docs/references/2.10/rest-api/api.intercom.io/contacts/detachcontactfromacompany
 * @param {*} contactId
 * @param {*} company
 * @param {*} destination
 * @returns
 */
const detachContactAndCompany = async (contactId, company, destination) => {
  const companyId = await getCompanyId(company, destination);
  if (!companyId) return;

  const headers = getHeaders(destination);
  const baseEndPoint = getBaseEndpoint(destination);
  const endpoint = `${baseEndPoint}/contacts/${contactId}/companies/${companyId}`;

  const statTags = {
    destType: 'intercom',
    feature: 'transformation',
    endpointPath: 'contacts/companies',
    requestMethod: 'DELETE',
    module: 'router',
  };

  const { processedResponse: response } = await handleHttpRequest(
    'DELETE',
    endpoint,
    {
      headers,
    },
    statTags,
  );

  if (!isHttpStatusSuccess(response.status)) {
    intercomErrorHandler('Unable to detach contact and company due to', response);
  }
};

module.exports = {
  getName,
  getHeaders,
  searchContact,
  findRetlContact,
  deferRepeatClaims,
  getRetlExternalId,
  isRetlIdentifyWithMappedExternalId,
  getLookUpField,
  getBaseEndpoint,
  getCompaniesList,
  addMetadataToPayload,
  attachUserAndCompany,
  createOrUpdateCompany,
  filterCustomAttributes,
  checkIfEmailOrUserIdPresent,
  separateReservedAndRestMetadata,
  attachContactToCompany,
  addOrUpdateTagsToCompany,
  detachContactAndCompany,
};
