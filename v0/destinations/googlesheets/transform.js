const { getHashFromArray, getValueFromMessage } = require("../../util");

const processWithCustomMapping = (message, attributeMap) => {
  const responseMessage = {};
  let count = 0;
  Object.keys(attributeMap).forEach(key => {
    const keyArr = [
      `${key}`,
      `properties.${key}`,
      `traits.${key}`,
      `context.traits.${key}`
    ];
    const value = getValueFromMessage(message, keyArr);
    responseMessage[count] = {
      attributeKey: attributeMap[key],
      attributeValue: value || ""
    };
    count += 1;
  });
  return responseMessage;
};
// Main process Function to handle transformation
const process = event => {
  const { message, destination } = event;
  const eventAttributeMap = getHashFromArray(
    destination.Config.eventKeyMap,
    "from",
    "to",
    false
  );
  if (destination.Config.sheetName) {
    const payload = {
      message: processWithCustomMapping(message, eventAttributeMap),
      spreadSheetId: destination.Config.sheetId,
      spreadSheet: destination.Config.sheetName
    };
    return payload;
  }
  throw new Error("No Spread Sheet set for this event");
};
exports.process = process;
