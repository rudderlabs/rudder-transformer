const fs = require("fs");

const path = require("path");

const rootDir = "test_dirs";

const tests = path.join(__dirname, rootDir);

const { getDestHandler } = require("../src/versionedRouter");
const version = "v0";

// fs.readdir(tests, (err, files) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   files.forEach(file => {
//     testFs.push(file);
//   });
// });

// fs.stat("/path/to/file-or-directory", (err, stats) => {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   if (stats.isFile()) {
//     console.log("It is a file.");
//   } else if (stats.isDirectory()) {
//     console.log("It is a directory.");
//   }
// });

const getExecutionPath = (inputData, testType) => {
  let module;
  switch (testType) {
    case "proc_tf":
    case "router_tf":
      module = getDestHandler.process;
      break;
    case "source_tf":
      module = require(`../src/v0/sources/${inputData.sourceName}/transform`);
      break;
    default:
      break;
  }
  return module;
};

// Execute tests
const testFile = inputDataFile => {
  const testData = JSON.parse(inputDataFile);
  describe("Test", () => {
    testData.forEach((dataPoint, index) => {
      const transformer = getExecutionPath(dataPoint, dataPoint.testType);
      switch (dataPoint.testType) {
        case "proc_tf":
          it(`${index}. ${dataPoint.destinationName} destination (proc_tf) tests - ${dataPoint.description}`, async () => {
            try {
              const output = await getDestHandler(
                version,
                dataPoint.destinationName
              ).process(dataPoint.input);
              expect(output).toEqual(dataPoint.output);
            } catch (error) {
              expect(error.message).toEqual(dataPoint.output.error);
            }
          });
          break;
        case "router_tf":
          it(`${index}. ${dataPoint.destinationName} destination (router_tf) tests -`, async () => {
            const output = await getDestHandler(
              version,
              dataPoint.destinationName
            ).processRouterDest(dataPoint.input);
            expect(output).toEqual(dataPoint.output);
          });
          break;
        case "source_tf":
          it(`${index}. ${dataPoint.sourceName} Source Tests: payload: ${index}`, () => {
            try {
              const output = transformer.process(dataPoint.input);
              expect(output).toEqual(dataPoint.output);
            } catch (error) {
              expect(error.message).toEqual(dataPoint.output);
            }
          });
          break;
        default:
          break;
      }
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

// Iterate over all the files in test_dirs
const testDirectory = tests;
const filePaths = getFilePaths(testDirectory);

filePaths.forEach(file => {
  if (path.extname(file) === ".json") {
    testFile(fs.readFileSync(file));
  }
});
