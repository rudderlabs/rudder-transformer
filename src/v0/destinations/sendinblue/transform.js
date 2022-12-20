/* eslint-disable camelcase */
const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  constructPayload,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  TransformationError,
  getFieldValueFromMessage,
  getDestinationExternalID,
  getDestinationExternalIDs,
  defaultPutRequestConfig
} = require("../../util");
const { getIntegrationsObj } = require("../../util");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  getUnlinkContactEndpoint
} = require("./config");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { DESTINATION } = require("./config");
const {
  prepareEmailFromPhone,
  checkIfEmailOrPhoneExists,
  validateEmailAndPhone,
  checkIfContactExists,
  prepareHeader,
  removeEmptyKey,
  prepareUserTraits,
  prepareTrackEventData
} = require("./util");

const responseBuilder = (
  payload,
  endpoint,
  destination,
  trackerApi = false,
  method = defaultPostRequestConfig.requestMethod
) => {
  if (payload) {
    const response = defaultRequestConfig();
    const { apiKey, clientKey } = destination.Config;
    response.endpoint = endpoint;
    response.headers = prepareHeader(apiKey, clientKey, trackerApi);
    response.method = method;
    response.body.JSON = removeUndefinedAndNullValues(removeEmptyKey(payload));
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError(
    "Something went wrong while constructing the payload",
    400,
    {
      scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
      meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
    },
    DESTINATION
  );
};

// ref:- https://developers.sendinblue.com/reference/removecontactfromlist
const unlinkContact = (message, destination, unlinkListIds) => {
  const returnValue = [];
  unlinkListIds.forEach(listId => {
    let payload;
    const endpoint = getUnlinkContactEndpoint(listId);
    const email = getFieldValueFromMessage(message, "emailOnly");
    let phone = getFieldValueFromMessage(message, "phone");
    const contactId = getDestinationExternalID(message, "sendinblueContactId");

    if (phone) {
      phone = prepareEmailFromPhone(phone);
    }
    if (email || phone) {
      payload = { emails: [email || phone] };
    } else if (contactId) {
      payload = { ids: [contactId] };
    } else {
      throw new TransformationError(
        `At least one of email or phone or contactId is required to unlink the contact from a given list`,
        400,
        {
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
          meta:
            TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
        },
        DESTINATION
      );
    }

    const response = responseBuilder(
      payload,
      endpoint,
      destination,
      false,
      defaultPutRequestConfig.requestMethod
    );
    returnValue.push(response);
  });
  return returnValue;
};

// ref:- https://developers.sendinblue.com/reference/createcontact
const createOrUpdateContactResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.CREATE_OR_UPDATE_CONTACT;
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_OR_UPDATE_CONTACT.name]
  );

  checkIfEmailOrPhoneExists(payload.email, payload.attributes?.SMS);
  validateEmailAndPhone(payload.email, payload.attributes?.SMS);
  validateEmailAndPhone(payload.newEmail);

  // Can update a contact in the same request
  payload.updateEnabled = true;

  const listIds = getDestinationExternalIDs(message, "sendinblueIncludeListId");
  if (listIds.length > 0) {
    payload.listIds = listIds;
  }

  const integrationsObj = getIntegrationsObj(message, "sendinblue");
  payload.emailBlacklisted = integrationsObj?.emailBlacklisted;
  payload.smsBlacklisted = integrationsObj?.smsBlacklisted;

  const userTraits = prepareUserTraits(
    payload.attributes,
    destination.Config.contactAttributeMapping
  );

  payload.attributes = userTraits;

  return responseBuilder(payload, endpoint, destination);
};

// ref:- https://developers.sendinblue.com/reference/createdoicontact
const createDOIContactResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.CREATE_DOI_CONTACT;
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_DOI_CONTACT.name]
  );
  const { templateId, redirectionUrl } = destination.Config;
  const doiTemplateId =
    getDestinationExternalID(message, "sendinblueDOITemplateId") || templateId;

  if (!doiTemplateId) {
    throw new TransformationError(
      `templateId is required to create a contact using DOI`,
      400,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta:
          TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.CONFIGURATION
      },
      DESTINATION
    );
  }

  const listIds = getDestinationExternalIDs(message, "sendinblueIncludeListId");
  if (listIds.length === 0) {
    throw new TransformationError(
      `sendinblueIncludeListId is required to create a contact using DOI`,
      400,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
      },
      DESTINATION
    );
  }

  payload.templateId = doiTemplateId;
  payload.redirectionUrl = redirectionUrl;
  payload.includeListIds = listIds;

  const userTraits = prepareUserTraits(
    payload.attributes,
    destination.Config.contactAttributeMapping
  );

  payload.attributes = userTraits;

  return responseBuilder(payload, endpoint, destination);
};

