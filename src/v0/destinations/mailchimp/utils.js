const get = require('get-value');
const md5 = require('md5');
const { InstrumentationError, NetworkError } = require('@rudderstack/integrations-lib');
const { MappedToDestinationKey } = require('../../../constants');
const {
  isDefinedAndNotNull,
  isDefined,
  checkSubsetOfArray,
  getIntegrationsObj,
  isDefinedAndNotNullAndNotEmpty,
  addExternalIdToTraits,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues,
  defaultBatchRequestConfig,
  constructPayload,
} = require('../../util');
const logger = require('../../../logger');
const { MERGE_CONFIG, MERGE_ADDRESS, SUBSCRIPTION_STATUS, VALID_STATUSES } = require('./config');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { handleHttpRequest } = require('../../../adapters/network');

const ADDRESS_MANDATORY_FIELDS = ['addr1', 'city', 'state', 'zip'];

const MAILCHIMP_IDENTIFY_EXCLUSION = [
  'email',
  'firstName',
  'lastName',
  'FirstName',
  'LastName',
  'firstname',
  'lastname',
  'addr1',
  'city',
  'state',
  'zip',
  'phone',
  'address',
  'addressLine1',
  'addressLine2',
  'birthday',
];

/**
 * Returns common endpoint for mailchimp
 * @param {*} datacenterId <-- from webapp config
 * @param {*} audienceId <-- from webapp config
 * @returns
 */
const getMailChimpBaseEndpoint = (datacenterId, audienceId) =>
  `https://${datacenterId}.api.mailchimp.com/3.0/lists/${audienceId}`;

/**
 * Returns the endpoint fpr adding or updating users to a list
 * ref: https://mailchimp.com/developer/marketing/api/list-members/add-or-update-list-member/
 * @param {*} datacenterId
 * @param {*} audienceId
 * @param {*} email
 * @returns
 */
const mailChimpSubscriptionEndpoint = (datacenterId, audienceId, email) =>
  `${getMailChimpBaseEndpoint(datacenterId, audienceId)}/members/${md5(email)}`;

const mailchimpEventsEndpoint = (datacenterId, audienceId, email) =>
  `${getMailChimpBaseEndpoint(datacenterId, audienceId)}/members/${md5(email)}/events`;

/**
 * Returns common endpoint for mailchimp
 * If enableMergeFields option is not present in config, we will set it to false
 * which means, member data will be accepted with merge field values, which is also
 * a default behaviour of Mailchimp itself
 * ref: https://mailchimp.com/developer/marketing/api/lists/batch-subscribe-or-unsubscribe/
 * @param {*} destConfig
 * @param {*} audienceId
 * @returns
 */
const getBatchEndpoint = (destConfig, audienceId) => {
  let mergeFieldOption;
  const { datacenterId, enableMergeFields } = destConfig;
  if (!isDefinedAndNotNull(enableMergeFields)) {
    mergeFieldOption = false;
  } else {
    mergeFieldOption = enableMergeFields;
  }
  const BASE_URL = `https://${datacenterId}.api.mailchimp.com/3.0/lists/${audienceId}`;
  const BATCH_ENDPOINT = `${BASE_URL}?skip_merge_validation=${mergeFieldOption}&skip_duplicate_check=false`;
  return BATCH_ENDPOINT;
};

/**
 * Returns the properties object with stringified values of properties[key] as mailchimp only supports string as the values for properties[key]
 * @param {*} properties
 * @returns
 */
const stringifyPropertiesValues = (properties) => {
  const updatedProperties = properties;
  const keys = Object.keys(updatedProperties);
  keys.forEach((key) => {
    if (typeof updatedProperties[key] !== 'string')
      updatedProperties[key] = JSON.stringify(updatedProperties[key]);
  });
  return updatedProperties;
};

