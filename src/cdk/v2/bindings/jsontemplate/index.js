const genericFieldMapping = require('../../../../v0/util/data/GenericFieldMapping.json');

exports.getGenericPaths = (key, separator = '??') =>
  genericFieldMapping[key].map((path) => `.${path}`).join(` ${separator} `);
