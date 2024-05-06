const lodash = require('lodash');
/**
 * Takes the userAttributes array fetches userIds at root level of each element
 * and make batches of Ids accoring to MAX_BATCH_SIZE
 * @param {*} userAttributes array
 * @param {*} MAX_BATCH_SIZE integer
 * @returns [e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
 */
const getUserIdBatches = (userAttributes, MAX_BATCH_SIZE) => {
  const userIds = [];
  userAttributes.forEach((userAttribute) => {
    // Dropping the user if userId is not present
    if (userAttribute.userId) {
      userIds.push(userAttribute.userId);
    }
  });
  const userIdBatches = lodash.chunk(userIds, MAX_BATCH_SIZE);
  return userIdBatches;
};

const getCustomIdBatches = (userAttributes, customIdentifier, MAX_BATCH_SIZE) => {
  const identifierArray = [];
  userAttributes.forEach((userAttribute) => {
    // Dropping the user if customIdentifier is not present
    if (userAttribute[customIdentifier]) {
      identifierArray.push(userAttribute[customIdentifier]);
    }
  });
  const identifierBatches = lodash.chunk(identifierArray, MAX_BATCH_SIZE);
  return identifierBatches;
};

module.exports = { getUserIdBatches, getCustomIdBatches };
