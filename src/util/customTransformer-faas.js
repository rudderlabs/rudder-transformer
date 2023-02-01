const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const NodeCache = require('node-cache');
const stats = require('./stats');
const { getMetadata } = require('../v0/util');
const { setupFaasFunction, executeFaasFunction } = require('./openfaas');
const { getLibraryCodeV1 } = require('./customTransforrmationsStore-v1');
const { extractLibraries } = require('./libExtractor');

const libVersionIdsCache = new NodeCache();

function generateFunctionName(userTransformation, testMode) {
  if (testMode) {
    const funcName = `fn-test-${uuidv4()}`;
    return funcName.substring(0, 63).toLowerCase();
  }

  userTransformation.libraryVersionIds = userTransformation.libraryVersionIds || [];
  const ids = [userTransformation.workspaceId, userTransformation.versionId].concat(userTransformation.libraryVersionIds);
  const hash = crypto.createHash('md5').update(`${ids}`).digest('hex');

  return `fn-${userTransformation.workspaceId}-${hash}`
    .substring(0, 63)
    .toLowerCase();
}

async function extractRelevantLibraryVersionIdsForVersionId(functionName, versionId, libraryVersionIds) {
  const cachedLvids = libVersionIdsCache.get(functionName);

  if (cachedLvids) return cachedLvids;

  const libraries = await Promise.all(
    libraryVersionIds.map(async (libraryVersionId) => getLibraryCodeV1(libraryVersionId)),
  );

  const relevantLvids = [];

  if (libraries) {
    const extractedLibraries = Object.keys(await extractLibraries(null, versionId, "pythonfaas"));

    libraries.forEach((library) => {
      const libHandleName = library.handleName || _.camelCase(library.name);
      if (extractedLibraries.includes(libHandleName)) {
        relevantLvids.push(library.versionId);
      }
    });
  } else {
    throw new Error(`Failed to extract library version ids for function ${functionName}`);
  }

  libVersionIdsCache.set(functionName, relevantLvids);
  return relevantLvids;
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
    extractRelevantLibraryVersionIdsForVersionId(functionName, userTransformation.versionId, userTransformation.libraryVersionIds),
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

  const libraries = await Promise.all(
    libraryVersionIds.map(async (libraryVersionId) => getLibraryCodeV1(libraryVersionId)),
  );

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
    extractRelevantLibraryVersionIdsForVersionId(functionName, userTransformation.versionId, userTransformation.libraryVersionIds),
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
