const { isDefinedAndNotNullAndNotEmpty } = require("../../util");

const refinePayload = obj => {
  const refinedPayload = {};
  Object.keys(obj).forEach(ele => {
    if (
      obj[ele] != null &&
      typeof obj[ele] === "object" &&
      !Array.isArray(obj[ele])
    ) {
      refinedPayload[ele] = refinePayload(obj[ele]);
    } else if (
      typeof obj[ele] === "boolean" ||
      // eslint-disable-next-line no-restricted-globals
      typeof obj[ele] === "number" ||
      isDefinedAndNotNullAndNotEmpty(obj[ele])
    ) {
      refinedPayload[ele] = obj[ele];
    }
  });
  return refinedPayload;
};

const refineTraitPayload = event => {
  const message = event;
  delete message.traits?.IdentifyId;
  delete message.traits?.location;
  delete message.traits?.aptrinsicId;
  delete message.traits?.signUpDate;
  delete message.traits?.firstVisitDate;
  delete message.traits?.accountID;
  delete message.traits?.lastSeenDate;
  delete message.traits?.countryName;
  delete message.traits?.stateName;
  delete message.traits?.coordinates;
  delete message.traits?.lastVisitedUserAgentData;
  delete message.traits?.account.propertyKeys;
  delete message.traits?.createDate;
  delete message.traits?.lastModifiedDate;
  // deleting account.location as its will be least but can disturb many others
  delete message.traits?.account.location;
  delete message.traits?.account.createDate;
  delete message.traits?.account?.lastModifiedDate;
  delete message.traits?.account.lastSeenDate;
  return message;
};

module.exports = { refinePayload, refineTraitPayload };
