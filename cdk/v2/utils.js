const path = require("path");
const fs = require("fs");

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
  return path.join(__dirname, destName);
}

module.exports = {
  getRootPathForDestination,
  getWorkflowPath
};
