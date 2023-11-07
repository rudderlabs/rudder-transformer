export const data = [
    {
        name: 'google_adwords_offline_conversions',
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
                    "endpoint": "https://googleads.googleapis.com/v14/customers/11122233331/offlineUserDataJobs",
                    "headers": {
                        "Authorization": "Bearer abcd1234",
                        "Content-Type": "application/json",
                        "developer-token": "ijkl91011",
                        "login-customer-id": "logincustomerid"
                    },
                    "params": {
                        "customerId": "1112223333",
                        "event": "Sign-up - click"
                    },
                    "body": {
                        "JSON": {
                            "addConversionPayload": {
                                "enable_partial_failure": false,
                                "enable_warnings": false,
                                "operations": [
                                    {
                                        "create": {
                                            "transaction_attribute": {
                                                "CUSTOM_KEY": "CUSTOM_VALUE",
                                                "currency_code": "INR",
                                                "order_id": "order id",
                                                "store_attribute": {
                                                    "store_code": "store code"
                                                },
                                                "transaction_amount_micros": "100000000",
                                                "transaction_date_time": "2019-10-14 11:15:18+00:00"
                                            },
                                            "userIdentifiers": [
                                                {
                                                    "hashedEmail": "6db61e6dcbcf2390e4a46af26f26a133a3bee45021422fc7ae86e9136f14110",
                                                    "userIdentifierSource": "UNSPECIFIED"
                                                }
                                            ]
                                        }
                                    }
                                ],
                                "validate_only": false
                            },
                            "createJobPayload": {
                                "job": {
                                    "storeSalesMetadata": {
                                        "custom_key": "CUSTOM_KEY",
                                        "loyaltyFraction": 1,
                                        "transaction_upload_fraction": "1"
                                    },
                                    "type": "STORE_SALES_UPLOAD_FIRST_PARTY"
                                }
                            },
                            "event": "1112223333",
                            "executeJobPayload": {
                                "validate_only": false
                            },
                            "isStoreConversion": true
                        },
                        "JSON_ARRAY": {},
                        "XML": {},
                        "FORM": {}
                    },
                    "files": {}
                },
                method: 'POST',
            },
        },
        output: {
            response: {
                status: 400,
                body: {
                    "output": {
                        "status": 400,
                        "message": "[Google Ads Offline Conversions]:: Request contains an invalid argument. during google_ads_offline_store_conversions Add Conversion",
                        "destinationResponse": {
                            "error": {
                                "code": 400,
                                "details": [
                                    {
                                        "@type": "type.googleapis.com/google.ads.googleads.v14.errors.GoogleAdsFailure",
                                        "errors": [
                                            {
                                                "errorCode": {
                                                    "offlineUserDataJobError": "INVALID_SHA256_FORMAT"
                                                },
                                                "message": "The SHA256 encoded value is malformed.",
                                                "location": {
                                                    "fieldPathElements": [
                                                        {
                                                            "fieldName": "operations",
                                                            "index": 0
                                                        },
                                                        {
                                                            "fieldName": "create"
                                                        },
                                                        {
                                                            "fieldName": "user_identifiers",
                                                            "index": 0
                                                        },
                                                        {
                                                            "fieldName": "hashed_email"
                                                        }
                                                    ]
                                                }
                                            }
                                        ],
                                        "requestId": "68697987"
                                    }
                                ],
                                "message": "Request contains an invalid argument.",
                                "status": "INVALID_ARGUMENT"
                            }
                        },
                        "statTags": {
                            "destType": "GOOGLE_ADWORDS_OFFLINE_CONVERSIONS",
                            "destinationId": "Non-determininable",
                            "errorCategory": "network",
                            "errorType": "aborted",
                            "feature": "dataDelivery",
                            "implementation": "native",
                            "module": "destination",
                            "workspaceId": "Non-determininable",
                        }
                    }
                },
            },
        },
    },
    {
        name: 'google_adwords_offline_conversions',
        description: 'Test 1',
        feature: 'dataDelivery',
        module: 'destination',
        version: 'v0',
        input: {
            request: {
                "body": {
                    "version": "1",
                    "type": "REST",
                    "method": "POST",
                    "endpoint": "https://googleads.googleapis.com/v14/customers/1112223333/offlineUserDataJobs",
                    "headers": {
                        "Authorization": "Bearer abcd1234",
                        "Content-Type": "application/json",
                        "developer-token": "ijkl91011",
                        "login-customer-id": "logincustomerid"
                    },
                    "params": {
                        "customerId": "1112223333",
                        "event": "Sign-up - click"
                    },
                    "body": {
                        "JSON": {
                            "addConversionPayload": {
                                "enable_partial_failure": false,
                                "enable_warnings": false,
                                "operations": [
                                    {
                                        "create": {
                                            "transaction_attribute": {
                                                "CUSTOM_KEY": "CUSTOM_VALUE",
                                                "currency_code": "INR",
                                                "order_id": "order id",
                                                "store_attribute": {
                                                    "store_code": "store code"
                                                },
                                                "transaction_amount_micros": "100000000",
                                                "transaction_date_time": "2019-10-14 11:15:18+00:00"
                                            },
                                            "userIdentifiers": [
                                                {
                                                    "hashedEmail": "6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110",
                                                    "userIdentifierSource": "UNSPECIFIED"
                                                }
                                            ]
                                        }
                                    }
                                ],
                                "validate_only": false
                            },
                            "createJobPayload": {
                                "job": {
                                    "storeSalesMetadata": {
                                        "custom_key": "CUSTOM_KEY",
                                        "loyaltyFraction": 1,
                                        "transaction_upload_fraction": "1"
                                    },
                                    "type": "STORE_SALES_UPLOAD_FIRST_PARTY"
                                }
                            },
                            "event": "1112223333",
                            "executeJobPayload": {
                                "validate_only": false
                            },
                            "isStoreConversion": true
                        },
                        "JSON_ARRAY": {},
                        "XML": {},
                        "FORM": {}
                    },
                    "files": {}
                }
            },
        },
        output: {
            response: {
                status: 200,
                body: {
                    "output": {
                        "status": 200,
                        "message": "[Google Ads Offline Conversions Response Handler] - Request processed successfully",
                        "destinationResponse": {
                            "response": {
                                "name": "customers/111-222-3333/operations/abcd="
                            },
                            "status": 200
                        }
                    }
                },
            },
        },
    },
    {
        name: 'google_adwords_offline_conversions',
        description: 'Test 2',
        feature: 'dataDelivery',
        module: 'destination',
        version: 'v0',
        input: {
            request: {
                "body": {
                    "version": "1",
                    "type": "REST",
                    "method": "POST",
                    "endpoint": "https://googleads.googleapis.com/v14/customers/customerid/offlineUserDataJobs",
                    "headers": {
                        "Authorization": "Bearer abcd1234",
                        "Content-Type": "application/json",
                        "developer-token": "ijkl91011",
                        "login-customer-id": "logincustomerid"
                    },
                    "params": {
                        "customerId": "1112223333",
                        "event": "Sign-up - click"
                    },
                    "body": {
                        "JSON": {
                            "addConversionPayload": {
                                "enable_partial_failure": false,
                                "enable_warnings": false,
                                "operations": [
                                    {
                                        "create": {
                                            "transaction_attribute": {
                                                "CUSTOM_KEY": "CUSTOM_VALUE",
                                                "currency_code": "INR",
                                                "order_id": "order id",
                                                "store_attribute": {
                                                    "store_code": "store code"
                                                },
                                                "transaction_amount_micros": "100000000",
                                                "transaction_date_time": "2019-10-14 11:15:18+00:00"
                                            },
                                            "userIdentifiers": [
                                                {
                                                    "hashedEmail": "6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110",
                                                    "userIdentifierSource": "UNSPECIFIED"
                                                }
                                            ]
                                        }
                                    }
                                ],
                                "validate_only": false
                            },
                            "createJobPayload": {
                                "job": {
                                    "storeSalesMetadata": {
                                        "custom_key": "CUSTOM_KEY",
                                        "loyaltyFraction": 1,
                                        "transaction_upload_fraction": "1"
                                    },
                                    "type": "STORE_SALES_UPLOAD_FIRST_PARTY"
                                }
                            },
                            "event": "1112223333",
                            "executeJobPayload": {
                                "validate_only": false
                            },
                            "isStoreConversion": true
                        },
                        "JSON_ARRAY": {},
                        "XML": {},
                        "FORM": {}
                    },
                    "files": {}
                }
            },
        },
        output: {
            response: {
                status: 401,
                body: {
                    "output": {
                        "status": 401,
                        "message": "[Google Ads Offline Conversions]:: Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project. during google_ads_offline_store_conversions Job Creation",
                        "authErrorCategory": "REFRESH_TOKEN",
                        "destinationResponse": {
                            "error": {
                                "code": 401,
                                "message": "Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.",
                                "status": "UNAUTHENTICATED"
                            }
                        },
                        "statTags": {
                            "destType": "GOOGLE_ADWORDS_OFFLINE_CONVERSIONS",
                            "destinationId": "Non-determininable",
                            "errorCategory": "network",
                            "errorType": "aborted",
                            "feature": "dataDelivery",
                            "implementation": "native",
                            "module": "destination",
                            "workspaceId": "Non-determininable"
                        }
                    }
                }
            },
        },
    },
    {
        name: 'google_adwords_offline_conversions',
        description: 'Test 3',
        feature: 'dataDelivery',
        module: 'destination',
        version: 'v0',
        input: {
            request: {
                "body": {
                    "version": "1",
                    "type": "REST",
                    "method": "POST",
                    "endpoint": "https://googleads.googleapis.com/v14/customers/1234567890:uploadClickConversions",
                    "headers": {
                        "Authorization": "Bearer abcd1234",
                        "Content-Type": "application/json",
                        "developer-token": "ijkl91011"
                    },
                    "params": {
                        "event": "Sign-up - click",
                        "customerId": "1234567890",
                        "customVariables": [
                            {
                                "from": "value",
                                "to": "revenue"
                            },
                            {
                                "from": "total",
                                "to": "cost"
                            }
                        ],
                        "properties": {
                            "gbraid": "gbraid",
                            "wbraid": "wbraid",
                            "externalAttributionCredit": 10,
                            "externalAttributionModel": "externalAttributionModel",
                            "conversionCustomVariable": "conversionCustomVariable",
                            "value": "value",
                            "merchantId": "9876merchantId",
                            "feedCountryCode": "feedCountryCode",
                            "feedLanguageCode": "feedLanguageCode",
                            "localTransactionCost": 20,
                            "products": [
                                {
                                    "product_id": "507f1f77bcf86cd799439011",
                                    "quantity": "2",
                                    "price": "50",
                                    "sku": "45790-32",
                                    "name": "Monopoly: 3rd Edition",
                                    "position": "1",
                                    "category": "cars",
                                    "url": "https://www.example.com/product/path",
                                    "image_url": "https://www.example.com/product/path.jpg"
                                }
                            ],
                            "userIdentifierSource": "FIRST_PARTY",
                            "conversionEnvironment": "WEB",
                            "gclid": "gclid",
                            "conversionDateTime": "2022-01-01 12:32:45-08:00",
                            "conversionValue": "1",
                            "currency": "GBP",
                            "orderId": "PL-123QR"
                        }
                    },
                    "body": {
                        "JSON": {
                            "conversions": [
                                {
                                    "gbraid": "gbraid",
                                    "wbraid": "wbraid",
                                    "externalAttributionData": {
                                        "externalAttributionCredit": 10,
                                        "externalAttributionModel": "externalAttributionModel"
                                    },
                                    "cartData": {
                                        "merchantId": 9876,
                                        "feedCountryCode": "feedCountryCode",
                                        "feedLanguageCode": "feedLanguageCode",
                                        "localTransactionCost": 20,
                                        "items": [
                                            {
                                                "productId": "507f1f77bcf86cd799439011",
                                                "quantity": 2,
                                                "unitPrice": 50
                                            }
                                        ]
                                    },
                                    "userIdentifiers": [
                                        {
                                            "userIdentifierSource": "FIRST_PARTY",
                                            "hashedEmail": "6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110"
                                        }
                                    ],
                                    "conversionEnvironment": "WEB",
                                    "gclid": "gclid",
                                    "conversionDateTime": "2022-01-01 12:32:45-08:00",
                                    "conversionValue": 1,
                                    "currencyCode": "GBP",
                                    "orderId": "PL-123QR"
                                }
                            ],
                            "partialFailure": true
                        },
                        "JSON_ARRAY": {},
                        "XML": {},
                        "FORM": {}
                    },
                    "files": {}
                }
            },
        },
        output: {
            response: {
                status: 401,
                body: {
                    "output": {
                        "status": 401,
                        "message": "[Google Ads Offline Conversions]:: [{\"error\":{\"code\":401,\"message\":\"Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.\",\"status\":\"UNAUTHENTICATED\"}}] during google_ads_offline_conversions response transformation",
                        "authErrorCategory": "REFRESH_TOKEN",
                        "destinationResponse": [
                            {
                                "error": {
                                    "code": 401,
                                    "message": "Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.",
                                    "status": "UNAUTHENTICATED"
                                }
                            }
                        ],
                        "statTags": {
                            "destType": "GOOGLE_ADWORDS_OFFLINE_CONVERSIONS",
                            "destinationId": "Non-determininable",
                            "errorCategory": "network",
                            "errorType": "aborted",
                            "feature": "dataDelivery",
                            "implementation": "native",
                            "module": "destination",
                            "workspaceId": "Non-determininable",
                        }
                    }
                }
            },
        },
    },
    {
        name: 'google_adwords_offline_conversions',
        description: 'Test 4',
        feature: 'dataDelivery',
        module: 'destination',
        version: 'v0',
        input: {
            "request": {
                "body": {
                    "version": "1",
                    "type": "REST",
                    "method": "POST",
                    "endpoint": "https://googleads.googleapis.com/v14/customers/1234567891:uploadClickConversions",
                    "headers": {
                        "Authorization": "Bearer abcd1234",
                        "Content-Type": "application/json",
                        "developer-token": "ijkl91011"
                    },
                    "params": {
                        "event": "Sign-up - click",
                        "customerId": "1234567891",
                        "customVariables": [
                            {
                                "from": "Value",
                                "to": "revenue"
                            },
                            {
                                "from": "total",
                                "to": "cost"
                            }
                        ],
                        "properties": {
                            "gbraid": "gbraid",
                            "wbraid": "wbraid",
                            "externalAttributionCredit": 10,
                            "externalAttributionModel": "externalAttributionModel",
                            "conversionCustomVariable": "conversionCustomVariable",
                            "Value": "value",
                            "merchantId": "9876merchantId",
                            "feedCountryCode": "feedCountryCode",
                            "feedLanguageCode": "feedLanguageCode",
                            "localTransactionCost": 20,
                            "products": [
                                {
                                    "product_id": "507f1f77bcf86cd799439011",
                                    "quantity": "2",
                                    "price": "50",
                                    "sku": "45790-32",
                                    "name": "Monopoly: 3rd Edition",
                                    "position": "1",
                                    "category": "cars",
                                    "url": "https://www.example.com/product/path",
                                    "image_url": "https://www.example.com/product/path.jpg"
                                }
                            ],
                            "userIdentifierSource": "FIRST_PARTY",
                            "conversionEnvironment": "WEB",
                            "gclid": "gclid",
                            "conversionDateTime": "2022-01-01 12:32:45-08:00",
                            "conversionValue": "1",
                            "currency": "GBP",
                            "orderId": "PL-123QR"
                        }
                    },
                    "body": {
                        "JSON": {
                            "conversions": [
                                {
                                    "gbraid": "gbraid",
                                    "wbraid": "wbraid",
                                    "externalAttributionData": {
                                        "externalAttributionCredit": 10,
                                        "externalAttributionModel": "externalAttributionModel"
                                    },
                                    "cartData": {
                                        "merchantId": 9876,
                                        "feedCountryCode": "feedCountryCode",
                                        "feedLanguageCode": "feedLanguageCode",
                                        "localTransactionCost": 20,
                                        "items": [
                                            {
                                                "productId": "507f1f77bcf86cd799439011",
                                                "quantity": 2,
                                                "unitPrice": 50
                                            }
                                        ]
                                    },
                                    "userIdentifiers": [
                                        {
                                            "userIdentifierSource": "FIRST_PARTY",
                                            "hashedPhoneNumber": "04e1dabb7c1348b72bfa87da179c9697c69af74827649266a5da8cdbb367abcd"
                                        }
                                    ],
                                    "conversionEnvironment": "WEB",
                                    "gclid": "gclid",
                                    "conversionDateTime": "2022-01-01 12:32:45-08:00",
                                    "conversionValue": 1,
                                    "currencyCode": "GBP",
                                    "orderId": "PL-123QR"
                                }
                            ],
                            "partialFailure": true
                        },
                        "JSON_ARRAY": {},
                        "XML": {},
                        "FORM": {}
                    },
                    "files": {}
                }
            }
        },
        output: {
            response: {
                status: 200,
                body: {
                    "output": {
                        "status": 200,
                        "message": "[Google Ads Offline Conversions Response Handler] - Request processed successfully",
                        "destinationResponse": {
                            "response": [
                                {
                                    "adjustmentType": "ENHANCEMENT",
                                    "conversionAction": "customers/1234567891/conversionActions/874224905",
                                    "adjustmentDateTime": "2021-01-01 12:32:45-08:00",
                                    "gclidDateTimePair": {
                                        "gclid": "1234",
                                        "conversionDateTime": "2021-01-01 12:32:45-08:00"
                                    },
                                    "orderId": "12345"
                                }
                            ],
                            "status": 200
                        }
                    }
                }
            },
        },
    },
    {
        name: 'google_adwords_offline_conversions',
        description: 'Test 5',
        feature: 'dataDelivery',
        module: 'destination',
        version: 'v0',
        input: {
            "request": {
                "body": {
                    "version": "1",
                    "type": "REST",
                    "method": "POST",
                    "endpoint": "https://googleads.googleapis.com/v14/customers/1234567891:uploadClickConversions",
                    "headers": {
                        "Authorization": "Bearer abcd1234",
                        "Content-Type": "application/json",
                        "developer-token": "ijkl91011"
                    },
                    "params": {
                        "event": "Sign-up - click",
                        "customerId": "1234567891",
                        "customVariables": [],
                        "properties": {
                            "gbraid": "gbraid",
                            "wbraid": "wbraid",
                            "externalAttributionCredit": 10,
                            "externalAttributionModel": "externalAttributionModel",
                            "conversionCustomVariable": "conversionCustomVariable",
                            "value": "value",
                            "merchantId": "9876merchantId",
                            "feedCountryCode": "feedCountryCode",
                            "feedLanguageCode": "feedLanguageCode",
                            "localTransactionCost": 20,
                            "products": [
                                {
                                    "product_id": "507f1f77bcf86cd799439011",
                                    "quantity": "2",
                                    "price": "50",
                                    "sku": "45790-32",
                                    "name": "Monopoly: 3rd Edition",
                                    "position": "1",
                                    "category": "cars",
                                    "url": "https://www.example.com/product/path",
                                    "image_url": "https://www.example.com/product/path.jpg"
                                }
                            ],
                            "userIdentifierSource": "FIRST_PARTY",
                            "conversionEnvironment": "WEB",
                            "gclid": "gclid",
                            "conversionDateTime": "2022-01-01 12:32:45-08:00",
                            "conversionValue": "1",
                            "currency": "GBP",
                            "orderId": "PL-123QR"
                        }
                    },
                    "body": {
                        "JSON": {
                            "conversions": [
                                {
                                    "gbraid": "gbraid",
                                    "wbraid": "wbraid",
                                    "externalAttributionData": {
                                        "externalAttributionCredit": 10,
                                        "externalAttributionModel": "externalAttributionModel"
                                    },
                                    "cartData": {
                                        "merchantId": 9876,
                                        "feedCountryCode": "feedCountryCode",
                                        "feedLanguageCode": "feedLanguageCode",
                                        "localTransactionCost": 20,
                                        "items": [
                                            {
                                                "productId": "507f1f77bcf86cd799439011",
                                                "quantity": 2,
                                                "unitPrice": 50
                                            }
                                        ]
                                    },
                                    "userIdentifiers": [
                                        {
                                            "userIdentifierSource": "FIRST_PARTY",
                                            "hashedPhoneNumber": "04e1dabb7c1348b72bfa87da179c9697c69af74827649266a5da8cdbb367abcd"
                                        }
                                    ],
                                    "conversionEnvironment": "WEB",
                                    "gclid": "gclid",
                                    "conversionDateTime": "2022-01-01 12:32:45-08:00",
                                    "conversionValue": 1,
                                    "currencyCode": "GBP",
                                    "orderId": "PL-123QR"
                                }
                            ],
                            "partialFailure": true
                        },
                        "JSON_ARRAY": {},
                        "XML": {},
                        "FORM": {}
                    },
                    "files": {}
                }
            }
        },
        output: {
            response: {
                status: 200,
                body: {
                    "output": {
                        "destinationResponse": {
                            "response": [
                                {
                                    "adjustmentDateTime": "2021-01-01 12:32:45-08:00",
                                    "adjustmentType": "ENHANCEMENT",
                                    "conversionAction": "customers/1234567891/conversionActions/874224905",
                                    "gclidDateTimePair": {
                                        "conversionDateTime": "2021-01-01 12:32:45-08:00",
                                        "gclid": "1234"
                                    },
                                    "orderId": "12345"
                                }
                            ],
                            "status": 200
                        },
                        "message": "[Google Ads Offline Conversions Response Handler] - Request processed successfully",
                        "status": 200
                    }
                }
            },
        },
    }
];
