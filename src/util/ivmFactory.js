const ivm = require('isolated-vm');
const fetch = require('node-fetch');
const { isNil, isObject, camelCase } = require('lodash');

const { getLibraryCodeV1, getRudderLibByImportName } = require('./customTransforrmationsStore-v1');
const { extractStackTraceUptoLastSubstringMatch } = require('./utils');
const logger = require('../logger');
const stats = require('./stats');
const { fetchWithDnsWrapper } = require('./utils');

const ISOLATE_VM_MEMORY = Number.parseInt(process.env.ISOLATE_VM_MEMORY || '128', 10);
const RUDDER_LIBRARY_REGEX = /^@rs\/[A-Za-z]+\/v[0-9]{1,3}$/;
const GEOLOCATION_TIMEOUT_IN_MS = Number.parseInt(
  process.env.GEOLOCATION_TIMEOUT_IN_MS || '1000',
  10,
);

const SUPPORTED_FUNC_NAMES = ['transformEvent', 'transformBatch'];

const isolateVmMem = ISOLATE_VM_MEMORY;
async function evaluateModule(isolate, context, moduleCode) {
  const module = await isolate.compileModule(moduleCode);
  await module.instantiate(context, (specifier, referrer) => referrer);
  await module.evaluate({ release: true });
  return true;
}

async function loadModule(isolateInternal, contextInternal, moduleName, moduleCode) {
  const module = await isolateInternal.compileModule(moduleCode, {
    filename: `library ${moduleName}`,
  });
  await module.instantiate(contextInternal, () => {});
  return module;
}

