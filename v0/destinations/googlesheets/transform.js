const {
  getHashFromArray,
  getMappingConfig,
  constructPayload
} = require("../../util");

const CONFIG_CATEGORIES = {
  SHEETS: { name: "GoogleSheetsMapping" }
};
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const getTabName = event => {
  const { message } = event;
  const { eventToTabMap } = event.destination.Config;
  const hashMap = getHashFromArray(eventToTabMap, "from", "to");

  return (
    (message.event ? hashMap[message.event.toLowerCase()] : null) ||
    hashMap[message.type.toLowerCase()] ||
    hashMap["*"]
  );
};

const process = event => {
  const { message, destination } = event;
  const tabName = getTabName(event);
  if (tabName) {
    const payload = constructPayload(
      message,
      MAPPING_CONFIG.GoogleSheetsMapping
    );
    payload.spreadSheetId = destination.Config.sheetId;
    payload.spreadSheetTab = tabName;
    return payload;
  }
  throw new Error("No Spread Sheet Tab set for this event");
};
exports.process = process;
