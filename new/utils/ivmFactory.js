const ivm = require('isolated-vm');
const NodeCache = require('node-cache');

// Environment variables for IVM cache configuration
const IVM_CACHE_MAX = parseInt(process.env.IVM_CACHE_MAX || '10', 10);
const IVM_CACHE_SECONDS = parseInt(process.env.IVM_CACHE_SECONDS || '300', 10); // Default: 5 minutes
const ISOLATE_VM_MEMORY = parseInt(process.env.ISOLATE_VM_MEMORY || '128', 10);
const SHARE_ISOLATE = process.env.SHARE_ISOLATE === "true";
const IVM_CACHE = process.env.IVM_CACHE === "true";

// Cache for storing IVM instances
const ivmCache = new NodeCache({
  stdTTL: IVM_CACHE_SECONDS,
  checkperiod: Math.min(IVM_CACHE_SECONDS / 10, 60), // Check for expired items at 1/10 of TTL or max 60 seconds
  useClones: false, // Don't clone objects when getting from cache
  deleteOnExpire: true, // Automatically delete expired items
});

// Cache for storing compiled modules and wrapped code
const moduleCache = new NodeCache({
  stdTTL: IVM_CACHE_SECONDS,
  checkperiod: Math.min(IVM_CACHE_SECONDS / 10, 60),
  useClones: false,
  deleteOnExpire: true,
});

// Setup cache event listeners for resource cleanup
ivmCache.on('expired', async (key, value) => {
  console.log(`IVM cache entry expired for transformationVersionId: ${key}`);
  // Check if there's a cached module for this transformation
  const hasModuleCache = moduleCache.has(key);
  // Skip releasing cached modules if they're still in the module cache
  await releaseIvmResources(value, hasModuleCache);
});

ivmCache.on('del', async (key, value) => {
  console.log(`IVM cache entry deleted for transformationVersionId: ${key}`);
  // Check if there's a cached module for this transformation
  const hasModuleCache = moduleCache.has(key);
  // Skip releasing cached modules if they're still in the module cache
  await releaseIvmResources(value, hasModuleCache);
});

// Setup module cache event listeners for resource cleanup
moduleCache.on('expired', (key, value) => {
  console.log(`Module cache entry expired for transformationVersionId: ${key}`);
  releaseModuleResources(value, key);
});

moduleCache.on('del', (key, value) => {
  console.log(`Module cache entry deleted for transformationVersionId: ${key}`);
  releaseModuleResources(value, key);
});

/**
 * Release resources associated with a cached module
 * @param {Object} moduleEntry - The module cache entry
 * @param {string} key - The cache key (transformationVersionId)
 */
function releaseModuleResources(moduleEntry, key) {
  if (!moduleEntry) return;

  try {
    // Release the customScriptModule
    if (moduleEntry.customScriptModule) {
      moduleEntry.customScriptModule.release();
    }

    // Release function references
    if (moduleEntry.fnRef) {
      moduleEntry.fnRef.release();
    }

    // Release supported functions
    if (moduleEntry.supportedFuncs) {
      for (const funcName in moduleEntry.supportedFuncs) {
        if (moduleEntry.supportedFuncs[funcName]) {
          moduleEntry.supportedFuncs[funcName].release();
        }
      }
    }

    console.log(`Module resources released for ${key}`);
  } catch (error) {
    console.error(`Error releasing module resources for ${key}:`, error);
  }
}

/**
 * Release all resources associated with an IVM instance
 * @param {Object} ivmInstance - The IVM instance to release
 * @param {boolean} [skipCachedModules=false] - Whether to skip releasing modules that might be cached
 */
async function releaseIvmResources(ivmInstance, skipCachedModules = false) {
  if (!ivmInstance) return;

  try {
    // For resources that might be cached in the module cache, only release them if not skipping cached modules
    if (!skipCachedModules) {
      // Release function reference
      if (ivmInstance.fnRef) {
        ivmInstance.fnRef.release();
      }

      // Release any compiled functions
      if (ivmInstance.supportedFuncs) {
        for (const funcName in ivmInstance.supportedFuncs) {
          if (ivmInstance.supportedFuncs[funcName]) {
            ivmInstance.supportedFuncs[funcName].release();
          }
        }
      }

      // Release the custom script module
      if (ivmInstance.customScriptModule) {
        ivmInstance.customScriptModule.release();
      }
    }

    // Always release library modules as they're not cached in the module cache
    if (ivmInstance.compiledModules) {
      for (const moduleName in ivmInstance.compiledModules) {
        if (ivmInstance.compiledModules[moduleName] && ivmInstance.compiledModules[moduleName].module) {
          ivmInstance.compiledModules[moduleName].module.release();
        }
      }
    }

    if (ivmInstance.bootstrapScriptResult) {
      ivmInstance.bootstrapScriptResult.release();
    }

    if (ivmInstance.bootstrap) {
      ivmInstance.bootstrap.release();
    }

    if (ivmInstance.jail) {
      ivmInstance.jail.release();
    }

    // Dispose the isolate if not shared
    if (ivmInstance.isolate && !SHARE_ISOLATE) {
      await ivmInstance.isolate.dispose();
    }

    console.log('IVM resources released successfully');
  } catch (error) {
    console.error('Error releasing IVM resources:', error);
  }
}

