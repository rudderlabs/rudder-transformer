const integration = "dynamicConfig";
const name = "dynamicConfig";
const vRouter = require("../versionedRouter");
const { processDynamicConfig } = require("./../util/dynamicConfig");

const fs = require("fs");
const path = require("path");
const version = "v0";

const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_input.json`)
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${integration}_output.json`)
  );

const inputData = JSON.parse(inputDataFile);
const expectedData = JSON.parse(outputDataFile);

// inputData.request.body.forEach((input,index) => {
it(`Testing: handleDest`, async () => {
    // try{
    const output = processDynamicConfig(inputData.request.body, "router");
    expect(output).toEqual(expectedData);
    // expect(output).toEqual(expectedData[index]);
    // }catch(error){
    //     expect(error.message).toEqual(expectedData[index].error);
    // }
  });
// });
