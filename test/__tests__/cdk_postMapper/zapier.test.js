const { commonPostMapper } = require("../../../src/cdk/v1/zapier/transform");

describe("Unit test cases for zapier common post mapper", () => {
  it("should update the rudderContext with default endpoint", () => {
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
      Config: {
        zapUrl: "zapier.abcd-hook",
        trackEventsToZap: {},
        pageScreenEventsToZap: {}
      }
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
