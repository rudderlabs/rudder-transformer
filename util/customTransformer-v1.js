const ivm = require("isolated-vm");
const stats = require("./stats");

const { getPool } = require("./ivmPool");
const { getFactory } = require("./ivmFactory");
const logger = require("../logger");

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
/*
 Transform VM aquire mode is
 on demand if env variable ON_DEMAND_ISOLATE_VM = true | True | TRUE,
 Pooled otherwise
*/
  const isAcquireTransformerIsolatedVMMode = process.env.ON_DEMAND_ISOLATE_VM
  ? process.env.ON_DEMAND_ISOLATE_VM.toLowerCase()  === "true"
  : false;
  if (userTransformation.versionId) {
    const tags = {
      transformerVersionId: userTransformation.versionId
    };

    // Create isolated VMs in pooled or on demand mode based on env var ON_DEMAND_ISOLATE_VM
    let isolatevmPool, isolatevm, isolatevmFactory;
    if (isAcquireTransformerIsolatedVMMode) {
      logger.debug(`Isolate VM being created... `);
      isolatevmFactory = await getFactory(userTransformation.code, libraryVersionIds);
      isolatevm = await isolatevmFactory.create();
      logger.debug(`Isolate VM created... `);
    } else {
      logger.debug(`Pooled transformer VM being created... `);
      isolatevmPool = await getPool(userTransformation, libraryVersionIds);
      isolatevm = await isolatevmPool.acquire();
      stats.gauge("isolate_vm_pool_size", isolatevmPool.size, tags);
      stats.gauge("isolate_vm_pool_available", isolatevmPool.available, tags);
      logger.debug(`Pooled transformer VM created... `);
    }

    // Transform the event...
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

    // Destroy the isolated vm resources created
    if (isAcquireTransformerIsolatedVMMode) {
      logger.debug(`Isolate VM being destroyed... `);
      isolatevmFactory.destroy(isolatevm);
      logger.debug(`Isolate VM destroyed... `);
    } else {
      logger.debug(`Pooled Tranformer VMs being destroyed.. `);
      isolatevmPool.release(isolatevm);
      stats.gauge("isolate_vm_pool_size", isolatevmPool.size, tags);
      stats.gauge("isolate_vm_pool_available", isolatevmPool.available, tags);
      logger.debug(`Pooled Tranformer VMs destroyed.. `);
    }
    return transformedEvents;
    // Events contain message and destination. We take the message part of event and run transformation on it.
    // And put back the destination after transforrmation

  }
  return events;
}

exports.userTransformHandlerV1 = userTransformHandlerV1;
