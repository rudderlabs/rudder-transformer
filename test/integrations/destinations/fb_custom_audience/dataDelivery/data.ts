export const data = [
    {
        name: 'fb_custom_audience',
        description: 'Type NA ',
        feature: 'dataDelivery',
        module: 'destination',
        version: 'v0',
        input: {
            request: {
                body: {
                    version: '1',
                    type: 'REST',
                    method: 'DELETE',
                    endpoint: 'https://graph.facebook.com/v17.0/aud1/users',
                    headers: {
                        "test-dest-response-key": "successResponse"
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
                }
            },
        },
        output: {
            response: {
                status: 200,
                body: {
                    output: {
                        status: 200,
                        message: 'Request Processed Successfully',
                        destinationResponse: {
                            audience_id: 'aud1',
                            invalid_entry_samples: {},
                            num_invalid_entries: 0,
                            num_received: 4,
                            session_id: '123'
                        }
                    }
                }
            },
        },
    },
    {
        name: 'fb_custom_audience',
        description: 'permissionMissingError',
        feature: 'dataDelivery',
        module: 'destination',
        version: 'v0',
        input: {
            request: {
                body: {
                    version: '1',
                    type: 'REST',
                    method: 'DELETE',
                    endpoint: 'https://graph.facebook.com/v17.0/aud1/users',
                    headers: {
                        "test-dest-response-key": "permissionMissingError"
                    },
                    params: {
                        access_token: 'BCD',
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
                    body: {
                        JSON: {},
                        XML: {},
                        JSON_ARRAY: {},
                        FORM: {},
                    },
                    files: {},
                }
            },
        },
        output: {
            response: {
              status: 200,
              body: {
                output: {
                  status: 400,
                  message: 'Request failed with status: 294',
                  destinationResponse: {
                    response: {
                      code: 294,
                      message: "Missing permission. Please make sure you have ads_management permission and the application is included in the allowlist",
                    },
                    status: 200,
                  },
               
                },
              },
            },
          },
    }
]