const Message = require('../message');
const { CommonUtils } = require('../../util/common');
const { generateUUID, isDefinedAndNotNull, getBodyFromV2SpecPayload } = require('../../v0/util');
const { eventsMapping } = require('./config');

const mapping = require('./mapping.json');

const processEvent = (inputPayload) => {
  const message = new Message(`Cordial`);
  let eventName = inputPayload.event?.a || inputPayload.event?.action;
  if (eventName in eventsMapping) {
    eventName = eventsMapping[eventName];
  }
  message.setEventType('track');
  message.setEventName(eventName);
  message.setPropertiesV2(inputPayload, mapping);

  const externalId = [];
  // setting up cordial contact_id to externalId
  if (inputPayload?.contact?.cID) {
    externalId.push({
      type: 'cordialContactId',
      id: inputPayload.contact.cID,
    });
  }
  message.context.externalId = externalId;

  if (!isDefinedAndNotNull(message.userId)) {
    message.anonymousId = generateUUID();
  }
  // Due to multiple mappings to the same destination path object some are not showing up due to which we are doing the following
  message.context.traits = { ...message.context.traits, ...(inputPayload?.contact ?? {}) };
  message.properties = {
    ...message.properties,
    ...(inputPayload?.event?.properties ?? {}),
    ...(inputPayload?.event ?? {}),
  };
  delete message.properties.properties;
  delete message.properties.d;
  // eslint-disable-next-line no-underscore-dangle
  delete message.properties._id;
  return message;
};

const process = (inputEvent) => {
  const event = getBodyFromV2SpecPayload(inputEvent);
  const eventsArray = CommonUtils.toArray(event);
  return eventsArray.map(processEvent);
};

exports.process = process;
