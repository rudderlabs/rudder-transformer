const { 
    formatBatchResponse,
    createResponseBodyJSON 
} = require('./utils');

const attributesBatch =  [
    {
      "external_id": "f009deca-0bae-4052-9a59-82c9662fb007",
      "userId": "f009deca-0bae-4052-9a59-82c9662fb007"
    }
]

const eventsBatch = [
    {
      "properties": { "reason": "SUSPICIOUS_ACTIVITY" },
      "external_id": "9e082b23-5452-40b0-a57e-6282f26b736a",
      "name": "user.login_attempt_blocked",
      "time": "2020-10-20T03:36:50.441Z"
    }
]

const purchaseBatch = [
    {
      "revenue": 10.9,
      "currency": "USD"
    }
  ]
describe('braze utils test cases', ()=> {
    describe('createResponseBodyJSON util tests', () => {
        it('flow check', () => {
            expectedOutput = {"attributes": [{"external_id": "f009deca-0bae-4052-9a59-82c9662fb007", "userId": "f009deca-0bae-4052-9a59-82c9662fb007"}], "events": [{"external_id": "9e082b23-5452-40b0-a57e-6282f26b736a", "name": "user.login_attempt_blocked", "properties": {"reason": "SUSPICIOUS_ACTIVITY"}, "time": "2020-10-20T03:36:50.441Z"}], "partner": "RudderStack", "purchases": [{"currency": "USD", "revenue": 10.9}]}
            expect(createResponseBodyJSON (attributesBatch, eventsBatch, purchaseBatch)).toEqual(expectedOutput)
        })
    })
    
    describe('formatBatchResponse util tests', () => {
        it('flow check', () => {
            expectedOutput = {"batchedRequest": {"dummyKey": "dummyValue"}, "destination": {"ID": "a"}, "metadata": [{"job_id": 1}]}
            expect(formatBatchResponse ({"dummyKey": "dummyValue"}, [{job_id: 1}], { "ID": "a" })).toEqual(expectedOutput)
        })
    })
})
