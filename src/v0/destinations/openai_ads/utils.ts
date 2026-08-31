import crypto from 'crypto';
import { isIP } from 'net';
import get from 'get-value';
import validator from 'validator';
import { ConfigurationError, InstrumentationError } from '@rudderstack/integrations-lib';
import type { RudderMessage } from '../../../types';
import {
  ACTION_SOURCES,
  CONTENT_DATA_EVENTS,
  CUSTOMER_ACTION_EVENTS,
  CUSTOM_EVENT_SENTINEL,
  MAX_BATCH_SIZE,
  MAX_PAYLOAD_SIZE,
  PLAN_ENROLLMENT_EVENTS,
} from './config';
import { normalizeCurrency, toMinorUnits } from './currency';
import type {
  OpenAIAdsActionSource,
  OpenAIAdsContent,
  OpenAIAdsDestination,
  OpenAIAdsDestinationConfig,
  OpenAIAdsEventData,
  OpenAIAdsEventMapping,
  OpenAIAdsEventPayload,
  OpenAIAdsStandardEvent,
  OpenAIAdsUser,
} from './types';

const SHA256_REGEX = /^[\da-f]{64}$/i;
const PUNCTUATION_REGEX = /[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/g;
const COUNTRY_CODE_REGEX = /^[a-z]{2}$/;
const ACTION_SOURCE_SET = new Set<string>(ACTION_SOURCES);
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
const normalizeDateOfBirth = (value: string): string | undefined => {
  const normalized = value.trim().replace(/[.\s/-]/g, '');
  return /^\d{4,8}$/.test(normalized) ? normalized : undefined;
};
const normalizeLocationText = (value: string): string | undefined =>
  value
    .trim()
    .replace(/[^ A-Za-z]/g, '')
    .replace(/\s/g, '')
    .toLowerCase() || undefined;
const normalizeZip = (value: string): string | undefined =>
  value.trim().replace(/[\s-]/g, '').toLowerCase() || undefined;
const normalizeCountry = (value: string): string | undefined => {
  const normalized = value.trim().toLowerCase();
  return COUNTRY_CODE_REGEX.test(normalized) ? normalized : undefined;
};
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
const resolveDotPath = (
  message: RudderMessage,
  path: string | undefined,
  label = 'deduplicationKey',
): string | undefined => {
  const trimmedPath = trimString(path);
  if (!trimmedPath) return undefined;
  if (
    trimmedPath.startsWith('$.') ||
    trimmedPath.startsWith('.') ||
    trimmedPath.endsWith('.') ||
    trimmedPath.includes('..') ||
    /[*?[\]]/.test(trimmedPath)
  )
    throw new InstrumentationError(`OpenAI Ads ${label} must be a simple dot path`);
  const value = get(message, trimmedPath);
  return isScalar(value) ? trimString(value) : undefined;
};
export const resolveEventId = (message: RudderMessage, mapping?: OpenAIAdsEventMapping): string => {
  const id =
    resolveDotPath(message, mapping?.conversionIdentifier, 'conversionIdentifier') ??
    resolveDotPath(message, mapping?.deduplicationKey) ??
    trimString(message.messageId);
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
  eventType: string,
): OpenAIAdsActionSource | undefined => {
  const raw =
    trimString(get(message, 'properties.action_source')) ??
    trimString(get(message, 'properties.actionSource')) ??
    trimString(config.defaultActionSource) ??
    (eventType === 'app_installed' || eventType === 'app_opened' ? 'mobile_app' : undefined);
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
  rawScalar(message, [
    'properties.click_id',
    'properties.clickId',
    'context.traits.click_id',
    'context.traits.clickId',
    'traits.click_id',
    'traits.clickId',
  ])
    ? 'click_id_present'
    : 'click_id_absent';
export const buildUser = (message: RudderMessage): OpenAIAdsUser | undefined => {
  const user: OpenAIAdsUser = {};
  const addArray = (key: keyof OpenAIAdsUser, value: string[] | undefined) => {
    if (value?.length) (user as Record<string, unknown>)[String(key)] = value;
  };
  const obref = rawScalar(message, ['traits.obref', 'context.traits.obref']);
  if (obref) user.obref = obref;
  addArray(
    'emails_sha256',
    hashValues(
      message,
      ['traits.emails', 'context.traits.emails', 'traits.email', 'context.traits.email'],
      'email',
      normalizeEmail,
    ),
  );
  addArray(
    'phone_numbers_sha256',
    hashValues(
      message,
      [
        'traits.phoneNumbers',
        'context.traits.phoneNumbers',
        'traits.phone_numbers',
        'context.traits.phone_numbers',
        'traits.phones',
        'context.traits.phones',
        'traits.phone',
        'context.traits.phone',
      ],
      'phone',
      normalizePhone,
    ),
  );
  addArray(
    'external_ids_sha256',
    hashValues(
      message,
      [
        'traits.externalIds',
        'context.traits.externalIds',
        'traits.external_ids',
        'context.traits.external_ids',
        'traits.externalId',
        'context.traits.externalId',
        'traits.external_id',
        'context.traits.external_id',
        'userId',
      ],
      'external_id',
      normalizeExternalId,
    ),
  );
  addArray(
    'first_names_sha256',
    hashValues(
      message,
      [
        'traits.firstNames',
        'context.traits.firstNames',
        'traits.first_names',
        'context.traits.first_names',
        'traits.firstName',
        'context.traits.firstName',
        'traits.first_name',
        'context.traits.first_name',
      ],
      'first_name',
      normalizeName,
    ),
  );
  addArray(
    'last_names_sha256',
    hashValues(
      message,
      [
        'traits.lastNames',
        'context.traits.lastNames',
        'traits.last_names',
        'context.traits.last_names',
        'traits.lastName',
        'context.traits.lastName',
        'traits.last_name',
        'context.traits.last_name',
      ],
      'last_name',
      normalizeName,
    ),
  );
  addArray(
    'date_of_births_sha256',
    hashValues(
      message,
      [
        'traits.dateOfBirths',
        'context.traits.dateOfBirths',
        'traits.date_of_births',
        'context.traits.date_of_births',
        'traits.dateOfBirth',
        'context.traits.dateOfBirth',
        'traits.date_of_birth',
        'context.traits.date_of_birth',
        'traits.dobs',
        'context.traits.dobs',
        'traits.dob',
        'context.traits.dob',
      ],
      'date_of_birth',
      normalizeDateOfBirth,
    ),
  );
  addArray(
    'regions_sha256',
    hashValues(
      message,
      [
        'traits.regions',
        'context.traits.regions',
        'traits.region',
        'context.traits.region',
        'traits.states',
        'context.traits.states',
        'traits.state',
        'context.traits.state',
      ],
      'state',
      normalizeLocationText,
    ),
  );
  addArray(
    'postal_codes_sha256',
    hashValues(
      message,
      [
        'traits.postalCodes',
        'context.traits.postalCodes',
        'traits.postal_codes',
        'context.traits.postal_codes',
        'traits.postalCode',
        'context.traits.postalCode',
        'traits.postal_code',
        'context.traits.postal_code',
        'traits.zips',
        'context.traits.zips',
        'traits.zip',
        'context.traits.zip',
      ],
      'zip',
      normalizeZip,
    ),
  );
  addArray(
    'cities_sha256',
    hashValues(
      message,
      ['traits.cities', 'context.traits.cities', 'traits.city', 'context.traits.city'],
      'city',
      normalizeLocationText,
    ),
  );
  addArray(
    'countries_sha256',
    hashValues(
      message,
      [
        'traits.countries',
        'context.traits.countries',
        'traits.country',
        'context.traits.country',
        'traits.countryCodes',
        'context.traits.countryCodes',
        'traits.countryCode',
        'context.traits.countryCode',
      ],
      'country',
      normalizeCountry,
    ),
  );
  const advertisingId = rawScalar(message, [
    'traits.android_advertising_id',
    'context.traits.android_advertising_id',
    'traits.androidAdvertisingId',
    'context.traits.androidAdvertisingId',
    'context.device.advertisingId',
  ]);
  if (advertisingId) user.android_advertising_id = advertisingId;
  const ipAddress = rawScalar(message, ['context.ip', 'request_ip']);
  if (ipAddress && isIP(ipAddress)) user.ip_address = ipAddress;
  const userAgent = rawScalar(message, ['context.userAgent', 'context.user_agent']);
  if (userAgent) user.user_agent = userAgent;
  return Object.keys(user).length > 0 ? user : undefined;
};
const resolveCurrency = (
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
): string | undefined =>
  normalizeCurrency(getFirstValue(message, ['properties.currency'])) ??
  normalizeCurrency(config.defaultCurrency);
const resolveAmount = (message: RudderMessage): unknown =>
  getFirstValue(message, ['properties.amount', 'properties.value', 'properties.revenue']);
const getStringField = (item: Record<string, unknown>, paths: string[]): string | undefined =>
  paths
    .map((path) => get(item, path))
    .map(trimString)
    .find(Boolean);
const mapContentItem = (
  item: Record<string, unknown>,
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
): OpenAIAdsContent | undefined => {
  const content: OpenAIAdsContent = {};
  const id = getStringField(item, [
    'id',
    'content_id',
    'contentId',
    'item_id',
    'itemId',
    'product_id',
    'productId',
    'sku',
  ]);
  if (id) content.id = id;
  const name = getStringField(item, ['name', 'title', 'product_name', 'productName']);
  if (name) content.name = name;
  const contentType = getStringField(item, [
    'content_type',
    'contentType',
    'type',
    'category',
    'product_category',
  ]);
  if (contentType) content.content_type = contentType;
  const quantityValue = get(item, 'quantity') ?? get(item, 'count');
  if (quantityValue !== undefined && quantityValue !== null && quantityValue !== '') {
    const quantity = Number(quantityValue);
    if (!Number.isInteger(quantity) || quantity <= 0)
      throw new InstrumentationError('OpenAI Ads content quantity must be a positive integer');
    content.quantity = quantity;
  }
  const amountValue = get(item, 'amount') ?? get(item, 'value') ?? get(item, 'price');
  if (amountValue !== undefined && amountValue !== null && amountValue !== '') {
    const itemCurrency =
      normalizeCurrency(
        get(item, 'currency') ?? get(item, 'currency_code') ?? get(item, 'currencyCode'),
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
  const rawContents = get(message, 'properties.contents') ?? get(message, 'properties.products');
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
  const actionSource = resolveActionSource(message, config, mapping.type);
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
export const getMaxBatchSize = (config: OpenAIAdsDestinationConfig): number =>
  typeof config.maxBatchSize === 'number' && config.maxBatchSize > 0
    ? Math.min(config.maxBatchSize, MAX_BATCH_SIZE)
    : MAX_BATCH_SIZE;
export const getMaxPayloadSize = (config: OpenAIAdsDestinationConfig): string =>
  trimString(config.maxPayloadSize) ?? MAX_PAYLOAD_SIZE;
