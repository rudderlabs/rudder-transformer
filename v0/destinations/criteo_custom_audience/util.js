const { IDENTIFIER_PRIORITY_ORDER } = require("./config");

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

module.exports = { getIdentifierBasedOnPriority };
