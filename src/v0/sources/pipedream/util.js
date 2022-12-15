/**
 * Finds the userId from event (if given) at different levels as defined in Genric Mapping
 * @param {*} event input payload to find userId from
 * @returns either userId or undefined
 */
const findUserId = event => {
  return (
    event?.userId ||
    event?.traits?.userId ||
    event?.context?.traits?.userId ||
    event?.traits?.id ||
    event?.context?.traits?.id
  );
};

/**
 * returns userId or anonymousID from event
 * @param {*} event input to find userId or anonymousId from
 * @returns userId or anonymousId or undefined
 */
const findUserIdOrAnonymousId = event => {
  return findUserId(event) || event?.anonymousId;
};

module.exports = { findUserIdOrAnonymousId };
