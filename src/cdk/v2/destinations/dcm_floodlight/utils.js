const lodash = require('lodash');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { getValueFromPropertiesOrTraits, getHashFromArray } = require('../../../../v0/util');
const { GENERIC_TRUE_VALUES, GENERIC_FALSE_VALUES } = require('../../../../constants');

// valid flag should be provided [1|true] or [0|false]
const mapFlagValue = (key, value) => {
  if (GENERIC_TRUE_VALUES.includes(value.toString())) {
    return 1;
  }
  if (GENERIC_FALSE_VALUES.includes(value.toString())) {
    return 0;
  }

  throw new InstrumentationError(`${key}: valid parameters are [1|true] or [0|false]`);
};
const BLACKLISTED_CHARACTERS = ['"', '<', '>', '#'];

const BASE_URL = 'https://ad.doubleclick.net/ddm/activity/';

// transform webapp dynamicForm custom floodlight variable
// into {property1: u1, property2: u2, ...}
// Ref - https://support.google.com/campaignmanager/answer/2823222?hl=en
const transformCustomVariable = (customFloodlightVariable, message) => {
  const customVariable = {};
  const customMapping = getHashFromArray(customFloodlightVariable, 'from', 'to', false);

  Object.keys(customMapping).forEach((key) => {
    // it takes care of getting the value in the order.
    // returns null if not present
    const itemValue = getValueFromPropertiesOrTraits({
      message,
      key,
    });

    if (
      // the value is not null
      !lodash.isNil(itemValue) &&
      // the value is string and doesn't have any blacklisted characters
      !(
        typeof itemValue === 'string' && BLACKLISTED_CHARACTERS.some((k) => itemValue.includes(k))
      ) &&
      // boolean values are not supported
      typeof itemValue !== 'boolean'
    ) {
      customVariable[`u${customMapping[key].replace(/u/g, '')}`] = encodeURIComponent(itemValue);
    }
  });

  return customVariable;
};

module.exports = {
  mapFlagValue,
  transformCustomVariable,
  BASE_URL,
};
