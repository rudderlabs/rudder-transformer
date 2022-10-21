const { WorkflowEngineFactory } = require("rudder-workflow-engine");

const {
  getRootPathForDestination,
  getWorkflowPath,
  getPlatformBindingsPaths
} = require("./utils");

async function getWorkflowEngineInternal(destName, flowType) {
  const destRootDir = getRootPathForDestination(destName);
  const workflowPath = await getWorkflowPath(destRootDir, flowType);
  const platformBindingsPaths = await getPlatformBindingsPaths();
  return WorkflowEngineFactory.createFromFilePath(
    workflowPath,
    destRootDir,
    platformBindingsPaths
  );
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
