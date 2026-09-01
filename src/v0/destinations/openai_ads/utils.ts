import { isIP } from 'net';
import get from 'get-value';
import validator from 'validator';
import currencyCodes from 'currency-codes';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import type { RudderMessage } from '../../../types';
import {
  HashingType,
  isValidPhoneNumber,
  processAudienceRecord,
  type AudienceField,
} from '../../util/audienceUtils';
import {
  ACTION_SOURCES,
  CONTENTS_DATA_TYPE,
  CUSTOM_EVENT_SENTINEL,
  PLAN_ENROLLMENT_DATA_TYPE,
  DESTINATION,
  STANDARD_EVENT_DATA_TYPES,
} from './config';
import mappingConfig from './data/OPENAI_ADSConfig.json';
import type {
  HashMatchField,
  OpenAIAdsActionSource,
  OpenAIAdsContent,
  OpenAIAdsDestinationConfig,
  OpenAIAdsEventData,
  OpenAIAdsEventMapping,
  OpenAIAdsEventPayload,
  OpenAIAdsStandardEvent,
  OpenAIAdsUser,
  PlainMatchField,
} from './types';

const ACTION_SOURCE_SET = new Set<string>(ACTION_SOURCES);
const CURRENCY_RE = /^[A-Z]{3}$/;
const PUNCTUATION_REGEX = /[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/g;

type UserFieldsConfig = {
  hashed: Record<HashMatchField, string[]>;
  rawArrays: Partial<Record<PlainMatchField, string[]>>;
  scalars: Partial<Record<PlainMatchField, string[]>>;
};

type OpenAIAdsMappingConfig = {
  userFields: UserFieldsConfig;
  clickIdPaths: string[];
  actionSourcePaths: string[];
  sourceUrlPaths: string[];
  opprefPaths: string[];
  currencyPaths: string[];
  amountPaths: string[];
  contentSourcePaths: string[];
  optOutPaths: string[];
  customReservedKeys: string[];
  contentFields: Record<
    | 'id'
    | 'name'
    | 'content_type'
    | 'group_id'
    | 'variant_dict'
    | 'quantity'
    | 'amount'
    | 'currency',
    string[]
  >;
};

const OPENAI_ADS_MAPPING_CONFIG = mappingConfig as OpenAIAdsMappingConfig;

const audienceDestination = {
  workspaceId: '',
  id: '',
  type: DESTINATION,
  config: { isHashRequired: true },
};

const normalizeHashString = (value: unknown): string | undefined => {
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
    return undefined;
  }
  const trimmed = String(value).trim();
  return trimmed || undefined;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isScalar = (value: unknown): value is string | number | boolean =>
  ['string', 'number', 'boolean'].includes(typeof value);

const firstScalar = (value: unknown): unknown => (Array.isArray(value) ? value[0] : value);
const hasValue = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== '';
const stringifyScalar = (value: unknown): string | undefined =>
  isScalar(value) ? String(value) : undefined;

const getFirstValue = (message: RudderMessage, paths: string[]): unknown =>
  paths.map((path) => get(message, path)).find((value) => hasValue(firstScalar(value)));

const getFirstDefinedValue = (message: RudderMessage, paths: string[]): unknown =>
  paths.map((path) => get(message, path)).find((value) => value !== undefined && value !== null);

const valuesFromPaths = (message: RudderMessage, paths: string[]): unknown[] => {
  for (const path of paths) {
    const value = get(message, path);
    if (Array.isArray(value) && value.some(hasValue)) return value;
    if (hasValue(value)) return [value];
  }
  return [];
};

const rawValues = (message: RudderMessage, paths: string[]): string[] | undefined => {
  const values = valuesFromPaths(message, paths)
    .map(stringifyScalar)
    .filter((value): value is string => Boolean(value));
  return values.length > 0 ? [...new Set(values)] : undefined;
};

const rawScalar = (message: RudderMessage, paths: string[]): string | undefined =>
  stringifyScalar(firstScalar(getFirstValue(message, paths)));

const normalizeEmail = (value: unknown): string | undefined => {
  const normalized = normalizeHashString(value)?.toLowerCase();
  return normalized && validator.isEmail(normalized) ? normalized : undefined;
};

const normalizePhone = (value: unknown): string | undefined => {
  const normalized = normalizeHashString(value)?.replace(/\D/g, '').replace(/^0+/g, '');
  return normalized && isValidPhoneNumber(normalized) ? normalized : undefined;
};

const normalizeName = (value: unknown): string | undefined =>
  normalizeHashString(value)?.toLowerCase().replace(PUNCTUATION_REGEX, '') || undefined;

const normalizeExternalId = (value: unknown): string | undefined =>
  normalizeHashString(value)?.toLowerCase();

const HASH_FIELD_CONFIGS: Record<HashMatchField, AudienceField> = {
  emails_sha256: {
    hashingType: HashingType.SHA256,
    normalize: normalizeEmail,
  },
  phone_numbers_sha256: {
    hashingType: HashingType.SHA256,
    normalize: normalizePhone,
  },
  external_ids_sha256: {
    hashingType: HashingType.SHA256,
    normalize: normalizeExternalId,
  },
  first_names_sha256: {
    hashingType: HashingType.SHA256,
    normalize: normalizeName,
  },
  last_names_sha256: {
    hashingType: HashingType.SHA256,
    normalize: normalizeName,
  },
};

const hashValues = (
  message: RudderMessage,
  paths: string[],
  field: HashMatchField,
): string[] | undefined => {
  const hashed = valuesFromPaths(message, paths)
    .map(stringifyScalar)
    .filter((value): value is string => Boolean(value))
    .map(
      (value) =>
        processAudienceRecord(
          { [field]: value },
          {
            fieldConfigs: { [field]: HASH_FIELD_CONFIGS[field] },
            destination: audienceDestination,
          },
        )[field],
    )
    .filter((value): value is string => typeof value === 'string' && value.length > 0);

  return hashed.length > 0 ? [...new Set(hashed)] : undefined;
};

const collectConfiguredPathLeafs = (paths: string[]): string[] =>
  paths.map((path) => path.split('.').pop()).filter((path): path is string => Boolean(path));

const RESERVED_CUSTOM_KEYS = new Set<string>([
  ...OPENAI_ADS_MAPPING_CONFIG.customReservedKeys,
  ...collectConfiguredPathLeafs(OPENAI_ADS_MAPPING_CONFIG.clickIdPaths),
  ...collectConfiguredPathLeafs(OPENAI_ADS_MAPPING_CONFIG.actionSourcePaths),
  ...collectConfiguredPathLeafs(OPENAI_ADS_MAPPING_CONFIG.sourceUrlPaths),
  ...collectConfiguredPathLeafs(OPENAI_ADS_MAPPING_CONFIG.opprefPaths),
  ...collectConfiguredPathLeafs(OPENAI_ADS_MAPPING_CONFIG.currencyPaths),
  ...collectConfiguredPathLeafs(OPENAI_ADS_MAPPING_CONFIG.amountPaths),
  ...collectConfiguredPathLeafs(OPENAI_ADS_MAPPING_CONFIG.contentSourcePaths),
  ...collectConfiguredPathLeafs(OPENAI_ADS_MAPPING_CONFIG.optOutPaths),
  ...Object.values(OPENAI_ADS_MAPPING_CONFIG.userFields.hashed).flatMap(collectConfiguredPathLeafs),
  ...Object.values(OPENAI_ADS_MAPPING_CONFIG.userFields.rawArrays).flatMap(
    collectConfiguredPathLeafs,
  ),
  ...Object.values(OPENAI_ADS_MAPPING_CONFIG.userFields.scalars).flatMap(
    collectConfiguredPathLeafs,
  ),
]);

const getSourceKey = (message: RudderMessage): string => {
  if (message.type === 'track') {
    const event = typeof message.event === 'string' ? message.event : undefined;
    if (!event)
      throw new InstrumentationError('OpenAI Ads source event name is required for track events');
    return event;
  }
  const name = get(message, 'name');
  if (!name)
    throw new InstrumentationError(
      `OpenAI Ads source event name is required for ${message.type} events`,
    );
  return String(name);
};

const resolveEventMapping = (
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
): OpenAIAdsEventMapping => {
  const sourceKey = getSourceKey(message);
  const normalizedSourceKey = sourceKey.toLowerCase();
  const mapping = (config.eventMapping ?? []).find(
    (candidate) => candidate.from.toLowerCase() === normalizedSourceKey,
  );
  if (!mapping) {
    throw new InstrumentationError(`OpenAI Ads event mapping not found for ${sourceKey}`);
  }
  if (mapping.to === CUSTOM_EVENT_SENTINEL && !mapping.customEventName) {
    throw new InstrumentationError('OpenAI Ads custom event mapping requires customEventName');
  }
  return mapping;
};

const resolveDotPath = (message: RudderMessage, path: string | undefined): unknown =>
  path ? get(message, path) : undefined;

const resolveTimestampMs = (message: RudderMessage): number => {
  const timestamp =
    message.timestamp ?? message.originalTimestamp ?? message.sentAt ?? get(message, 'receivedAt');
  return Date.parse(timestamp as string);
};

const resolveActionSource = (
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
): OpenAIAdsActionSource | undefined => {
  const raw =
    stringifyScalar(getFirstValue(message, OPENAI_ADS_MAPPING_CONFIG.actionSourcePaths)) ??
    config.defaultActionSource;
  if (!raw) return undefined;
  if (!ACTION_SOURCE_SET.has(raw))
    throw new InstrumentationError(`Unsupported OpenAI Ads action_source: ${raw}`);
  return raw as OpenAIAdsActionSource;
};

const resolveSourceUrl = (message: RudderMessage, actionSource?: string): string | undefined => {
  const rawUrl = stringifyScalar(getFirstValue(message, OPENAI_ADS_MAPPING_CONFIG.sourceUrlPaths));
  if (!rawUrl) {
    if (actionSource === 'web')
      throw new InstrumentationError('OpenAI Ads source_url is required for web action_source');
    return undefined;
  }
  return rawUrl;
};

const resolveOptOut = (message: RudderMessage): boolean | undefined => {
  const value = getFirstDefinedValue(message, OPENAI_ADS_MAPPING_CONFIG.optOutPaths);
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  throw new InstrumentationError('OpenAI Ads opt_out must be a boolean');
};

const getOppref = (message: RudderMessage): string | undefined =>
  stringifyScalar(getFirstValue(message, OPENAI_ADS_MAPPING_CONFIG.opprefPaths));

const buildUser = (message: RudderMessage): OpenAIAdsUser | undefined => {
  const user: OpenAIAdsUser = {};
  const addArray = (key: PlainMatchField | HashMatchField, value: string[] | undefined) => {
    if (value?.length) user[key] = value;
  };

  Object.entries(OPENAI_ADS_MAPPING_CONFIG.userFields.hashed).forEach(([key, paths]) => {
    addArray(key as HashMatchField, hashValues(message, paths, key as HashMatchField));
  });

  Object.entries(OPENAI_ADS_MAPPING_CONFIG.userFields.rawArrays).forEach(([key, paths]) => {
    addArray(key as PlainMatchField, rawValues(message, paths ?? []));
  });

  Object.entries(OPENAI_ADS_MAPPING_CONFIG.userFields.scalars).forEach(([key, paths]) => {
    const value = rawScalar(message, paths ?? []);
    if (!value || (key === 'ip_address' && !isIP(value))) return;
    user[key as PlainMatchField] = value;
  });

  return Object.keys(user).length > 0 ? user : undefined;
};

const normalizeCurrency = (currency: unknown): string | undefined => {
  if (typeof currency !== 'string' && typeof currency !== 'number') return undefined;
  const normalized = String(currency).trim().toUpperCase();
  if (!normalized) return undefined;
  if (!CURRENCY_RE.test(normalized) || !currencyCodes.code(normalized)) {
    throw new InstrumentationError(`Unsupported currency code: ${normalized}`);
  }
  return normalized;
};

const toMinorUnits = (amount: unknown, currency: string): number => {
  const normalizedCurrency = normalizeCurrency(currency);
  if (!normalizedCurrency)
    throw new InstrumentationError('Currency is required when amount is present');
  if (typeof amount !== 'string' && typeof amount !== 'number') {
    throw new InstrumentationError('Amount must be a number or numeric string');
  }
  const raw = String(amount).trim();
  if (!/^\d+(?:\.\d+)?$/.test(raw)) {
    throw new InstrumentationError('Amount must be a finite decimal value');
  }
  const [whole, fraction = ''] = raw.split('.');
  const metadata = currencyCodes.code(normalizedCurrency);
  if (!metadata) throw new InstrumentationError(`Unsupported currency code: ${normalizedCurrency}`);
  if (fraction.length > metadata.digits) {
    throw new InstrumentationError(`Amount has more precision than ${normalizedCurrency} supports`);
  }
  const minorUnits =
    BigInt(whole) * 10n ** BigInt(metadata.digits) +
    BigInt(fraction.padEnd(metadata.digits, '0') || '0');
  if (minorUnits > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new InstrumentationError('Amount exceeds the maximum safe integer after conversion');
  }
  return Number(minorUnits);
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
  stringifyScalar(getFirstFieldValue(item, paths));

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
  const groupId = getStringField(item, OPENAI_ADS_MAPPING_CONFIG.contentFields.group_id);
  if (groupId) content.group_id = groupId;
  const variantDict = getFirstFieldValue(
    item,
    OPENAI_ADS_MAPPING_CONFIG.contentFields.variant_dict,
  );
  if (isRecord(variantDict)) content.variant_dict = variantDict;

  const quantityValue = getFirstFieldValue(item, OPENAI_ADS_MAPPING_CONFIG.contentFields.quantity);
  if (quantityValue !== undefined && quantityValue !== null && quantityValue !== '') {
    const quantity = Number(quantityValue);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new InstrumentationError('OpenAI Ads content quantity must be a positive integer');
    }
    content.quantity = quantity;
  }

  const amountValue = getFirstFieldValue(item, OPENAI_ADS_MAPPING_CONFIG.contentFields.amount);
  if (amountValue !== undefined && amountValue !== null && amountValue !== '') {
    const itemCurrency =
      normalizeCurrency(
        getFirstFieldValue(item, OPENAI_ADS_MAPPING_CONFIG.contentFields.currency),
      ) ?? resolveCurrency(message, config);
    if (!itemCurrency) {
      throw new InstrumentationError(
        'OpenAI Ads content currency is required when amount is present',
      );
    }
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
  if (!items.every(isRecord)) {
    throw new InstrumentationError('OpenAI Ads contents must be an object or array of objects');
  }
  const contents = items
    .map((item) => mapContentItem(item, message, config))
    .filter((item): item is OpenAIAdsContent => Boolean(item));
  if (contents.length === 0) {
    throw new InstrumentationError('OpenAI Ads contents must include at least one supported field');
  }
  return contents;
};

const buildCustomExtras = (properties: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(properties).filter(([key]) => !RESERVED_CUSTOM_KEYS.has(key)),
  );

const buildEventData = (
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
  eventType: OpenAIAdsStandardEvent | typeof CUSTOM_EVENT_SENTINEL,
): OpenAIAdsEventData => {
  const dataType =
    eventType === CUSTOM_EVENT_SENTINEL
      ? CUSTOM_EVENT_SENTINEL
      : STANDARD_EVENT_DATA_TYPES[eventType as OpenAIAdsStandardEvent];
  if (!dataType) {
    throw new InstrumentationError(`OpenAI Ads data type is not configured for ${eventType}`);
  }

  const data: OpenAIAdsEventData = { type: dataType };
  const amountValue = resolveAmount(message);
  const currency = resolveCurrency(message, config);
  if (amountValue !== undefined && amountValue !== null && amountValue !== '') {
    if (!currency) {
      throw new InstrumentationError('OpenAI Ads currency is required when amount is present');
    }
    data.amount = toMinorUnits(amountValue, currency);
    data.currency = currency;
  }

  if (
    dataType === CONTENTS_DATA_TYPE ||
    dataType === PLAN_ENROLLMENT_DATA_TYPE ||
    dataType === CUSTOM_EVENT_SENTINEL
  ) {
    const contents = buildContents(message, config);
    if (contents) data.contents = contents;
  }

  if (dataType === CUSTOM_EVENT_SENTINEL) {
    Object.assign(data, buildCustomExtras(isRecord(message.properties) ? message.properties : {}));
  }
  return data;
};

export const buildOpenAIEvent = (
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
): OpenAIAdsEventPayload => {
  const mapping = resolveEventMapping(message, config);
  const eventType = mapping.to;
  const customEventName =
    mapping.to === CUSTOM_EVENT_SENTINEL ? mapping.customEventName : undefined;
  const actionSource = resolveActionSource(message, config);
  const sourceUrl = resolveSourceUrl(message, actionSource);
  const oppref = getOppref(message);
  const user = buildUser(message);
  const optOut = resolveOptOut(message);

  return {
    id: (resolveDotPath(message, mapping.deduplicationKey) ?? message.messageId) as string,
    type: eventType,
    ...(customEventName !== undefined ? { custom_event_name: customEventName } : {}),
    timestamp_ms: resolveTimestampMs(message),
    ...(optOut !== undefined ? { opt_out: optOut } : {}),
    ...(actionSource ? { action_source: actionSource } : {}),
    ...(sourceUrl ? { source_url: sourceUrl } : {}),
    ...(oppref ? { oppref } : {}),
    ...(user ? { user } : {}),
    data: buildEventData(message, config, eventType),
  };
};
