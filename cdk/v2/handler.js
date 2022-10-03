const { WorkflowUtils, WorkflowEngine } = require("rudder-workflow-engine");
const logger = require("../../logger");

const ErrorBuilder = require("../../v0/util/error");
const {
  getRootPathForDestination,
  getWorkflowPath,
  getPlatformBindingsPaths
} = require("./utils");

const destinationWorkflowEngineMap = new Map();

async function getWorkflowEngine(destName, flowType) {
  // Create a new instance of the engine for the destination if needed
  // TODO: Use cache to avoid long living engine objects
  if (!destinationWorkflowEngineMap.has(destName)) {
    try {
      const destRootDir = getRootPathForDestination(destName);
      const workflowPath = await getWorkflowPath(destRootDir, flowType);

      const workflowEngine = new WorkflowEngine(
        WorkflowUtils.createWorkflowFromFilePath(workflowPath),
        destRootDir,
        ...(await getPlatformBindingsPaths())
      );
      destinationWorkflowEngineMap[destName] = workflowEngine;
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
  return destinationWorkflowEngineMap[destName];
}

module.exports = {
  getWorkflowEngine
};
