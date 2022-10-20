const {
  setLambdaUserTransform,
  runLambdaUserTransform
} = require("./customTransformer-lambda");

const {
  setOpenfaasUserTransform,
  runOpenFaasUserTransform
} = require("./customTransformer-faas");

// add identifier in constructor to route to set & run functions in future
const pyUserTransformHandler = (identifier = "") => {
  const transformHandler = {
    setUserTransform: async (userTransformation, testWithPublish) => {
      if (identifier === "openfaas") {
        if (!testWithPublish) return { success: true };
        return setOpenfaasUserTransform(userTransformation, testWithPublish);
      }

      return setLambdaUserTransform(userTransformation, testWithPublish);
    },
    runUserTransfrom: async (events, userTransformation, testMode) => {
      if (identifier === "openfaas") {
        return runOpenFaasUserTransform(events, userTransformation, testMode);
      }
      return runLambdaUserTransform(events, userTransformation, testMode);
    }
  };
  return transformHandler;
};

exports.pyUserTransformHandler = pyUserTransformHandler;
