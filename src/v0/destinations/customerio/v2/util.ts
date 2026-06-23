import get from 'get-value';
import set from 'set-value';
import validator from 'validator';
import btoa from 'btoa';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  constructPayload,
  getFieldValueFromMessage,
  isAppleFamily,
  validateEventName,
} from '../../../util';
import { populateSpecedTraits } from '../util';
import { EventType, SpecedTraits } from '../../../../constants';
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

const toUnixSeconds = (v: unknown): number => Math.floor(new Date(v as string).getTime() / 1000);

const personIdentifiers = (message): CustomerIOV2Identifiers => {
  const userId = getFieldValueFromMessage(message, 'userIdOnly');
  const email = getFieldValueFromMessage(message, 'email');
  if (userId) {
    return { id: String(userId) };
  }
  if (email) {
    return { email: String(email) };
  }
  if (message.anonymousId) {
    return { anonymous_id: String(message.anonymousId) };
  }
  throw new InstrumentationError('userId, email or anonymousId is required');
};

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
      set(
        attributes,
        trait.replace(/\\/g, '\\\\').replace(/\./g, '\\.'),
        get(message, `${pathToTraits}.${trait}`),
      );
    });

  return attributes;
};

export const buildIdentify = (message): CustomerIOV2Payload => {
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
    identifiers: personIdentifiers(message),
    attributes,
  };
};

// Historical imports carry a timestamp; live events do not. Returns a spreadable
// fragment so callers stay immutable.
const historicalTimestamp = (message): { timestamp?: number } => {
  const hist = getFieldValueFromMessage(message, 'historicalTimestamp');
  return hist ? { timestamp: toUnixSeconds(hist) } : {};
};

export const buildTrack = (message, evName): CustomerIOV2Payload => {
  validateEventName(message.event);
  return {
    type: 'person',
    action: 'event',
    identifiers: personIdentifiers(message),
    name: String(evName),
    attributes: message.properties || {},
    ...historicalTimestamp(message),
  };
};

export const buildPage = (message, action: 'page', evName): CustomerIOV2Payload => {
  if (typeof evName !== 'string') {
    throw new InstrumentationError('Event Name type should be a string');
  }
  return {
    type: 'person',
    action,
    identifiers: personIdentifiers(message),
    name: evName,
    attributes: message.properties || {},
    ...historicalTimestamp(message),
  };
};

export const buildScreen = (message, action: 'screen', evName): CustomerIOV2Payload => {
  if (typeof evName !== 'string') {
    throw new InstrumentationError('Event Name type should be a string');
  }
  return {
    type: 'person',
    action,
    identifiers: personIdentifiers(message),
    name: `Viewed ${evName} Screen`,
    attributes: message.properties || {},
    ...historicalTimestamp(message),
  };
};

export const buildMerge = (message): CustomerIOV2Payload => {
  const userId = getFieldValueFromMessage(message, 'userIdOnly');
  const primaryKey = validator.isEmail(String(userId)) ? 'email' : 'id';
  const secondaryKey = validator.isEmail(String(message.previousId)) ? 'email' : 'id';
  return {
    type: 'person',
    action: 'merge',
    primary: { [primaryKey]: userId },
    secondary: { [secondaryKey]: message.previousId },
  };
};

export const buildObject = (message): CustomerIOV2Payload => {
  // constructPayload's `excludes` deletes keys (e.g. traits.action) from the
  // source object. Clone first so the caller's message is never mutated.
  const mapped = constructPayload(
    structuredClone(message),
    MAPPING_CONFIG[CONFIG_CATEGORIES.OBJECT_EVENTS.name],
  )!;
  const id = mapped.userId || mapped.email;
  const cioRelationships = id
    ? [{ identifiers: { [validator.isEmail(String(id)) ? 'email' : 'id']: id } }]
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

export const buildDevice = (
  message,
  action: 'add_device' | 'delete_device',
): CustomerIOV2Payload => {
  const id =
    getFieldValueFromMessage(message, 'userIdOnly') || getFieldValueFromMessage(message, 'email');
  const token = get(message, 'context.device.token');
  if (!id || !token) {
    throw new InstrumentationError('userId/email or device_token not present');
  }
  const identifiers = personIdentifiers(message);
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

const deviceActionFor = (
  evName: string,
  destination: CustomerIODestination,
): 'add_device' | 'delete_device' | null => {
  const isDevice =
    DEVICE_EVENT_NAMES.includes(evName) || destination.Config.deviceTokenEventName === evName;
  if (!isDevice) {
    return null;
  }
  return evName === DEVICE_DELETE_EVENT_NAME ? 'delete_device' : 'add_device';
};

// Build the unified v2 envelope (type/action/identifiers/...) for a single event.
export const buildEnvelope = (message, destination: CustomerIODestination): CustomerIOV2Payload => {
  const messageType = message.type?.toLowerCase();
  switch (messageType) {
    case EventType.IDENTIFY:
      return buildIdentify(message);
    case EventType.ALIAS:
      return buildMerge(message);
    case EventType.GROUP:
      return buildObject(message);
    case EventType.PAGE:
      return buildPage(message, 'page', message.name || message.properties?.url);
    case EventType.SCREEN:
      return buildScreen(message, 'screen', message.event || message.properties?.name);
    case EventType.TRACK: {
      const evName = message.event;
      const deviceAction = deviceActionFor(evName, destination);
      return deviceAction ? buildDevice(message, deviceAction) : buildTrack(message, evName);
    }
    default:
      throw new InstrumentationError(`could not determine type ${messageType}`);
  }
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