async function createIvm(
  code,
  libraryVersionIds,
  transformationId,
  workspaceId,
  credentials,
  secrets,
  testMode,
  transformationName,
) {
  const trTags = { identifier: 'V1', transformationId, workspaceId };
  const createIvmStartTime = new Date();
  const logs = [];
  const libraries = await Promise.all(
    libraryVersionIds.map(async (libraryVersionId) => await getLibraryCodeV1(libraryVersionId)),
  );
  const librariesMap = {};
  if (code && libraries) {
    const extractedLibraries = Object.keys(
      await require('./customTransformer').extractLibraries(
        code,
        null,
        false,
        [],
        'javascript',
        testMode,
      ),
    );

    for (const library of libraries) {
      const libHandleName = camelCase(library.name);
      if (extractedLibraries.includes(libHandleName)) {
        librariesMap[libHandleName] = library.code;
      }
    }

    // Extract ruddder libraries from import names
    const rudderLibImportNames = extractedLibraries.filter((name) =>
      RUDDER_LIBRARY_REGEX.test(name),
    );
    const rudderLibraries = await Promise.all(
      rudderLibImportNames.map(async (importName) => await getRudderLibByImportName(importName)),
    );
    for (const library of rudderLibraries) {
      librariesMap[library.importName] = library.code;
    }
  }

  const codeWithWrapper =
    // eslint-disable-next-line prefer-template
    code +
    `
    export async function transformWrapper(transformationPayload) {
      let events = transformationPayload.events
      let transformType = transformationPayload.transformationType
      let outputEvents = []
      const eventMessages = events.map(event => event.message);
      const eventsMetadata = {};
      events.forEach(ev => {
        eventsMetadata[ev.message.messageId] = ev.metadata;
      });

      const isObject = (o) => Object.prototype.toString.call(o) === '[object Object]';

      var metadata = function(event) {
        const eventMetadata = event ? eventsMetadata[event.messageId] || {} : {};
        return {
          sourceId: eventMetadata.sourceId,
          sourceName: eventMetadata.sourceName,
          workspaceId: eventMetadata.workspaceId,
          sourceType: eventMetadata.sourceType,
          sourceCategory: eventMetadata.sourceCategory,
          destinationId: eventMetadata.destinationId,
          destinationType: eventMetadata.destinationType,
          destinationName: eventMetadata.destinationName,

          // TODO: remove non required fields

          namespace: eventMetadata.namespace,
          originalSourceId: eventMetadata.originalSourceId,
          trackingPlanId: eventMetadata.trackingPlanId,
          trackingPlanVersion: eventMetadata.trackingPlanVersion,
          sourceTpConfig: eventMetadata.sourceTpConfig,
          mergedTpConfig: eventMetadata.mergedTpConfig,
          jobId: eventMetadata.jobId,
          sourceJobId: eventMetadata.sourceJobId,
          sourceJobRunId: eventMetadata.sourceJobRunId,
          sourceTaskRunId: eventMetadata.sourceTaskRunId,
          recordId: eventMetadata.recordId,
          messageId: eventMetadata.messageId,
          messageIds: eventMetadata.messageIds,
          rudderId: eventMetadata.rudderId,
          receivedAt: eventMetadata.receivedAt,
          eventName: eventMetadata.eventName,
          eventType: eventMetadata.eventType,
          sourceDefinitionId: eventMetadata.sourceDefinitionId,
          destinationDefinitionId: eventMetadata.destinationDefinitionId,
          transformationId: eventMetadata.transformationId,
          transformationVersionId: eventMetadata.transformationVersionId,
        };
      }
      switch(transformType) {
        case "transformBatch":
          let transformedEventsBatch;
          try {
            transformedEventsBatch = await transformBatch(eventMessages, metadata);
          } catch (error) {
            outputEvents.push({error: extractStackTrace(error.stack, [transformType]), metadata: {}});
            return outputEvents;
          }
          if (!Array.isArray(transformedEventsBatch)) {
            outputEvents.push({error: "returned events from transformBatch(event) is not an array", metadata: {}});
            break;
          }
          outputEvents = transformedEventsBatch.map(transformedEvent => {
            if (!isObject(transformedEvent)) {
              return{error: "returned event in events array from transformBatch(events) is not an object", metadata: {}};
            }
            return{transformedEvent, metadata: metadata(transformedEvent)};
          })
          break;
        case "transformEvent":
          await Promise.all(eventMessages.map(async ev => {
            const currMsgId = ev.messageId;
            try{
              let transformedOutput = await transformEvent(ev, metadata);
              // if func returns null/undefined drop event
              if (transformedOutput === null || transformedOutput === undefined) return;
              if (Array.isArray(transformedOutput)) {
                const producedEvents = [];
                const encounteredError = !transformedOutput.every(e => {
                  if (isObject(e)) {
                    producedEvents.push({transformedEvent: e, metadata: eventsMetadata[currMsgId] || {}});
                    return true;
                  } else {
                    outputEvents.push({error: "returned event in events array from transformEvent(event) is not an object", metadata: eventsMetadata[currMsgId] || {}});
                    return false;
                  }
                })
                if (!encounteredError) {
                  outputEvents.push(...producedEvents);
                }
                return;
              }
              if (!isObject(transformedOutput)) {
                return outputEvents.push({error: "returned event from transformEvent(event) is not an object", metadata: eventsMetadata[currMsgId] || {}});
              }
              outputEvents.push({transformedEvent: transformedOutput, metadata: eventsMetadata[currMsgId] || {}});
              return;
            } catch (error) {
              // Handling the errors in versionedRouter.js
              return outputEvents.push({error: extractStackTrace(error.stack, [transformType]), metadata: eventsMetadata[currMsgId] || {}});
            }
          }));
          break;
      }
      return outputEvents
    }
  `;
  const isolate = new ivm.Isolate({ memoryLimit: ISOLATE_VM_MEMORY });
  const context = await isolate.createContext();

  const compiledModules = {};

  await Promise.all(
    Object.entries(librariesMap).map(async ([moduleName, moduleCode]) => {
      compiledModules[moduleName] = {
        module: await loadModule(isolate, context, moduleName, moduleCode),
      };
    }),
  );

  // TODO: Add rudder nodejs sdk to libraries

  const jail = context.global;

  // This make the global object available in the context as 'global'. We use 'derefInto()' here
  // because otherwise 'global' would actually be a Reference{} object in the new isolate.
  await jail.set('global', jail.derefInto());

  // The entire ivm module is transferable! We transfer the module to the new isolate so that we
  // have access to the library from within the isolate.
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

  await jail.set('_getCredential', function (key) {
    if (isNil(credentials) || !isObject(credentials)) {
      logger.error(
        `Error fetching credentials map for transformationID: ${transformationId} and workspaceId: ${workspaceId}`,
      );
      stats.increment('credential_error_total', trTags);
      return undefined;
    }
    if (key === null || key === undefined) {
      throw new TypeError('Key should be valid and defined');
    }
    return credentials[key];
  });

  await jail.set('log', function (...args) {
    if (testMode) {
      let logString = 'Log:';
      for (const arg of args) {
        logString = logString.concat(` ${typeof arg === 'object' ? JSON.stringify(arg) : arg}`);
      }
      logs.push(logString);
    }
  });

  await jail.set('extractStackTrace', function (trace, stringLiterals) {
    return extractStackTraceUptoLastSubstringMatch(trace, stringLiterals);
  });

  const bootstrap = await isolate.compileScript(
    'new ' +
      `
    function() {
      // Grab a reference to the ivm module and delete it from global scope. Now this closure is the
      // only place in the context with a reference to the module. The 'ivm' module is very powerful
      // so you should not put it in the hands of untrusted code.
      let ivm = _ivm;
      delete _ivm;

      // Now we create the other half of the 'log' function in this isolate. We'll just take every
      // argument, create an external copy of it and pass it along to the log function above.
      let fetch = _fetch;
      delete _fetch;
      global.fetch = function(...args) {
        // We use 'copyInto()' here so that on the other side we don't have to call 'copy()'. It
        // doesn't make a difference who requests the copy, the result is the same.
        // 'applyIgnored' calls 'log' asynchronously but doesn't return a promise-- it ignores the
        // return value or thrown exception from 'log'.
        return new Promise(resolve => {
          fetch.applyIgnored(undefined, [
            new ivm.Reference(resolve),
            ...args.map(arg => new ivm.ExternalCopy(arg).copyInto())
          ]);
        });
      };

      let fetchV2 = _fetchV2;
      delete _fetchV2;
      global.fetchV2 = function(...args) {
        return new Promise((resolve,reject) => {
          fetchV2.applyIgnored(undefined, [
            new ivm.Reference(resolve),
            new ivm.Reference(reject),
            ...args.map(arg => new ivm.ExternalCopy(arg).copyInto())
          ]);
        });
      };

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

      let getCredential = _getCredential;
      delete _getCredential;
      global.getCredential = function(...args) {
        const key = args[0];
        return getCredential(new ivm.ExternalCopy(key).copyInto());
      };

      return new ivm.Reference(function forwardMainPromise(
        fnRef,
        resolve,
        reject,
        events
        ){
          const derefMainFunc = fnRef.deref();
          Promise.resolve(derefMainFunc(events))
          .then(value => {
            resolve.applyIgnored(undefined, [
              new ivm.ExternalCopy(value).copyInto()
            ]);
          })
          .catch(error => {
            reject.applyIgnored(undefined, [
              new ivm.ExternalCopy(error.message).copyInto()
            ]);
          });
        });
      }

        `,
  );

  // Now we can execute the script we just compiled:
  const bootstrapScriptResult = await bootstrap.run(context);
  const customScriptModule = await isolate.compileModule(`${codeWithWrapper}`, {
    filename: transformationName,
  });
  await customScriptModule.instantiate(context, async (spec) => {
    if (librariesMap[spec]) {
      return compiledModules[spec].module;
    }
    // Release the isolate context before throwing an error
    try {
      context?.release();
    } catch (e) {
      logger.debug('context release error in module import:', e.message);
    }
    console.log(`import from ${spec} failed. Module not found.`);
    throw new Error(`import from ${spec} failed. Module not found.`);
  });
  await customScriptModule.evaluate();

  const supportedFuncs = {};

  await Promise.all(
    SUPPORTED_FUNC_NAMES.map(async (sName) => {
      const funcRef = await customScriptModule.namespace.get(sName, {
        reference: true,
      });
      if (funcRef && funcRef.typeof === 'function') {
        supportedFuncs[sName] = funcRef;
      }
    }),
  );

  const availableFuncNames = Object.keys(supportedFuncs);
  if (availableFuncNames.length !== 1) {
    throw new Error(
      `Expected one of ${SUPPORTED_FUNC_NAMES}. Found ${Object.values(availableFuncNames)}`,
    );
  }

  const fnRef = await customScriptModule.namespace.get('transformWrapper', {
    reference: true,
  });
  const fName = availableFuncNames[0];

  // Create moduleSource object for recompilation in context resets
  const moduleSource = {
    codeWithWrapper,
    transformationName,
    librariesMap, // Include library source code for recompilation
  };

  stats.timing('createivm_duration', createIvmStartTime, trTags);
  // TODO : check if we can resolve this
  // eslint-disable-next-line no-async-promise-executor

  return {
    isolate,
    bootstrap,
    customScriptModule,
    bootstrapScriptResult,
    context,
    fnRef,
    fName,
    logs,
    compiledModules,
    moduleSource,
  };
}

