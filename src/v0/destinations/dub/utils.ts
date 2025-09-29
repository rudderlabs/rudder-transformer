import { InstrumentationError } from '@rudderstack/integrations-lib';
import { MAPPING_CATEGORY } from './config';
import {
  getMappingConfig,
  constructPayload,
  getDestinationExternalID,
  getFieldValueFromMessage,
  getFullName,
  removeUndefinedNullValuesAndEmptyObjectArray,
} from '../../util';
import { RudderMessage } from '../../../types';
import { TrackLeadRequestBody, TrackSaleRequestBody } from './types';

const MAPPING_CONFIG = getMappingConfig(MAPPING_CATEGORY, __dirname);
const LEAD_CONVERSION_MAPPING = MAPPING_CONFIG[MAPPING_CATEGORY.LEAD_CONVERSION.name];
const SALES_CONVERSION_MAPPING = MAPPING_CONFIG[MAPPING_CATEGORY.SALES_CONVERSION.name];

const createHeader = (apiKey: string): Record<string, string> => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${apiKey}`,
});

const getExternalId = (message: RudderMessage): string | null =>
  getDestinationExternalID(message, 'customerExternalId') ||
  getFieldValueFromMessage(message, 'userIdOnly');

// Type-safe helper functions that avoid 'as' assertions
const buildLeadPayload = (message: RudderMessage): TrackLeadRequestBody => {
  const rawPayload = constructPayload(message, LEAD_CONVERSION_MAPPING);
  if (!rawPayload || Object.keys(rawPayload).length === 0) {
    throw new InstrumentationError('Mapped payload is empty. Aborting message.');
  }

  rawPayload.customerName = getFieldValueFromMessage(message, 'name') || getFullName(message);
  rawPayload.customerExternalId = getExternalId(message);
  if (!rawPayload.customerExternalId) {
    throw new InstrumentationError('customerExternalId is required for LEAD_CONVERSIONs');
  }
  rawPayload.mode = 'wait';
  return removeUndefinedNullValuesAndEmptyObjectArray(rawPayload) as TrackLeadRequestBody;
};

const buildSalePayload = (
  message: RudderMessage,
  convertAmountToCents: boolean,
): TrackSaleRequestBody => {
  const rawPayload = constructPayload(message, SALES_CONVERSION_MAPPING);
  if (!rawPayload || Object.keys(rawPayload).length === 0) {
    throw new InstrumentationError('Mapped payload is empty. Aborting message.');
  }

  rawPayload.customerName = getFieldValueFromMessage(message, 'name') || getFullName(message);
  rawPayload.customerExternalId = getExternalId(message);
  if (!rawPayload.customerExternalId) {
    throw new InstrumentationError('customerExternalId is required for SALES_CONVERSIONs');
  }
  // convert amount to cents if the flag is set to true
  // https://dub.co/docs/api-reference/endpoint/track-sale#body-amount
  if (convertAmountToCents && typeof rawPayload.amount === 'number') {
    rawPayload.amount = Math.round(rawPayload.amount * 100);
  }
  return removeUndefinedNullValuesAndEmptyObjectArray(rawPayload) as TrackSaleRequestBody;
};

export {
  LEAD_CONVERSION_MAPPING,
  SALES_CONVERSION_MAPPING,
  createHeader,
  buildLeadPayload,
  buildSalePayload,
};
