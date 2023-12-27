export const networkCallsData = [
    {
        httpReq: {
            url: 'https://demo-domain.gainsightcloud.com/v1/data/objects/query/Company',
            method: 'POST',
        },
        httpRes: {
            data: {
                "result": true,
                "errorCode": null,
                "errorDesc": null,
                "requestId": "47d9c8be-4912-4610-806c-0eec22b73236",
                "data": {
                    "records": []
                },
                "message": null
            },
            status: 200
        },
    },
    {
        httpReq: {
            url: 'https://demo-domain.gainsightcloud.com/v1/data/objects/Company',
            method: 'POST',
        },
        httpRes: {
            data: {
                "result": true,
                "errorCode": null,
                "errorDesc": null,
                "requestId": "3ce46d4a-6a83-4a92-97b3-d9788a296af8",
                "data": {
                    "count": 1,
                    "errors": null,
                    "records": [
                        {
                            "Gsid": "1P0203VCESP7AUQMV9E953G"
                        }
                    ]
                },
                "message": null
            },
            status: 200
        },
    },
    {
        httpReq: {
            url: "https://demo-domain.gainsightcloud.com/v1/data/objects/Company?keys=Name",
            method: 'GET',
        },
        httpRes: {
            data: {
                "result": true,
                "errorCode": null,
                "errorDesc": null,
                "requestId": "30630809-40a7-45d2-9673-ac2e80d06f33",
                "data": {
                    "count": 1,
                    "errors": null,
                    "records": [
                        {
                            "Gsid": "1P0203VCESP7AUQMV9E953G"
                        }
                    ]
                },
                "message": null
            },
            status: 200
        },
    }
];
