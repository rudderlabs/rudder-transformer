import lodash from 'lodash';
import {
  InstrumentationError,
  ConfigurationError,
  groupByInBatches,
} from '@rudderstack/integrations-lib';
import {
  checkSubsetOfArray,
  isDefinedAndNotNullAndNotEmpty,
  returnArrayOfSubarrays,
  flattenMap,
  simpleProcessRouterDest,
  getValueFromMessage,
} from '../../util';
import {
  prepareDataField,
  batchingWithPayloadSize,
  generateAppSecretProof,
  responseBuilderSimple,
  getDataSource,
} from './util';
import { schemaFields, USER_ADD, USER_DELETE, MAX_USER_COUNT } from './config';
import { processRecordInputs } from './recordTransform';
import logger from '../../../logger';
import type {
  FbCustomAudienceDestination,
  FbCustomAudiencePayload,
  FbCustomAudienceRequestParams,
  WrappedResponse,
  FbRecordEvent,
  PrepareParams,
} from './types';
import type { RudderMessage } from '../../../types';

function checkForUnsupportedEventTypes(
  dictionary: Record<string, unknown>,
  keyList: string[],
): string[] {
  const unsupportedEventTypes: string[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key in dictionary) {
    if (!keyList.includes(key)) {
      unsupportedEventTypes.push(key);
    }
  }
  return unsupportedEventTypes;
}

// Function responsible prepare the payload field of every event parameter
const preparePayload = (
  userUpdateList: Record<string, unknown>[],
  userSchema: string | string[],
  paramsPayload: FbCustomAudiencePayload,
  isHashRequired: boolean,
  disableFormat: boolean,
  destinationId: string,
): FbCustomAudiencePayload[] => {
  const prepareFinalPayload = lodash.cloneDeep(paramsPayload);
  if (Array.isArray(userSchema)) {
    prepareFinalPayload.schema = userSchema;
  } else {
    prepareFinalPayload.schema = [userSchema];
  }

  prepareFinalPayload.data = prepareDataField(
    userSchema as string[],
    userUpdateList,
    isHashRequired,
    disableFormat,
    destinationId,
  );
  return batchingWithPayloadSize(prepareFinalPayload);
};

// Function responsible for building the parameters for each event calls

const prepareResponse = (
  message: RudderMessage,
  destination: FbCustomAudienceDestination,
  allowedAudienceArray: Record<string, unknown>[],
  userSchema: string[],
  isHashRequired = true,
): FbCustomAudienceRequestParams[] => {
  const { accessToken, disableFormat, type, subType, isRaw, appSecret } = destination.Config;

  const prepareParams: PrepareParams = {
    access_token: accessToken,
  };
  // creating the parameters field
  const paramsPayload: FbCustomAudiencePayload = {};

  if (isDefinedAndNotNullAndNotEmpty(appSecret)) {
    const dateNow = Date.now();
    prepareParams.appsecret_time = Math.floor(dateNow / 1000); // Get current Unix time in seconds
    prepareParams.appsecret_proof = generateAppSecretProof(accessToken, appSecret!, dateNow);
  }

  // creating the payload field for parameters
  if (isRaw) {
    paramsPayload.is_raw = isRaw;
  }
  // creating the data_source block

  const dataSource = getDataSource(type, subType);
  if (Object.keys(dataSource).length > 0) {
    paramsPayload.data_source = dataSource;
  }
  const payloadBatches = preparePayload(
    allowedAudienceArray,
    userSchema,
    paramsPayload,
    isHashRequired,
    disableFormat!,
    destination.ID,
  );

  const respList: FbCustomAudienceRequestParams[] = [];
  payloadBatches.forEach((payloadBatch) => {
    const response: FbCustomAudienceRequestParams = {
      ...prepareParams,
      payload: payloadBatch,
    };
    respList.push(response);
  });
  return respList;
};

