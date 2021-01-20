const ivm = require("isolated-vm");
const fetch = require("node-fetch");
const _ = require("lodash");
const stats = require("./stats");
const {  getLibraryCodeV1 } = require("./customTransforrmationsStore-v1");

const isolateVmMem = 8;
async function loadModule(isolateInternal, contextInternal, moduleCode) {
  const module = await isolateInternal.compileModule(moduleCode);
  await module.instantiate(contextInternal, () => {});
  return module;
}

async function createIvm(code, libraryVersionIds) {
  const createIvmStartTime = new Date();
  const libraries = await Promise.all(
    libraryVersionIds.map(async libraryVersionId =>
      getLibraryCodeV1(libraryVersionId)
    )
  );
  const librariesMap = {};
  if (code && libraries) {
    // TODO: Check if this should this be &&
    libraries.forEach(library => {
      librariesMap[_.camelCase(library.name)] = library.code;
    });
  }

  code = code + `
    export function transformWrapper(transformationPayload) {
      let events = transformationPayload.events
      let transformType = transformationPayload.transformationType
      let outputEvents = []
      const eventMessages = events.map(event => event.message);
      const eventsMetadata = {};
      events.forEach(ev => {
        eventsMetadata[ev.message.messageId] = ev.metadata;
      });

      var metadata = function(event) {
        const eventMetadata = event? eventsMetadata[event.messageId] || {}: {};
        return eventMetadata
      }
      switch(transformType) {
        case "transformBatch":
          outputEvents = transformBatch(eventMessages, metadata).map(transformedEvent => ({transformedEvent, metadata: metadata(transformedEvent)}))
          break;
        case "transformEvent":
          outputEvents = eventMessages.map(ev => {
            let transformedEvent = transformEvent(ev, metadata)
            return {transformedEvent, metadata: metadata(ev)}
          }).filter(e => e.transformedEvent != null);
          break;
      }
      return outputEvents
    }
  `;
  // TODO: Decide on the right value for memory limit
  const isolate = new ivm.Isolate({ memoryLimit: isolateVmMem });
  const isolateStartWallTime = isolate.wallTime;
  const isolateStartCPUTime = isolate.cpuTime;
  const context = await isolate.createContext();

  const compiledModules = {};

  await Promise.all(
    Object.entries(librariesMap).map(async ([moduleName, moduleCode]) => {
      compiledModules[moduleName] = {
        module: await loadModule(isolate, context, moduleCode)
      };
    })
  );

  // TODO: Add rudder nodejs sdk to libraries

  const jail = context.global;

  // This make the global object available in the context as 'global'. We use 'derefInto()' here
  // because otherwise 'global' would actually be a Reference{} object in the new isolate.
  await jail.set("global", jail.derefInto());

  // The entire ivm module is transferable! We transfer the module to the new isolate so that we
  // have access to the library from within the isolate.
  await jail.set("_ivm", ivm);
  await jail.set(
    "_fetch",
    new ivm.Reference(async (resolve, ...args) => {
      try {
        const res = await fetch(...args);
        const data = await res.json();
        resolve.applyIgnored(undefined, [
          new ivm.ExternalCopy(data).copyInto()
        ]);
      } catch (error) {
        resolve.applyIgnored(undefined, [
          new ivm.ExternalCopy("ERROR").copyInto()
        ]);
      }
    })
  );

  await jail.set(
    "_log",
    new ivm.Reference((...args) => {
      console.log("Log: ", ...args);
    })
  );

  const bootstrap = await isolate.compileScript(
    "new " +
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

      // Now we create the other half of the 'log' function in this isolate. We'll just take every
      // argument, create an external copy of it and pass it along to the log function above.
      let log = _log;
      delete _log;
      global.log = function(...args) {
        // We use 'copyInto()' here so that on the other side we don't have to call 'copy()'. It
        // doesn't make a difference who requests the copy, the result is the same.
        // 'applyIgnored' calls 'log' asynchronously but doesn't return a promise-- it ignores the
        // return value or thrown exception from 'log'.
        log.applyIgnored(
          undefined,
          args.map(arg => new ivm.ExternalCopy(arg).copyInto())
         );
       };

      return new ivm.Reference(function forwardMainPromise(
        fnRef,
        resolve,
        events,
        timeout
        ){
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

        `
  );

  // Now we can execute the script we just compiled:
  const bootstrapScriptResult = await bootstrap.run(context);
  // const customScript = await isolate.compileScript(`${library} ;\n; ${code}`);
  const customScriptModule = await isolate.compileModule(`${code}`);
  await customScriptModule.instantiate(context, spec => {
    if (librariesMap[spec]) {
      return compiledModules[spec].module;
    }
    console.log(`import from ${spec} failed. Module not found.`);
    throw new Error(`import from ${spec} failed. Module not found.`);
  });
  await customScriptModule.evaluate();

  const supportedFuncNames = ["transformEvent", "transformBatch"];
  const supportedFuncs = {};

  await Promise.all(
    supportedFuncNames.map(async sName => {
      const funcRef = await customScriptModule.namespace.get(sName);
      if (funcRef && funcRef.typeof === "function") {
        supportedFuncs[sName] = funcRef;
      }
    })
  );

  const availableFuncNames = Object.keys(supportedFuncs);
  if (availableFuncNames.length !== 1) {
    throw new Error(
      `Expected one of ${supportedFuncNames}. Found ${Object.values(
        availableFuncNames
      )}`
    );
  }

  const fnRef = await customScriptModule.namespace.get("transformWrapper");
  const fName = availableFuncNames[0];
  stats.timing("createivm_duration", createIvmStartTime);
  // TODO : check if we can resolve this
  // eslint-disable-next-line no-async-promise-executor

  return {
    isolate,
    jail,
    bootstrapScriptResult,
    context,
    fnRef,
    isolateStartWallTime,
    isolateStartCPUTime,
    fName
  };
}

async function getFactory(code, libraryVersionIds) {
  const factory = {
    create: async () => {
      return createIvm(code, libraryVersionIds);
    },
    destroy: async client => {
      await client.isolate.dispose();
    }
  };

  return factory;
}

exports.getFactory = getFactory;
