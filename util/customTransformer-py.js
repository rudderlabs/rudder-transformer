const {
  setLambdaUserTransform,
  runLambdaUserTransform
} = require("./customTransformer-lambda");

// add identifier in constructor to route to set & run functions in future
const pyUserTransformHandler = () => {
  const transformHandler = {
    setUserTransform: async (userTransformation, testWithPublish) => {
      return setLambdaUserTransform(userTransformation, testWithPublish);
    },
    runUserTransfrom: async (events, userTransformation, testMode) => {
      return runLambdaUserTransform(events, userTransformation, testMode);
    }
  };
  return transformHandler;
};

exports.pyUserTransformHandler = pyUserTransformHandler;
