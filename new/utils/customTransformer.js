const ivm = require('isolated-vm');
const fetch = require('node-fetch');
const NodeCache = require('node-cache');

// Cache for storing transformation code with a TTL of 24 hours
const transformationCache = new NodeCache({ stdTTL: 60 * 60 * 24 * 1 });

// Config backend URL for fetching transformations
const CONFIG_BACKEND_URL = process.env.CONFIG_BACKEND_URL || 'https://api.rudderlabs.com';
const getTransformationURL = `${CONFIG_BACKEND_URL}/transformation/getByVersionId`;

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

// Helper function to handle response status
const responseStatusHandler = (status, entity, id, url) => {
  if (status >= 500) {
    throw new RetryRequestError(`Error occurred while fetching ${entity} :: ${id}`);
  } else if (status !== 200) {
    throw new RespStatusError(`${entity} not found at ${url}`, status);
  }
};

// Memory limit for the isolate VM
const ISOLATE_VM_MEMORY = parseInt(process.env.ISOLATE_VM_MEMORY || '128', 10);
const GEOLOCATION_TIMEOUT_IN_MS = parseInt(process.env.GEOLOCATION_TIMEOUT_IN_MS || '1000', 10);

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
  testMode = false
) {
  // Create a new isolate
  const isolate = new ivm.Isolate({ memoryLimit: ISOLATE_VM_MEMORY });
  const context = await isolate.createContext();
  const logs = [];
  const jail = context.global;

  // Make the global object available in the context
  await jail.set('global', jail.derefInto());

  // Transfer the ivm module to the new isolate
  await jail.set('_ivm', ivm);

  // Set up fetch in the isolate
  await jail.set(
    '_fetch',
    new ivm.Reference(async (resolve, ...args) => {
      try {
        const fetchStartTime = new Date();
        const res = await fetch(...args);
        const data = await res.json();
        console.log(`Fetch call completed in ${new Date() - fetchStartTime}ms`);
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy(data).copyInto()]);
      } catch (error) {
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy('ERROR').copyInto()]);
      }
    })
  );

  // Set up fetchV2 in the isolate (with more detailed response)
  await jail.set(
    '_fetchV2',
    new ivm.Reference(async (resolve, reject, ...args) => {
      try {
        const fetchStartTime = new Date();
        const res = await fetch(...args);
        const headersContent = {};
        res.headers.forEach((value, header) => {
          headersContent[header] = value;
        });
        const data = {
          url: res.url,
          status: res.status,
          headers: headersContent,
          body: await res.text(),
        };

        try {
          data.body = JSON.parse(data.body);
        } catch (e) {}

        console.log(`FetchV2 call completed in ${new Date() - fetchStartTime}ms`);
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy(data).copyInto()]);
      } catch (error) {
        const err = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
        reject.applyIgnored(undefined, [new ivm.ExternalCopy(err).copyInto()]);
      }
    })
  );

  // Set up geolocation in the isolate
  await jail.set(
    '_geolocation',
    new ivm.Reference(async (resolve, reject, ...args) => {
      try {
        const geoStartTime = new Date();
        if (args.length < 1) {
          throw new Error('ip address is required');
        }
        if (!process.env.GEOLOCATION_URL) throw new Error('geolocation is not available right now');

        const res = await fetch(`${process.env.GEOLOCATION_URL}/geoip/${args[0]}`, {
          timeout: GEOLOCATION_TIMEOUT_IN_MS,
        });
        if (res.status !== 200) {
          throw new Error(`request to fetch geolocation failed with status code: ${res.status}`);
        }
        const geoData = await res.json();
        console.log(`Geolocation call completed in ${new Date() - geoStartTime}ms`);
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy(geoData).copyInto()]);
      } catch (error) {
        const err = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
        reject.applyIgnored(undefined, [new ivm.ExternalCopy(err).copyInto()]);
      }
    })
  );

  // Set up secrets in the isolate
  await jail.set('_rsSecrets', function (...args) {
    if (args.length == 0 || !secrets || !secrets[args[0]]) return 'ERROR';
    return secrets[args[0]];
  });

  // Set up logging in the isolate
  jail.setSync('log', function (...args) {
    if (testMode) {
      let logString = 'Log:';
      args.forEach((arg) => {
        logString = logString.concat(` ${typeof arg === 'object' ? JSON.stringify(arg) : arg}`);
      });
      logs.push(logString);
    }
  });

  // Set up metadata in the isolate
  jail.setSync('metadata', function (...args) {
    const eventMetadata = eventsMetadata[args[0].messageId] || {};
    return new ivm.ExternalCopy(eventMetadata).copyInto();
  });

  // Bootstrap script to set up the environment in the isolate
  const bootstrap = await isolate.compileScript(`
    new function() {
      // Grab a reference to the ivm module and delete it from global scope
      let ivm = _ivm;
      delete _ivm;

      // Set up fetch in the global scope
      let fetch = _fetch;
      delete _fetch;
      global.fetch = function(...args) {
        return new Promise(resolve => {
          fetch.applyIgnored(undefined, [
            new ivm.Reference(resolve),
            ...args.map(arg => new ivm.ExternalCopy(arg).copyInto())
          ]);
        });
      };

      // Set up fetchV2 in the global scope
      let fetchV2 = _fetchV2;
      delete _fetchV2;
      global.fetchV2 = function(...args) {
        return new Promise((resolve, reject) => {
          fetchV2.applyIgnored(undefined, [
            new ivm.Reference(resolve),
            new ivm.Reference(reject),
            ...args.map(arg => new ivm.ExternalCopy(arg).copyInto())
          ]);
        });
      };

      // Set up geolocation in the global scope
      let geolocation = _geolocation;
      delete _geolocation;
      global.geolocation = function(...args) {
        return new Promise((resolve, reject) => {
          geolocation.applyIgnored(undefined, [
            new ivm.Reference(resolve),
            new ivm.Reference(reject),
            ...args.map(arg => new ivm.ExternalCopy(arg).copyInto())
          ]);
        });
      };

      // Set up rsSecrets in the global scope
      let rsSecrets = _rsSecrets;
      delete _rsSecrets;
      global.rsSecrets = function(...args) {
        return rsSecrets([
          ...args.map(arg => new ivm.ExternalCopy(arg).copyInto())
        ]);
      };

      // Return a function to run the user's code
      return new ivm.Reference(function forwardMainPromise(
        fnRef,
        resolve,
        events
      ) {
        const derefMainFunc = fnRef.deref();
        Promise.resolve(derefMainFunc(events))
          .then(value => {
            resolve.applyIgnored(undefined, [
              new ivm.ExternalCopy(value).copyInto()
            ]);
          })
          .catch(error => {
            resolve.applyIgnored(undefined, [
              new ivm.ExternalCopy(error.message).copyInto()
            ]);
          });
      });
    }
  `);

  // Run the bootstrap script
  const bootstrapScriptResult = await bootstrap.run(context);

  // Compile and run the user's code
  const customScript = await isolate.compileScript(`${code}`);
  await customScript.run(context);
  const fnRef = await jail.get('transform', { reference: true });

  // Execute the user's code
  const executionPromise = new Promise(async (resolve, reject) => {
    const sharedMessagesList = new ivm.ExternalCopy(events).copyInto({
      transferIn: true,
    });
    try {
      await bootstrapScriptResult.apply(undefined, [
        fnRef,
        new ivm.Reference(resolve),
        sharedMessagesList,
      ]);
    } catch (error) {
      reject(error.message);
    }
  });

  let result;
  let transformationError;
  const invokeTime = new Date();

  try {
    // Set a timeout for the execution
    const timeoutPromise = new Promise((resolve) => {
      const wait = setTimeout(() => {
        clearTimeout(wait);
        resolve('Timedout');
      }, 4000);
    });

    result = await Promise.race([executionPromise, timeoutPromise]);
    if (result === 'Timedout') {
      throw new Error('Timed out');
    }
  } catch (error) {
    transformationError = error;
    throw error;
  } finally {
    // Release resources
    fnRef.release();
    customScript.release();
    bootstrapScriptResult.release();
    context.release();
    isolate.dispose();

    console.log(`User transform function completed in ${new Date() - invokeTime}ms`);
    console.log(`User transform function input events: ${events.length}`);
  }

  return {
    transformedEvents: result,
    logs,
  };
}

