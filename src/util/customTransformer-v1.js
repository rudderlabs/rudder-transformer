const ivm = require('isolated-vm');

const { getFactory } = require('./ivmFactory');
const { getMetadata, getTransformationMetadata } = require('../v0/util');
const logger = require('../logger');
const stats = require('./stats');

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
  if (!userTransformation.versionId) {
    return { transformedEvents : events };
  }

  const isolatevmFactory = await getFactory(
    userTransformation.code,
    libraryVersionIds,
    userTransformation.versionId,
    userTransformation.secrets || {},
    testMode,
  );

  logger.debug(`Creating IsolateVM`);
  const isolatevm = await isolatevmFactory.create();

  const invokeTime = new Date();
  let transformedEvents;
  let logs;
  let transformationError;

  try {
    transformedEvents = await transform(isolatevm, events);
    logs = isolatevm.logs;
  } catch (err) {
    logger.error(`Error encountered while executing transformation: ${err.message}`);
    transformationError = err;
    throw err;
  } finally {
    logger.debug(`Destroying IsolateVM`);
    isolatevmFactory.destroy(isolatevm);
    // send the observability stats
    const tags = {
      identifier: 'v1',
      errored: transformationError ? true : false,
      ...events.length && events[0].metadata ? getMetadata(events[0].metadata) : {},
      ...events.length && events[0].metadata ? getTransformationMetadata(events[0].metadata) : {}
    }
    stats.counter('user_transform_function_input_events', events.length, tags);
    stats.timing('user_transform_function_latency', invokeTime, tags);
  }

  return { transformedEvents, logs };
}

async function setUserTransformHandlerV1() {
  return { success: true };
}

module.exports = {
  userTransformHandlerV1,
  setUserTransformHandlerV1,
};
