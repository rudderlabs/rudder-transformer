import get from 'get-value';
import sha256 from 'sha256';
import { ConfigurationError } from '@rudderstack/integrations-lib';
import {
  isDefinedAndNotNullAndNotEmpty,
  constructPayload,
  defaultRequestConfig,
  removeHyphens,
  removeUndefinedAndNullValues,
  getDestinationExternalIDInfoForRetl,
} from '../../util';
import { validateHashingConsistency } from '../../util/audienceUtils';
import logger from '../../../logger';
import { MappedToDestinationKey } from '../../../constants';
import { JSON_MIME_TYPE } from '../../util/constant';
import {
  addressInfoMapping,
  attributeMapping,
  TYPEOFLIST,
  OFFLINE_USER_DATA_JOBS_ENDPOINT,
  BASE_ENDPOINT,
  hashAttributes,
  ADDRESS_INFO_ATTRIBUTES,
  destType,
} from './config';
import type { GARLDestinationConfig } from './types';

const hashEncrypt = (object: Record<string, unknown>) => {
  Object.keys(object).forEach((key) => {
    if (hashAttributes.includes(key) && object[key]) {
      // eslint-disable-next-line no-param-reassign
      object[key] = sha256(object[key]);
    }
  });
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
    attributeArray.forEach((element, index) => {
      hashAttributes.forEach((field) => {
        if (element[field]) {
          validateHashingConsistency(field, String(element[field]), audienceDest);
        }
      });
      if (isHashRequired) {
        hashEncrypt(element);
      }
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
) => {
  const userIdentifiers: Record<string, unknown>[] = [];

  if (isDefinedAndNotNullAndNotEmpty(identifiersArray)) {
    const audienceDest = {
      workspaceId,
      id: destinationId,
      type: destType,
      config: { isHashRequired },
    };
    // traversing through every element in the add array
    identifiersArray.forEach((identifiers) => {
      hashAttributes.forEach((field) => {
        if (identifiers[field]) {
          validateHashingConsistency(field, String(identifiers[field]), audienceDest);
        }
      });
      if (isHashRequired) {
        hashEncrypt(identifiers);
      }
      if (TYPEOFLIST[typeOfList] && identifiers[TYPEOFLIST[typeOfList]]) {
        userIdentifiers.push({ [TYPEOFLIST[typeOfList]]: identifiers[TYPEOFLIST[typeOfList]] });
      } else {
        Object.entries(attributeMapping).forEach(([key, mappedKey]) => {
          if (identifiers[key] && userSchema?.includes(key))
            userIdentifiers.push({ [mappedKey]: identifiers[key] });
        });
        const addressInfo = constructPayload(identifiers, addressInfoMapping);
        if (
          isDefinedAndNotNullAndNotEmpty(addressInfo) &&
          (userSchema?.includes('addressInfo') ||
            userSchema?.some((schema) => ADDRESS_INFO_ATTRIBUTES.includes(schema)))
        )
          userIdentifiers.push({ addressInfo });
      }
    });
  }
  return userIdentifiers;
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
