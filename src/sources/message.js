const set = require('set-value');
const get = require('get-value');

const { getValueFromMessage, setValueForUntrustedPath } = require('../v0/util');

const context = (integration) => ({
  library: {
    name: 'unknown',
    version: 'unknown',
  },
  integration: {
    name: integration,
  },
});

class Message {
  constructor(integration) {
    this.context = context(integration);
    this.integrations = {
      [integration]: false,
    };
  }

  setEventName(name) {
    this.event = name;
  }

  setEventType(type) {
    this.type = type;
  }

  setProperty(name, value) {
    // callers pass paths built from inbound payloads (e.g. `properties.${key}` in the
    // shopify and braze source transformations), so the key may be one set-value refuses
    // to write. setProperties/setPropertiesV2 below stay on plain `set` because their
    // destination keys come from our own mapping.json.
    setValueForUntrustedPath(this, name, value);
  }

  setProperties(event, mapping) {
    Object.keys(mapping).forEach((key) => {
      const setVal = get(event, key);
      let destKeys = mapping[key];
      if (!Array.isArray(destKeys)) {
        destKeys = [destKeys];
      }
      destKeys.forEach((destKey) => {
        const existingVal = get(this, destKey);
        // do not set if val setVal nil
        // give higher pref to first key in mapping.json in case of same value
        if (
          setVal !== null &&
          setVal !== undefined &&
          (existingVal === null || existingVal === undefined)
        ) {
          set(this, destKey, setVal);
        }
      });
    });
  }

  setPropertiesV2(event, mappingJson) {
    mappingJson.forEach((mapping) => {
      const { sourceKeys } = mapping;
      let { destKeys } = mapping;
      const setVal = getValueFromMessage(event, sourceKeys);
      if (!Array.isArray(destKeys)) {
        destKeys = [destKeys];
      }
      destKeys.forEach((destKey) => {
        const existingVal = get(this, destKey);
        // do not set if val setVal nil
        // give higher pref to first key in mapping.json in case of same value
        if (
          setVal !== null &&
          setVal !== undefined &&
          (existingVal === null || existingVal === undefined)
        ) {
          set(this, destKey, setVal);
        }
      });
    });
  }

  setTimestamp(timestamp) {
    this.timestamp = timestamp;
  }
}

module.exports = Message;
