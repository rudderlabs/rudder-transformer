const ivm = require("isolated-vm");
const stats = require("./stats");

const { getPool } = require("./ivmPool");



async function transform(isolatevm, events) {
  const transformationPayload = {};
  transformationPayload.events = events;
  transformationPayload.transformationType = isolatevm.fName;
  const executionPromise = new Promise(async (resolve, reject) => {
    const sharedTransformationPayload = new ivm.ExternalCopy(
      transformationPayload
    ).copyInto({
      transferIn: true
    });
    try {
      await isolatevm.bootstrapScriptResult.apply(
        undefined,
        [
          isolatevm.fnRef,
          new ivm.Reference(resolve),
          sharedTransformationPayload
        ],
        { timeout: 4000 }
      );
    } catch (error) {
      reject(error.message);
    }
  });
  let result;
  try {
    result = await Promise.race([executionPromise]);
  } catch (error) {
    throw new Error(error);
  }
  return result;
}

function calculateMsFromIvmTime(value) {
  return (value[0] + value[1] / 1e9) * 1000;
}

async function userTransformHandlerV1(
  events,
  userTransformation,
  libraryVersionIds
) {
  if (userTransformation.versionId) {
    const isolatevmPool = await getPool(userTransformation, libraryVersionIds);
    const isolatevm = await isolatevmPool.acquire();
    const tags = {
      transformerVersionId: userTransformation.versionId
    };
    stats.gauge("isolate_vm_pool_size", isolatevmPool.size, tags);
    stats.gauge("isolate_vm_pool_available", isolatevmPool.available, tags);
    stats.counter("events_into_vm", events.length, tags);
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
      isolateEndWallTime - isolateStartWallTime,
      tags
    );
    stats.timing(
      "isolate_cpu_time",
      isolateEndCPUTime - isolateStartCPUTime,
      tags
    );
    isolatevmPool.release(isolatevm);
    stats.gauge("isolate_vm_pool_size", isolatevmPool.size, tags);
    stats.gauge("isolate_vm_pool_available", isolatevmPool.available, tags);
    return transformedEvents;
    // Events contain message and destination. We take the message part of event and run transformation on it.
    // And put back the destination after transforrmation

  }
  return events;
}

exports.userTransformHandlerV1 = userTransformHandlerV1;
