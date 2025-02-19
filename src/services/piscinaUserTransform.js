const _ = require('lodash');

const v0util = require('../v0/util');
const routerUtils = require('../routerUtils');

const utils = require('../util/utils');
const logger = require('../logger');
// import stats from '../util/stats';

module.exports = async ({ events }) => {
  let retryStatus = 200;

  const transformedEvents = [];
  let librariesVersionIDs = [];
  if (events[0].libraries) {
    librariesVersionIDs = events[0].libraries.map((library) => library.VersionID);
  }

  const eventsToProcess = events;
  const transformationVersionId = eventsToProcess[0]?.destination?.Transformations[0]?.VersionID;
  const messageIds = [];
  const messageIdMetadataMap = {};
  eventsToProcess.forEach((ev) => {
    messageIds.push(ev.metadata?.messageId);
    messageIdMetadataMap[ev.metadata?.messageId] = ev.metadata;
  });

  const messageIdsInOutputSet = new Set();

  const workspaceId = eventsToProcess[0]?.metadata.workspaceId;
  const commonMetadata = {
    sourceId: eventsToProcess[0]?.metadata?.sourceId,
    destinationId: eventsToProcess[0]?.metadata.destinationId,
    destinationType: eventsToProcess[0]?.metadata.destinationType,
    workspaceId,
    transformationId: eventsToProcess[0]?.metadata.transformationId,
    messageIds,
  };

  // const metaTags =
  //   eventsToProcess.length > 0 && eventsToProcess[0].metadata
  //     ? getMetadata(eventsToProcess[0].metadata)
  //     : {};
  const transformationTags = v0util.getTransformationMetadata(eventsToProcess[0]?.metadata);

  if (!transformationVersionId) {
    const errorMessage = 'Transformation VersionID not found';
    logger.error(`[CT] ${errorMessage}`);
    transformedEvents.push({
      statusCode: 400,
      error: errorMessage,
      metadata: commonMetadata,
    });
    return transformedEvents;
  }
  // stats.counter('user_transform_input_events', events.length, { workspaceId });
  logger.info('user_transform_input_events', {
    inCount: events.length,
    ...transformationTags,
  });
  // const userFuncStartTime = new Date();
  try {
    const destTransformedEvents = await routerUtils.userTransformHandler()(
      eventsToProcess,
      transformationVersionId,
      librariesVersionIDs,
    );

    const transformedEventsWithMetadata = [];
    destTransformedEvents.forEach((ev) => {
      // add messageId to output set
      if (ev.metadata?.messageId) {
        messageIdsInOutputSet.add(ev.metadata.messageId);
      } else if (ev.metadata?.messageIds) {
        ev.metadata.messageIds.forEach((id) => messageIdsInOutputSet.add(id));
      }
      if (ev.error) {
        transformedEventsWithMetadata.push({
          statusCode: 400,
          error: ev.error,
          metadata: _.isEmpty(ev.metadata) ? commonMetadata : ev.metadata,
        });
        return;
      }
      if (!v0util.isNonFuncObject(ev.transformedEvent)) {
        transformedEventsWithMetadata.push({
          statusCode: 400,
          error: `returned event in events from user transformation is not an object. transformationVersionId:${transformationVersionId} and returned event: ${JSON.stringify(
            ev.transformedEvent,
          )}`,
          metadata: _.isEmpty(ev.metadata) ? commonMetadata : ev.metadata,
        });
        return;
      }
      transformedEventsWithMetadata.push({
        output: ev.transformedEvent,
        metadata: _.isEmpty(ev.metadata)
          ? commonMetadata
          : Object.assign({}, ...ev.metadata, process.env.WORKER_ID),
        statusCode: 200,
      });
    });

    transformedEvents.push(...transformedEventsWithMetadata);
  } catch (error) {
    logger.error(error);
    let status = 400;
    const errorString = error.toString();
    if (error instanceof utils.RetryRequestError) {
      // entire request needs to be retried i.e. request to transformer needs be retried
      retryStatus = error.statusCode;
    }
    if (error instanceof utils.RespStatusError) {
      status = error.statusCode;
    }
    transformedEvents.push(
      ...eventsToProcess.map((e) => ({
        statusCode: status,
        metadata: e.metadata,
        error: errorString,
      })),
    );
    // stats.counter('user_transform_errors', eventsToProcess.length, {
    //   status,
    //   ...metaTags,
    //   ...transformationTags,
    // });
  } finally {
    // stats.timingSummary('user_transform_request_latency_summary', userFuncStartTime, {
    //   ...metaTags,
    //   ...transformationTags,
    // });
  }

  // stats.counter('user_transform_requests', 1, {});

  // stats.counter('user_transform_output_events', transformedEvents.length, {
  //   workspaceId,
  // });

  logger.info('user_transform_output_events', {
    outCount: transformedEvents.length,
    ...transformationTags,
  });

  return {
    transformedEvents,
    retryStatus,
  };
};
