/* Ajv meta load to support draft-04/06/07/2019 */
const Ajv2019 = require('ajv/dist/2019');
const Ajv = require('ajv-draft-04');
const draft7MetaSchema = require('ajv/dist/refs/json-schema-draft-07.json');
const draft6MetaSchema = require('ajv/dist/refs/json-schema-draft-06.json');
const addFormats = require('ajv-formats');

const NodeCache = require('node-cache');
const hash = require('object-hash');
const logger = require('../logger');
const trackingPlan = require('./trackingPlan');

const eventSchemaCache = new NodeCache();
const ajv19Cache = new NodeCache({ useClones: false });
const ajv4Cache = new NodeCache({ useClones: false });
const { isEmptyObject } = require('../v0/util');

const defaultOptions = {
  strictRequired: true,
  allErrors: true,
  verbose: true,
  allowUnionTypes: true,
  // removeAdditional: false, // "all" - it purges extra properties from event,
  // useDefaults: false
};
const violationTypes = {
  RequiredMissing: 'Required-Missing',
  DatatypeMismatch: 'Datatype-Mismatch',
  AdditionalProperties: 'Additional-Properties',
  UnknownViolation: 'Unknown-Violation',
  UnplannedEvent: 'Unplanned-Event',
};

const supportedEventTypes = {
  group: true,
  track: true,
  identify: true,
  page: true,
  screen: true,
  alias: false,
};

// When no ajv options are provided, ajv constructed from defaultOptions will be used
const ajv4 = new Ajv(defaultOptions);
addFormats(ajv4);

const ajv19 = new Ajv2019(defaultOptions);
addFormats(ajv19);
ajv19.addMetaSchema(draft6MetaSchema);
ajv19.addMetaSchema(draft7MetaSchema);

/**
 * @param {*} ajvOptions
 * @param {*} isDraft4
 * @returns {ajv}
 *
 * Generates new ajv contructed from ajvoptions
 */
function getAjv(ajvOptions, isDraft4 = false) {
  if (isDraft4) {
    const ajv = new Ajv(ajvOptions);
    addFormats(ajv);
    return ajv;
  }
  const ajv = new Ajv2019(ajvOptions);
  ajv.addMetaSchema(draft6MetaSchema);
  ajv.addMetaSchema(draft7MetaSchema);
  addFormats(ajv);
  return ajv;
}

/**
 * @param {*} property
 *
 * Safety check to check if event has TpID, TpVersion associated with it.
 * Else throws an error.
 */
function checkForPropertyMissing(property) {
  if (!(property && property !== '')) {
    throw new Error(`${property} does not exist for event`);
  }
}

/**
 * @param {*} eventType
 *
 * Checks if the event type is supported or not.
 * @returns true If it is supported.
 * @returns false If it is not supported or it is not present in supportedEventTypes.
 */
function isEventTypeSupported(eventType) {
  if (!Object.prototype.hasOwnProperty.call(supportedEventTypes, eventType)) {
    return false;
  }
  return supportedEventTypes[eventType];
}

/**
 * @param {*} tpId
 * @param {*} tpVersion
 * @param {*} eventType
 * @param {*} eventName
 * @returns {string}
 *
 * Generates hash.
 */
function eventSchemaHash(tpId, tpVersion, eventType, eventName, isDraft4 = false) {
  return `${tpId}::${tpVersion}::${eventType}::${eventName}::${isDraft4 ? 4 : 19}`;
}

/**
 * @param {*} event
 * @returns {validationErrors}
 *
 * Validate the eventSchema against properties and returns validationErrors.
 */
async function validate(event) {
  try {
    checkForPropertyMissing(event.metadata.trackingPlanId);
    checkForPropertyMissing(event.metadata.trackingPlanVersion);
    checkForPropertyMissing(event.metadata.workspaceId);

    const { sourceTpConfig, trackingPlanId, trackingPlanVersion, workspaceId } = event.metadata;
    const eventSchema = await trackingPlan.getEventSchema(
      trackingPlanId,
      trackingPlanVersion,
      event.message.type,
      event.message.event,
      workspaceId,
    );

    // UnPlanned event case - since no event schema is found. Violation is raised
    // Return this violation error only in case of track calls.
    if (!eventSchema || eventSchema === {}) {
      if (event.message.type !== 'track') {
        return [];
      }
      const rudderValidationError = {
        type: violationTypes.UnplannedEvent,
        message: `no schema for event: ${event.message.event}`,
        meta: {},
      };
      return [rudderValidationError];
    }
    // Assumes schema is in draft 7 by default
    let isDraft4 = false;
    if (
      Object.prototype.hasOwnProperty.call(eventSchema, '$schema') &&
      eventSchema.$schema.includes('draft-04')
    ) {
      isDraft4 = true;
    }

    // Current json schema is injected with version for non-track events in config-be, need to remove ot parse it succesfully
    delete eventSchema.version;

    const schemaHash = eventSchemaHash(
      trackingPlanId,
      trackingPlanVersion,
      event.message.type,
      event.message.event,
      isDraft4,
    );
    const eventTypeAjvOptions = sourceTpConfig[event.message.type]?.ajvOptions || {};
    const globalAjvOptions = (sourceTpConfig.global && sourceTpConfig.global.ajvOptions) || {};
    const merged = {
      ...defaultOptions,
      ...globalAjvOptions,
      ...eventTypeAjvOptions,
    };

    let ajv = isDraft4 ? ajv4 : ajv19;
    const ajvCache = isDraft4 ? ajv4Cache : ajv19Cache;
    if (merged !== {}) {
      const configHash = hash(merged);
      ajv = ajvCache.get(configHash);
      if (!ajv) {
        ajv = getAjv(merged, isDraft4);
        ajvCache.set(configHash, ajv);
      }
    }

    let validateEvent = eventSchemaCache.get(schemaHash);
    if (!validateEvent) {
      validateEvent = ajv.compile(eventSchema);
      eventSchemaCache.set(schemaHash, validateEvent);
    }

    const valid = validateEvent(event.message);
    if (valid) {
      return [];
    }

    const validationErrors = validateEvent.errors.map((error) => {
      let rudderValidationError;
      switch (error.keyword) {
        case 'required':
          rudderValidationError = {
            type: violationTypes.RequiredMissing,
            message: error.message,
            meta: {
              instacePath: error.instancePath,
              schemaPath: error.schemaPath,
              missingProperty: error.params.missingProperty,
            },
          };
          break;
        case 'type':
          rudderValidationError = {
            type: violationTypes.DatatypeMismatch,
            message: error.message,
            meta: {
              instacePath: error.instancePath,
              schemaPath: error.schemaPath,
            },
          };
          break;
        case 'additionalProperties':
          rudderValidationError = {
            type: violationTypes.AdditionalProperties,
            message: `${error.message} : ${error.params.additionalProperty}`,
            meta: {
              instacePath: error.instancePath,
              schemaPath: error.schemaPath,
            },
          };
          break;
        default:
          rudderValidationError = {
            type: violationTypes.UnknownViolation,
            message: error.message,
            meta: {
              instacePath: error.instancePath,
              schemaPath: error.schemaPath,
            },
          };
      }
      return rudderValidationError;
    });
    return validationErrors;
  } catch (error) {
    logger.error(`TP event validation error: ${error.message}`);
    throw error;
  }
}

