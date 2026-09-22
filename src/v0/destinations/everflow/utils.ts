import { InstrumentationError } from '@rudderstack/integrations-lib';
import pickBy from 'lodash/pickBy';
import {
  constructPayload,
  getValueFromMessage,
  isAppleFamily,
  isAndroidFamily,
  toUnixTimestamp,
} from '../../util';
import mappingConfig from './data/EVERFLOWConfig.json';
import type { EverflowDestinationConfig, EverflowMessage } from './types';

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

const DECIMAL_AMOUNT_PATTERN = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;

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

  const amount =
    typeof rawAmount === 'number' ||
    (typeof rawAmount === 'string' && DECIMAL_AMOUNT_PATTERN.test(rawAmount.trim()))
      ? Number(rawAmount)
      : NaN;
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
  const seconds = toUnixTimestamp(rawTimestamp);
  return Number.isNaN(seconds) ? undefined : seconds;
};

const resolveMobileParams = (
  message: EverflowMessage,
  explicitAndroidId: unknown,
): Record<string, unknown> => {
  const deviceType = optionalValue(message, 'context.device.type');
  const appleDevice = isAppleFamily(deviceType);
  const androidDevice = isAndroidFamily(deviceType);
  if (!appleDevice && !androidDevice) {
    // `android_id` already carries any explicitly mapped value, so there is nothing to add.
    return {};
  }

  const advertisingId = optionalValue(message, 'context.device.advertisingId');
  if (appleDevice) {
    return { idfa: advertisingId };
  }
  return {
    google_aid: advertisingId,
    android_id: explicitAndroidId ?? optionalValue(message, 'context.device.id'),
  };
};

export const buildEverflowParams = (
  message: EverflowMessage,
  config: Pick<EverflowDestinationConfig, 'networkId' | 'verificationToken'>,
): Record<string, unknown> => {
  const mappedParams = constructPayload(
    message,
    EVERFLOW_MAPPING_CONFIG.standardMappings,
  ) as Record<string, unknown>;

  // `constructPayload` never emits empty values, so only the optional block below needs filtering.
  return {
    nid: config.networkId,
    ...mappedParams,
    ...pickBy(
      {
        verification_token: config.verificationToken,
        amount: resolveAmount(message),
        currency: resolveCurrency(message),
        timestamp: resolveTimestamp(message),
        ...resolveMobileParams(message, mappedParams.android_id),
      },
      isPresent,
    ),
  };
};
