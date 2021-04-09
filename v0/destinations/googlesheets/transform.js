const { getHashFromArray, constructPayload } = require("../../util");
const { MAPPING_CONFIG, CONFIG_CATEGORIES } = require("./config");

// Retrieve Google-Sheets Tab name based on the destination event-to-tab map
const getTabName = event => {
  const { message } = event;
  const { eventToTabMap } = event.destination.Config;
  const hashMap = getHashFromArray(eventToTabMap, "from", "to");

  return (
    (message.event ? hashMap[message.event.toLowerCase()] : null) ||
    (message.name ? hashMap[message.name.toLowerCase()] : null) ||
    hashMap[message.type.toLowerCase()] ||
    hashMap["*"]
  );
};

// Main process Function to handle transformation
const process = event => {
  const { message, destination } = event;
  const tabName = getTabName(event);
  if (tabName) {
    const payload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.SHEETS.name]
    );
    payload.spreadSheetId = destination.Config.sheetId;
    payload.spreadSheetTab = tabName;
    return payload;
  }
  throw new Error("No Spread Sheet Tab set for this event");
};
exports.process = process;
