import crypto from 'crypto';
import { isIP } from 'net';
import get from 'get-value';
import validator from 'validator';
import { ConfigurationError, InstrumentationError } from '@rudderstack/integrations-lib';
import type { RudderMessage } from '../../../types';
import { ACTION_SOURCES, CUSTOM_EVENT_SENTINEL } from './config';
import { normalizeCurrency, toMinorUnits } from './currency';
import mappingConfig from './data/OPENAI_ADSConfig.json';
import type {
  HashMatchField,
  OpenAIAdsActionSource,
  OpenAIAdsContent,
  OpenAIAdsDestination,
  OpenAIAdsDestinationConfig,
  OpenAIAdsEventData,
  OpenAIAdsEventMapping,
  OpenAIAdsEventPayload,
  OpenAIAdsStandardEvent,
  OpenAIAdsUser,
  PlainMatchField,
} from './types';

const SHA256_REGEX = /^[\da-f]{64}$/i;
const PUNCTUATION_REGEX = /[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/g;
const ACTION_SOURCE_SET = new Set<string>(ACTION_SOURCES);
type OpenAIAdsMappingConfig = {
  eventDataTypes: {
    contents: string[];
    customer_action: string[];
    plan_enrollment: string[];
  };
  userFields: {
    hashed: Record<HashMatchField, string[]>;
    rawArrays: Record<PlainMatchField, string[]>;
    scalars: {
      obref: string[];
      android_advertising_id: string[];
      ip_address: string[];
      user_agent: string[];
    };
  };
  clickIdPaths: string[];
  currencyPaths: string[];
  amountPaths: string[];
  contentSourcePaths: string[];
  contentFields: Record<
    'id' | 'name' | 'content_type' | 'quantity' | 'amount' | 'currency',
    string[]
  >;
};
const OPENAI_ADS_MAPPING_CONFIG = mappingConfig as OpenAIAdsMappingConfig;
// Mirrors the OpenAI Ads spec's standard-event -> `data.type` discriminator table.
const CONTENT_DATA_EVENTS = new Set<string>(OPENAI_ADS_MAPPING_CONFIG.eventDataTypes.contents);
const CUSTOMER_ACTION_EVENTS = new Set<string>(
  OPENAI_ADS_MAPPING_CONFIG.eventDataTypes.customer_action,
);
const PLAN_ENROLLMENT_EVENTS = new Set<string>(
  OPENAI_ADS_MAPPING_CONFIG.eventDataTypes.plan_enrollment,
);
const RESERVED_CUSTOM_KEYS = new Set([
  'action_source',
  'actionSource',
  'source_url',
  'sourceUrl',
  'url',
  'oppref',
  'obref',
  'currency',
  'amount',
  'value',
  'revenue',
  'contents',
  'products',
  'email',
  'emails',
  'phone',
  'phones',
  'phoneNumber',
  'phoneNumbers',
  'phone_number',
  'phone_numbers',
  'firstName',
  'firstNames',
  'first_name',
  'first_names',
  'lastName',
  'lastNames',
  'last_name',
  'last_names',
  'dateOfBirth',
  'dateOfBirths',
  'date_of_birth',
  'date_of_births',
  'dob',
  'dobs',
  'birthday',
  'birthdays',
  'externalId',
  'externalIds',
  'external_id',
  'external_ids',
  'region',
  'regions',
  'state',
  'states',
  'postalCode',
  'postalCodes',
  'postal_code',
  'postal_codes',
  'zip',
  'zips',
  'zipCode',
  'zipCodes',
  'city',
  'cities',
  'country',
  'countries',
  'countryCode',
  'countryCodes',
  'android_advertising_id',
  'androidAdvertisingId',
  'ip_address',
  'ipAddress',
  'user_agent',
  'userAgent',
  'apiKey',
  'pixelId',
  'rudderAccountId',
]);

type AccountConfig = { apiKey: string; pixelId: string };
type MappingResult = {
  type: OpenAIAdsStandardEvent | 'custom';
  customEventName?: string;
  mapping?: OpenAIAdsEventMapping;
};

export const trimString = (value: unknown): string | undefined => {
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean')
    return undefined;
  const trimmed = String(value).trim();
  return trimmed || undefined;
};
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isScalar = (value: unknown): value is string | number | boolean =>
  ['string', 'number', 'boolean'].includes(typeof value);
const firstScalar = (value: unknown): unknown => (Array.isArray(value) ? value[0] : value);
const getFirstValue = (message: RudderMessage, paths: string[]): unknown =>
  paths.map((path) => get(message, path)).find((value) => trimString(firstScalar(value)));
const getFirstDefinedValue = (message: RudderMessage, paths: string[]): unknown =>
  paths.map((path) => get(message, path)).find((value) => value !== undefined && value !== null);
const valuesFromPaths = (message: RudderMessage, paths: string[]): unknown[] => {
  for (const path of paths) {
    const value = get(message, path);
    if (Array.isArray(value) && value.some((item) => trimString(item))) return value;
    if (trimString(value)) return [value];
  }
  return [];
};
const sha256 = (value: string): string => crypto.createHash('sha256').update(value).digest('hex');
const rejectPrehashed = (field: string, value: string): void => {
  if (SHA256_REGEX.test(value.trim()))
    throw new InstrumentationError(
      `OpenAI Ads hashing consistency error: ${field} appears to already be SHA-256 hashed`,
    );
};
const normalizeEmail = (value: string): string | undefined => {
  const normalized = value.trim().toLowerCase();
  return validator.isEmail(normalized) ? normalized : undefined;
};
const normalizePhone = (value: string): string | undefined => {
  const normalized = value.trim().replace(/\D/g, '').replace(/^0+/g, '');
  return /^\d+$/.test(normalized) ? normalized : undefined;
};
const normalizeName = (value: string): string | undefined =>
  value.trim().toLowerCase().replace(PUNCTUATION_REGEX, '') || undefined;
const normalizeExternalId = (value: string): string | undefined =>
  value.trim().toLowerCase() || undefined;
const hashValues = (
  message: RudderMessage,
  paths: string[],
  field: string,
  normalize: (value: string) => string | undefined,
): string[] | undefined => {
  const hashed = valuesFromPaths(message, paths)
    .map(trimString)
    .filter((value): value is string => Boolean(value))
    .map((value) => {
      rejectPrehashed(field, value);
      return normalize(value);
    })
    .filter((value): value is string => Boolean(value))
    .map(sha256);
  return hashed.length > 0 ? [...new Set(hashed)] : undefined;
};
const rawValues = (message: RudderMessage, paths: string[]): string[] | undefined => {
  const values = valuesFromPaths(message, paths)
    .map(trimString)
    .filter((value): value is string => Boolean(value));
  return values.length > 0 ? [...new Set(values)] : undefined;
};
const rawScalar = (message: RudderMessage, paths: string[]): string | undefined =>
  trimString(firstScalar(getFirstValue(message, paths)));

const getSourceKey = (message: RudderMessage): string => {
  if (message.type === 'track') {
    const event = trimString(message.event);
    if (!event)
      throw new InstrumentationError('OpenAI Ads source event name is required for track events');
    return event;
  }
  const name = trimString(get(message, 'name'));
  if (!name)
    throw new InstrumentationError(
      `OpenAI Ads source event name is required for ${message.type} events`,
    );
  return name;
};
export const resolveEventMapping = (
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
): MappingResult => {
  const sourceKey = getSourceKey(message);
  const normalizedSourceKey = sourceKey.trim().toLowerCase();
  const mapping = (config.eventMapping ?? []).find(
    (candidate) => candidate.from.trim().toLowerCase() === normalizedSourceKey,
  );
  if (mapping) {
    if (mapping.to === CUSTOM_EVENT_SENTINEL) {
      const customEventName = trimString(mapping.customEventName);
      if (!customEventName)
        throw new InstrumentationError('OpenAI Ads custom event mapping requires customEventName');
      return { type: CUSTOM_EVENT_SENTINEL, customEventName, mapping };
    }
    return { type: mapping.to, mapping };
  }
  throw new InstrumentationError(`OpenAI Ads event mapping not found for ${sourceKey}`);
};
const resolveDotPath = (message: RudderMessage, path: string | undefined): string | undefined => {
  const trimmedPath = trimString(path);
  if (!trimmedPath) return undefined;
  if (
    trimmedPath.startsWith('$.') ||
    trimmedPath.startsWith('.') ||
    trimmedPath.endsWith('.') ||
    trimmedPath.includes('..') ||
    /[*?[\]]/.test(trimmedPath)
  )
    throw new InstrumentationError('OpenAI Ads deduplicationKey must be a simple dot path');
  const value = get(message, trimmedPath);
  return isScalar(value) ? trimString(value) : undefined;
};
export const resolveEventId = (message: RudderMessage, mapping?: OpenAIAdsEventMapping): string => {
  const id = resolveDotPath(message, mapping?.deduplicationKey) ?? trimString(message.messageId);
  if (!id) throw new InstrumentationError('OpenAI Ads event id is required');
  return id;
};
export const resolveTimestampMs = (message: RudderMessage): number => {
  const timestamp =
    trimString(message.timestamp) ??
    trimString(message.originalTimestamp) ??
    trimString(message.sentAt) ??
    trimString(get(message, 'receivedAt'));
  const parsed = timestamp ? Date.parse(timestamp) : NaN;
  if (!Number.isFinite(parsed))
    throw new InstrumentationError('OpenAI Ads timestamp_ms is required');
  return parsed;
};
export const resolveActionSource = (
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
): OpenAIAdsActionSource | undefined => {
  const raw =
    trimString(get(message, 'properties.action_source')) ??
    trimString(get(message, 'properties.actionSource')) ??
    trimString(config.defaultActionSource);
  if (!raw) return undefined;
  if (!ACTION_SOURCE_SET.has(raw))
    throw new InstrumentationError(`Unsupported OpenAI Ads action_source: ${raw}`);
  return raw as OpenAIAdsActionSource;
};
export const resolveSourceUrl = (
  message: RudderMessage,
  actionSource?: string,
): string | undefined => {
  const rawUrl =
    trimString(get(message, 'properties.source_url')) ??
    trimString(get(message, 'properties.sourceUrl')) ??
    trimString(get(message, 'context.page.url'));
  if (!rawUrl) {
    if (actionSource === 'web')
      throw new InstrumentationError('OpenAI Ads source_url is required for web action_source');
    return undefined;
  }
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('invalid protocol');
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    if (actionSource === 'web')
      throw new InstrumentationError('OpenAI Ads source_url must be a valid HTTP(S) URL');
    return undefined;
  }
};
export const getOppref = (message: RudderMessage): string | undefined =>
  trimString(get(message, 'properties.oppref'));
