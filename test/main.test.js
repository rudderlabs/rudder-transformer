const fs = require("fs");

const path = require("path");

let dirIndex;

const supertest = require("supertest");

const app = require("./app");

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

const version = "v0";

const destRoutePath = `/${version}/destinations/`;
const sourceRoutePath = `/${version}/sources/`;

// execution
const executeTests = (dataPoint, index) => {
  switch (dataPoint.testType) {
    case "proc_tf":
      it(`${index}. ${dataPoint.destinationName} destination (proc_tf) tests - ${dataPoint.description}`, async () => {
        let response = await supertest(app.callback())
          .post(`${destRoutePath}${dataPoint.destinationName}`)
          .set("Accept", "application/json")
          .send(dataPoint.input);
        expect(response.statusCode).toBe(200);
        response = JSON.parse(response.text);
        expect(response[0]).toEqual(dataPoint.output);
      });
      break;
    case "router_tf":
      it(`${index}. ${dataPoint.destinationName} destination (router_tf) tests -`, async () => {
        let response = await supertest(app.callback())
          .post(`/routerTransform`)
          .send(dataPoint.input);
        expect(response.statusCode).toBe(200);
        response = JSON.parse(response.text);
        expect(response.output).toEqual(dataPoint.output);
      });
      break;
    case "source_tf":
      it(`${index}. ${dataPoint.sourceName} Source Tests: payload: ${index}`, async () => {
        let response = await supertest(app.callback())
          .post(`${sourceRoutePath}${dataPoint.sourceName}`)
          .send(dataPoint.input);
        console.log(response);
        expect(response.statusCode).toBe(200);
        response = JSON.parse(response.text);
        console.log(`source: ${response}`);
        expect(response[0].error ? response[0] : response[0].output).toEqual(
          dataPoint.output
        );
      });
      break;
    default:
      break;
  }
};

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

// Iterate over all the files in test_dirs
const testDirectory = tests;
const filePaths = getFilePaths(testDirectory);

filePaths.forEach(file => {
  if (path.basename(file).includes(".test.json")) {
    testFile(fs.readFileSync(file));
  }
});

// const executeTests = (dataPoint, index) => {
//   const transformer = getExecutionPath(dataPoint, dataPoint.testType);
//   switch (dataPoint.testType) {
//     case "proc_tf":
//       it(`${index}. ${dataPoint.destinationName} destination (proc_tf) tests - ${dataPoint.description}`, async () => {
//         const response = await axiosClient.post(
//           `${BASE_URL}/${version}/${dataPoint.destinationName}`,
//           dataPoint.input
//         );
//         const output = response.data[0].error
//           ? response.data[0]
//           : response.data[0].output;
//         expect(response.status).toEqual(200);
//         expect(output).toEqual(dataPoint.output);
//       });
//       break;
//     case "router_tf":
//       it(`${index}. ${dataPoint.destinationName} destination (router_tf) tests -`, async () => {
//         const output = await getDestHandler(
//           version,
//           dataPoint.destinationName
//         ).processRouterDest(dataPoint.input);
//         expect(output).toEqual(dataPoint.output);
//       });
//       break;
//     case "source_tf":
//       it(`${index}. ${dataPoint.sourceName} Source Tests: payload: ${index}`, () => {
//         try {
//           const output = transformer.process(dataPoint.input);
//           expect(output).toEqual(dataPoint.output);
//         } catch (error) {
//           expect(error.message).toEqual(dataPoint.output);
//         }
//       });
//       break;
//     default:
//       break;
//   }
// };

// // Execute tests
// const testFile = inputDataFile => {
//   const testData = JSON.parse(inputDataFile);
//   describe("Test", () => {
//     testData.forEach((dataPoint, index) => {
//       executeTests(dataPoint, index, axiosClient);
//     });
//   });
// };