async function compileUserLibrary(code) {
  const isolate = new ivm.Isolate({ memoryLimit: ISOLATE_VM_MEMORY });
  const context = await isolate.createContext();
  return evaluateModule(isolate, context, code);
}

async function getFactory(
  code,
  libraryVersionIds,
  transformationId,
  workspaceId,
  credentials,
  secrets,
  testMode,
  transformationName,
  transformationVersionId,
) {
  const factory = {
    create: async () => {
      return createIvm(
        code,
        libraryVersionIds,
        transformationId,
        workspaceId,
        credentials,
        secrets,
        testMode,
        transformationName,
      );
    },
    destroy: async (client) => {
      // Release resources safely - each in its own try-catch to prevent cascade failures
      try {
        client.fnRef?.release();
        client.bootstrap?.release();
        client.customScriptModule?.release();
        client.context?.release();
        await client.isolate?.dispose();
      } catch (e) {
        logger.error('Error in factory destroy', {
          error: e.message,
          transformationId: client.transformationId || 'unknown',
        });
      }
    },
  };

  return factory;
}

/**
 * Get a cached factory that integrates with IVM cache manager
 * Provides the same interface as getFactory but with caching capabilities
 * @param {string} code - User transformation code
 * @param {Array<string>} libraryVersionIds - Array of library version IDs
 * @param {string} transformationId - Transformation identifier
 * @param {string} workspaceId - Workspace identifier
 * @param {Object} credentials - User credentials
 * @param {Object} secrets - User secrets
 * @param {boolean} testMode - Test mode flag
 * @param {string} transformationName - Transformation name
 * @param {string} transformationVersionId - Transformation version identifier
 * @returns {Object} Factory with create/destroy methods
 */
