export const data = [
    {
        name: 'custify',
        description: 'Test 0',
        feature: 'router',
        module: 'destination',
        version: 'v0',
        input: {
            request: {
                body: {
                    input: [
                        {
                            "description": "Group callw with all parameters",
                            "destination": {
                                "Config": {
                                    "apiKey": "apiKey_key_test_001",
                                    "sendAnonymousId": false
                                },
                                "ID": "custify-1234"
                            },
                            "metadata": {
                                "jobId": 1
                            },
                            "message": {
                                "type": "group",
                                "userId": "user_111",
                                "groupId": "company_222",
                                "traits": {
                                    "name": "Absolute Company",
                                    "industry": " Absolute",
                                    "employees": 121,
                                    "size": 100,
                                    "website": "www.rudder.com",
                                    "plan": "GOLD",
                                    "monthly_revenue": 8000,
                                    "churned": false,
                                    "test_att1": "test_att_val1"
                                },
                                "context": {
                                    "traits": {
                                        "firstName": "Absolute",
                                        "lastName": "User",
                                        "phone": 9830311522,
                                        "session_count": 23,
                                        "signed_up_at": "2022-04-27T13:56:13.012Z",
                                        "custom_prop1": "custom_value1",
                                        "custom_prop2": 123,
                                        "custom_prop3": false,
                                        "custom_prop4": {
                                            "test": "test"
                                        },
                                        "custom_prop5": [1, 3, 4],
                                        "createdAt": "2022-04-27T13:56:13.012Z"
                                    },
                                    "ip": "14.5.67.21",
                                    "library": {
                                        "name": "http"
                                    }
                                },
                                "timestamp": "2020-01-21T00:21:34.208Z"
                            }
                        },
                        {
                            "description": "Identify with all parameters",
                            "destination": {
                                "Config": {
                                    "apiKeyToken": "pk_123",
                                    "listId": "correctListId123"
                                },
                                "ID": "custify-1234"
                            },
                            "metadata": {
                                "jobId": 2
                            },
                            "message": {
                                "type": "identify",
                                "userId": "user_1234",
                                "context": {
                                    "traits": {
                                        "email": "user111@gmail.com",
                                        "firstName": "New",
                                        "lastName": "User",
                                        "phone": 9830311522,
                                        "sessionCount": 23,
                                        "unsubscribedFromEmails": false,
                                        "unsubscribedFromCalls": false,

                                        "signed_up_at": "2022-04-27T13:56:13.012Z",
                                        "custom_prop1": "custom_value1",
                                        "custom_prop2": 123,
                                        "custom_prop3": false,
                                        "custom_prop4": { "test": "test" },
                                        "custom_prop5": [1, 3, 4],
                                        "createdAt": "2022-04-27T13:56:13.012Z",
                                        "company": {
                                            "id": "company_123"
                                        }
                                    }
                                },
                                "timestamp": "2022-04-27T13:56:13.012Z",
                                "rudderId": "553b5522-c575-40a7-8072-9741c5f9a647",
                                "messageId": "831f1fa5-de84-4f22-880a-4c3f23fc3f04",
                                "anonymousId": "bf412108-0357-4330-b119-7305e767823c"
                            },
                            "rudderId": "553b5522-c575-40a7-8072-9741c5f9a647",
                            "messageId": "831f1fa5-de84-4f22-880a-4c3f23fc3f04",
                            "anonymousId": "bf412108-0357-4330-b119-7305e767823c"
                        }
                    ],
                    destType: 'custify',
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
                                "endpoint": "https://api.custify.com/people",
                                "headers": {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer apiKey_key_test_001",
                                    "Accept": "application/json"
                                },
                                "params": {},
                                "body": {
                                    "JSON": {
                                        "user_id": "user_111",
                                        "phone": 9830311522,
                                        "signed_up_at": "2020-01-21T00:21:34.208Z",
                                        "custom_attributes": {
                                            "firstName": "Absolute",
                                            "lastName": "User",
                                            "custom_prop1": "custom_value1",
                                            "custom_prop2": 123,
                                            "custom_prop3": false,
                                            "createdAt": "2022-04-27T13:56:13.012Z"
                                        },
                                        "name": "Absolute User",
                                        "companies": [
                                            {
                                                "company_id": "company_222",
                                                "remove": false
                                            }
                                        ]
                                    },
                                    "JSON_ARRAY": {},
                                    "XML": {},
                                    "FORM": {}
                                },
                                "files": {},
                                "userId": "user_111"
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
                                    "apiKey": "apiKey_key_test_001",
                                    "sendAnonymousId": false
                                },
                                "ID": "custify-1234"
                            }
                        },
                        {
                            "batchedRequest": {
                                "version": "1",
                                "type": "REST",
                                "method": "POST",
                                "endpoint": "https://api.custify.com/people",
                                "headers": {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer undefined",
                                    "Accept": "application/json"
                                },
                                "params": {},
                                "body": {
                                    "JSON": {
                                        "user_id": "user_1234",
                                        "email": "user111@gmail.com",
                                        "phone": 9830311522,
                                        "session_count": 23,
                                        "unsubscribed_from_emails": false,
                                        "unsubscribed_from_calls": false,
                                        "signed_up_at": "2022-04-27T13:56:13.012Z",
                                        "custom_attributes": {
                                            "firstName": "New",
                                            "lastName": "User",
                                            "sessionCount": 23,
                                            "unsubscribedFromEmails": false,
                                            "unsubscribedFromCalls": false,
                                            "custom_prop1": "custom_value1",
                                            "custom_prop2": 123,
                                            "custom_prop3": false,
                                            "createdAt": "2022-04-27T13:56:13.012Z"
                                        },
                                        "name": "New User",
                                        "companies": [
                                            {
                                                "company_id": "company_123",
                                                "remove": false
                                            }
                                        ]
                                    },
                                    "JSON_ARRAY": {},
                                    "XML": {},
                                    "FORM": {}
                                },
                                "files": {},
                                "userId": "user_1234"
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
                                    "apiKeyToken": "pk_123",
                                    "listId": "correctListId123"
                                },
                                "ID": "custify-1234"
                            }
                        }
                    ],
                },
            },
        },
    },
];
