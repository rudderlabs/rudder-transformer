const name = "Proxy";
const fs = require("fs");
const path = require("path");
const { mockedAxiosClient } = require("../__mocks__/network");
const destinations = ["marketo", "braze"];
const deleteUserDestinations = ["am", "intercom", "braze"];
const service = require("../versionedRouter").handleProxyRequest;
const amProcessDeleteUsers = require("../v0/destinations/am/deleteUsers").processDeleteUsers;
const brazeProcessDeleteUsers = require("../v0/destinations/braze/deleteUsers").processDeleteUsers;
const intercomProcessDeleteUsers = require("../v0/destinations/intercom/deleteUsers").processDeleteUsers;

jest.mock("axios", () => jest.fn(mockedAxiosClient));

const deleteUserFileMapping = {
  "am": amProcessDeleteUsers,
  "braze": brazeProcessDeleteUsers,
  "intercom": intercomProcessDeleteUsers
}

// start of generic tests
const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/proxy_input.json`)
);
const outputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/proxy_output.json`)
);
const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

inputData.forEach((input, index) => {
  it(`${name} Tests: payload - ${index}`, async () => {
    try {
      const output = await service("any", input);
      expect(output).toEqual(expectedData[index]);
    } catch (error) {
      expect(error).toEqual(expectedData[index]);
    }
  });
});
// end of generic tests

// destination tests start
destinations.forEach(destination => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${destination}_proxy_input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${destination}_proxy_output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);

  inputData.forEach((input, index) => {
    it(`${name} Tests: ${destination} - Payload ${index}`, async () => {
      try {
        const output = await service(destination, input);
        expect(output).toEqual(expectedData[index]);
      } catch (error) {
        expect(error).toEqual(expectedData[index]);
      }
    });
  });
});
// destination tests end

// delete user tests 

deleteUserDestinations.forEach(destination => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${destination}_deleteUsers_proxy_input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${destination}_deleteUsers_proxy_output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);

  inputData.forEach((input, index) => {
    it(`${name} Tests: ${destination} - Payload ${index}`, async () => {
      try {
        const method = deleteUserFileMapping[destination];
        const output = await method(input);
        console.log(output)
        expect(output).toEqual(expectedData[index]);
      } catch (error) {
        expect(error.message).toEqual(expectedData[index].error);
      }
    });
  });
});