import { InstrumentationError } from '@rudderstack/integrations-lib';
import { constructPayload, getValueFromMessage, isAppleFamily, isAndroidFamily } from '../../util';
import mappingConfig from './data/EVERFLOWConfig.json';
import type { EverflowDestinationConfig, EverflowMessage, EverflowPostbackParams } from './types';

type MappingEntry = {
  sourceKeys: string | string[];
  destKey: string;
  required?: boolean;
  metadata?: Record<string, unknown>;
};

type EverflowMappingConfig = {
  standardMappings: MappingEntry[];
  amountPaths: string | string[];
  currencyPath: string;
  timestampPaths: string | string[];
};

const EVERFLOW_MAPPING_CONFIG = mappingConfig as EverflowMappingConfig;

const isPresent = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== '';

const optionalValue = (message: EverflowMessage, paths: string | readonly string[]): unknown => {
  const value = getValueFromMessage(message, paths);
  return isPresent(value) ? value : undefined;
};

const resolveAmount = (message: EverflowMessage): number | undefined => {
  const rawAmount = optionalValue(message, EVERFLOW_MAPPING_CONFIG.amountPaths);
  if (rawAmount === undefined) {
    return undefined;
  }
  if (
    (typeof rawAmount !== 'string' && typeof rawAmount !== 'number') ||
    (typeof rawAmount === 'string' &&
      !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(rawAmount.trim()))
  ) {
    throw new InstrumentationError('Everflow amount must be a valid decimal number.');
  }

  const amount = Number(rawAmount);
  if (!Number.isFinite(amount)) {
    throw new InstrumentationError('Everflow amount must be a valid decimal number.');
  }
  return amount;
};

const resolveCurrency = (message: EverflowMessage): string | undefined => {
  const rawCurrency = optionalValue(message, EVERFLOW_MAPPING_CONFIG.currencyPath);
  if (typeof rawCurrency !== 'string') {
    return undefined;
  }
  const currency = rawCurrency.toUpperCase();
  return /^[A-Z]{3}$/.test(currency) ? currency : undefined;
};

const resolveTimestamp = (message: EverflowMessage): number | undefined => {
  const rawTimestamp = optionalValue(message, EVERFLOW_MAPPING_CONFIG.timestampPaths);
  if (typeof rawTimestamp !== 'string' && typeof rawTimestamp !== 'number') {
    return undefined;
  }
  const milliseconds = new Date(rawTimestamp).getTime();
  return Number.isNaN(milliseconds) ? undefined : Math.floor(milliseconds / 1000);
};

const resolveMobileParams = (
  message: EverflowMessage,
  explicitAndroidId: unknown,
): Partial<EverflowPostbackParams> => {
  const deviceType = optionalValue(message, 'context.device.type');
  const advertisingId = optionalValue(message, 'context.device.advertisingId');
  const androidDeviceId = optionalValue(message, 'context.device.id');
  const appleDevice = isAppleFamily(deviceType);
  const androidDevice = isAndroidFamily(deviceType);

  return {
    idfa: appleDevice ? advertisingId : undefined,
    google_aid: androidDevice ? advertisingId : undefined,
    android_id: explicitAndroidId ?? (androidDevice ? androidDeviceId : undefined),
  };
};

export const buildEverflowParams = (
  message: EverflowMessage,
  config: Pick<EverflowDestinationConfig, 'networkId' | 'verificationToken'>,
): EverflowPostbackParams => {
  const mappedParams = constructPayload(
    message,
    EVERFLOW_MAPPING_CONFIG.standardMappings,
  ) as Partial<EverflowPostbackParams>;
  if (mappedParams.transaction_id === undefined) {
    throw new InstrumentationError(
      'Everflow transaction_id is required in properties.transactionId, properties.transaction_id, or properties.tid.',
    );
  }

  const params: EverflowPostbackParams = {
    nid: config.networkId,
    ...mappedParams,
  } as EverflowPostbackParams;
  const optionalParams: Partial<EverflowPostbackParams> = {
    verification_token: isPresent(config.verificationToken) ? config.verificationToken : undefined,
    amount: resolveAmount(message),
    currency: resolveCurrency(message),
    timestamp: resolveTimestamp(message),
    ...resolveMobileParams(message, mappedParams.android_id),
  };

  Object.entries(optionalParams).forEach(([key, value]) => {
    if (isPresent(value)) {
      params[key] = value;
    }
  });
  return params;
};
