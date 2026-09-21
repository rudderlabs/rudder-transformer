import { ConfigurationError, InstrumentationError } from '@rudderstack/integrations-lib';
import { getValueFromMessage, isAppleFamily, isAndroidFamily } from '../../util';
import { POSTBACK_URL_PATTERN, SOURCE_PATHS } from './config';
import type { EverflowDestinationConfig, EverflowMessage, EverflowPostbackParams } from './types';

const isPresent = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== '';

const optionalValue = (message: EverflowMessage, paths: string | readonly string[]): unknown => {
  const value = getValueFromMessage(message, paths);
  return isPresent(value) ? value : undefined;
};

const resolveAmount = (message: EverflowMessage): number | undefined => {
  const rawAmount = optionalValue(message, SOURCE_PATHS.amount);
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
  const rawCurrency = optionalValue(message, SOURCE_PATHS.currency);
  if (typeof rawCurrency !== 'string') {
    return undefined;
  }
  const currency = rawCurrency.toUpperCase();
  return /^[A-Z]{3}$/.test(currency) ? currency : undefined;
};

const resolveTimestamp = (message: EverflowMessage): number | undefined => {
  const rawTimestamp = optionalValue(message, SOURCE_PATHS.timestamp);
  if (typeof rawTimestamp !== 'string' && typeof rawTimestamp !== 'number') {
    return undefined;
  }
  const milliseconds = new Date(rawTimestamp).getTime();
  return Number.isNaN(milliseconds) ? undefined : Math.floor(milliseconds / 1000);
};

const resolveMobileParams = (message: EverflowMessage): Partial<EverflowPostbackParams> => {
  const deviceType = optionalValue(message, 'context.device.type');
  const advertisingId = optionalValue(message, 'context.device.advertisingId');
  const androidDeviceId = optionalValue(message, 'context.device.id');
  const appleDevice = isAppleFamily(deviceType);
  const androidDevice = isAndroidFamily(deviceType);

  return {
    idfa: appleDevice ? advertisingId : undefined,
    idfa_md5: optionalValue(message, SOURCE_PATHS.idfaMd5),
    idfa_sha1: optionalValue(message, SOURCE_PATHS.idfaSha1),
    google_aid: androidDevice ? advertisingId : undefined,
    google_aid_md5: optionalValue(message, SOURCE_PATHS.googleAidMd5),
    google_aid_sha1: optionalValue(message, SOURCE_PATHS.googleAidSha1),
    android_id:
      optionalValue(message, SOURCE_PATHS.androidId) ??
      (androidDevice ? androidDeviceId : undefined),
    app_id: optionalValue(message, 'context.app.namespace'),
  };
};

export const validatePostbackUrl = (postbackUrl: string): void => {
  if (!POSTBACK_URL_PATTERN.test(postbackUrl)) {
    throw new ConfigurationError(
      'Invalid Everflow postbackUrl. Paste only the base Global Postback URL and remove everything from ? onward.',
    );
  }
};

export const buildEverflowParams = (
  message: EverflowMessage,
  config: Pick<EverflowDestinationConfig, 'networkId' | 'verificationToken'>,
): EverflowPostbackParams => {
  const transactionId = optionalValue(message, SOURCE_PATHS.transactionId);
  if (transactionId === undefined) {
    throw new InstrumentationError(
      'Everflow transaction_id is required in properties.transactionId, properties.transaction_id, or properties.tid.',
    );
  }

  const params: EverflowPostbackParams = {
    nid: config.networkId,
    transaction_id: transactionId,
  };
  const optionalParams: Partial<EverflowPostbackParams> = {
    verification_token: isPresent(config.verificationToken) ? config.verificationToken : undefined,
    amount: resolveAmount(message),
    currency: resolveCurrency(message),
    coupon_code: optionalValue(message, SOURCE_PATHS.couponCode),
    event_id: optionalValue(message, SOURCE_PATHS.eventId),
    adv_event_id: optionalValue(message, SOURCE_PATHS.advertiserEventId),
    event_name: optionalValue(message, 'event'),
    order_id: optionalValue(message, SOURCE_PATHS.orderId),
    email: optionalValue(message, SOURCE_PATHS.email),
    user_id: optionalValue(message, 'userId'),
    user_ip: optionalValue(message, SOURCE_PATHS.userIp),
    user_agent: optionalValue(message, 'context.userAgent'),
    timestamp: resolveTimestamp(message),
    oid: optionalValue(message, SOURCE_PATHS.offerId),
    affid: optionalValue(message, SOURCE_PATHS.affiliateId),
    ...resolveMobileParams(message),
  };

  Object.entries(optionalParams).forEach(([key, value]) => {
    if (isPresent(value)) {
      params[key] = value;
    }
  });

  for (let index = 1; index <= 10; index += 1) {
    const value = optionalValue(message, `properties.adv${index}`);
    if (value !== undefined) {
      params[`adv${index}`] = String(value);
    }
  }

  return params;
};
