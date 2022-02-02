const IDENTIFIER_PRIORITY_ORDER = ["email", "madid", "identityLink", "gum"];

// TODO: move the below 2 variables to common utils
// to be reused by all audience type integrations
const USER_ADD = "add";
const USER_DELETE = "remove";

const BASE_URL = "https://api.criteo.com/2022-01/audiences";

function getEndPoint(audienceId) {
  return `${BASE_URL}/${audienceId}/contactlist`;
}

const MAX_ALLOWED_SIZE = 50000;

const identifierAddList = {
  email: [],
  madid: [],
  identityLink: [],
  gum: []
};
const identifierDeleteList = {
  email: [],
  madid: [],
  identityLink: [],
  gum: []
};

const getCriteoPayloadTemplate = (operationType, identifier, list, Config) => {
  const criteoPayloadTemplate = {
    data: {
      type: "ContactlistAmendment",
      attributes: {
        operation: operationType,
        identifierType: identifier,
        identifiers: list
      }
    }
  };
  if (identifier === "gum") {
    criteoPayloadTemplate.data.attributes.gumCallerId = Config.gumCallerId;
  }
  return criteoPayloadTemplate;
};

module.exports = {
  getCriteoPayloadTemplate,
  IDENTIFIER_PRIORITY_ORDER,
  USER_ADD,
  USER_DELETE,
  MAX_ALLOWED_SIZE,
  identifierAddList,
  identifierDeleteList,
  getEndPoint
};
