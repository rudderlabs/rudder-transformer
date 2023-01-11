const fs = require("fs");

const path = require("path");

let dirIndex;

const { executeTests } = require("./utilities/util");

process.argv.forEach((arg, index) => {
  if (arg.includes("--root")) {
    dirIndex = index;
  }
});
if (!dirIndex) {
  dirIndex = -1;
}
const rootDir =
  dirIndex === -1 ? "test_dirs" : process.argv[dirIndex].split("=")[1];
const tests = path.join(__dirname, rootDir);

// Execute tests
const testFile = inputDataFile => {
  const testData = JSON.parse(inputDataFile);
  describe("Test", () => {
    testData.forEach((dataPoint, index) => {
      executeTests(dataPoint, index);
    });
  });
};

// Get file Paths for test files
function getFilePaths(dir, filePaths = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = `${dir}/${file}`;
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      filePaths.push(filePath);
    } else if (stats.isDirectory()) {
      getFilePaths(filePath, filePaths);
    }
  });
  return filePaths;
}

// Iterate over all the test files(".test.json") in root dir test_dirs(default)
const testDirectory = tests;
const filePaths = getFilePaths(testDirectory);

filePaths.forEach(file => {
  if (path.basename(file).includes(".test.json")) {
    testFile(fs.readFileSync(file));
  }
});
