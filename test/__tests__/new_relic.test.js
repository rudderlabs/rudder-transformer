const {
  getDestFromTestFile,
  executeTransformationTest
} = require("./utilities/test-utils");

executeTransformationTest(getDestFromTestFile(__filename), "processor");