/**
 * Dynamically returns audienceId from message or Config
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const getAudienceId = (message, Config) => {
  const integrationsObj = getIntegrationsObj(message, 'mailchimp');
  if (isDefinedAndNotNull(integrationsObj) && isDefinedAndNotNull(integrationsObj.listId)) {
    return integrationsObj.listId;
  }
  // Need to depricate this
  if (get(message, 'context.MailChimp.listId')) {
    return message.context.MailChimp.listId;
  }
  return Config.audienceId;
};

/**
 * Converts object keys to upper case along with removing spaces
 * It also slices Keys more than 10 characters
 * @param {*} tag
 * @returns
 */
const filterTagValue = (tag) => {
  const maxLength = 10;
  let newTag = tag.replace(/[^\s\w]/gi, '');
  if (newTag.length > maxLength) {
    newTag = newTag.slice(0, 10);
  }
  return newTag.toUpperCase();
};

/**
 * Returns userstatus if the email id already exists in mailchimp database
 * ref: https://mailchimp.com/developer/marketing/api/list-members/get-member-info/
 * @param {*} apiKey
 * @param {*} datacenterId
 * @param {*} audienceId
 * @param {*} email
 * @returns
 */
const checkIfMailExists = async (apiKey, datacenterId, audienceId, email, metadata) => {
  if (!email) {
    return false;
  }
  const userStatus = {
    exists: false,
    subscriptionStatus: null,
  };
  const url = `${mailChimpSubscriptionEndpoint(datacenterId, audienceId, email)}`;
  const basicAuth = Buffer.from(`apiKey:${apiKey}`).toString('base64');

  const { processedResponse, httpResponse } = await handleHttpRequest(
    'get',
    url,
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    },
    {
      metadata,
      destType: 'mailchimp',
      feature: 'transformation',
      endpointPath: '/lists/audienceId/members/email',
      requestMethod: 'GET',
      module: 'router',
    },
  );
  if (!httpResponse.success) {
    logger.info(`[Mailchimp] :: Email does not exists.`, {
      ...logger.getLogMetadata(metadata),
    });
    return userStatus;
  }
  if (processedResponse.response.contact_id) {
    userStatus.exists = true;
    userStatus.subscriptionStatus = processedResponse.response.status;
  }
  return userStatus;
};

/**
 * Checks if double optin setup is switched on for the particular audience id in mailchimp
 * @param {*} apiKey
 * @param {*} datacenterId
 * @param {*} audienceId
 * @returns
 */
const checkIfDoubleOptIn = async (apiKey, datacenterId, audienceId, metadata) => {
  const url = `${getMailChimpBaseEndpoint(datacenterId, audienceId)}`;
  const basicAuth = Buffer.from(`apiKey:${apiKey}`).toString('base64');
  const { httpResponse, processedResponse } = await handleHttpRequest(
    'get',
    url,
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    },
    {
      metadata,
      destType: 'mailchimp',
      feature: 'transformation',
      endpointPath: '/lists/audienceId',
      requestMethod: 'GET',
      module: 'router',
    },
  );
  if (!httpResponse.success) {
    const error = httpResponse.response?.response;
    const status = error?.status || 400;
    throw new NetworkError('User does not have access to the requested operation', status, {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    });
  }

  return !!processedResponse.response?.double_optin;
};

/**
 * Formats and adds the remaining trait fields, other than the mapped fields using "mailchimpMergeFieldConfig"
 * @param {*} traits
 * @param {*} mergedFieldPayload
 * @returns
 */
const mergeAdditionalTraitsFields = (traits, mergedFieldPayload) => {
  const clonedMergedFieldPayload = { ...mergedFieldPayload };
  if (isDefined(traits)) {
    Object.keys(traits).forEach((traitKey) => {
      // if any trait field is present, other than the fixed mapping, that is passed as well.
      if (!MAILCHIMP_IDENTIFY_EXCLUSION.includes(traitKey)) {
        const tag = filterTagValue(traitKey);
        clonedMergedFieldPayload[tag] = traits[traitKey];
      }
    });
  }
  return clonedMergedFieldPayload;
};

