const _ = require("lodash");
/**
 * Takes the userAttributes array fetches userIds at root level of each element
 * and make batches of Ids accoring to MAX_BATCH_SIZE
 * @param {*} userAttributes array
 * @param {*} MAX_BATCH_SIZE integer
 * @returns [e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
 */
const getUserIdBatches = (userAttributes, MAX_BATCH_SIZE) => {
  const userIds = [];
  userAttributes.forEach(userAttribute => {
    // Dropping the user if userId is not present
    if (userAttribute.userId) {
      userIds.push(userAttribute.userId);
    }
  });
  const userIdBatches = _.chunk(userIds, MAX_BATCH_SIZE);
  return userIdBatches;
};

module.exports = { getUserIdBatches };
