import { isIP } from 'net';
import get from 'get-value';
import validator from 'validator';
import currencyCodes from 'currency-codes';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import type { RudderMessage } from '../../../types';
import { constructPayload, getValueFromMessage, removeUndefinedAndNullValues } from '../../util';
import {
  HashingType,
  isValidPhoneNumber,
  processAudienceRecord,
  type AudienceField,
} from '../../util/audienceUtils';
import {
  ACTION_SOURCES,
  CUSTOMER_ACTION_DATA_TYPE,
  CUSTOM_EVENT_SENTINEL,
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
const EVENT_DATA_TYPE_BY_EVENT = {
  ...STANDARD_EVENT_DATA_TYPES,
  [CUSTOM_EVENT_SENTINEL]: CUSTOM_EVENT_SENTINEL,
} as const;

type OpenAIAdsMappingConfig = {
  hashedUserMappings: MappingEntry[];
  plainArrayUserMappings: MappingEntry[];
  plainScalarUserMappings: MappingEntry[];
  topLevelMappings: MappingEntry[];
  contentMappings: MappingEntry[];
  currencyPaths: string | string[];
  amountPaths: string | string[];
  contentSourcePaths: string | string[];
  contentQuantityPaths: string | string[];
  contentAmountPaths: string | string[];
  contentCurrencyPaths: string | string[];
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

type CurrencyMetadata = {
  code: string;
  digits: number;
};

type UserPayload = Partial<Record<HashMatchField | PlainMatchField, unknown>>;

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

const isPresent = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== '';

const toValueArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (isPresent(value)) return [value];
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
  const fieldConfigs: Record<string, AudienceField> = {};
  const fieldByRecordKey: Record<string, HashMatchField> = {};

  Object.entries(payload).forEach(([field, value]) => {
    toStringArray(value).forEach((rawValue, index) => {
      const recordKey = `${field}.${index}`;
      record[recordKey] = rawValue;
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

const isMappingEntry = (value: unknown): value is MappingEntry =>
  isRecord(value) && 'destKey' in value && 'sourceKeys' in value;

const PROPERTIES_PREFIX = 'properties.';

const propertyKeys = (sourceKeys: string | string[]): string[] =>
  (Array.isArray(sourceKeys) ? sourceKeys : [sourceKeys])
    .filter((path) => path.startsWith(PROPERTIES_PREFIX))
    // Reserve the direct child because buildCustomExtras filters direct children of message.properties.
    .map((path) => path.slice(PROPERTIES_PREFIX.length).split('.')[0]);

const sourceKeysOf = (value: unknown): Array<string | string[]> => {
  if (Array.isArray(value) && value.every(isMappingEntry)) {
    return value.map((entry) => entry.sourceKeys);
  }
  if (typeof value === 'string' || (Array.isArray(value) && value.every(isScalarValue))) {
    return [value as string | string[]];
  }
  return [];
};

const RESERVED_CUSTOM_KEYS = new Set<string>(
  Object.values(OPENAI_ADS_MAPPING_CONFIG).flatMap(sourceKeysOf).flatMap(propertyKeys),
);

const getSourceKey = (message: RudderMessage): string => {
  const sourceName = message.type === 'track' ? message.event : get(message, 'name');
  if (!sourceName)
    throw new InstrumentationError(
      `OpenAI Ads source event name is required for ${message.type} events`,
    );
  return String(sourceName);
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
  if (!isPresent(value)) return undefined;
  if (typeof value === 'boolean') return value;
  throw new InstrumentationError('OpenAI Ads opt_out must be a boolean');
};

const buildUser = (message: RudderMessage): OpenAIAdsUser | undefined => {
  const user: OpenAIAdsUser = {};
  const addArray = (key: PlainMatchField | HashMatchField, value: string[] | undefined) => {
    if (value?.length) user[key] = value;
  };
  const fieldGroups: Array<{
    mappings: MappingEntry[];
    transform: (payload: UserPayload) => void;
  }> = [
    {
      mappings: OPENAI_ADS_MAPPING_CONFIG.hashedUserMappings,
      transform: (payload) => {
        Object.entries(
          hashUserPayload(payload as Partial<Record<HashMatchField, unknown>>),
        ).forEach(([key, values]) => addArray(key as HashMatchField, values));
      },
    },
    {
      mappings: OPENAI_ADS_MAPPING_CONFIG.plainArrayUserMappings,
      transform: (payload) => {
        Object.entries(payload).forEach(([key, value]) => {
          addArray(key as PlainMatchField, toStringArray(value));
        });
      },
    },
    {
      mappings: OPENAI_ADS_MAPPING_CONFIG.plainScalarUserMappings,
      transform: (payload) => {
        Object.entries(payload).forEach(([key, rawValue]) => {
          const value = firstStringValue(rawValue);
          if (!value || (key === 'ip_address' && !isIP(value))) return;
          user[key as PlainMatchField] = value;
        });
      },
    },
  ];

  fieldGroups.forEach(({ mappings, transform }) => {
    transform((constructPayload(message, mappings) ?? {}) as UserPayload);
  });

  return Object.keys(user).length > 0 ? user : undefined;
};

const normalizeCurrency = (currency: unknown): CurrencyMetadata | undefined => {
  if (typeof currency !== 'string' && typeof currency !== 'number') return undefined;
  const normalized = String(currency).toUpperCase();
  if (!normalized) return undefined;
  const metadata = CURRENCY_RE.test(normalized) ? currencyCodes.code(normalized) : undefined;
  if (!metadata) {
    throw new InstrumentationError(`Unsupported currency code: ${normalized}`);
  }
  return { code: normalized, digits: metadata.digits };
};

const toMinorUnits = (amount: unknown, currency: CurrencyMetadata): number => {
  if (typeof amount !== 'string' && typeof amount !== 'number') {
    throw new InstrumentationError('Amount must be a number or numeric string');
  }
  const raw = String(amount);
  if (!/^\d+(?:\.\d+)?$/.test(raw)) {
    throw new InstrumentationError('Amount must be a finite decimal value');
  }
  const [whole, fraction = ''] = raw.split('.');
  if (fraction.length > currency.digits) {
    throw new InstrumentationError(`Amount has more precision than ${currency.code} supports`);
  }
  const minorUnits =
    BigInt(whole) * 10n ** BigInt(currency.digits) +
    BigInt(fraction.padEnd(currency.digits, '0') || '0');
  if (minorUnits > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new InstrumentationError('Amount exceeds the maximum safe integer after conversion');
  }
  return Number(minorUnits);
};

const resolveCurrency = (
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
): CurrencyMetadata | undefined =>
  normalizeCurrency(getValueFromMessage(message, OPENAI_ADS_MAPPING_CONFIG.currencyPaths)) ??
  normalizeCurrency(config.defaultCurrency);

const resolveAmount = (message: RudderMessage): unknown =>
  getValueFromMessage(message, OPENAI_ADS_MAPPING_CONFIG.amountPaths);

const buildAmountAndCurrency = (
  amount: unknown,
  resolveCurrencyMetadata: () => CurrencyMetadata | undefined,
  missingCurrencyMessage: string,
): { amount?: number; currency?: string } => {
  if (!isPresent(amount)) return {};
  const currency = resolveCurrencyMetadata();
  if (!currency) throw new InstrumentationError(missingCurrencyMessage);
  return {
    amount: toMinorUnits(amount, currency),
    currency: currency.code,
  };
};

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
  if (isPresent(quantityValue)) {
    const quantity = Number(quantityValue);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new InstrumentationError('OpenAI Ads content quantity must be a positive integer');
    }
    content.quantity = quantity;
  }

  const amountValue = getValueFromMessage(item, OPENAI_ADS_MAPPING_CONFIG.contentAmountPaths);
  Object.assign(
    content,
    buildAmountAndCurrency(
      amountValue,
      () =>
        normalizeCurrency(
          getValueFromMessage(item, OPENAI_ADS_MAPPING_CONFIG.contentCurrencyPaths),
        ) ?? resolveCurrency(message, config),
      'OpenAI Ads content currency is required when amount is present',
    ),
  );
  return Object.keys(content).length > 0 ? content : undefined;
};

const buildContents = (
  message: RudderMessage,
  config: OpenAIAdsDestinationConfig,
): OpenAIAdsContent[] | undefined => {
  const rawContents = getValueFromMessage(message, OPENAI_ADS_MAPPING_CONFIG.contentSourcePaths);
  if (!isPresent(rawContents)) return undefined;
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
  const dataType = EVENT_DATA_TYPE_BY_EVENT[eventType];
  const data: OpenAIAdsEventData = { type: dataType };
  const currency = resolveCurrency(message, config);
  Object.assign(
    data,
    buildAmountAndCurrency(
      resolveAmount(message),
      () => currency,
      'OpenAI Ads currency is required when amount is present',
    ),
  );

  if (dataType !== CUSTOMER_ACTION_DATA_TYPE) {
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
  const topLevelPayload = constructPayload(
    message,
    OPENAI_ADS_MAPPING_CONFIG.topLevelMappings,
  ) as EventBasePayload;
  const actionSource = resolveActionSource(topLevelPayload, config);
  const sourceUrl = resolveSourceUrl(topLevelPayload, actionSource);
  const user = buildUser(message);
  const optOut = resolveOptOut(topLevelPayload);

  return removeUndefinedAndNullValues({
    id: (resolveDotPath(message, mapping.deduplicationKey) ?? message.messageId) as string,
    type: eventType,
    custom_event_name: customEventName,
    timestamp_ms: topLevelPayload.timestamp_ms as number,
    opt_out: optOut,
    action_source: actionSource,
    source_url: sourceUrl,
    oppref: firstStringValue(topLevelPayload.oppref),
    user,
    data: buildEventData(message, config, eventType),
  }) as OpenAIAdsEventPayload;
};
