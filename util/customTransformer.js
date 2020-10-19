const ivm = require("isolated-vm");
const fetch = require("node-fetch");
const fs = require("fs");
const lodashCore = require("lodash/core");
const _ = require("lodash");
const stats = require("./stats");

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

const {
  getTransformationCode,
  getLibraryCode
} = require("./customTransforrmationsStore");
const { addCode, subCode } = require("./math.js");

const { getPool } = require("./ivmPool");

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

async function transform(isolatevm, events) {
  // TODO : check if we can resolve this
  // eslint-disable-next-line no-async-promise-executor
  const executionPromise = new Promise(async (resolve, reject) => {
    const sharedMessagesList = new ivm.ExternalCopy(events).copyInto({
      transferIn: true
    });
    try {
      await isolatevm.bootstrapScriptResult.apply(undefined, [
        isolatevm.fnRef,
        new ivm.Reference(resolve),
        sharedMessagesList
      ]);
    } catch (error) {
      reject(error.message);
    }
  });
  const timeoutPromise = new Promise(resolve => {
    const wait = setTimeout(() => {
      clearTimeout(wait);
      resolve("Timedout");
    }, 4000);
  });
  const result = await Promise.race([executionPromise, timeoutPromise]);
  if (result === "Timedout") {
    throw new Error("Timed out");
  }
  return result;
}

function calculateMsFromIvmTime(value) {
  return (value[0] + value[1] / 1e9) * 1000;
}

async function userTransformHandler(events, versionId, libraryVersionIds) {
  if (versionId) {
    const isolatevmPool = await getPool(versionId, libraryVersionIds);
    const isolatevm = await isolatevmPool.acquire();
    stats.gauge("isolatevm_pool_size", isolatevm.size);
    stats.gauge("isolatevm_pool_available", isolatevm.available);
    const isolateStartWallTime = calculateMsFromIvmTime(
      isolatevm.isolateStartWallTime
    );
    const isolateStartCPUTime = calculateMsFromIvmTime(
      isolatevm.isolateStartCPUTime
    );
    const transformedEvents = await transform(isolatevm, events);
    const isolateEndWallTime = calculateMsFromIvmTime(
      isolatevm.isolate.wallTime
    );
    const isolateEndCPUTime = calculateMsFromIvmTime(isolatevm.isolate.cpuTime);
    stats.timing(
      "isolate_wall_time",
      isolateEndWallTime - isolateStartWallTime
    );
    stats.timing("isolate_cpu_time", isolateEndCPUTime - isolateStartCPUTime);
    isolatevmPool.release(isolatevm);
    stats.gauge("isolatevm_pool_available", isolatevm.available);
    // TODO: add stats for capturing ivm pools
    return transformedEvents;
    // Events contain message and destination. We take the message part of event and run transformation on it.
    // And put back the destination after transforrmation
  }
  return events;
}

exports.userTransformHandler = userTransformHandler;
