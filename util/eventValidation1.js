const Ajv = require("ajv");

const ajv = new Ajv({ allErrors: true });

async function validate(event) {
  try {
    // const sourceID = event['metadata']['sourceId']
    // if (!sourceID) throw Error('sourceID not found for event')
    // TODO: if tpid set in metadata, directly we may get tpid, eventName, type
    // mocking track schema for now.
    const trackingPlan = require("./trackingplan.json");
    const trackSchema = trackingPlan.rules.events[1].rules;
    const validate = ajv.compile(trackSchema);
    // ['message']['properties']
    const valid = validate(event.message.properties);
    if (valid) {
      console.log(`${JSON.stringify(event.message.properties)} is Valid!`);
      return [true, {}];
    }
    else {
      console.log(`${event} Invalid: ${ajv.errorsText(validate.errors)}`);
      //throw new Error()
      return [false, JSON.stringify(validate.errors)];
    }
  } catch (error) {
    // logger.error(error);
    // stats.increment("get_trackingplan.error");
    throw error;
  }
}

const event = require("./trackEvent.json");

validate(event[0]);

exports.validate = validate;
