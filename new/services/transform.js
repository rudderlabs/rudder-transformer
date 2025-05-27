const { userTransformHandler } = require('../utils/customTransformer');

/**
 * Service function to transform events
 * Parses the raw body and calls the userTransformHandler function
 */
async function transformRoutine(body, features = {}, requestSize = 0) {
  let retryStatus = 200;

  try {
    // Parse the JSON in the main thread
    const events = JSON.parse(body); // TODO check JSON parsing here if we can do better

    // Group events by destination and source IDs
    const eventsMetadata = {};
    events.forEach((ev) => {
      eventsMetadata[ev.message.messageId] = ev.metadata;
    });

    const transformedEvents = [];
    const transformationVersionId = events[0]?.destination?.Transformations[0]?.VersionID;

    // Process each group of events
    // await Promise.all(
    // Object.entries(groupedEvents).map(async ([, destEvents]) => {
    //   const eventsToProcess = destEvents;
    //   const transformationVersionId =
    //     eventsToProcess[0]?.destination?.Transformations[0]?.VersionID;
    //
    //   const messageIds = [];
    //   const messageIdsSet = new Set();
    //   const messageIdMetadataMap = {};
    //
    //   eventsToProcess.forEach((ev) => {
    //     messageIds.push(ev.metadata?.messageId);
    //     messageIdsSet.add(ev.metadata?.messageId);
    //     messageIdMetadataMap[ev.metadata?.messageId] = ev.metadata;
    //   });
    //
    //   const workspaceId = eventsToProcess[0]?.metadata.workspaceId;
    //   const commonMetadata = {
    //     sourceId: eventsToProcess[0]?.metadata?.sourceId,
    //     destinationId: eventsToProcess[0]?.metadata.destinationId,
    //     destinationType: eventsToProcess[0]?.metadata.destinationType,
    //     workspaceId,
    //     transformationId: eventsToProcess[0]?.metadata.transformationId,
    //     messageIds,
    //   };
    //
    //   if (!transformationVersionId) {
    //     const errorMessage = 'Transformation VersionID not found';
    //     console.error(`[CT] ${errorMessage}`);
    //     transformedEvents.push({
    //       statusCode: 400,
    //       error: errorMessage,
    //       metadata: commonMetadata,
    //     });
    //     return;
    //   }

    try {
      const commonMetadata = {} // TODO

      // Get libraries version IDs if available
      let librariesVersionIDs = [];
      if (events[0].libraries) {
        librariesVersionIDs = events[0].libraries.map((library) => library.VersionID);
      }

      // Call userTransformHandler to transform the events
      const destTransformedEvents = await userTransformHandler(
        events,
        transformationVersionId,
        librariesVersionIDs,
      );

      // Process the transformed events
      destTransformedEvents.forEach((ev) => {
        if (ev.error) {
          transformedEvents.push({
            statusCode: 400,
            error: ev.error,
            metadata: isEmpty(ev.metadata) ? commonMetadata : ev.metadata,
          });
          return;
        }

        if (!isNonFuncObject(ev.output)) {
          transformedEvents.push({
            statusCode: 400,
            error: `returned event in events from user transformation is not an object. transformationVersionId:${transformationVersionId} and returned event: ${JSON.stringify(
              ev.output,
            )}`,
            metadata: isEmpty(ev.metadata) ? commonMetadata : ev.metadata,
          });
          return;
        }

        transformedEvents.push(ev);
      });
    } catch (error) {
      console.error(error);
      let status = 400;
      const errorString = error.toString();

      if (error.statusCode) {
        // If the error has a status code, use it for retry status
        retryStatus = error.statusCode;
      }

      transformedEvents.push(
        ...events.map((e) => ({
          statusCode: status,
          metadata: e.metadata,
          error: errorString,
        })),
      );
    }

    return {
      transformedEvents,
      retryStatus,
    };
  } catch (error) {
    console.error('Error in transformRoutine:', error);
    throw error;
  }
}

// Helper functions
function isEmpty(obj) {
  return !obj || Object.keys(obj).length === 0;
}

function isNonFuncObject(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

module.exports = {
  transformRoutine,
};
