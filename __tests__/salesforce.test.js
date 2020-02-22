const integration = "salesforce";
const name = "Salesforce";

const fs = require("fs");
const path = require("path");
const transformer = require(`../v0/${integration}/transform`);
// const { compareJSON } = require("./util");
jest.setTimeout(30000);
test(`${name} Tests`,  async () => {
 
  const inputDataFile =  fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_input.json`)
  );
  const outputDataFile =  fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_output.json`)
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile); 
   
  for (let [index, value] of inputData.entries()) {
    var output = await transformer.process(value);  
    output.header.Authorization = '' 
    expectedData[index].header.Authorization='' 
    expect(output).toEqual(expectedData[index]);
  };  

});
  