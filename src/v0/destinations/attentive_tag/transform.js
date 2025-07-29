const get = require('get-value');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  ConfigCategory,
  mappingConfig,
  BASE_URL,
  ENDPOINTS,
  mapChannelToSubscriptionType,
} = require('./config');
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  getIntegrationsObj,

  isDefinedAndNotNullAndNotEmpty,
  simpleProcessRouterDest,
} = require('../../util');
const {
  getDestinationItemProperties,
  getExternalIdentifiersMapping,
  arePropertiesValid,
  validateTimestamp,
  getConsentedUserContacts,
} = require('./util');
const { JSON_MIME_TYPE } = require('../../util/constant');

const responseBuilder = (payload, apiKey, endpoint) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = `${BASE_URL}${endpoint}`;
    response.headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': JSON_MIME_TYPE,
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
  return undefined;
};

// response builder for identity resolution
const responseBuilderForIdentityResolution = (message, apiKey) => {
  const identityPayload =
    constructPayload(message, mappingConfig[ConfigCategory.IDENTITY_RESOLUTION.name]) || {};
  const externalIdentifiers = getExternalIdentifiersMapping(message) || {};

  // Build payload
  const payload = {
    ...identityPayload,
    ...externalIdentifiers,
  };

  // Check if any of the other identifiers are present
  const hasOtherIdentifiers =
    payload.email || payload.phone || payload.shopifyId || payload.klaviyoId;

  // Check if the payload has sufficient identity
  const hasSufficientIdentity =
  (payload.clientUserId && payload.customIdentifiers) ||
  (hasOtherIdentifiers && payload.clientUserId) ||
  (hasOtherIdentifiers && payload.customIdentifiers);


  if (hasSufficientIdentity) {
    return responseBuilder(payload, apiKey, ENDPOINTS.IDENTITY_RESOLUTION);
  }

  return null;
};

// response builder for user attributes
const responseBuilderForUserAttributes = (message, apiKey) => {
  const traits = getFieldValueFromMessage(message, 'traits') || {};
  const { email, phone, customIdentifiers, ...customProperties } = traits;
  const externalIds = getExternalIdentifiersMapping(message);

  // Build user object
  const user = {};
  if (email) user.email = email;
  if (phone) user.phone = phone;

  // Build external identifiers object
  const externalIdentifiers = {};
  if (externalIds?.clientUserId) {
    externalIdentifiers.clientUserId = externalIds.clientUserId;
  }
  if (customIdentifiers) {
    externalIdentifiers.customIdentifiers = customIdentifiers;
  }

  // Add external identifiers to user if any exist
  if (Object.keys(externalIdentifiers).length > 0) {
    user.externalIdentifiers = externalIdentifiers;
  }

  const properties = removeUndefinedAndNullValues(customProperties);

  // If user or properties is empty, return null as we don't want to send empty user or properties
  if (Object.keys(user).length === 0 || Object.keys(properties).length === 0) {
    return null;
  }

  return responseBuilder({ user, properties }, apiKey, ENDPOINTS.USER_ATTRIBUTES);
};

// Helper function to process identify event for new identify flow
const responseBuilderForNewIdentifyFlow = (message, { Config }) => {
  const { apiKey } = Config;
  const responses = [];

  // Process Identity Resolution API call
  const identityResponse = responseBuilderForIdentityResolution(message, apiKey);
  if (identityResponse) {
    responses.push(identityResponse);
  }

  // Process User Attributes API call
  const attributesResponse = responseBuilderForUserAttributes(message, apiKey);
  if (attributesResponse) {
    responses.push(attributesResponse);
  }

  if (responses.length === 0) {
    throw new InstrumentationError(
      '[Attentive Tag]: Identify payload is not valid, either user or properties is empty',
    );
  }

  return responses;
};

