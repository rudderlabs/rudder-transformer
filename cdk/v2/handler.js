const { WorkflowUtils } = require("rudder-workflow-engine");
const { WorkflowEngine } = require("rudder-workflow-engine");
const {
  getRootPathForDestination,
  getWorkflowPath,
  getPlatformBindingsPaths
} = require("./utils");

const destinationWorkflowEngineMap = new Map();

function getWorkflowEngine(destName) {
  // Create a new instance of the engine for the destination if needed
  // TODO: Use cache to avoid long living engine objects
  if (!destinationWorkflowEngineMap.has(destName)) {
    const destRootDir = getRootPathForDestination(destName);
    const workflowPath = getWorkflowPath(destRootDir);

    const workflowEngine = new WorkflowEngine(
      WorkflowUtils.createFromFilePath(workflowPath),
      destRootDir,
      getPlatformBindingsPaths()
    );
    destinationWorkflowEngineMap[destName] = workflowEngine;
  }
  return destinationWorkflowEngineMap[destName];
}

module.exports = {
  getWorkflowEngine
};
