const { validateEventName } = require('./utils');

const {
  get,
  set,
  InstrumentationError,
  isDefinedAndNotNull,
} = require('@rudderstack/integrations-lib');

function removeLeadingTrailingDots(str) {
  return str.replace(/^\.+|\.+$/g, '');
}

const splitOnInstance = (str, char, instance) => {
  // Find the index of the specified instance of the character
  let index = -1;
  for (let i = 0; i < instance; i++) {
    index = str.indexOf(char, index + 1);
    if (index === -1) {
      return [str]; // Return the original string if instance not found
    }
  }

  // Split the string into two parts based on the found index
  let firstPart = removeLeadingTrailingDots(str.substring(0, index));
  let secondPart = removeLeadingTrailingDots(str.slice(index + 1));

  return [firstPart, secondPart];
};

const findGA4Event = (eventsMapping, event) => {
  // Find the event using destructuring and early return
  const { ga4EventName, eventProperties } = eventsMapping.find(
    (mapping) =>
      mapping.rsEventName?.trim().toLowerCase() === event.trim().toLowerCase() &&
      mapping.ga4EventName,
  );

  // Return an empty object if event not found
  return { eventName: ga4EventName, eventProperties } || {};
};

const handleCustomMappings = (message, Config) => {
  const { eventsMapping } = Config;

  let rsEvent = get(message, 'event');
  if (!rsEvent) {
    throw new InstrumentationError('event name is required for track call');
  }

  const ga4Event = findGA4Event(eventsMapping, rsEvent);

  const eventName = ga4Event.eventName;
  const eventPropertiesMappings = ga4Event.eventProperties || {};

  validateEventName(eventName); // validation for ga4 event name
  const ga4Payload = {
    events: [
      {
        name: eventName,
      },
    ],
  };

  for (let propertyMapping of eventPropertiesMappings) {
    // { from: properties.products.product_id, to: events[0].params.items.item_id }
    const { from, to } = propertyMapping;
    let updatedTopath;
    let isEventProp = false;
    // if it starts with events.$ then
    if (to.startsWith('events.$')) {
      updatedTopath = removeLeadingTrailingDots(to.slice('events.$'.length));
      isEventProp = true;
    }
    const fromArr = splitOnInstance(from, '$', 1);
    const toArr = splitOnInstance(updatedTopath, '$', 1);
    if (fromArr.length === 1 && toArr.length === 1) {
      isEventProp
        ? set(ga4Payload.events[0], updatedTopath, get(message, from))
        : set(ga4Payload, to, get(message, from));
    } else if (fromArr.length === 2 && toArr.length === 1) {
      // { from: properties.products.$.sku, to: events[0].params.sku }

      const paths = [].concat(getNormalisedPathArray(toArr[0]));

      const localValues = get(message, fromArr[0]);
      // localvalue is array
      if (Array.isArray(localValues)) {
        isEventProp
          ? setValueGeneric(
              ga4Payload.events[0],
              paths,
              localValues.map((localValue) => {
                return get(localValue, fromArr[1]);
              }),
            )
          : setValueGeneric(
              ga4Payload,
              paths,
              localValues.map((localValue) => {
                return get(localValue, fromArr[1]);
              }),
            );
      }
    } else if (fromArr.length === 1 && toArr.length === 2) {
      // { from: properties.categroy, to: events[0].params.items.$.category }
      const localValue = get(message, fromArr[0]);

      const existingValue = isEventProp
        ? get(ga4Payload.events[0], toArr[0])
        : get(ga4Payload, toArr[0]);

      if (Array.isArray(existingValue)) {
        for (let i = 0; i < existingValue.length; i++) {
          const paths = []
            .concat(getNormalisedPathArray(toArr[0]))
            .concat({
              key: i,
              type: 'index',
            })
            .concat(getNormalisedPathArray(toArr[1]));

          isEventProp
            ? setValueGeneric(ga4Payload.events[0], paths, localValue)
            : setValueGeneric(ga4Payload, paths, localValue);
        }
      }
    } else {
      // { from: properties.products.$.product_id, to: events[0].params.items.$.item_id }
      const localValues = get(message, fromArr[0]);
      // localvalue is array
      if (Array.isArray(localValues)) {
        for (let i = 0; i < localValues.length; i++) {
          // normalised paths
          const paths = []
            .concat(getNormalisedPathArray(toArr[0]))
            .concat({
              key: i,
              type: 'index',
            })
            .concat(getNormalisedPathArray(toArr[1]));

          const valueToSet = get(localValues[i], fromArr[1]);
          isEventProp
            ? setValueGeneric(ga4Payload.events[0], paths, valueToSet)
            : setValueGeneric(ga4Payload, paths, valueToSet);
        }
      }
    }
  }
  return ga4Payload;
};

const getNormalisedPathArray = (path) => {
  let pathArr = path.split('.');
  pathArr = pathArr.map((path) => {
    return removeLeadingTrailingDots(path);
  });
  return pathArr.map((path) => {
    return { key: path, type: 'path' };
  });
};

const setValueGeneric = (data, pathArr, value) => {
  /*
        pathArr = [
            { key: params , type: path}
            { key: items, type: path}
            { key: i, type: index }
            { key: item_id, type: path}

        ]
    */

  const checkAndInstantiate = (key, pathArr, index) => {
    // Check if the key exists and is an object, otherwise create object or array depending on the next path type

    if (!isDefinedAndNotNull(currentObject[key])) {
      if (pathArr[index + 1]?.type === 'path') {
        currentObject[key] = {};
      } else if (pathArr[index + 1]?.type === 'index') {
        currentObject[key] = [];
      }
    }
  };
  let currentObject = data;
  for (let i = 0; i < pathArr.length - 1; i++) {
    const { key, type } = pathArr[i];
    checkAndInstantiate(key, pathArr, i);
    currentObject = currentObject[key];
  }
  currentObject[pathArr[pathArr.length - 1].key] = value;
};

module.exports = {
  handleCustomMappings,
};
