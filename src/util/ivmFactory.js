const ivm = require('isolated-vm');
const fetch = require('node-fetch');
const { isNil, isObject, camelCase } = require('lodash');

const { getLibraryCodeV1, getRudderLibByImportName } = require('./customTransforrmationsStore-v1');
const { extractStackTraceUptoLastSubstringMatch } = require('./utils');
const logger = require('../logger');
const stats = require('./stats');
const { fetchWithDnsWrapper } = require('./utils');
const { createIsolateContext, cleanupIsolateResources } = require('./ivmCommon');

const ISOLATE_VM_MEMORY = parseInt(process.env.ISOLATE_VM_MEMORY || '128', 10);
const RUDDER_LIBRARY_REGEX = /^@rs\/[A-Za-z]+\/v[0-9]{1,3}$/;
const GEOLOCATION_TIMEOUT_IN_MS = parseInt(process.env.GEOLOCATION_TIMEOUT_IN_MS || '1000', 10);

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
              return outputEvents.push({error: extractStackTrace(error.stack, [transformType]), metadata: eventsMetadata[currMsgId] || {}});
            }
          }));
          break;
      }
      return outputEvents
    }
  `;

  // Use shared ivmCommon utility for isolate/context/global setup
  const { isolate, context, jail } = await createIsolateContext({
    trTags,
    testMode,
    credentials,
    withCredential: true,
  });
  jail.setSync('log', function (...args) {
    if (testMode) {
      let logString = 'Log:';
      args.forEach((arg) => {
        logString = logString.concat(` ${typeof arg === 'object' ? JSON.stringify(arg) : arg}`);
      });
      logs.push(logString);
    }
  });

  // Register extractStackTrace for V1 user code
  jail.setSync('extractStackTrace', function (trace, stringLiterals) {
    return extractStackTraceUptoLastSubstringMatch(trace, stringLiterals);
  });

  const compiledModules = {};
  await Promise.all(
    Object.entries(librariesMap).map(async ([moduleName, moduleCode]) => {
      compiledModules[moduleName] = {
        module: await loadModule(isolate, context, moduleName, moduleCode),
      };
    }),
  );

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

  const bootstrapScriptResult = await bootstrap.run(context);
  const customScriptModule = await isolate.compileModule(`${codeWithWrapper}`, {
    filename: 'base transformation',
  });
  await customScriptModule.instantiate(context, async (spec) => {
    if (librariesMap[spec]) {
      return compiledModules[spec].module;
    }
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

  return {
    isolate,
    jail,
    bootstrapScriptResult,
    bootstrap,
    customScriptModule,
    context,
    fnRef,
    isolateStartWallTime: isolate.wallTime,
    isolateStartCPUTime: isolate.cpuTime,
    fName,
    logs,
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
      );
    },
    destroy: async (client) => {
      // Use shared cleanup utility
      cleanupIsolateResources({
        fnRef: client.fnRef,
        bootstrapScriptResult: client.bootstrapScriptResult,
        customScript: client.customScriptModule,
        context: client.context,
        isolate: client.isolate,
      });
    },
  };

  return factory;
}

module.exports = {
  getFactory,
  compileUserLibrary,
  SUPPORTED_FUNC_NAMES,
};
