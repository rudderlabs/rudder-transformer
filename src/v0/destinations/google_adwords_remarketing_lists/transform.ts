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

function extraKeysPresent(dictionary: Record<string, unknown>, keyList: string[]) {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in dictionary) {
    if (!keyList.includes(key)) {
      return true;
    }
  }
  return false;
}

/**
 * This function helps to create different operations by breaking the
 * userIdentiFier Array in chunks of 20.
 * Logics: Here for add/remove type lists, we are creating create/remove operations by
 * breaking the userIdentiFier array in chunks of 20 and putting them inside one
 * create/remove object each chunk.
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
      const userIdentifiersList = populateIdentifiers(
        listData[key],
        typeOfList,
        userSchema,
        isHashRequired,
        workspaceId,
        destination.ID,
      );
      if (userIdentifiersList.length === 0) {
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
      // breaking the userIdentiFier array in chunks of 20
      const userIdentifierChunks: Record<string, unknown>[][] = returnArrayOfSubarrays(
        userIdentifiersList,
        20,
      );
      // putting each chunk in different create/remove operations
      switch (key) {
        case 'add':
          // for add operation
          userIdentifierChunks.forEach((element) => {
            const operations = {
              create: { userIdentifiers: element },
            };
            outputPayload.operations.push(operations);
          });
          outputPayloads = { ...outputPayloads, create: outputPayload };
          break;
        case 'remove':
          // for remove operation
          userIdentifierChunks.forEach((element) => {
            const operations = {
              remove: { userIdentifiers: element },
            };
            outputPayload.operations.push(operations);
          });
          outputPayloads = { ...outputPayloads, remove: outputPayload };
          break;
        default:
      }
    } else {
      logger.info(`listData "${key}" is not valid. Supported types are "add" and "remove"`);
    }
  });

  return outputPayloads;
};

const processEvent = async (
  metadata: { workspaceId: string },
  message: Message,
  destination: GARLDestination,
) => {
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
  metadata: { workspaceId: string; [key: string]: unknown };
  message: Message;
  destination: GARLDestination;
}) => processEvent(event.metadata, event.message, event.destination);

const processRouterDest = async (inputs: { message: Message }[], reqMetadata: unknown) => {
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
