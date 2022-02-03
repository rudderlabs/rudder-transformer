const ivm = require("isolated-vm");
const fetch = require("node-fetch");
const { getTransformationCode } = require("./customTransforrmationsStore");
const { userTransformHandlerV1 } = require("./customTransformer-v1");
const stats = require("./stats");

async function runUserTransform(events, code, eventsMetadata, versionId) {
  const tags = {
    transformerVersionId: versionId,
    version: 0
  };
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
        const fetchStartTime = new Date();
        const res = await fetch(...args);
        const data = await res.json();
        stats.timing("fetch_call_duration", fetchStartTime, { versionId });
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
    "_fetchV2",
    new ivm.Reference(async (resolve, reject, ...args) => {
      try {
        const fetchStartTime = new Date();
        const res = await fetch(...args);
        const headersContent = {};
        res.headers.forEach((value, header) => {
          headersContent[header] = value;
        });
        const data = {
          url: res.url,
          status: res.status,
          headers: headersContent,
          body: await res.text()
        };

        try {
          data.body = JSON.parse(data.body);
        } catch (e) {}

        stats.timing("fetchV2_call_duration", fetchStartTime, { versionId });
        resolve.applyIgnored(undefined, [
          new ivm.ExternalCopy(data).copyInto()
        ]);
      } catch (error) {
        const err = JSON.parse(
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
        reject.applyIgnored(undefined, [
          new ivm.ExternalCopy(err).copyInto()
        ]);
      }
    })
  );

  jail.setSync(
    "_log",
    new ivm.Reference(() => {
      // console.log("Log: ", ...args);
    })
  );

  jail.setSync(
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

  const customScript = await isolate.compileScript(`${code}`);
  await customScript.run(context);
  const fnRef = await jail.get("transform");
  // stat
  stats.counter("events_into_vm", events.length, tags);
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

async function userTransformHandler(events, versionId, libraryVersionIDs) {
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

      let userTransformedEvents = [];
      if (res.codeVersion && res.codeVersion === "1") {
        userTransformedEvents = await userTransformHandlerV1(
          events,
          res,
          libraryVersionIDs
        );
      } else {
        userTransformedEvents = await runUserTransform(
          eventMessages,
          res.code,
          eventsMetadata,
          versionId
        );
        userTransformedEvents = userTransformedEvents.map(ev => ({
          transformedEvent: ev,
          metadata: {}
        }));
      }
      return userTransformedEvents;
    }
  }
  return events;
}

exports.userTransformHandler = userTransformHandler;