/**
 * Create or retrieve an IVM instance for a specific transformation version
 * @param {string} transformationVersionId - The version ID of the transformation
 * @param {string} [code] - The transformation code to compile (optional)
 * @returns {Promise<Object>} - The IVM instance with isolate, context, and other resources
 */
async function createIvm(transformationVersionId, code) {
  // If caching is not enabled, either use shared isolate or create a new one
  if (!IVM_CACHE) {
    if (SHARE_ISOLATE) {
      console.log('IVM_CACHE is disabled but SHARE_ISOLATE is enabled, using shared isolate');
      return createNewIvm();
    } else {
      console.log('IVM_CACHE is disabled, creating new IVM without caching');
      return createNewIvm();
    }
  }

  // Caching is enabled, proceed with normal caching logic
  if (!transformationVersionId) {
    console.warn('No transformationVersionId provided, creating new IVM without caching');
    return createNewIvm();
  }

  // Check if we already have a cached IVM for this transformation version
  const cachedIvm = ivmCache.get(transformationVersionId);
  if (cachedIvm) {
    console.log(`Using cached IVM for transformationVersionId: ${transformationVersionId}`);

    // If code is provided, check if we have a cached module for this code
    if (code) {
      const cachedModule = moduleCache.get(transformationVersionId);
      if (cachedModule) {
        console.log(`Using cached module for transformationVersionId: ${transformationVersionId}`);
        // Attach the cached module and references to the IVM instance
        cachedIvm.customScriptModule = cachedModule.customScriptModule;
        cachedIvm.codeWithWrapper = cachedModule.codeWithWrapper;
        cachedIvm.supportedFuncs = cachedModule.supportedFuncs;
        cachedIvm.fnRef = cachedModule.fnRef;
      } else if (cachedIvm.isolate) {
        // If no cached module but we have code, compile it and cache it
        await compileAndCacheModule(transformationVersionId, code, cachedIvm);
      }
    }

    return cachedIvm;
  }

  // Check if we've reached the maximum cache size
  const currentCacheSize = ivmCache.keys().length;
  if (currentCacheSize >= IVM_CACHE_MAX) {
    console.warn(`IVM cache limit (${IVM_CACHE_MAX}) reached. Creating new IVM without caching.`);
    return createNewIvm();
  }

  // Create a new IVM and cache it
  const newIvm = await createNewIvm();
  ivmCache.set(transformationVersionId, newIvm);
  console.log(`Created and cached new IVM for transformationVersionId: ${transformationVersionId}`);

  return newIvm;
}

/**
 * Create a new IVM instance with isolate and context
 * @returns {Promise<Object>} - The new IVM instance
 */
async function createNewIvm() {
  // Create a new isolate or use the shared one
  let isolateInstance = null;
  if (SHARE_ISOLATE) {
    // Use the global shared isolate if it exists, or create a new one
    if (!global.sharedIsolate) {
      global.sharedIsolate = new ivm.Isolate({ memoryLimit: ISOLATE_VM_MEMORY });
      console.log("Created new shared isolate");
    }
    isolateInstance = global.sharedIsolate;
  } else {
    isolateInstance = new ivm.Isolate({ memoryLimit: ISOLATE_VM_MEMORY });
  }

  // Create a new context
  const context = await isolateInstance.createContext();

  // Get the global object (jail)
  const jail = context.global;

  // Create the bootstrap script
  const bootstrap = await isolateInstance.compileScript(`
    new function() {
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

      let rsSecrets = _rsSecrets;
      delete _rsSecrets;
      global.rsSecrets = function(...args) {
        return rsSecrets([
          ...args.map(arg => new ivm.ExternalCopy(arg).copyInto())
        ]);
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
            // Create an object with both message and stack for better error reporting
            const errorInfo = {
              message: error.message,
              stack: error.stack || ''
            };
            reject.applyIgnored(undefined, [
              new ivm.ExternalCopy(errorInfo).copyInto()
            ]);
          });
        });
    }
  `);

  return {
    isolate: isolateInstance,
    context,
    jail,
    bootstrap,
    bootstrapScriptResult: null, // Will be set when bootstrap is run
    supportedFuncs: {},
    compiledModules: {},
    customScriptModule: null,
    fnRef: null
  };
}

