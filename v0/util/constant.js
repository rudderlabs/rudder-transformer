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
        THROTTLED: "throttled"
      }
    },
    TRANSFORMATION: {
      SCOPE: "transformation",
      META: {
        BAD_EVENT: "badEvent",
        BAD_PARAM: "badParam",
        INSTRUMENTATION: "instrumentation",
        CONFIGURATION: "configuration"
      }
    },
    AUTHENTICATION: {
      SCOPE: "authentication"
    },
    EXCEPTION: {
      SCOPE: "exception"
    }
  }
};

module.exports = {
  API_CALL,
  AUTH_CACHE_TTL,
  TRANSFORMER_METRIC,
  USER_LEAD_CACHE_TTL
};
