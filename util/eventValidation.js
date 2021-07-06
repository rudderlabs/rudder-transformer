// import { getEventSchema } from "./trackingPlan";
const Ajv = require("ajv");

const _ = require("lodash");
const trackingPlan = require("./trackingPlan");

const logger = require("../logger");

const defaultOptions = {
  // strict mode options (NEW)
  strictRequired: true,
  // validation and reporting options:
  allErrors: true,
  verbose: true,
  // options to modify validated data:
  removeAdditional: true, // "all" - it purges extra properties from event,
  useDefaults: false // *
};

const ajv = new Ajv(defaultOptions);

// Ajv meta load to support draft-04/06/07/2019
//const Ajv2019 = require("ajv/dist/2019");

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

async function validate(event) {
  try {
    const eventTpId = event.metadata.trackingPlanId;
    // safety check to check if event has TpID associated
    if (!(eventTpId && eventTpId !== ""))
      throw new Error("TrackingPlan doesnt exist for event");
    const eventTpVersion = event.metadata.trackingPlanVersion;
    if (!(eventTpVersion && eventTpVersion !== ""))
      throw new Error("TrackingPlanVersion doesnt exist for event");
    // const sourceTpConfig = event.metadata.sourceTpConfig;

    const eventSchema = await trackingPlan.getEventSchema(
      eventTpId,
      eventTpVersion,
      event.message.type,
      event.message.name
    );
    if (_.isEmpty(eventSchema)) return [true, {}];
    // Todo: show unplanned events. This way filtering can done based on source config in processor
    //const [isSchemaValid, schemaCopy] = validateSchema(eventSchema);
    //const validateEvent = ajv.compile(schemaCopy);
    const validateEvent = ajv.compile(eventSchema);
    const valid = validateEvent(event.message.properties);
    if (valid) {
      // console.log(`${JSON.stringify(event.message.properties)} is Valid!`);
      return [valid, {}];
    }
    // console.log(`${event} Invalid: ${ajv.errorsText(validateEvent.errors)}`);
    // throw new Error()
    var errors = validateEvent.errors.map(function(error) {
      var rudderValidationError;
      switch (error.keyword) {
        case "required":
          // requirement not fulfilled.
          rudderValidationError = {
            type: "required missing",
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
            type: "datatype mismatch",
            message: error.message,
            meta: {
              instacePath: error.instancePath,
              schemaPath: error.schemaPath
            }
          };
          break;
        default:
          rudderValidationError = {
            type: "UnknownError",
            message: "Unexpected error during event validation",
            meta: {
              error
            }
          };
      }
      return rudderValidationError;
    });
    return [valid, errors];

    // interface ErrorObject {
    //   keyword: string // validation keyword.  ex: required
    //   instancePath: string // JSON Pointer to the location in the data instance (e.g., `"/prop/1/subProp"`).
    //   schemaPath: string // JSON Pointer to the location of the failing keyword in the schema ex
    //   params: object // type is defined by keyword value, see below
    //                  // params property is the object with the additional information about error
    //                  // it can be used to generate error messages
    //                  // (e.g., using [ajv-i18n](https://github.com/ajv-validator/ajv-i18n) package).
    //                  // See below for parameters set by all keywords.
    //   propertyName?: string // set for errors in `propertyNames` keyword schema.
    //                         // `instancePath` still points to the object in this case.
    //   message?: string // the error message (can be excluded with option `messages: false`).
    //   // Options below are added with `verbose` option:
    //   schema?: any // the value of the failing keyword in the schema.
    //   parentSchema?: object // the schema containing the keyword.
    //   data?: any // the data validated by the keyword.
    // }

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
  } catch (error) {
    logger.error(error);
    // stats.increment("get_trackingplan.error");
    throw error;
  }
}

exports.validate = validate;
