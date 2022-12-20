const { postMapper } = require("../../../src/cdk/dcm_floodlight/transform");

describe("Unit Test for postMapper", () => {
  it("should update the rudderContext with userAgent and valid endpoint", () => {
    const message = {
      event: "Checkout Started",
      type: "track",
      properties: {
        orderId: 1234,
        quantity: 45,
        revenue: 800
      },
      context: {
        device: {
          advertisingId: "2a3e36d172-5e28-45a1-9eda-ce22a3e36d1a"
        },
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
      }
    };
    const destination = {
      Config: {
        advertiserId: "12649566",
        activityTag: "",
        groupTag: "",
        conversionEvents: [
          {
            customVariables: [
              {
                from: "",
                to: ""
              }
            ],
            eventName: "Sign up Completed",
            floodlightActivityTag: "signu0",
            floodlightGroupTag: "conv01",
            salesTag: false
          },
          {
            customVariables: [
              {
                from: "1",
                to: "rudder1"
              },
              {
                from: "2",
                to: "akash1"
              }
            ],
            eventName: "Order Complete",
            floodlightActivityTag: "order0",
            floodlightGroupTag: "conv000",
            salesTag: false
          },
          {
            eventName: "Checkout Started",
            floodlightActivityTag: "check0",
            floodlightGroupTag: "conv0000",
            salesTag: true
          },
          {
            customVariables: [
              {
                from: "1",
                to: "rudder2"
              },
              {
                from: "2",
                to: "akash2"
              },
              {
                from: "3",
                to: "friendlyName2"
              },
              {
                from: "4",
                to: "name2"
              }
            ],
            eventName: "Purchase",
            floodlightActivityTag: "Pur0",
            floodlightGroupTag: "conv111",
            salesTag: false
          }
        ]
      }
    };
    const event = { message, destination };
    const payload = {
      dc_rdid: "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
      ord: 111,
      qty: 999999,
      cost: 800,
      dc_lat: "true"
    };
    const expectedRudderContext = {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
      endpoint:
        "https://ad.doubleclick.net/ddm/activity/src=12649566;cat=check0;type=conv0000;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=111;qty=999999;cost=800;dc_lat=1"
    };
    const rudderContext = {};
    postMapper(event, payload, rudderContext);
    expect(rudderContext).toEqual(expectedRudderContext);
  });
});
