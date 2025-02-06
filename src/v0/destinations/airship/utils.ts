import moment from 'moment';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import { RudderMessage } from '../../../types';
import { getFieldValueFromMessage, getIntegrationsObj } from '../../util';
import { RESERVED_TRAITS_MAPPING } from './config';

export type TagPayloadEventType = 'identify' | 'group';

type AirshipTagProperties = {
  identify: 'rudderstack_integration';
  group: 'rudderstack_integration_group';
};

const AIRSHIP_TAG_PROPERTIES: Record<TagPayloadEventType, string> = {
  identify: 'rudderstack_integration',
  group: 'rudderstack_integration_group',
};

type AirshipTag = {
  [K in keyof Pick<AirshipTagProperties, TagPayloadEventType>]: string[];
};

type TagPayload<T extends TagPayloadEventType> = {
  add: AirshipTag[T];
  remove: AirshipTag[T];
  [key: string]: unknown;
};

type AttributeValue = string | number | object;

type Attribute = {
  action: 'set' | 'remove';
  key: string;
  value?: AttributeValue;
  timestamp: string;
};

type AttributePayload = {
  attributes: Attribute[];
};

type AirshipIntegrationsObj = {
  JSONAttributes: Record<string, unknown>;
  removeAttributes: string[];
};

type AirshipObjectAttributes = Partial<{
  jsonAttributes: Attribute[];
  removeAttributes: Omit<Attribute, 'value'>[];
}>;

const getDigitCount = (num: number): number => Math.floor(Math.log10(Math.abs(num))) + 1;

export const isValidTimestamp = (timestamp: string | number): boolean => {
  // Check if timestamp is a valid Unix timestamp (10 digits)
  if (typeof timestamp === 'number' || !Number.isNaN(Number(timestamp))) {
    return getDigitCount(Number(timestamp)) >= 10;
  }

  // Check if timestamp is a valid date string
  const date = moment.utc(timestamp);
  return date.isValid() && date.year() >= 1970;
};

// Airship timestamp format: https://docs.airship.com/api/ua/#api-request-format
const AIRSHIP_TIMESTAMP_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

const convertToAirshipTimestamp = (timestamp: string) => {
  if (!timestamp || !moment(timestamp).isValid()) {
    throw new InstrumentationError(`timestamp is not supported: ${timestamp}`);
  }
  return moment.utc(timestamp).format(AIRSHIP_TIMESTAMP_FORMAT);
};

export const getAirshipTimestamp = (message: RudderMessage) => {
  const timestamp = getFieldValueFromMessage(message, 'timestamp');
  return convertToAirshipTimestamp(timestamp);
};

export const prepareTagPayload = (
  flattenedTraits: Record<string, unknown>,
  initTagPayload: TagPayload<TagPayloadEventType>,
  eventType: TagPayloadEventType = 'identify',
): TagPayload<TagPayloadEventType> => {
  const property = AIRSHIP_TAG_PROPERTIES[eventType];
  const initialTagPayload: TagPayload<TagPayloadEventType> = {
    ...initTagPayload,
    add: {
      [property]: [],
    } as unknown as AirshipTag[TagPayloadEventType],
    remove: {
      [property]: [],
    } as unknown as AirshipTag[TagPayloadEventType],
  };

  const tagPayload = Object.entries(flattenedTraits).reduce((acc, [key, value]) => {
    // tags
    if (typeof value === 'boolean') {
      const tag = key.toLowerCase().replace(/\./g, '_');
      if (value === true) {
        acc.add[property].push(tag);
      }
      if (value === false) {
        acc.remove[property].push(tag);
      }
    }
    return acc;
  }, initialTagPayload);
  return tagPayload;
};

const getJsonAttributesFromIntegrationsObj = (message: RudderMessage): AirshipObjectAttributes => {
  const integrationsObj = getIntegrationsObj(
    message,
    'airship' as any,
  ) as Partial<AirshipIntegrationsObj>;
  const timestamp = getAirshipTimestamp(message);
  const airshipObjectAttributes: AirshipObjectAttributes = {};
  if (integrationsObj?.JSONAttributes) {
    airshipObjectAttributes.jsonAttributes = Object.entries(integrationsObj.JSONAttributes).map(
      ([key, value]) => {
        // object attribute type in Airship: https://docs.airship.com/api/ua/#schemas-setattributeobject
        if (Array.isArray(value)) {
          throw new InstrumentationError(
            `JsonAttribute as array is not supported for ${key} in Airship`,
          );
        }
        return {
          action: 'set',
          key,
          value: value as AttributeValue,
          timestamp,
        };
      },
    );
  }
  if (integrationsObj?.removeAttributes) {
    // Remove Attributes in Airship: https://docs.airship.com/api/ua/#schemas-removeattributeobject
    airshipObjectAttributes.removeAttributes = integrationsObj.removeAttributes.map((key) => ({
      action: 'remove',
      key,
      timestamp,
    }));
  }
  return airshipObjectAttributes;
};

export const getAttributeValue = (value: string | number | object): AttributeValue => {
  if (isValidTimestamp(value as string)) {
    return convertToAirshipTimestamp(value as string);
  }
  return value as AttributeValue;
};

export const prepareAttributePayload = (
  flattenedTraits: Record<string, unknown>,
  message: RudderMessage,
): AttributePayload => {
  const timestamp = getAirshipTimestamp(message);
  const initialAttributePayload: AttributePayload = { attributes: [] };
  const airshipObjectAttributes: AirshipObjectAttributes =
    getJsonAttributesFromIntegrationsObj(message);

  const isJsonAttributesPresent =
    Array.isArray(airshipObjectAttributes?.jsonAttributes) &&
    airshipObjectAttributes?.jsonAttributes.length > 0;

  const attributePayload = Object.entries(flattenedTraits).reduce((acc, [key, value]) => {
    // attribute
    if (typeof value !== 'boolean') {
      const attribute: Attribute = { action: 'set', key: '', value: '', timestamp };
      const keyMapped = RESERVED_TRAITS_MAPPING[key] || RESERVED_TRAITS_MAPPING[key.toLowerCase()];
      const isKeyObjectType = key.includes('.') || (key.includes('[') && key.includes(']'));
      if (keyMapped) {
        attribute.key = keyMapped;
      } else {
        attribute.key = key.replace(/\./g, '_');
      }
      if (isJsonAttributesPresent && isKeyObjectType) {
        // Skip these keys
        // they can be in the form of an array or object
        const keyParts = key?.split(/[[\]_]+/g) || [];
        if (keyParts.length === 0) {
          // If key doesn't include any of the delimiters like '[' or ']' or '_' , skip it
          return acc;
        }
        // Skip keys that exist in both traits and integrations object to avoid duplication
        const isKeyPresentInJsonAttributes = airshipObjectAttributes.jsonAttributes?.some((attr) =>
          attr.key.includes(keyParts[0]),
        );
        if (isKeyPresentInJsonAttributes) {
          // Skip this key
          return acc;
        }
      }
      attribute.value = getAttributeValue(value as AttributeValue);
      acc.attributes.push(attribute);
    }
    return acc;
  }, initialAttributePayload);

  attributePayload.attributes = [
    ...attributePayload.attributes,
    ...(airshipObjectAttributes?.jsonAttributes || []),
    ...(airshipObjectAttributes?.removeAttributes || []),
  ];

  return attributePayload;
};
