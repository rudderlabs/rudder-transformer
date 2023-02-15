const fs = require('fs');
const path = require('path');

const getTestDataFilePaths = (dirPath) => {
  const dirEntries = fs.readdirSync(dirPath);
  const testDataFilePaths = [];
  dirEntries.forEach(dEntry => {
    const dEntryPath = path.join(dirPath, dEntry);
    const stats = fs.statSync(dEntryPath);
    if (stats.isFile() && dEntry.toLowerCase() === "data.js") {
      testDataFilePaths.push(dEntryPath);
    } else if (stats.isDirectory()) {
      testDataFilePaths.push(...getTestDataFilePaths(dEntryPath));
    }
  });
  return testDataFilePaths;
};

const getTestData = (filePath) => {
  return require(filePath).data;
}

module.exports = {
  getTestDataFilePaths,
  getTestData
}