function handleValidationErrors(validationErrors, metadata, curDropEvent, curViolationType) {
  let dropEvent = curDropEvent;
  let violationType = curViolationType;
  const {
    mergedTpConfig,
    destinationId = 'Non-determininable',
    destinationType = 'Non-determininable',
  } = metadata;
  const violationsByType = new Set(validationErrors.map((err) => err.type));

  const handleUnknownOption = (value, key) => {
    logger.error(
      `Unknown option ${value} in ${key} for destId ${destinationId}, destType ${destinationType}`,
    );
  };

  const handleAllowUnplannedEvents = (value) => {
    if (!['true', 'false'].includes(value)) {
      handleUnknownOption(value, 'allowUnplannedEvents');
    } else if (value === 'false' && violationsByType.has(violationTypes.UnplannedEvent)) {
      dropEvent = true;
      violationType = violationTypes.UnplannedEvent;
    }
  };

  const handleUnplannedProperties = (value) => {
    const exists = violationsByType.has(violationTypes.AdditionalProperties);
    if (!['forward', 'drop'].includes(value)) {
      handleUnknownOption(value, 'unplannedProperties');
    } else if (value === 'drop' && exists) {
      dropEvent = true;
      violationType = violationTypes.AdditionalProperties;
    }
  };

  const handleAnyOtherViolation = (value) => {
    if (!['forward', 'drop'].includes(value)) {
      handleUnknownOption(value, 'anyOtherViolation');
      return;
    }

    const violationTypesToCheck = [
      violationTypes.UnknownViolation,
      violationTypes.DatatypeMismatch,
      violationTypes.RequiredMissing,
    ];

    const existingViolationType = violationTypesToCheck.find((type) => violationsByType.has(type));

    if (value === 'drop' && existingViolationType) {
      dropEvent = true;
      violationType = existingViolationType;
    }
  };

  const handleSendViolatedEventsTo = (value) => {
    if (value !== 'procerrors') {
      handleUnknownOption(value, 'sendViolatedEventsTo');
    }
  };

  const handlerMap = {
    allowUnplannedEvents: handleAllowUnplannedEvents,
    unplannedProperties: handleUnplannedProperties,
    anyOtherViolation: handleAnyOtherViolation,
    sendViolatedEventsTo: handleSendViolatedEventsTo,
  };

  const foundConfig = Object.keys(mergedTpConfig).find((key) => handlerMap.hasOwnProperty(key));
  if (foundConfig) {
    // To have compatibility for config-backend, spread-sheet plugin and postman collection
    // We are making everything to lower string and doing string comparison.
    const value = mergedTpConfig[foundConfig]?.toString()?.toLowerCase();
    const handler = handlerMap[foundConfig];
    handler(value);
  }

  return { dropEvent, violationType };
}

/**
 * @param {*} event
 * @returns {dropEvent, violationType, validationErrors}
 *
 * Checks the tpConfig against validationErrors in order to drop the event or to proceed.
 */
async function handleValidation(event) {
  let dropEvent = false;
  let violationType = 'None';

  try {
    const { sourceTpConfig, mergedTpConfig } = event.metadata;

    if (isEmptyObject(sourceTpConfig) || isEmptyObject(mergedTpConfig)) {
      return {
        dropEvent,
        violationType,
        validationErrors: [],
      };
    }

    // Checking the evenType is supported or not
    if (!isEventTypeSupported(event.message.type)) {
      return {
        dropEvent,
        violationType,
        validationErrors: [],
      };
    }

    const validationErrors = await validate(event);
    if (validationErrors.length === 0) {
      return {
        dropEvent,
        violationType,
        validationErrors,
      };
    }

    ({ dropEvent, violationType } = handleValidationErrors(
      validationErrors,
      event.metadata,
      dropEvent,
      violationType,
    ));

    return {
      dropEvent,
      violationType,
      validationErrors,
    };
  } catch (error) {
    logger.error(`TP handle validation error: ${error.message}`);
    throw error;
  }
}

module.exports = {
  handleValidation,
  validate,
  isEventTypeSupported,
  violationTypes,
};
