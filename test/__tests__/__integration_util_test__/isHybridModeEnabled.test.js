const { isHybridModeEnabled } = require("../../../src/v0/util");

describe("isHybridModeEnabled util test", () => {
    test("Both flags(useNativeSDK and useNativeSDKToSend) are not present", () => {
      const isHybridMode = isHybridModeEnabled({});
      expect(isHybridMode).toEqual(false);
    });

    test("useNativeSDKToSend flag is not present", () => {
      const isHybridMode = isHybridModeEnabled({useNativeSDK: false});
      expect(isHybridMode).toEqual(false);
    });

    test("Both flags(useNativeSDK and useNativeSDKToSend) are present and hybridMode is enabled", () => {
      const isHybridMode = isHybridModeEnabled({useNativeSDK: true, useNativeSDKToSend: false});
      expect(isHybridMode).toEqual(true);
    });

    test("Both flags(useNativeSDK and useNativeSDKToSend) are present and device mode is enabled", () => {
      const isHybridMode = isHybridModeEnabled({useNativeSDK: true, useNativeSDKToSend: true});
      expect(isHybridMode).toEqual(false);
    });

     test("Both flags(useNativeSDK and useNativeSDKToSend) are present and cloud mode is enabled", () => {
      const isHybridMode = isHybridModeEnabled({useNativeSDK: false, useNativeSDKToSend: false});
      expect(isHybridMode).toEqual(false);
    });
});