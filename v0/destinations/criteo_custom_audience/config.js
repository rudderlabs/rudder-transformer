const IDENTIFIER_PRIORITY_ORDER = ["email", "madid", "identityLink", "gum"];

// TODO: move the below 2 variables to common utils
// to be reused by all audience type integrations
const USER_ADD = "add";
const USER_DELETE = "remove";

const BASE_URL = "https://api.criteo.com/2021-10/audiences";

function getEndPoint(audienceId) {
  return `${BASE_URL}/${audienceId}/contactlist`;
}

const MAX_ALLOWED_SIZE = 50000;

const getCriteoPayloadTemplate = (operationType, identifier, list) => {
  return {
    data: {
      type: "ContactlistAmendment",
      attributes: {
        operation: operationType,
        identifierType: identifier,
        identifiers: list
      }
    }
  };
};

module.exports = {
  getCriteoPayloadTemplate,
  IDENTIFIER_PRIORITY_ORDER,
  USER_ADD,
  USER_DELETE,
  MAX_ALLOWED_SIZE,
  getEndPoint
};

/** "listData": {
  "add": [
      {
          "EMAIL": "shrouti@abc.com"
      },
      {
        "gum": "gumid"
      },
      {
        "madid": "ad"
      }
  ],
  "remove": [
      {
          "EMAIL": "shrouti@abc.com",
          "DOBM": "2",
          "DOBD": "13",
          "DOBY": "2013",
          "PHONE": "@09432457768",
          "GEN": "f",
          "FI": "Ms.",
          "MOBILE_ADVERTISER_ID": "ABC",
          "ZIP": "ZIP ",
          "ST": "123abc ",
          "COUNTRY": "IN"
      }
  ]
}

Transformed payload; mutliple responses will be created and multiple requests will be sent
1. response.body.JSON =
{
  "data": {
    "type": "ContactlistAmendment",
    "attributes": {
        "operation": "add",
        "identifierType": "email",
        "identifiers": [
            "shrouti@abc.com"
        ]
    }
  }
}
2. response.body.JSON =
{
  "data": {
    "type": "ContactlistAmendment",
    "attributes": {
        "operation": "add",
        "identifierType": "gum",
        "identifiers": [
            "gumId"
        ]
    }
  }
}
*/