const identifyResponseBuilder = (message, { Config }) => {
  const { apiKey, enableNewIdentifyFlow = false } = Config;
  // If enableNewIdentifyFlow is true, use the new identify flow
  if (enableNewIdentifyFlow) {
    return responseBuilderForNewIdentifyFlow(message, { Config });
  }
  let { signUpSourceId } = Config;
  let endpoint;
  let payload;
  const integrationsObj = getIntegrationsObj(message, 'attentive_tag');
  if (integrationsObj) {
    // Overriding signupSourceId if present in integrations object
    if (integrationsObj.signUpSourceId) {
      signUpSourceId = integrationsObj.signUpSourceId;
    }
    if (integrationsObj.identifyOperation?.toLowerCase() === 'unsubscribe') {
      endpoint = ENDPOINTS.UNSUBSCRIBE;
      payload = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY.name]);

      /**
       * Structure we are expecting:
       *  "subscriptions": [
       *    {
       *        "type": "MARKETING" || "TRANSACTIONAL" || "CHECKOUT_ABANDONED"
       *        "channel": "TEXT" || "EMAIL"
       *    }
       * ],
       *  "notification":
       *    {
       *        "language": "en-US" || "fr-CA"
       *    }
       */
      const { subscriptions, notification } = integrationsObj;
      payload = {
        ...payload,
        subscriptions,
        notification,
      };
    }
  }
  // If the identify request is not for unsubscribe
  if (!payload) {
    endpoint = ENDPOINTS.SUBSCRIPTIONS;
    payload = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY.name]);
    if (!signUpSourceId) {
      throw new ConfigurationError(
        '[Attentive Tag]: SignUp Source Id is required for subscribe event',
      );
    }
    payload = {
      ...payload,
      signUpSourceId,
      externalIdentifiers: getExternalIdentifiersMapping(message),
    };
  }
  if (
    !payload.user ||
    (!isDefinedAndNotNullAndNotEmpty(payload.user.email) &&
      !isDefinedAndNotNullAndNotEmpty(payload.user.phone))
  ) {
    throw new InstrumentationError('[Attentive Tag] :: Either email or phone is required');
  }
  return responseBuilder(payload, apiKey, endpoint);
};

// response builder for subscribe
const responseBuilderForSubscribe = (consentedUserContacts, signUpSourceId, apiKey) => {
  if (!signUpSourceId) {
    throw new ConfigurationError(
      '[Attentive Tag]: SignUp Source Id is required for subscribe event',
    );
  }

  if (Object.keys(consentedUserContacts).length === 0) return [];

  const subscribePayload = { user: consentedUserContacts, signUpSourceId };
  const subscribeResponse = responseBuilder(subscribePayload, apiKey, ENDPOINTS.SUBSCRIPTIONS);

  return [subscribeResponse];
};

// response builder for unsubscribe
const responseBuilderForUnsubscribe = (unsubscribeConsents, filteredUser, notification, apiKey) => {
  if (unsubscribeConsents.length === 0 || Object.keys(filteredUser).length === 0) return [];

  const unsubscribePayload = { user: filteredUser };

  // Add subscriptions if type exists
  const subscriptions = unsubscribeConsents
    .filter((consent) => consent.type)
    .map((consent) => ({
      type: consent.type,
      channel: mapChannelToSubscriptionType(consent.channel),
    }));

  if (subscriptions.length > 0) {
    unsubscribePayload.subscriptions = subscriptions;
  }

  // Add notification if present
  if (notification) {
    unsubscribePayload.notification = notification;
  }

  const unsubscribeResponse = responseBuilder(unsubscribePayload, apiKey, ENDPOINTS.UNSUBSCRIBE);

  return [unsubscribeResponse];
};

