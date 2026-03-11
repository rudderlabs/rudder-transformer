/* eslint-disable no-const-assign */
import lodash from 'lodash';
import {
  InstrumentationError,
  ConfigurationError,
  groupByInBatches,
  forEachInBatches,
} from '@rudderstack/integrations-lib';
import type { Metadata } from '../../../types';
import type {
  FbCustomAudienceDestination,
  FbCustomAudiencePayload,
  PrepareParams,
  WrappedResponse,
  RecordPrepareConfig,
  FbRecordEvent,
} from './types';
import { schemaFields, MAX_USER_COUNT } from './config';
import {
  getDestinationExternalIDInfoForRetl,
  checkSubsetOfArray,
  returnArrayOfSubarrays,
  getSuccessRespEvents,
  getErrorRespEvents,
  generateErrorObject,
  isEventSentByVDMV2Flow,
  isEventSentByVDMV1Flow,
  isDefinedAndNotNullAndNotEmpty,
} from '../../util';
import { getErrorResponse, createFinalResponse } from '../../util/recordUtils';
import {
  ensureApplicableFormat,
  getUpdatedDataElement,
  getSchemaForEventMappedToDest,
  batchingWithPayloadSize,
  responseBuilderSimple,
  getDataSource,
  generateAppSecretProof,
} from './util';

/**
 * Processes a single record and updates the data element.
 * @param {Object} record - The record to process.
 * @param {Array} userSchema - The schema defining user properties.
 * @param {boolean} isHashRequired - Whether hashing is required.
 * @param {boolean} disableFormat - Whether formatting is disabled.
 * @returns {Object} - The processed data element and metadata.
 */
const processRecord = (
  record: FbRecordEvent,
  userSchema: string[],
  isHashRequired: boolean,
  disableFormat: boolean | undefined,
  workspaceId: string,
  destinationId: string,
): { metadata: Metadata; error?: string; dataElement?: unknown[] } => {
  const fields = record.message.fields!;
  let dataElement: unknown[] = [];
  let nullUserData = true;

  userSchema.forEach((eachProperty) => {
    const userProperty = fields[eachProperty];
    let updatedProperty: unknown = userProperty;

    if (isHashRequired && !disableFormat) {
      updatedProperty = ensureApplicableFormat(
        eachProperty,
        userProperty,
        workspaceId,
        destinationId,
      );
    }

    dataElement = getUpdatedDataElement(
      dataElement,
      isHashRequired,
      eachProperty,
      updatedProperty,
      record.metadata.workspaceId,
      record.destination.ID,
    );

    if (dataElement[dataElement.length - 1]) {
      nullUserData = false;
    }
  });

  if (nullUserData) {
    return {
      error: `All user properties [${userSchema.join(', ')}] are invalid or null. At least one valid field is required.`,
      metadata: record.metadata,
    };
  }

  return { dataElement, metadata: record.metadata };
};

/**
 * Processes an array of record chunks and prepares the payload for sending.
 * @param {Array} recordChunksArray - The array of record chunks.
 * @param {Object} config - Configuration object containing userSchema, isHashRequired, disableFormat, etc.
 * @param {Object} destination - The destination configuration.
 * @param {string} operation - The operation to perform (e.g., 'add', 'remove').
 * @param {string} audienceId - The audience ID.
 * @returns {Array} - The response events to send.
 */
