const name = "DeleteUsers";
const logger = require("../logger");
const { mockedAxiosClient } = require("../__mocks__/network");
const { formAxiosMock, validateMockAxiosClientReqParams } = require("../__mocks__/gen-axios.mock");
const deleteUserDestinations = [
  "am",
  "braze",
  "intercom",
  "mp",
  "af",
  "clevertap",
  "engage",
  "ga"
];
const { handleDeletionOfUsers } = require("../versionedRouter");
const { default: axios } = require("axios");
const version = "v0";

const buildPrepareDeleteRequestTestCases = () => {
  const testCases = deleteUserDestinations
  .reduce((acc, currentVal) => {
    try {
      const delUsers = require(`../${version}/destinations/${currentVal}/deleteUsers`);
      const inputJson = require(`./data/deleteUsers/${currentVal}/prepare_req_input.json`);
      const outputJson = require(`./data/deleteUsers/${currentVal}/prepare_req_output.json`);
      acc.push({
        inputJson,
        outputJson,
        destination: currentVal,
        method: delUsers?.prepareDeleteRequest
      });
    } catch (error) {
      // Do nothing
    }
    return acc;
  }, [])
  .map(({ inputJson, outputJson, method, destination })  => {
    const cases = inputJson.map((reqInput, ind) => {
      
      return [
        destination,
        {
          input: reqInput,
          prepareDeleteRequest: method,
          expected: outputJson[ind],
          index: ind
        }
      ];
    });
    return cases;
  }).flat();
  return testCases;
}
const reqBuildTestCases = buildPrepareDeleteRequestTestCases();

describe("DeleteUsers request build tests", () => {
  describe.each(reqBuildTestCases)(
    ".prepareDeleteRequest(%s)",
    (_destination, { input, prepareDeleteRequest, expected, index }) => {
      test(`Payload - ${index}`, () => {
        expect(
          prepareDeleteRequest?.(
            input.userAttributes,
            input.config,
            input.destInfo
          )
        ).toEqual(expected);
      });
    }
  );
});

// delete user tests
deleteUserDestinations.forEach(destination => {
  const inputData = require(`./data/deleteUsers/${destination}/handler_input.json`);
  const expectedData = require(`./data/deleteUsers/${destination}/handler_output.json`);

  let axiosResponses;
  describe(`${name} Tests: ${destination}`, () => {
    beforeAll(() => {
      try {
        axiosResponses = require(`./data/deleteUsers/${destination}/nw_client_data.json`);
      } catch (error) {
        // Do nothing
        logger.error(
          `Error while reading /deleteUsers/${destination}/nw_client_data.json: ${error}`
        );
      }
      if (Array.isArray(axiosResponses)) {
        formAxiosMock(axiosResponses);
      } else {
        // backward compatibility
        jest.mock("axios");
        axios.mockImplementation(mockedAxiosClient);
      }
    });

    inputData.forEach((input, index) => {
      it(`Payload - ${index}`, async () => {
        try {
          input.get = jest.fn(destInfoKey => {
            return input.getValue && input.getValue[destInfoKey];
          });

          const output = await handleDeletionOfUsers(input);
          // validate the axios arguments
          if (Array.isArray(axiosResponses) && Array.isArray(axiosResponses[index])) {
            axiosResponses[index].forEach(axsRsp => {
              validateMockAxiosClientReqParams({ 
                resp: axsRsp
              })
            })
          }
          expect(output).toEqual(expectedData[index]);
        } catch (error) {
          expect(error.message).toEqual(expectedData[index].error);
        }
      });
    });
  });
});
