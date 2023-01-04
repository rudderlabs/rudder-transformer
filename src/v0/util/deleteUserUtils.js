const _ = require("lodash");

const getBatchedIds = (userAttributes, DELETE_MAX_BATCH_SIZE) => {
  const identity = [];
  userAttributes.forEach(userAttribute => {
    // Dropping the user if userId is not present
    if (userAttribute.userId) {
      identity.push(userAttribute.userId);
    }
  });
  const batchEvents = _.chunk(identity, DELETE_MAX_BATCH_SIZE);
  return batchEvents;
};

module.exports = { getBatchedIds };
