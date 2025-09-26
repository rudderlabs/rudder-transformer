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
 */
async function injectFreshApis(jail, cachedIsolate, credentials) {
  const trTags = {
    identifier: 'V1',
    transformationId: cachedIsolate.transformationId,
    workspaceId: cachedIsolate.workspaceId,
  };

  const GEOLOCATION_TIMEOUT_IN_MS = parseInt(process.env.GEOLOCATION_TIMEOUT_IN_MS || '1000', 10);

  await jail.set('_ivm', ivm);

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

  await jail.set('extractStackTrace', (trace, stringLiterals) =>
    extractStackTraceUptoLastSubstringMatch(trace, stringLiterals),
  );
}

/**
 * Reset the context of a cached isolate for fresh execution
 * @param {Object} cachedIsolate The cached isolate object
 * @param {Object} credentials Fresh credentials for this execution
 * @returns {Object} Cached isolate with reset context ready for execution
 */
async function createNewContext(cachedIsolate, credentials = {}) {
  if (!cachedIsolate?.isolate) {
    throw new Error('Invalid cached isolate provided for context reset');
  }

  try {
    // Create a new context for this execution
    const newContext = await cachedIsolate.isolate.createContext();
    const jail = newContext.global;

    // Set up global object properly
    await jail.set('global', jail.derefInto());

    // Re-inject the required APIs with fresh state
    await injectFreshApis(jail, cachedIsolate, credentials);

    // Set up bootstrap script in the new context
    const newBootstrapScriptResult = await cachedIsolate.bootstrap.run(newContext);

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

    // Create cached isolate with reset context
    const cachedIsolateWithResetContext = {
      isolate: cachedIsolate.isolate,
      bootstrap: cachedIsolate.bootstrap,
      customScriptModule: cachedIsolate.customScriptModule,
      bootstrapScriptResult: newBootstrapScriptResult,
      fnRef,
      fName: cachedIsolate.fName,
      logs: cachedIsolate.logs,

      // Metadata for debugging and tracking
      transformationId: cachedIsolate.transformationId,
      workspaceId: cachedIsolate.workspaceId,
      compiledModules: cachedIsolate.compiledModules,
    };

    logger.debug('IVM context reset completed', {
      transformationId: cachedIsolate.transformationId,
    });

    return cachedIsolateWithResetContext;
  } catch (error) {
    logger.error('Error during context reset', {
      error: error.message,
      transformationId: cachedIsolate.transformationId,
    });
    throw error;
  }
}

/**
 * Safely release execution-specific resources (context and bootstrapScriptResult)
 * @param {Object} context The IVM context to release
 * @param {Object} bootstrapScriptResult The bootstrap script result to release
 * @param {Object} metadata Metadata for logging (optional)
 */
function clearContextAndBootstrapScriptResult(context, bootstrapScriptResult, metadata = {}) {
  // Release context
  if (context) {
    try {
      context.release();
      logger.debug('Execution context released successfully', metadata);
    } catch (error) {
      logger.warn('Error releasing execution context', {
        error: error.message,
        ...metadata,
      });
    }
  }
  if (bootstrapScriptResult) {
    try {
      bootstrapScriptResult.release();
      logger.debug('Bootstrap script result released successfully', metadata);
    } catch (error) {
      logger.warn('Error releasing bootstrap script result', {
        error: error.message,
        ...metadata,
      });
    }
  }
}

/**
 * Determines if a cached isolate needs context reset
 * For isolate strategy, we always reset context for fresh execution
 * @param {Object} cachedIsolate The cached isolate (unused for isolate strategy)
 * @returns {boolean} Always true for isolate strategy
 */
function needsContextReset(cachedIsolate) {
  // For isolate strategy, we always reset context to ensure clean state
  return true;
}

module.exports = {
  createNewContext,
  clearContextAndBootstrapScriptResult,
  needsContextReset,
};
