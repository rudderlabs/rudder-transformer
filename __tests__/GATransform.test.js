const gat = require("../v0/ga/transform");

const fs = require("fs");
const path = require("path");

const compareJSON = (obj1, obj2) => {
  const ret = {};
  for (let i in obj2) {
    if (!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
      ret[i] = obj2[i];
    }
  }
  return ret;
};

test("test output", () => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, "./GA-data/input.json")
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, "./GA-data/output.json")
  );
  const inputData = JSON.parse(inputDataFile);
  const expectedData = JSON.parse(outputDataFile);
  const output = gat.process(inputData);
  console.log(output);
  console.log(expectedData);
  console.log(compareJSON(output, expectedData));
  expect(output).toEqual(expectedData);
});
