const get = require('get-value');
const set = require('set-value');
const truncate = require('truncate-utf8-bytes');
const validator = require('validator');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { MAX_BATCH_SIZE, configFieldsToCheck } = require('./config');
const {
  constructPayload,
  defaultPutRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  defaultDeleteRequestConfig,
  isAppleFamily,
} = require('../../util');

const { EventType, SpecedTraits, TraitsMapping } = require('../../../constants');

const {
  MAPPING_CONFIG,
  OBJECT_ACTIONS,
  CONFIG_CATEGORIES,
  DEFAULT_OBJECT_ACTION,
  ENDPOINTS,
} = require('./config');

const deviceRelatedEventNames = [
  'Application Installed',
  'Application Opened',
  'Application Uninstalled',
];

const deviceDeleteRelatedEventName = 'Application Uninstalled';

const getEndpointDetails = ({ eventType, id, deviceId }) => {
  const { endpoint, path } = ENDPOINTS[eventType];
  return { endpoint: endpoint.replace(':id', id).replace(':device_id', deviceId), path };
};

const encodePathParameter = (param) => {
  if (typeof param !== 'string') return param;
  // return param.includes('/') ? encodeURIComponent(param) : param;
  return encodeURIComponent(param);
};

const getSizeInBytes = (obj) => {
  let str = null;
  if (typeof obj === 'string') {
    // If obj is a string, then use it
    str = obj;
  } else {
    // Else, make obj into a string
    str = JSON.stringify(obj);
  }
  // Get the length of the Uint8Array
  const bytes = new TextEncoder().encode(str).length;
  return bytes;
};

const getEventChunks = (groupEvents) => {
  const eventChunks = [];
  let batchedData = [];
  let metadata = [];
  let size = 0;

  groupEvents.forEach((events) => {
    const objSize = getSizeInBytes(events);
    size += objSize;
    if (batchedData.length === MAX_BATCH_SIZE || size > 500000) {
      eventChunks.push({ data: batchedData, metadata });
      batchedData = [];
      metadata = [];
      size = 0;
    }
    metadata.push(events.metadata);
    batchedData.push(events.message.body.JSON);
  });

  if (batchedData.length > 0) {
    eventChunks.push({ data: batchedData, metadata });
  }

  return eventChunks;
};

// Get the spec'd traits, for now only address needs treatment as 2 layers.
// populate the list of spec'd traits in constants.js
const populateSpecedTraits = (payload, message) => {
  const pathToTraits = message.traits ? 'traits' : 'context.traits';
  SpecedTraits.forEach((trait) => {
    const mapping = TraitsMapping[trait];
    const keys = Object.keys(mapping);
    keys.forEach((key) => {
      const traitKey = mapping[key];
      const traitValue = get(message, `${pathToTraits}.${traitKey}`);
      set(payload, key, traitValue);
    });
  });
};

const isdeviceRelatedEventName = (eventName, destination) =>
  deviceRelatedEventNames.includes(eventName) ||
  destination?.Config?.deviceTokenEventName === eventName;

// https://customer.io/docs/api/track/#operation/identify
const identifyResponseBuilder = (userId, message) => {
  const rawPayload = {};
  // if userId is not there simply drop the payload
  const id = userId || getFieldValueFromMessage(message, 'email');
  if (!id) {
    throw new InstrumentationError('userId or email is not present');
  }
  const encodedId = encodePathParameter(id);

  // populate speced traits
  const identityTrailts = getFieldValueFromMessage(message, 'traits') || {};
  populateSpecedTraits(rawPayload, message);

  if (Object.keys(identityTrailts).length > 0) {
    const traits = Object.keys(identityTrailts);
    const pathToTraits = message.traits ? 'traits' : 'context.traits';
    traits.forEach((trait) => {
      // populate keys other than speced traits
      // also don't send anonymousId, userId as we are setting those form the SDK and it's not actually an user property for the customer
      // discard createdAt as well as we are setting the values at created_at separately
      if (
        !SpecedTraits.includes(trait) &&
        trait !== 'createdAt' &&
        trait !== 'userId' &&
        trait !== 'anonymousId'
      ) {
        const dotEscapedTrait = trait.replace('.', '\\.');
        set(rawPayload, dotEscapedTrait, get(message, `${pathToTraits}.${trait}`));
      }
    });
  }

  // populate user_properties (DEPRECATED)
  if (message.user_properties) {
    const userProps = Object.keys(message.user_properties);
    userProps.forEach((prop) => {
      const val = get(message, `user_properties.${prop}`);
      set(rawPayload, prop, val);
    });
  }

  // make user creation time
  const createAt = getFieldValueFromMessage(message, 'createdAtOnly');
  // set the created_at field if traits.createAt or context.traits.createAt is passed
  if (createAt) {
    set(rawPayload, 'created_at', Math.floor(new Date(createAt).getTime() / 1000));
  }

  // Impportant for historical import
  if (getFieldValueFromMessage(message, 'historicalTimestamp')) {
    set(
      rawPayload,
      '_timestamp',
      Math.floor(
        new Date(getFieldValueFromMessage(message, 'historicalTimestamp')).getTime() / 1000,
      ),
    );
  }
  // anonymous_id needs to be sent for identify calls to merge with any previous anon track calls
  if (message?.anonymousId) {
    set(rawPayload, 'anonymous_id', message.anonymousId);
  }
  const endpointDetails = getEndpointDetails({ eventType: 'identity', id: encodedId });
  const requestConfig = defaultPutRequestConfig;

  return { rawPayload, endpointDetails, requestConfig };
};

