import get from 'get-value';
import validator from 'validator';
import { ConfigurationError, InstrumentationError } from '@rudderstack/integrations-lib';
import {
  isDefinedAndNotNullAndNotEmpty,
  constructPayload,
  defaultRequestConfig,
  removeHyphens,
  removeUndefinedAndNullValues,
  getDestinationExternalIDInfoForRetl,
} from '../../util';
import {
  processAudienceRecord,
  isValidPhoneNumber,
  type AudienceField,
} from '../../util/audienceUtils';
import logger from '../../../logger';
import { MappedToDestinationKey } from '../../../constants';
import { JSON_MIME_TYPE } from '../../util/constant';
import {
  addressInfoMapping,
  attributeMapping,
  TYPEOFLIST,
  OFFLINE_USER_DATA_JOBS_ENDPOINT,
  BASE_ENDPOINT,
  ADDRESS_INFO_ATTRIBUTES,
  destType,
} from './config';
import type { GARLDestinationConfig } from './types';

const COUNTRY_CODE_REGEX = /^[A-Za-z]{2,3}$/;
const GMAIL_DOMAINS = new Set(['gmail.com', 'googlemail.com']);

const normalizeEmail = (v: string): string => {
  const trimmed = v.trim().toLowerCase();
  const atIdx = trimmed.indexOf('@');
  if (atIdx === -1) return trimmed;
  const domain = trimmed.slice(atIdx + 1);
  if (GMAIL_DOMAINS.has(domain)) {
    const username = trimmed.slice(0, atIdx).replace(/\./g, '').replace(/\+.*$/, '');
    return `${username}@${domain}`;
  }
  return trimmed;
};

const normalizePhone = (v: string): string => {
  const stripped = v.replace(/[\s().-]/g, '');
  if (!stripped) {
    return '';
  }
  return stripped.startsWith('+') ? stripped : `+${stripped}`;
};

/**
 * Per-field normalization and validation rules for GARL.
 * Normalization follows Google Customer Match requirements:
 * https://developers.google.com/google-ads/api/docs/remarketing/audience-segments/customer-match/get-started
 */
const GARL_FIELD_CONFIG: Record<string, AudienceField> = {
  email: { normalize: normalizeEmail, validate: validator.isEmail, hashable: true },
  phone: { normalize: normalizePhone, validate: isValidPhoneNumber, hashable: true },
  firstName: {
    normalize: (v) => v.trim().toLowerCase(),
    validate: (v) => v.length > 0,
    hashable: true,
  },
  lastName: {
    normalize: (v) => v.trim().toLowerCase(),
    validate: (v) => v.length > 0,
    hashable: true,
  },
  country: {
    normalize: (v) => v.trim(),
    validate: (v) => COUNTRY_CODE_REGEX.test(v),
    hashable: false,
  },
  postalCode: { normalize: (v) => v.trim(), validate: (v) => v.length > 0, hashable: false },
};

const responseBuilder = (
  accessToken: string,
  body: unknown,
  { Config }: { Config: GARLDestinationConfig },
  audienceId: string | null,
  consentBlock: Record<string, string>,
) => {
  const payload = body;
  const response = defaultRequestConfig();
  const filteredCustomerId = removeHyphens(Config.customerId);
  response.endpointPath = OFFLINE_USER_DATA_JOBS_ENDPOINT;
  response.endpoint = `${BASE_ENDPOINT}/${filteredCustomerId}/${OFFLINE_USER_DATA_JOBS_ENDPOINT}`;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  if (!isDefinedAndNotNullAndNotEmpty(audienceId)) {
    throw new ConfigurationError('List ID is a mandatory field');
  }
  response.params = {
    listId: audienceId,
    customerId: filteredCustomerId,
    consent: consentBlock,
  };
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  if (Config.subAccount)
    if (Config.loginCustomerId) {
      const filteredLoginCustomerId = removeHyphens(Config.loginCustomerId);
      response.headers['login-customer-id'] = filteredLoginCustomerId;
    } else throw new ConfigurationError(`loginCustomerId is required as subAccount is true.`);
  return response;
};

/**
 * This function helps creates an array with proper mapping for userIdentiFier.
 * Logics: Here we are creating an array with all the attributes provided in the add/remove array
 * inside listData.
 * @param {Array} attributeArray rudder event message properties listData add
 * @param {string} typeOfList
 * @param {Array<string>} userSchema
 * @param {boolean} isHashRequired
 * @returns
 */
