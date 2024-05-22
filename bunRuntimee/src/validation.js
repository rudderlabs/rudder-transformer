import logger from './logger';
import trackingPlan from './trackingPlan';
import Ajv from 'ajv-draft-04';
import Ajv2019 from 'ajv/dist/2019';
import addFormats from 'ajv-formats';
import draft7MetaSchema from 'ajv/dist/refs/json-schema-draft-07.json';
import draft6MetaSchema from 'ajv/dist/refs/json-schema-draft-06.json';
import NodeCache from 'node-cache';
import hash from 'object-hash';

const SECONDS_IN_DAY = 60 * 60 * 24 * 1;
const ajv19Cache = new NodeCache({ useClones: false, stdTTL: SECONDS_IN_DAY });
const ajv4Cache = new NodeCache({ useClones: false, stdTTL: SECONDS_IN_DAY });


function isEmptyObject(obj) {
    if (!obj) {
        logger.warn('input is undefined or null');
        return true;
    }
    return Object.keys(obj).length === 0;
}

const defaultOptions = {
    strictRequired: true,
    allErrors: true,
    verbose: true,
    allowUnionTypes: true,
    // removeAdditional: false, // "all" - it purges extra properties from event,
    // useDefaults: false
  };

const supportedEventTypes = {
    group: true,
    track: true,
    identify: true,
    page: true,
    screen: true,
    alias: false,
};

function isEventTypeSupported(eventType) {
    if (!Object.prototype.hasOwnProperty.call(supportedEventTypes, eventType)) {
        return false;
    }
    return supportedEventTypes[eventType];
}

const violationTypes = {
    RequiredMissing: 'Required-Missing',
    DatatypeMismatch: 'Datatype-Mismatch',
    AdditionalProperties: 'Additional-Properties',
    UnknownViolation: 'Unknown-Violation',
    UnplannedEvent: 'Unplanned-Event',
};

function handleValidationErrors(validationErrors, metadata, curDropEvent, curViolationType) {
    let dropEvent = curDropEvent;
    let violationType = curViolationType;
    const { mergedTpConfig, destinationId = 'Non-determininable', destinationType = 'Non-determininable', } = metadata;
    const violationsByType = new Set(validationErrors.map((err) => err.type));
    const handleUnknownOption = (value, key) => {
        logger.error(`Unknown option ${value} in ${key} for destId ${destinationId}, destType ${destinationType}`);
    };
    const handleAllowUnplannedEvents = (value) => {
        if (!['true', 'false'].includes(value)) {
            handleUnknownOption(value, 'allowUnplannedEvents');
        }
        else if (value === 'false' && violationsByType.has(violationTypes.UnplannedEvent)) {
            dropEvent = true;
            violationType = violationTypes.UnplannedEvent;
        }
    };
    const handleUnplannedProperties = (value) => {
        const exists = violationsByType.has(violationTypes.AdditionalProperties);
        if (!['forward', 'drop'].includes(value)) {
            handleUnknownOption(value, 'unplannedProperties');
        }
        else if (value === 'drop' && exists) {
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
    Object.keys(mergedTpConfig).forEach((key) => {
        if (handlerMap.hasOwnProperty(key)) {
            const value = mergedTpConfig[key]?.toString()?.toLowerCase();
            const handler = handlerMap[key];
            handler(value);
        }
    });
    return { dropEvent, violationType };
}

function checkForPropertyMissing(property) {
    if (!(property && property !== '')) {
        throw new Error(`${property} does not exist for event`);
    }
}

function eventSchemaHash(tpId, tpVersion, eventType, eventName, isDraft4 = false) {
    return `${tpId}::${tpVersion}::${eventType}::${eventName}::${isDraft4 ? 4 : 19}`;
  }

  // When no ajv options are provided, ajv constructed from defaultOptions will be used
const ajv4 = new Ajv(defaultOptions);
addFormats(ajv4);

const ajv19 = new Ajv2019(defaultOptions);
addFormats(ajv19);
ajv19.addMetaSchema(draft6MetaSchema);
ajv19.addMetaSchema(draft7MetaSchema);

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

  const eventSchemaCache = new NodeCache();

async function validate(event) {
    try {
        checkForPropertyMissing(event.metadata.trackingPlanId);
        checkForPropertyMissing(event.metadata.trackingPlanVersion);
        checkForPropertyMissing(event.metadata.workspaceId);
        const { sourceTpConfig, trackingPlanId, trackingPlanVersion, workspaceId } = event.metadata;
        const eventSchema = await trackingPlan.getEventSchema(trackingPlanId, trackingPlanVersion, event.message.type, event.message.type === 'track' ? event.message.event : '', workspaceId);
        // UnPlanned event case - since no event schema is found. Violation is raised
        // Return this violation error only in case of track calls.
        // @ts-ignore
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
        if (Object.prototype.hasOwnProperty.call(eventSchema, '$schema') &&
            eventSchema.$schema.includes('draft-04')) {
            isDraft4 = true;
        }
        // Current json schema is injected with version for non-track events in config-be, need to remove ot parse it succesfully
        delete eventSchema.version;
        const schemaHash = eventSchemaHash(trackingPlanId, trackingPlanVersion, event.message.type, event.message.event, isDraft4);
        const eventTypeAjvOptions = sourceTpConfig[event.message.type]?.ajvOptions || {};
        const globalAjvOptions = (sourceTpConfig.global && sourceTpConfig.global.ajvOptions) || {};
        const merged = {
            ...defaultOptions,
            ...globalAjvOptions,
            ...eventTypeAjvOptions,
        };
        let ajv = isDraft4 ? ajv4 : ajv19;
        const ajvCache = isDraft4 ? ajv4Cache : ajv19Cache;
        // @ts-ignore
        if (merged !== {}) {
            const configHash = hash(merged);
            // @ts-ignore
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
                        property: error.params.missingProperty,
                        meta: {
                            instancePath: error.instancePath,
                            schemaPath: error.schemaPath,
                        },
                    };
                    break;
                case 'type':
                    rudderValidationError = {
                        type: violationTypes.DatatypeMismatch,
                        message: error.message,
                        meta: {
                            instancePath: error.instancePath,
                            schemaPath: error.schemaPath,
                        },
                    };
                    break;
                case 'additionalProperties':
                    rudderValidationError = {
                        type: violationTypes.AdditionalProperties,
                        message: `${error.message} '${error.params.additionalProperty}'`,
                        property: error.params.additionalProperty,
                        meta: {
                            instancePath: error.instancePath,
                            schemaPath: error.schemaPath,
                        },
                    };
                    break;
                default:
                    rudderValidationError = {
                        type: violationTypes.UnknownViolation,
                        message: error.message,
                        meta: {
                            instancePath: error.instancePath,
                            schemaPath: error.schemaPath,
                        },
                    };
            }
            return rudderValidationError;
        });
        return validationErrors;
    }
    catch (error) {
        // @ts-ignore
        logger.error(`TP event validation error: ${error.message}`);
        throw error;
    }
}

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
        ({ dropEvent, violationType } = handleValidationErrors(validationErrors, event.metadata, dropEvent, violationType));
        return {
            dropEvent,
            violationType,
            validationErrors,
        };
    }
    catch (error) {
        // @ts-ignore
        logger.error(`TP handle validation error: ${error.message}`);
        throw error;
    }
}
