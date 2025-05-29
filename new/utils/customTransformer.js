const NodeCache = require('node-cache');
const { createIvm, IVM_CACHE, SHARE_ISOLATE } = require('./ivmFactory');

// Cache for storing transformation code with a TTL of 24 hours
const transformationCache = new NodeCache({ stdTTL: 60 * 60 * 24 * 1 });

// Config backend URL for fetching transformations
const CONFIG_BACKEND_URL = process.env.CONFIG_BACKEND_URL || 'https://api.rudderlabs.com';
const getTransformationURL = `${CONFIG_BACKEND_URL}/transformation/getByVersionId`;

/**
 * Run user transformation code in an isolated VM
 */
async function runUserTransform(
  events,
  code,
  secrets,
  eventsMetadata,
  transformationId,
  workspaceId,
  testMode = false,
  libraryVersionIDs = [],
  credentials = {},
) {
  // Create or retrieve a TransformationIsolate instance
  const transformationIsolate = await createIvm(
    transformationId,
    code,
    secrets,
    eventsMetadata,
    workspaceId,
    libraryVersionIDs,
    credentials,
  );
  if (SHARE_ISOLATE) {
    // TODO fix this won't work!!!
    await transformationIsolate.Build(code, secrets, eventsMetadata, transformationId, workspaceId, libraryVersionIDs, credentials);
  }

  // Execute the user's code
  const transformationPayload = {};
  transformationPayload.events = events;
  transformationPayload.transformationType = transformationIsolate.GetTransformationType();

  // Transform the events
  try {
    const { result, logs } = await transformationIsolate.Transform(transformationPayload);
    return {
      transformedEvents: result,
      logs,
    };
  } catch (error) {
    console.error(`Transformation error ${error}`);
  } finally {
    if (!IVM_CACHE) {
      await transformationIsolate.Release();
    }
  }
}

/**
 * Function to get transformation code from CONFIG_BACKEND_URL
 * Caches the transformation code by versionId
 */
async function getTransformationCode(versionId) {
  // Check if the transformation is in the cache
  const cachedTransformation = transformationCache.get(versionId);
  if (cachedTransformation) {
    return cachedTransformation;
  }

  try {
    // Fetch the transformation from CONFIG_BACKEND_URL
    const url = `${getTransformationURL}?versionId=${versionId}`;

    // Use fetch with proxy if HTTPS_PROXY is set
    let fetchOptions = {};
    if (process.env.HTTPS_PROXY) {
      const HttpsProxyAgent = require('https-proxy-agent');
      fetchOptions.agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
    }

    const response = await fetch(url, fetchOptions);

    // Handle response status
    responseStatusHandler(response.status, 'Transformation', versionId, url);

    // Parse the response
    const transformation = await response.json();

    // Cache the transformation
    transformationCache.set(versionId, transformation);

    return transformation;
  } catch (error) {
    console.error(`Error fetching transformation code for versionId: ${versionId}`, error.message);
    throw error;
  }
}

/**
 * Handler for user transformations
 */
async function userTransformHandler(
  events,
  versionId,
  libraryVersionIDs,
  trRevCode = {},
  testMode = false,
  credentials = {},
) {
  if (versionId) {
    const res = testMode ? trRevCode : await getTransformationCode(versionId);
    if (res) {
      // Extract messages from events
      const eventsMetadata = {};
      events.forEach((ev) => {
        eventsMetadata[ev.message.messageId] = ev.metadata;
      });

      // Extract credentials from events
      const credentialsMap = {};
      (events[0]?.credentials || []).forEach((cred) => {
        credentialsMap[cred.key] = cred.value;
      });

      try {
        // Run the transformation
        const result = await runUserTransform(
          events,
          res.code,
          res.secrets || {},
          eventsMetadata,
          res.id,
          res.workspaceId,
          testMode,
          libraryVersionIDs,
          credentialsMap,
        );

        // Process the result
        return testMode
          ? result
          : result.transformedEvents.map((ev) => ({
              output: ev.transformedEvent,
              metadata: ev.metadata || eventsMetadata[ev.transformedEvent?.messageId] || {},
              statusCode: 200,
            }));
      } catch (error) {
        // Enhanced error handling with stack trace
        console.error(`Error in userTransformHandler: ${error.message}`);
        if (error.stack) {
          console.error(`Stack trace: ${error.stack}`);
        }
        // Rethrow the error with enhanced information
        throw error;
      }
    }
  }

  // If no transformation is applied, return the original events
  return events;
}

// Error classes for handling response status
class RespStatusError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 400;
  }
}

class RetryRequestError extends RespStatusError {
  constructor(message) {
    // chosen random unique status code 809 to mark requests that needs to be retried
    super(message, 809);
  }
}

// TODO this function is duplicated with transformationIsolate.js
// Helper function to handle response status
function responseStatusHandler(status, entity, id, url) {
  if (status >= 500) {
    throw new RetryRequestError(`Error occurred while fetching ${entity} :: ${id}`);
  } else if (status !== 200) {
    throw new RespStatusError(`${entity} not found at ${url}`, status);
  }
}

module.exports = {
  userTransformHandler,
  CONFIG_BACKEND_URL,
};