export const getClickIdPresenceGroup = (message: RudderMessage): string =>
  rawScalar(message, OPENAI_ADS_MAPPING_CONFIG.clickIdPaths)
    ? 'click_id_present'
    : 'click_id_absent';
export const buildUser = (message: RudderMessage): OpenAIAdsUser | undefined => {
  const user: OpenAIAdsUser = {};
  const addArray = (key: HashMatchField | PlainMatchField, value: string[] | undefined) => {
    if (value?.length) (user as Record<string, unknown>)[String(key)] = value;
  };
  const obref = rawScalar(message, OPENAI_ADS_MAPPING_CONFIG.userFields.scalars.obref);
  if (obref) user.obref = obref;
  const hashedNormalizers: Record<
    HashMatchField,
    { field: string; normalize: (value: string) => string | undefined }
  > = {
    emails_sha256: { field: 'email', normalize: normalizeEmail },
    phone_numbers_sha256: { field: 'phone', normalize: normalizePhone },
    external_ids_sha256: { field: 'external_id', normalize: normalizeExternalId },
    first_names_sha256: { field: 'first_name', normalize: normalizeName },
    last_names_sha256: { field: 'last_name', normalize: normalizeName },
  };
  Object.entries(OPENAI_ADS_MAPPING_CONFIG.userFields.hashed).forEach(([key, paths]) => {
    const { field, normalize } = hashedNormalizers[key as HashMatchField];
    addArray(key as HashMatchField, hashValues(message, paths, field, normalize));
  });
  Object.entries(OPENAI_ADS_MAPPING_CONFIG.userFields.rawArrays).forEach(([key, paths]) => {
    addArray(key as PlainMatchField, rawValues(message, paths));
  });
  const advertisingId = rawScalar(
    message,
    OPENAI_ADS_MAPPING_CONFIG.userFields.scalars.android_advertising_id,
  );
  if (advertisingId) user.android_advertising_id = advertisingId;
  const ipAddress = rawScalar(message, OPENAI_ADS_MAPPING_CONFIG.userFields.scalars.ip_address);
  if (ipAddress && isIP(ipAddress)) user.ip_address = ipAddress;
  const userAgent = rawScalar(message, OPENAI_ADS_MAPPING_CONFIG.userFields.scalars.user_agent);
  if (userAgent) user.user_agent = userAgent;
  return Object.keys(user).length > 0 ? user : undefined;
};
const resolveCurrency = (
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
): string | undefined =>
  normalizeCurrency(getFirstValue(message, OPENAI_ADS_MAPPING_CONFIG.currencyPaths)) ??
  normalizeCurrency(config.defaultCurrency);