/**
 * Prepare to send events array
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const prepareToSendEvents = (
  message: RudderMessage,
  destination: FbCustomAudienceDestination,
  audienceChunksArray: Record<string, unknown>[][],
  userSchema: string[],
  isHashRequired: boolean,
  operation: string,
): WrappedResponse[] => {
  const toSendEvents: WrappedResponse[] = [];
  audienceChunksArray.forEach((allowedAudienceArray) => {
    const responseArray = prepareResponse(
      message,
      destination,
      allowedAudienceArray,
      userSchema,
      isHashRequired,
    );
    responseArray.forEach((response) => {
      const wrappedResponse: WrappedResponse = {
        responseField: response,
        operationCategory: operation,
      };
      toSendEvents.push(wrappedResponse);
    });
  });
  return toSendEvents;
};

const processEvent = (message: RudderMessage, destination: FbCustomAudienceDestination) => {
  const respList: unknown[] = [];
  let toSendEvents: WrappedResponse[] = [];
  let { userSchema } = destination.Config;
  const { isHashRequired, audienceId } = destination.Config;
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }

  if (message.type.toLowerCase() !== 'audiencelist') {
    throw new InstrumentationError(` ${message.type} call is not supported `);
  }

  if (!isDefinedAndNotNullAndNotEmpty(audienceId)) {
    throw new ConfigurationError('Audience ID is a mandatory field');
  }

  // When one single schema field is added in the webapp, it does not appear to be an array
  if (!Array.isArray(userSchema)) {
    userSchema = [userSchema];
  }

  // when configured schema field is different from the allowed fields
  if (!checkSubsetOfArray(schemaFields, userSchema)) {
    throw new ConfigurationError('One or more of the schema fields are not supported');
  }
  const properties = getValueFromMessage(message, 'properties');
  const listData = properties?.listData;

  // when "remove" is present in the payload
  if (isDefinedAndNotNullAndNotEmpty(listData[USER_DELETE])) {
    const audienceChunksArray = returnArrayOfSubarrays(listData[USER_DELETE], MAX_USER_COUNT);
    toSendEvents = prepareToSendEvents(
      message,
      destination,
      audienceChunksArray,
      userSchema,
      isHashRequired,
      USER_DELETE,
    );
  }

  // When "add" is present in the payload
  if (isDefinedAndNotNullAndNotEmpty(listData[USER_ADD])) {
    const audienceChunksArray = returnArrayOfSubarrays(listData[USER_ADD], MAX_USER_COUNT);
    toSendEvents.push(
      ...prepareToSendEvents(
        message,
        destination,
        audienceChunksArray,
        userSchema,
        isHashRequired,
        USER_ADD,
      ),
    );
  }

  toSendEvents.forEach((sendEvent) => {
    respList.push(responseBuilderSimple(sendEvent, audienceId));
  });
  // When userListAdd or userListDelete is absent or both passed as empty arrays
  if (respList.length === 0) {
    throw new InstrumentationError(
      'Missing valid parameters, unable to generate transformed payload',
    );
  }
  return respList;
};

const process = (event: { message: RudderMessage; destination: FbCustomAudienceDestination }) =>
  processEvent(event.message, event.destination);

const processRouterDest = async (inputs: FbRecordEvent[], reqMetadata: unknown) => {
  const respList: unknown[] = [];
  const groupedInputs = await groupByInBatches(inputs, (input) =>
    (input.message.type ?? '').toLowerCase(),
  );
  let transformedRecordEvent: unknown[] = [];
  let transformedAudienceEvent: unknown[] = [];

  const eventTypes = ['record', 'audiencelist'];
  const unsupportedEventList = checkForUnsupportedEventTypes(groupedInputs, eventTypes);
  if (unsupportedEventList.length > 0) {
    logger.info(`unsupported events found ${unsupportedEventList}`);
    throw new ConfigurationError('unsupported events present in the event');
  }

  if (groupedInputs.record) {
    transformedRecordEvent = await processRecordInputs(groupedInputs.record);
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
  return flattenMap(respList);
};

export { process, processRouterDest };
