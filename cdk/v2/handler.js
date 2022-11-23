const {
  WorkflowEngineFactory,
  TemplateType
} = require("rudder-workflow-engine");

const {
  getErrorInfo,
  getRootPathForDestination,
  getWorkflowPath,
  getPlatformBindingsPaths,
  isCdkV2Destination
} = require("./utils");

async function getWorkflowEngineInternal(destName, flowType) {
  const destRootDir = getRootPathForDestination(destName);
  const workflowPath = await getWorkflowPath(destRootDir, flowType);
  const platformBindingsPaths = await getPlatformBindingsPaths();
  return WorkflowEngineFactory.createFromFilePath(workflowPath, destRootDir, {
    bindingsPaths: platformBindingsPaths,
    templateType: TemplateType.JSONATA
  });
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

async function processCdkV2Workflow(
  destType,
  parsedEvent,
  flowType,
  bindings = {}
) {
  try {
    const workflowEngine = await getWorkflowEngine(destType, flowType);

    const result = await workflowEngine.execute(parsedEvent, bindings);
    // TODO: Handle remaining output scenarios
    return result.output;
  } catch (error) {
    throw getErrorInfo(error, isCdkV2Destination(parsedEvent));
  }
}

module.exports = {
  getWorkflowEngine,
  processCdkV2Workflow
};
