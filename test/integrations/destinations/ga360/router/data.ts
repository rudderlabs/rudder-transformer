export const mockFns = (_) => {
    // @ts-ignore
    jest
        .useFakeTimers()
        .setSystemTime(new Date('2023-09-29'));
};

export const data = [
    {
        name: 'ga360',
        description: 'Test 0',
        feature: 'router',
        module: 'destination',
        version: 'v0',
        input: {
            request: {
                body: {
                    input: [
                        {
                            "message": {
                                "channel": "web",
                                "context": {
                                    "traits": {
                                        "name": "Rudder Test"
                                    },
                                    "app": {
                                        "build": "1.0.0",
                                        "name": "RudderLabs JavaScript SDK",
                                        "namespace": "com.rudderlabs.javascript",
                                        "version": "1.0.0"
                                    },
                                    "library": {
                                        "name": "RudderLabs JavaScript SDK",
                                        "version": "1.0.0"
                                    },
                                    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                    "locale": "en-US",
                                    "ip": "0.0.0.0",
                                    "os": {
                                        "name": "",
                                        "version": ""
                                    },
                                    "screen": {
                                        "density": 2
                                    }
                                },
                                "properties": {
                                    "plan": "standard plan",
                                    "name": "rudder test"
                                },
                                "type": "identify",
                                "messageId": "84e26acc-56a5-4835-8233-591137fca468",
                                "originalTimestamp": "2019-10-14T09:03:17.562Z",
                                "anonymousId": "00000000000000000000000000",
                                "userId": "123456",
                                "integrations": {
                                    "All": true
                                },
                                "sentAt": "2019-10-14T09:03:22.563Z"
                            },
                            "metadata": {
                                "jobId": 1
                            },
                            "destination": {
                                "Config": {
                                    "trackingID": "UA-165994240-1",
                                    "doubleClick": true,
                                    "enhancedLinkAttribution": true,
                                    "classic": true,
                                    "ignoredReferrers": "",
                                    "serverClassic": false,
                                    "includeSearch": true,
                                    "trackCategorizedPages": true,
                                    "trackNamedPages": true,
                                    "sampleRate": "100",
                                    "siteSpeedSampleRate": "1",
                                    "setAllMappedProps": true,
                                    "enableServerSideIdentify": true,
                                    "serverSideIdentifyEventCategory": "name",
                                    "serverSideIdentifyEventAction": "action1",
                                    "anonymizeIp": true,
                                    "domain": "domain",
                                    "enhancedEcommerce": true,
                                    "nonInteraction": true,
                                    "optimize": "abc123",
                                    "sendUserId": true,
                                    "useGoogleAmpClientId": true,
                                    "web-useNativeSDK": true,
                                    "dimensions": [
                                        {
                                            "from": "name",
                                            "to": "dimension1"
                                        },
                                        {
                                            "from": "custom2",
                                            "to": "dimension2"
                                        }
                                    ],
                                    "metrics": [
                                        {
                                            "from": "email",
                                            "to": "metric1"
                                        },
                                        {
                                            "from": "trait2",
                                            "to": "metric2"
                                        }
                                    ],
                                    "resetCustomDimensionsOnPage": [
                                        {
                                            "resetCustomDimensionsOnPage": "abc"
                                        },
                                        {
                                            "resetCustomDimensionsOnPage": "xyz"
                                        }
                                    ],
                                    "contentGroupings": [
                                        {
                                            "from": "plan",
                                            "to": "contentGroup1"
                                        },
                                        {
                                            "from": "name",
                                            "to": "contentGroup2"
                                        }
                                    ]
                                },
                                "Enabled": true
                            }
                        },
                        {
                            "message": {
                                "channel": "web",
                                "context": {
                                    "app": {
                                        "build": "1.0.0",
                                        "name": "RudderLabs JavaScript SDK",
                                        "namespace": "com.rudderlabs.javascript",
                                        "version": "1.0.0"
                                    },
                                    "traits": {
                                        "email": "test@rudderstack.com"
                                    },
                                    "library": {
                                        "name": "RudderLabs JavaScript SDK",
                                        "version": "1.0.0"
                                    },
                                    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                    "locale": "en-US",
                                    "ip": "0.0.0.0",
                                    "os": {
                                        "name": "",
                                        "version": ""
                                    },
                                    "screen": {
                                        "density": 2
                                    }
                                },
                                "type": "page",
                                "messageId": "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
                                "originalTimestamp": "2019-10-14T11:15:18.299Z",
                                "anonymousId": "00000000000000000000000000",
                                "userId": "12345",
                                "properties": {
                                    "path": "/abc",
                                    "referrer": "q",
                                    "search": "",
                                    "title": "a",
                                    "url": "https://www.example.com/abc"
                                },
                                "integrations": {
                                    "All": true
                                },
                                "name": "ApplicationLoaded",
                                "sentAt": "2019-10-14T11:15:53.296Z"
                            },
                            "metadata": {
                                "jobId": 2
                            },
                            "destination": {
                                "Config": {
                                    "trackingID": "UA-165994240-1",
                                    "doubleClick": true,
                                    "enhancedLinkAttribution": true,
                                    "classic": true,
                                    "ignoredReferrers": "",
                                    "serverClassic": false,
                                    "includeSearch": true,
                                    "trackCategorizedPages": true,
                                    "trackNamedPages": true,
                                    "sampleRate": "100",
                                    "siteSpeedSampleRate": "1",
                                    "setAllMappedProps": true,
                                    "enableServerSideIdentify": true,
                                    "serverSideIdentifyEventCategory": "cat1",
                                    "serverSideIdentifyEventAction": "action1",
                                    "anonymizeIp": true,
                                    "domain": "domain",
                                    "enhancedEcommerce": true,
                                    "nonInteraction": true,
                                    "optimize": "abc123",
                                    "sendUserId": true,
                                    "useGoogleAmpClientId": true,
                                    "web-useNativeSDK": true,
                                    "dimensions": [
                                        {
                                            "from": "name",
                                            "to": "dimension1"
                                        },
                                        {
                                            "from": "custom2",
                                            "to": "dimension2"
                                        }
                                    ],
                                    "metrics": [
                                        {
                                            "from": "email",
                                            "to": "metric1"
                                        },
                                        {
                                            "from": "trait2",
                                            "to": "metric2"
                                        }
                                    ],
                                    "resetCustomDimensionsOnPage": [
                                        {
                                            "resetCustomDimensionsOnPage": "abc"
                                        },
                                        {
                                            "resetCustomDimensionsOnPage": "xyz"
                                        }
                                    ],
                                    "contentGroupings": [
                                        {
                                            "from": "plan",
                                            "to": "contentGroup1"
                                        },
                                        {
                                            "from": "prop2",
                                            "to": "contentGroup2"
                                        }
                                    ]
                                },
                                "Enabled": true
                            }
                        }
                    ],
                    destType: 'ga360',
                },
                method: 'POST',
            },
        },
        output: {
            response: {
                status: 200,
                body: {
                    output: [
                        {
                            "batchedRequest": {
                                "version": "1",
                                "type": "REST",
                                "method": "POST",
                                "endpoint": "https://www.google-analytics.com/collect",
                                "headers": {},
                                "params": {
                                    "ea": "action1",
                                    "ec": "Rudder Test",
                                    "cd1": "Rudder Test",
                                    "cg2": "Rudder Test",
                                    "v": "1",
                                    "t": "event",
                                    "tid": "UA-165994240-1",
                                    "ds": "web",
                                    "an": "RudderLabs JavaScript SDK",
                                    "av": "1.0.0",
                                    "aiid": "com.rudderlabs.javascript",
                                    "npa": 1,
                                    "aip": 1,
                                    "uid": "123456",
                                    "cid": "00000000000000000000000000",
                                    "ni": 1,
                                    "uip": "0.0.0.0",
                                    "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                    "ul": "en-US",
                                    "qt": 124901802438,
                                },
                                "body": {
                                    "JSON": {},
                                    "XML": {},
                                    "JSON_ARRAY": {},
                                    "FORM": {}
                                },
                                "files": {},
                                "userId": "00000000000000000000000000"
                            },
                            "metadata": [
                                {
                                    "jobId": 1
                                }
                            ],
                            "batched": false,
                            "statusCode": 200,
                            "destination": {
                                "Config": {
                                    "trackingID": "UA-165994240-1",
                                    "doubleClick": true,
                                    "enhancedLinkAttribution": true,
                                    "classic": true,
                                    "ignoredReferrers": "",
                                    "serverClassic": false,
                                    "includeSearch": true,
                                    "trackCategorizedPages": true,
                                    "trackNamedPages": true,
                                    "sampleRate": "100",
                                    "siteSpeedSampleRate": "1",
                                    "setAllMappedProps": true,
                                    "enableServerSideIdentify": true,
                                    "serverSideIdentifyEventCategory": "name",
                                    "serverSideIdentifyEventAction": "action1",
                                    "anonymizeIp": true,
                                    "domain": "domain",
                                    "enhancedEcommerce": true,
                                    "nonInteraction": true,
                                    "optimize": "abc123",
                                    "sendUserId": true,
                                    "useGoogleAmpClientId": true,
                                    "web-useNativeSDK": true,
                                    "dimensions": [
                                        {
                                            "from": "name",
                                            "to": "dimension1"
                                        },
                                        {
                                            "from": "custom2",
                                            "to": "dimension2"
                                        }
                                    ],
                                    "metrics": [
                                        {
                                            "from": "email",
                                            "to": "metric1"
                                        },
                                        {
                                            "from": "trait2",
                                            "to": "metric2"
                                        }
                                    ],
                                    "resetCustomDimensionsOnPage": [
                                        {
                                            "resetCustomDimensionsOnPage": "abc"
                                        },
                                        {
                                            "resetCustomDimensionsOnPage": "xyz"
                                        }
                                    ],
                                    "contentGroupings": [
                                        {
                                            "from": "plan",
                                            "to": "contentGroup1"
                                        },
                                        {
                                            "from": "name",
                                            "to": "contentGroup2"
                                        }
                                    ]
                                },
                                "Enabled": true
                            }
                        },
                        {
                            "batchedRequest": {
                                "version": "1",
                                "type": "REST",
                                "method": "POST",
                                "endpoint": "https://www.google-analytics.com/collect",
                                "headers": {},
                                "params": {
                                    "v": "1",
                                    "t": "pageview",
                                    "tid": "UA-165994240-1",
                                    "ds": "web",
                                    "an": "RudderLabs JavaScript SDK",
                                    "av": "1.0.0",
                                    "aiid": "com.rudderlabs.javascript",
                                    "npa": 1,
                                    "aip": 1,
                                    "cid": "00000000000000000000000000",
                                    "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                    "uid": "12345",
                                    "uip": "0.0.0.0",
                                    "ul": "en-US",
                                    "dh": "www.example.com",
                                    "dl": "https://www.example.com/abc",
                                    "dp": "%2Fabc",
                                    "dr": "q",
                                    "dt": "a",
                                    "qt": 124893881701,
                                },
                                "body": {
                                    "JSON": {},
                                    "XML": {},
                                    "JSON_ARRAY": {},
                                    "FORM": {}
                                },
                                "files": {},
                                "userId": "00000000000000000000000000"
                            },
                            "metadata": [
                                {
                                    "jobId": 2
                                }
                            ],
                            "batched": false,
                            "statusCode": 200,
                            "destination": {
                                "Config": {
                                    "trackingID": "UA-165994240-1",
                                    "doubleClick": true,
                                    "enhancedLinkAttribution": true,
                                    "classic": true,
                                    "ignoredReferrers": "",
                                    "serverClassic": false,
                                    "includeSearch": true,
                                    "trackCategorizedPages": true,
                                    "trackNamedPages": true,
                                    "sampleRate": "100",
                                    "siteSpeedSampleRate": "1",
                                    "setAllMappedProps": true,
                                    "enableServerSideIdentify": true,
                                    "serverSideIdentifyEventCategory": "cat1",
                                    "serverSideIdentifyEventAction": "action1",
                                    "anonymizeIp": true,
                                    "domain": "domain",
                                    "enhancedEcommerce": true,
                                    "nonInteraction": true,
                                    "optimize": "abc123",
                                    "sendUserId": true,
                                    "useGoogleAmpClientId": true,
                                    "web-useNativeSDK": true,
                                    "dimensions": [
                                        {
                                            "from": "name",
                                            "to": "dimension1"
                                        },
                                        {
                                            "from": "custom2",
                                            "to": "dimension2"
                                        }
                                    ],
                                    "metrics": [
                                        {
                                            "from": "email",
                                            "to": "metric1"
                                        },
                                        {
                                            "from": "trait2",
                                            "to": "metric2"
                                        }
                                    ],
                                    "resetCustomDimensionsOnPage": [
                                        {
                                            "resetCustomDimensionsOnPage": "abc"
                                        },
                                        {
                                            "resetCustomDimensionsOnPage": "xyz"
                                        }
                                    ],
                                    "contentGroupings": [
                                        {
                                            "from": "plan",
                                            "to": "contentGroup1"
                                        },
                                        {
                                            "from": "prop2",
                                            "to": "contentGroup2"
                                        }
                                    ]
                                },
                                "Enabled": true
                            }
                        }
                    ],
                },
            },
        },
    }
].map((d) => ({ ...d, mockFns }));
