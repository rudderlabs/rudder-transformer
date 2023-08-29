const {
  getDestFromTestFile,
  executeTransformationTest
} = require("./utilities/test-utils");

executeTransformationTest("af", "processor");
executeTransformationTest("af", "router");
