const get = require("get-value");
const { getValueFromMessage } = require("../../util");

const SOURCE_KEYS = ["properties", "traits", "context.traits"];

const getMappingFieldValueFormMessage = (message, sourceKey, mappingKey) => {
  let value;
  const tempStore = getValueFromMessage(message, sourceKey);
  if (tempStore) {
    value = tempStore[mappingKey] || get(tempStore, mappingKey);
  }
  return value;
};

const processWithCustomMapping = (message, attributeKeyMapping) => {
  const responseMessage = {};
  const fromKey = "from";
  const toKey = "to";
  let count = 0;

  if (Array.isArray(attributeKeyMapping)) {
    attributeKeyMapping.forEach(mapping => {
      let value;
      value = getValueFromMessage(message, mapping[fromKey]);
      if (!value) {
        SOURCE_KEYS.some(sourceKey => {
          value = getMappingFieldValueFormMessage(
            message,
            sourceKey,
            mapping[fromKey]
          );
          if (value) {
            return true;
          }
          return false;
        });
      }

      responseMessage[count] = {
        attributeKey: mapping[toKey],
        attributeValue: value || ""
      };
      count += 1;
    });
  }
  return responseMessage;
};
// Main process Function to handle transformation
const process = event => {
  const { message, destination } = event;
  if (destination.Config.sheetName) {
    const payload = {
      message: processWithCustomMapping(
        message,
        destination.Config.eventKeyMap
      ),
      spreadSheetId: destination.Config.sheetId,
      spreadSheet: destination.Config.sheetName
    };
    return payload;
  }
  throw new Error("No Spread Sheet set for this event");
};
exports.process = process;
