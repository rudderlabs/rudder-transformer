const { getFirstValidValue } = require('./helpers');

const rules = {
  name: (message) => getFirstValidValue(message, ['name', 'properties.name']),
};

module.exports = rules;
