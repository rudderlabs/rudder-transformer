const ivm = require('isolated-vm');
const { compileUserLibrary } = require('../util/ivmFactory');
const fetch = require('node-fetch');
const { getTransformationCode } = require('./customTransforrmationsStore');
const { getTransformationCodeV1 } = require('./customTransforrmationsStore-v1');
const { UserTransformHandlerFactory } = require('./customTransformerFactory');
const { parserForImport } = require('./parser');
const stats = require('./stats');
const logger = require('../logger');
const { fetchWithDnsWrapper } = require('./utils');
const { getMetadata, getTransformationMetadata } = require('../v0/util');
const { createIsolateContext, cleanupIsolateResources } = require('./ivmCommon');
const ISOLATE_VM_MEMORY = parseInt(process.env.ISOLATE_VM_MEMORY || '128', 10);
const GEOLOCATION_TIMEOUT_IN_MS = parseInt(process.env.GEOLOCATION_TIMEOUT_IN_MS || '1000', 10);

async function runUserTransform(
  events,
  code,
  eventsMetadata,
  transformationId,
  workspaceId,
  testMode = false,
) {
  const trTags = { identifier: 'v0', transformationId, workspaceId };
  // Use shared ivmCommon utility for isolate/context/global setup
  const { isolate, context, jail } = await createIsolateContext({
    trTags,
    testMode,
    withMetadata: true,
  });
  const logs = [];
  jail.setSync('log', function (...args) {
    if (testMode) {
      let logString = 'Log:';
      args.forEach((arg) => {
        logString = logString.concat(` ${typeof arg === 'object' ? JSON.stringify(arg) : arg}`);
      });
      logs.push(logString);
    }
  });

  jail.setSync('metadata', function (...args) {
    const eventMetadata = eventsMetadata[args[0].messageId] || {};
    const meta = {
      sourceId: eventMetadata.sourceId,
      sourceName: eventMetadata.sourceName,
      originalSourceId: eventMetadata.originalSourceId,
      workspaceId: eventMetadata.workspaceId,
      sourceType: eventMetadata.sourceType,
      sourceCategory: eventMetadata.sourceCategory,
      destinationId: eventMetadata.destinationId,
      destinationType: eventMetadata.destinationType,
      destinationName: eventMetadata.destinationName,
      namespace: eventMetadata.namespace,
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
    return new ivm.ExternalCopy(meta).copyInto();
  });

  const bootstrap = await isolate.compileScript(
    'new ' +
      `
    function() {
      let ivm = _ivm;
      delete _ivm;
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
        `,
  );

  // Now we can execute the script we just compiled:
  const bootstrapScriptResult = await bootstrap.run(context);

  const customScript = await isolate.compileScript(`${code}`);
  await customScript.run(context);
  const fnRef = await jail.get('transform', { reference: true });
  // eslint-disable-next-line no-async-promise-executor
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
    // Use shared cleanup utility
    cleanupIsolateResources({ fnRef, customScript, bootstrapScriptResult, context, isolate });

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
) {
  if (versionId) {
    const res = testMode ? trRevCode : await getTransformationCode(versionId);
    if (res) {
      // Events contain message and destination. We take the message part of event and run transformation on it.
      // And put back the destination after transforrmation
      const eventMessages = events.map((event) => event.message);
      const eventsMetadata = {};
      events.forEach((ev) => {
        eventsMetadata[ev.message.messageId] = ev.metadata;
      });
      let userTransformedEvents = [];
      let result;
      if (res.codeVersion && res.codeVersion === '1') {
        result = await UserTransformHandlerFactory(res).runUserTransfrom(
          events,
          testMode,
          libraryVersionIDs,
        );

        if (result.error) {
          throw new Error(result.error);
        }

        userTransformedEvents = result.transformedEvents;
        if (testMode) {
          userTransformedEvents = {
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

async function setupUserTransformHandler(libraryVersionIDs, trRevCode = {}) {
  const resp = await UserTransformHandlerFactory(trRevCode).setUserTransform(libraryVersionIDs);
  return resp;
}

async function validateCode(code, language) {
  if (language === 'javascript') {
    return compileUserLibrary(code);
  }
  if (language === 'python' || language === 'pythonfaas') {
    return parserForImport(code, true, [], language);
  }

  throw new Error('Unsupported language');
}

async function extractLibraries(
  code,
  versionId,
  validateImports,
  additionalLibs,
  language = 'javascript',
  testMode = false,
) {
  if (language === 'javascript') return parserForImport(code);

  let transformation;

  if (versionId && !testMode) {
    transformation = await getTransformationCodeV1(versionId);
  }

  if (!transformation?.imports) {
    return parserForImport(code || transformation?.code, validateImports, additionalLibs, language);
  }

  return transformation.imports;
}

module.exports = {
  userTransformHandler,
  setupUserTransformHandler,
  validateCode,
  extractLibraries,
};
