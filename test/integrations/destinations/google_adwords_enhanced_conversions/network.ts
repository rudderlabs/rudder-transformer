export const networkCallsData = [
    {
        httpReq: {
            url: 'https://googleads.googleapis.com/v14/customers/1234567890/googleAds:searchStream',
            data: {
                query: `SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'Product Added'`,
            },
            headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': '0987654321',
            },
            method: 'POST',
        },
        httpRes: {
            "data": [
                {
                    "error": {
                        "code": 401,
                        "message": "Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.",
                        "status": "UNAUTHENTICATED"
                    }
                }
            ],
            "status": 401
        },
    },
    {
        httpReq: {
            url: 'https://googleads.googleapis.com/v14/customers/1234567899/googleAds:searchStream',
            data: {
                query: `SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'Product Added'`
            },
            params: { destination: 'google_adwords_enhanced_conversion' },
            headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': '0987654321',
            },
            method: 'POST',
        },
        httpRes: {
            data: [{
                results: [{
                    conversionAction: {
                        id: 123434342
                    }
                }]
            }],
            status: 200,
        },
    },
    {
        httpReq: {
            url: 'https://googleads.googleapis.com/v14/customers/1234567899:uploadConversionAdjustments',
            data: {
                conversionAdjustments: [{
                    adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                    adjustmentType: 'ENHANCEMENT',
                    conversionAction: 'customers/1234567899/conversionActions/123434342',
                    gclidDateTimePair: {
                        conversionDateTime: '2022-01-01 12:32:45-08:00',
                        gclid: 'gclid1234'
                    },
                    order_id: '10000',
                    restatementValue: { adjustedValue: 10, currency: 'INR' },
                    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                    userIdentifiers: [{
                        addressInfo: {
                            hashedFirstName: 'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da',
                            hashedLastName: '1c574b17eefa532b6d61c963550a82d2d3dfca4a7fb69e183374cfafd5328ee4',
                            state: 'UK',
                            city: 'London',
                            hashedStreetAddress: '9a4d2e50828448f137f119a3ebdbbbab8d6731234a67595fdbfeb2a2315dd550'
                        }
                    }]
                }],
                partialFailure: true
            },
            params: { destination: 'google_adwords_enhanced_conversion' },
            headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': '0987654321',
            },
            method: 'POST',
        },
        httpRes: {
            data: [{
                results: [{
                    "adjustmentType": "ENHANCEMENT",
                    "conversionAction": "customers/7693729833/conversionActions/874224905",
                    "adjustmentDateTime": "2021-01-01 12:32:45-08:00",
                    "gclidDateTimePair": {
                        "gclid": "1234",
                        "conversionDateTime": "2021-01-01 12:32:45-08:00"
                    },
                    "orderId": "12345"
                }]
            }],
            status: 200,
        },
    },
    {
        httpReq: {
            url: 'https://googleads.googleapis.com/v14/customers/1234567891/googleAds:searchStream',
            data: {
                query: `SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'Product Added'`
            },
            params: { destination: 'google_adwords_enhanced_conversion' },
            headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': '0987654321',
            },
            method: 'POST',
        },
        httpRes: {
            data: [{
                results: [{
                    conversionAction: {
                        id: 123434342
                    }
                }]
            }],
            status: 200,
        },
    },
    {
        httpReq: {
            url: 'https://googleads.googleapis.com/v14/customers/1234567891:uploadConversionAdjustments',
            data: {
                conversionAdjustments: [{
                    adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                    adjustmentType: 'ENHANCEMENT',
                    conversionAction: 'customers/1234567891/conversionActions/123434342',
                    gclidDateTimePair: {
                        conversionDateTime: '2022-01-01 12:32:45-08:00',
                        gclid: 'gclid1234'
                    },
                    order_id: '10000',
                    restatementValue: { adjustedValue: 10, currency: 'INR' },
                    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                    userIdentifiers: [{
                        addressInfo: {
                            hashedFirstName: 'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da',
                            hashedLastName: '1c574b17eefa532b6d61c963550a82d2d3dfca4a7fb69e183374cfafd5328ee4',
                            state: 'UK',
                            city: 'London',
                            hashedStreetAddress: '9a4d2e50828448f137f119a3ebdbbbab8d6731234a67595fdbfeb2a2315dd550'
                        }
                    }]
                }],
                partialFailure: true
            },
            params: {
                destination: 'google_adwords_enhanced_conversion',

            },
            headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': '0987654321',
            },
            method: 'POST',
        },
        httpRes: {
            data: [{
                results: [{
                    conversionAction: {
                        id: 123434342
                    }
                }]
            }],
            status: 400,
        },
    },
    {
        httpReq: {
            url: 'https://googleads.googleapis.com/v14/customers/1234567891:uploadClickConversions',
            data: {
                conversionAdjustments: [{
                    adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                    adjustmentType: 'ENHANCEMENT',
                    conversionAction: 'customers/1234567891/conversionActions/123434342',
                    gclidDateTimePair: {
                        conversionDateTime: '2022-01-01 12:32:45-08:00',
                        gclid: 'gclid1234'
                    },
                    order_id: '10000',
                    restatementValue: { adjustedValue: 10, currency: 'INR' },
                    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                    userIdentifiers: [{
                        addressInfo: {
                            hashedFirstName: 'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da',
                            hashedLastName: '1c574b17eefa532b6d61c963550a82d2d3dfca4a7fb69e183374cfafd5328ee4',
                            state: 'UK',
                            city: 'London',
                            hashedStreetAddress: '9a4d2e50828448f137f119a3ebdbbbab8d6731234a67595fdbfeb2a2315dd550'
                        }
                    }]
                }],
                partialFailure: true
            },
            params: {
                destination: 'google_adwords_enhanced_conversion',

            },
            headers: {
                Authorization: 'Bearer abcd1234',
                'Content-Type': 'application/json',
                'developer-token': 'ijkl91011',
                'login-customer-id': '0987654321',
            },
            method: 'POST',
        },
        httpRes: {
            data: [{
                results: [{
                    conversionAction: {
                        id: 123434342
                    }
                }]
            }],
            status: 400,
        },
    }
];



