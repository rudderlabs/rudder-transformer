const { commonPostMapper } = require("../../cdk/heap/transform");

describe('Unit test cases for heap common post mapper', () => {
  let payload, event, rudderContext
  beforeEach(() => {
    payload = { should: 'remain', properties: { idempotencyKey: 'someKey' } };
    event = { message: {}, destination: { Config: { appId: 'app_id' } } };
    rudderContext = {};
  })
  
  it('should delete idempotency key from mappedPayload', () => {
    const expectedOutput = { should: 'remain', app_id: 'app_id', properties: {} };
    expect(commonPostMapper(event, payload, rudderContext)).toEqual(expectedOutput);
  })
  
  it('should mutate the mappedPayload on calling postMapper', () => {
    commonPostMapper(event, payload, rudderContext);
    expect(payload).toEqual({ should: 'remain', properties: {} });
  })
})