const resolveAmount = (message: RudderMessage): unknown =>
  getFirstValue(message, OPENAI_ADS_MAPPING_CONFIG.amountPaths);
const getFirstFieldValue = (item: Record<string, unknown>, paths: string[]): unknown =>
  paths
    .map((path) => get(item, path))
    .find((value) => value !== undefined && value !== null && value !== '');
const getStringField = (item: Record<string, unknown>, paths: string[]): string | undefined =>
  trimString(getFirstFieldValue(item, paths));
const mapContentItem = (
  item: Record<string, unknown>,
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
): OpenAIAdsContent | undefined => {
  const content: OpenAIAdsContent = {};
  const id = getStringField(item, OPENAI_ADS_MAPPING_CONFIG.contentFields.id);
  if (id) content.id = id;
  const name = getStringField(item, OPENAI_ADS_MAPPING_CONFIG.contentFields.name);
  if (name) content.name = name;
  const contentType = getStringField(item, OPENAI_ADS_MAPPING_CONFIG.contentFields.content_type);
  if (contentType) content.content_type = contentType;
  const quantityValue = getFirstFieldValue(item, OPENAI_ADS_MAPPING_CONFIG.contentFields.quantity);
  if (quantityValue !== undefined && quantityValue !== null && quantityValue !== '') {
    const quantity = Number(quantityValue);
    if (!Number.isInteger(quantity) || quantity <= 0)
      throw new InstrumentationError('OpenAI Ads content quantity must be a positive integer');
    content.quantity = quantity;
  }
  const amountValue = getFirstFieldValue(item, OPENAI_ADS_MAPPING_CONFIG.contentFields.amount);
  if (amountValue !== undefined && amountValue !== null && amountValue !== '') {
    const itemCurrency =
      normalizeCurrency(
        getFirstFieldValue(item, OPENAI_ADS_MAPPING_CONFIG.contentFields.currency),
      ) ?? resolveCurrency(message, config);
    if (!itemCurrency)
      throw new InstrumentationError(
        'OpenAI Ads content currency is required when amount is present',
      );
    content.amount = toMinorUnits(amountValue, itemCurrency);
    content.currency = itemCurrency;
  }
  return Object.keys(content).length > 0 ? content : undefined;
};
const buildContents = (
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
): OpenAIAdsContent[] | undefined => {
  const rawContents = getFirstDefinedValue(message, OPENAI_ADS_MAPPING_CONFIG.contentSourcePaths);
  if (rawContents === undefined || rawContents === null) return undefined;
  const items = Array.isArray(rawContents) ? rawContents : [rawContents];
  if (!items.every(isRecord))
    throw new InstrumentationError('OpenAI Ads contents must be an object or array of objects');
  const contents = items
    .map((item) => mapContentItem(item, message, config))
    .filter((item): item is OpenAIAdsContent => Boolean(item));
  if (contents.length === 0)
    throw new InstrumentationError('OpenAI Ads contents must include at least one supported field');
  return contents;
};
const sanitizeCustomValue = (value: unknown): unknown => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) {
    const arr = value.map(sanitizeCustomValue).filter((item) => item !== undefined);
    return arr.length > 0 ? arr : undefined;
  }
  if (isRecord(value)) {
    const entries = Object.entries(value)
      .map(([key, item]) => [key, sanitizeCustomValue(item)] as const)
      .filter(([, item]) => item !== undefined);
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }
  return undefined;
};
const buildCustomExtras = (properties: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(properties)
      .filter(([key]) => !RESERVED_CUSTOM_KEYS.has(key))
      .map(([key, value]) => [key, sanitizeCustomValue(value)] as const)
      .filter(([, value]) => value !== undefined),
  );
