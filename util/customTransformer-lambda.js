const { parse } = require("@qoretechnologies/python-parser");
const stats = require("./stats");
const { getMetadata } = require("../v0/util");
const { invokeLambda, setupLambda } = require("./lambda");
const { IMPORT_CODE, TRANSFORM_WRAPPER_CODE } = require("./lambda/utils");
const logger = require("../logger");

const validateAndSendFuncDefinition = code => {
  try {
    const supportedFuncNames = ["transformEvent", "transformBatch"];
    const unsupportedFuncNames = ["transformWrapper", "lambda_handler"];
    const availableFuncNames = [];

    const tree = parse(code);
    const funcNames = tree.code
      ?.filter(node => node.type === "def")
      .map(node => node.name);

    for (const fName of funcNames) {
      if (unsupportedFuncNames.includes(fName)) {
        throw new Error(
          `Unsupported function name ${fName}. Rename function to continue`
        );
      }
      if (supportedFuncNames.includes(fName)) {
        availableFuncNames.push(fName);
      }
    }

    if (availableFuncNames.length !== 1) {
      throw new Error(
        `Expected one of ${supportedFuncNames}. Found ${Object.values(
          availableFuncNames
        )}`
      );
    }
    return availableFuncNames[0];
  } catch (err) {
    logger.error(`Code compilation error: ${err.message}`);
    throw new Error(`Code compilation error: ${err.message}`);
  }
};

async function runLambdaUserTransform(
  events,
  userTransformation,
  testMode = false
) {
  const metaTags =
    events.length && events[0].metadata ? getMetadata(events[0].metadata) : {};
  const tags = {
    transformerVersionId: userTransformation.versionId,
    language: userTransformation.language,
    ...metaTags
  };
  if (!testMode && !userTransformation.handleId) {
    throw new Error("Handle id is not connected to transformation");
  }

  const transformationType = validateAndSendFuncDefinition(
    userTransformation.code
  );
  const transformationPayload = {
    events,
    transformationType
  };

  const functionName = testMode
    ? userTransformation.name
    : `${userTransformation.workspaceId}_${userTransformation.name}`;
  const qualifier = userTransformation.handleId;
  const invokeTime = new Date();
  const result = await invokeLambda(
    functionName,
    transformationPayload,
    qualifier
  );
  stats.timing("lambda_invoke_time", invokeTime, tags);

  return result;
}

async function setLambdaUserTransform(userTransformation, testWithPublish) {
  const tags = {
    transformerVersionId: userTransformation.versionId,
    language: userTransformation.language,
    publish: testWithPublish
  };
  validateAndSendFuncDefinition(userTransformation.code);

  const lambdaCode =
    IMPORT_CODE + userTransformation.code + TRANSFORM_WRAPPER_CODE;
  const setupTime = new Date();
  const result = await setupLambda(
    userTransformation.name,
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