/**
 * Formats and adds the remaining address fields, other than the mapped fields using "mailchimpMergeAddressConfig"
 * Address field is not mandatory, but if sent, needs to be sent with all ["addr1", "city", "state", "zip"]
 * If address data is to be sent all of ["addr1", "city", "state", "zip"] are mandatory.
 * @param {*} mergedAddressPayload
 * @returns
 */
const validateAddressObject = (mergedAddressPayload) => {
  const clonedMergedAddressPayload = { ...mergedAddressPayload };
  const providedAddressKeys = Object.keys(clonedMergedAddressPayload);
  if (providedAddressKeys.length > 0) {
    if (checkSubsetOfArray(providedAddressKeys, ADDRESS_MANDATORY_FIELDS)) {
      ADDRESS_MANDATORY_FIELDS.forEach((addressField) => {
        if (
          !isDefinedAndNotNullAndNotEmpty(clonedMergedAddressPayload[addressField]) ||
          typeof clonedMergedAddressPayload[addressField] !== 'string'
        ) {
          throw new InstrumentationError(
            `To send as address information, ${addressField} field should be valid string`,
          );
        } else {
          clonedMergedAddressPayload[addressField] = `${clonedMergedAddressPayload[addressField]}`;
        }
      });
    } else {
      throw new InstrumentationError(
        'For sending address information ["addr1", "city", "state", "zip"] fields are mandatory',
      );
    }
  }
  return clonedMergedAddressPayload;
};

/**
 * Overrides status of primary payload for mailchimp integration based on the
 * subscriptuon status provided via integrations object inside message. If not present
 * Rudderstack will not change the exisitng status of the user
 * ----------------------
 * "integrations": {
 *      "MailChimp": {
 *        "subscriptionStatus": "subscribed"
 *      }
 *  }
 * ----------------------
 * @param {*} message
 * @param {*} primaryPayload
 * @param {*} userStatus
 * @returns
 */
const overrideSubscriptionStatus = (message, primaryPayload, userStatus) => {
  const integrationsObj = getIntegrationsObj(message, 'mailchimp');
  if (
    !isDefinedAndNotNull(integrationsObj) ||
    !isDefinedAndNotNull(integrationsObj.subscriptionStatus)
  ) {
    return {
      ...primaryPayload,
      status: userStatus.subscriptionStatus || 'subscribed',
    };
  }
  if (!VALID_STATUSES.includes(integrationsObj.subscriptionStatus)) {
    throw new InstrumentationError(
      'The status must be one of [subscribed, unsubscribed, cleaned, pending, transactional]',
    );
  }

  return { ...primaryPayload, status: integrationsObj.subscriptionStatus };
};

/**
 * Determines the appropriate subscription status for a user in Mailchimp
 * @param {*} userStatus Object containing user existence status and current subscription status
 * @param {*} apiKey Mailchimp API key
 * @param {*} datacenterId Mailchimp datacenter ID
 * @param {*} audienceId Mailchimp audience ID
 * @param {*} metadata Request metadata
 * @param {*} message The event message
 * @param {*} primaryPayload The current payload being constructed
 * @returns Updated payload with appropriate subscription status
 */
const determineSubscriptionStatus = async (
  userStatus,
  apiKey,
  datacenterId,
  audienceId,
  metadata,
  message,
  primaryPayload,
) => {
  let updatedPayload = { ...primaryPayload };

  if (!userStatus.exists) {
    const isDoubleOptin = await checkIfDoubleOptIn(apiKey, datacenterId, audienceId, metadata);
    updatedPayload.status = isDoubleOptin
      ? SUBSCRIPTION_STATUS.pending
      : SUBSCRIPTION_STATUS.subscribed;
  } else {
    updatedPayload = overrideSubscriptionStatus(message, updatedPayload, userStatus);
  }

  return updatedPayload;
};

