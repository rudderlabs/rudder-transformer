import { getDestHandler } from "../../src/versionedRouter";

const version = "v0";
const getExecutionPath = (inputData, testType) => {
  let module;
  switch (testType) {
    case "proc_tf":
    case "router_tf":
      module = getDestHandler.process;
      break;
    case "source_tf":
      module = require(`../../src/v0/sources/${inputData.sourceName}/transform`);
      break;
    default:
      break;
  }
  return module;
};

const BASE_URL = "http://localhost:9090";
const executeTests = (dataPoint, index, axiosClient) => {
  const transformer = getExecutionPath(dataPoint, dataPoint.testType);
  switch (dataPoint.testType) {
    case "proc_tf":
      it(`${index}. ${dataPoint.destinationName} destination (proc_tf) tests - ${dataPoint.description}`, async () => {
        const response = await axiosClient.post(
          `${BASE_URL}/${version}/${dataPoint.destinationName}`,
          dataPoint.input
        );
        const output = response.data[0].error
          ? response.data[0]
          : response.data[0].output;
        expect(response.status).toEqual(200);
        expect(output).toEqual(dataPoint.output);
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
};
module.exports = {
  executeTests,
  getExecutionPath
};
