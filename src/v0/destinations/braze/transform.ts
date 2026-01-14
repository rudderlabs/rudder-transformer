/* eslint-disable no-nested-ternary,no-param-reassign */
import lodash from 'lodash';
import get from 'get-value';
import { InstrumentationError, NetworkError } from '@rudderstack/integrations-lib';
import { FilteredEventsError } from '../../util/errorTypes';
import type { RudderMessage } from '../../../types';
import {
  BrazeDedupUtility,
  CustomAttributeOperationUtil,
  processDeduplication,
  processBatch,
  addAppId,
  setExternalIdOrAliasObject,
  getPurchaseObjs,
  setExternalId,
  setAliasObject,
  collectStatsForAliasFailure,
  collectStatsForAliasMissConfigurations,
  handleReservedProperties,
  getEndpointFromConfig,
  formatGender,
} from './util';
import type {
  BrazeDestination,
  BrazeRouterRequest,
  BrazeProcessParams,
  BrazeUserAttributes,
  BrazeIdentifyRequestBody,
  BrazeEndpointDetails,
} from './types';

import tags from '../../util/tags';
import { EventType, MappedToDestinationKey } from '../../../constants';
import {
  adduserIdFromExternalId,
  defaultRequestConfig,
  getFieldValueFromMessage,
  removeUndefinedValues,
  isHttpStatusSuccess,
  isDefinedAndNotNull,
  simpleProcessRouterDestSync,
  simpleProcessRouterDest,
  isNewStatusCodesAccepted,
  getDestinationExternalID,
  getIntegrationsObj,
} from '../../util';
import {
  ConfigCategory,
  mappingConfig,
  getIdentifyEndpoint,
  getTrackEndPoint,
  getSubscriptionGroupEndPoint,
  getAliasMergeEndPoint,
  BRAZE_PARTNER_NAME,
  CustomAttributeOperationTypes,
} from './config';

import logger from '../../../logger';
import { handleHttpRequest } from '../../../adapters/network';
import { getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import { processBatchedIdentify } from './identityResolutionUtils';
import { JSON_MIME_TYPE } from '../../util/constant';

function buildResponse(
  message: RudderMessage,
  destination: BrazeDestination,
  properties: unknown,
  endpointDetails: BrazeEndpointDetails,
) {
  const response = defaultRequestConfig();
  response.endpoint = endpointDetails.endpoint;
  response.endpointPath = endpointDetails.path;
  response.userId = message.userId || message.anonymousId;
  response.body.JSON = removeUndefinedValues(properties);
  return {
    ...response,
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Accept: JSON_MIME_TYPE,
      Authorization: `Bearer ${destination.Config.restApiKey}`,
    },
    userId: message.userId || message.anonymousId,
  };
}

function getIdentifyPayload(message: RudderMessage): BrazeIdentifyRequestBody {
  let payload: Partial<BrazeUserAttributes> = {};
  payload = setAliasObject(payload, message);
  payload = setExternalId(payload, message);
  return { aliases_to_identify: [payload], merge_behavior: 'merge' };
}

function populateCustomAttributesWithOperation(
  traits: Record<string, unknown>,
  data: Record<string, unknown>,
  mergeObjectsUpdateOperation: unknown,
  enableNestedArrayOperations: unknown,
) {
  try {
    // add,update,remove on json attributes
    if (enableNestedArrayOperations) {
      Object.keys(traits)
        .filter(
          (key) =>
            traits[key] !== null && typeof traits[key] === 'object' && !Array.isArray(traits[key]),
        )
        .forEach((key) => {
          if ((traits[key] as Record<string, unknown>)[CustomAttributeOperationTypes.UPDATE]) {
            CustomAttributeOperationUtil.customAttributeUpdateOperation(
              key,
              data,
              traits,
              mergeObjectsUpdateOperation,
            );
          }
          if ((traits[key] as Record<string, unknown>)[CustomAttributeOperationTypes.REMOVE]) {
            CustomAttributeOperationUtil.customAttributeRemoveOperation(key, data, traits);
          }
          if ((traits[key] as Record<string, unknown>)[CustomAttributeOperationTypes.ADD]) {
            CustomAttributeOperationUtil.customAttributeAddOperation(key, data, traits);
          }
        });
    }
  } catch (exp: any) {
    logger.info('Failure occurred during custom attributes operations', exp);
  }
}

