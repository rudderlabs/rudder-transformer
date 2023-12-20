export const networkCallsData = [
    {
        httpReq: {
            url: 'https://api.aptrinsic.com/v1/users/sample-user-id',
            method: 'GET',
        },
        httpRes: {
            data: {
                "aptrinsicId": "347c4c87-98c7-4ca6-a6da-678ed6924c22",
                "identifyId": "sample-user-id",
                "type": "USER",
                "gender": "MALE",
                "email": "user@email.com",
                "firstName": "Sample",
                "lastName": "User",
                "lastSeenDate": 0,
                "signUpDate": 1624431528295,
                "firstVisitDate": 0,
                "title": "engineer",
                "phone": "",
                "score": 0,
                "role": "",
                "subscriptionId": "",
                "accountId": "",
                "numberOfVisits": 1,
                "location": {
                    "countryName": "USA",
                    "countryCode": "US",
                    "stateName": "",
                    "stateCode": "",
                    "city": "New York",
                    "street": "",
                    "postalCode": "",
                    "continent": "",
                    "regionName": "",
                    "timeZone": "",
                    "coordinates": {
                        "latitude": 0.0,
                        "longitude": 0.0
                    }
                },
                "propertyKeys": ["AP-XABC-123"],
                "createDate": 1624431528295,
                "lastModifiedDate": 1624431528295,
                "customAttributes": null,
                "globalUnsubscribe": false,
                "sfdcContactId": "",
                "lastVisitedUserAgentData": null,
                "id": "sample-user-id",
                "lastInferredLocation": {
                    "countryName": "",
                    "countryCode": "",
                    "stateName": "",
                    "stateCode": "",
                    "city": "",
                    "street": "",
                    "postalCode": "",
                    "continent": "",
                    "regionName": "",
                    "timeZone": "",
                    "coordinates": {
                        "latitude": 0.0,
                        "longitude": 0.0
                    }
                }
            },
            status: 200
        },
    },
    {
        httpReq: {
            url: 'https://api.aptrinsic.com/v1/accounts/ecorp-id',
            method: 'GET',
        },
        httpRes: {
            data: {
                "id": "ecorp-id",
                "name": "ECorp",
                "trackedSubscriptionId": "",
                "sfdcId": "",
                "lastSeenDate": 0,
                "dunsNumber": "",
                "industry": "software",
                "numberOfEmployees": 400,
                "sicCode": "",
                "website": "www.ecorp.com",
                "naicsCode": "",
                "plan": "premium",
                "location": {
                    "countryName": "",
                    "countryCode": "",
                    "stateName": "",
                    "stateCode": "",
                    "city": "",
                    "street": "",
                    "postalCode": "",
                    "continent": "",
                    "regionName": "",
                    "timeZone": "",
                    "coordinates": {
                        "latitude": 0.0,
                        "longitude": 0.0
                    }
                },
                "numberOfUsers": 0,
                "propertyKeys": ["AP-XABC-123"],
                "createDate": 1624261864923,
                "lastModifiedDate": 1624261864923,
                "customAttributes": null,
                "parentGroupId": ""
            },
            status: 200
        },
    },
    {
        httpReq: {
            url: 'https://api.aptrinsic.com/v1/accounts/ecorp-id',
            method: 'PUT',
        },
        httpRes: {
            data: {
                "id": "ecorp-id",
                "name": "ECorp",
                "trackedSubscriptionId": "",
                "sfdcId": "",
                "lastSeenDate": 0,
                "dunsNumber": "",
                "industry": "software",
                "numberOfEmployees": 400,
                "sicCode": "",
                "website": "www.ecorp.com",
                "naicsCode": "",
                "plan": "premium",
                "location": {
                    "countryName": "",
                    "countryCode": "",
                    "stateName": "",
                    "stateCode": "",
                    "city": "",
                    "street": "",
                    "postalCode": "",
                    "continent": "",
                    "regionName": "",
                    "timeZone": "",
                    "coordinates": {
                        "latitude": 0.0,
                        "longitude": 0.0
                    }
                },
                "numberOfUsers": 0,
                "propertyKeys": ["AP-XABC-123"],
                "createDate": 1624261864923,
                "lastModifiedDate": 1624261864923,
                "customAttributes": null,
                "parentGroupId": ""
            },
            status: 204
        },
    },
    {
        httpReq: {
            url: 'https://api.aptrinsic.com/v1/users/absent-id',
            method: 'GET',
        },
        httpRes: {
            data: {
                externalapierror: {
                    status: "NOT_FOUND",
                    message: "User was not found for parameters {id=absent-id}",
                    debugMessage: null,
                    subErrors: null
                }
            },
            status: 404
        },
    },
    {
        httpReq: {
            url: 'https://api.aptrinsic.com/v1/users/stanley-kubrick',
            method: 'GET',
        },
        httpRes: {
            data: {
                "id": "ecorp-id",
                "name": "ECorp",
                "trackedSubscriptionId": "",
                "sfdcId": "",
                "lastSeenDate": 0,
                "dunsNumber": "",
                "industry": "software",
                "numberOfEmployees": 400,
                "sicCode": "",
                "website": "www.ecorp.com",
                "naicsCode": "",
                "plan": "premium",
                "location": {
                    "countryName": "",
                    "countryCode": "",
                    "stateName": "",
                    "stateCode": "",
                    "city": "",
                    "street": "",
                    "postalCode": "",
                    "continent": "",
                    "regionName": "",
                    "timeZone": "",
                    "coordinates": {
                        "latitude": 0.0,
                        "longitude": 0.0
                    }
                },
                "numberOfUsers": 0,
                "propertyKeys": ["AP-XABC-123"],
                "createDate": 1624261864923,
                "lastModifiedDate": 1624261864923,
                "customAttributes": null,
                "parentGroupId": ""
            },
            status: 200
        },
    }
];
