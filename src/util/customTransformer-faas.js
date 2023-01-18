const { v4: uuidv4 } = require('uuid');
const stats = require('./stats');
const { getMetadata } = require('../v0/util');
const { setupFaasFunction, executeFaasFunction } = require('./openfaas');

function generateFunctionName(userTransformation, testMode) {
  if (testMode) {
    const funcName = `fn-test-${userTransformation.testName?.replace('_', '-')}-${uuidv4()}`;
    return funcName.substring(0, 63).toLowerCase();
  }

  return `fn-${userTransformation.workspaceId}-${userTransformation.versionId}`
    .substring(0, 63)
    .toLowerCase();
}

async function setOpenFaasUserTransform(
  userTransformation,
  testWithPublish,
  pregeneratedFnName,
  testMode = false,
) {
  if (!testWithPublish) {
    return { success: true };
  }

  const tags = {
    transformerVersionId: userTransformation.versionId,
    language: userTransformation.language,
    identifier: 'openfaas',
    publish: testWithPublish,
    testMode,
  };
  const functionName = pregeneratedFnName || generateFunctionName(userTransformation, testMode);
  const setupTime = new Date();

  await setupFaasFunction(
    functionName,
    userTransformation.code,
    userTransformation.versionId,
    testMode,
  );

  stats.timing('creation_time', setupTime, tags);
  return { success: true, publishedVersion: functionName };
}
/**
 * Runs the user transformation code
 * In testMode, the function is deployed, executed and then deleted
 * In production mode, the function is executed directly
 * if function is not found, it is deployed and returns retryable error
 */
async function runOpenFaasUserTransform(events, userTransformation, testMode = false) {
  if (events.length === 0) {
    throw new Error('Invalid payload. No events');
  }
  const metaTags = events[0].metadata ? getMetadata(events[0].metadata) : {};
  const tags = {
    transformerVersionId: userTransformation.versionId,
    language: userTransformation.language,
    identifier: 'openfaas',
    testMode,
    ...metaTags,
  };

  // check and deploy faas function if not exists
  const functionName = generateFunctionName(userTransformation, testMode);
  if (testMode) {
    await setOpenFaasUserTransform(userTransformation, true, functionName, testMode);
  }

  const invokeTime = new Date();

  const result = await executeFaasFunction(
    functionName,
    events,
    userTransformation.versionId,
    testMode,
  );
  stats.timing('run_time', invokeTime, tags);
  return result;
}

module.exports = {
  generateFunctionName,
  runOpenFaasUserTransform,
  setOpenFaasUserTransform,
};
