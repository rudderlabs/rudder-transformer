export const data = [
    {
        name: 'delighted',
        description: 'Test 0',
        feature: 'router',
        module: 'destination',
        version: 'v0',
        input: {
            request: {
                body: {
                    input: [
                        {
                            "destination": {
                                "Config": {
                                    "apiKey": "dummyApiKey",
                                    "channel": "email",
                                    "delay": 0,
                                    "eventNamesSettings": [{ "event": "" }]
                                }
                            },
                            "metadata": {
                                "jobId": 1
                            },
                            "message": {
                                "channel": "web",
                                "context": {
                                    "app": {
                                        "build": "1.0.0",
                                        "name": "RudderLabs JavaScript SDK",
                                        "namespace": "com.rudderlabs.javascript",
                                        "version": "1.0.0"
                                    },
                                    "library": { "name": "RudderLabs JavaScript SDK", "version": "1.0.0" },
                                    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                    "locale": "en-US",
                                    "ip": "0.0.0.0",
                                    "os": { "name": "", "version": "" },
                                    "screen": { "density": 2 }
                                },
                                "messageId": "84e26acc-56a5-4835-8233-591137fca468",
                                "session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
                                "originalTimestamp": "2019-10-14T09:03:17.562Z",
                                "type": "identify",
                                "userId": "abc@123.com",
                                "traits": {
                                    "firstName": "James",
                                    "lastName": "Doe",
                                    "phone": "+92374162212",
                                    "last_sent_at": "1626698350"
                                },
                                "integrations": { "All": true },
                                "sentAt": "2019-10-14T09:03:22.563Z"
                            }
                        },
                        {
                            "destination": {
                                "Config": {
                                    "apiKey": "dummyApiKey",
                                    "channel": "email",
                                    "delay": 0,
                                    "eventNamesSettings": [{ "event": "" }]
                                }
                            },
                            "metadata": {
                                "jobId": 2
                            },
                            "message": {
                                "channel": "web",
                                "context": {
                                    "app": {
                                        "build": "1.0.0",
                                        "name": "RudderLabs JavaScript SDK",
                                        "namespace": "com.rudderlabs.javascript",
                                        "version": "1.0.0"
                                    },
                                    "library": { "name": "RudderLabs JavaScript SDK", "version": "1.0.0" },
                                    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                    "locale": "en-US",
                                    "ip": "0.0.0.0",
                                    "os": { "name": "", "version": "" },
                                    "screen": { "density": 2 }
                                },
                                "messageId": "84e26acc-56a5-4835-8233-591137fca468",
                                "session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
                                "originalTimestamp": "2019-10-14T09:03:17.562Z",
                                "type": "alias",
                                "previousId": "123@abc.com",
                                "userId": "abc@123.com",
                                "integrations": { "All": true },
                                "sentAt": "2019-10-14T09:03:22.563Z"
                            }
                        }
                    ],
                    destType: 'delighted',
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
                                "body": {
                                    "XML": {},
                                    "JSON_ARRAY": {},
                                    "FORM": {},
                                    "JSON": {
                                        "email": "abc@123.com",
                                        "send": false,
                                        "channel": "email",
                                        "delay": 0,
                                        "last_sent_at": "1626698350",
                                        "name": "James Doe",
                                        "phone_number": "+92374162212"
                                    }
                                },
                                "type": "REST",
                                "files": {},
                                "method": "POST",
                                "params": {},
                                "headers": {
                                    "Authorization": "Basic ZHVtbXlBcGlLZXk=",
                                    "Content-Type": "application/json"
                                },
                                "version": "1",
                                "endpoint": "https://api.delighted.com/v1/people.json"
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
                                    "apiKey": "dummyApiKey",
                                    "channel": "email",
                                    "delay": 0,
                                    "eventNamesSettings": [{ "event": "" }]
                                }
                            }
                        },
                        {
                            "batchedRequest": {
                                "body": {
                                    "XML": {},
                                    "JSON_ARRAY": {},
                                    "FORM": {},
                                    "JSON": {
                                        "email": "123@abc.com",
                                        "email_update": "abc@123.com"
                                    }
                                },
                                "type": "REST",
                                "files": {},
                                "method": "POST",
                                "params": {},
                                "headers": {
                                    "Authorization": "Basic ZHVtbXlBcGlLZXk=",
                                    "Content-Type": "application/json"
                                },
                                "version": "1",
                                "endpoint": "https://api.delighted.com/v1/people.json"
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
                                    "apiKey": "dummyApiKey",
                                    "channel": "email",
                                    "delay": 0,
                                    "eventNamesSettings": [{ "event": "" }]
                                }
                            }
                        }
                    ]
                    ,
                },
            },
        },
    },
];
