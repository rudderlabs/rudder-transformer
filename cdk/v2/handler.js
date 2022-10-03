const { WorkflowUtils, WorkflowEngine } = require("rudder-workflow-engine");
const logger = require("../../logger");

const ErrorBuilder = require("../../v0/util/error");
const {
  getRootPathForDestination,
  getWorkflowPath,
  getPlatformBindingsPaths
} = require("./utils");

const destinationWorkflowEngineMap = new Map();

function getWorkflowEngine(destName, flowType) {
  // Create a new instance of the engine for the destination if needed
  // TODO: Use cache to avoid long living engine objects
  if (!destinationWorkflowEngineMap.has(destName)) {
    try {
      const destRootDir = getRootPathForDestination(destName);
      const workflowPath = getWorkflowPath(destRootDir, flowType);

      const workflowEngine = new WorkflowEngine(
        WorkflowUtils.createWorkflowFromFilePath(workflowPath),
        destRootDir,
        ...getPlatformBindingsPaths()
      );
      destinationWorkflowEngineMap[destName] = workflowEngine;
    } catch (error) {
      logger.error(error);
      throw new ErrorBuilder()
        .setMessage("Unable to create workflow engine")
        .setStatus(400)
        .build();
    }
  }
  return destinationWorkflowEngineMap[destName];
}

module.exports = {
  getWorkflowEngine
};
