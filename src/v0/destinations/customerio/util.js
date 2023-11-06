const get = require('get-value');
const set = require('set-value');
const truncate = require('truncate-utf8-bytes');
const { MAX_BATCH_SIZE, configFieldsToCheck } = require('./config');
const {
  constructPayload,
  defaultPutRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  defaultDeleteRequestConfig,
  isAppleFamily,
  validateEmail,
} = require('../../util');

const { EventType, SpecedTraits, TraitsMapping } = require('../../../constants');

const {
  MAPPING_CONFIG,
  OBJECT_ACTIONS,
  CONFIG_CATEGORIES,
  IDENTITY_ENDPOINT,
  MERGE_USER_ENDPOINT,
  USER_EVENT_ENDPOINT,
  ANON_EVENT_ENDPOINT,
  OBJECT_EVENT_ENDPOINT,
  DEFAULT_OBJECT_ACTION,
  DEVICE_DELETE_ENDPOINT,
  DEVICE_REGISTER_ENDPOINT,
} = require('./config');

const { InstrumentationError, ConfigurationError } = require('../../util/errorTypes');

const deviceRelatedEventNames = [
  'Application Installed',
  'Application Opened',
  'Application Uninstalled',
];

const deviceDeleteRelatedEventName = 'Application Uninstalled';

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
  const endpoint = IDENTITY_ENDPOINT.replace(':id', id);
  const requestConfig = defaultPutRequestConfig;

  return { rawPayload, endpoint, requestConfig };
};

const aliasResponseBuilder = (message, userId) => {
  // ref : https://customer.io/docs/api/#operation/merge
  if (!userId && !message.previousId) {
    throw new InstrumentationError('Both userId and previousId is mandatory for merge operation');
  }
  const endpoint = MERGE_USER_ENDPOINT;
  const requestConfig = defaultPostRequestConfig;
  let cioProperty = 'id';
  if (validateEmail(userId)) {
    cioProperty = 'email';
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let prev_cioProperty = 'id';
  if (validateEmail(message.previousId)) {
    prev_cioProperty = 'email';
  }
  const rawPayload = {
    primary: {
      [cioProperty]: userId,
    },
    secondary: {
      [prev_cioProperty]: message.previousId,
    },
  };

  return { rawPayload, endpoint, requestConfig };
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
  let cioProperty = 'id';
  if (validateEmail(id)) {
    cioProperty = 'email';
  }
  if (id) {
    rawPayload.cio_relationships.push({ identifiers: { [cioProperty]: id } });
  }
  const requestConfig = defaultPostRequestConfig;
  const endpoint = OBJECT_EVENT_ENDPOINT;

  return { rawPayload, endpoint, requestConfig };
};

const defaultResponseBuilder = (message, evName, userId, evType, destination, messageType) => {
  const rawPayload = {};
  let endpoint;
  let trimmedEvName;
  let requestConfig = defaultPostRequestConfig;
  // any other event type except identify
  const token = get(message, 'context.device.token');
  const id = userId || getFieldValueFromMessage(message, 'email');
  // use this if only top level keys are to be sent
  // DEVICE DELETE from CustomerIO
  const isDeviceDeleteEvent = deviceDeleteRelatedEventName === evName;
  if (isDeviceDeleteEvent) {
    if (!id || !token) {
      throw new InstrumentationError('userId/email or device_token not present');
    }
    endpoint = DEVICE_DELETE_ENDPOINT.replace(':id', id).replace(':device_id', token);
    requestConfig = defaultDeleteRequestConfig;
    return { rawPayload, endpoint, requestConfig };
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
    endpoint =
      isDeviceRelatedEvent && token
        ? DEVICE_REGISTER_ENDPOINT.replace(':id', id)
        : USER_EVENT_ENDPOINT.replace(':id', id);
  } else {
    endpoint = ANON_EVENT_ENDPOINT;
    // CustomerIO supports 100byte of event name for anonymous users
    if (messageType === EventType.SCREEN) {
      // 100 - len(`Viewed  Screen`) = 86
      trimmedEvName = `Viewed ${truncate(message.event || message.properties.name, 86)} Screen`;
    } else {
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

  return { rawPayload, endpoint, requestConfig };
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
  getEventChunks,
  identifyResponseBuilder,
  aliasResponseBuilder,
  groupResponseBuilder,
  defaultResponseBuilder,
  populateSpecedTraits,
  isdeviceRelatedEventName,
  validateConfigFields,
};
