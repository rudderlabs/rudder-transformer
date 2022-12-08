const {
  processExtraPayloadParams
} = require("../../../src/cdk/kochava/transform");

describe("Unit Test for kochava postMapper", () => {
  it("should set all the default values", () => {
    const event = {
      destination: {
        Config: {
          apiKey: "<kochava guid goes here>"
        },
        DestinationDefinition: {
          Config: {
            cdkEnabled: true
          },
          DisplayName: "Kochava",
          ID: "1WTpBSTiL3iAUHUdW7rHT4sawgU",
          Name: "KOCHAVA"
        },
        Enabled: true,
        ID: "1WTpIHpH7NTBgjeiUPW1kCUgZGI",
        Name: "kochava test",
        Transformations: []
      },
      message: {
        anonymousId: "sampath",
        channel: "web",
        context: {},
        event: "product added",
        properties: { name: "sampath" },
        type: "track",
        event: "eventName"
      }
    };
    const expected = {
      data: {
        app_tracking_transparency: {
          att: false
        },
        device_ver: "",
        device_ids: {
          idfa: "",
          idfv: "",
          adid: "",
          android_id: ""
        },
        event_name: "eventName",
        device_ua: "",
        currency: "USD"
      }
    };
    const resp = processExtraPayloadParams(event, {}, {});
    expect(resp).toEqual(expected);
  });

  it("should set all the default values and os_version as empty string", () => {
    const event = {
      destination: {
        Config: {
          apiKey: "<kochava guid goes here>"
        },
        DestinationDefinition: {
          Config: {
            cdkEnabled: true
          },
          DisplayName: "Kochava",
          ID: "1WTpBSTiL3iAUHUdW7rHT4sawgU",
          Name: "KOCHAVA"
        },
        Enabled: true,
        ID: "1WTpIHpH7NTBgjeiUPW1kCUgZGI",
        Name: "kochava test",
        Transformations: []
      },
      message: {
        anonymousId: "sampath",
        channel: "web",
        context: {
          os: {
            version: ""
          }
        },
        event: "product added",
        properties: { name: "sampath" },
        type: "track",
        event: "eventName"
      }
    };
    const expected = {
      data: {
        app_tracking_transparency: {
          att: false
        },
        device_ver: "",
        device_ids: {
          idfa: "",
          idfv: "",
          adid: "",
          android_id: ""
        },
        event_name: "eventName",
        device_ua: "",
        currency: "USD",
        os_version: ""
      }
    };
    const resp = processExtraPayloadParams(event, {}, {});
    expect(resp).toEqual(expected);
  });
});
