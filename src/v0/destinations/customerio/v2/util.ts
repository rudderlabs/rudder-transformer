import get from 'get-value';
import btoa from 'btoa';
import {
  ConfigurationError,
  InstrumentationError,
  isDefinedNotNullNotEmpty,
} from '@rudderstack/integrations-lib';
import { safeSetValue } from '../../../util/safeSetValue';
import {
  constructPayload,
  getFieldValueFromMessage,
  isAppleFamily,
  getValidE164PhoneNumber,
  validateEventName,
} from '../../../util';
import { populateSpecedTraits } from '../util';
import { SpecedTraits } from '../../../../constants';
import {
  getV2Endpoint,
  V2_BATCH_PATH,
  DEVICE_EVENT_NAMES,
  DEVICE_DELETE_EVENT_NAME,
  OBJECT_ACTIONS,
  DEFAULT_OBJECT_ACTION,
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
} from './config';
import { CustomerIOV2Payload, CustomerIOV2Identifiers, CustomerIODestination } from './types';

export const toUnixSeconds = (v: unknown): number =>
  Math.floor(new Date(v as string).getTime() / 1000);

// Resolve one person identifier under the destination's configured userIdIdentifierType key.
// Every person-side identifier in the v2 payload — `identifiers`, a merge's
// primary/secondary, and an object's cio_relationships person side — goes through here so
// a destination has exactly one identifier policy. Auto-detecting the key per call site
// (e.g. `isEmail(id) ? 'email' : 'id'`) would address a different Customer.io profile than
// the rest of the destination's traffic whenever userIdIdentifierType is `phone` or `cio_id`.
const personIdentifierFor = (
  value: unknown,
  destination: CustomerIODestination,
  fieldName = 'userId',
): CustomerIOV2Identifiers => {
  const { userIdIdentifierType } = destination.Config;

  // Strict mapping: the userId is the only accepted identifier and it always lands on
  // the configured key. There is deliberately no email/anonymousId fallback — silently
  // identifying a person by a different key than the one configured would point the
  // event at the wrong Customer.io profile. userIdIdentifierType is required config for v2 (the
  // destination schema enforces it conditionally on apiVersion), so a missing value is a
  // misconfiguration rather than a bad event.
  if (!userIdIdentifierType) {
    throw new ConfigurationError('userIdIdentifierType not found in Configs');
  }
  // CustomerIO accepts an identifier as a string or a number, so both pass through as-is;
  // anything else (or a blank/whitespace-only string) is no use as a lookup key.
  if (
    !(typeof value === 'string' || typeof value === 'number') ||
    !isDefinedNotNullNotEmpty(value)
  ) {
    throw new InstrumentationError(
      `a non-empty string or number ${fieldName} is required when the userId identifier type is configured as \`${userIdIdentifierType}\``,
    );
  }
  if (userIdIdentifierType === 'phone') {
    // Send the same form we validated. getValidE164PhoneNumber strips separators before
    // parsing, so `+1 (555) 123-4567` passes on the strength of `+15551234567`; shipping
    // the authored spelling would gate on a value we never transmit and let two spellings
    // of one number resolve to two different profiles.
    const e164 = getValidE164PhoneNumber(String(value));
    if (!e164) {
      throw new InstrumentationError('Phone number is not in E.164 format.');
    }
    return { [userIdIdentifierType]: e164 };
  }
  return { [userIdIdentifierType]: value };
};

const personIdentifiers = (message, destination: CustomerIODestination): CustomerIOV2Identifiers =>
  personIdentifierFor(getFieldValueFromMessage(message, 'userIdOnly'), destination);

