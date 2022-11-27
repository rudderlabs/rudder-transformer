const logger = require("../../logger");
const { setOpenFaasUserTransform } = require("../customTransformer-faas");
const { getTransformationCode } = require("../customTransforrmationsStore");
const {
  getAllTransformationHandles
} = require("../customTransforrmationsStore-v1");

async function migrate(versionId) {
  const transformation = await getTransformationCode(versionId);
  return setOpenFaasUserTransform(transformation, true);
}

async function lambdaMigrationsHandler() {
  const { transformationHandles } = await getAllTransformationHandles();
  logger.debug(
    `Fetched all transformation handles: ${transformationHandles.length}`
  );

  await Promise.all(
    transformationHandles.map(async handle => {
      await migrate(handle.versionId);
    })
  );

  return { success: true };
}

exports.lambdaMigrationsHandler = lambdaMigrationsHandler;
