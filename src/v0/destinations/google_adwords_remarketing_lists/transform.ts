import {
  InstrumentationError,
  ConfigurationError,
  groupByInBatches,
} from '@rudderstack/integrations-lib';
import logger from '../../../logger';
import {
  returnArrayOfSubarrays,
  constructPayload,
  simpleProcessRouterDest,
  getAccessToken,
} from '../../util';

import { populateConsentFromConfig } from '../../util/googleUtils';
import { offlineDataJobsMapping, consentConfigMap } from './config';
import { processRecordInputs } from './recordTransform';
import { populateIdentifiers, responseBuilder, getOperationAudienceId } from './util';
import type { GARLDestination, Message, OfflineDataJobPayload, RecordInput } from './types';
import { Metadata } from '../../../types';
import { isDataManagerAPIEnabled } from './dataManager/featureFlag';
import {
  processRouterDest as dataManagerProcessRouterDest,
  transformAudienceListEvent as dataManagerTransformAudienceListEvent,
} from './dataManager/transform';
import type {
  GARLAudienceMessage as DMGARLAudienceMessage,
  GARLDestination as DMGARLDestination,
  GARLRouterRequest as DMGARLRouterRequest,
} from './dataManager/types';

function extraKeysPresent(dictionary: Record<string, unknown>, keyList: string[]) {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in dictionary) {
    if (!keyList.includes(key)) {
      return true;
    }
  }
  return false;
}

// Google Ads caps userIdentifiers at 20 per UserData (i.e. per operation/user).
const MAX_IDENTIFIERS_PER_OPERATION = 20;

/**
 * This function helps to create one operation per user.
 * Logics: Here for add/remove type lists, we create one create/remove operation per user so
 * identifiers from different users are never mixed into the same UserData. If a single user
 * has more than 20 identifiers, that user's identifiers are split across multiple operations
 * to respect Google's per-UserData limit.
 * @param {rudder event message} message
 * @param {rudder event destination} destination
 * @returns
 */
const createPayload = (message: Message, destination: GARLDestination, workspaceId: string) => {
  const { listData } = message.properties;
  const properties = ['add', 'remove'];
  const { typeOfList, userSchema, isHashRequired } = destination.Config;

  let outputPayloads: Partial<Record<'create' | 'remove', OfflineDataJobPayload>> = {};
  const typeOfOperation = Object.keys(listData);
  typeOfOperation.forEach((key) => {
    if (properties.includes(key)) {
      // one inner array of identifiers per user
      const userIdentifiersByUser = populateIdentifiers(
        listData[key],
        typeOfList,
        userSchema,
        isHashRequired,
        workspaceId,
        destination.ID,
      );
      if (userIdentifiersByUser.length === 0) {
        logger.info(
          `Google_adwords_remarketing_list]:: No attributes are present in the '${key}' property.`,
        );
        return;
      }

      const outputPayload = constructPayload(
        message,
        offlineDataJobsMapping,
      ) as OfflineDataJobPayload;
      outputPayload.operations = [];
      const operationType = key === 'add' ? 'create' : 'remove';
      // one operation per user; a user exceeding the limit is split across operations
      userIdentifiersByUser.forEach((userIdentifiers) => {
        returnArrayOfSubarrays(userIdentifiers, MAX_IDENTIFIERS_PER_OPERATION).forEach((chunk) => {
          outputPayload.operations.push({ [operationType]: { userIdentifiers: chunk } });
        });
      });
      outputPayloads = { ...outputPayloads, [operationType]: outputPayload };
    } else {
      logger.info(`listData "${key}" is not valid. Supported types are "add" and "remove"`);
    }
  });

  return outputPayloads;
};

const processEvent = async (metadata: Metadata, message: Message, destination: GARLDestination) => {
  const response: unknown[] = [];
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  if (!message.properties) {
    throw new InstrumentationError('Message properties is not present. Aborting message.');
  }
  if (!message.properties.listData) {
    throw new InstrumentationError('listData is not present inside properties. Aborting message.');
  }
  if (message.type.toLowerCase() === 'audiencelist') {
    const createdPayload = createPayload(message, destination, metadata.workspaceId);

    if (Object.keys(createdPayload).length === 0) {
      throw new InstrumentationError(
        "Neither 'add' nor 'remove' property is present inside 'listData' or there are no attributes inside 'add' or 'remove' properties matching with the schema fields. Aborting message.",
      );
    }

    const accessToken = getAccessToken(metadata, 'access_token');

    Object.values(createdPayload).forEach((data) => {
      const consentObj = populateConsentFromConfig(destination.Config, consentConfigMap);
      const { audienceId } = destination.Config;
      response.push(
        responseBuilder(
          accessToken,
          data,
          destination,
          getOperationAudienceId(audienceId, message),
          consentObj,
        ),
      );
    });
    return response;
  }

  throw new InstrumentationError(`Message Type ${message.type} not supported.`);
};

const process = async (event: {
  metadata: Metadata;
  message: Message;
  destination: GARLDestination;
}) => {
  const { metadata, message, destination } = event;
  const accessToken = getAccessToken(metadata, 'access_token');

  if (await isDataManagerAPIEnabled(metadata.workspaceId, metadata.destinationId, accessToken)) {
    return dataManagerTransformAudienceListEvent({
      metadata,
      message: message as unknown as DMGARLAudienceMessage,
      destination: destination as unknown as DMGARLDestination,
    });
  }

  return processEvent(metadata, message, destination);
};

const processRouterDest = async (inputs: { message: Message }[], reqMetadata: unknown) => {
  const { workspaceId, destinationId } = (inputs[0] as unknown as RecordInput).metadata;
  const accessToken = getAccessToken(
    (inputs[0] as unknown as RecordInput).metadata,
    'access_token',
  );

  if (await isDataManagerAPIEnabled(workspaceId, destinationId, accessToken)) {
    return dataManagerProcessRouterDest(inputs as unknown as DMGARLRouterRequest[], reqMetadata);
  }

  const respList: unknown[] = [];
  const groupedInputs = await groupByInBatches(inputs, (input) =>
    input.message.type?.toLowerCase(),
  );
  let transformedRecordEvent: unknown[] = [];
  let transformedAudienceEvent: unknown[] = [];

  const eventTypes = ['record', 'audiencelist'];
  if (extraKeysPresent(groupedInputs, eventTypes)) {
    throw new ConfigurationError('unsupported events present in the event');
  }

  if (groupedInputs.record) {
    transformedRecordEvent = await processRecordInputs(
      groupedInputs.record as unknown as RecordInput[],
    );
  }

  if (groupedInputs.audiencelist) {
    transformedAudienceEvent = await simpleProcessRouterDest(
      groupedInputs.audiencelist,
      process,
      reqMetadata,
      undefined,
    );
  }

  respList.push(...transformedRecordEvent, ...transformedAudienceEvent);
  return respList;
};

export { process, processRouterDest };
