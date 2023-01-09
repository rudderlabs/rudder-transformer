const {
  WorkflowEngineFactory,
  TemplateType
} = require("rudder-workflow-engine");

const tags = require("../../v0/util/tags");

const defTags = {
  [tags.TAG_NAMES.IMPLEMENTATION]: tags.IMPLEMENTATIONS.CDK_V2
};

const {
  getErrorInfo,
  getRootPathForDestination,
  getWorkflowPath,
  getPlatformBindingsPaths,
  isCdkV2Destination
} = require("./utils");

async function getWorkflowEngine(destName, feature, bindings = {}) {
  const destRootDir = getRootPathForDestination(destName);
  const workflowPath = await getWorkflowPath(destRootDir, feature);
  const platformBindingsPaths = await getPlatformBindingsPaths();
  return WorkflowEngineFactory.createFromFilePath(workflowPath, {
    rootPath: destRootDir,
    bindingsPaths: platformBindingsPaths,
    creationTimeBindings: bindings,
    templateType: TemplateType.JSON_TEMPLATE
  });
}

const workflowEnginePromiseMap = new Map();

function getCachedWorkflowEngine(destName, feature, bindings = {}) {
  // Create a new instance of the engine for the destination if needed
  // TODO: Use cache to avoid long living engine objects
  workflowEnginePromiseMap[destName] =
    workflowEnginePromiseMap[destName] || new Map();
  if (!workflowEnginePromiseMap[destName][feature]) {
    workflowEnginePromiseMap[destName][feature] = getWorkflowEngine(
      destName,
      feature,
      bindings
    );
  }
  return workflowEnginePromiseMap[destName][feature];
}

async function process(workflowEngine, parsedEvent) {
  try {
    const result = await workflowEngine.execute(parsedEvent);
    // TODO: Handle remaining output scenarios
    return result.output;
  } catch (error) {
    throw getErrorInfo(error, isCdkV2Destination(parsedEvent), defTags);
  }
}

async function processCdkV2Workflow(
  destType,
  parsedEvent,
  feature,
  bindings = {}
) {
  try {
    const workflowEngine = await getCachedWorkflowEngine(
      destType,
      feature,
      bindings
    );
    return process(workflowEngine, parsedEvent);
  } catch (error) {
    throw getErrorInfo(error, isCdkV2Destination(parsedEvent), defTags);
  }
}

module.exports = {
  getWorkflowEngine,
  getCachedWorkflowEngine,
  processCdkV2Workflow,
  process
};
