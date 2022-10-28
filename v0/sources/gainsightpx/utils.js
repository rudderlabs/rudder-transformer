/* eslint-disable no-param-reassign */
const { isDefinedAndNotNullAndNotEmpty } = require("../../util");
const { traitsToDelete, accountTraitsToDelete } = require("./config");

/**
 * This function removes all those variables which are
 * empty or undefined or null from all levels of object.
 * @param {*} obj
 * @returns payload without empty null or undefined variables
 */
const refinePayload = obj => {
  const refinedPayload = {};
  Object.keys(obj).forEach(ele => {
    if (
      obj[ele] != null &&
      typeof obj[ele] === "object" &&
      !Array.isArray(obj[ele])
    ) {
      const refinedObject = refinePayload(obj[ele]);
      if (Object.keys(refinedObject).length !== 0) {
        refinedPayload[ele] = refinePayload(obj[ele]);
      }
    } else if (
      typeof obj[ele] === "boolean" ||
      // eslint-disable-next-line no-restricted-globals
      typeof obj[ele] === "number" ||
      isDefinedAndNotNullAndNotEmpty(obj[ele])
    ) {
      refinedPayload[ele] = obj[ele];
    }
  });
  return refinedPayload;
};

/**
 * Deletes the extra elements from traits and traits.account from message
 * @param {*} message
 * @returns message payload withoout redundancy
 */
const refineTraitPayload = message => {
  traitsToDelete.forEach(ele => {
    delete message.traits[ele];
  });
  if (message.traits?.account) {
    accountTraitsToDelete.forEach(ele => {
      delete message.traits.account[ele];
    });
  }
  return message;
};

module.exports = { refinePayload, refineTraitPayload };
