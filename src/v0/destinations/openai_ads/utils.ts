import { isIP } from 'net';
import get from 'get-value';
import validator from 'validator';
import currencyCodes from 'currency-codes';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import type { RudderMessage } from '../../../types';
import { constructPayload, getValueFromMessage } from '../../util';
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

type OpenAIAdsMappingConfig = {
  eventMappings: MappingEntry[];
  hashedUserMappings: MappingEntry[];
  plainArrayUserMappings: MappingEntry[];
  plainScalarUserMappings: MappingEntry[];
  topLevelMappings: MappingEntry[];
  contentMappings: MappingEntry[];
  clickIdPaths: string[];
  currencyPaths: string | string[];
  amountPaths: string | string[];
  contentSourcePaths: string | string[];
  contentQuantityPaths: string | string[];
  contentAmountPaths: string | string[];
  contentCurrencyPaths: string | string[];
  customReservedKeys: string[];
};

const OPENAI_ADS_MAPPING_CONFIG = mappingConfig as OpenAIAdsMappingConfig;

type MappingEntry = {
  sourceKeys: string | string[];
  destKey: string;
  required?: boolean;
  sourceFromGenericMap?: boolean;
  metadata?: Record<string, unknown>;
};

type EventBasePayload = {
  timestamp_ms?: number;
  action_source?: unknown;
  source_url?: unknown;
  oppref?: unknown;
  opt_out?: unknown;
};

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

const isScalarValue = (value: unknown): value is string | number | boolean =>
  ['string', 'number', 'boolean'].includes(typeof value);

const toValueArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (value || value === false || value === 0) return [value];
  return [];
};

const toStringArray = (value: unknown): string[] => [
  ...new Set(
    toValueArray(value)
      .filter(isScalarValue)
      .map((item) => String(item)),
  ),
];

const firstStringValue = (value: unknown): string | undefined => toStringArray(value)[0];

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

const hashUserPayload = (
  payload: Partial<Record<HashMatchField, unknown>>,
): Partial<Record<HashMatchField, string[]>> => {
  const record: Record<string, unknown> = {};
  const fieldConfigs: Record<string, AudienceField> = { ...HASH_FIELD_CONFIGS };
  const fieldByRecordKey: Record<string, HashMatchField> = {};

  Object.entries(payload).forEach(([field, value]) => {
    const values = toStringArray(value);
    values.forEach((rawValue, index) => {
      const recordKey = values.length === 1 ? field : `${field}.${index}`;
      record[recordKey] = rawValue;
      if (recordKey !== field)
        fieldConfigs[recordKey] = HASH_FIELD_CONFIGS[field as HashMatchField];
      fieldByRecordKey[recordKey] = field as HashMatchField;
    });
  });

  const processed = processAudienceRecord(record, {
    fieldConfigs,
    destination: audienceDestination,
  });
  return Object.entries(processed).reduce<Partial<Record<HashMatchField, string[]>>>(
    (acc, [recordKey, value]) => {
      const field = fieldByRecordKey[recordKey];
      if (field && typeof value === 'string') {
        acc[field] = [...(acc[field] ?? []), value];
      }
      return acc;
    },
    {},
  );
};

const configuredPathLeafs = (sourceKeys: string | string[]): string[] =>
  (Array.isArray(sourceKeys) ? sourceKeys : [sourceKeys])
    .map((path) => path.split('.').pop())
    .filter((path): path is string => Boolean(path));

const mappingPathLeafs = (mappings: MappingEntry[]): string[] =>
  mappings.flatMap((mapping) => configuredPathLeafs(mapping.sourceKeys));

