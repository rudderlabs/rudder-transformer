const { isNil, isObject } = require('lodash');
const fetch = require('node-fetch');
const ivm = require('isolated-vm');
const logger = require('../../logger');
const stats = require('../stats');
const { fetchWithDnsWrapper, extractStackTraceUptoLastSubstringMatch } = require('../utils');

/**
 * Context reset utilities for cached IVM isolates
 * Ensures clean state between executions while reusing the isolate
 */

/**
 * Inject fresh APIs into the jail for a new execution
 * @param {Object} jail The context jail
 * @param {Object} cachedIsolate The cached isolate
 * @param {Object} credentials Fresh credentials
 * @param {boolean} testMode Test mode flag
 * @param {Array} logs Fresh logs array
 */
async function injectFreshApis(jail, cachedIsolate, credentials, testMode, logs) {
  const trTags = {
    identifier: 'V1',
    transformationId: cachedIsolate.transformationId,
    workspaceId: cachedIsolate.workspaceId,
  };

  const GEOLOCATION_TIMEOUT_IN_MS = parseInt(process.env.GEOLOCATION_TIMEOUT_IN_MS || '1000', 10);

  // Re-inject _ivm module
  await jail.set('_ivm', ivm);

  // Re-inject _fetch
  await jail.set(
    '_fetch',
    new ivm.Reference(async (resolve, ...args) => {
      const fetchStartTime = new Date();
      const fetchTags = { ...trTags };
      try {
        const res = await fetchWithDnsWrapper(trTags, ...args);
        const data = await res.json();
        fetchTags.isSuccess = 'true';
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy(data).copyInto()]);
      } catch (error) {
        logger.debug('Error fetching data', error);
        fetchTags.isSuccess = 'false';
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy('ERROR').copyInto()]);
      } finally {
        stats.timing('fetch_call_duration', fetchStartTime, fetchTags);
      }
    }),
  );

  // Re-inject _fetchV2
  await jail.set(
    '_fetchV2',
    new ivm.Reference(async (resolve, reject, ...args) => {
      const fetchStartTime = new Date();
      const fetchTags = { ...trTags };
      try {
        const res = await fetchWithDnsWrapper(fetchTags, ...args);
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
        } catch (e) {
          logger.debug('Error parsing JSON', e);
        }
        fetchTags.isSuccess = 'true';
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy(data).copyInto()]);
      } catch (error) {
        const err = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
        logger.debug('Error fetching data in fetchV2', err);
        fetchTags.isSuccess = 'false';
        reject.applyIgnored(undefined, [new ivm.ExternalCopy(err).copyInto()]);
      } finally {
        stats.timing('fetchV2_call_duration', fetchStartTime, fetchTags);
      }
    }),
  );

  // Re-inject _geolocation
  await jail.set(
    '_geolocation',
    new ivm.Reference(async (resolve, reject, ...args) => {
      const geoStartTime = new Date();
      const geoTags = { ...trTags };
      try {
        if (args.length === 0) {
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
        geoTags.isSuccess = 'true';
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy(geoData).copyInto()]);
      } catch (error) {
        const err = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
        geoTags.isSuccess = 'false';
        reject.applyIgnored(undefined, [new ivm.ExternalCopy(err).copyInto()]);
      } finally {
        stats.timing('geo_call_duration', geoStartTime, geoTags);
      }
    }),
  );

  // Re-inject _getCredential with fresh credentials
  await jail.set('_getCredential', (key) => {
    if (isNil(credentials) || !isObject(credentials)) {
      logger.error(
        `Error fetching credentials map for transformationID: ${cachedIsolate.transformationId} and workspaceId: ${cachedIsolate.workspaceId}`,
      );
      stats.increment('credential_error_total', trTags);
      return undefined;
    }
    if (key === null || key === undefined) {
      throw new TypeError('Key should be valid and defined');
    }
    return credentials[key];
  });

  // Re-inject log function with fresh logs array
  await jail.set('log', (...args) => {
    if (testMode) {
      let logString = 'Log:';
      args.forEach((arg) => {
        logString = logString.concat(` ${typeof arg === 'object' ? JSON.stringify(arg) : arg}`);
      });
      logs.push(logString);
    }
  });

  // Re-inject extractStackTrace
  await jail.set('extractStackTrace', (trace, stringLiterals) =>
    extractStackTraceUptoLastSubstringMatch(trace, stringLiterals),
  );
}

/**
 * Reset the context of a cached isolate for fresh execution
 * @param {Object} cachedIsolate The cached isolate object
 * @param {Object} credentials Fresh credentials for this execution
 * @param {boolean} testMode Whether running in test mode
 * @returns {Object} Reset isolate ready for execution
 */
async function resetContext(cachedIsolate, credentials = {}, testMode = false) {
  if (!cachedIsolate?.isolate) {
    throw new Error('Invalid cached isolate provided for context reset');
  }

  try {
    // Create a new context for this execution
    const newContext = await cachedIsolate.isolate.createContext();
    const jail = newContext.global;

    // Set up global object properly
    await jail.set('global', jail.derefInto());

    // Fresh logs array for this execution
    const logs = [];

    // Re-inject the required APIs with fresh state
    await injectFreshApis(jail, cachedIsolate, credentials, testMode, logs);

    // Set up bootstrap script in the new context
    const bootstrapScriptResult = await cachedIsolate.bootstrap.run(newContext);

    // Re-instantiate the user's custom script module in the new context
    await cachedIsolate.customScriptModule.instantiate(newContext, async (spec) => {
      if (cachedIsolate.compiledModules[spec]) {
        return cachedIsolate.compiledModules[spec].module;
      }
      throw new Error(`import from ${spec} failed. Module not found.`);
    });

    // Re-evaluate the custom script module
    await cachedIsolate.customScriptModule.evaluate();

    // Get fresh function reference
    const fnRef = await cachedIsolate.customScriptModule.namespace.get('transformWrapper', {
      reference: true,
    });

    // Clean up the old context
    if (cachedIsolate.context) {
      try {
        cachedIsolate.context.release();
      } catch (error) {
        logger.warn('Error releasing old context during reset', { error: error.message });
      }
    }

    // Create reset isolate with new context
    const resetIsolate = {
      ...cachedIsolate,
      context: newContext,
      jail,
      bootstrapScriptResult,
      fnRef,
      logs, // Fresh logs array
      isolateStartWallTime: cachedIsolate.isolate.wallTime,
      isolateStartCPUTime: cachedIsolate.isolate.cpuTime,
    };

    logger.debug('IVM context reset completed', {
      transformationId: cachedIsolate.transformationId,
    });

    return resetIsolate;
  } catch (error) {
    logger.error('Error during context reset', {
      error: error.message,
      transformationId: cachedIsolate.transformationId,
    });
    throw error;
  }
}

/**
 * Check if an isolate needs context reset
 * @returns {boolean} True if reset is needed
 */
function needsContextReset() {
  // For isolate strategy, we always reset context to ensure clean state
  return true;
}

module.exports = {
  resetContext,
  needsContextReset,
};