const processRecordEventArray = async (
  recordChunksArray: FbRecordEvent[][],
  config: RecordPrepareConfig,
  destination: FbCustomAudienceDestination,
  operation: string,
  audienceId: string,
) => {
  const { userSchema, isHashRequired, disableFormat, paramsPayload, prepareParams } = config;
  const toSendEvents: unknown[] = [];
  const metadata: Metadata[] = [];
  const invalidEvents: unknown[] = [];

  await forEachInBatches(recordChunksArray, async (recordArray) => {
    const data: unknown[][] = [];
    await forEachInBatches(recordArray, async (input) => {
      const result = processRecord(
        input,
        userSchema,
        isHashRequired,
        disableFormat,
        input.metadata.workspaceId,
        destination.ID,
      );
      if (result.error) {
        const error = new InstrumentationError(result.error);
        const errorObj = generateErrorObject(error);
        invalidEvents.push(
          getErrorRespEvents(
            [result.metadata],
            errorObj.status,
            errorObj.message,
            errorObj.statTags,
          ),
        );
      } else {
        data.push(result.dataElement!);
        metadata.push(result.metadata);
      }
    });

    if (data.length === 0) {
      return;
    }

    const prepareFinalPayload = lodash.cloneDeep(paramsPayload);
    prepareFinalPayload.schema = userSchema;
    prepareFinalPayload.data = data;
    const workspaceId = recordChunksArray[0]?.[0]?.metadata?.workspaceId;
    const payloadBatches = batchingWithPayloadSize(prepareFinalPayload, workspaceId);

    payloadBatches.forEach((payloadBatch) => {
      const response = {
        ...prepareParams,
        payload: payloadBatch,
      };

      const wrappedResponse: WrappedResponse = {
        responseField: response,
        operationCategory: operation,
      };

      const builtResponse = responseBuilderSimple(wrappedResponse, audienceId);
      toSendEvents.push(builtResponse);
    });
  });

  const successResponse =
    toSendEvents.length > 0
      ? getSuccessRespEvents(toSendEvents, metadata, destination, true)
      : null;

  return { successResponse, invalidEvents };
};

/**
 * Prepares the payload for the given events and configuration.
 * @param {Array} events - The events to process.
 * @param {Object} config - The configuration object.
 * @returns {Array} - The final response payload.
 */
async function preparePayload(
  events: FbRecordEvent[],
  config: {
    audienceId: string | null | undefined;
    userSchema: string[];
    isRaw?: boolean;
    type?: string;
    subType?: string;
    isHashRequired: boolean;
    disableFormat?: boolean;
    isValueBasedAudience?: boolean;
  },
) {
  const {
    audienceId,
    userSchema,
    isRaw,
    type,
    subType,
    isHashRequired,
    disableFormat,
    isValueBasedAudience,
  } = config;
  const { destination } = events[0];
  const { accessToken, appSecret } = destination.Config;
  const prepareParams: PrepareParams = {
    access_token: accessToken,
  };

  if (isDefinedAndNotNullAndNotEmpty(appSecret)) {
    const dateNow = Date.now();
    prepareParams.appsecret_time = Math.floor(dateNow / 1000); // Get current Unix time in seconds
    prepareParams.appsecret_proof = generateAppSecretProof(accessToken, appSecret!, dateNow);
  }

  const cleanUserSchema = userSchema.map((field) => field.trim());

  if (!isDefinedAndNotNullAndNotEmpty(audienceId)) {
    throw new ConfigurationError('Audience ID is a mandatory field');
  }
  if (!checkSubsetOfArray(schemaFields, cleanUserSchema)) {
    throw new ConfigurationError('One or more of the schema fields are not supported');
  }
  if (!isValueBasedAudience && cleanUserSchema.includes('LOOKALIKE_VALUE')) {
    throw new ConfigurationError(
      'LOOKALIKE_VALUE field can only be used for Value-Based Custom Audiences.',
    );
  }

  const paramsPayload: FbCustomAudiencePayload = {};

  if (isRaw) {
    paramsPayload.is_raw = isRaw;
  }

  const dataSource = getDataSource(type, subType);
  if (Object.keys(dataSource).length > 0) {
    paramsPayload.data_source = dataSource;
  }

  const groupedRecordsByAction = await groupByInBatches(events, (record) =>
    (record.message.action ?? '').toLowerCase(),
  );

  const processAction = async (action: string, operation: string) => {
    if (groupedRecordsByAction[action]) {
      if (
        isValueBasedAudience &&
        !cleanUserSchema.includes('LOOKALIKE_VALUE') &&
        operation === 'add'
      ) {
        throw new ConfigurationError(
          'LOOKALIKE_VALUE field is required for Value-Based Custom Audiences.',
        );
      }
      const recordChunksArray = returnArrayOfSubarrays(
        groupedRecordsByAction[action],
        MAX_USER_COUNT,
      );
      return processRecordEventArray(
        recordChunksArray,
        {
          userSchema: cleanUserSchema,
          isHashRequired,
          disableFormat,
          paramsPayload,
          prepareParams,
        },
        destination,
        operation,
        audienceId!,
      );
    }
    return null;
  };

  const deleteResponse = await processAction('delete', 'remove');
  const insertResponse = await processAction('insert', 'add');
  const updateResponse = await processAction('update', 'add');

  const errorResponse = [
    ...getErrorResponse(groupedRecordsByAction),
    ...(deleteResponse?.invalidEvents || []),
    ...(insertResponse?.invalidEvents || []),
    ...(updateResponse?.invalidEvents || []),
  ];

  const finalResponse = createFinalResponse(
    deleteResponse?.successResponse,
    insertResponse?.successResponse,
    updateResponse?.successResponse,
    errorResponse,
  );

  if (finalResponse.length === 0) {
    throw new InstrumentationError(
      'Missing valid parameters, unable to generate transformed payload',
    );
  }
  return finalResponse;
}

