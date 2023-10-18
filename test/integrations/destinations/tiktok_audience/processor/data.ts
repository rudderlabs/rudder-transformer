export const data = [
    {
        "name": "tiktok_audience",
        "description": "Test 1: Containing SHA256 traits only",
        "feature": "processor",
        "module": "destination",
        "version": "v0",
        "input": {
            "request": {
                "body": [
                    {
                        "message": {
                            "userId": "user 1",
                            "type": "audiencelist",
                            "properties": {
                                "listData": {
                                    "add": [
                                        {
                                            "EMAIL_SHA256": "alex@email.com"
                                        },
                                        {
                                            "EMAIL_SHA256": "amy@abc.com"
                                        },
                                        {
                                            "EMAIL_SHA256": "van@abc.com"
                                        }
                                    ],
                                    "remove": [
                                        {
                                            "EMAIL_SHA256": "alex@email.com"
                                        },
                                        {
                                            "EMAIL_SHA256": "amy@abc.com"
                                        },
                                        {
                                            "EMAIL_SHA256": "van@abc.com"
                                        }
                                    ]
                                }
                            },
                            "context": {
                                "ip": "14.5.67.21",
                                "library": {
                                    "name": "http"
                                },
                                "externalId": [
                                    {
                                        "type": "TIKTOK_AUDIENCE-23856594064540489",
                                        "identifierType": "EMAIL_SHA256"
                                    }
                                ],
                                "destinationFields": "EMAIL_SHA256"
                            },
                            "timestamp": "2020-02-02T00:23:09.544Z"
                        },
                        "metadata": {
                            "jobId": 1,
                            "secret": {
                                "accessToken": "dummyAccessToken",
                                "advertiserIds": [
                                    "dummyAdverTiserID"
                                ]
                            }
                        },
                        "destination": {
                            "DestinationDefinition": {
                                "Config": {
                                    "cdkV2Enabled": true
                                }
                            },
                            "Config": {
                                "isHashRequired": true,
                                "registerDeviceOrBrowserApiKey": true,
                                "apiKey": "intercomApiKey",
                                "appId": "9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0",
                                "collectContext": false
                            }
                        }
                    }
                ]
            }
        },
        "output": {
            "response": {
                "status": 200,
                "body": [
                    {
                        "output": {
                            "version": "1",
                            "type": "REST",
                            "method": "POST",
                            "endpoint": "https://business-api.tiktok.com/open_api/v1.3/segment/mapping/",
                            "headers": {
                                "Access-Token": "dummyAccessToken",
                                "Content-Type": "application/json"
                            },
                            "params": {},
                            "body": {
                                "JSON": {
                                    "batch_data": [
                                        [
                                            {
                                                "id": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            }
                                        ],
                                        [
                                            {
                                                "id": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            }
                                        ],
                                        [
                                            {
                                                "id": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            }
                                        ]
                                    ],
                                    "id_schema": [
                                        "EMAIL_SHA256"
                                    ],
                                    "advertiser_ids": [
                                        "dummyAdverTiserID"
                                    ],
                                    "action": "add"
                                },
                                "JSON_ARRAY": {},
                                "XML": {},
                                "FORM": {}
                            },
                            "files": {},
                            "userId": ""
                        },
                        "metadata": {
                            "jobId": 1,
                            "secret": {
                                "accessToken": "dummyAccessToken",
                                "advertiserIds": [
                                    "dummyAdverTiserID"
                                ]
                            }
                        },
                        "statusCode": 200
                    },
                    {
                        "output": {
                            "version": "1",
                            "type": "REST",
                            "method": "POST",
                            "endpoint": "https://business-api.tiktok.com/open_api/v1.3/segment/mapping/",
                            "headers": {
                                "Access-Token": "dummyAccessToken",
                                "Content-Type": "application/json"
                            },
                            "params": {},
                            "body": {
                                "JSON": {
                                    "batch_data": [
                                        [
                                            {
                                                "id": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            }
                                        ],
                                        [
                                            {
                                                "id": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            }
                                        ],
                                        [
                                            {
                                                "id": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            }
                                        ]
                                    ],
                                    "id_schema": [
                                        "EMAIL_SHA256"
                                    ],
                                    "advertiser_ids": [
                                        "dummyAdverTiserID"
                                    ],
                                    "action": "delete"
                                },
                                "JSON_ARRAY": {},
                                "XML": {},
                                "FORM": {}
                            },
                            "files": {},
                            "userId": ""
                        },
                        "metadata": {
                            "jobId": 1,
                            "secret": {
                                "accessToken": "dummyAccessToken",
                                "advertiserIds": [
                                    "dummyAdverTiserID"
                                ]
                            }
                        },
                        "statusCode": 200
                    }
                ]
            }
        }
    },
    {
        "name": "tiktok_audience",
        "description": "Test 1: Containing SHA256 and MD5 traits",
        "feature": "processor",
        "module": "destination",
        "version": "v0",
        "input": {
            "request": {
                "body": [
                    {
                        "message": {
                            "userId": "user 1",
                            "type": "audiencelist",
                            "properties": {
                                "listData": {
                                    "add": [
                                        {
                                            "EMAIL_SHA256": "alex@email.com",
                                            "AAID_MD5": "1234567"
                                        },
                                        {
                                            "EMAIL_SHA256": "amy@abc.com",
                                            "AAID_MD5": "1234568"
                                        },
                                        {
                                            "EMAIL_SHA256": "van@abc.com",
                                            "AAID_MD5": "1234569"
                                        }
                                    ],
                                    "remove": [
                                        {
                                            "EMAIL_SHA256": "alex@email.com",
                                            "AAID_MD5": "1234570"
                                        },
                                        {
                                            "EMAIL_SHA256": "amy@abc.com",
                                            "AAID_MD5": "1234571"
                                        },
                                        {
                                            "EMAIL_SHA256": "van@abc.com",
                                            "AAID_MD5": "1234572"
                                        }
                                    ]
                                }
                            },
                            "context": {
                                "ip": "14.5.67.21",
                                "library": {
                                    "name": "http"
                                },
                                "externalId": [
                                    {
                                        "type": "TIKTOK_AUDIENCE-23856594064540489",
                                        "identifierType": "EMAIL_SHA256"
                                    }
                                ],
                                "destinationFields": "EMAIL_SHA256, AAID_MD5"
                            },
                            "timestamp": "2020-02-02T00:23:09.544Z"
                        },
                        "metadata": {
                            "jobId": 1,
                            "secret": {
                                "accessToken": "dummyAccessToken",
                                "advertiserIds": [
                                    "dummyAdverTiserID"
                                ]
                            }
                        },
                        "destination": {
                            "DestinationDefinition": {
                                "Config": {
                                    "cdkV2Enabled": true
                                }
                            },
                            "Config": {
                                "isHashRequired": true,
                                "registerDeviceOrBrowserApiKey": true,
                                "apiKey": "intercomApiKey",
                                "appId": "9e9cdea1-78fa-4829-a9b2-5d7f7e96d1a0",
                                "collectContext": false
                            }
                        }
                    }
                ]
            }
        },
        "output": {
            "response": {
                "status": 200,
                "body": [
                    {
                        "output": {
                            "version": "1",
                            "type": "REST",
                            "method": "POST",
                            "endpoint": "https://business-api.tiktok.com/open_api/v1.3/segment/mapping/",
                            "headers": {
                                "Access-Token": "dummyAccessToken",
                                "Content-Type": "application/json"
                            },
                            "params": {},
                            "body": {
                                "JSON": {
                                    "batch_data": [
                                        [
                                            {
                                                "id": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            },
                                            {
                                                "id": "fcea920f7412b5da7be0cf42b8c93759",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            }
                                        ],
                                        [
                                            {
                                                "id": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            },
                                            {
                                                "id": "fe743d8d97aa7dfc6c93ccdc2e749513",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            }
                                        ],
                                        [
                                            {
                                                "id": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            },
                                            {
                                                "id": "e36a2f90240e9e84483504fd4a704452",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            }
                                        ]
                                    ],
                                    "id_schema": [
                                        "EMAIL_SHA256",
                                        "AAID_MD5"
                                    ],
                                    "advertiser_ids": [
                                        "dummyAdverTiserID"
                                    ],
                                    "action": "add"
                                },
                                "JSON_ARRAY": {},
                                "XML": {},
                                "FORM": {}
                            },
                            "files": {},
                            "userId": ""
                        },
                        "metadata": {
                            "jobId": 1,
                            "secret": {
                                "accessToken": "dummyAccessToken",
                                "advertiserIds": [
                                    "dummyAdverTiserID"
                                ]
                            }
                        },
                        "statusCode": 200
                    },
                    {
                        "output": {
                            "version": "1",
                            "type": "REST",
                            "method": "POST",
                            "endpoint": "https://business-api.tiktok.com/open_api/v1.3/segment/mapping/",
                            "headers": {
                                "Access-Token": "dummyAccessToken",
                                "Content-Type": "application/json"
                            },
                            "params": {},
                            "body": {
                                "JSON": {
                                    "batch_data": [
                                        [
                                            {
                                                "id": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            },
                                            {
                                                "id": "c1abd65fea29d573ddef1bce925e3276",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            }
                                        ],
                                        [
                                            {
                                                "id": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            },
                                            {
                                                "id": "7298110702a080dfc6903f13333eb04a",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            }
                                        ],
                                        [
                                            {
                                                "id": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            },
                                            {
                                                "id": "d9cb68b1fd3b9d32abc5f4cab8b42b68",
                                                "audience_ids": [
                                                    "23856594064540489"
                                                ]
                                            }
                                        ]
                                    ],
                                    "id_schema": [
                                        "EMAIL_SHA256",
                                        "AAID_MD5"
                                    ],
                                    "advertiser_ids": [
                                        "dummyAdverTiserID"
                                    ],
                                    "action": "delete"
                                },
                                "JSON_ARRAY": {},
                                "XML": {},
                                "FORM": {}
                            },
                            "files": {},
                            "userId": ""
                        },
                        "metadata": {
                            "jobId": 1,
                            "secret": {
                                "accessToken": "dummyAccessToken",
                                "advertiserIds": [
                                    "dummyAdverTiserID"
                                ]
                            }
                        },
                        "statusCode": 200
                    }
                ]
            }
        }
    }
]