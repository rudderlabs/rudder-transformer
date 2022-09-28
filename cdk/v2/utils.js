const path = require("path");

function getRootPathForDestination(destName) {
  // TODO: Resolve the CDK v2 destination directory 
  // path from the root directory
  return path.join(__dirname, destName);
}

module.exports = {
  getRootPathForDestination
};
