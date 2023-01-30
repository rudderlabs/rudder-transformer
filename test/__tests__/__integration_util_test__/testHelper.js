const fs = require('fs');
const path = require('path');

const getFuncTestData = (funcName) => {
  const fileData = fs.readFileSync(path.resolve(__dirname, `./data/${funcName}.json`));
  const testData = JSON.parse(fileData);
  return testData;
};

module.exports = {
  getFuncTestData,
};
