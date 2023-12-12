export const networkCallsData = [
  {
    httpReq: {
      url: 'https://adobe.failure.omtrdc.net/b/ss//6',
      data: '<?xml version="1.0" encoding="utf-8"?><request><browserHeight>1794</browserHeight><browserWidth>1080</browserWidth><campaign>sales campaign</campaign><channel>web</channel><currencyCode>USD</currencyCode><ipaddress>127.0.0.1</ipaddress><language>en-US</language><userAgent>Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)</userAgent><referrer>https://www.google.com/search?q=estore+bestseller</referrer><marketingcloudorgid/><events>prodView</events><products>Games;;11;148.39</products><reportSuiteID>failureReport</reportSuiteID></request>',
      params: {},
      headers: {
        'Content-Type': 'application/xml',
      },
      method: 'POST',
    },
    httpRes: {
      status: 200,
      data: '<?xml version="1.0" encoding="UTF-8"?><status>FAILURE</status><reason>NO pagename OR pageurl</reason>',
    },
  },
  {
    httpReq: {
      url: 'https://adobe.failure2.omtrdc.net/b/ss//6',
      data: '<?xml version="1.0" encoding="utf-8"?><request><browserHeight>1794</browserHeight><browserWidth>1080</browserWidth><campaign>sales campaign</campaign><channel>web</channel><currencyCode>USD</currencyCode><ipaddress>127.0.0.1</ipaddress><language>en-US</language><userAgent>Dalvik/2.1.0 (Linux; U; Android 9; Android SDK built for x86 Build/PSR1.180720.075)</userAgent><referrer>https://www.google.com/search?q=estore+bestseller</referrer><marketingcloudorgid/><events>prodView</events><products>Games;;11;148.39</products><reportSuiteID>failureReportgeneric</reportSuiteID></request>',
      params: {},
      headers: {
        'Content-Type': 'application/xml',
      },
      method: 'POST',
    },
    httpRes: {
      status: 200,
      data: '<?xml version="1.0" encoding="UTF-8"?><status>FAILURE</status>',
    },
  },
  {
    httpReq: {
      url: 'https://adobe.success.omtrdc.net/b/ss//6',
      data: '<?xml version="1.0" encoding="utf-8"?><request><ipaddress>127.0.1.0</ipaddress><pageUrl>www.google.co.in</pageUrl><pageName>Google</pageName><visitorID>id1110011</visitorID><events>prodView</events><products>Games;Monopoly;1;14.00,Games;UNO;2;6.90</products><reportSuiteID>successreport</reportSuiteID></request>',
      params: {},
      headers: {
        'Content-Type': 'application/xml',
      },
      method: 'POST',
    },
    httpRes: {
      status: 200,
      data: '<?xml version="1.0" encoding="UTF-8"?><status>SUCCESS</status>',
    },
  },
];
