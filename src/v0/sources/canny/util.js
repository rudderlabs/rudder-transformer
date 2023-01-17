const path = require('path');
const fs = require('fs');
const { TransformationError } = require('../../util/errorTypes');

// import mapping json using JSON.parse to preserve object key order
const voterMapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './voterMapping.json'), 'utf-8'),
);
const authorMapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './authorMapping.json'), 'utf-8'),
);

/**
 * This function throws an error if required fields are not present.
 * @param {*} message
 */
function checkForRequiredFields(message) {
  if (!message.event || !(message.userId || message.anonymousId)) {
    throw new TransformationError('Missing essential fields from Canny');
  }
}

module.exports = { voterMapping, authorMapping, checkForRequiredFields };
