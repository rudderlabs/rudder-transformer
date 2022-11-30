/* Ajv meta load to support draft-04/06/07/2019 */
const Ajv2019 = require("ajv/dist/2019");
const Ajv = require("ajv-draft-04");
const draft7MetaSchema = require('ajv/dist/refs/json-schema-draft-07.json');
const draft6MetaSchema = require('ajv/dist/refs/json-schema-draft-06.json');

const NodeCache = require("node-cache");
const hash = require("object-hash");
const logger = require("../logger");
const trackingPlan = require("./trackingPlan");

const eventSchemaCache = new NodeCache();
const ajv19Cache = new NodeCache({ useClones: false });
const ajv4Cache = new NodeCache({ useClones: false });
const {isEmptyObject} = require("../v0/util");

const defaultOptions = {
    strictRequired: true,
    allErrors: true,
    verbose: true,
    allowUnionTypes: true
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

const supportedEventTypes = {
    "group": true,
    "track": true,
    "identify": true,
    "page": false,
    "screen": false,
    "alias": false
};

// When no ajv options are provided, ajv constructed from defaultOptions will be used
const ajv4 = new Ajv(defaultOptions);

const ajv19 = new Ajv2019(defaultOptions);
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
        return new Ajv(ajvOptions);
    }
    const ajv = new Ajv2019(ajvOptions);
    ajv.addMetaSchema(draft6MetaSchema);
    ajv.addMetaSchema(draft7MetaSchema);
    return ajv;
}

/**
 * @param {*} property
 *
 * Safety check to check if event has TpID, TpVersion associated with it.
 * Else throws an error.
 */
function checkForPropertyMissing(property) {
    if (!(property && property !== "")) {
        throw `${property} doesnt exist for event`;
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
    if (!supportedEventTypes.hasOwnProperty(eventType)) {
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

        const sourceTpConfig = event.metadata.sourceTpConfig;
        const eventSchema = await trackingPlan.getEventSchema(
            event.metadata.trackingPlanId,
            event.metadata.trackingPlanVersion,
            event.message.type,
            event.message.event,
            event.metadata.workspaceId
        );

        // UnPlanned event case - since no event schema is found. Violation is raised
        // Return this violation error only in case of track calls.
        if (!eventSchema || eventSchema === {}) {
            if (event.message.type !== "track"){
                return [];
            }
            rudderValidationError = {
                type: violationTypes.UnplannedEvent,
                message: `no schema for eventName : ${event.message.event}, eventType : ${event.message.type} in trackingPlanID : ${event.metadata.trackingPlanId}::${event.metadata.trackingPlanVersion}`,
                meta: {}
            };
            return [rudderValidationError];
        }
        // Assumes schema is in draft 7 by default
        let isDraft4 = false;
        if (Object.prototype.hasOwnProperty.call(eventSchema, "$schema") && eventSchema.$schema.includes('draft-04')) {
            isDraft4 = true;
        }

        //Current json schema is injected with version for non-track events in config-be, need to remove ot parse it succesfully
        delete eventSchema["version"];

        const schemaHash = eventSchemaHash(
            event.metadata.trackingPlanId,
            event.metadata.trackingPlanVersion,
            event.message.type,
            event.message.event,
            isDraft4
        );
        const eventTypeAjvOptions = sourceTpConfig[event.message.type]?.ajvOptions || {};
        const globalAjvOptions = (sourceTpConfig.global && sourceTpConfig.global.ajvOptions) || {};
        const merged = {
            ...defaultOptions,
            ...globalAjvOptions,
            ...eventTypeAjvOptions
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

        var validationErrors = validateEvent.errors.map(function (error) {
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
                        message: error.message,
                        meta: {
                            instacePath: error.instancePath,
                            schemaPath: error.schemaPath
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

/**
 * @param {*} event
 * @returns {dropEvent, violationType, validationErrors}
 *
 * Checks the tpConfig against validationErrors in order to drop the event or to proceed.
 */
async function handleValidation(event) {
    let dropEvent = false;
    let violationType = "None";

    try {
        const sourceTpConfig = event.metadata.sourceTpConfig;
        const mergedTpConfig = event.metadata.mergedTpConfig;

        if (isEmptyObject(sourceTpConfig) || isEmptyObject(mergedTpConfig)) {
            return {
                dropEvent: dropEvent,
                violationType: violationType,
                validationErrors: []
            };
        }

        // Checking the evenType is supported or not
        if (!isEventTypeSupported(event.message.type)) {
            return {
                dropEvent: dropEvent,
                violationType: violationType,
                validationErrors: []
            };
        }

        const validationErrors = await validate(event);
        if (validationErrors.length === 0) {
            return {
                dropEvent: dropEvent,
                violationType: violationType,
                validationErrors: validationErrors
            };
        }

        const violationsByType = new Set(validationErrors.map(err => err.type));
        for (const [key, val] of Object.entries(mergedTpConfig)) {
            // To have compatibility for config-backend, spread-sheet plugin and postman collection
            // We are making everything to lower string and doing string comparision.
            const value = val?.toString()?.toLowerCase();
            switch (key) {
                case "allowUnplannedEvents": {
                    const exists = violationsByType.has(violationTypes.UnplannedEvent);
                    if (value === "false" && exists) {
                        dropEvent = true;
                        violationType = violationTypes.UnplannedEvent;
                        break;
                    }
                    if (!(value === "true" || value === "false")) {
                        logger.error(`Unknown option ${value} in ${key}"`);
                    }
                    break;
                }
                case "unplannedProperties": {
                    const exists = violationsByType.has(violationTypes.AdditionalProperties);
                    if (value === "drop" && exists) {
                        dropEvent = true;
                        violationType = violationTypes.AdditionalProperties;
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
                            violationType = violationTypes.UnknownViolation;
                        } else if (exists2) {
                            violationType = violationTypes.DatatypeMismatch;
                        } else {
                            violationType = violationTypes.RequiredMissing;
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
            }
        }

        return {
            dropEvent: dropEvent,
            violationType: violationType,
            validationErrors: validationErrors
        };
    } catch (error) {
        throw error;
    }
}

module.exports = {
    handleValidation,
    validate,
    isEventTypeSupported,
    violationTypes
};
