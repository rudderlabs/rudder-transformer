export const data = [
    {
        name: 'google_adwords_remarketing_lists',
        description: 'Test 0',
        feature: 'dataDelivery',
        module: 'destination',
        version: 'v0',
        input: {
            request: {
                body: {
                    "version": "1",
                    "type": "REST",
                    "method": "POST",
                    "endpoint": "https://googleads.googleapis.com/v14/customers/7693729833/offlineUserDataJobs",
                    "headers": {
                        "Authorization": "Bearer dummy-access",
                        "Content-Type": "application/json",
                        "developer-token": "dummy-dev-token"
                    },
                    "params": {
                        "destination": "google_adwords_remarketing_lists",
                        "listId": "709078448",
                        "customerId": "7693729833"
                    },
                    "body": {
                        "JSON": {
                            "enablePartialFailure": true,
                            "operations": [
                                {
                                    "create": {
                                        "userIdentifiers": [
                                            {
                                                "hashedEmail": "85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05"
                                            },
                                            {
                                                "hashedPhoneNumber": "8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45"
                                            },
                                            {
                                                "hashedEmail": "85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05"
                                            },
                                            {
                                                "hashedPhoneNumber": "8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45"
                                            },
                                            {
                                                "addressInfo": {
                                                    "hashedFirstName": "e56d336922eaab3be8c1244dbaa713e134a8eba50ddbd4f50fd2fe18d72595cd"
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "JSON_ARRAY": {},
                        "XML": {},
                        "FORM": {}
                    },
                    "files": {}
                },
                method: 'POST'
            },
        },
        output: {
            response: {
                status: 200,
                body: {
                    "output": {
                        "status": 200,
                        "message": "Request Processed Successfully",
                        "destinationResponse": { "response": "", "status": 200 }
                    }
                },
            },
        },
    },
    {
        name: 'google_adwords_remarketing_lists',
        description: 'Test 1',
        feature: 'dataDelivery',
        module: 'destination',
        version: 'v0',
        input: {
            request: {
                body: {
                    "version": "1",
                    "type": "REST",
                    "method": "POST",
                    "endpoint": "https://googleads.googleapis.com/v14/customers/7693729834/offlineUserDataJobs",
                    "headers": {
                        "Authorization": "Bearer dummy-access",
                        "Content-Type": "application/json",
                        "developer-token": "dummy-dev-token"
                    },
                    "params": {
                        "listId": "709078448",
                        "customerId": "7693729833",
                        "destination": "google_adwords_remarketing_lists"
                    },
                    "body": {
                        "JSON": {
                            "enablePartialFailure": true,
                            "operations": [
                                {
                                    "create": {
                                        "userIdentifiers": [
                                            {
                                                "hashedEmail": "abcd@testmail.com"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "JSON_ARRAY": {},
                        "XML": {},
                        "FORM": {}
                    },
                    "files": {}
                },
                method: 'POST'
            },
        },
        output: {
            response: {
                status: 400,
                body: {
                    output: {
                        "status": 400,
                        "message": "Request contains an invalid argument. during ga_audience response transformation",
                        "destinationResponse": {
                            "error": {
                                "code": 400,
                                "details": [
                                    {
                                        "@type": "type.googleapis.com/google.ads.googleads.v9.errors.GoogleAdsFailure",
                                        "errors": [
                                            {
                                                "errorCode": {
                                                    "offlineUserDataJobError": "INVALID_SHA256_FORMAT"
                                                },
                                                "message": "The SHA256 encoded value is malformed.",
                                                "location": {
                                                    "fieldPathElements": [
                                                        { "fieldName": "operations", "index": 0 },
                                                        { "fieldName": "remove" },
                                                        { "fieldName": "user_identifiers", "index": 0 },
                                                        { "fieldName": "hashed_email" }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ],
                                "message": "Request contains an invalid argument.",
                                "status": "INVALID_ARGUMENT"
                            }
                        },
                        "statTags": {
                            "destType": "GOOGLE_ADWORDS_REMARKETING_LISTS",
                            "errorCategory": "network",
                            "destinationId": "Non-determininable",
                            "workspaceId": "Non-determininable",
                            "errorType": "aborted",
                            "feature": "dataDelivery",
                            "implementation": "native",
                            "module": "destination"
                        }
                    },
                },
            },
        },
    },
    {
        name: 'google_adwords_remarketing_lists',
        description: 'Test 2',
        feature: 'dataDelivery',
        module: 'destination',
        version: 'v0',
        input: {
            request: {
                body: {
                    "version": "1",
                    "type": "REST",
                    "method": "POST",
                    "endpoint": "https://googleads.googleapis.com/v14/customers/7693729833/offlineUserDataJobs",
                    "headers": {
                        "Authorization": "Bearer dummy-access",
                        "Content-Type": "application/json",
                        "developer-token": "dummy-dev-token"
                    },
                    "params": {
                        "listId": "709078448",
                        "customerId": "7693729833",
                        "destination": "google_adwords_remarketing_lists"
                    },
                    "body": {
                        "JSON": {
                            "enablePartialFailure": true,
                            "operations": [
                                {
                                    "remove": {
                                        "userIdentifiers": [
                                            {
                                                "hashedEmail": "85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05"
                                            },
                                            {
                                                "hashedPhoneNumber": "8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45"
                                            },
                                            {
                                                "hashedEmail": "85cc9fefa1eff1baab55d10df0cecff2acb25344867a5d0f96e1b1c5e2f10f05"
                                            },
                                            {
                                                "hashedPhoneNumber": "8846dcb6ab2d73a0e67dbd569fa17cec2d9d391e5b05d1dd42919bc21ae82c45"
                                            },
                                            {
                                                "addressInfo": {
                                                    "hashedFirstName": "e56d336922eaab3be8c1244dbaa713e134a8eba50ddbd4f50fd2fe18d72595cd"
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "JSON_ARRAY": {},
                        "XML": {},
                        "FORM": {}
                    },
                    "files": {}
                },
                method: 'POST'
            },
        },
        output: {
            response: {
                status: 200,
                body: {
                    output: {
                        "status": 200,
                        "message": "Request Processed Successfully",
                        "destinationResponse": { "response": "", "status": 200 }
                    },
                },
            },
        },
    }
];