// Build the attributes object from speced + free-form traits. Reuses v1's
// populateSpecedTraits and set() (which apply dot-path nesting / escaping) on a
// fresh local object, so no input is mutated.
const buildTraitAttributes = (message): Record<string, unknown> => {
  const attributes: Record<string, unknown> = {};
  // Speced traits (e.g. address) are nested via v1's shared helper.
  populateSpecedTraits(attributes, message);

  const pathToTraits = message.traits ? 'traits' : 'context.traits';
  const traits = getFieldValueFromMessage(message, 'traits') || {};
  Object.keys(traits)
    .filter(
      (trait) =>
        !SpecedTraits.includes(trait) &&
        trait !== 'createdAt' &&
        trait !== 'userId' &&
        trait !== 'anonymousId',
    )
    .forEach((trait) => {
      // Escape backslashes first, then dots, so keys remain flat and unambiguous for set-value path parsing
      // trait name is customer-supplied; escaping dots does not help for a bare
      // reserved key such as `constructor`, which set-value still refuses to write
      safeSetValue(
        attributes,
        trait.replace(/\\/g, '\\\\').replace(/\./g, '\\.'),
        get(message, `${pathToTraits}.${trait}`),
      );
    });

  return attributes;
};

export const buildIdentify = (message, destination: CustomerIODestination): CustomerIOV2Payload => {
  const id =
    getFieldValueFromMessage(message, 'userIdOnly') || getFieldValueFromMessage(message, 'email');
  if (!id) {
    throw new InstrumentationError('userId or email is not present');
  }
  const createdAt = getFieldValueFromMessage(message, 'createdAtOnly');
  const hist = getFieldValueFromMessage(message, 'historicalTimestamp');
  const attributes: Record<string, unknown> = {
    ...buildTraitAttributes(message),
    ...(createdAt ? { created_at: toUnixSeconds(createdAt) } : {}),
    ...(hist ? { _timestamp: toUnixSeconds(hist) } : {}),
    ...(message.anonymousId ? { anonymous_id: message.anonymousId } : {}),
  };
  return {
    type: 'person',
    action: 'identify',
    identifiers: personIdentifiers(message, destination),
    attributes,
  };
};

// Historical imports carry a timestamp; live events do not. Returns a spreadable
// fragment so callers stay immutable.
const historicalTimestamp = (message): { timestamp?: number } => {
  const hist = getFieldValueFromMessage(message, 'historicalTimestamp');
  return hist ? { timestamp: toUnixSeconds(hist) } : {};
};

export const buildTrack = (
  message,
  evName,
  destination: CustomerIODestination,
): CustomerIOV2Payload => {
  validateEventName(message.event);
  return {
    type: 'person',
    action: 'event',
    identifiers: personIdentifiers(message, destination),
    name: String(evName),
    attributes: message.properties || {},
    ...historicalTimestamp(message),
  };
};

export const buildPage = (
  message,
  action: 'page',
  evName,
  destination: CustomerIODestination,
): CustomerIOV2Payload => {
  if (typeof evName !== 'string') {
    throw new InstrumentationError('Event Name type should be a string');
  }
  return {
    type: 'person',
    action,
    identifiers: personIdentifiers(message, destination),
    name: evName,
    attributes: message.properties || {},
    ...historicalTimestamp(message),
  };
};

export const buildScreen = (
  message,
  action: 'screen',
  evName,
  destination: CustomerIODestination,
): CustomerIOV2Payload => {
  if (typeof evName !== 'string') {
    throw new InstrumentationError('Event Name type should be a string');
  }
  return {
    type: 'person',
    action,
    identifiers: personIdentifiers(message, destination),
    name: `Viewed ${evName} Screen`,
    attributes: message.properties || {},
    ...historicalTimestamp(message),
  };
};

export const buildMerge = (message, destination: CustomerIODestination): CustomerIOV2Payload => ({
  type: 'person',
  action: 'merge',
  // Both sides of a merge are person identifiers, so they use the destination's
  // configured mapping — the same key identify/track write the profile under.
  primary: personIdentifierFor(getFieldValueFromMessage(message, 'userIdOnly'), destination),
  secondary: personIdentifierFor(message.previousId, destination, 'previousId'),
});

