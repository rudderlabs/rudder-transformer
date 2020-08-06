const integration = "keen";
const name = "keen";

const fs = require("fs");
const path = require("path");

const transformer = require(`../v1/destinations/${integration}/transform`);
// const { compareJSON } = require("./util");

test(`${name} Tests`, () => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);
  inputData.forEach( (input, index) => {
    let output, expected;
    try{
      output =  transformer.process(input);
      expected = expectedData[index]
    } catch(error) {
      output = error.message
      expected = expectedData[index].message
    }
      
      expect(output).toEqual(expected);
   
  });
});
