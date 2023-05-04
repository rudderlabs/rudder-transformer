const { ConfigFactory, Executor } = require('rudder-transformer-cdk');
const { CustomError } = require('rudder-transformer-cdk/build/error');
const { TRANSFORMER_METRIC } = require('rudder-transformer-cdk/build/constants');
const path = require('path');

const basePath = path.resolve(__dirname);
ConfigFactory.init({ basePath, loggingMode: 'production' });

const tags = require('../../v0/util/tags');
const { generateErrorObject } = require('../../v0/util');
const {
  TransformationError,
  ConfigurationError,
  InstrumentationError,
} = require('../../v0/util/errorTypes');

const defTags = {
  [tags.TAG_NAMES.IMPLEMENTATION]: tags.IMPLEMENTATIONS.CDK_V1,
};

/**
 * Translates CDK errors into transformer errors
 * @param {} err The error object
 * @returns An error type which the transformer recognizes
 */
function getErrorInfo(err) {
  if (err instanceof CustomError) {
    let errInstance = '';
    switch (err.statTags?.meta) {
      case TRANSFORMER_METRIC.MEASUREMENT_TYPE.CDK.META.BAD_CONFIG:
        errInstance = new TransformationError(
          `Bad transformer configuration file. Original error: ${err.message}`,
        );
        break;

      case TRANSFORMER_METRIC.MEASUREMENT_TYPE.CDK.META.CONFIGURATION:
        errInstance = new ConfigurationError(`Bad configuration. Original error: ${err.message}`);
        break;

      case TRANSFORMER_METRIC.MEASUREMENT_TYPE.CDK.META.TF_FUNC:
        errInstance = new TransformationError(
          `Bad pre/post transformation function. Original error: ${err.message}`,
        );
        break;

      case TRANSFORMER_METRIC.MEASUREMENT_TYPE.CDK.META.BAD_EVENT:
      case TRANSFORMER_METRIC.MEASUREMENT_TYPE.CDK.META.INSTRUMENTATION:
        errInstance = new InstrumentationError(`Bad event. Original error: ${err.message}`);
        break;

      case TRANSFORMER_METRIC.MEASUREMENT_TYPE.CDK.META.EXCEPTION:
        errInstance = new TransformationError(
          `Unknown error occurred. Original error: ${err.message}`,
        );
        break;
      default:
        break;
    }
    if (err.statTags.scope === TRANSFORMER_METRIC.MEASUREMENT_TYPE.EXCEPTION.SCOPE) {
      errInstance = new TransformationError(
        `Unknown error occurred. Original error: ${err.message}`,
      );
    }
    if (errInstance) {
      return generateErrorObject(errInstance, defTags);
    }
  }

  return generateErrorObject(err, defTags);
}

async function processCdkV1(destType, parsedEvent) {
  try {
    const tfConfig = await ConfigFactory.getConfig(destType);
    const respEvents = await Executor.execute(parsedEvent, tfConfig);
    return respEvents;
  } catch (error) {
    throw getErrorInfo(error);
  }
}

module.exports = {
  processCdkV1,
};
