const path = require("path");
const fs = require("fs/promises");
const {
  WorkflowExecutionError,
  WorkflowCreationError
} = require("rudder-workflow-engine");
const logger = require("../../logger");
const ErrorBuilder = require("../../v0/util/error");
const { TRANSFORMER_METRIC } = require("../../v0/util/constant");

const CDK_V2_ROOT_DIR = __dirname;

async function getWorkflowPath(
  destDir,
  flowType = TRANSFORMER_METRIC.ERROR_AT.UNKNOWN
) {
  // The values are of array type to support aliases
  const flowTypeMap = {
    // Didn't add any prefix as processor transformation is the default
    [TRANSFORMER_METRIC.ERROR_AT.PROC]: ["workflow.yaml", "procWorkflow.yaml"],
    [TRANSFORMER_METRIC.ERROR_AT.RT]: ["rtWorkflow.yaml"],
    // Note: intentionally avoided the `proxy` term here
    [TRANSFORMER_METRIC.ERROR_AT.PROXY]: ["dataDeliveryWorkflow.yaml"],
    [TRANSFORMER_METRIC.ERROR_AT.BATCH]: ["batchWorkflow.yaml"]
  };

  const workflowFilenames = flowTypeMap[flowType];
  // Find the first workflow file that exists
  const files = await fs.readdir(destDir);
  const matchedFilename = workflowFilenames?.find(filename =>
    files.includes(filename)
  );
  let validWorkflowFilepath;
  if (matchedFilename) {
    validWorkflowFilepath = path.join(destDir, matchedFilename);
  }

  if (!validWorkflowFilepath) {
    throw new ErrorBuilder()
      .setMessage(
        "Unable to identify the workflow file. Invalid flow type input"
      )
      .setStatus(400)
      .build();
  }
  return validWorkflowFilepath;
}

function getRootPathForDestination(destName) {
  // TODO: Resolve the CDK v2 destination directory
  // path from the root directory
  return path.join(CDK_V2_ROOT_DIR, destName);
}

async function getPlatformBindingsPaths() {
  const allowedExts = [".js"];
  const bindingsPaths = [];
  const bindingsDir = path.join(CDK_V2_ROOT_DIR, "bindings");
  const files = await fs.readdir(bindingsDir);
  files.forEach(fileName => {
    const { ext } = path.parse(fileName);
    if (allowedExts.includes(ext.toLowerCase())) {
      bindingsPaths.push(path.resolve(bindingsDir, fileName));
    }
  });

  return bindingsPaths;
}

/**
 * Return message with workflow engine metadata
 * @param {*} err
 */
function getWorkflowEngineErrorMessage(err) {
  return `${err.message}: Workflow: ${err.workflowName}, Step: ${err.stepName}, ChildStep: ${err.childStepName}`;
}

function getErrorInfo(err, isProd) {
  // Handle various CDK error types
  let errorInfo = err;
  const message = isProd ? getWorkflowEngineErrorMessage(err) : err.message;

  if (err instanceof WorkflowExecutionError) {
    logger.error(
      `Error occurred during workflow step execution:  Workflow: ${err.workflowName}, Step: ${err.stepName}, ChildStep: ${err.childStepName}`,
      err
    );
    errorInfo = {
      message,
      status: err.status,
      destinationResponse: err.error?.destinationResponse,
      statTags: err.error?.statTags,
      authErrorCategory: err.error?.authErrorCategory
    };
    // TODO: Add a special stat tag to bump the priority of the error
  } else if (err instanceof WorkflowCreationError) {
    logger.error(
      `Error occurred during workflow creation. Workflow: ${err.workflowName}, Step: ${err.stepName}, ChildStep: ${err.childStepName}`,
      err
    );
    errorInfo = {
      message,
      status: err.status,
      statTags: {
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.CDK.SCOPE
      }
    };
  }
  return errorInfo;
}

function isCdkV2Destination(event) {
  return Boolean(
    event?.destination?.DestinationDefinition?.Config?.cdkV2Enabled
  );
}

function getCdkV2TestThreshold(event) {
  return (
    event.destination?.DestinationDefinition?.Config?.cdkV2TestThreshold || 0
  );
}

module.exports = {
  getRootPathForDestination,
  getWorkflowPath,
  getPlatformBindingsPaths,
  getErrorInfo,
  isCdkV2Destination,
  getCdkV2TestThreshold
};
