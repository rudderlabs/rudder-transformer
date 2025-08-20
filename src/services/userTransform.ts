import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import { isNil } from 'lodash';
import { generateUUID } from '@rudderstack/integrations-lib';
import { userTransformHandler } from '../routerUtils';
import {
  UserTransformationLibrary,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  UserTransformationResponse,
  UserTransformationServiceResponse,
  MessageIdMetadataMap,
  FixMe,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CatchErr,
} from '../types';
import {
  RespStatusError,
  RetryRequestError,
  extractStackTraceUptoLastSubstringMatch,
} from '../util/utils';
import { getMetadata, getTransformationMetadata, isNonFuncObject } from '../v0/util';
import { SUPPORTED_FUNC_NAMES } from '../util/ivmFactory';
import logger from '../logger';
import stats from '../util/stats';
import { CommonUtils } from '../util/common';
import { FeatureFlags, FEATURE_FILTER_CODE } from '../middlewares/featureFlag';
import { HTTP_CUSTOM_STATUS_CODES } from '../constants';

export class UserTransformService {
  public static async transformRoutine(
    events: ProcessorTransformationRequest[],
    features: FeatureFlags = {},
    requestSize = 0,
  ): Promise<UserTransformationServiceResponse> {
    let retryStatus = 200;
    const groupedEvents: NonNullable<unknown> = groupBy(
      events,
      (event: ProcessorTransformationRequest) =>
        `${event.metadata.destinationId}_${event.metadata.sourceId}`,
    );
    stats.counter('user_transform_function_group_size', Object.entries(groupedEvents).length, {});

    const transformedEvents: FixMe[] = [];
    let librariesVersionIDs: FixMe[] = [];
    if (events[0].libraries) {
      librariesVersionIDs = events[0].libraries.map(
        (library: UserTransformationLibrary) => library.VersionID,
      );
    }
    const responses = await Promise.all<FixMe>(
      Object.entries(groupedEvents).map(async ([, destEvents]) => {
        const eventsToProcess = destEvents as ProcessorTransformationRequest[];
        const transformationVersionId =
          eventsToProcess[0]?.destination?.Transformations[0]?.VersionID;
        const messageIds: string[] = [];
        const messageIdsSet = new Set<string>();
        const messageIdMetadataMap: MessageIdMetadataMap = {};
        eventsToProcess.forEach((ev) => {
          messageIds.push(ev.metadata?.messageId);
          messageIdsSet.add(ev.metadata?.messageId);
          messageIdMetadataMap[ev.metadata?.messageId] = ev.metadata;
        });

        const messageIdsInOutputSet = new Set<string>();

        const workspaceId = eventsToProcess[0]?.metadata.workspaceId;
        const commonMetadata = {
          sourceId: eventsToProcess[0]?.metadata?.sourceId,
          destinationId: eventsToProcess[0]?.metadata.destinationId,
          destinationType: eventsToProcess[0]?.metadata.destinationType,
          workspaceId,
          transformationId: eventsToProcess[0]?.metadata.transformationId,
          messageIds,
        };

        const generateNewMetadata = (response: UserTransformationResponse) => ({
          ...eventsToProcess[0]?.metadata,
          messageId: generateUUID(),
          eventName: response.transformedEvent.event,
          eventType: response.transformedEvent.type,
        });

        const metaTags =
          eventsToProcess.length > 0 && eventsToProcess[0].metadata
            ? getMetadata(eventsToProcess[0].metadata)
            : {};
        const transformationTags = getTransformationMetadata(eventsToProcess[0]?.metadata);

        if (!transformationVersionId) {
          const errorMessage = 'Transformation VersionID not found';
          logger.error(`[CT] ${errorMessage}`);
          transformedEvents.push({
            statusCode: 400,
            error: errorMessage,
            metadata: commonMetadata,
          } as ProcessorTransformationResponse);
          return transformedEvents;
        }
        stats.counter('user_transform_input_events', events.length, { workspaceId });
        logger.info('user_transform_input_events', {
          inCount: events.length,
          ...transformationTags,
        });
        const userFuncStartTime = new Date();
        try {
          const destTransformedEvents: UserTransformationResponse[] = await userTransformHandler()(
            eventsToProcess,
            transformationVersionId,
            librariesVersionIDs,
          );

          const transformedEventsWithMetadata: ProcessorTransformationResponse[] = [];
          destTransformedEvents.forEach((ev) => {
            // add messageId to output set
            if (ev.metadata?.messageId) {
              messageIdsInOutputSet.add(ev.metadata.messageId);
            } else if (ev.metadata?.messageIds) {
              ev.metadata.messageIds.forEach((id) => messageIdsInOutputSet.add(id));
            } else if (ev.error) {
              commonMetadata.messageIds.forEach((id) => messageIdsInOutputSet.add(id));
            }
            if (ev.error) {
              transformedEventsWithMetadata.push({
                statusCode: 400,
                error: ev.error,
                metadata: isEmpty(ev.metadata) ? commonMetadata : ev.metadata,
              } as unknown as ProcessorTransformationResponse);
              return;
            }
            if (!isNonFuncObject(ev.transformedEvent)) {
              transformedEventsWithMetadata.push({
                statusCode: 400,
                error: `returned event in events from user transformation is not an object. transformationVersionId:${transformationVersionId} and returned event: ${JSON.stringify(
                  ev.transformedEvent,
                )}`,
                metadata: isEmpty(ev.metadata) ? commonMetadata : ev.metadata,
              } as ProcessorTransformationResponse);
              return;
            }
            transformedEventsWithMetadata.push({
              output: ev.transformedEvent,
              metadata:
                isEmpty(ev.metadata) || !ev.metadata.messageId
                  ? generateNewMetadata(ev)
                  : ev.metadata,
              statusCode: 200,
            } as ProcessorTransformationResponse);
          });

          if (features[FEATURE_FILTER_CODE]) {
            // find difference between input and output messageIds
            const messageIdsNotInOutput = CommonUtils.setDiff(messageIdsSet, messageIdsInOutputSet);
            const droppedEvents = messageIdsNotInOutput.map((id) => ({
              statusCode: HTTP_CUSTOM_STATUS_CODES.FILTERED,
              metadata: {
                ...(isEmpty(messageIdMetadataMap[id]) ? commonMetadata : messageIdMetadataMap[id]),
                messageId: id,
                messageIds: null,
              },
            }));
            transformedEvents.push(...droppedEvents);
          }

          transformedEvents.push(...transformedEventsWithMetadata);
        } catch (error: CatchErr) {
          logger.error(error);
          let status = 400;
          const errorString = error.toString();
          if (error instanceof RetryRequestError) {
            // entire request needs to be retried i.e. request to transformer needs be retried
            retryStatus = error.statusCode;
          }
          if (error instanceof RespStatusError) {
            status = error.statusCode;
          }
          transformedEvents.push(
            ...eventsToProcess.map(
              (e) =>
                ({
                  statusCode: status,
                  metadata: e.metadata,
                  error: errorString,
                }) as ProcessorTransformationResponse,
            ),
          );
          stats.counter('user_transform_errors', eventsToProcess.length, {
            status,
            ...metaTags,
            ...transformationTags,
          });
        } finally {
          stats.timingSummary('user_transform_request_latency_summary', userFuncStartTime, {
            ...metaTags,
            ...transformationTags,
          });

          stats.summary('user_transform_batch_size_summary', requestSize, {
            ...metaTags,
            ...transformationTags,
          });
        }

        stats.counter('user_transform_requests', 1, {});
        stats.counter('user_transform_output_events', transformedEvents.length, {
          workspaceId,
        });
        logger.info('user_transform_output_events', {
          outCount: transformedEvents.length,
          ...transformationTags,
        });
        return transformedEvents;
      }),
    );

    const flattenedResponses: ProcessorTransformationResponse[] = responses.flat();
    return {
      transformedEvents: flattenedResponses,
      retryStatus,
    } as UserTransformationServiceResponse;
  }

