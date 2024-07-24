const Message = require('../../../v0/sources/message');
const { CommonUtils } = require('../../../util/common');
const { generateUUID, isDefinedAndNotNull } = require('../../../v0/util');
const { eventsMapping } = require('./config');

const mapping = require('./mapping.json');

const processEvent = (event) => {
  const message = new Message(`Cordial`);
  let eventName = event.event?.a || event.event?.action;
  if (eventName in eventsMapping) {
    eventName = eventsMapping[eventName];
  }
  message.setEventType('track');
  message.setEventName(eventName);
  message.setPropertiesV2(event, mapping);

  const externalId = [];
  // setting up cordial contact_id to externalId
  if (event.cID) {
    externalId.push({
      type: 'cordialContactId',
      id: event.cID,
    });
  }
  message.context.externalId = externalId;

  if (!isDefinedAndNotNull(message.userId)) {
    message.anonymousId = generateUUID();
  }
  // Due to multiple mappings to the same destination path object some are not showing up due to which we are doing the following
  message.context.traits = { ...message.context.traits, ...event.contact };
  message.properties = { ...message.properties, ...event.event.properties, ...event.event };
  delete message.properties.properties;
  return message;
};

const process = (inputEvent) => {
  const { event: events } = inputEvent;
  const eventsArray = CommonUtils.toArray(events);
  return eventsArray.map(processEvent);
};

exports.process = process;
