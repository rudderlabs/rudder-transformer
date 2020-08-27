const ivm = require("isolated-vm");
const fetch = require("node-fetch");
const fs = require("fs");
const lodashCore = require("lodash/core");

// TODO: Check why these dont work
const unsupportedFuncNames = [
  "_",
  "extend",
  "each",
  "first",
  "join",
  "reverse",
  "split"
];

const { getTransformationCode } = require("./customTransforrmationsStore");
const { addCode, subCode } = require("./math.js");

const lodashCode = `
  ${fs.readFileSync("./util/lodash-es-core.js", "utf8")};
  ;
  // Not exporting the unsupported functions
  export {${Object.keys(lodashCore).filter(
    funcName => !unsupportedFuncNames.includes(funcName)
  )}};
`;

const urlCode = `${fs.readFileSync("./util/url-search-params.min.js", "utf8")};
export default self;
`;

const compiledModules = {};

async function loadModule(isolate, context, moduleName, moduleCode) {
  const module = await isolate.compileModule(moduleCode);
  await module.instantiate(context, () => {});
  compiledModules[moduleName] = { module };
}

async function runUserTransform(events, code, eventsMetadata) {
  // TODO: Decide on the right value for memory limit
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = await isolate.createContext();

  const libraries = {
    add: addCode,
    math: subCode,
    lodash: lodashCode,
    url: urlCode
  };

  await Promise.all(
    Object.entries(libraries).map(async ([moduleName, moduleCode]) => {
      await loadModule(isolate, context, moduleName, moduleCode);
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

  await jail.set(
    "_metadata",
    new ivm.Reference((...args) => {
      const eventMetadata = eventsMetadata[args[0].messageId] || {};
      return new ivm.ExternalCopy(eventMetadata).copyInto();
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

        // Now we create the other half of the 'metadata' function in this isolate. We'll just take every
        // argument, create an external copy of it and pass it along to metadata log function above.
        let metadata = _metadata;
        delete _metadata;
        global.metadata = function(...args) {
          // We use 'copyInto()' here so that on the other side we don't have to call 'copy()'. It
          // doesn't make a difference who requests the copy, the result is the same.
          // 'applyIgnored' calls 'metadata' asynchronously but doesn't return a promise-- it ignores the
          // return value or thrown exception from 'metadata'.
          return metadata.applySync(
            undefined,
            args.map(arg => new ivm.ExternalCopy(arg).copyInto())
          );
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
         
        `
  );

  // Now we can execute the script we just compiled:
  const bootstrapScriptResult = await bootstrap.run(context);
  // const customScript = await isolate.compileScript(`${library} ;\n; ${code}`);

  const customScriptModule = await isolate.compileModule(`${code}`);

  await customScriptModule.instantiate(context, spec => {
    if (libraries[spec]) {
      return compiledModules[spec].module;
    }
    console.log(`import from ${spec} failed. Module not found.`);
    return undefined;
  });

  // const base64Script = await isolate.compileScript(base64);
  // const customScriptRunResult = await customScript.run(context);
  // console.log(
  //   "runUserTransform -> customScriptRunResult",
  //   customScriptRunResult
  // );
  await customScriptModule.evaluate(context);
  const fnRef = await customScriptModule.namespace.get("transform");

  // const fnRefOld = await jail.get("transform");
  // console.log("runUserTransform -> fnRefOld", fnRefOld);
  // TODO : check if we can resolve this
  // eslint-disable-next-line no-async-promise-executor
  const executionPromise = new Promise(async (resolve, reject) => {
    const sharedMessagesList = new ivm.ExternalCopy(events).copyInto({
      transferIn: true
    });
    try {
      await bootstrapScriptResult.apply(undefined, [
        fnRef,
        new ivm.Reference(resolve),
        sharedMessagesList
      ]);
    } catch (error) {
      reject(error.message);
    }
  });
  let result;
  try {
    const timeoutPromise = new Promise(resolve => {
      const wait = setTimeout(() => {
        clearTimeout(wait);
        resolve("Timedout");
      }, 4000);
    });
    result = await Promise.race([executionPromise, timeoutPromise]);
    if (result === "Timedout") {
      throw new Error("Timed out");
    }
  } catch (error) {
    isolate.dispose();
    throw error;
  }
  isolate.dispose();
  return result;
}

async function userTransformHandler(events, versionId) {
  if (versionId) {
    const res = await getTransformationCode(versionId);
    if (res) {
      // Events contain message and destination. We take the message part of event and run transformation on it.
      // And put back the destination after transforrmation
      const eventMessages = events.map(event => event.message);
      const eventsMetadata = {};
      events.forEach(ev => {
        eventsMetadata[ev.message.messageId] = ev.metadata;
      });

      const userTransformedEvents = await runUserTransform(
        eventMessages,
        res.code,
        eventsMetadata
      );
      return userTransformedEvents;
    }
  }
  return events;
}

exports.userTransformHandler = userTransformHandler;
