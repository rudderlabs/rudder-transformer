const { defaultRequestConfig } = require("../../util");
const {
  IDENTIFIER_PRIORITY_ORDER,
  getCriteoPayloadTemplate
} = require("./config");

const getIdentifierBasedOnPriority = userSchema => {
  const userSchemaSet = new Set(userSchema);
  let requiredField;
  IDENTIFIER_PRIORITY_ORDER.some(field => {
    if (userSchemaSet.has(field)) {
      requiredField = field;
      return true;
    }
    return false;
  });

  return requiredField;
};

const checkIdentifier = (obj, identifierAddList) => {
  IDENTIFIER_PRIORITY_ORDER.some(type => {
    if (type in obj) {
      // add the value in array
      identifierAddList[type].push(obj[type]);
      return true;
    }
    return false;
  });
};

const createResponse = (list, type, obj, endpoint, accessToken) => {
  const response = defaultRequestConfig;
  response.method = "PATCH";
  response.body.JSON = getCriteoPayloadTemplate(type, obj, list);
  response.endpoint = endpoint;
  response.headers = {
    Authorization: `Bearer ${accessToken}`
  };
};
module.exports = {
  getIdentifierBasedOnPriority,
  checkIdentifier,
  createResponse
};
