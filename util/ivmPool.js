const genericPool = require("generic-pool");
const { getFactory } = require("./ivmFactory");
const logger = require("../logger");

const poolCache = {};

const opts = {
  max: 10, // maximum size of the pool
  min: 2 // minimum size of the pool
};

async function getPool(versionId) {
  if (!poolCache[versionId]) {
    const factory = await getFactory(versionId);
    poolCache[versionId] = genericPool.createPool(factory, opts);
    logger.debug("Shanmukh:pool created");
  }
  return poolCache[versionId];
}

exports.getPool = getPool;