  public static async testTransformRoutine(events, trRevCode, libraryVersionIDs, credentials) {
    const response: FixMe = {};
    let errorCode: number | undefined;
    try {
      if (!trRevCode || !trRevCode.code || !trRevCode.codeVersion) {
        throw new Error('Invalid Request. Missing parameters in transformation code block');
      }
      if (!events || events.length === 0) {
        throw new Error('Invalid request. Missing events');
      }

      const updatedEvents = events.map((ev) => {
        if (isNil(ev.credentials)) {
          return {
            ...ev,
            credentials,
          };
        }
        return ev;
      });

      logger.debug(`[CT] Test Input Events: ${JSON.stringify(events)}`);
      // eslint-disable-next-line no-param-reassign
      trRevCode.versionId = 'testVersionId';
      response.body = await userTransformHandler()(
        updatedEvents,
        trRevCode.versionId,
        libraryVersionIDs,
        trRevCode,
        true,
      );
      logger.debug(`[CT] Test Output Events: ${JSON.stringify(response.body.transformedEvents)}`);
      response.status = 200;
    } catch (error: CatchErr) {
      response.status = 400;
      response.body = {
        error: extractStackTraceUptoLastSubstringMatch(error.stack, SUPPORTED_FUNC_NAMES),
      };
      errorCode = error.statusCode;
    } finally {
      const metaTags = getTransformationMetadata(events[0]?.metadata);
      stats.counter('user_transform_test_count_total', events.length, {
        status: errorCode || response.status,
        ...metaTags,
      });
    }
    return response;
  }
}
