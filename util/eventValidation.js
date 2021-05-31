const Ajv = require("ajv")
const ajv = new Ajv({allErrors: true})

const schema = {
    type: "object",
    properties: {
        foo: {type: "string"},
        bar: {type: "number", maximum: 3},
    },
    required: ["foo", "bar"],
    additionalProperties: false,
}

const validate = ajv.compile(schema)

test({foo: "abc", bar: 2})
test({foo: 2, bar: 4})

function test(data) {
    const valid = validate(data);
    if (valid) console.log(JSON.stringify(data) + " is Valid!");
    else console.log(`${data} Invalid: ${ajv.errorsText(validate.errors)}`);
}

const trackingPlan = require("./trackingplan.json");
const orderCompletedSchema = trackingPlan.rules.events[0].rules;

const oc1 = { "product": "BTC", "price": 500, "amount": 10, "test":{"test1":10} };
const oc2 = { "product": "BTC", "price": "ABC" };
const oc3 = {  };



const validate1 = ajv.compile(orderCompletedSchema);

test1(oc1);
test1(oc2);
test1(oc3);

console.log(oc1['price'])
console.log(oc1['test']['test1'])
console.log(oc1.test.test1)


function test1(data) {
    const valid = validate1(data);
    if (valid) {
        //console.log(JSON.stringify(data) + " is Valid!");
        return {}
    }
    else {
        //console.log(`${data} Invalid: ${ajv.errorsText(validate1.errors)}`);
        for (const err of validate.errors ) {
            console.log(err)
            //throw new Error(JSON.stringify(err))
        }
        return JSON.stringify(validate1.errors)
    }
}

console.log(test1(oc1))
console.log(test1(oc2))
console.log(test1(oc3))
