const ivm = require('isolated-vm');

const { getFactory } = require('./ivmFactory');
const { getMetadata } = require('../v0/util');
const logger = require('../logger');
const prometheus = require('./prometheus');

const userTransformTimeout = parseInt(process.env.USER_TRANSFORM_TIMEOUT || '600000', 10);

async function transform(isolatevm, events) {
  const transformationPayload = {};
  transformationPayload.events = events;
  transformationPayload.transformationType = isolatevm.fName;
  const executionPromise = new Promise(async (resolve, reject) => {
    const sharedTransformationPayload = new ivm.ExternalCopy(transformationPayload).copyInto({
      transferIn: true,
    });
    try {
      await isolatevm.bootstrapScriptResult.apply(
        undefined,
        [
          isolatevm.fnRef,
          new ivm.Reference(resolve),
          new ivm.Reference(reject),
          sharedTransformationPayload,
        ],
        { timeout: 4000 },
      );
    } catch (error) {
      reject(error.message);
    }
  });

  let setTimeoutHandle;
  const timeoutPromise = new Promise((_, reject) => {
    setTimeoutHandle = setTimeout(() => {
      reject(new Error('Timed out'));
    }, userTransformTimeout);
  });
  return Promise.race([executionPromise, timeoutPromise])
    .catch((e) => {
      throw new Error(e);
    })
    .finally(() => clearTimeout(setTimeoutHandle));
}

function calculateMsFromIvmTime(value) {
  return (value[0] + value[1] / 1e9) * 1000;
}

async function userTransformHandlerV1(
  events,
  userTransformation,
  libraryVersionIds,
  testMode = false,
) {
  /*
  Removing pool usage to address memory leaks
  Env variable ON_DEMAND_ISOLATE_VM is not being used anymore
  */
  if (userTransformation.versionId) {
    const metaTags = events.length && events[0].metadata ? getMetadata(events[0].metadata) : {};
    const tags = {
      transformerVersionId: userTransformation.versionId,
      version: 1,
      ...metaTags,
    };

    logger.debug(`Isolate VM being created... `);
    const isolatevmFactory = await getFactory(
      userTransformation.code,
      libraryVersionIds,
      userTransformation.versionId,
      testMode,
    );
    const isolatevm = await isolatevmFactory.create();
    logger.debug(`Isolate VM created... `);

    // Transform the event...
    prometheus.getMetrics()?.eventsIntoVm.inc(tags, events.length);
    // TODO REMOVE stats.counter('events_into_vm', events.length, tags);
    const isolateStartWallTime = calculateMsFromIvmTime(isolatevm.isolateStartWallTime);
    const isolateStartCPUTime = calculateMsFromIvmTime(isolatevm.isolateStartCPUTime);

    let transformedEvents;
    // Destroy isolatevm in case of execution errors
    try {
      transformedEvents = await transform(isolatevm, events);
    } catch (err) {
      logger.error(`Error encountered while executing transformation: ${err.message}`);
      isolatevmFactory.destroy(isolatevm);
      throw err;
    }
    const { logs } = isolatevm;
    const isolateEndWallTime = calculateMsFromIvmTime(isolatevm.isolate.wallTime);
    const isolateEndCPUTime = calculateMsFromIvmTime(isolatevm.isolate.cpuTime);
    console.log('Isolate VM cpu execution time isolateStartCPUTime: ', isolateStartCPUTime);
    console.log('Isolate VM cpu execution time isolateEndCPUTime: ', isolateEndCPUTime);
    console.log('Isolate VM cpu execution time isolateStartWallTime: ', isolateStartWallTime);
    console.log('Isolate VM wall execution time isolateEndWallTime: ', isolateEndWallTime);

    if (isFinite(isolateEndWallTime - isolateStartWallTime)) {
      prometheus
        .getMetrics()
        ?.isolateWallTime.observe(tags, (isolateEndWallTime - isolateStartWallTime) / 1000);
    }
    if (isFinite(isolateEndCPUTime - isolateStartCPUTime)) {
      prometheus
        .getMetrics()
        ?.isolateCpuTime.observe(tags, (isolateEndCPUTime - isolateStartCPUTime) / 1000);
    }
    // TODO REMOVE stats.timing('isolate_wall_time', isolateEndWallTime - isolateStartWallTime, tags);
    // TODO REMOVE stats.timing('isolate_cpu_time', isolateEndCPUTime - isolateStartCPUTime, tags);

    // Destroy the isolated vm resources created
    logger.debug(`Isolate VM being destroyed... `);
    isolatevmFactory.destroy(isolatevm);
    logger.debug(`Isolate VM destroyed... `);

    return { transformedEvents, logs };
    // Events contain message and destination. We take the message part of event and run transformation on it.
    // And put back the destination after transforrmation
  }
  return { transformedEvents: events };
}

async function setUserTransformHandlerV1() {
  return { success: true };
}

module.exports = {
  userTransformHandlerV1,
  setUserTransformHandlerV1,
};
