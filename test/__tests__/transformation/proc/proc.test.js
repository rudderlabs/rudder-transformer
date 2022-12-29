const { readdirSync } = require("fs");
const path = require("path");
const { formAxiosMock } = require("../../../__mocks__/gen-axios.mock");

const destinations = readdirSync(path.join(__dirname, "data"), {
  withFileTypes: true
})
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

destinations.forEach(destination => {
  const inputData = require(`./data/${destination}/input.json`);
  const expectedData = require(`./data/${destination}/output.json`);
  const {
    process
  } = require(`../../../../src/v0/destinations/${destination}/transform`);

  if (process) {
    describe(`${destination} Processor Tests`, () => {
      beforeAll(() => {
        const axiosResponses = inputData
          .filter(inp => Array.isArray(inp.mockNetworkResponses))
          .map(inp => inp.mockNetworkResponses);
        formAxiosMock(axiosResponses);
      });

      inputData.forEach(async (input, index) => {
        it(`Payload - ${index}`, async () => {
          try {
            const output = await process(input);
            expect(output).toEqual(expectedData[index]);
          } catch (error) {
            expect(error.message).toEqual(expectedData[index].error);
          }
        });
      });
    });
  }
});
