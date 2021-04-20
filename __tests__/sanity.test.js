const name = "Sanity";
const path = require("path");
const version = "v0";
const { getDirectories } = require("./util");

const integrations = getDirectories(
  path.resolve(__dirname, `../${version}/destinations/`)
);

const inputDataFile = fs.readFileSync(
  path.resolve(__dirname, `./data/sanity/sanity_input.json`)
);

const sanityInput = JSON.parse(inputDataFile);
const { messages, config } = sanityInput;

integrations.forEach(intg => {
  const transformer = require(`../${version}/destinations/${intg}/transform`);
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/sanity/${intg}_output.json`)
  );
  const expectedData = JSON.parse(outputDataFile);

  messages.forEach(message, index => {
    const event = {
      message,
      destination: config[`${intg}`]
    };

    it(`${name} - integration: ${intg} payload:${index}`, async () => {
      try {
        const output = await transformer.process(event);
        expect(output).toEqual(expectedData);
      } catch (error) {
        expect(error.message).toEqual(expectedData.error);
      }
    });
  });
});

console.log(output);
