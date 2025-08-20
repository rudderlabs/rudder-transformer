const logger = require('../../logger');
const { setupJailWithApis } = require('../ivmApiInjection');

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
  await setupJailWithApis(jail, {
    transformationId: cachedIsolate.transformationId,
    workspaceId: cachedIsolate.workspaceId,
    credentials,
    testMode: false, // Context reset doesn't use test mode
    logs: [], // Not used since testMode is false
  });
}

/**
 * Reset the context of a cached isolate for fresh execution
 * @param {Object} cachedIsolate The cached isolate object
 * @param {Object} credentials Fresh credentials for this execution
 * @returns {Object} Cached isolate with reset context ready for execution
 */
async function resetContext(cachedIsolate, credentials = {}) {
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
    await cachedIsolate.bootstrap.run(newContext);

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

    // Create cached isolate with reset context
    const cachedIsolateWithResetContext = {
      isolate: cachedIsolate.isolate,
      bootstrap: cachedIsolate.bootstrap,
      customScriptModule: cachedIsolate.customScriptModule,
      bootstrapScriptResult: cachedIsolate.bootstrapScriptResult,
      context: newContext,
      fnRef,
      fName: cachedIsolate.fName,
      logs: cachedIsolate.logs,

      // Metadata for debugging and tracking
      transformationId: cachedIsolate.transformationId,
      workspaceId: cachedIsolate.workspaceId,
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
