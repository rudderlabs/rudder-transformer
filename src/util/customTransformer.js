const ivm = require('isolated-vm');
const { compileUserLibrary } = require('../util/ivmFactory');
const { getTransformationCode } = require('./customTransformationsStore');
const { userTransformHandlerV1 } = require('./customTransformer-v1');
const { parserForImport } = require('./parser');
const stats = require('./stats');
const logger = require('../logger');
const { getMetadata, getTransformationMetadata } = require('../v0/util');
const { injectV0SandboxApis, V0_FORWARD_MAIN_PROMISE_SOURCE } = require('./ivm/sandboxBridge');

const ISOLATE_VM_MEMORY = Number.parseInt(process.env.ISOLATE_VM_MEMORY || '128', 10);

async function runUserTransform(
  events,
  code,
  eventsMetadata,
  transformationId,
  workspaceId,
  testMode = false,
) {
  const trTags = { identifier: 'v0', transformationId, workspaceId };
  // TODO: Decide on the right value for memory limit
  const isolate = new ivm.Isolate({ memoryLimit: ISOLATE_VM_MEMORY });
  const context = await isolate.createContext();
  const logs = [];
  const jail = context.global;
  // This make the global object available in the context as 'global'. We use 'derefInto()' here
  // because otherwise 'global' would actually be a Reference{} object in the new isolate.
  await jail.set('global', jail.derefInto());

  await injectV0SandboxApis({ jail, trTags, logs, testMode, eventsMetadata });

  const bootstrap = await isolate.compileScript(V0_FORWARD_MAIN_PROMISE_SOURCE);

  // Now we can execute the script we just compiled:
  const bootstrapScriptResult = await bootstrap.run(context, { reference: true });

  const customScript = await isolate.compileScript(`${code}`);
  await customScript.run(context);
  const fnRef = await jail.get('transform', { reference: true });
  // eslint-disable-next-line no-async-promise-executor
  const executionPromise = new Promise(async (resolve, reject) => {
    const sharedMessagesList = new ivm.ExternalCopy(events).copyInto();
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
    // Release resources safely - each in its own try-catch to prevent cascade failures
    try {
      fnRef?.release();
    } catch (e) {
      logger.debug('fnRef release error:', e.message);
    }
    try {
      customScript?.release();
    } catch (e) {
      logger.debug('customScript release error:', e.message);
    }
    try {
      bootstrapScriptResult?.release();
    } catch (e) {
      logger.debug('bootstrapScriptResult release error:', e.message);
    }
    try {
      context?.release();
    } catch (e) {
      logger.debug('context release error:', e.message);
    }
    try {
      isolate?.dispose();
    } catch (e) {
      logger.debug('isolate dispose error:', e.message);
    }

    const tags = {
      errored: transformationError ? true : false,
      ...(Object.keys(eventsMetadata).length ? getMetadata(Object.values(eventsMetadata)[0]) : {}),
      ...trTags,
    };

    stats.counter('user_transform_function_input_events', events.length, tags);
    stats.timingSummary('user_transform_function_latency_summary', invokeTime, tags);
  }

  return {
    transformedEvents: result,
    logs,
  };
}

async function userTransformHandler(
  events,
  versionId,
  libraryVersionIDs,
  trRevCode = {},
  testMode = false,
  returnMetadata = false,
) {
  if (versionId) {
    const res = testMode ? trRevCode : await getTransformationCode(versionId);
    if (res) {
      // Events contain message and destination. We take the message part of event and run transformation on it.
      // And put back the destination after transformation
      const eventMessages = events.map((event) => event.message);
      const eventsMetadata = {};
      for (const ev of events) {
        eventsMetadata[ev.message.messageId] = ev.metadata;
      }
      let userTransformedEvents = [];
      let result;
      if (res.codeVersion && res.codeVersion === '1') {
        result = await userTransformHandlerV1(events, res, libraryVersionIDs, testMode);

        if (result.error) {
          throw new Error(result.error);
        }

        userTransformedEvents = result.transformedEvents;
        if (testMode) {
          userTransformedEvents = returnMetadata
            ? result
            : {
                transformedEvents: result.transformedEvents.map((ev) => {
                  if (ev.error) {
                    return { error: ev.error };
                  }
                  return ev.transformedEvent;
                }),
                logs: result.logs,
              };
        }
      } else {
        result = await runUserTransform(
          eventMessages,
          res.code,
          eventsMetadata,
          res.id,
          res.workspaceId,
          testMode,
        );

        userTransformedEvents = testMode
          ? result
          : result.transformedEvents.map((ev) => ({
              transformedEvent: ev,
              metadata: {},
            }));
      }
      return userTransformedEvents;
    }
  }
  return events;
}

async function validateCode(code, language) {
  if (language !== 'javascript') {
    throw new Error(`Unsupported language ${language}`);
  }
  return compileUserLibrary(code);
}

async function extractLibraries(code, language = 'javascript') {
  return parserForImport(code, language);
}

module.exports = {
  userTransformHandler,
  validateCode,
  extractLibraries,
};