const aliasResponseBuilder = (message, userId) => {
  // ref : https://customer.io/docs/api/#operation/merge
  if (!userId || !message.previousId) {
    throw new InstrumentationError('Both userId and previousId are mandatory for merge operation');
  }
  const endpointDetails = getEndpointDetails({ eventType: 'mergeUser' });
  const requestConfig = defaultPostRequestConfig;
  const cioProperty = validator.isEmail(userId) ? 'email' : 'id';
  const prevCioProperty = validator.isEmail(message.previousId) ? 'email' : 'id';
  const rawPayload = {
    primary: {
      [cioProperty]: userId,
    },
    secondary: {
      [prevCioProperty]: message.previousId,
    },
  };

  return { rawPayload, endpointDetails, requestConfig };
};

const groupResponseBuilder = (message) => {
  const payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.OBJECT_EVENTS.name]);
  const rawPayload = {
    identifiers: {
      object_id: payload.object_id,
      object_type_id: payload.object_type_id,
    },
    type: 'object',
    action:
      payload.action && OBJECT_ACTIONS.includes(payload.action)
        ? payload.action
        : DEFAULT_OBJECT_ACTION,
    attributes: payload.attributes || {},
    cio_relationships: [],
  };
  const id = payload?.userId || payload?.email;
  if (id) {
    const cioProperty = validator.isEmail(id) ? 'email' : 'id';
    rawPayload.cio_relationships.push({ identifiers: { [cioProperty]: id } });
  }
  const requestConfig = defaultPostRequestConfig;
  const endpointDetails = getEndpointDetails({ eventType: 'objectEvent' });

  return { rawPayload, endpointDetails, requestConfig };
};

const defaultResponseBuilder = (message, evName, userId, evType, destination, messageType) => {
  const rawPayload = {};
  let endpointDetails;
  let trimmedEvName;
  let requestConfig = defaultPostRequestConfig;
  // any other event type except identify
  const token = get(message, 'context.device.token');
  const encodedToken = encodePathParameter(token);
  const id = encodePathParameter(userId || getFieldValueFromMessage(message, 'email'));
  // use this if only top level keys are to be sent
  // DEVICE DELETE from CustomerIO
  const isDeviceDeleteEvent = deviceDeleteRelatedEventName === evName;
  if (isDeviceDeleteEvent) {
    if (!id || !token) {
      throw new InstrumentationError('userId/email or device_token not present');
    }
    endpointDetails = getEndpointDetails({
      eventType: 'deviceDelete',
      id,
      deviceId: encodedToken,
    });
    requestConfig = defaultDeleteRequestConfig;
    return { rawPayload, endpointDetails, requestConfig };
  }

  // DEVICE registration
  const isDeviceRelatedEvent = isdeviceRelatedEventName(evName, destination);
  if (isDeviceRelatedEvent && id && token) {
    const timestamp = message.timestamp || message.originalTimestamp;
    const devProps = {
      ...message.properties,
      id: token,
      last_used: Math.floor(new Date(timestamp).getTime() / 1000),
    };
    const deviceType = get(message, 'context.device.type');
    if (deviceType && typeof deviceType === 'string') {
      // Ref - https://www.customer.io/docs/api/#operation/add_device
      // supported platform are "ios", "android"
      devProps.platform = isAppleFamily(deviceType) ? 'ios' : deviceType.toLowerCase();
    }
    set(rawPayload, 'device', devProps);
    requestConfig = defaultPutRequestConfig;
  } else {
    rawPayload.data = {};
    set(rawPayload, 'data', message.properties);
    set(rawPayload, 'name', evName);
    set(rawPayload, 'type', evType);
    if (getFieldValueFromMessage(message, 'historicalTimestamp')) {
      set(
        rawPayload,
        'timestamp',
        Math.floor(
          new Date(getFieldValueFromMessage(message, 'historicalTimestamp')).getTime() / 1000,
        ),
      );
    }
  }

  if (id) {
    endpointDetails =
      isDeviceRelatedEvent && token
        ? getEndpointDetails({ eventType: 'deviceRegister', id })
        : getEndpointDetails({ eventType: 'userEvent', id });
  } else {
    endpointDetails = getEndpointDetails({ eventType: 'anonEvent' });
    // CustomerIO supports 100byte of event name for anonymous users
    if (messageType === EventType.SCREEN) {
      // 100 - len(`Viewed  Screen`) = 86
      trimmedEvName = `Viewed ${truncate(message.event || message.properties.name, 86)} Screen`;
    } else {
      if (typeof evName !== 'string') {
        throw new InstrumentationError('Event Name type should be a string');
      } // validating evName here as well as message.name could be undefined as well
      trimmedEvName = truncate(evName, 100);
    }
    // anonymous_id needs to be sent for anon track calls to provide information on which anon user is being tracked
    // This will help in merging for subsequent calls
    if (!message.anonymousId) {
      throw new InstrumentationError('Anonymous id/ user id is required');
    }
    rawPayload.anonymous_id = message.anonymousId;
    set(rawPayload, 'name', trimmedEvName);
  }

  return { rawPayload, endpointDetails, requestConfig };
};

const validateConfigFields = (destination) => {
  const { Config } = destination;
  configFieldsToCheck.forEach((configProperty) => {
    if (!Config[configProperty]) {
      throw new ConfigurationError(`${configProperty} not found in Configs`);
    }
  });
};

module.exports = {
  getEndpointDetails,
  encodePathParameter,
  getEventChunks,
  identifyResponseBuilder,
  aliasResponseBuilder,
  groupResponseBuilder,
  defaultResponseBuilder,
  populateSpecedTraits,
  isdeviceRelatedEventName,
  validateConfigFields,
};