/**
 * Function to get transformation code from CONFIG_BACKEND_URL
 * Caches the transformation code by versionId
 */
async function getTransformationCode(versionId) {
  console.log(`Getting transformation code for version ${versionId}`);

  // Check if the transformation is in the cache
  const cachedTransformation = transformationCache.get(versionId);
  if (cachedTransformation) {
    console.log(`Using cached transformation for version ${versionId}`);
    return cachedTransformation;
  }

  try {
    // Fetch the transformation from CONFIG_BACKEND_URL
    const url = `${getTransformationURL}?versionId=${versionId}`;
    console.log(`Fetching transformation from ${url}`);

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
  testMode = false
) {
  if (versionId) {
    const res = testMode ? trRevCode : await getTransformationCode(versionId);
    if (res) {
      // Extract messages from events
      const eventMessages = events.map((event) => event.message);
      const eventsMetadata = {};
      events.forEach((ev) => {
        eventsMetadata[ev.message.messageId] = ev.metadata;
      });

      console.log("Code:", testMode, res)

      // Run the transformation
      const result = await runUserTransform(
        eventMessages,
        res.code,
        res.secrets || {},
        eventsMetadata,
        res.id,
        res.workspaceId,
        testMode
      );

      // Process the result
      const userTransformedEvents = testMode
        ? result
        : result.transformedEvents.map((ev) => ({
            transformedEvent: ev,
            metadata: {},
          }));

      return userTransformedEvents;
    }
  }

  // If no transformation is applied, return the original events
  return events;
}

module.exports = {
  userTransformHandler,
  runUserTransform,
  getTransformationCode,
  CONFIG_BACKEND_URL
};
