const logger = require('../../logger');
const { injectV1SandboxApis } = require('../ivm/sandboxBridge');

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

  await injectV1SandboxApis({
    jail,
    trTags,
    logs: cachedIsolate.logs,
    testMode: cachedIsolate.testMode,
    credentials,
    transformationId: cachedIsolate.transformationId,
    workspaceId: cachedIsolate.workspaceId,
  });
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
    const newBootstrapScriptResult = await cachedIsolate.bootstrap.run(newContext, {
      reference: true,
    });

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
