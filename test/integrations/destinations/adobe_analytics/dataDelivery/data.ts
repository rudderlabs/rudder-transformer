export const data = [
  {
    name: 'adobe_analytics',
    description: 'Test 0',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint: 'https://adobe.failure.omtrdc.net/b/ss//6',
          headers: {
            'Content-type': 'application/xml',
          },
          params: {},
          body: {
            JSON: {},
            JSON_ARRAY: {},
            XML: {
              payload:
                '<?xml version="1.0" encoding="utf-8"?><request><browserHeight>1794</browserHeight><browserWidth>1080</browserWidth><campaign>sales campaign</campaign><channel>web</channel><currencyCode>USD</currencyCode><ipaddress>127.0.0.1</ipaddress><language>en-US</language><userAgent>Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)</userAgent><referrer>https://www.google.com/search?q=estore+bestseller</referrer><marketingcloudorgid/><events>prodView</events><products>Games;;11;148.39</products><reportSuiteID>rudderstackfootlockerpoc</reportSuiteID></request>',
            },
            FORM: {},
          },
          files: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        statTags: {
          errorCategory: 'dataValidation',
          errorType: 'instrumentation',
          destType: 'ADOBE_ANALYTICS',
          module: 'destination',
          implementation: 'native',
          feature: 'dataDelivery',
          destinationId: '2S3s0dXXXXXX7m0UfBwyblDrzs',
          workspaceId: '1pKWrE6GXXXXXKBikka1SbRgrSN',
        },
        destinationResponse: '',
        authErrorCategory: '',
        message:
          '[ADOBE_ANALYTICS Response Handler] Request failed for destination adobe_analytics : NO pagename OR pageurl',
      },
    },
  },
];
