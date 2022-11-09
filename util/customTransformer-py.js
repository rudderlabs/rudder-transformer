const {
  setLambdaUserTransform,
  runLambdaUserTransform
} = require("./customTransformer-lambda");

const {
  setOpenFaasUserTransform,
  runOpenFaasUserTransform
} = require("./customTransformer-faas");

const DEFAULT_PYTHON_TRANSFORMATION_HANDLER_TYPE = "openfaas";

// add identifier in constructor to route to set & run functions in future
const pyUserTransformHandler = () => {
  const handlerType =
    process.env.PYTHON_TRANSFORMATION_HANDLER_TYPE ||
    DEFAULT_PYTHON_TRANSFORMATION_HANDLER_TYPE;

  const transformHandler = {
    setUserTransform: async (userTransformation, testWithPublish) => {
      if (handlerType === "openfaas") {
        if (!testWithPublish) return { success: true };
        return setOpenFaasUserTransform(userTransformation, testWithPublish);
      }

      return setLambdaUserTransform(userTransformation, testWithPublish);
    },
    runUserTransfrom: async (events, userTransformation, testMode) => {
      if (handlerType === "openfaas") {
        return runOpenFaasUserTransform(events, userTransformation, testMode);
      }
      return runLambdaUserTransform(events, userTransformation, testMode);
    }
  };
  return transformHandler;
};

exports.pyUserTransformHandler = pyUserTransformHandler;
