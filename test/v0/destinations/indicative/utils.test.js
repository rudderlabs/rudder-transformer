const { getUAInfo } = require('../../../../src/v0/destinations/indicative/utils');

describe("Get user agent info utility function test cases", () => {
    let message = {
            "context": {
                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"
            }
    };
  
    it("should parse user agent with all fields not null", async () => {
      const expectedOutput = {
        "browser": "Chrome",
        "browser_version": "111.0.0.0",
        "device": "Macintosh",
        "os": "Mac OS"
      };
      await expect(
        getUAInfo(message)
      ).toEqual(expectedOutput);
    });

    it("should return empty object if userAgent is null/undefined/not present in message", async () => {
        message.context.userAgent = null;
        const expectedOutput = {};
        await expect(
            getUAInfo(message)
        ).toEqual(expectedOutput);
    });

    it("should not return browser info", async () => {
        // user agent when channel is mobile
        message.context.userAgent = "Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)"
        const expectedOutput = {
          "device": "Android 9",
          "os": "Android"
        };
        await expect(
          getUAInfo(message)
        ).toEqual(expectedOutput);
    });
    
  });