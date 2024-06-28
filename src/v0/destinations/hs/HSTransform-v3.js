import {
  ConfigurationError,
  InstrumentationError,
  getHashFromArray,
} from '@rudderstack/integrations-lib';
import { extractCustomFields, isEmpty, validateEventName } from '../../util';

const get = require('get-value');
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

const getEventAndPropertiesFromConfig = (message, destination) => {
  const { hubspotEvents } = destination.Config;

  let event = get(message, 'event');
  if (!event) {
    throw new InstrumentationError('event name is required for track call');
  }
  if (!hubspotEvents) {
    throw new InstrumentationError('Event and property mappings are required for track call');
  }
  validateEventName(event);
  event = event.trim().toLowerCase();
  let eventName;
  let eventProperties;
  const properties = {};

  // 1. fetch event name from webapp config
  // some will traverse through all the indexes of the array and find the event
  const hubspotEventFound = hubspotEvents.some((hubspotEvent) => {
    if (
      hubspotEvent &&
      hubspotEvent.rsEventName &&
      hubspotEvent.rsEventName.trim().toLowerCase() === event &&
      !isEmpty(hubspotEvent.hubspotEventName)
    ) {
      eventName = hubspotEvent.hubspotEventName.trim();
      eventProperties = hubspotEvent.eventProperties;
      return true;
    }
    return false;
  });

  if (!hubspotEventFound) {
    throw new ConfigurationError(
      `Event name '${event}' mappings are not configured in the destination`,
    );
  }

  // 2. fetch event properties from webapp config
  eventProperties = getHashFromArray(eventProperties, ...Array(2), false);

  Object.keys(eventProperties).forEach((key) => {
    const value = get(message, `fields.initialProperty${key}`);
    if (value) {
      properties[eventProperties[key]] = value;
    }
  });

  // eslint-disable-next-line no-param-reassign
  const payload = { eventName, properties };
  return payload;
};

export const processSingleAgnosticEvent = (message, destination) => {
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
    if (objectType === 'track') {
      const { utk, email, occurredAt, objectId, initialProperty } = fields;
      const eventPropertiesFromConfig = getEventAndPropertiesFromConfig(message, destination);
      tempPayload = {
        utk,
        email,
        occurredAt,
        objectId,
        eventName: eventPropertiesFromConfig.eventName,
        properties: {
          ...extractCustomFields(initialProperty, {}, 'root', [
            'utk',
            'email',
            'occurredAt',
            'objectId',
          ]),
          ...eventPropertiesFromConfig.properties,
        },
      };
    } else {
      // endPoint = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/create';
      tempPayload = {
        properties: fields,
      };
    }

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
