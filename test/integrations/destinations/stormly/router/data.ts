import { FEATURES } from '../../../../../src/v0/util/tags';

export const data = [
    {
        name: 'stormly',
        description: 'Test 0',
        feature: FEATURES.ROUTER,
        module: 'destination',
        version: 'v0',
        input: {
            request: {
                body: {
                    input: [
                        {
                            "destination": {
                                "Config": {
                                    "apiKey": "dummyApiKey"
                                },
                                "ID": "stormly123"
                            },
                            "metadata": {
                                "jobId": 1
                            },
                            "message": {
                                "type": "identify",
                                "sentAt": "2022-01-20T13:39:21.033Z",
                                "channel": "web",
                                "userId": "5136633649",
                                "context": {
                                    "traits": {
                                        "name": "John Doe",
                                        "email": "johndoe@gmail.com",
                                        "age": 25
                                    }
                                },
                                "rudderId": "553b5522-c575-40a7-8072-9741c5f9a647",
                                "anonymousId": "bf412108-0357-4330-b119-7305e767823c",
                                "originalTimestamp": "2022-01-20T13:39:21.032Z"
                            }
                        },
                        {
                            "destination": {
                                "Config": {
                                    "apiKey": "dummyApiKey"
                                },
                                "ID": "stormly123"
                            },
                            "metadata": {
                                "jobId": 2
                            },
                            "message": {
                                "type": "track",
                                "event": "Product Reviewed",
                                "properties": {
                                    "review_id": "12345",
                                    "product_id": "123",
                                    "rating": 3.0,
                                    "review_body": "Average product, expected much more.",
                                    "groupId": "91Yb32830"
                                },
                                "context": {},
                                "rudderId": "553b5522-c575-40a7-8072-9741c5f9a647",
                                "anonymousId": "bf412108-0357-4330-b119-7305e767823c",
                                "originalTimestamp": "2022-01-20T13:39:21.032Z"
                            }
                        }
                    ],
                    destType: 'stormly',
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
                            "batched": false,
                            "batchedRequest": {
                                "body": {
                                    "FORM": {},
                                    "JSON": {
                                        "timestamp": "2022-01-20T13:39:21.032Z",
                                        "traits": {
                                            "age": 25,
                                            "email": "johndoe@gmail.com",
                                            "name": "John Doe"
                                        },
                                        "userId": "5136633649"
                                    },
                                    "JSON_ARRAY": {},
                                    "XML": {}
                                },
                                "endpoint": "https://rudderstack.t.stormly.com/webhook/rudderstack/identify",
                                "files": {},
                                "headers": {
                                    "Authorization": "Basic dummyApiKey",
                                    "Content-Type": "application/json"
                                },
                                "method": "POST",
                                "params": {},
                                "type": "REST",
                                "version": "1"
                            },
                            "destination": {
                                "Config": {
                                    "apiKey": "dummyApiKey"
                                },
                                "ID": "stormly123"
                            },
                            "metadata": [
                                {
                                    "jobId": 1
                                }
                            ],
                            "statusCode": 200
                        },
                        {
                            "destination": {
                                "Config": {
                                    "apiKey": "dummyApiKey"
                                },
                                "ID": "stormly123"
                            },
                            "batched": false,
                            "error": "Missing required value from \"userIdOnly\"",
                            "metadata": [
                                {
                                    "jobId": 2
                                }
                            ],
                            "statTags": {
                                "destType": "STORMLY",
                                "errorCategory": "dataValidation",
                                "errorType": "instrumentation",
                                "feature": "router",
                                "implementation": "native",
                                "module": "destination",
                            },
                            "statusCode": 400
                        }
                    ],
                },
            },
        },
    }
];