// Helper function to process subscription event track call
const subscriptionResponseBuilder = (message, { Config }) => {
  const { apiKey, signUpSourceId } = Config;
  const userPayload = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY.name]);
  // Validate user payload
  if (!userPayload?.user?.email && !userPayload?.user?.phone) {
    throw new InstrumentationError(
      '[Attentive Tag]: Either email or phone is required for subscription event',
    );
  }
  const properties = get(message, 'properties') || {};
  const { channelConsents, signUpSourceId: propSignUpSourceId, notification } = properties;

  // Determine which signUpSourceId to use
  const finalSignUpSourceId = propSignUpSourceId || signUpSourceId;

  if (!Array.isArray(channelConsents)) {
    throw new InstrumentationError('[Attentive Tag]: Channel consents must be an array');
  }

  // Separate subscribe and unsubscribe consents
  const subscribeConsents = channelConsents.filter((consent) => consent.consented === true);
  const unsubscribeConsents = channelConsents.filter((consent) => consent.consented === false);

  // Filter user data based on consents
  const subscribeConsentedUserContacts = getConsentedUserContacts(
    userPayload.user,
    subscribeConsents,
  );
  const unsubscribeConsentedUserContacts = getConsentedUserContacts(
    userPayload.user,
    unsubscribeConsents,
  );

  // Process subscribe consents
  const subscribeResponses = responseBuilderForSubscribe(
    subscribeConsentedUserContacts,
    finalSignUpSourceId,
    apiKey,
  );
  // Process unsubscribe consents
  const unsubscribeResponses = responseBuilderForUnsubscribe(
    unsubscribeConsents,
    unsubscribeConsentedUserContacts,
    notification,
    apiKey,
  );

  // Combine responses
  const responses = [...subscribeResponses, ...unsubscribeResponses];

  // Validate responses
  if (responses.length === 0) {
    throw new InstrumentationError(
      '[Attentive Tag]: No valid consent found for subscription event',
    );
  }

  return responses;
};

const trackResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;
  let endpoint;
  let payload;
  const event = get(message, 'event');
  if (!event) {
    throw new InstrumentationError('[Attentive Tag] :: Event name is not present');
  }
  if (event.toLowerCase().trim().replace(/\s+/g, '_') === 'subscription_event') {
    return subscriptionResponseBuilder(message, { Config });
  }
  if (!validateTimestamp(getFieldValueFromMessage(message, 'timestamp'))) {
    throw new InstrumentationError(
      '[Attentive_Tag]: Events must be sent within 12 hours of their occurrence.',
    );
  }
  switch (event.toLowerCase().trim().replace(/\s+/g, '_')) {
    /* Browsing Section */
    case 'product_list_viewed':
      payload = constructPayload(message, mappingConfig[ConfigCategory.PRODUCT_LIST_VIEWED.name]);
      endpoint = ConfigCategory.PRODUCT_LIST_VIEWED.endpoint;
      payload.items = getDestinationItemProperties(message, true);
      break;
    /* Ordering Section */
    case 'product_viewed':
      payload = constructPayload(message, mappingConfig[ConfigCategory.PRODUCT_VIEWED.name]);
      endpoint = ConfigCategory.PRODUCT_VIEWED.endpoint;
      payload.items = getDestinationItemProperties(message, true);
      break;
    case 'order_completed':
      payload = constructPayload(message, mappingConfig[ConfigCategory.ORDER_COMPLETED.name]);
      endpoint = ConfigCategory.ORDER_COMPLETED.endpoint;
      payload.items = getDestinationItemProperties(message, true);
      break;
    case 'product_added':
      payload = constructPayload(message, mappingConfig[ConfigCategory.PRODUCT_ADDED.name]);
      endpoint = ConfigCategory.PRODUCT_ADDED.endpoint;
      payload.items = getDestinationItemProperties(message, true);
      break;
    default:
      payload = constructPayload(message, mappingConfig[ConfigCategory.TRACK.name]);
      endpoint = ConfigCategory.TRACK.endpoint;
      payload.type = get(message, 'event');
      if (!arePropertiesValid(payload.properties)) {
        throw new InstrumentationError(
          '[Attentive Tag]:The properties contains characters which is not allowed',
        );
      }
  }

  if (getExternalIdentifiersMapping(message)) {
    payload.user = {
      ...payload.user,
      externalIdentifiers: getExternalIdentifiersMapping(message),
    };
  }
  if (!payload.user) {
    payload.user = {};
  }

  return responseBuilder(payload, apiKey, endpoint);
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    default:
      throw new InstrumentationError('Message type not supported');
  }
  return response;
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
