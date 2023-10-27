export const networkCallsData = [
    {
        httpReq: {
            version: '1',
            type: 'REST',
            method: 'DELETE',
            endpoint: 'https://graph.facebook.com/v17.0/aud1/users',
            headers: {
                'test-dest-response-key': 'successResponse'
            },
            params: {
                access_token: 'ABC',
                payload: {
                    is_raw: true,
                    data_source: {
                        sub_type: 'ANYTHING',
                    },
                    schema: [
                        'EMAIL',
                        'DOBM',
                        'DOBD',
                        'DOBY',
                        'PHONE',
                        'GEN',
                        'FI',
                        'MADID',
                        'ZIP',
                        'ST',
                        'COUNTRY',
                    ],
                    data: [
                        [
                            'shrouti@abc.com',
                            '2',
                            '13',
                            '2013',
                            '@09432457768',
                            'f',
                            'Ms.',
                            'ABC',
                            'ZIP ',
                            '123abc ',
                            'IN',
                        ],
                    ],
                },
            },
            userId: '',
            body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
            },
            files: {},
        },
        httpRes: {
            "data": {
                "audience_id": "aud1",
                "session_id": "123",
                "num_received": 4,
                "num_invalid_entries": 0,
                "invalid_entry_samples": {}
            },
            "status": 200
        }
    },
    {
        httpReq: {
            version: '1',
            type: 'REST',
            method: 'POST',
            endpoint: 'https://graph.facebook.com/v17.0/aud1/users',
            headers: {
                'test-dest-response-key': 'permissionMissingError'
            },
            params: {
                access_token: 'BCD',
                payload: {
                    is_raw: true,
                    data_source: {
                        sub_type: 'ANYTHING',
                    },
                    schema: [
                        'DOBM',
                        'DOBD',
                        'DOBY',
                        'PHONE',
                        'GEN',
                        'FI',
                        'MADID',
                        'ZIP',
                        'ST',
                        'COUNTRY',
                    ],
                    data: [
                        [
                            '2',
                            '13',
                            '2013',
                            '@09432457768',
                            'f',
                            'Ms.',
                            'ABC',
                            'ZIP ',
                            '123abc ',
                            'IN',
                        ],
                    ],
                },
            },
            userId: '',
            body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
            },
            files: {},
        },
        httpRes: {
            "data": {
                "code": 294,
                "message": "Missing permission. Please make sure you have ads_management permission and the application is included in the allowlist"
            },
            "status": 200
        }
    },
    {
        httpReq: {
            version: '1',
            type: 'REST',
            method: 'DELETE',
            endpoint: 'https://graph.facebook.com/v17.0/aud1/users',
            headers: {
                'test-dest-response-key': 'permissionMissingError'
            },
            params: {
                access_token: 'ABC',
                payload: {
                    is_raw: true,
                    data_source: {
                        sub_type: 'ANYTHING',
                    },
                    schema: [
                        'EMAIL',
                        'DOBM',
                        'DOBD',
                        'DOBY',
                        'PHONE',
                        'GEN',
                        'FI',
                        'MADID',
                        'ZIP',
                        'ST',
                        'COUNTRY',
                    ],
                    data: [
                        [
                            'shrouti@abc.com',
                            '2',
                            '13',
                            '2013',
                            '@09432457768',
                            'f',
                            'Ms.',
                            'ABC',
                            'ZIP ',
                            '123abc ',
                            'IN',
                        ],
                    ],
                },
            },
            userId: '',
            body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
            },
            files: {},
        },
        httpRes: {
            "data": {
                "code": 1487301,
                "message": "Custom Audience Unavailable: The custom audience you are trying to use has not been shared with your ad account"
            },
            "status": 200
        }
    },
    {
        httpReq: {
            version: '1',
            type: 'REST',
            method: 'DELETE',
            endpoint: 'https://graph.facebook.com/v17.0/aud1/users',
            headers: {
                'test-dest-response-key': 'permissionMissingError'
            },
            params: {
                access_token: 'ABC',
                payload: {
                    is_raw: true,
                    data_source: {
                        sub_type: 'ANYTHING',
                    },
                    schema: [
                        'EMAIL',
                        'DOBM',
                        'DOBD',
                        'DOBY',
                        'PHONE',
                        'GEN',
                        'FI',
                        'MADID',
                        'ZIP',
                        'ST',
                        'COUNTRY',
                    ],
                    data: [
                        [
                            'shrouti@abc.com',
                            '2',
                            '13',
                            '2013',
                            '@09432457768',
                            'f',
                            'Ms.',
                            'ABC',
                            'ZIP ',
                            '123abc ',
                            'IN',
                        ],
                    ],
                },
            },
            userId: '',
            body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
            },
            files: {},
        },
        httpRes: {
            "data": {
                "code": 1487366,
                "message": "Custom Audience Has Been Deleted"
            },
            "status": 200
        }
    },
    {
        httpReq: {
            version: '1',
            type: 'REST',
            method: 'DELETE',
            endpoint: 'https://graph.facebook.com/v17.0/aud1/users',
            headers: {
                'test-dest-response-key': 'permissionMissingError'
            },
            params: {
                access_token: 'ABC',
                payload: {
                    is_raw: true,
                    data_source: {
                        sub_type: 'ANYTHING',
                    },
                    schema: [
                        'EMAIL',
                        'DOBM',
                        'DOBD',
                        'DOBY',
                        'PHONE',
                        'GEN',
                        'FI',
                        'MADID',
                        'ZIP',
                        'ST',
                        'COUNTRY',
                    ],
                    data: [
                        [
                            'shrouti@abc.com',
                            '2',
                            '13',
                            '2013',
                            '@09432457768',
                            'f',
                            'Ms.',
                            'ABC',
                            'ZIP ',
                            '123abc ',
                            'IN',
                        ],
                    ],
                },
            },
            userId: '',
            body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
            },
            files: {},
        },
        httpRes: {
            "data": {
                "code": 2650,
                "message": "Failed to update the custom audience"
            },
            "status": 200
        }
    },
    {
        httpReq: {
            version: '1',
            type: 'REST',
            method: 'DELETE',
            endpoint: 'https://graph.facebook.com/v17.0/aud1/users',
            headers: {
                'test-dest-response-key': 'permissionMissingError'
            },
            params: {
                access_token: 'ABC',
                payload: {
                    is_raw: true,
                    data_source: {
                        sub_type: 'ANYTHING',
                    },
                    schema: [
                        'EMAIL',
                        'DOBM',
                        'DOBD',
                        'DOBY',
                        'PHONE',
                        'GEN',
                        'FI',
                        'MADID',
                        'ZIP',
                        'ST',
                        'COUNTRY',
                    ],
                    data: [
                        [
                            'shrouti@abc.com',
                            '2',
                            '13',
                            '2013',
                            '@09432457768',
                            'f',
                            'Ms.',
                            'ABC',
                            'ZIP ',
                            '123abc ',
                            'IN',
                        ],
                    ],
                },
            },
            userId: '',
            body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
            },
            files: {},
        },
        httpRes: {
            "data": {
                "code": 105,
                "message": "The number of parameters exceeded the maximum for this operation"
            },
            "status": 200
        }
    },
    {
        httpReq: {
            version: '1',
            type: 'REST',
            method: 'DELETE',
            endpoint: 'https://graph.facebook.com/v17.0/aud1/users',
            headers: {
                'test-dest-response-key': 'permissionMissingError'
            },
            params: {
                access_token: 'ABC',
                payload: {
                    is_raw: true,
                    data_source: {
                        sub_type: 'ANYTHING',
                    },
                    schema: [
                        'EMAIL',
                        'DOBM',
                        'DOBD',
                        'DOBY',
                        'PHONE',
                        'GEN',
                        'FI',
                        'MADID',
                        'ZIP',
                        'ST',
                        'COUNTRY',
                    ],
                    data: [
                        [
                            'shrouti@abc.com',
                            '2',
                            '13',
                            '2013',
                            '@09432457768',
                            'f',
                            'Ms.',
                            'ABC',
                            'ZIP ',
                            '123abc ',
                            'IN',
                        ],
                    ],
                },
            },
            userId: '',
            body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {},
            },
            files: {},
        },
        httpRes: {
            "data": {
                "code": 80003,
                "message": "There have been too many calls to this ad-account."
            },
            "status": 200
        }
    }
];