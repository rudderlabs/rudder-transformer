const ivm = require("isolated-vm");
const fetch = require("node-fetch");

const { getTransformationCode } = require("./customTransforrmationsStore");
const { addCode, subCode } = require("./math.js");

async function runUserTransform(events, code, eventsMetadata) {
  // TODO: Decide on the right value for memory limit
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = await isolate.createContext();
  // const base64ModuleCode = await readFile(`util/base64.js`, {
  //   encoding: "utf-8"
  // });
  const moduleMapNew = {};
  const module = await isolate.compileModule(addCode);
  moduleMapNew.add = { module };

  await module.instantiate(context, () => {});
  const evalResult = await module.evaluate();
  // console.log("add -> evalResult", evalResult);

  // console.log("add -> module.namespace", module.namespace);
  // console.log(
  //   "add -> module.namespace.default getSync",
  //   module.namespace.getSync("default")
  // );

  const defaultExport = await module.namespace.get("default");
  const addResult = await defaultExport.apply(null, [2, 4]);
  // console.log("add -> result", addResult);

  const moduleSub = await isolate.compileModule(subCode);
  moduleMapNew.math = { module: moduleSub };

  const dependencySpecifiersSub = moduleSub.dependencySpecifiers;

  await moduleSub.instantiate(context, function(spec) {
    if (spec == "./add") {
      return moduleMapNew.add.module;
    }
  });

  const evalResultAdd = await moduleSub.evaluate();
  // console.log("add -> evalResultAdd", evalResultAdd);

  // console.log("add -> module.namespace", moduleSub.namespace);
  // console.log(
  //   "add -> module.namespace.add getSync",
  //   moduleSub.namespace.getSync("add")
  // );
  // console.log(
  //   "add -> module.namespace.sub getSync",
  //   moduleSub.namespace.getSync("sub")
  // );

  // const addImport = await moduleSub.namespace.get("add");
  // const addResultNew = await addImport.apply(null, [2, 4]);
  // // console.log("add -> add result", addResultNew);

  // const subImport = await moduleSub.namespace.get("sub");
  // const subResultNew = await subImport.apply(null, [1234, 4]);
  // console.log("add -> sub result", subResultNew);

  // await context.eval(base64func);
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

  // jail.setSync(
  //   "_atob",
  //   new ivm.Reference(arg => {
  //     return base64.atob(arg).toString(); // this is in node so buffer is available
  //   })
  // );

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

        // let atob = _atob;

        // global.atob = function (...args) {
        //   return atob.applySync(
        //     undefined,
        //     args.map(arg => new ivm.ExternalCopy(arg).copyInto())
        //   );
        // };
        
        
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

  await customScriptModule.instantiate(context, function(spec) {
    // console.log("SPeci  is ", spec);
    if (spec == "./add") {
      return moduleMapNew.add.module;
    }
    if (spec == "./math") {
      return moduleMapNew.math.module;
    }
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
