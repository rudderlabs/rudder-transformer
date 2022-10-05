const { WorkflowEngineFactory } = require("rudder-workflow-engine");
const logger = require("../../logger");

const ErrorBuilder = require("../../v0/util/error");
const {
  getRootPathForDestination,
  getWorkflowPath,
  getPlatformBindingsPaths
} = require("./utils");

async function getWorkflowEngineInternal(destName, flowType) {
  try {
    const destRootDir = getRootPathForDestination(destName);
    const workflowPath = await getWorkflowPath(destRootDir, flowType);
    return WorkflowEngineFactory.createFromFilePath(
      workflowPath,
      destRootDir,
      await getPlatformBindingsPaths()
    );
  } catch (error) {
    logger.info(
      "Error occurred while creating workflow",
      error,
      destName,
      flowType
    );
    throw new ErrorBuilder()
      .setMessage("Error occurred while creating workflow")
      .setStatus(400)
      .build();
  }
}

const workflowEnginePromiseMap = new Map();

function getWorkflowEngine(destName, flowType) {
  // Create a new instance of the engine for the destination if needed
  // TODO: Use cache to avoid long living engine objects
  workflowEnginePromiseMap[destName] =
    workflowEnginePromiseMap[destName] || new Map();
  if (!workflowEnginePromiseMap[destName][flowType]) {
    workflowEnginePromiseMap[destName][flowType] = getWorkflowEngineInternal(
      destName,
      flowType
    );
  }
  return workflowEnginePromiseMap[destName][flowType];
}

module.exports = {
  getWorkflowEngine
};
