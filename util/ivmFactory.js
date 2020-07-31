const ivm = require("isolated-vm");
const fetch = require("node-fetch");
const { getTransformationCode } = require("./customTransforrmationsStore");
const logger = require("../logger");
const { string } = require("is");

async function createIvm(versionId) {
  //   const codeRes = await getTransformationCode(versionId);
  //   const { code } = codeRes;
  let code = `/***
* Docs: https://docs.rudderstack.com/getting-started/adding-a-new-user-transformation-in-rudderstack
* Examples: https://github.com/rudderlabs/sample-user-transformers
***/

function transform(events) {
  let cleanEvents = events.map(ev => {
      ev.metadata = metadata(ev)
    return ev
  });
  

  return cleanEvents;
}
`;
  code = code.replace("metadata(", "metadata(eventsMetadata, ");

  const match = `function transform(events) {
`;
  const replacement = `
function metadata(eventsMetadata, event) {
    log("Inside modified code");
    log(eventsMetadata);
    return eventsMetadata[event.messageId] || {};
}

function transform(fullEvents) {
  const events = fullEvents.map(event => event.message);
  const eventsMetadata = {};
  fullEvents.forEach(ev => {
    eventsMetadata[ev.message.messageId] = ev.metadata;
  });
`;
  code = code.replace(match, replacement);
  logger.debug(`Shanmukh-Code : ${code}`);
  // TODO: Decide on the right value for memory limit
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = await isolate.createContext();
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

  jail.setSync(
    "_log",
    new ivm.Reference(
      ...args => {
        console.log("Log: ", ...args);
      }
    )
  );

  logger.debug("Shanmukh: Before compile in factory");
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
  logger.debug("Shanmukh: After compile in factory");

  logger.debug("Shanmukh in factory");
  logger.debug(bootstrapScriptResult);

  const customScript = await isolate.compileScript(`${code}`);
  await customScript.run(context);

  const supportedFuncNames = ["transform", "transformEvent", "transformBatch"];
  let supportedFuncs = [];

  await Promise.all(
    supportedFuncNames.map(async sName => {
      const funcRef = await jail.get(sName);
      if (funcRef) {
        supportedFuncs.push(funcRef);
      }
    })
  );

  if (supportedFuncs.length !== 1) {
    throw new Error(
      `Expected one of ${supportedFuncNames}. Found ${supportedFuncs.map(
        sFunc => sFunc.name
      )}`
    );
  }

  const fnRef = supportedFuncs[0];
  // TODO : check if we can resolve this
  // eslint-disable-next-line no-async-promise-executor
  return { isolate, jail, bootstrapScriptResult, context, fnRef };
}

async function getFactory(versionId) {
  const factory = {
    create: () => {
      return createIvm(versionId);
    },
    destroy: client => {
      client.isolate.dispose();
    }
  };

  return factory;
}

exports.getFactory = getFactory;
