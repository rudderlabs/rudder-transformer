const { even } = require("is");
const { commonPostMapper } = require("../../cdk/new_relic/transform");

describe("Unit test cases for new_relic common post mapper", () => {
  let payload, event, rudderContext, expectedOutput;
  beforeEach(() => {
    payload = {
      event: "first",
      timestamp: 1580602989,
      abc: "123",
      key: 124,
      auto: true,
      eventType: "standard"
    };
    event = {
      message: {
        userId: "identified user id",
        anonymousId: "anon-id-new",
        context: {
          traits: { trait1: "new-val" },
          ip: "14.5.67.21",
          library: { name: "http" }
        }
      },
      destination: {
        Config: {
          accountId: "12345",
          insertKey: "11111122702j2a2U2K2C7H",
          dataCenter: "us",
          customEventType: "",
          sendDeviceContext: false,
          sendUserIdanonymousId: true
        }
      }
    };
    rudderContext = {};
    expectedOutput = {
      event: "first",
      timestamp: 1580602989,
      abc: "123",
      key: 124,
      eventType: "rudderstack",
      userId: "identified user id",
      anonymousId: "anon-id-new",
      "'auto'": "true"
    };
  });

  it('If user did not provid a eventType name, then we will include "rudderstack" in the payload directly', () => {
    // event is manupulated to suit the test-cases
    event.destination.Config.sendDeviceContext = false;
    expect(commonPostMapper(event, payload, rudderContext)).toEqual(
      expectedOutput
    );
  });

  it("If user provides a eventType name, then we will include it in the payload directly", () => {
    event.destination.Config.customEventType = "abc";
    // expectedOutput is also manupulated to suit the expectation of the test-case
    expectedOutput.eventType = "abc";
    expect(commonPostMapper(event, payload, rudderContext)).toEqual(
      expectedOutput
    );
  });
  it('when "sendUserIdanonymousId" is false, we do not send userId or anonymousId ', () => {
    event.destination.Config.sendUserIdanonymousId = false;
    event.destination.Config.customEventType = "abc";
    expectedOutput.eventType = "abc";
    delete expectedOutput.userId;
    delete expectedOutput.anonymousId;
    expect(commonPostMapper(event, payload, rudderContext)).toEqual(
      expectedOutput
    );
  });

  it('when "sendDeviceContext" is true, we will flatten the context and merge with the payload ', () => {
    event.destination.Config.sendUserIdanonymousId = true;
    event.destination.Config.sendDeviceContext = true;
    expectedOutput["traits.trait1"] = "new-val";
    expectedOutput.ip = "14.5.67.21";
    expectedOutput["library.name"] = "http";
    expect(commonPostMapper(event, payload, rudderContext)).toEqual(
      expectedOutput
    );
  });
});
