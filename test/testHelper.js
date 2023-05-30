const fs = require('fs');
const path = require('path');

const getFuncTestData = (dirPath, filePath) => {
  const fileData = fs.readFileSync(path.resolve(dirPath, filePath));
  const testData = JSON.parse(fileData);
  return testData;
};

module.exports = {
  getFuncTestData,
};
