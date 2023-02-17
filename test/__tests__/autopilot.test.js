const {
  getDestFromTestFile,
  executeTransformationTest
} = require("./utilities/test-utils");

executeTransformationTest(getDestFromTestFile(__filename), "processor");
executeTransformationTest(getDestFromTestFile(__filename), "router");