// Ref: https://www.braze.com/docs/api/objects_filters/user_attributes_object/
function getUserAttributesObject(message: unknown, mappingJson: unknown, destination?: unknown) {
  // blank output object
  const data: Record<string, unknown> = {};
  // get traits from message
  const traits = getFieldValueFromMessage(message, 'traits');

  // return the traits as-is if message is mapped to destination
  if (get(message, MappedToDestinationKey)) {
    return traits || {};
  }

  if (!traits) {
    return data;
  }

  // reserved keys : already mapped through mappingJson
  const reservedKeys = [
    'address',
    'birthday',
    'email',
    'firstName',
    'gender',
    'avatar',
    'lastName',
    'phone',
  ];

  const mappingJsonObj = mappingJson as Record<string, unknown>;
  // iterate over the destKeys and set the value if present
  Object.keys(mappingJsonObj).forEach((destKey) => {
    let value = get(traits, mappingJsonObj[destKey]);
    if (value || (value === null && reservedKeys.includes(destKey))) {
      switch (destKey) {
        case 'gender':
          value = formatGender(value);
          break;
        case 'email':
          if (typeof value === 'string') {
            value = value.toLowerCase();
          } else if (isDefinedAndNotNull(value)) {
            throw new InstrumentationError('Invalid email, email must be a valid string');
          }
          break;
        default:
          break;
      }
      data[destKey] = value;
    }
  });

  // iterate over rest of the traits properties
  Object.keys(traits as object).forEach((traitKey) => {
    // if traitKey is not reserved add the value to final output
    const value = get(traits, traitKey);
    if (!reservedKeys.includes(traitKey) && value !== undefined) {
      data[traitKey] = value;
    }
  });

  // populate data with custom attribute operations
  populateCustomAttributesWithOperation(
    traits,
    data,
    (message as { properties?: { mergeObjectsUpdateOperation?: unknown } }).properties
      ?.mergeObjectsUpdateOperation,
    (destination as { Config?: { enableNestedArrayOperations?: unknown } })?.Config
      ?.enableNestedArrayOperations,
  );

  return data;
}

/**
 * makes a call to braze identify endpoint to merge the alias (anonymousId) user with the
 * identified user with external_id (userId) [Identity resolution]
 * https://www.braze.com/docs/api/endpoints/user_data/post_user_identify/
 *
 * @param {*} message
 * @param {*} destination
 */
