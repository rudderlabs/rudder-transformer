import groupBy from "lodash/groupBy";
import isEmpty from "lodash/isEmpty";
import { userTransformHandler } from "../../routerUtils";
import {
  Library,
  ProcessorRequest,
  ProcessorResponse,
  UserTransformResponse,
  UserTransfromServiceResponse
} from "../../types/index";
import { RespStatusError, RetryRequestError } from "../../util/utils";
import { getMetadata, isNonFuncObject } from "../../v0/util";
import logger from "../../logger";

export default class UserTransformService {
  public static async transformRoutine(
    events: ProcessorRequest[]
  ): Promise<UserTransfromServiceResponse> {
    let retryStatus = 200;
    const groupedEvents: Object = groupBy(
      events,
      (event: ProcessorRequest) =>
        `${event.metadata.destinationId}_${event.metadata.sourceId}`
    );
    const transformedEvents = [];
    let librariesVersionIDs = [];
    if (events[0].libraries) {
      librariesVersionIDs = events[0].libraries.map(
        (library: Library) => library.VersionID
      );
    }
    const responses = await Promise.all<any>(
      Object.entries(groupedEvents).map(async ([dest, destEvents]) => {
        logger.debug(`dest: ${dest}`);
        const eventsToProcess = destEvents as ProcessorRequest[];
        const transformationVersionId =
          eventsToProcess[0]?.destination?.Transformations[0]?.VersionID;
        const messageIds = eventsToProcess.map(ev => {
          return ev.metadata?.messageId;
        });

        const commonMetadata = {
          sourceId: eventsToProcess[0]?.metadata?.sourceId,
          destinationId: eventsToProcess[0]?.metadata.destinationId,
          destinationType: eventsToProcess[0]?.metadata.destinationType,
          messageIds
        };

        const metaTags =
          eventsToProcess.length && eventsToProcess[0].metadata
            ? getMetadata(eventsToProcess[0].metadata)
            : {};
            
        if (!transformationVersionId) {
          const errorMessage = "Transformation VersionID not found";
          logger.error(`[CT] ${errorMessage}`);
          transformedEvents.push({
            statusCode: 400,
            error: errorMessage,
            metadata: commonMetadata
          } as ProcessorResponse);
          return transformedEvents;
        }

        try {
          const destTransformedEvents: UserTransformResponse[] = await userTransformHandler()(
            eventsToProcess,
            transformationVersionId,
            librariesVersionIDs
          );
          transformedEvents.push(
            ...destTransformedEvents.map(ev => {
              if (ev.error) {
                return {
                  statusCode: 400,
                  error: ev.error,
                  metadata: isEmpty(ev.metadata) ? commonMetadata : ev.metadata
                } as ProcessorResponse;
              }
              if (!isNonFuncObject(ev.transformedEvent)) {
                return {
                  statusCode: 400,
                  error: `returned event in events from user transformation is not an object. transformationVersionId:${transformationVersionId} and returned event: ${JSON.stringify(
                    ev.transformedEvent
                  )}`,
                  metadata: isEmpty(ev.metadata) ? commonMetadata : ev.metadata
                } as ProcessorResponse;
              }
              return {
                output: ev.transformedEvent,
                metadata: isEmpty(ev.metadata) ? commonMetadata : ev.metadata,
                statusCode: 200
              } as ProcessorResponse;
            })
          );
          return transformedEvents;
        } catch (error) {
          logger.error(error);
          let status = 400;
          const errorString = error.toString();
          if (error instanceof RetryRequestError) {
            // entire request needs to be retried
            // i.e the request to transformer needs
            // be retried
            retryStatus = error.statusCode;
          }
          if (error instanceof RespStatusError) {
            status = error.statusCode;
          }
          transformedEvents.push(
            ...eventsToProcess.map(e => {
              return {
                statusCode: status,
                metadata: e.metadata,
                error: errorString
              } as ProcessorResponse;
            })
          );
          return transformedEvents;
        } finally {
          //stats
        }
      })
    );

    const flattenedResponses: ProcessorResponse[] = responses.flat();
    return {
      transformedEvents: flattenedResponses,
      retryStatus
    } as UserTransfromServiceResponse;
  }

  public static async testTransformRoutine(events, trRevCode, libraryVersionIDs) {
    let response;
    try {
      if (!trRevCode || !trRevCode.code || !trRevCode.codeVersion) {
        throw new Error(
          "Invalid Request. Missing parameters in transformation code block"
        );
      }
      if (!events || events.length === 0) {
        throw new Error("Invalid request. Missing events");
      }

      logger.debug(`[CT] Test Input Events: ${JSON.stringify(events)}`);
      trRevCode.versionId = "testVersionId";
      response.body = await userTransformHandler()(
        events,
        trRevCode.versionId,
        libraryVersionIDs,
        trRevCode,
        true
      );
      logger.debug(
        `[CT] Test Output Events: ${JSON.stringify(
          response.body.transformedEvents
        )}`
      );
      response.status = 200;
    } catch (error) {
      response.status = 400;
      response.body = { error: error.message };
    }
    return response;
  }
}
