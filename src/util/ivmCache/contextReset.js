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
 * Load a module in the given isolate and context
 * @param {Object} isolate The IVM isolate
 * @param {Object} context The IVM context
 * @param {string} moduleName Name of the module
 * @param {string} moduleCode Source code of the module
 * @returns {Object} Compiled module
 */
async function loadModule(isolate, context, moduleName, moduleCode) {
  const module = await isolate.compileModule(moduleCode, {
    filename: `library ${moduleName}`,
  });
  await module.instantiate(context, () => {});
  return module;
}

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

  const GEOLOCATION_TIMEOUT_IN_MS = Number.parseInt(
    process.env.GEOLOCATION_TIMEOUT_IN_MS || '1000',
    10,
  );

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
        for (const [header, value] of res.headers) {
          headersContent[header] = value;
        }
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

    // Recompile all library modules for the new context
    const newCompiledModules = {};
    if (cachedIsolate.moduleSource.librariesMap) {
      await Promise.all(
        Object.entries(cachedIsolate.moduleSource.librariesMap).map(
          async ([moduleName, moduleCode]) => {
            newCompiledModules[moduleName] = {
              module: await loadModule(cachedIsolate.isolate, newContext, moduleName, moduleCode),
            };
          },
        ),
      );
    }

    // Compile fresh customScriptModule from cached moduleSource
    const newCustomScriptModule = await cachedIsolate.isolate.compileModule(
      cachedIsolate.moduleSource.codeWithWrapper,
      {
        filename: cachedIsolate.moduleSource.transformationName,
      },
    );

    // Instantiate the fresh module with the new context and fresh library modules
    await newCustomScriptModule.instantiate(newContext, async (spec) => {
      if (newCompiledModules[spec]) {
        return newCompiledModules[spec].module;
      }
      throw new Error(`import from ${spec} failed. Module not found.`);
    });

    // Evaluate the fresh module
    await newCustomScriptModule.evaluate();

    // Get fresh function reference from the new module
    const fnRef = await newCustomScriptModule.namespace.get('transformWrapper', {
      reference: true,
    });

    // Create cached isolate with reset context
    const cachedIsolateWithResetContext = {
      isolate: cachedIsolate.isolate,
      bootstrap: cachedIsolate.bootstrap,
      customScriptModule: newCustomScriptModule, // Use the fresh module
      bootstrapScriptResult: newBootstrapScriptResult,
      fnRef,
      fName: cachedIsolate.fName,
      logs: cachedIsolate.logs,

      // Metadata for debugging and tracking
      transformationId: cachedIsolate.transformationId,
      workspaceId: cachedIsolate.workspaceId,
      compiledModules: newCompiledModules, // Use fresh compiled modules
      moduleSource: cachedIsolate.moduleSource, // Keep moduleSource for future resets
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

module.exports = {
  createNewContext,
};
