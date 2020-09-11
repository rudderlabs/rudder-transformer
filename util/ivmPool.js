const genericPool = require("generic-pool");
const { getFactory } = require("./ivmFactory");
const logger = require("../logger");

const poolCache = {};

const opts = {
  min: 2, // minimum size of the pool
  max: 10 // maximum size of the pool
};

async function getPool(versionId, libraryVersionIds) {
  const poolId = versionId + libraryVersionIds.sort().toString();
  if (!poolCache[poolId]) {
    const factory = await getFactory(versionId, libraryVersionIds);
    poolCache[poolId] = genericPool.createPool(factory, opts);

    // Added to stop retrying and infinite loop on error
    // TODO: Figure out if we should we do this
    poolCache[poolId].on("factoryCreateError", error => {
      // eslint-disable-next-line no-underscore-dangle
      poolCache[poolId]._waitingClientsQueue.dequeue().reject(error);
    });

    logger.debug("pool created");
  }
  return poolCache[poolId];
}

exports.getPool = getPool;
