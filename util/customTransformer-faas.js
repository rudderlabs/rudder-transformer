const { v4: uuidv4 } = require("uuid");
const stats = require("./stats");
const { getMetadata } = require("../v0/util");
const { setupFaasFunction, executeFaasFunction } = require("./openfaas");

function generateFunctionName(userTransformation, testMode) {
  if (testMode) {
    const funcName = `fn
      -${userTransformation.testName.replace("_", "-")}
      -${uuidv4()}`;
    return funcName.substring(0, 63).toLowerCase();
  }

  return `fn-${userTransformation.workspaceId}-${userTransformation.versionId}`
    .substring(0, 63)
    .toLowerCase();
}

async function setOpenFaasUserTransform(userTransformation, testWithPublish) {
  if (!testWithPublish) {
    return { success: true };
  }

  const tags = {
    transformerVersionId: userTransformation.versionId,
    language: userTransformation.language,
    identifier: "openfaas",
    publish: testWithPublish
  };
  const functionName = generateFunctionName(userTransformation, false);
  const setupTime = new Date();

  await setupFaasFunction(
    functionName,
    userTransformation.code,
    userTransformation.versionId,
    false
  );

  stats.timing("faas_publish_time", setupTime, tags);
  return { success: true, publishedVersion: functionName };
}

async function runOpenFaasUserTransform(
  events,
  userTransformation,
  testMode = false
) {
  if (events.length === 0) {
    throw new Error("Invalid payload. No events");
  }
  const metaTags = events[0].metadata ? getMetadata(events[0].metadata) : {};
  const tags = {
    transformerVersionId: userTransformation.versionId,
    language: userTransformation.language,
    identifier: "openfaas",
    ...metaTags
  };
  if (!testMode && !userTransformation.handleId) {
    stats.counter("missing_handle", 1, tags);
    throw new Error("Handle id is not connected to transformation");
  }

  // check and deploy faas function if not exists
  await setOpenFaasUserTransform(userTransformation, true);

  const invokeTime = new Date();
  const functionName = generateFunctionName(userTransformation, testMode);
  const result = await executeFaasFunction(functionName, events, testMode);
  stats.timing("faas_invoke_time", invokeTime, tags);
  return result;
}

module.exports = {
  runOpenFaasUserTransform,
  setOpenFaasUserTransform
};
