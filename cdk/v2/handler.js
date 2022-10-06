const { WorkflowUtils, WorkflowEngine } = require("rudder-workflow-engine");
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
    const destRootDir = getRootPathForDestination(destName);
    const workflowPath = await getWorkflowPath(destRootDir, flowType);

    const workflowEngine = new WorkflowEngine(
      WorkflowUtils.createFromFilePath(workflowPath),
      destRootDir,
      await getPlatformBindingsPaths()
    );
    destinationWorkflowEngineMap[destName] = workflowEngine;
  }
  return destinationWorkflowEngineMap[destName];
}

module.exports = {
  getWorkflowEngine
};
