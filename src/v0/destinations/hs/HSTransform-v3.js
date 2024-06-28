const {
  BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT,
  BATCH_IDENTIFY_CRM_UPDATE_CONTACT,
  TRACK_CRM_ENDPOINT,
  BATCH_CREATE_CUSTOM_OBJECTS,
  BATCH_UPDATE_CUSTOM_OBJECTS,
} = require('./config');

const endpointMapping = {
  identify: {
    insert: BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT,
    update: BATCH_IDENTIFY_CRM_UPDATE_CONTACT,
  },
  contacts: {
    insert: BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT,
    update: BATCH_IDENTIFY_CRM_UPDATE_CONTACT,
  },
  track: {
    insert: TRACK_CRM_ENDPOINT,
    update: TRACK_CRM_ENDPOINT,
  },
  others: {
    insert: BATCH_CREATE_CUSTOM_OBJECTS,
    update: BATCH_UPDATE_CUSTOM_OBJECTS,
  },
};
const getDestinationExternalIDInfoForRetl = (message, destination) => {
  let externalIdArray = [];
  let destinationExternalId = null;
  let identifierType = null;
  let objectType = null;
  if (message.context && message.context.externalId) {
    externalIdArray = message.context.externalId;
  }
  if (externalIdArray) {
    externalIdArray.forEach((extIdObj) => {
      const { type, id } = extIdObj;
      if (type.includes(`${destination}-`)) {
        destinationExternalId = id;
        objectType = type.replace(`${destination}-`, '');
        identifierType = extIdObj.identifierType;
      }
    });
  }
  return { destinationExternalId, objectType, identifierType };
};

const getDestinationLookUpId = (message, type) => {
  const { context } = message;
  const externalIdArray = context?.lookupId || [];
  let externalIdObj;
  if (Array.isArray(externalIdArray)) {
    externalIdObj = externalIdArray.find((extIdObj) => extIdObj?.type === type);
  }
  const destinationExternalId = externalIdObj ? externalIdObj?.id?.hsSearchId : null;
  return destinationExternalId;
};
export const processSingleAgnosticEvent = (message) => {
  console.log(message)
  /**
   * if message.action = insert, update
   * insert --> create contact / track event
   * update --> update contact
   * object --> externalID
   *
   *
   * if object === identify && action = insert --> create contact
   * if object === identify && action = update --> update contact
   * else track event
   */
  console.log('[Hubspot]:: Inside transformer V3');
  let endPoint;
  let tempPayload = {};
  let operation;
  const { action, fields } = message;
  const { objectType } = getDestinationExternalIDInfoForRetl(message, 'HS');

  if (objectType === 'identify' || objectType === 'contacts' || objectType === 'track') {
    endPoint = endpointMapping[objectType][action];
  } else {
    endPoint = endpointMapping.others[action].replace(':objectType', objectType);
  }
  if (action === 'insert') {
    // endPoint = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/create';
    tempPayload = {
      properties: fields,
    };
    operation = 'create';
  } else {
    // endPoint = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/update';
    tempPayload = {
      properties: fields,
      id: getDestinationLookUpId(message, 'hubspotId'),
    };
    operation = 'update';
  }
  return { tempPayload, endPoint, operation, objectType };
};
