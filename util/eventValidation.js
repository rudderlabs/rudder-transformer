const Ajv = require("ajv");

const NodeCache = require("node-cache");
const _ = require("lodash");
const logger = require("../logger");
const trackingPlan = require("./trackingPlan");
const hash = require("object-hash");
const eventSchemaCache = new NodeCache();
const ajvCache = new NodeCache();
const { isEmptyObject } = require("../v0/util");
const defaultOptions = {
  strictRequired: true,
  allErrors: true,
  verbose: true
  // removeAdditional: false, // "all" - it purges extra properties from event,
  // useDefaults: false
};
const violationTypes = {
  RequiredMissing: "Required-Missing",
  DatatypeMismatch: "Datatype-Mismatch",
  AdditionalProperties: "Additional-Properties",
  UnknownViolation: "Unknown-Violation",
  UnplannedEvent: "Unplanned-Event"
};

// TODO: Handle various json schema versions
let ajv = new Ajv(defaultOptions);

// safety check to check if event has TpID,TpVersion associated
function checkForPropertyMissing(property) {
  if (!(property && property !== "")) {
    throw `${property} doesnt exist for event`;
  }
}

function eventSchemaHash(tpId, tpVersion, eventType, eventName) {
  return `${tpId}::${tpVersion}::${eventType}::${eventName}`;
}

/**
 *
 * @param {*} arg
 * @returns {type}
 *
 * Returns type of passed arg
 * Ajv Error objects info : https://ajv.js.org/api.html#error-objects
 *
 */
async function validate(event) {
  try {
    checkForPropertyMissing(event.metadata.trackingPlanId);
    checkForPropertyMissing(event.metadata.trackingPlanVersion);
    checkForPropertyMissing(event.metadata.workspaceId);

    const sourceTpConfig = event.metadata.sourceTpConfig;
    const eventSchema = await trackingPlan.getEventSchema(
      event.metadata.trackingPlanId,
      event.metadata.trackingPlanVersion,
      event.message.type,
      event.message.event,
      event.metadata.workspaceId
    );

    // UnPlanned event case - since no event schema is found. Violation is raised
    if (!eventSchema || eventSchema === {}) {
      rudderValidationError = {
        type: violationTypes.UnplannedEvent,
        message: `no schema for eventName : ${event.message.event}, eventType : ${event.message.type} in trackingPlanID : ${event.metadata.trackingPlanId}::${event.metadata.trackingPlanVersion}`,
        meta: {}
      };
      return [rudderValidationError];
    }

    //Current json schema is injected with version for non-track events in config-be, need to remove ot parse it succesfully
    delete eventSchema["version"];

    const schemaHash = eventSchemaHash(
      event.metadata.trackingPlanId,
      event.metadata.trackingPlanVersion,
      event.message.type,
      event.message.event
    );
    const eventTypeAjvOptions = sourceTpConfig[event.message.type].ajvOptions;
    const globalAjvOptions = sourceTpConfig.global.ajvOptions;
    const merged = {
      ...defaultOptions,
      ...globalAjvOptions,
      ...eventTypeAjvOptions
    };
    if (merged !== {}) {
      const configHash = hash(merged);
      ajv = ajvCache.get(configHash);
      if (!ajv) {
        ajv = new Ajv(merged);
        ajvCache.set(configHash, ajv);
      }
    }

    let validateEvent = eventSchemaCache.get(schemaHash);
    if (!validateEvent) {
      validateEvent = ajv.compile(eventSchema);
      eventSchemaCache.set(schemaHash, validateEvent);
    }

    const valid = validateEvent(event.message.properties);
    if (valid) {
      return [];
    }
    var validationErrors = validateEvent.errors.map(function(error) {
      var rudderValidationError;
      switch (error.keyword) {
        case "required":
          rudderValidationError = {
            type: violationTypes.RequiredMissing,
            message: error.message,
            meta: {
              instacePath: error.instancePath,
              schemaPath: error.schemaPath,
              missingProperty: error.params.missingProperty
            }
          };
          break;
        case "type":
          rudderValidationError = {
            type: violationTypes.DatatypeMismatch,
            message: error.message,
            meta: {
              instacePath: error.instancePath,
              schemaPath: error.schemaPath
            }
          };
          break;
        case "additionalProperties":
          rudderValidationError = {
            type: violationTypes.AdditionalProperties,
            message: `${error.message} : ${error.params.additionalProperty}`,
            meta: {
              instacePath: error.instancePath,
              schemaPath: error.schemaPath
            }
          };
          break;
        default:
          rudderValidationError = {
            type: violationTypes.UnknownViolation,
            message: "Unexpected error during event validation",
            meta: {
              error: error
            }
          };
      }
      return rudderValidationError;
    });
    return validationErrors;
  } catch (error) {
    throw error;
  }
}

