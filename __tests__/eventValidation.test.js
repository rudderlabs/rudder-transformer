const {checkIfEventTypeIsSupportedOrNot} = require("../util/eventValidation");
var testCases = [
    {
        "output": false
    },
    {
        "eventType": undefined,
        "output": false
    },
    {
        "eventType": "unknown",
        "output": false
    },
    {
        "eventType": "identify",
        "output": false
    },
    {
        "eventType": "track",
        "output": true
    },
    {
        "eventType": "page",
        "output": false
    },
    {
        "eventType": "screen",
        "output": false
    },
    {
        "eventType": "alias",
        "output": false
    },
    {
        "eventType": "group",
        "output": false
    }
]

describe("Supported Event types testing", () => {
    testCases.forEach((testCase) => {
        it(`should return isSupportedOrNot ${testCase.output} for this input eventType ${testCase.eventType} everytime`, () => {
            var isSupportedOrNot = checkIfEventTypeIsSupportedOrNot(testCase.eventType)
            expect(isSupportedOrNot).toEqual(testCase.output)
        })
    })
})
