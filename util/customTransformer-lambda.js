const stats = require("./stats");
const { getMetadata } = require("../v0/util");
const { invokeLambda, setupLambda } = require("./lambda");
const { LOG_DEF_CODE } = require("./lambda/utils");

async function runLambdaUserTransform(
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
    ...metaTags
  };
  if (!testMode && !userTransformation.handleId) {
    stats.counter("missing_handle", 1, tags);
    throw new Error("Handle id is not connected to transformation");
  }

  const functionName = testMode
    ? userTransformation.testName
    : `${userTransformation.workspaceId}_${userTransformation.id}`;
  const qualifier = userTransformation.handleId;
  const invokeTime = new Date();
  const result = await invokeLambda(functionName, events, qualifier);
  stats.timing("lambda_invoke_time", invokeTime, tags);

  return result;
}

async function setLambdaUserTransform(userTransformation, testWithPublish) {
  const tags = {
    transformerVersionId: userTransformation.versionId,
    language: userTransformation.language,
    publish: testWithPublish
  };

  const lambdaCode = LOG_DEF_CODE + userTransformation.code;

  const setupTime = new Date();
  const result = await setupLambda(
    userTransformation.testName,
    lambdaCode,
    testWithPublish
  );
  stats.timing("lambda_test_time", setupTime, tags);

  return result;
}

module.exports = {
  runLambdaUserTransform,
  setLambdaUserTransform
};
