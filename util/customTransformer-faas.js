const { v4: uuidv4 } = require("uuid");
const stats = require("./stats");
const { getMetadata } = require("../v0/util");
const { run, setupFunction } = require("./openfaas");
const { logger } = require("handlebars");

function generateFunctionName(userTransformation, testMode) {
  if (testMode) {
    const funcName = `fn-${userTransformation.testName
      .replace("_", "-")
      .toLowerCase()}-${uuidv4()}`;
    return funcName.substring(0, 63);
  }

  return `fn-${userTransformation.workspaceId.toLowerCase()}-${userTransformation.versionId.toLowerCase()}`;
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

  // const qualifier = userTransformation.handleId;
  const invokeTime = new Date();

  const result = await run(
    generateFunctionName(userTransformation, testMode),
    events,
    userTransformation.code,
    userTransformation.versionId,
    testMode
  );

  stats.timing("faas_invoke_time", invokeTime, tags);

  return result.data;
}

async function setOpenFaasUserTransform(userTransformation, testWithPublish) {
  const tags = {
    transformerVersionId: userTransformation.versionId,
    language: userTransformation.language,
    identifier: "openfaas",
    publish: testWithPublish
  };

  const setupTime = new Date();
  const functionName = generateFunctionName(userTransformation, false);

  await setupFunction(
    functionName,
    userTransformation.code,
    userTransformation.versionId,
    false
  );

  stats.timing("faas_publish_time", setupTime, tags);

  return { success: true, publishedVersion: functionName };
}

module.exports = {
  runOpenFaasUserTransform,
  setOpenFaasUserTransform
};
