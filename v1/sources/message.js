const set = require("set-value");
const get = require("get-value");

const context = integration => {
  return {
    library: {
      name: "unknown",
      version: "unknown"
    },
    integration: {
      name: integration
    }
  };
};

class Message {
  constructor(integration) {
    this.context = context(integration);
    this.integrations = {
      [integration]: false
    };
    this.properties = {};
  }

  setEventName(name) {
    this.event = name;
  }

  setEventType(type) {
    this.type = type;
  }

  setProperty(name, value) {
    this[name] = value;
  }

  setProperties(event, mapping) {
    Object.keys(mapping).forEach(key => {
      const setVal = get(event, key);
      const existingVal = get(this, mapping[key]);
      // do not set if val setVal nil
      // give higher pref to first key in mapping.json in case of same value
      if (
        setVal !== null &&
        setVal !== undefined &&
        (existingVal === null || existingVal === undefined)
      ) {
        set(this, mapping[key], setVal);
      }
    });
  }
}

module.exports = Message;
