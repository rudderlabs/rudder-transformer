const genericFieldMapping = require("../../../../v0/util/data/GenericFieldMapping.json");

exports.getGenericPaths = key => {
  return genericFieldMapping[key].map(path => `.${path}`).join(" ?? ");
};
