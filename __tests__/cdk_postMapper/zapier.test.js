const { even } = require("is");
const { commonPostMapper } = require("../../cdk/zapier/transform");

describe("Unit test cases for zapier common post mapper", () => {
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

  //   it('If user did not provid a eventType name, then we will include "rudderstack" in the payload directly', () => {
  //     // event is manupulated to suit the test-cases
  //     event.destination.Config.sendDeviceContext = false;
  //     expect(commonPostMapper(event, payload, rudderContext)).toEqual(
  //       expectedOutput
  //     );
  //   });

  it("should update the rudderContext with correct endpoint", () => {
    const message = {
      type: "track",
      userId: "identified user id",
      anonymousId: "anon-id-new",
      event: "Product Purchased new",
      properties: {
        name: "Shirt",
        revenue: 4.99
      },
      context: {
        ip: "14.5.67.21",
        library: {
          name: "http"
        }
      },
      timestamp: "2020-02-02T00:23:09.544Z"
    };
    const destination = {
      Config: { zapUrl: "zapier.abcd-hook", eventsToZap: {} }
    };
    const event = { message, destination };
    const expectedRudderContext = {
      zapUrl: `zapier.abcd-hook`
    };
    const rudderContext = {};
    commonPostMapper(event, {}, rudderContext);
    expect(rudderContext).toEqual(expectedRudderContext);
  });
});
