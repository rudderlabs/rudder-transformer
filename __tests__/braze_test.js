const integration = "braze";
const name = "Braze";

const fs = require("fs");
const path = require("path");
const transformer = require(`../v0/${integration}/transform`);
// const { compareJSON } = require("./util"); 
jest.setTimeout(30000);
test(`${name} Tests`, async () => {

  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);

  inputData.forEach(async (input, index) => {
    var outputArr = transformer.process(input);   
    outputArr.forEach((output, innerIndex) => {  
      expect(output).toEqual(expectedData[index][innerIndex]);
    })
  } 
  );  
});