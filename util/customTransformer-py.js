const stats = require("./stats");
const { getMetadata } = require("../v0/util");
const { invokeLambda, testLambda } = require("./lambda");
const { JSON_IMPORT_CODE, TRANSFORM_WRAPPER_CODE } = require("./lambda/utils");

async function pyUserTransformHandler(
  events,
  userTransformation,
  testMode = false,
  testWithPublish = false
) {
  if (userTransformation.versionId) {
    const metaTags =
      events.length && events[0].metadata
        ? getMetadata(events[0].metadata)
        : {};
    const tags = {
      transformerVersionId: userTransformation.versionId,
      language: userTransformation.language,
      version: 1,
      ...metaTags
    };

    const transformationPayload = {
      events,
      transformationType: "transformEvent"
    };

    let result;
    if (testMode) {
      const lambdaCode =
        JSON_IMPORT_CODE + userTransformation.code + TRANSFORM_WRAPPER_CODE;
      const testTime = new Date();
      result = await testLambda(
        userTransformation.name,
        lambdaCode,
        transformationPayload,
        testWithPublish
      );
      stats.timing("lambda_test_time", testTime, tags);
    } else {
      const functionName = `${userTransformation.workspaceId}_${userTransformation.name}`;
      const qualifier = userTransformation.handlerId;
      const invokeTime = new Date();
      result = await invokeLambda(
        functionName,
        qualifier,
        transformationPayload
      );
      stats.timing("lambda_invoke_time", invokeTime, tags);
    }

    return result;
  }
  return { transformedEvents: events };
}

exports.pyUserTransformHandler = pyUserTransformHandler;
