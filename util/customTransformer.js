const ivm = require("isolated-vm");
const fetch = require("node-fetch");
var { getTransformationCode } = require("../util/customTransforrmationsStore");

async function runUserTransform(events, code) {
  // TODO: Decide on the right value for memory limit
  const isolate = new ivm.Isolate({ memoryLimit: 8 });
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
    new ivm.Reference(async function(...args) {
      return fetch(...args);
    })
  );

  jail.setSync(
    "_log",
    new ivm.Reference(function(...args) {
      console.log(...args);
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
        global.fetch = async function(...args) {
          // We use `copyInto()` here so that on the other side we don't have to call `copy()`. It
          // doesn't make a difference who requests the copy, the result is the same.
          // `applyIgnored` calls `log` asynchronously but doesn't return a promise-- it ignores the
          // return value or thrown exception from `log`.
          return fetch.apply(
            undefined,
            args.map(arg => new ivm.ExternalCopy(arg).copyInto())
          );
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
      }
  );
  // console.log(await fetch("http://localhost:8000").then(res => res.text()));

  // Now we can execute the script we just compiled:
  await bootstrap.run(context);

  isolate.compileScriptSync('log("hello world")').runSync(context);
  const customScript = await isolate.compileScript(code + "");
  await customScript.run(context);
  const fnRef = await context.global.get("transform");
  const sharedMessagesList = new ivm.ExternalCopy(events).copyInto({
    transferIn: true
  });
  const res = await fnRef.applySync(context.global.derefInto(), [
    sharedMessagesList
  ]);
  isolate.dispose();
  return res;
}

async function userTransformHandler(events) {
  const destination = events[0].destination;
  const versionId =
    destination.Transformations &&
    destination.Transformations[0] &&
    destination.Transformations[0].VersionID;
  if (versionId) {
    try {
      const res = await getTransformationCode(versionId);
      if (res) {
        const tr = await runUserTransform(events, res.code);
        return JSON.parse(tr);
      }
    } catch (error) {
      // TODO: Handle error cases: Throw error or send unmodified events
      console.error(error);
      throw error;
    }
  }
  return events;
}

exports.userTransformHandler = userTransformHandler;