/**
 * Get the current cache statistics
 * @returns {Object} - Cache statistics
 */
function getCacheStats() {
  return {
    ivm: {
      size: ivmCache.keys().length,
      maxSize: IVM_CACHE_MAX,
      ttl: IVM_CACHE_SECONDS,
      keys: ivmCache.keys(),
    },
    modules: {
      size: moduleCache.keys().length,
      ttl: IVM_CACHE_SECONDS,
      keys: moduleCache.keys(),
    }
  };
}

/**
 * Compile and cache a module for a specific transformation version
 * @param {string} transformationVersionId - The version ID of the transformation
 * @param {string} code - The transformation code to compile
 * @param {Object} ivmInstance - The IVM instance to use for compilation
 * @returns {Promise<void>}
 */
async function compileAndCacheModule(transformationVersionId, code, ivmInstance) {
  if (!code || !ivmInstance || !ivmInstance.isolate) {
    console.warn('Cannot compile module: missing code or valid IVM instance');
    return;
  }

  try {
    // Create the wrapper code
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
        return eventMetadata;
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

    // Compile the code as a module
    const customScriptModule = await ivmInstance.isolate.compileModule(codeWithWrapper, {
      filename: 'base transformation',
    });

    // Store the compiled module without instantiating it
    // The module will be instantiated in customTransformer.js

    // Store the compiled module and wrapper code in the instance
    ivmInstance.customScriptModule = customScriptModule;
    ivmInstance.codeWithWrapper = codeWithWrapper;

    // Store the module in the instance without accessing its namespace yet
    // The module will be instantiated and evaluated in customTransformer.js

    // Cache the module and wrapper code only if caching is enabled
    if (IVM_CACHE) {
      // For cached modules, we can instantiate, evaluate, and access the namespace
      // since these will be reused across requests
      try {
        // First instantiate and evaluate the module
        await customScriptModule.instantiate(ivmInstance.context, (specifier) => {
          // This is a simplified import handler since the actual imports are handled in customTransformer.js
          console.log(`Module import requested for: ${specifier}`);
          // Return null to indicate no module was found
          return null;
        });
        await customScriptModule.evaluate();

        // Now we can safely access the namespace
        const supportedFuncs = {};
        await Promise.all(
          ['transformEvent', 'transformBatch'].map(async (sName) => {
            const funcRef = await customScriptModule.namespace.get(sName, {
              reference: true,
            });
            if (funcRef && funcRef.typeof === 'function') {
              supportedFuncs[sName] = funcRef;
            }
          }),
        );

        const fnRef = await customScriptModule.namespace.get('transformWrapper', {
          reference: true,
        });

        // Cache the module, wrapper code, and references
        moduleCache.set(transformationVersionId, {
          customScriptModule,
          codeWithWrapper,
          supportedFuncs,
          fnRef
        });

        // Update the ivmInstance with the new references
        ivmInstance.supportedFuncs = supportedFuncs;
        ivmInstance.fnRef = fnRef;

        console.log(`Compiled, instantiated, and cached module for transformationVersionId: ${transformationVersionId}`);
      } catch (error) {
        console.error(`Error preparing module for cache: ${error.message}`);
        // Even if caching fails, we still want to store the compiled module in the instance
      }
    } else {
      console.log(`Compiled module for transformationVersionId: ${transformationVersionId} (caching disabled)`);
    }
  } catch (error) {
    console.error(`Error compiling module for transformationVersionId: ${transformationVersionId}`, error);
  }
}

/**
 * Clear the IVM cache
 */
async function clearCache() {
  const keys = ivmCache.keys();
  for (const key of keys) {
    const ivmInstance = ivmCache.get(key);
    await releaseIvmResources(ivmInstance);
  }
  ivmCache.flushAll();

  // Also clear the module cache
  const moduleKeys = moduleCache.keys();
  for (const key of moduleKeys) {
    const cachedModule = moduleCache.get(key);
    releaseModuleResources(cachedModule, key);
  }
  moduleCache.flushAll();

  console.log('IVM and module caches cleared');
}

module.exports = {
  createIvm,
  releaseIvmResources,
  getCacheStats,
  clearCache,
  compileAndCacheModule,
  SHARE_ISOLATE,
};
