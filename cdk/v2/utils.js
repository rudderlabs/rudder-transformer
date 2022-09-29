const path = require("path");
const fs = require("fs");
const {
  WorkflowExecutionError
} = require("rudder-workflow-engine/build/errors");
const { logger } = require("handlebars");
const { WorkflowEngineError } = require("rudder-workflow-engine/build/errors");
const { TRANSFORMER_METRIC } = require("../../v0/util/constant");

const CDK_V2_ROOT_DIR = __dirname;

function getWorkflowPath(destDir) {
  let workflowPath;
  // TODO: Defaulted to `workflow.yaml` but should support others as well
  const defWorkflowPath = path.join(destDir, "workflow.yaml");
  if (fs.existsSync(defWorkflowPath)) {
    workflowPath = defWorkflowPath;
  }

  return workflowPath;
}

function getRootPathForDestination(destName) {
  // TODO: Resolve the CDK v2 destination directory
  // path from the root directory
  return path.join(CDK_V2_ROOT_DIR, destName);
}

function getPlatformBindingsPaths() {
  const allowedExts = [".js"];
  const bindingsPaths = [];
  const bindingsDir = path.join(CDK_V2_ROOT_DIR, "bindings");
  fs.readdir(bindingsDir, (err, files) => {
    if (err) return;

    files.forEach(fileName => {
      const { ext } = path.parse(fileName);
      if (allowedExts.includes(ext.toLowerCase())) {
        bindingsPaths.push(path.resolve(bindingsDir, fileName));
      }
    });
  });
  return bindingsPaths;
}

function getErrorInfo(err) {
  // Handle various CDK error types
  let errorInfo = err;
  if (err instanceof WorkflowExecutionError) {
    logger.error(
      "Error occurred during workflow step execution: ",
      err.stepName
    );
    errorInfo = {
      message: err.message,
      status: err.status,
      destinationResponse: err.error.destinationResponse,
      statTags: err.error.statTags,
      authErrorCategory: err.error.authErrorCategory
    };
    // TODO: Add a special stat tag to bump the priority of the error
  } else if (err instanceof WorkflowEngineError) {
    logger.error("Error occurred during workflow step: ", err.stepName);
    errorInfo = {
      message: err.message,
      status: err.status,
      statTags: {
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.CDK.SCOPE
      }
    };
  }
  return errorInfo;
}

module.exports = {
  getRootPathForDestination,
  getWorkflowPath,
  getPlatformBindingsPaths,
  getErrorInfo
};