/**
 * Processes record inputs for V1 flow.
 * @param {Array} groupedRecordInputs - The grouped record inputs.
 * @returns {Array} - The processed payload.
 */
async function processRecordInputsV1(groupedRecordInputs: FbRecordEvent[]) {
  const { destination } = groupedRecordInputs[0];
  const { message } = groupedRecordInputs[0];
  const { isHashRequired, disableFormat, type, subType, isRaw, audienceId, userSchema } =
    destination.Config;

  let operationAudienceId: string | null = audienceId;
  let updatedUserSchema = userSchema as string[];
  if (isEventSentByVDMV1Flow(groupedRecordInputs[0])) {
    const { objectType } = getDestinationExternalIDInfoForRetl(message, 'FB_CUSTOM_AUDIENCE');
    operationAudienceId = objectType;
    updatedUserSchema = getSchemaForEventMappedToDest(message);
  }

  return preparePayload(groupedRecordInputs, {
    audienceId: operationAudienceId,
    userSchema: updatedUserSchema,
    isRaw,
    type,
    subType,
    isHashRequired,
    disableFormat,
  });
}

/**
 * Processes record inputs for V2 flow.
 * @param {Array} groupedRecordInputs - The grouped record inputs.
 * @returns {Array} - The processed payload.
 */
const processRecordInputsV2 = async (groupedRecordInputs: FbRecordEvent[]) => {
  const { connection, message } = groupedRecordInputs[0];
  const { isHashRequired, disableFormat, type, subType, isRaw, audienceId, isValueBasedAudience } =
    connection!.config.destination;
  const identifiers = message?.identifiers;
  let userSchema: string[] | undefined;
  if (identifiers) {
    userSchema = Object.keys(identifiers);
  }
  const events: FbRecordEvent[] = groupedRecordInputs.map((record) => ({
    ...record,
    message: {
      ...record.message,
      fields: record.message.identifiers,
    },
  }));
  return preparePayload(events, {
    audienceId,
    userSchema: userSchema!,
    isRaw,
    type,
    subType,
    isHashRequired,
    disableFormat,
    isValueBasedAudience,
  });
};

/**
 * Processes record inputs based on the flow type.
 * @param {Array} groupedRecordInputs - The grouped record inputs.
 * @returns {Array} - The processed payload.
 */
async function processRecordInputs(groupedRecordInputs: FbRecordEvent[]) {
  const event = groupedRecordInputs[0];
  // First check for rETL flow and second check for ES flow
  if (isEventSentByVDMV1Flow(event) || !isEventSentByVDMV2Flow(event)) {
    return processRecordInputsV1(groupedRecordInputs);
  }
  return processRecordInputsV2(groupedRecordInputs);
}

export { processRecordInputs };