const populateIdentifiers = (
  attributeArray: Record<string, unknown>[],
  typeOfList: string,
  userSchema: string[],
  isHashRequired: boolean,
  workspaceId: string,
  destinationId: string,
) => {
  const userIdentifier: Record<string, unknown>[] = [];
  let attribute: string | string[];
  if (TYPEOFLIST[typeOfList]) {
    attribute = TYPEOFLIST[typeOfList];
  } else {
    attribute = userSchema;
  }
  if (isDefinedAndNotNullAndNotEmpty(attributeArray)) {
    const audienceDest = {
      workspaceId,
      id: destinationId,
      type: destType,
      config: { isHashRequired },
    };
    // traversing through every element in the add array
    attributeArray.forEach((rawElement, index) => {
      const element = processAudienceRecord(rawElement, {
        fieldConfigs: GARL_FIELD_CONFIG,
        destination: audienceDest,
      });
      // checking if the attribute is an array or not for generic type list
      if (!Array.isArray(attribute)) {
        if (element[attribute]) {
          userIdentifier.push({ [attribute]: element[attribute] });
        } else {
          logger.info(` ${attribute} is not present in index:`, index);
        }
      } else {
        attribute.forEach((attributeElement, index2) => {
          if (attributeElement === 'addressInfo') {
            const addressInfo = constructPayload(element, addressInfoMapping);
            // checking if addressInfo object is empty or not.
            if (isDefinedAndNotNullAndNotEmpty(addressInfo)) userIdentifier.push({ addressInfo });
          } else if (element[`${attributeElement}`]) {
            userIdentifier.push({
              [`${attributeMapping[attributeElement]}`]: element[`${attributeElement}`],
            });
          } else {
            logger.info(` ${attribute[index2]} is not present in index:`, index);
          }
        });
      }
    });
  }
  return userIdentifier;
};

const populateIdentifiersForRecordEvent = (
  identifiersArray: Record<string, unknown>[],
  typeOfList: string,
  userSchema: string[] | undefined,
  isHashRequired: boolean,
  workspaceId: string,
  destinationId: string,
): ({ identifiers: Record<string, unknown>[] } | { error: Error })[] => {
  if (!isDefinedAndNotNullAndNotEmpty(identifiersArray)) {
    return [];
  }

  const audienceDest = {
    workspaceId,
    id: destinationId,
    type: destType,
    config: { isHashRequired },
  };

  return identifiersArray.map((rawIdentifiers) => {
    let identifiers: Record<string, unknown>;
    try {
      identifiers = processAudienceRecord(rawIdentifiers, {
        fieldConfigs: GARL_FIELD_CONFIG,
        destination: audienceDest,
      });
    } catch (e) {
      return { error: e instanceof Error ? e : new Error(String(e)) };
    }
    const recordIdentifiers: Record<string, unknown>[] = [];
    if (TYPEOFLIST[typeOfList] && identifiers[TYPEOFLIST[typeOfList]]) {
      recordIdentifiers.push({
        [TYPEOFLIST[typeOfList]]: identifiers[TYPEOFLIST[typeOfList]],
      });
    } else {
      Object.entries(attributeMapping).forEach(([key, mappedKey]) => {
        if (identifiers[key] && userSchema?.includes(key))
          recordIdentifiers.push({ [mappedKey]: identifiers[key] });
      });
      const addressInfo = constructPayload(identifiers, addressInfoMapping);
      if (
        isDefinedAndNotNullAndNotEmpty(addressInfo) &&
        (userSchema?.includes('addressInfo') ||
          userSchema?.some((schema) => ADDRESS_INFO_ATTRIBUTES.includes(schema)))
      )
        recordIdentifiers.push({ addressInfo });
    }

    if (recordIdentifiers.length === 0) {
      return { error: new InstrumentationError('Event has no valid identifiers') };
    }
    return { identifiers: recordIdentifiers };
  });
};

const getOperationAudienceId = (audienceId: string, message: Record<string, unknown>) => {
  let operationAudienceId = audienceId;
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (!operationAudienceId && mappedToDestination) {
    const { objectType } = getDestinationExternalIDInfoForRetl(
      message,
      'GOOGLE_ADWORDS_REMARKETING_LISTS',
    );
    operationAudienceId = objectType!;
  }
  return operationAudienceId;
};

export {
  populateIdentifiers,
  responseBuilder,
  getOperationAudienceId,
  populateIdentifiersForRecordEvent,
};
