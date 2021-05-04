const { getHashFromArray, getValueFromMessage } = require("../../util");

// Retrieve Google-Sheets Tab name based on the destination event-to-tab map
const getSheet = event => {
  const { message } = event;
  const { eventSheetMapping } = event.destination.Config;
  const hashMap = getHashFromArray(eventSheetMapping, "from", "to");

  return (
    (message.event ? hashMap[message.event.toLowerCase()] : null) ||
    (message.name ? hashMap[message.name.toLowerCase()] : null) ||
    hashMap[message.type.toLowerCase()] ||
    hashMap["*"]
  );
};

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
  const sheet = getSheet(event);
  const eventAttributeMap = getHashFromArray(
    destination.Config.eventKeyMap,
    "from",
    "to",
    false
  );
  if (sheet) {
    const payload = {
      message: processWithCustomMapping(message, eventAttributeMap),
      spreadSheetId: destination.Config.sheetId,
      spreadSheet: sheet
    };
    return payload;
  }
  throw new Error("No Spread Sheet Tab set for this event");
};
exports.process = process;