/**
 * Produces standard payload for mailchimp api
 * @param {*} message
 * @param {*} Config
 * @param {*} audienceId
 * @returns
 */
const processPayload = async (message, Config, audienceId, metadata) => {
  let primaryPayload;
  let email;
  const { apiKey, datacenterId, enableMergeFields } = Config;
  const mappedToDestination = get(message, MappedToDestinationKey);
  // Events from RETL Source
  if (mappedToDestination) {
    // Passing the traits as it is, for reverseETL sources. For these sources,
    // it is expected to have merge fields in proper format, along with appropriate status.
    addExternalIdToTraits(message);
    primaryPayload = getFieldValueFromMessage(message, 'traits');
    const mappedAddress = get(primaryPayload, 'merge_fields.ADDRESS');
    if (mappedAddress && Object.keys(mappedAddress).length > 0) {
      primaryPayload.merge_fields.ADDRESS = validateAddressObject(mappedAddress);
    }
  } else {
    email = getFieldValueFromMessage(message, 'email');
    const traits = getFieldValueFromMessage(message, 'traits');
    const mergedFieldPayload = constructPayload(message, MERGE_CONFIG);
    const mergedAddressPayload = constructPayload(message, MERGE_ADDRESS);
    // From the behavior of destination we know that, if address
    // data is to be sent all of ["addr1", "city", "state", "zip"] are mandatory.
    if (Object.keys(mergedAddressPayload).length > 0) {
      const correctAddressPayload = validateAddressObject(mergedAddressPayload);
      mergedFieldPayload.ADDRESS = correctAddressPayload;
    }
    primaryPayload = {
      email_address: email,
    };
    // While enableMergeFields option is enabled additional fields will be sent as merge fields
    // ref: https://mailchimp.com/developer/marketing/docs/merge-fields/#structure
    if (isDefined(enableMergeFields) && enableMergeFields === true) {
      primaryPayload = {
        ...primaryPayload,
        merge_fields: mergeAdditionalTraitsFields(traits, mergedFieldPayload),
      };
    }
    const userStatus = await checkIfMailExists(apiKey, datacenterId, audienceId, email, metadata);

    primaryPayload = await determineSubscriptionStatus(
      userStatus,
      apiKey,
      datacenterId,
      audienceId,
      metadata,
      message,
      primaryPayload,
    );
  }

  return removeUndefinedAndNullValues(primaryPayload);
};

/**
 * Create Mailchimp Batch payload based on the passed events and audienceId
 * @param {*} audienceId
 * @param {*} events
 * @returns
 */
const generateBatchedPaylaodForArray = (audienceId, events) => {
  let batchEventResponse = defaultBatchRequestConfig();
  const batchResponseList = [];
  const metadata = [];
  // extracting destination from the first event in a batch
  const { destination } = events[0];
  // Batch event into dest batch structure
  events.forEach((ev) => {
    batchResponseList.push(ev.message.body.JSON);
    metadata.push(ev.metadata);
  });

  batchEventResponse.batchedRequest.body.JSON = {
    members: batchResponseList,
    // setting this to "true" will update user details, if a user already exists
    update_existing: true,
  };

  const BATCH_ENDPOINT = getBatchEndpoint(destination.Config, audienceId);

  batchEventResponse.batchedRequest.endpoint = BATCH_ENDPOINT;

  const basicAuth = Buffer.from(`apiKey:${destination.Config.apiKey}`).toString('base64');

  batchEventResponse.batchedRequest.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Basic ${basicAuth}`,
  };

  batchEventResponse = {
    ...batchEventResponse,
    metadata,
    destination,
  };
  return batchEventResponse;
};

module.exports = {
  getAudienceId,
  generateBatchedPaylaodForArray,
  mailChimpSubscriptionEndpoint,
  mailchimpEventsEndpoint,
  processPayload,
  stringifyPropertiesValues,
};
