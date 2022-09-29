const path = require("path");
const fs = require("fs");

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

module.exports = {
  getRootPathForDestination,
  getWorkflowPath,
  getPlatformBindingsPaths
};
