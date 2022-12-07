const { Utils } = require("rudder-transformer-cdk");

const forFirstName = ["firstname", "firstName"];
const forLastName = ["lastname", "lastName"];

function cleanResponse(event, mappedPayload) {
  // Here basically we have a requirement wherein
  // we have to remove certain properties from the final payload
  const flattenedPayload = Utils.removeUndefinedAndNullValues(mappedPayload);
  forFirstName.forEach(key => {
    if (flattenedPayload[key]) {
      delete flattenedPayload[key];
    }
  });
  forLastName.forEach(key => {
    if (flattenedPayload[key]) {
      delete flattenedPayload[key];
    }
  });
  return flattenedPayload;
}

module.exports = { cleanResponse };
