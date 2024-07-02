const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const NodeCache = require('node-cache');
const { getMetadata, getTransformationMetadata } = require('../v0/util');
const stats = require('./stats');
const {
  setupFaasFunction,
  executeFaasFunction,
  FAAS_AST_FN_NAME,
  FAAS_AST_VID,
} = require('./openfaas');
const { getLibraryCodeV1 } = require('./customTransforrmationsStore-v1');

const HASH_SECRET = process.env.OPENFAAS_FN_HASH_SECRET || '';
const libVersionIdsCache = new NodeCache();

function generateFunctionName(userTransformation, libraryVersionIds, testMode, hashSecret = '') {
  if (userTransformation.versionId === FAAS_AST_VID) return FAAS_AST_FN_NAME;

  if (testMode) {
    const funcName = `fn-test-${uuidv4()}`;
    return funcName.substring(0, 63).toLowerCase();
  }

  let ids = [userTransformation.workspaceId, userTransformation.versionId].concat(
    (libraryVersionIds || []).sort(),
  );

  if (hashSecret !== '') {
    ids = ids.concat([hashSecret]);
  }

  // FIXME: Why the id's are sorted ?!
  const hash = crypto.createHash('md5').update(`${ids}`).digest('hex');
  return `fn-${userTransformation.workspaceId}-${hash}`.substring(0, 63).toLowerCase();
}

async function extractRelevantLibraryVersionIdsForVersionId(
  functionName,
  code,
  versionId,
  libraryVersionIds,
  prepopulatedImports,
  testMode,
) {
  if (functionName === FAAS_AST_FN_NAME || versionId == FAAS_AST_VID) return [];

  const cachedLvids = libVersionIdsCache.get(functionName);

  if (cachedLvids) return cachedLvids;

  const libraries = await Promise.all(
    (libraryVersionIds || []).map(async (libraryVersionId) => getLibraryCodeV1(libraryVersionId)),
  );

  const codeImports =
    prepopulatedImports ||
    Object.keys(
      await require('./customTransformer').extractLibraries(
        code,
        versionId,
        false,
        [],
        'pythonfaas',
        testMode,
      ),
    );

  const relevantLvids = [];

  if (libraries && codeImports) {
    libraries.forEach((library) => {
      const libHandleName = library.handleName || _.camelCase(library.name);
      if (codeImports.includes(libHandleName)) {
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
  libraryVersionIds,
  pregeneratedFnName,
  testMode = false,
  trMetadata = {},
) {
  const tags = {
    transformationId: userTransformation.id,
    identifier: 'openfaas',
    testMode,
  };
  const functionName =
    pregeneratedFnName ||
    generateFunctionName(
      userTransformation,
      libraryVersionIds,
      testMode,
      process.env.OPENFAAS_FN_HASH_SECRET,
    );
  const setupTime = new Date();

  await setupFaasFunction(
    functionName,
    userTransformation.code,
    userTransformation.versionId,
    await extractRelevantLibraryVersionIdsForVersionId(
      functionName,
      userTransformation.code,
      userTransformation.versionId,
      libraryVersionIds,
      userTransformation.imports,
      testMode,
    ),
    testMode,
    trMetadata,
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
async function runOpenFaasUserTransform(
  events,
  userTransformation,
  libraryVersionIds,
  testMode = false,
) {
  if (events.length === 0) {
    throw new Error('Invalid payload. No events');
  }

  const trMetadata = events[0].metadata ? getTransformationMetadata(events[0].metadata) : {};
  // check and deploy faas function if not exists
  const functionName = generateFunctionName(
    userTransformation,
    libraryVersionIds,
    testMode,
    process.env.OPENFAAS_FN_HASH_SECRET,
  );

  if (testMode) {
    await setOpenFaasUserTransform(
      userTransformation,
      libraryVersionIds,
      functionName,
      testMode,
      trMetadata,
    );
  }

  return await executeFaasFunction(
    functionName,
    events,
    userTransformation.versionId,
    await extractRelevantLibraryVersionIdsForVersionId(
      functionName,
      userTransformation.code,
      userTransformation.versionId,
      libraryVersionIds,
      userTransformation.imports,
      testMode,
    ),
    testMode,
    trMetadata,
  );
}

module.exports = {
  generateFunctionName,
  runOpenFaasUserTransform,
  setOpenFaasUserTransform,
};