async function processIdentify(params: {
  message: RudderMessage;
  destination: BrazeDestination;
  metadata?: unknown;
  identifyCallsArray?: unknown[];
}) {
  const { message, destination, metadata, identifyCallsArray } = params;
  const identifyPayload = getIdentifyPayload(message);
  if (Array.isArray(identifyCallsArray)) {
    identifyCallsArray.push({
      identifyPayload,
      destination,
      metadata, // Include metadata for proper error tracking
    });
    return;
  }
  const { endpoint } = getIdentifyEndpoint(getEndpointFromConfig(destination));
  const { processedResponse: brazeIdentifyResp } = await handleHttpRequest(
    'post',
    endpoint,
    identifyPayload,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${destination.Config.restApiKey}`,
      },
    },
    {
      destType: 'braze',
      feature: 'transformation',
      requestMethod: 'POST',
      module: 'router',
      endpointPath: '/users/identify',
      metadata,
    },
  );

  if (!isHttpStatusSuccess(brazeIdentifyResp.status)) {
    throw new NetworkError(
      `Braze identify failed - ${JSON.stringify(brazeIdentifyResp.response)}`,
      brazeIdentifyResp.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(brazeIdentifyResp.status),
      },
      brazeIdentifyResp.response,
    );
  }

  collectStatsForAliasFailure(brazeIdentifyResp.response, destination.ID);
}

function processTrackWithUserAttributes(
  message: RudderMessage,
  destination: BrazeDestination,
  mappingJson: unknown,
  processParams: BrazeProcessParams,
  reqMetadata: Record<string, unknown>,
) {
  let payload = getUserAttributesObject(message, mappingJson, destination);
  if (payload && Object.keys(payload as object).length > 0) {
    payload = setExternalIdOrAliasObject(payload, message);
    const requestJson: Record<string, unknown> = { attributes: [payload] };
    if (destination.Config.supportDedup) {
      const dedupedAttributePayload = processDeduplication(
        processParams.userStore,
        payload,
        destination.ID,
        processParams.failedLookupIdentifiers,
      );
      if (dedupedAttributePayload) {
        requestJson.attributes = [dedupedAttributePayload];
      } else if (isNewStatusCodesAccepted(reqMetadata as Record<string, unknown> | undefined)) {
        throw new FilteredEventsError(
          '[Braze Deduplication]: Duplicate user detected, the user is dropped',
        );
      } else {
        throw new InstrumentationError(
          '[Braze Deduplication]: Duplicate user detected, the user is dropped',
        );
      }
    }
    return buildResponse(
      message,
      destination,
      requestJson,
      getTrackEndPoint(getEndpointFromConfig(destination)),
    );
  }
  throw new InstrumentationError('No attributes found to update the user profile');
}

function addMandatoryEventProperties(payload: Record<string, unknown>, message: RudderMessage) {
  payload.name = message.event!;
  payload.time = message.timestamp!;
  return payload;
}

function processTrackEvent(
  messageType: string,
  message: RudderMessage,
  destination: BrazeDestination,
  mappingJson: unknown,
  processParams: BrazeProcessParams,
) {
  const eventName = message.event;

  if (!message.properties) {
    message.properties = {};
  }
  let { properties } = message;
  const requestJson: Record<string, unknown> = {
    partner: BRAZE_PARTNER_NAME,
  };

  let attributePayload = getUserAttributesObject(message, mappingJson, destination);
  if (attributePayload && Object.keys(attributePayload as object).length > 0) {
    attributePayload = setExternalIdOrAliasObject(attributePayload, message);
    requestJson.attributes = [attributePayload];
    if (destination.Config.supportDedup) {
      const dedupedAttributePayload = processDeduplication(
        processParams.userStore,
        attributePayload,
        destination.ID,
        processParams.failedLookupIdentifiers,
      );
      if (dedupedAttributePayload) {
        requestJson.attributes = [dedupedAttributePayload];
      } else {
        delete requestJson.attributes;
      }
    }
  }

  if (
    messageType === EventType.TRACK &&
    typeof eventName === 'string' &&
    eventName.toLowerCase() === 'order completed'
  ) {
    const purchaseObjs = getPurchaseObjs(message, destination.Config);
    const orderCompletedPayload = {
      ...requestJson,
      purchases: purchaseObjs,
    };
    return buildResponse(
      message,
      destination,
      orderCompletedPayload,
      getTrackEndPoint(getEndpointFromConfig(destination)),
    );
  }
  properties = handleReservedProperties(properties);
  let payload: Record<string, unknown> = {};

  // mandatory fields
  payload = addMandatoryEventProperties(payload, message);
  payload.properties = properties;

  payload = setExternalIdOrAliasObject(payload, message);
  payload = addAppId(payload, message);
  if (payload) {
    requestJson.events = [payload];
  }

  return buildResponse(
    message,
    destination,
    requestJson,
    getTrackEndPoint(getEndpointFromConfig(destination)),
  );
}

// For group call we will add a user attribute with the groupId attribute
// with the value as true
//
// Ex: If the groupId is 1234, we'll add a attribute to the user object with the
// key `ab_rudder_group_1234` with the value `true`
function processGroup(message: RudderMessage, destination: BrazeDestination) {
  const groupId = getFieldValueFromMessage(message, 'groupId');
  if (!groupId) {
    throw new InstrumentationError('Invalid groupId');
  }
  if (destination.Config.enableSubscriptionGroupInGroupCall) {
    const m = message as RudderMessage & {
      traits?: { phone?: string; email?: string; subscriptionState?: string };
    };
    if (!(m.traits && (m.traits.phone || m.traits.email))) {
      throw new InstrumentationError(
        'Message should have traits with subscriptionState, email or phone',
      );
    }
    const subscriptionGroup: Record<string, unknown> = {
      subscription_group_id: groupId,
    };
    if (
      m.traits.subscriptionState !== 'subscribed' &&
      m.traits.subscriptionState !== 'unsubscribed'
    ) {
      throw new InstrumentationError(
        'you must provide a subscription state in traits and possible values are subscribed and unsubscribed.',
      );
    }
    subscriptionGroup.subscription_state = m.traits.subscriptionState;
    if (m.userId) {
      subscriptionGroup.external_ids = [m.userId];
    }
    const phone = getFieldValueFromMessage(message, 'phone');
    const email = getFieldValueFromMessage(message, 'email');
    if (phone) {
      subscriptionGroup.phones = [phone];
    } else if (email) {
      subscriptionGroup.emails = [email];
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const subscription_groups = [subscriptionGroup];
    const response = defaultRequestConfig();
    const { endpoint, path } = getSubscriptionGroupEndPoint(getEndpointFromConfig(destination));
    response.endpoint = endpoint;
    response.endpointPath = path;
    response.body.JSON = removeUndefinedValues({
      subscription_groups,
    });
    return {
      ...response,
      headers: {
        'Content-Type': JSON_MIME_TYPE,
        Accept: JSON_MIME_TYPE,
        Authorization: `Bearer ${destination.Config.restApiKey}`,
      },
    };
  }
  const groupAttribute: Record<string, unknown> = {};
  groupAttribute[`ab_rudder_group_${groupId}`] = true;
  setExternalId(groupAttribute, message);
  return buildResponse(
    message,
    destination,
    {
      attributes: [groupAttribute],
      partner: BRAZE_PARTNER_NAME,
    },
    getTrackEndPoint(getEndpointFromConfig(destination)),
  );
}

function processAlias(message: RudderMessage, destination: BrazeDestination) {
  const { userId, previousId } = message;

  if (!userId) {
    throw new InstrumentationError('[BRAZE]: userId is required for alias call');
  }

  if (!previousId) {
    throw new InstrumentationError('[BRAZE]: previousId is required for alias call');
  }

  const mergeUpdates = [
    {
      identifier_to_merge: {
        external_id: previousId,
      },
      identifier_to_keep: {
        external_id: userId,
      },
    },
  ];

  const requestJson = {
    merge_updates: mergeUpdates,
  };

  return buildResponse(
    message,
    destination,
    requestJson,
    getAliasMergeEndPoint(getEndpointFromConfig(destination)),
  );
}

async function process(
  event: BrazeRouterRequest,
  processParams: BrazeProcessParams = { userStore: new Map(), failedLookupIdentifiers: new Set() },
  reqMetadata: Record<string, unknown> = {},
) {
  let response;
  const { message, destination } = event;
  const messageType = message.type.toLowerCase();

  let category = ConfigCategory.DEFAULT;
  switch (messageType) {
    case EventType.TRACK:
      response = processTrackEvent(
        messageType,
        message,
        destination,
        (mappingConfig as Record<string, unknown>)[category.name],
        processParams,
      );
      break;
    case EventType.PAGE:
      message.event = message.name || get(message, 'properties.name') || 'Page Viewed';
      response = processTrackEvent(
        messageType,
        message,
        destination,
        (mappingConfig as Record<string, unknown>)[category.name],
        processParams,
      );
      break;
    case EventType.SCREEN:
      message.event = message.name || get(message, 'properties.name') || 'Screen Viewed';
      response = processTrackEvent(
        messageType,
        message,
        destination,
        (mappingConfig as Record<string, unknown>)[category.name],
        processParams,
      );
      break;
    case EventType.IDENTIFY: {
      category = ConfigCategory.IDENTIFY;
      // override userId with externalId in context(if present) and event is mapped to destination
      const mappedToDestination = get(message, MappedToDestinationKey);
      if (mappedToDestination) {
        adduserIdFromExternalId(message);
      }

      const integrationsObj = getIntegrationsObj(message, 'BRAZE' as unknown as undefined);
      const isAliasPresent = isDefinedAndNotNull(integrationsObj?.alias);

      const brazeExternalID =
        getDestinationExternalID(message, 'brazeExternalId') || message.userId;
      if ((message.anonymousId || isAliasPresent) && brazeExternalID) {
        await processIdentify({
          message,
          destination,
          identifyCallsArray: processParams.identifyCallsArray,
        });
      } else {
        collectStatsForAliasMissConfigurations(destination.ID);
      }
      response = processTrackWithUserAttributes(
        message,
        destination,
        (mappingConfig as Record<string, unknown>)[category.name],
        processParams,
        reqMetadata,
      );
      break;
    }
    case EventType.GROUP:
      response = processGroup(message, destination);
      break;
    case EventType.ALIAS:
      response = processAlias(message, destination);
      break;
    default:
      throw new InstrumentationError('Message type is not supported');
  }

  return response;
}

const processRouterDest = async (
  inputs: BrazeRouterRequest[],
  reqMetadata: Record<string, unknown>,
) => {
  const userStore = new Map<string, unknown>();
  let failedLookupIdentifiers = new Set<string>();
  const { destination } = inputs[0];
  if (destination.Config.supportDedup) {
    let lookupResult;
    try {
      lookupResult = await BrazeDedupUtility.doLookup(inputs);
    } catch (error: any) {
      logger.error('Error while fetching user store', error);
    }

    if (lookupResult) {
      BrazeDedupUtility.updateUserStore(userStore, lookupResult.users, destination.ID);
      failedLookupIdentifiers = lookupResult.failedIdentifiers || new Set();
    }
  }
  // group events by userId or anonymousId and then call process
  const groupedInputs = lodash.groupBy(
    inputs,
    (input) => input.message.userId || input.message.anonymousId,
  );

  const identifyCallsArray: unknown[] = [];

  // process each group of events for userId or anonymousId
  // if deduplication is enabled process each group of events for a user (userId or anonymousId)
  // synchronously (slower) else process asynchronously (faster)
  const allResps = Object.keys(groupedInputs).map(async (id) => {
    const simpleProcessRouterDestFunc = destination.Config.supportDedup
      ? simpleProcessRouterDestSync
      : simpleProcessRouterDest;
    const respList = await simpleProcessRouterDestFunc(groupedInputs[id], process, reqMetadata, {
      userStore,
      identifyCallsArray,
      failedLookupIdentifiers,
    });
    return respList;
  });

  const output = await Promise.all(allResps);

  if (identifyCallsArray && identifyCallsArray.length > 0) {
    await processBatchedIdentify(identifyCallsArray as any, destination.ID);
  }

  const allTransfomredEvents = lodash.flatMap(output);
  return processBatch(allTransfomredEvents);
};

export { process, processRouterDest };
