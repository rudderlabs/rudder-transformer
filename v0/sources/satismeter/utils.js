/* eslint-disable no-param-reassign */
const { isDefinedAndNotNullAndNotEmpty } = require("../../util");

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

module.exports = { refinePayload };
