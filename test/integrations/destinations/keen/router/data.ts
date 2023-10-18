export const data = [
    {
        name: 'fb',
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
                                    "app": {
                                        "build": "1.0.0",
                                        "name": "RudderLabs JavaScript SDK",
                                        "namespace": "com.rudderlabs.javascript",
                                        "version": "1.0.0"
                                    },
                                    "traits": {
                                        "email": "sayan@gmail.com",
                                        "anonymousId": "12345"
                                    },
                                    "library": {
                                        "name": "RudderLabs JavaScript SDK",
                                        "version": "1.0.0"
                                    },
                                    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                    "locale": "en-US",
                                    "os": {
                                        "name": "",
                                        "version": ""
                                    },
                                    "screen": {
                                        "density": 2
                                    }
                                },
                                "type": "track",
                                "messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
                                "session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
                                "originalTimestamp": "2019-10-14T11:15:18.300Z",
                                "anonymousId": "00000000000000000000000000",
                                "userId": "12345",
                                "event": "test track event",
                                "request_ip": "1.1.1.1",
                                "properties": {
                                    "user_actual_role": "system_admin",
                                    "user_actual_id": 12345,
                                    "user_time_spent": 50000
                                },
                                "integrations": {
                                    "All": true
                                },
                                "traits": {
                                    "email": "test@gmail.com",
                                    "anonymousId": "anon-id"
                                },
                                "sentAt": "2019-10-14T11:15:53.296Z"
                            },
                            "metadata": {
                                "jobId": 2
                            },
                            "destination": {
                                "Config": {
                                    "projectID": "abcde",
                                    "writeKey": "xyz",
                                    "ipAddon": true,
                                    "uaAddon": true,
                                    "urlAddon": true,
                                    "referrerAddon": true
                                }
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
                                        "email": "sayan@gmail.com",
                                        "anonymousId": "12345"
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
                                "session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
                                "originalTimestamp": "2019-10-14T11:15:18.299Z",
                                "anonymousId": "00000000000000000000000000",
                                "userId": "12345",
                                "properties": {
                                    "path": "/test",
                                    "referrer": "Rudder",
                                    "search": "abc",
                                    "title": "Test Page",
                                    "url": "www.rudderlabs.com"
                                },
                                "traits": {
                                    "email": "test@gmail.com",
                                    "anonymousId": "anon-id"
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
                                    "projectID": "abcde",
                                    "writeKey": "xyz",
                                    "ipAddon": true,
                                    "uaAddon": true,
                                    "urlAddon": true,
                                    "referrerAddon": true
                                }
                            }
                        }
                    ],
                    destType: 'keen',
                },
            },
        },
        output: {
            response: {
                status: 200,
                body: {
                    output: [
                        {
                            "batchedRequest": {
                                "body": {
                                    "XML": {},
                                    "JSON_ARRAY": {},
                                    "JSON": {
                                        "user_actual_id": 12345,
                                        "user_actual_role": "system_admin",
                                        "request_ip": "1.1.1.1",
                                        "user_time_spent": 50000,
                                        "userId": "12345",
                                        "keen": {
                                            "addons": [
                                                {
                                                    "input": {
                                                        "ip": "request_ip"
                                                    },
                                                    "name": "keen:ip_to_geo",
                                                    "output": "ip_geo_info"
                                                },
                                                {
                                                    "input": {
                                                        "ua_string": "user_agent"
                                                    },
                                                    "name": "keen:ua_parser",
                                                    "output": "parsed_user_agent"
                                                }
                                            ]
                                        },
                                        "anonymousId": "00000000000000000000000000",
                                        "user": {
                                            "traits": {
                                                "anonymousId": "anon-id",
                                                "email": "test@gmail.com"
                                            },
                                            "userId": "12345"
                                        },
                                        "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
                                    },
                                    "FORM": {}
                                },
                                "files": {},
                                "endpoint": "https://api.keen.io/3.0/projects/abcde/events/test track event",
                                "userId": "12345",
                                "headers": {
                                    "Content-Type": "application/json",
                                    "Authorization": "xyz"
                                },
                                "version": "1",
                                "params": {},
                                "type": "REST",
                                "method": "POST",
                                "statusCode": 200
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
                                    "projectID": "abcde",
                                    "writeKey": "xyz",
                                    "ipAddon": true,
                                    "uaAddon": true,
                                    "urlAddon": true,
                                    "referrerAddon": true
                                }
                            }
                        },
                        {
                            "batchedRequest": {
                                "body": {
                                    "XML": {},
                                    "JSON_ARRAY": {},
                                    "JSON": {
                                        "search": "abc",
                                        "request_ip": "0.0.0.0",
                                        "title": "Test Page",
                                        "url": "www.rudderlabs.com",
                                        "referrer": "Rudder",
                                        "userId": "12345",
                                        "keen": {
                                            "addons": [
                                                {
                                                    "input": {
                                                        "ip": "request_ip"
                                                    },
                                                    "name": "keen:ip_to_geo",
                                                    "output": "ip_geo_info"
                                                },
                                                {
                                                    "input": {
                                                        "ua_string": "user_agent"
                                                    },
                                                    "name": "keen:ua_parser",
                                                    "output": "parsed_user_agent"
                                                }
                                            ]
                                        },
                                        "anonymousId": "00000000000000000000000000",
                                        "user": {
                                            "traits": {
                                                "anonymousId": "anon-id",
                                                "email": "test@gmail.com"
                                            },
                                            "userId": "12345"
                                        },
                                        "path": "/test",
                                        "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
                                    },
                                    "FORM": {}
                                },
                                "files": {},
                                "endpoint": "https://api.keen.io/3.0/projects/abcde/events/Viewed ApplicationLoaded page",
                                "userId": "12345",
                                "headers": {
                                    "Content-Type": "application/json",
                                    "Authorization": "xyz"
                                },
                                "version": "1",
                                "params": {},
                                "type": "REST",
                                "method": "POST",
                                "statusCode": 200
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
                                    "projectID": "abcde",
                                    "writeKey": "xyz",
                                    "ipAddon": true,
                                    "uaAddon": true,
                                    "urlAddon": true,
                                    "referrerAddon": true
                                }
                            }
                        }
                    ],
                },
            },
        },
    },
];