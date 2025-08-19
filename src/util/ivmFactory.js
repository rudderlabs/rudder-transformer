const ivm = require('isolated-vm');
const { camelCase } = require('lodash');

const { getLibraryCodeV1, getRudderLibByImportName } = require('./customTransforrmationsStore-v1');
const logger = require('../logger');
const stats = require('./stats');
const { setupJailWithApis, compileAndRunBootstrap } = require('./ivmApiInjection');

const ISOLATE_VM_MEMORY = parseInt(process.env.ISOLATE_VM_MEMORY || '128', 10);
const RUDDER_LIBRARY_REGEX = /^@rs\/[A-Za-z]+\/v[0-9]{1,3}$/;

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

    // TODO: Check if this should this be &&
    libraries.forEach((library) => {
      const libHandleName = camelCase(library.name);
      if (extractedLibraries.includes(libHandleName)) {
        librariesMap[libHandleName] = library.code;
      }
    });

    // Extract ruddder libraries from import names
    const rudderLibImportNames = extractedLibraries.filter((name) =>
      RUDDER_LIBRARY_REGEX.test(name),
    );
    const rudderLibraries = await Promise.all(
      rudderLibImportNames.map(async (importName) => await getRudderLibByImportName(importName)),
    );
    rudderLibraries.forEach((library) => {
      librariesMap[library.importName] = library.code;
    });
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

  // Setup jail with all standard APIs
  await setupJailWithApis(jail, {
    transformationId,
    workspaceId,
    credentials,
    testMode,
    logs,
  });

  // Compile and run bootstrap script with standard configuration
  const { bootstrap, bootstrapScriptResult } = await compileAndRunBootstrap(isolate, context, {
    includeGetCredential: true,
    includeForwardMainPromise: true,
  });
  // const customScript = await isolate.compileScript(`${library} ;\n; ${code}`);
  const customScriptModule = await isolate.compileModule(`${codeWithWrapper}`, {
    filename: transformationName,
  });
  await customScriptModule.instantiate(context, async (spec) => {
    if (librariesMap[spec]) {
      return compiledModules[spec].module;
    }
    // Release the isolate context before throwing an error
    await context.release();
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
      client.fnRef.release();
      client.bootstrap.release();
      client.customScriptModule.release();
      client.context.release();
      await client.isolate.dispose();
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
) {
  const ivmCacheManager = require('./ivmCache/manager');
  const logger = require('../logger');

  // Generate cache key for this transformation
  const cacheKey = ivmCacheManager.generateKey(transformationId, libraryVersionIds);

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
        logger.debug('IVM Factory cache miss', {
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
        ivmCacheManager.set(cacheKey, cacheableIsolate).catch((error) => {
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
        // For cached instances, we don't destroy immediately
        // The cache manager handles cleanup via TTL/LRU
        if (ivmCacheManager.isCachingEnabled()) {
          logger.debug('Skipping immediate destroy for cached IVM', {
            transformationId,
          });
          // Note: Cached instances are cleaned up by cache eviction
          return;
        }

        // For non-cached instances or when cache is disabled,
        // fall back to traditional cleanup
        await originalDestroy(client);
      } catch (error) {
        logger.error('Error in cached factory destroy', {
          error: error.message,
          transformationId,
        });
        // Always attempt cleanup even if logging fails
        await originalDestroy(client);
      }
    },
  };

  // Store reference to original destroy for fallback
  const originalDestroy = async (client) => {
    client.fnRef.release();
    client.bootstrap.release();
    client.customScriptModule.release();
    client.context.release();
    await client.isolate.dispose();
  };

  return factory;
}

module.exports = {
  getFactory,
  getCachedFactory,
  compileUserLibrary,
  SUPPORTED_FUNC_NAMES,
};
