const {
  trackPostMapper,
  identifyPostMapper
} = require("../../../src/cdk/autopilot/transform");

describe("Unit Test for track postMapper", () => {
  it("should update the rudderContext with correct endpoint", () => {
    const message = { traits: { email: "test@email.com" } };
    const destination = { Config: { triggerId: "sample-trigger-id" } };
    const event = { message, destination };
    const expectedRudderContext = {
      endpoint: `https://api2.autopilothq.com/v1/trigger/sample-trigger-id/contact/test@email.com`
    };
    const rudderContext = {};
    trackPostMapper(event, {}, rudderContext);
    expect(rudderContext).toEqual(expectedRudderContext);
  });
});

describe("Unit Test for identify postMapper", () => {
  it("should delete fields from traits", () => {
    const message = {
      traits: { email: "test@email.com", firstName: "firstName" }
    };
    const destination = {};
    const event = { message, destination };
    const payload = { someKey: "here" };
    const expected = { contact: { someKey: "here" } };
    const resp = identifyPostMapper(event, payload, {});
    expect(resp).toEqual(expected);
  });

  it("should delete fields from traits and keep custom values", () => {
    const message = {
      traits: {
        email: "test@email.com",
        firstName: "firstName",
        something: "custom"
      }
    };
    const destination = {};
    const event = { message, destination };
    const payload = { someKey: "here" };
    const expected = {
      contact: { someKey: "here", custom: { something: "custom" } }
    };
    const resp = identifyPostMapper(event, payload, {});
    expect(resp).toEqual(expected);
  });

  it("should not throw error on empty traits", () => {
    const message = { traits: {} };
    const destination = {};
    const event = { message, destination };
    const payload = { someKey: "here" };
    const expected = { contact: { someKey: "here" } };
    const resp = identifyPostMapper(event, payload, {});
    expect(resp).toEqual(expected);
  });
});
