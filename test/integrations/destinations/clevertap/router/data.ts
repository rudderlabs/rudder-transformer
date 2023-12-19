export const data = [
    {
        name: 'clevertap',
        description: 'simple router tests',
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
                                    "passcode": "dummypasscode",
                                    "accountId": "dummyAccountId",
                                    "trackAnonymous": true,
                                    "enableObjectIdMapping": true
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
                                    "library": {
                                        "name": "RudderLabs JavaScript SDK",
                                        "version": "1.0.0"
                                    },
                                    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                    "locale": "en-US",
                                    "ip": "0.0.0.0",
                                    "os": {
                                        "name": "Android",
                                        "version": ""
                                    },
                                    "screen": {
                                        "density": 2
                                    },
                                    "device": {
                                        "id": "f54bb572361c4fd1",
                                        "name": "whyred",
                                        "type": "Android",
                                        "model": "Redmi Note 5 Pro",
                                        "manufacturer": "Xiaomi",
                                        "token": "frfsgvrwe:APfdsafsgdfsgghfgfgjkhfsfgdhjhbvcvnetry767456fxsasdf"
                                    }
                                },
                                "messageId": "84e26acc-56a5-4835-8233-591137fca468",
                                "session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
                                "originalTimestamp": "2019-10-14T09:03:17.562Z",
                                "anonymousId": "anon_id",
                                "type": "identify",
                                "traits": {
                                    "ts": "2019-10-14T09:03:17.562Z",
                                    "anonymousId": "anon_id",
                                    "email": "dummyuser@gmail.com",
                                    "name": "Dummy User",
                                    "phone": "98765434210",
                                    "gender": "M",
                                    "employed": true,
                                    "birthday": "1614775793",
                                    "education": "Science",
                                    "graduate": true,
                                    "married": true,
                                    "customerType": "Prime",
                                    "msg_push": true,
                                    "msgSms": true,
                                    "msgemail": true,
                                    "msgwhatsapp": false,
                                    "custom_tags": ["Test_User", "Interested_User", "DIY_Hobby"],
                                    "custom_mappings": {
                                        "Office": "Trastkiv",
                                        "Country": "Russia"
                                    },
                                    "address": {
                                        "city": "kolkata",
                                        "country": "India",
                                        "postalCode": 789223,
                                        "state": "WB",
                                        "street": ""
                                    }
                                },
                                "integrations": {
                                    "All": true
                                },
                                "sentAt": "2019-10-14T09:03:22.563Z"
                            }
                        },
                        {
                            "destination": {
                                "Config": {
                                    "passcode": "dummypasscode",
                                    "accountId": "dummyAccountId",
                                    "trackAnonymous": true,
                                    "enableObjectIdMapping": true
                                }
                            },
                            "metadata": {
                                "jobId": 2
                            },
                            "message": {
                                "event": "Random",
                                "properties": {
                                    "country_region": "India",
                                    "test": "abc"
                                },
                                "receivedAt": "2021-08-20T12:49:07.691Z",
                                "rudderId": "138c4214-b537-4f77-9dea-9abde70b5147",
                                "type": "track",
                                "anonymousId": "cd3a4439-7df0-4475-acb9-6659c7c4dfe3"
                            }
                        },
                        {
                            "destination": {
                                "Config": {
                                    "passcode": "dummypasscode",
                                    "accountId": "dummyAccountId",
                                    "trackAnonymous": true
                                }
                            },
                            "metadata": {
                                "jobId": 3
                            },
                            "message": {
                                "type": "group",
                                "anonymousId": "anon-id-new",
                                "name": "Rudder",
                                "properties": {
                                    "title": "Home",
                                    "path": "/"
                                },
                                "context": {
                                    "ip": "14.5.67.21",
                                    "library": {
                                        "name": "http"
                                    }
                                },
                                "timestamp": "2020-02-02T00:23:09.544Z"
                            }
                        }
                    ],
                    destType: 'clevertap',
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
                                "batched": true,
                                "endpoint": "https://api.clevertap.com/1/upload",
                                "headers": {
                                    "X-CleverTap-Account-Id": "dummyAccountId",
                                    "X-CleverTap-Passcode": "dummypasscode",
                                    "Content-Type": "application/json"
                                },
                                "params": {},
                                "body": {
                                    "JSON": {
                                        "d": [
                                            {
                                                "type": "profile",
                                                "ts": 1571043797,
                                                "profileData": {
                                                    "Email": "dummyuser@gmail.com",
                                                    "Name": "Dummy User",
                                                    "Phone": "98765434210",
                                                    "Gender": "M",
                                                    "Employed": true,
                                                    "DOB": "1614775793",
                                                    "Education": "Science",
                                                    "Married": true,
                                                    "Customer Type": "Prime",
                                                    "graduate": true,
                                                    "msg_push": true,
                                                    "msgSms": true,
                                                    "msgemail": true,
                                                    "msgwhatsapp": false,
                                                    "custom_tags": "[\"Test_User\",\"Interested_User\",\"DIY_Hobby\"]",
                                                    "custom_mappings": "{\"Office\":\"Trastkiv\",\"Country\":\"Russia\"}",
                                                    "address": "{\"city\":\"kolkata\",\"country\":\"India\",\"postalCode\":789223,\"state\":\"WB\",\"street\":\"\"}"
                                                },
                                                "objectId": "anon_id"
                                            },
                                            {
                                                "type": "token",
                                                "tokenData": {
                                                    "id": "frfsgvrwe:APfdsafsgdfsgghfgfgjkhfsfgdhjhbvcvnetry767456fxsasdf",
                                                    "type": "fcm"
                                                },
                                                "objectId": "anon_id"
                                            },
                                            {
                                                "evtName": "Random",
                                                "evtData": {
                                                    "country_region": "India",
                                                    "test": "abc"
                                                },
                                                "type": "event",
                                                "objectId": "cd3a4439-7df0-4475-acb9-6659c7c4dfe3"
                                            }
                                        ]
                                    },
                                    "JSON_ARRAY": {},
                                    "XML": {},
                                    "FORM": {}
                                },
                                "files": {}
                            },
                            "metadata": [
                                {
                                    "jobId": 1
                                },
                                {
                                    "jobId": 2
                                }
                            ],
                            "batched": false,
                            "statusCode": 200,
                            "destination": {
                                "Config": {
                                    "passcode": "dummypasscode",
                                    "accountId": "dummyAccountId",
                                    "trackAnonymous": true,
                                    "enableObjectIdMapping": true
                                }
                            }
                        },
                        {
                            "metadata": [
                                {
                                    "jobId": 3
                                }
                            ],
                            "batched": false,
                            "statusCode": 400,
                            "error": "Message type not supported",
                            "statTags": {
                                "destType": "CLEVERTAP",
                                "errorCategory": "dataValidation",
                                "errorType": "instrumentation",
                                "feature": "router",
                                "implementation": "native",
                                "module": "destination",
                            },
                            "destination": {
                                "Config": {
                                    "passcode": "dummypasscode",
                                    "accountId": "dummyAccountId",
                                    "trackAnonymous": true
                                }
                            }
                        }
                    ],
                },
            },
        },
    }
];