export const buildEventData = (
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
  eventType: OpenAIAdsStandardEvent | 'custom',
): OpenAIAdsEventData => {
  let dataType: OpenAIAdsEventData['type'] | undefined;
  if (eventType === 'custom') {
    dataType = 'custom';
  } else if (CONTENT_DATA_EVENTS.has(eventType)) {
    dataType = 'contents';
  } else if (CUSTOMER_ACTION_EVENTS.has(eventType)) {
    dataType = 'customer_action';
  } else if (PLAN_ENROLLMENT_EVENTS.has(eventType)) {
    dataType = 'plan_enrollment';
  }
  if (!dataType)
    throw new InstrumentationError(`OpenAI Ads data type is not configured for ${eventType}`);
  const data: OpenAIAdsEventData = { type: dataType };
  if (dataType !== 'contents' && dataType !== 'custom') return data;
  const amountValue = resolveAmount(message);
  const currency = resolveCurrency(message, config);
  if (amountValue !== undefined && amountValue !== null && amountValue !== '') {
    if (!currency)
      throw new InstrumentationError('OpenAI Ads currency is required when amount is present');
    data.amount = toMinorUnits(amountValue, currency);
    data.currency = currency;
  }
  const contents = buildContents(message, config);
  if (contents) data.contents = contents;
  if (dataType === 'custom')
    Object.assign(data, buildCustomExtras(isRecord(message.properties) ? message.properties : {}));
  return data;
};
export const resolveAccountConfig = (destination: OpenAIAdsDestination): AccountConfig => {
  const pixelId =
    trimString(destination.deliveryAccount?.options?.pixelId) ??
    trimString(destination.Config.pixelId);
  const apiKey =
    trimString(destination.deliveryAccount?.secret?.apiKey) ??
    trimString(destination.Config.apiKey);
  if (!pixelId)
    throw new ConfigurationError('OpenAI Ads pixelId is required for cloud CAPI delivery');
  if (!apiKey)
    throw new ConfigurationError('OpenAI Ads apiKey is required for cloud CAPI delivery');
  return { apiKey, pixelId };
};
export const buildOpenAIEvent = (
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
): OpenAIAdsEventPayload => {
  const mapping = resolveEventMapping(message, config);
  const actionSource = resolveActionSource(message, config);
  const sourceUrl = resolveSourceUrl(message, actionSource);
  const oppref = getOppref(message);
  const user = buildUser(message);
  return {
    id: resolveEventId(message, mapping.mapping),
    type: mapping.type,
    ...(mapping.customEventName ? { custom_event_name: mapping.customEventName } : {}),
    timestamp_ms: resolveTimestampMs(message),
    ...(actionSource ? { action_source: actionSource } : {}),
    ...(sourceUrl ? { source_url: sourceUrl } : {}),
    ...(oppref ? { oppref } : {}),
    ...(user ? { user } : {}),
    data: buildEventData(message, config, mapping.type),
  };
};
