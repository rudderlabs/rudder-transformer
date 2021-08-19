const Ajv = require("ajv");

const NodeCache = require("node-cache");
const _ = require("lodash");
const trackingPlan = require("./trackingPlan");
var hash = require("object-hash");

const eventSchemaCache = new NodeCache();
const ajvCache = new NodeCache();

const logger = require("../logger");

const defaultOptions = {
  // strict mode options (NEW)
  strictRequired: true,
  // validation and reporting options:
  allErrors: true,
  verbose: true
  // options to modify validated data:
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

let ajv = new Ajv(defaultOptions);

// Ajv meta load to support draft-04/06/07/2019
//const Ajv2019 = require("ajv/dist/2019");

// TODO: handle various json schema versions
// const ajv = new Ajv2019(defaultOptions);
// const migrate = require("json-schema-migrate");
// const draft6MetaSchema = require("ajv/dist/refs/json-schema-draft-06.json");
// ajv.addMetaSchema(draft6MetaSchema);
// const draft7MetaSchema = require("ajv/dist/refs/json-schema-draft-07.json");
// ajv.addMetaSchema(draft7MetaSchema);
//
// function validateSchema(schemaRules) {
//   const schemaCopy = JSON.parse(JSON.stringify(schemaRules));
//   if (
//       schemaCopy.hasOwnProperty("$schema") &&
//       schemaCopy["$schema"].includes("draft-04")
//   ) {
//     migrate.draft2019(schemaCopy);
//     //migrate.draft7(schemaCopy);
//   }
//   const valid = ajv.validateSchema(schemaCopy, true);
//   return [valid, schemaCopy];
// }

// safety check to check if event has TpID,TpVersion associated
function checkForPropertyMissing(property) {
  if (!(property && property !== ""))
    throw `${property} doesnt exist for event`;
}

function eventSchemaHash(tpId, tpVersion, eventType, eventName) {
  return `${tpId}::${tpVersion}::${eventType}::${eventName}`;
}

// Ajv Error objects info : https://ajv.js.org/api.html#error-objects
// sample validation errors
// {
//                 "instancePath": "",
//                 "schemaPath": "#/required",
//                 "keyword": "required",
//                 "params": {
//                     "missingProperty": "price"
//                 },
//                 "message": "must have required property 'price'",
//                 "schema": [
//                     "product",
//                     "price",
//                     "amount"
//                 ],
//                "parentSchema":{} //full schema
//                "data":{} //full properties object
// }
// {
//                 "instancePath": "/amount",
//                 "schemaPath": "#/properties/amount/type",
//                 "keyword": "type",
//                 "params": {
//                     "type": [
//                         "number"
//                     ]
//                 },
//                 "message": "must be number",
//                 "schema": [
//                     "number"
//                 ],
//                 "parentSchema": {
//                     "type": [
//                         "number"
//                     ]
//                 },
//                 "data": true
//             }
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
    // const [isSchemaValid, schemaCopy] = validateSchema(eventSchema);
    // const validateEvent = ajv.compile(schemaCopy);
    // Error: schema with key or id "http://rudder.com/order-completed" already exists
    const schemaHash = eventSchemaHash(
      event.metadata.trackingPlanId,
      event.metadata.trackingPlanVersion,
      event.message.type,
      event.message.event
    );
    let eventTypeAjvOptions = sourceTpConfig[event.message.type].ajvOptions;
    let globalAjvOptions = sourceTpConfig.global.ajvOptions;
    let merged = {
      ...defaultOptions,
      ...globalAjvOptions,
      ...eventTypeAjvOptions
    };
    logger.info(merged);
    if (merged !== {}) {
      let configHash = hash(merged);
      ajv = ajvCache.get(configHash);
      if(!ajv) {
        ajv = new Ajv(merged);
        ajvCache.set(configHash, ajv);
      }
    }
    logger.info(JSON.stringify(ajvCache.getStats()));

    let validateEvent = eventSchemaCache.get(schemaHash);
    if (!validateEvent) {
      validateEvent = ajv.compile(eventSchema);
      eventSchemaCache.set(schemaHash, validateEvent);
    }
    logger.info(JSON.stringify(eventSchemaCache.getStats()));

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

exports.validate = validate;