const RESERVED_CUSTOM_KEYS = new Set<string>([
  ...OPENAI_ADS_MAPPING_CONFIG.customReservedKeys,
  ...mappingPathLeafs(OPENAI_ADS_MAPPING_CONFIG.eventMappings),
  ...mappingPathLeafs(OPENAI_ADS_MAPPING_CONFIG.hashedUserMappings),
  ...mappingPathLeafs(OPENAI_ADS_MAPPING_CONFIG.plainArrayUserMappings),
  ...mappingPathLeafs(OPENAI_ADS_MAPPING_CONFIG.plainScalarUserMappings),
  ...mappingPathLeafs(OPENAI_ADS_MAPPING_CONFIG.topLevelMappings),
  ...mappingPathLeafs(OPENAI_ADS_MAPPING_CONFIG.contentMappings),
  ...configuredPathLeafs(OPENAI_ADS_MAPPING_CONFIG.clickIdPaths),
  ...configuredPathLeafs(OPENAI_ADS_MAPPING_CONFIG.currencyPaths),
  ...configuredPathLeafs(OPENAI_ADS_MAPPING_CONFIG.amountPaths),
  ...configuredPathLeafs(OPENAI_ADS_MAPPING_CONFIG.contentSourcePaths),
  ...configuredPathLeafs(OPENAI_ADS_MAPPING_CONFIG.contentQuantityPaths),
  ...configuredPathLeafs(OPENAI_ADS_MAPPING_CONFIG.contentAmountPaths),
  ...configuredPathLeafs(OPENAI_ADS_MAPPING_CONFIG.contentCurrencyPaths),
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

const resolveActionSource = (
  payload: EventBasePayload,
  config: OpenAIAdsDestinationConfig,
): OpenAIAdsActionSource | undefined => {
  const raw = firstStringValue(payload.action_source) ?? config.defaultActionSource;
  if (!raw) return undefined;
  if (!ACTION_SOURCE_SET.has(raw))
    throw new InstrumentationError(`Unsupported OpenAI Ads action_source: ${raw}`);
  return raw as OpenAIAdsActionSource;
};

const resolveSourceUrl = (payload: EventBasePayload, actionSource?: string): string | undefined => {
  const rawUrl = firstStringValue(payload.source_url);
  if (!rawUrl) {
    if (actionSource === 'web')
      throw new InstrumentationError('OpenAI Ads source_url is required for web action_source');
    return undefined;
  }
  return rawUrl;
};

const resolveOptOut = (payload: EventBasePayload): boolean | undefined => {
  const value = payload.opt_out;
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  throw new InstrumentationError('OpenAI Ads opt_out must be a boolean');
};

const getOppref = (payload: EventBasePayload): string | undefined =>
  firstStringValue(payload.oppref);

const buildUser = (message: RudderMessage): OpenAIAdsUser | undefined => {
  const user: OpenAIAdsUser = {};
  const addArray = (key: PlainMatchField | HashMatchField, value: string[] | undefined) => {
    if (value?.length) user[key] = value;
  };
  const hashedPayload = constructPayload(
    message,
    OPENAI_ADS_MAPPING_CONFIG.hashedUserMappings,
  ) as Partial<Record<HashMatchField, unknown>>;
  const plainArrayPayload = constructPayload(
    message,
    OPENAI_ADS_MAPPING_CONFIG.plainArrayUserMappings,
  ) as Partial<Record<PlainMatchField, unknown>>;
  const plainScalarPayload = constructPayload(
    message,
    OPENAI_ADS_MAPPING_CONFIG.plainScalarUserMappings,
  ) as Partial<Record<PlainMatchField, unknown>>;

  Object.entries(hashUserPayload(hashedPayload)).forEach(([key, values]) => {
    addArray(key as HashMatchField, values);
  });

  Object.entries(plainArrayPayload).forEach(([key, value]) => {
    addArray(key as PlainMatchField, toStringArray(value));
  });

  Object.entries(plainScalarPayload).forEach(([key, rawValue]) => {
    const value = firstStringValue(rawValue);
    if (!value || (key === 'ip_address' && !isIP(value))) return;
    user[key as PlainMatchField] = value;
  });

  return Object.keys(user).length > 0 ? user : undefined;
};

const normalizeCurrency = (currency: unknown): string | undefined => {
  if (typeof currency !== 'string' && typeof currency !== 'number') return undefined;
  const normalized = String(currency).toUpperCase();
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
  const raw = String(amount);
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
  normalizeCurrency(getValueFromMessage(message, OPENAI_ADS_MAPPING_CONFIG.currencyPaths)) ??
  normalizeCurrency(config.defaultCurrency);

const resolveAmount = (message: RudderMessage): unknown =>
  getValueFromMessage(message, OPENAI_ADS_MAPPING_CONFIG.amountPaths);

const mapContentItem = (
  item: Record<string, unknown>,
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
): OpenAIAdsContent | undefined => {
  const content = (constructPayload(item, OPENAI_ADS_MAPPING_CONFIG.contentMappings) ??
    {}) as OpenAIAdsContent;
  const variantDict = (content as Record<string, unknown>).variant_dict;
  if (variantDict !== undefined && !isRecord(variantDict)) delete content.variant_dict;

  const quantityValue = getValueFromMessage(item, OPENAI_ADS_MAPPING_CONFIG.contentQuantityPaths);
  if (quantityValue !== undefined && quantityValue !== null) {
    const quantity = Number(quantityValue);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new InstrumentationError('OpenAI Ads content quantity must be a positive integer');
    }
    content.quantity = quantity;
  }

  const amountValue = getValueFromMessage(item, OPENAI_ADS_MAPPING_CONFIG.contentAmountPaths);
  if (amountValue !== undefined && amountValue !== null) {
    const itemCurrency =
      normalizeCurrency(
        getValueFromMessage(item, OPENAI_ADS_MAPPING_CONFIG.contentCurrencyPaths),
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
  const rawContents = getValueFromMessage(message, OPENAI_ADS_MAPPING_CONFIG.contentSourcePaths);
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
  Object.fromEntries(Object.entries(properties).filter(([key]) => !RESERVED_CUSTOM_KEYS.has(key)));

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
  const eventPayload = constructPayload(
    message,
    OPENAI_ADS_MAPPING_CONFIG.eventMappings,
  ) as EventBasePayload;
  const topLevelPayload = constructPayload(
    message,
    OPENAI_ADS_MAPPING_CONFIG.topLevelMappings,
  ) as EventBasePayload;
  const actionSource = resolveActionSource(topLevelPayload, config);
  const sourceUrl = resolveSourceUrl(topLevelPayload, actionSource);
  const oppref = getOppref(topLevelPayload);
  const user = buildUser(message);
  const optOut = resolveOptOut(topLevelPayload);

  return {
    id: (resolveDotPath(message, mapping.deduplicationKey) ?? message.messageId) as string,
    type: eventType,
    ...(customEventName !== undefined ? { custom_event_name: customEventName } : {}),
    timestamp_ms: eventPayload.timestamp_ms as number,
    ...(optOut !== undefined ? { opt_out: optOut } : {}),
    ...(actionSource ? { action_source: actionSource } : {}),
    ...(sourceUrl ? { source_url: sourceUrl } : {}),
    ...(oppref ? { oppref } : {}),
    ...(user ? { user } : {}),
    data: buildEventData(message, config, eventType),
  };
};
