const path = require("path");
const fs = require("fs");
const set = require("set-value");
const Message = require("../message");
const { removeUndefinedAndNullValues } = require("../../util");
const { getBrowserInfo } = require("./util");

// ref : https://www.olark.com/help/webhooks/
// import mapping json using JSON.parse to preserve object key order
const trackMapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./trackMapping.json"), "utf-8")
);

const groupMapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./groupMapping.json"), "utf-8")
);

const prepareTrackPayload = event => {
  const message = new Message("Olark");
  message.setEventType("track");
  message.setPropertiesV2(event, trackMapping);
  message.context.traits = removeUndefinedAndNullValues(message.context.traits);
  message.traits = removeUndefinedAndNullValues(message.traits);
  message.properties = removeUndefinedAndNullValues(message.properties);

  if (event.visitor?.browser) {
    const browser = getBrowserInfo(event.visitor.browser);
    set(message.context, "browser.name", browser.name);
    set(message.context, "browser.version", browser.version);
  }
  return message;
};

const prepareGroupPayload = event => {
  const groupEvents = [];
  const { groups } = event;
  groups.forEach(group => {
    const message = new Message("Olark");
    message.setEventType("group");
    message.setPropertiesV2(event, groupMapping);
    set(message, "groupId", group.id);
    set(message, "traits.kind", group.kind);
    set(message, "name", group.name);
    message.traits = removeUndefinedAndNullValues(message.traits);
    if (message.groupId) {
      groupEvents.push(message);
    }
  });
  return groupEvents;
};

function process(event) {
  const response = [];
  response.push(prepareTrackPayload(event));

  if (event.groups) {
    const groupCalls = prepareGroupPayload(event);
    response.push(...groupCalls);
  }
  return response;
}

module.exports = { process };