export const buildObject = (message, destination: CustomerIODestination): CustomerIOV2Payload => {
  // constructPayload's `excludes` deletes keys (e.g. traits.action) from the
  // source object. Clone first so the caller's message is never mutated.
  const mapped = constructPayload(
    structuredClone(message),
    MAPPING_CONFIG[CONFIG_CATEGORIES.OBJECT_EVENTS.name],
  )!;
  // The relationship's person side is a person identifier too, so it uses the
  // destination's configured mapping rather than detecting email-vs-id per event.
  const cioRelationships = isDefinedNotNullNotEmpty(mapped.userId)
    ? [{ identifiers: personIdentifierFor(mapped.userId, destination) }]
    : [];
  return {
    type: 'object',
    action:
      mapped.action && OBJECT_ACTIONS.includes(mapped.action)
        ? mapped.action
        : DEFAULT_OBJECT_ACTION,
    identifiers: { object_id: mapped.object_id, object_type_id: mapped.object_type_id },
    attributes: mapped.attributes || {},
    cio_relationships: cioRelationships,
  };
};

// Resolve the person id (userId/email) and device token used to decide and build
// device payloads. Shared by deviceActionFor (gating) and buildDevice (construction).
const getDeviceCredentials = (message): { id: unknown; token: unknown } => ({
  id: getFieldValueFromMessage(message, 'userIdOnly') || getFieldValueFromMessage(message, 'email'),
  token: get(message, 'context.device.token'),
});

export const buildDevice = (
  message,
  action: 'add_device' | 'delete_device',
  destination: CustomerIODestination,
): CustomerIOV2Payload => {
  const { id, token } = getDeviceCredentials(message);
  if (!id || !token) {
    throw new InstrumentationError('userId/email or device_token not present');
  }
  const identifiers = personIdentifiers(message, destination);
  if (action === 'delete_device') {
    return { type: 'person', action, identifiers, device: { token } };
  }
  const deviceType = get(message, 'context.device.type');
  const ts = message.timestamp || message.originalTimestamp;
  const deviceAttributes =
    (constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.DEVICE.name]) as Record<
      string,
      unknown
    >) || {};
  const platform =
    deviceType && typeof deviceType === 'string'
      ? { platform: isAppleFamily(deviceType) ? 'ios' : deviceType.toLowerCase() }
      : {};
  const device: NonNullable<CustomerIOV2Payload['device']> = {
    token,
    ...(ts ? { last_used: toUnixSeconds(ts) } : {}),
    attributes: { ...deviceAttributes, ...message.properties },
    ...platform,
  };
  return { type: 'person', action, identifiers, device };
};

export const deviceActionFor = (
  message,
  evName: string,
  destination: CustomerIODestination,
): 'add_device' | 'delete_device' | null => {
  const isDevice =
    DEVICE_EVENT_NAMES.includes(evName) || destination.Config.deviceTokenEventName === evName;
  if (!isDevice) {
    return null;
  }
  if (evName === DEVICE_DELETE_EVENT_NAME) {
    return 'delete_device';
  }
  // add_device: mirror v0 behaviour — a device-register event with a missing
  // userId/email or device token degrades to a normal track event rather than
  // building a device payload.
  const { id, token } = getDeviceCredentials(message);
  if (!id || !token) {
    return null;
  }
  return 'add_device';
};

// Resolve the v2 request metadata (endpoint/method/headers) shared by every
// event — all v2 traffic targets the single /api/v2/batch endpoint.
export const buildRequestMeta = (
  destination: CustomerIODestination,
): {
  endpoint: string;
  endpointPath: string;
  method: string;
  headers: Record<string, unknown>;
} => ({
  endpoint: getV2Endpoint(destination.Config.datacenter),
  endpointPath: V2_BATCH_PATH,
  method: 'POST',
  headers: {
    Authorization: `Basic ${btoa(`${destination.Config.siteID}:${destination.Config.apiKey}`)}`,
    'Content-Type': 'application/json',
  },
});