async function getCachedFactory(
  code,
  libraryVersionIds,
  transformationId,
  workspaceId,
  credentials,
  secrets,
  testMode,
  transformationName,
  transformationVersionId,
) {
  const ivmCacheManager = require('./ivmCache/manager');

  // Generate cache key for this transformation
  const cacheKey = ivmCacheManager.generateKey(transformationVersionId, libraryVersionIds);

  const factory = {
    create: async () => {
      const startTime = new Date();

      try {
        // Try to get cached isolate first
        const cachedIsolate = await ivmCacheManager.get(cacheKey, credentials);
        if (cachedIsolate) {
          // Cache hit - return cached isolate with reset context
          logger.debug('IVM Factory cache hit', {
            cacheKey,
            transformationId,
          });

          stats.timing('cached_ivm_create_duration', startTime, {
            result: 'hit',
            transformationId,
          });

          return cachedIsolate;
        }

        // Cache miss - create new IVM
        logger.info('IVM Factory cache miss', {
          cacheKey,
          transformationId,
        });

        const newIsolate = await createIvm(
          code,
          libraryVersionIds,
          transformationId,
          workspaceId,
          credentials,
          secrets,
          testMode,
          transformationName,
        );

        // Prepare isolate for caching with additional metadata
        const cacheableIsolate = {
          ...newIsolate,
          transformationId,
          workspaceId,
        };

        // Store in cache for future use (fire and forget)
        await ivmCacheManager.set(cacheKey, cacheableIsolate).catch((error) => {
          logger.warn('Failed to cache IVM isolate', {
            error: error.message,
            cacheKey,
            transformationId,
          });
        });

        stats.timing('cached_ivm_create_duration', startTime, {
          result: 'miss',
          transformationId,
        });

        // Return the augmented isolate (not the original one)
        return cacheableIsolate;
      } catch (error) {
        logger.error('Error in cached factory create', {
          error: error.message,
          cacheKey,
          transformationId,
        });

        stats.timing('cached_ivm_create_duration', startTime, {
          result: 'error',
          transformationId,
        });

        // Fallback to non-cached creation on any error
        const fallbackIsolate = await createIvm(
          code,
          libraryVersionIds,
          transformationId,
          workspaceId,
          credentials,
          secrets,
          testMode,
          transformationName,
        );

        // Add metadata even for fallback to maintain consistency
        return {
          ...fallbackIsolate,
          transformationId,
          workspaceId,
        };
      }
    },

    destroy: async (client) => {
      try {
        client.fnRef?.release();
        client.customScriptModule?.release();
        client.context?.release();
        // Note: Cached instances are cleaned up by cache eviction
        // We don't need to do immediate cleanup here
        return;
      } catch (error) {
        logger.error('Error in cached factory destroy', {
          error: error.message,
          transformationId: client.transformationId || 'unknown',
        });
      }
    },
  };

  return factory;
}

module.exports = {
  getFactory,
  getCachedFactory,
  compileUserLibrary,
  SUPPORTED_FUNC_NAMES,
};
