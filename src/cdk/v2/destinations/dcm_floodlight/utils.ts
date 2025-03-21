import lodash from 'lodash';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import { getValueFromPropertiesOrTraits, getHashFromArray } from '../../../../v0/util';
import { GENERIC_TRUE_VALUES, GENERIC_FALSE_VALUES } from '../../../../constants';

type CustomFloodlightVariable = Array<{ from: string; to: string }>;
type Message = Record<string, any>;
type CustomMapping = Record<string, string>;
type CustomVariable = Record<string, string>;

export const BLACKLISTED_CHARACTERS = ['"', '<', '>', '#'];

export const BASE_URL = 'https://ad.doubleclick.net/ddm/activity/';

export const mapFlagValue = (key: string, value: string | number | boolean): number => {
  if (GENERIC_TRUE_VALUES.includes(value.toString())) {
    return 1;
  }
  if (GENERIC_FALSE_VALUES.includes(value.toString())) {
    return 0;
  }

  throw new InstrumentationError(`${key}: valid parameters are [1|true] or [0|false]`);
};

export const transformCustomVariable = (
  customFloodlightVariable: CustomFloodlightVariable,
  message: Message
): CustomVariable => {
  const customVariable: CustomVariable = {};
  const customMapping: CustomMapping = getHashFromArray(customFloodlightVariable, 'from', 'to', false) as CustomMapping;

  Object.keys(customMapping).forEach((key) => {
    const itemValue = getValueFromPropertiesOrTraits({
      message,
      key,
    });

    if (
      !lodash.isNil(itemValue) &&
      !(
        typeof itemValue === 'string' && BLACKLISTED_CHARACTERS.some((k) => itemValue.includes(k))
      ) &&
      typeof itemValue !== 'boolean'
    ) {
      customVariable[`u${customMapping[key].replace(/u/g, '')}`] = encodeURIComponent(itemValue);
    }
  });

  return customVariable;
};