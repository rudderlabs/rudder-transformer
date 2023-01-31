const fs = require('fs');
const path = require('path');

const getTestDataFilePaths = (dirPath) => {
  const dirEntries = fs.readdirSync(dirPath);
  const testDataFilePaths = [];
  dirEntries.forEach(dEntry => {
    const dEntryPath = path.join(dirPath, dEntry);
    const stats = fs.statSync(dEntryPath);
    if (stats.isFile() && dEntry.toLowerCase() === "data.json") {
      testDataFilePaths.push(dEntryPath);
    } else if (stats.isDirectory()) {
      testDataFilePaths.push(...getTestDataFilePaths(dEntryPath));
    }
  });
  return testDataFilePaths;
};

const getTestData = (filePath) => {
  try {
    const tData = JSON.parse(fs.readFileSync(filePath));
    return tData;
  } catch (error) {
    // TODO: Log error here
  }
}

module.exports = {
  getTestDataFilePaths,
  getTestData
}
