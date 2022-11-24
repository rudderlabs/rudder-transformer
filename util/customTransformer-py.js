const {
  setLambdaUserTransform,
  runLambdaUserTransform
} = require("./customTransformer-lambda");

const {
  setOpenFaasUserTransform,
  runOpenFaasUserTransform
} = require("./customTransformer-faas");

const OPENFAAS = "openfaas";
const handler = process.env.PYTHON_TRANSFORMATION_HANDLER || OPENFAAS;

const pyUserTransformHandler = () => {
  const transformHandler = {
    setUserTransform: async (userTransformation, testWithPublish) => {
      if (handler === OPENFAAS) {
        return setOpenFaasUserTransform(userTransformation, testWithPublish);
      }
      return setLambdaUserTransform(userTransformation, testWithPublish);
    },

    runUserTransfrom: async (events, userTransformation, testMode) => {
      if (handler === OPENFAAS) {
        return runOpenFaasUserTransform(events, userTransformation, testMode);
      }
      return runLambdaUserTransform(events, userTransformation, testMode);
    }
  };
  return transformHandler;
};

exports.pyUserTransformHandler = pyUserTransformHandler;