async function handleValidation(event) {
  let dropEvent = false;
  let dropEventViolationType = "None";

  try {
    const sourceTpConfig = event.metadata.sourceTpConfig;
    const mergedTpConfig = event.metadata.mergedTpConfig;

    if (isEmptyObject(sourceTpConfig) || isEmptyObject(mergedTpConfig)) {
      return {
        dropEvent: dropEvent,
        dropEventViolationType: dropEventViolationType,
        ValidationErrors: []
      };
    }

    const validationErrors = await validate(event);
    if (validationErrors.length === 0) {
      return {
        dropEvent: dropEvent,
        dropEventViolationType: dropEventViolationType,
        ValidationErrors: validationErrors
      };
    }

    const violationsByType = new Set(validationErrors.map(err => err.type));
    for (const [key, value] of Object.entries(mergedTpConfig)) {
      switch (key) {
        case "allowUnplannedEvents": {
          const exists = violationsByType.has(violationTypes.UnplannedEvent);
          if (value === "false" && exists) {
            dropEvent = true;
            dropEventViolationType = transformer.UnplannedEvent;
            break;
          }
          if (!(value === "true" || value === "false")) {
            logger.error(`Unknown option ${value} in ${key}"`);
          }
          break;
        }
        case "unplannedProperties": {
          const exists = violationsByType.has(violationTypes.UnplannedEvent);
          if (value === "drop" && exists) {
            dropEvent = true;
            dropEventViolationType = transformer.AdditionalProperties;
            break;
          }
          if (!(value === "forward" || value === "drop")) {
            logger.error(`Unknown option ${value} in ${key}"`);
          }
          break;
        }
        case "anyOtherViolation": {
          const exists1 = violationsByType.has(violationTypes.UnknownViolation);
          const exists2 = violationsByType.has(violationTypes.DatatypeMismatch);
          const exists3 = violationsByType.has(violationTypes.RequiredMissing);
          if (value === "drop" && (exists1 || exists2 || exists3)) {
            if (exists1) {
              dropEventViolationType = violationTypes.UnknownViolation;
            } else if (exists2) {
              dropEventViolationType = violationTypes.DatatypeMismatch;
            } else {
              dropEventViolationType = violationTypes.RequiredMissing;
            }
            dropEvent = true;
            break;
          }
          if (!(value === "forward" || value === "drop")) {
            logger.error(`Unknown option ${value} in ${key}"`);
          }
          break;
        }
        case "sendViolatedEventsTo": {
          if (value !== "procErrors") {
            logger.error(`Unknown option ${value} in ${key}"`);
          }
          break;
        }
        case "ajvOptions":
        default:
          logger.error(`Unknown option ${value} in ${key} in eventSchema config"`);
      }
    }

    return {
      dropEvent: dropEvent,
      dropEventViolationType: dropEventViolationType,
      ValidationErrors: validationErrors
    };
  } catch (error) {
    throw error;
  }
}

exports.handleValidation = handleValidation;
