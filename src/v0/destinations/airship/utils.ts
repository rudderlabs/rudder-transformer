import moment from 'moment';
import isNumeric from 'validator/lib/isNumeric';
import { InstrumentationError, isDefinedNotNullNotEmpty } from '@rudderstack/integrations-lib';
import { RudderMessage } from '../../../types';
import { getFieldValueFromMessage, getIntegrationsObj } from '../../util';
import { RESERVED_TRAITS_MAPPING, AIRSHIP_TIMESTAMP_FORMAT } from './config';

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

type TimestampAttributes = Array<{
  timestampAttribute: string;
}>;

export const convertToAirshipTimestamp = (timeValue: string | number): string => {
  let millis;
  let timestamp = timeValue;
  // Check if the input is a string containing a numeric timestamp
  if (typeof timestamp === 'string' && isNumeric(timestamp)) {
    timestamp = Number(timestamp); // Convert string to number
  }

  // Check if the input is a valid date string
  if (typeof timestamp === 'string') {
    const parsedDate = moment.utc(timestamp);
    if (!parsedDate.isValid()) {
      throw new InstrumentationError(`timestamp is not supported: ${timestamp}`);
    }
    return parsedDate.format(AIRSHIP_TIMESTAMP_FORMAT);
  }

  // If it's a number, handle different timestamp formats
  if (typeof timestamp === 'number') {
    const { length } = timestamp.toString();

    if (length === 10) {
      millis = timestamp * 1000; // Convert seconds to milliseconds
    } else if (length === 13) {
      millis = timestamp; // Already in milliseconds
    } else if (length === 16) {
      millis = Math.floor(timestamp / 1000); // Convert microseconds to milliseconds
    } else {
      throw new InstrumentationError(`timestamp is not supported: ${timestamp}`);
    }

    return moment.utc(millis).format(AIRSHIP_TIMESTAMP_FORMAT);
  }

  throw new InstrumentationError(`timestamp is not supported: ${timestamp}`);
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

export const getAttributeValue = (
  key: string,
  value: string | number | object,
  extractTimestampAttributes: string[],
): AttributeValue => {
  if (extractTimestampAttributes.includes(key) && isDefinedNotNullNotEmpty(value)) {
    return convertToAirshipTimestamp(value as string);
  }
  return value as AttributeValue;
};

export const prepareAttributePayload = (
  flattenedTraits: Record<string, unknown>,
  message: RudderMessage,
  timestampAttributes?: TimestampAttributes,
): AttributePayload => {
  const timestamp = getAirshipTimestamp(message);
  const initialAttributePayload: AttributePayload = { attributes: [] };
  const airshipObjectAttributes: AirshipObjectAttributes =
    getJsonAttributesFromIntegrationsObj(message);

  const isJsonAttributesPresent =
    Array.isArray(airshipObjectAttributes?.jsonAttributes) &&
    airshipObjectAttributes?.jsonAttributes.length > 0;

  const extractTimestampAttributes = timestampAttributes
    ? timestampAttributes.map(({ timestampAttribute }) => timestampAttribute.trim())
    : [];
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
      attribute.value = getAttributeValue(key, value as AttributeValue, extractTimestampAttributes);

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
