import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import { userTransformHandler } from '../routerUtils';
import {
  UserTransformationLibrary,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  UserTransformationResponse,
  UserTransformationServiceResponse,
} from '../types/index';
import { RespStatusError, RetryRequestError, extractStackTraceUptoLastSubstringMatch } from '../util/utils';
import { getMetadata, isNonFuncObject } from '../v0/util';
import { SUPPORTED_FUNC_NAMES } from '../util/ivmFactory';
import logger from '../logger';
import stats from '../util/stats';

export default class UserTransformService {
  public static async transformRoutine(
    events: ProcessorTransformationRequest[],
  ): Promise<UserTransformationServiceResponse> {

    const startTime = new Date();
    let retryStatus = 200;
    const groupedEvents: Object = groupBy(
      events,
      (event: ProcessorTransformationRequest) =>
        `${event.metadata.destinationId}_${event.metadata.sourceId}`,
    );
    stats.counter('user_transform_function_group_size', Object.entries(groupedEvents).length, {});
    stats.histogram('user_transform_input_events', events.length, {});

    const transformedEvents: any[] = [];
    let librariesVersionIDs: any[] = [];
    if (events[0].libraries) {
      librariesVersionIDs = events[0].libraries.map(
        (library: UserTransformationLibrary) => library.VersionID,
      );
    }
    const responses = await Promise.all<any>(
      Object.entries(groupedEvents).map(async ([dest, destEvents]) => {
        logger.debug(`dest: ${dest}`);
        const eventsToProcess = destEvents as ProcessorTransformationRequest[];
        const transformationVersionId =
          eventsToProcess[0]?.destination?.Transformations[0]?.VersionID;
        const messageIds = eventsToProcess.map((ev) => ev.metadata?.messageId);

        const commonMetadata = {
          sourceId: eventsToProcess[0]?.metadata?.sourceId,
          destinationId: eventsToProcess[0]?.metadata.destinationId,
          destinationType: eventsToProcess[0]?.metadata.destinationType,
          messageIds,
        };

        const metaTags =
          eventsToProcess.length > 0 && eventsToProcess[0].metadata
            ? getMetadata(eventsToProcess[0].metadata)
            : {};

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
        const userFuncStartTime = new Date();
        try {
          stats.counter('user_transform_function_input_events', eventsToProcess.length, {
            ...metaTags,
          });
          const destTransformedEvents: UserTransformationResponse[] = await userTransformHandler()(
            eventsToProcess,
            transformationVersionId,
            librariesVersionIDs,
          );
          transformedEvents.push(
            ...destTransformedEvents.map((ev) => {
              if (ev.error) {
                return {
                  statusCode: 400,
                  error: ev.error,
                  metadata: isEmpty(ev.metadata) ? commonMetadata : ev.metadata,
                } as ProcessorTransformationResponse;
              }
              if (!isNonFuncObject(ev.transformedEvent)) {
                return {
                  statusCode: 400,
                  error: `returned event in events from user transformation is not an object. transformationVersionId:${transformationVersionId} and returned event: ${JSON.stringify(
                    ev.transformedEvent,
                  )}`,
                  metadata: isEmpty(ev.metadata) ? commonMetadata : ev.metadata,
                } as ProcessorTransformationResponse;
              }
              return {
                output: ev.transformedEvent,
                metadata: isEmpty(ev.metadata) ? commonMetadata : ev.metadata,
                statusCode: 200,
              } as ProcessorTransformationResponse;
            }),
          );
        } catch (error: any) {
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
                } as ProcessorTransformationResponse),
            ),
          );
          stats.counter('user_transform_errors', eventsToProcess.length, {
            transformationId: eventsToProcess[0]?.metadata?.transformationId,
            workspaceId: eventsToProcess[0]?.metadata?.workspaceId,
            status,
            ...metaTags,
          });
        } finally {
          stats.timing('user_transform_request_latency', userFuncStartTime, {
            workspaceId: eventsToProcess[0]?.metadata?.workspaceId,
            transformationId: eventsToProcess[0]?.metadata?.transformationId,
            ...metaTags,
          });
        }

        stats.counter('user_transform_requests', 1, {});
        stats.histogram('user_transform_output_events', transformedEvents.length, {});
        return transformedEvents;
      }),
    );

    const flattenedResponses: ProcessorTransformationResponse[] = responses.flat();
    return {
      transformedEvents: flattenedResponses,
      retryStatus,
    } as UserTransformationServiceResponse;
  }

  public static async testTransformRoutine(events, trRevCode, libraryVersionIDs) {
    const response: any = {};
    try {
      if (!trRevCode || !trRevCode.code || !trRevCode.codeVersion) {
        throw new Error('Invalid Request. Missing parameters in transformation code block');
      }
      if (!events || events.length === 0) {
        throw new Error('Invalid request. Missing events');
      }

      logger.debug(`[CT] Test Input Events: ${JSON.stringify(events)}`);
      trRevCode.versionId = 'testVersionId';
      response.body = await userTransformHandler()(
        events,
        trRevCode.versionId,
        libraryVersionIDs,
        trRevCode,
        true,
      );
      logger.debug(`[CT] Test Output Events: ${JSON.stringify(response.body.transformedEvents)}`);
      response.status = 200;
    } catch (error: any) {
      response.status = 400;
      response.body = { error: extractStackTraceUptoLastSubstringMatch(error.stack, SUPPORTED_FUNC_NAMES) };
    }
    return response;
  }
}
