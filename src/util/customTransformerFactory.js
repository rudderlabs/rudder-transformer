const { setOpenFaasUserTransform, runOpenFaasUserTransform } = require('./customTransformer-faas');

const { userTransformHandlerV1, setUserTransformHandlerV1 } = require('./customTransformer-v1');

const UserTransformHandlerFactory = (userTransformation) => {
  const transformHandler = {
    setUserTransform: async (libraryVersionIds) => {
      switch (userTransformation.language) {
        case 'pythonfaas':
          return setOpenFaasUserTransform(userTransformation, libraryVersionIds);
        default:
          return setUserTransformHandlerV1();
      }
    },

    runUserTransfrom: async (events, testMode, libraryVersionIds) => {
      switch (userTransformation.language) {
        case 'pythonfaas':
        case 'python':
          return runOpenFaasUserTransform(events, userTransformation, libraryVersionIds, testMode);
        default:
          return userTransformHandlerV1(events, userTransformation, libraryVersionIds, testMode);
      }
    },
  };
  return transformHandler;
};

exports.UserTransformHandlerFactory = UserTransformHandlerFactory;
