const ivm = require("isolated-vm");
const fetch = require("node-fetch");
var { getTransformationCode } = require("../util/customTransforrmationsStore");

async function runUserTransform(events, code) {
  // TODO: Decide on the right value for memory limit
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = await isolate.createContext();
  const jail = context.global;
  // This make the global object available in the context as `global`. We use `derefInto()` here
  // because otherwise `global` would actually be a Reference{} object in the new isolate.
  await jail.set("global", jail.derefInto());

  // The entire ivm module is transferable! We transfer the module to the new isolate so that we
  // have access to the library from within the isolate.
  await jail.set("_ivm", ivm);
  await jail.set(
    "_fetch",
    new ivm.Reference(async function(resolve, ...args) {
      try {
        const res = await fetch(...args);
        const data = await res.json();
        resolve.applyIgnored(undefined, [
          new ivm.ExternalCopy(data).copyInto()
        ]);
      } catch (error) {
        console.log("ERROR");
        //TODO: How to handle errors
        resolve.applyIgnored(undefined, [
          new ivm.ExternalCopy("ERROR").copyInto()
        ]);
      }
      console.log("In Fetch Isolate");
    })
  );

  jail.setSync(
    "_log",
    new ivm.Reference(function(...args) {
      console.log("Log: ", ...args);
    })
  );

  let bootstrap = await isolate.compileScript(
    "new " +
      function() {
        // Grab a reference to the ivm module and delete it from global scope. Now this closure is the
        // only place in the context with a reference to the module. The `ivm` module is very powerful
        // so you should not put it in the hands of untrusted code.
        let ivm = _ivm;
        delete _ivm;

        // Now we create the other half of the `log` function in this isolate. We'll just take every
        // argument, create an external copy of it and pass it along to the log function above.
        let fetch = _fetch;
        delete _fetch;
        global.fetch = function(...args) {
          // We use `copyInto()` here so that on the other side we don't have to call `copy()`. It
          // doesn't make a difference who requests the copy, the result is the same.
          // `applyIgnored` calls `log` asynchronously but doesn't return a promise-- it ignores the
          // return value or thrown exception from `log`.
          return new Promise(resolve => {
            fetch.applyIgnored(undefined, [
              new ivm.Reference(resolve),
              ...args.map(arg => new ivm.ExternalCopy(arg).copyInto())
            ]);
          });
        };

        // Now we create the other half of the `log` function in this isolate. We'll just take every
        // argument, create an external copy of it and pass it along to the log function above.
        let log = _log;
        delete _log;
        global.log = function(...args) {
          // We use `copyInto()` here so that on the other side we don't have to call `copy()`. It
          // doesn't make a difference who requests the copy, the result is the same.
          // `applyIgnored` calls `log` asynchronously but doesn't return a promise-- it ignores the
          // return value or thrown exception from `log`.
          log.applyIgnored(
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
  );

  // Now we can execute the script we just compiled:
  const bootstrapScriptResult = await bootstrap.run(context);

  const customScript = await isolate.compileScript(code + "");
  await customScript.run(context);
  const fnRef = await jail.get("transform");
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
  try {
    result = await executionPromise;
  } catch (error) {
    console.log("ERROR in user transformation", error);
  }
  // TODO: Dispose in case of error??
  isolate.dispose();
  return result;
}

async function userTransformHandler(events, versionId) {
  console.log(versionId);
  if (versionId) {
    try {
      const res = await getTransformationCode(versionId);
      if (res) {
        // Events contain message and destination. We take the message part of event and run transformation on it.
        // And put back the destination after transforrmation
        const { destination } = events && events[0];
        const eventMessages = events.map(event => event.message);
        const userTransformedEvents = await runUserTransform(
          eventMessages,
          res.code
        );
        const formattedEvents = userTransformedEvents.map(e => ({
          message: e,
          destination
        }));
        return formattedEvents;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  return events;
}

exports.userTransformHandler = userTransformHandler;
