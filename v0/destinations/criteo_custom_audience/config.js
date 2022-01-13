const IDENTIFIER_PRIORITY_ORDER = ["email", "madid", "identityLink", "gum"];

// TODO: move the below 2 variables to common utils
// to be reused by all audience type integrations
const USER_ADD = "add";
const USER_DELETE = "remove";

const MAX_ALLOWED_SIZE = 50000;

const getCriteoPayloadTemplate = (operationType, identifierType) => {
  return {
    data: {
      type: "ContactlistAmendment",
      attributes: {
        operation: operationType,
        identifierType,
        identifiers: []
      }
    }
  };
};

module.exports = {
  getCriteoPayloadTemplate,
  IDENTIFIER_PRIORITY_ORDER,
  USER_ADD,
  USER_DELETE,
  MAX_ALLOWED_SIZE
};
