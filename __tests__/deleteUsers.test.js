const name = "DeleteUsers";
const logger = require("../logger");
const { mockedAxiosClient } = require("../__mocks__/network");
const formAxiosMock = require("../__mocks__/gen-axios.mock");
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



// delete user tests
deleteUserDestinations.forEach(destination => {
  const inputData = require(`./data/${destination}_deleteUsers_proxy_input.json`);
  const expectedData = require(`./data/${destination}_deleteUsers_proxy_output.json`);
  
  describe(`${name} Tests: ${destination}`, () => {
    beforeAll(() => {
      let axiosResponses;
      try {
        axiosResponses = require(`./data/${destination}_deleteUsers_response.json`);
      } catch (error) {
       // Do nothing
       logger.error(`Error while reading ${destination}_deleteUsers_response.json: ${error}`)
      }
      if (Array.isArray(axiosResponses)) {
        formAxiosMock(axiosResponses);
      } else {
        // backward compatibility
        jest.mock("axios");
        axios.mockImplementation(mockedAxiosClient);
      }
    })
    inputData.forEach((input, index) => {
      it(`Payload - ${index}`, async () => {
        try {
          input.get = jest.fn(destInfoKey => {
            return input.getValue && input.getValue[destInfoKey];
          });

          const output = await handleDeletionOfUsers(input);
          expect(output).toEqual(expectedData[index]);
        } catch (error) {
          expect(error.message).toEqual(expectedData[index].error);
        }
      });
    });
  });
});
