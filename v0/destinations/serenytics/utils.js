const set = require("set-value");
const { constructPayload, extractCustomFields } = require("../../util");
const { MAPPING_CONFIG } = require("./config");

const payloadBuilder = (
  message,
  typeName,
  EXTRACTION_LIST,
  SERENYTICS_EXCLUSION_LIST
) => {
  const payload = constructPayload(message, MAPPING_CONFIG[typeName]);
  let customPayload = {};
  customPayload = extractCustomFields(
    message,
    customPayload,
    EXTRACTION_LIST,
    SERENYTICS_EXCLUSION_LIST
  );
  if (customPayload) {
    if (EXTRACTION_LIST[0] === "properties") {
      Object.entries(customPayload).forEach(([key, value]) => {
        set(payload, `property_${key}`, value);
      });
    } else {
      Object.entries(customPayload).forEach(([key, value]) => {
        set(payload, `trait_${key}`, value);
      });
    }
  }
  return payload;
};

module.exports = { payloadBuilder };
