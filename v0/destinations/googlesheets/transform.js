const { getHashFromArray } = require("../../util");

const getSpreadSheetId = event => {
  const { message } = event;
  const { eventToSpreadSheetIdMap } = event.destination.Config;
  const hashMap = getHashFromArray(eventToSpreadSheetIdMap, "from", "to");

  return (
    (message.event ? hashMap[message.event.toLowerCase()] : null) ||
    hashMap[message.type.toLowerCase()] ||
    hashMap["*"]
  );
};

const process = event => {
  const spreadSheetId = getSpreadSheetId(event);
  if (spreadSheetId) {
    return {
      message: event.message,
      spreadSheetId
    };
  }
  throw new Error("No Spread Sheet Id set for this event");
};
exports.process = process;
