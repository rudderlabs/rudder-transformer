const USER_LEAD_CACHE_TTL = process.env.MARKETO_LEAD_CACHE_TTL
  ? parseInt(process.env.MARKETO_LEAD_CACHE_TTL, 10)
  : 24 * 60 * 60;

const AUTH_CACHE_TTL = process.env.MARKETO_AUTH_CACHE_TTL
  ? parseInt(process.env.MARKETO_AUTH_CACHE_TTL, 10)
  : 60 * 60;

const API_CALL = "api_call_count";

const TRANSFORMER_METRIC = {
  MEASUREMENT: {
    INTEGRATION_ERROR_METRIC: "integration_error_metric"
  },
  // The location at which the error stat was sent
  ERROR_AT: {
    // processor transformation
    PROC: "proc",
    // router transformation
    RT: "rt",
    // batch transformation
    BATCH: "batch",
    // /proxy endpoint(delivery to destination)
    PROXY: "proxy",
    // Default
    UNKNOWN: "unknown"
  },
  TRANSFORMER_STAGE: {
    TRANSFORM: "transform",
    RESPONSE_TRANSFORM: "responseTransform"
  },
  MEASUREMENT_TYPE: {
    API: {
      SCOPE: "api",
      META: {
        ABORTABLE: "abortable",
        RETRYABLE: "retryable",
        THROTTLED: "throttled",
        SUCCESS: "success",
        /**
         * This meta needs to be used when the response is not an expected one from the destination's API
         * This can be during transformation or response handling(during delivery of event)
         */
        UNHANDLED: "unhandled"
      }
    },
    TRANSFORMATION: {
      SCOPE: "transformation",
      META: {
        BAD_EVENT: "badEvent",
        BAD_PARAM: "badParam",
        INSTRUMENTATION: "instrumentation",
        CONFIGURATION: "configuration",
        /**
         * Basically this means that the error is an expected error(thrown during transformation)
         * This meta will be used for CustomError thrown during transformations
         */
        HANDLED: "handled"
      }
    },
    AUTHENTICATION: {
      SCOPE: "authentication"
    },
    EXCEPTION: {
      SCOPE: "exception"
    },
    CDK: {
      SCOPE: "cdk"
    },
    DEFAULT: {
      SCOPE: "default"
    }
  }
};

module.exports = {
  API_CALL,
  AUTH_CACHE_TTL,
  TRANSFORMER_METRIC,
  USER_LEAD_CACHE_TTL
};
