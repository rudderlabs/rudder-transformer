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

async function getWorkflowEngine(destName, flowType, bindings = {}) {
  const destRootDir = getRootPathForDestination(destName);
  const workflowPath = await getWorkflowPath(destRootDir, flowType);
  const platformBindingsPaths = await getPlatformBindingsPaths();
  return WorkflowEngineFactory.createFromFilePath(workflowPath, {
    rootPath: destRootDir,
    bindingsPaths: platformBindingsPaths,
    creationTimeBindings: bindings,
    templateType: TemplateType.JSON_TEMPLATE
  });
}

const workflowEnginePromiseMap = new Map();

function getCachedWorkflowEngine(destName, flowType, bindings = {}) {
  // Create a new instance of the engine for the destination if needed
  // TODO: Use cache to avoid long living engine objects
  workflowEnginePromiseMap[destName] =
    workflowEnginePromiseMap[destName] || new Map();
  if (!workflowEnginePromiseMap[destName][flowType]) {
    workflowEnginePromiseMap[destName][flowType] = getWorkflowEngine(
      destName,
      flowType,
      bindings
    );
  }
  return workflowEnginePromiseMap[destName][flowType];
}

async function process(workflowEngine, parsedEvent) {
  try {
    const result = await workflowEngine.execute(parsedEvent);
    // TODO: Handle remaining output scenarios
    return result.output;
  } catch (error) {
    throw getErrorInfo(error, isCdkV2Destination(parsedEvent));
  }
}

async function processCdkV2Workflow(
  destType,
  parsedEvent,
  flowType,
  bindings = {}
) {
  try {
    const workflowEngine = await getWorkflowEngine(destType, flowType);
    return process(workflowEngine, parsedEvent, bindings);
  } catch (error) {
    throw getErrorInfo(error, isCdkV2Destination(parsedEvent));
  }
}

module.exports = {
  getWorkflowEngine,
  getCachedWorkflowEngine,
  processCdkV2Workflow,
  process
};
