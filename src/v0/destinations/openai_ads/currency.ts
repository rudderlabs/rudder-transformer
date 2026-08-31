import { InstrumentationError } from '@rudderstack/integrations-lib';

const ZERO_DECIMAL = new Set([
  'BIF',
  'CLP',
  'DJF',
  'GNF',
  'ISK',
  'JPY',
  'KMF',
  'KRW',
  'PYG',
  'RWF',
  'UGX',
  'VND',
  'VUV',
  'XAF',
  'XOF',
  'XPF',
]);
const THREE_DECIMAL = new Set(['BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND']);
const CURRENCY_RE = /^[A-Z]{3}$/;
export const normalizeCurrency = (currency: unknown): string | undefined => {
  if (typeof currency !== 'string' && typeof currency !== 'number') return undefined;
  const normalized = String(currency).trim().toUpperCase();
  if (!normalized) return undefined;
  if (!CURRENCY_RE.test(normalized))
    throw new InstrumentationError(`Unsupported currency code: ${normalized}`);
  return normalized;
};
const exponent = (currency: string) => {
  if (ZERO_DECIMAL.has(currency)) return 0;
  if (THREE_DECIMAL.has(currency)) return 3;
  return 2;
};
export const toMinorUnits = (amount: unknown, currency: string): number => {
  const normalizedCurrency = normalizeCurrency(currency);
  if (!normalizedCurrency)
    throw new InstrumentationError('Currency is required when amount is present');
  if (typeof amount !== 'string' && typeof amount !== 'number')
    throw new InstrumentationError('Amount must be a number or numeric string');
  const raw = String(amount).trim();
  if (!/^\d+(?:\.\d+)?$/.test(raw))
    throw new InstrumentationError('Amount must be a finite decimal value');
  const [whole, fraction = ''] = raw.split('.');
  const digits = exponent(normalizedCurrency);
  if (fraction.length > digits)
    throw new InstrumentationError(`Amount has more precision than ${normalizedCurrency} supports`);
  const minorUnits =
    BigInt(whole) * 10n ** BigInt(digits) + BigInt(fraction.padEnd(digits, '0') || '0');
  if (minorUnits > BigInt(Number.MAX_SAFE_INTEGER))
    throw new InstrumentationError('Amount exceeds the maximum safe integer after conversion');
  return Number(minorUnits);
};