// ref:- https://developers.sendinblue.com/reference/updatecontact
// identifier -> email or phone or contact id
const updateDOIContactResponseBuilder = (message, destination, identifier) => {
  let { endpoint } = CONFIG_CATEGORIES.UPDATE_DOI_CONTACT;
  endpoint = endpoint.replace("<identifier>", identifier);
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.UPDATE_DOI_CONTACT.name]
  );

  const email = getFieldValueFromMessage(message, "newEmail");
  const phone = getFieldValueFromMessage(message, "newPhone");
  validateEmailAndPhone(email, phone);

  const listIds = getDestinationExternalIDs(message, "sendinblueIncludeListId");
  const unlinkListIds = getDestinationExternalIDs(
    message,
    "sendinblueUnlinkListId"
  );

  if (listIds.length > 0) {
    payload.listIds = listIds;
  }
  if (unlinkListIds.length > 0) {
    payload.unlinkListIds = unlinkListIds;
  }

  const integrationsObj = getIntegrationsObj(message, "sendinblue");
  payload.emailBlacklisted = integrationsObj?.emailBlacklisted;
  payload.smsBlacklisted = integrationsObj?.smsBlacklisted;

  return responseBuilder(
    payload,
    endpoint,
    destination,
    false,
    defaultPutRequestConfig.requestMethod
  );
};

const createOrUpdateDOIContactResponseBuilder = async (
  message,
  destination
) => {
  let email = getFieldValueFromMessage(message, "emailOnly");
  let phone = getFieldValueFromMessage(message, "phone");

  validateEmailAndPhone(email, phone);

  if (email) {
    email = encodeURIComponent(email);
  }

  if (phone) {
    phone = encodeURIComponent(prepareEmailFromPhone(phone));
  }
  const contactId = getDestinationExternalID(message, "sendinblueContactId");
  const identifier = email || phone || contactId;

  if (!identifier) {
    throw new TransformationError(
      `At least one of email or phone or contactId is required to update the contact using DOI`,
      400,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
      },
      DESTINATION
    );
  }

  const { apiKey } = destination.Config;
  const contactExists = await checkIfContactExists(identifier, apiKey);

  if (contactExists) {
    return updateDOIContactResponseBuilder(message, destination, identifier);
  }

  return createDOIContactResponseBuilder(message, destination);
};

const identifyResponseBuilder = async (message, destination) => {
  const { doi } = destination.Config;
  if (!doi) {
    const unlinkListIds = getDestinationExternalIDs(
      message,
      "sendinblueUnlinkListId"
    );
    if (unlinkListIds.length > 0) {
      return unlinkContact(message, destination, unlinkListIds);
    }
    return createOrUpdateContactResponseBuilder(message, destination);
  }

  return createOrUpdateDOIContactResponseBuilder(message, destination);
};

// ref:- https://tracker-doc.sendinblue.com/reference/trackevent-3
const trackEventResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.TRACK_EVENTS;
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_EVENTS.name]
  );

  checkIfEmailOrPhoneExists(payload.email, payload.properties?.SMS);
  validateEmailAndPhone(payload.email, payload.properties?.SMS);

  if (!payload.email) {
    payload.email = prepareEmailFromPhone(payload.properties?.SMS);
  }

  const eventdata = prepareTrackEventData(message, payload);
  payload.eventdata = eventdata;
  delete payload.messageId;
  delete payload.data;

  if (!destination.Config.sendTraitsInTrack) {
    delete payload.properties;
    return responseBuilder(payload, endpoint, destination, true);
  }

  const userTraits = prepareUserTraits(
    payload.properties,
    destination.Config.contactAttributeMapping
  );

  payload.properties = userTraits;

  return responseBuilder(payload, endpoint, destination, true);
};

// ref:- https://tracker-doc.sendinblue.com/reference/tracklink-3
const trackLinkResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.TRACK_LINK;
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_LINK.name]
  );

  const phone = getFieldValueFromMessage(message, "phone");
  checkIfEmailOrPhoneExists(payload.email, phone);
  validateEmailAndPhone(payload.email, phone);

  if (!payload.email) {
    payload.email = prepareEmailFromPhone(phone);
  }
  return responseBuilder(payload, endpoint, destination, true);
};

const trackResponseBuilder = (message, destination) => {
  const { event } = message;
  if (!event) {
    throw new TransformationError(
      `Event name is required`,
      400,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
      },
      DESTINATION
    );
  }
  if (
    event.toLowerCase() === CONFIG_CATEGORIES.TRACK_LINK.eventName.toLowerCase()
  ) {
    return trackLinkResponseBuilder(message, destination);
  }

  return trackEventResponseBuilder(message, destination);
};

// ref :- https://tracker-doc.sendinblue.com/reference/trackpage-3
const pageResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.PAGE;
  let payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.PAGE.name]
  );

  const phone = getFieldValueFromMessage(message, "phone");

  checkIfEmailOrPhoneExists(payload.email, phone);

  if (!payload.email) {
    payload.email = prepareEmailFromPhone(phone);
  }

  const {
    ma_title,
    ma_path,
    ma_referrer,
    sib_name,
    properties,
    ...rest
  } = payload;

  const propertiesObject = {
    ma_title,
    ma_path,
    ma_referrer,
    sib_name,
    ...properties
  };

  payload = { ...rest, properties: propertiesObject };

  return responseBuilder(payload, endpoint, destination, true);
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new TransformationError(
      "Event type is required",
      400,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
      },
      DESTINATION
    );
  }

  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    case EventType.PAGE:
      response = pageResponseBuilder(message, destination);
      break;
    default:
      throw new TransformationError(
        `Event type "${messageType}" is not supported`,
        400,
        {
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
          meta:
            TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META
              .INSTRUMENTATION
        },
        DESTINATION
      );
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async inputs => {
  const respList = await simpleProcessRouterDest(inputs, DESTINATION, process);
  return respList;
};

module.exports = { process, processRouterDest };
