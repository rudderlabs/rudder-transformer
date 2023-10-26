export const data = [
    {
        name: 'gcs_datalake',
        description: 'No Message type',
        feature: 'processor',
        module: 'destination',
        version: 'v0',
        input: {
            request: {
                body: [
                    {
                        "message": {
                            "receivedAt": "2023-09-29T15:07:16.650Z",
                            "channel": "web",
                            "context": {
                                "app": {
                                    "build": "1.0.0",
                                    "name": "RudderLabs JavaScript SDK",
                                    "namespace": "com.rudderlabs.javascript",
                                    "version": "1.0.0"
                                },
                                "traits": {
                                    "email": "test@rudderstack.com"
                                },
                                "library": {
                                    "name": "RudderLabs JavaScript SDK",
                                    "version": "1.0.0"
                                },
                                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                "locale": "en-US",
                                "os": {
                                    "name": "",
                                    "version": ""
                                },
                                "screen": {
                                    "density": 2
                                }
                            },
                            "type": "track",
                            "messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
                            "originalTimestamp": "2019-10-14T11:15:18.300Z",
                            "anonymousId": "00000000000000000000000000",
                            "userId": "12345",
                            "event": "Product List Clicked",
                            "properties": {
                                "list_id": "Sample Product List",
                                "category": "Sample Product List",
                                "products": []
                            },
                            "integrations": {
                                "All": true
                            },
                            "sentAt": "2019-10-14T11:15:53.296Z"
                        },
                        "destination": {
                            "Config": {
                                "bucketName": "ps-data-mdm-prod-rudderstack",
                                "prefix": "",
                                "namespace": "",
                                "credentials": "randomcreds",
                                "syncFrequency": "30",
                                "tableSuffix": "",
                                "timeWindowLayout": "2006/01/02/15"
                            },
                            "Enabled": true
                        }
                    },
                ],
                method: 'POST',
            },
            pathSuffix: '',
        },
        output: {
            response: {
                status: 200,
                body: [
                    {
                        "output": {
                            "metadata": {
                                "table": "tracks",
                                "columns": {
                                    "uuid_ts": "datetime",
                                    "context_app_build": "string",
                                    "context_app_name": "string",
                                    "context_app_namespace": "string",
                                    "context_app_version": "string",
                                    "context_traits_email": "string",
                                    "context_library_name": "string",
                                    "context_library_version": "string",
                                    "context_user_agent": "string",
                                    "context_locale": "string",
                                    "context_screen_density": "int",
                                    "event_text": "string",
                                    "id": "string",
                                    "anonymous_id": "string",
                                    "user_id": "string",
                                    "sent_at": "datetime",
                                    "received_at": "datetime",
                                    "original_timestamp": "datetime",
                                    "channel": "string",
                                    "event": "string"
                                },
                                "receivedAt": "2023-09-29T15:07:16.650Z"
                            },
                            "data": {
                                "context_app_build": "1.0.0",
                                "context_app_name": "RudderLabs JavaScript SDK",
                                "context_app_namespace": "com.rudderlabs.javascript",
                                "context_app_version": "1.0.0",
                                "context_traits_email": "test@rudderstack.com",
                                "context_library_name": "RudderLabs JavaScript SDK",
                                "context_library_version": "1.0.0",
                                "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                "context_locale": "en-US",
                                "context_screen_density": 2,
                                "event_text": "Product List Clicked",
                                "id": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
                                "anonymous_id": "00000000000000000000000000",
                                "user_id": "12345",
                                "sent_at": "2019-10-14T11:15:53.296Z",
                                "received_at": "2023-09-29T15:07:16.650Z",
                                "original_timestamp": "2019-10-14T11:15:18.300Z",
                                "channel": "web",
                                "event": "product_list_clicked"
                            },
                            "userId": ""
                        },
                        "statusCode": 200
                    },
                    {
                        "output": {
                            "metadata": {
                                "table": "product_list_clicked",
                                "columns": {
                                    "uuid_ts": "datetime",
                                    "list_id": "string",
                                    "category": "string",
                                    "context_app_build": "string",
                                    "context_app_name": "string",
                                    "context_app_namespace": "string",
                                    "context_app_version": "string",
                                    "context_traits_email": "string",
                                    "context_library_name": "string",
                                    "context_library_version": "string",
                                    "context_user_agent": "string",
                                    "context_locale": "string",
                                    "context_screen_density": "int",
                                    "event_text": "string",
                                    "id": "string",
                                    "anonymous_id": "string",
                                    "user_id": "string",
                                    "sent_at": "datetime",
                                    "received_at": "datetime",
                                    "original_timestamp": "datetime",
                                    "channel": "string",
                                    "event": "string"
                                },
                                "receivedAt": "2023-09-29T15:07:16.650Z"
                            },
                            "data": {
                                "list_id": "Sample Product List",
                                "category": "Sample Product List",
                                "context_app_build": "1.0.0",
                                "context_app_name": "RudderLabs JavaScript SDK",
                                "context_app_namespace": "com.rudderlabs.javascript",
                                "context_app_version": "1.0.0",
                                "context_traits_email": "test@rudderstack.com",
                                "context_library_name": "RudderLabs JavaScript SDK",
                                "context_library_version": "1.0.0",
                                "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                "context_locale": "en-US",
                                "context_screen_density": 2,
                                "event_text": "Product List Clicked",
                                "id": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
                                "anonymous_id": "00000000000000000000000000",
                                "user_id": "12345",
                                "sent_at": "2019-10-14T11:15:53.296Z",
                                "received_at": "2023-09-29T15:07:16.650Z",
                                "original_timestamp": "2019-10-14T11:15:18.300Z",
                                "channel": "web",
                                "event": "product_list_clicked"
                            },
                            "userId": ""
                        },
                        "statusCode": 200
                    }
                ],
            },
        },
    }
];
