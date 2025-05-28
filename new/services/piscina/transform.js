const { userTransformHandler } = require('../../utils/customTransformer');

/**
 * Worker function that will run in the worker thread
 * @param {Object} options - Options for transformation
 * @param {string} options.body - Request body containing the events to transform
 * @param {Object} options.features - Feature flags
 * @param {number} options.requestSize - Request size
 * @returns {Promise<Object>} - Transformed events and retry status
 */
async function transform({ body, features = {}, requestSize = 0 }) {
  let retryStatus = 200;

  try {
    // Group events by destination and source IDs
    const eventsMetadata = {};
    const events = JSON.parse(body);
    events.forEach((ev) => {
      eventsMetadata[ev.message.messageId] = ev.metadata;
    });

    const transformedEvents = [];
    const transformationVersionId = events[0]?.destination?.Transformations[0]?.VersionID;

    try {
      const commonMetadata = {}; // TODO

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
      transformedEvents, // Could we potentially stringify this and return it without cloning?
      retryStatus,
    };
  } catch (error) {
    console.error('Error in worker thread:', error);
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

module.exports = transform;