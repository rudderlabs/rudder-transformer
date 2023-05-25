const sha256 = require('sha256');
const { isDefinedAndNotNullAndNotEmpty } = require('../../util');
const { AUDIENCE_ATTRIBUTE, BINGADS_SUPPORTED_OPERATION } = require('./config');
const { InstrumentationError } = require('../../util/errorTypes');
/**
 *
 * @param {*} audienceList  - It is the list of audience to be added in the form of array". eg.
 * [
 *   {"email": "abc@email.com"},
 *   {"email": "abc@email.com"},
 *   {"email": "abc@email.com"}
 * ]
 * @param {*} Config
 * @returns The function returns a hashed array of Audience List provided by the user like "email", "deviceId", "ipAddress".
 * eg.[
 * "251014dafc651f68edac7",
 * "afbc34416ac6e7fbb9734",
 * "42cbe7eebb412bbcd5b56",
 * "379b4653a40878da7a584"
 * ]
 */
const populateIdentifiers = (audienceList, Config) => {
  const list = [];
  const { audienceType } = Config;
  const { hashRequired } = Config;
  const audienceAttribute = AUDIENCE_ATTRIBUTE[audienceType];

  if (isDefinedAndNotNullAndNotEmpty(audienceList)) {
    // traversing through every userTraits in the add array for the traits to be added.
    audienceList.forEach((userTraits) => {
      // storing keys of an object inside the add array.
      const traits = Object.keys(userTraits);
      // checking for the audience type the user wants to add is present in the input or not.
      if (!traits.includes(audienceAttribute)) {
        // throwing error if the audience type the user wants to add is not present in the input.
        throw new InstrumentationError(
          `Required property for ${audienceAttribute} type audience is not available in an object`,
        );
      }
      // here, hashing the data if is not hashed and pushing in the seedList array.
      if (hashRequired) {
        list.push({
          email: userTraits[audienceAttribute],
          hashedEmail: sha256(userTraits[audienceAttribute]),
        });
      } else {
        list.push({
          email: userTraits[audienceAttribute],
          hashedEmail: userTraits[audienceAttribute],
        });
      }
    });
  }
  return seedList;
};

/**
 * This function is used to create the output Payload.
 * @param {*} audienceList - It is the list of audience to be added in the form of array". eg.
 * [
 *   {"email": "abc@email.com"},
 *   {"email": "abc@email.com"},
 *   {"email": "abc@email.com"}
 * ]
 * @param {*} Config
 * @returns {*} a created payload {dspListPayload) object updated with the required data
 */
const createPayload = (audienceList, Config) => {
  let bingListPayload = {};
  let seedList = [];
  const { accountId } = Config;

  // Populating Seed List that conains audience list to be updated
  seedList = populateIdentifiers(audienceList, Config);
  // throwing the error if nothing is present in the seedList
  if (seedList.length === 0) {
    throw new InstrumentationError(
      `No attributes are present in the '${BINGADS_SUPPORTED_OPERATION}' property`,
    );
  }
  // Creating dspListPayload
  bingListPayload = { accountId, seedList };
  return bingListPayload;
};

module.exports = {
  createPayload,
};
