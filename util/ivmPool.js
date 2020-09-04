const genericPool = require("generic-pool");
const { getFactory } = require("./ivmFactory");
const logger = require("../logger");

const poolCache = {};

const opts = {
  min: 2, // minimum size of the pool
  max: 10 // maximum size of the pool
};

async function getPool(versionId, libraryVersionIds) {
  if (!poolCache[versionId]) { //TODO, do a combo of libraryVersionIds and versionId instead of just versionId
    const factory = await getFactory(versionId, libraryVersionIds);
    poolCache[versionId] = genericPool.createPool(factory, opts);
    logger.debug("spool created");
  }
  return poolCache[versionId];
}

exports.getPool = getPool;
