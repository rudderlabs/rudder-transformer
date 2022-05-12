const { commonPostMapper } = require("../../cdk/new_relic/transform");

describe("Unit test cases for new_relic common post mapper", () => {
  let payload, event, rudderContext;
  beforeEach(() => {
    payload = { event: "first", timestamp: 1580602989, abc: "123", key: 124 };
    event = {
      message: { userId: "identified user id", anonymousId: "anon-id-new" },
      destination: {
        Config: {
          accountId: "12345",
          insertKey: "11111122702j2a2U2K2C7H",
          dataCenter: "us"
        }
      }
    };
    rudderContext = {};
  });

  it('If user did not provid a eventType name, then we will include "rudderstack" in the payload directly', () => {
    event = {
      message: { userId: "identified user id", anonymousId: "anon-id-new" },
      destination: {
        Config: {
          customEventType: "",
          sendDeviceContext: false,
          sendUserIdanonymousId: true
        }
      }
    };
    const expectedOutput = {
      event: "first",
      timestamp: 1580602989,
      abc: "123",
      key: 124,
      eventType: "rudderstack",
      userId: "identified user id",
      anonymousId: "anon-id-new"
    };

    expect(commonPostMapper(event, payload, rudderContext)).toEqual(
      expectedOutput
    );
  });

  it("If user provides a eventType name, then we will include it in the payload directly", () => {
    event = {
      message: { userId: "identified user id", anonymousId: "anon-id-new" },
      destination: {
        Config: {
          customEventType: "abc",
          sendDeviceContext: false,
          sendUserIdanonymousId: true
        }
      }
    };
    const expectedOutput = {
      event: "first",
      timestamp: 1580602989,
      abc: "123",
      key: 124,
      eventType: "abc",
      userId: "identified user id",
      anonymousId: "anon-id-new"
    };

    expect(commonPostMapper(event, payload, rudderContext)).toEqual(
      expectedOutput
    );
  });
  it('when "sendUserIdanonymousId" is false, we do not send userId or anonymousId ', () => {
    event = {
      message: { userId: "identified user id", anonymousId: "anon-id-new" },
      destination: {
        Config: {
          customEventType: "abc",
          sendDeviceContext: false,
          sendUserIdanonymousId: false
        }
      }
    };
    const expectedOutput = {
      event: "first",
      timestamp: 1580602989,
      abc: "123",
      key: 124,
      eventType: "abc"
    };

    expect(commonPostMapper(event, payload, rudderContext)).toEqual(
      expectedOutput
    );
  });

  it('when "sendDeviceContext" is true, we will flatten the context and merge with the payload ', () => {
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
          customEventType: "abc",
          sendDeviceContext: true,
          sendUserIdanonymousId: true
        }
      }
    };
    const expectedOutput = {
      event: "first",
      timestamp: 1580602989,
      abc: "123",
      key: 124,
      eventType: "abc",
      userId: "identified user id",
      anonymousId: "anon-id-new",
      "traits.trait1": "new-val",
      ip: "14.5.67.21",
      "library.name": "http"
    };

    expect(commonPostMapper(event, payload, rudderContext)).toEqual(
      expectedOutput
    );
  });
});
