module.exports = {
    input: {
        destination: {
            Config: {}
        },
        message: {
            anonymousId: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            channel: "web",
            traits: {
                city: "Disney",
                country: "USA",
                email: "mickey@disney.com",
                firstname: "Mickey",
                testMap: {
                    nestedMap: {
                        n1: "nested prop 1"
                    }
                },
            },
            context: {
                app: {
                    build: "1.0.0",
                    name: "RudderLabs JavaScript SDK",
                    namespace: "com.rudderlabs.javascript",
                    version: "1.0.5"
                },
                ip: "0.0.0.0",
                library: {
                    name: "RudderLabs JavaScript SDK",
                    version: "1.0.5"
                },
                ctestMap: {
                    cnestedMap: {
                        n1: "context nested prop 1"
                    }
                },
                locale: "en-GB",
                screen: {
                    density: 2
                },
                userAgent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36"
            },
            integrations: {
                All: true,
                RS: {
                    options: {
                        jsonPaths: ["alias.traits.testMap.nestedMap", "alias.context.ctestMap.cnestedMap"]
                    }
                },
                BQ: {
                    options: {
                        jsonPaths: ["alias.traits.testMap.nestedMap", "alias.context.ctestMap.cnestedMap"]
                    }
                },
                POSTGRES: {
                    options: {
                        jsonPaths: ["alias.traits.testMap.nestedMap", "alias.context.ctestMap.cnestedMap"]
                    }
                },
                SNOWFLAKE: {
                    options: {
                        jsonPaths: ["alias.traits.testMap.nestedMap", "alias.context.ctestMap.cnestedMap"]
                    }
                },
                S3_DATALAKE: {
                    options: {
                        skipReservedKeywordsEscaping: true
                    }
                },
            },
            messageId: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            originalTimestamp: "2020-01-24T06:29:02.364Z",
            receivedAt: "2020-01-24T11:59:02.403+05:30",
            request_ip: "[::1]:53708",
            sentAt: "2020-01-24T06:29:02.364Z",
            timestamp: "2020-01-24T11:59:02.403+05:30",
            type: "alias",
            userId: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33"
        },
        request: {
            query: {
                whSchemaVersion: "v1"
            }
        }
    },
    output: {
        default: [
            {
                "data": {
                    "anonymous_id": "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
                    "channel": "web",
                    "city": "Disney",
                    "context_app_build": "1.0.0",
                    "context_app_name": "RudderLabs JavaScript SDK",
                    "context_app_namespace": "com.rudderlabs.javascript",
                    "context_app_version": "1.0.5",
                    "context_ctest_map_cnested_map_n_1": "context nested prop 1",
                    "context_ip": "0.0.0.0",
                    "context_library_name": "RudderLabs JavaScript SDK",
                    "context_library_version": "1.0.5",
                    "context_locale": "en-GB",
                    "context_passed_ip": "0.0.0.0",
                    "context_request_ip": "[::1]:53708",
                    "context_screen_density": 2,
                    "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
                    "country": "USA",
                    "email": "mickey@disney.com",
                    "firstname": "Mickey",
                    "id": "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
                    "original_timestamp": "2020-01-24T06:29:02.364Z",
                    "received_at": "2020-01-24T06:29:02.403Z",
                    "sent_at": "2020-01-24T06:29:02.364Z",
                    "test_map_nested_map_n_1": "nested prop 1",
                    "timestamp": "2020-01-24T06:29:02.403Z",
                    "user_id": "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33"
                },
                "metadata": {
                    "columns": {
                        "anonymous_id": "string",
                        "channel": "string",
                        "city": "string",
                        "context_app_build": "string",
                        "context_app_name": "string",
                        "context_app_namespace": "string",
                        "context_app_version": "string",
                        "context_ctest_map_cnested_map_n_1": "string",
                        "context_ip": "string",
                        "context_library_name": "string",
                        "context_library_version": "string",
                        "context_locale": "string",
                        "context_passed_ip": "string",
                        "context_request_ip": "string",
                        "context_screen_density": "int",
                        "context_user_agent": "string",
                        "country": "string",
                        "email": "string",
                        "firstname": "string",
                        "id": "string",
                        "original_timestamp": "datetime",
                        "received_at": "datetime",
                        "sent_at": "datetime",
                        "test_map_nested_map_n_1": "string",
                        "timestamp": "datetime",
                        "user_id": "string",
                        "uuid_ts": "datetime"
                    },
                    "receivedAt": "2020-01-24T11:59:02.403+05:30",
                    "table": "aliases"
                }
            }
        ],
        rs: [
            {
                "data": {
                    "anonymous_id": "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
                    "channel": "web",
                    "city": "Disney",
                    "context_app_build": "1.0.0",
                    "context_app_name": "RudderLabs JavaScript SDK",
                    "context_app_namespace": "com.rudderlabs.javascript",
                    "context_app_version": "1.0.5",
                    "context_ctest_map_cnested_map": "{\"n1\":\"context nested prop 1\"}",
                    "context_ip": "0.0.0.0",
                    "context_library_name": "RudderLabs JavaScript SDK",
                    "context_library_version": "1.0.5",
                    "context_locale": "en-GB",
                    "context_passed_ip": "0.0.0.0",
                    "context_request_ip": "[::1]:53708",
                    "context_screen_density": 2,
                    "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
                    "country": "USA",
                    "email": "mickey@disney.com",
                    "firstname": "Mickey",
                    "id": "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
                    "original_timestamp": "2020-01-24T06:29:02.364Z",
                    "received_at": "2020-01-24T06:29:02.403Z",
                    "sent_at": "2020-01-24T06:29:02.364Z",
                    "test_map_nested_map": "{\"n1\":\"nested prop 1\"}",
                    "timestamp": "2020-01-24T06:29:02.403Z",
                    "user_id": "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33"
                },
                "metadata": {
                    "columns": {
                        "anonymous_id": "string",
                        "channel": "string",
                        "city": "string",
                        "context_app_build": "string",
                        "context_app_name": "string",
                        "context_app_namespace": "string",
                        "context_app_version": "string",
                        "context_ctest_map_cnested_map": "json",
                        "context_ip": "string",
                        "context_library_name": "string",
                        "context_library_version": "string",
                        "context_locale": "string",
                        "context_passed_ip": "string",
                        "context_request_ip": "string",
                        "context_screen_density": "int",
                        "context_user_agent": "string",
                        "country": "string",
                        "email": "string",
                        "firstname": "string",
                        "id": "string",
                        "original_timestamp": "datetime",
                        "received_at": "datetime",
                        "sent_at": "datetime",
                        "test_map_nested_map": "json",
                        "timestamp": "datetime",
                        "user_id": "string",
                        "uuid_ts": "datetime"
                    },
                    "receivedAt": "2020-01-24T11:59:02.403+05:30",
                    "table": "aliases"
                }
            }
        ],
        bq: [
            {
                "data": {
                    "anonymous_id": "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
                    "channel": "web",
                    "city": "Disney",
                    "context_app_build": "1.0.0",
                    "context_app_name": "RudderLabs JavaScript SDK",
                    "context_app_namespace": "com.rudderlabs.javascript",
                    "context_app_version": "1.0.5",
                    "context_ctest_map_cnested_map": "{\"n1\":\"context nested prop 1\"}",
                    "context_ip": "0.0.0.0",
                    "context_library_name": "RudderLabs JavaScript SDK",
                    "context_library_version": "1.0.5",
                    "context_locale": "en-GB",
                    "context_passed_ip": "0.0.0.0",
                    "context_request_ip": "[::1]:53708",
                    "context_screen_density": 2,
                    "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
                    "country": "USA",
                    "email": "mickey@disney.com",
                    "firstname": "Mickey",
                    "id": "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
                    "original_timestamp": "2020-01-24T06:29:02.364Z",
                    "received_at": "2020-01-24T06:29:02.403Z",
                    "sent_at": "2020-01-24T06:29:02.364Z",
                    "test_map_nested_map": "{\"n1\":\"nested prop 1\"}",
                    "timestamp": "2020-01-24T06:29:02.403Z",
                    "user_id": "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33"
                },
                "metadata": {
                    "columns": {
                        "anonymous_id": "string",
                        "channel": "string",
                        "city": "string",
                        "context_app_build": "string",
                        "context_app_name": "string",
                        "context_app_namespace": "string",
                        "context_app_version": "string",
                        "context_ctest_map_cnested_map": "string",
                        "context_ip": "string",
                        "context_library_name": "string",
                        "context_library_version": "string",
                        "context_locale": "string",
                        "context_passed_ip": "string",
                        "context_request_ip": "string",
                        "context_screen_density": "int",
                        "context_user_agent": "string",
                        "country": "string",
                        "email": "string",
                        "firstname": "string",
                        "id": "string",
                        "loaded_at": "datetime",
                        "original_timestamp": "datetime",
                        "received_at": "datetime",
                        "sent_at": "datetime",
                        "test_map_nested_map": "string",
                        "timestamp": "datetime",
                        "user_id": "string",
                        "uuid_ts": "datetime"
                    },
                    "receivedAt": "2020-01-24T11:59:02.403+05:30",
                    "table": "aliases"
                }
            }
        ],
        postgres: [
            {
                "data": {
                    "anonymous_id": "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
                    "channel": "web",
                    "city": "Disney",
                    "context_app_build": "1.0.0",
                    "context_app_name": "RudderLabs JavaScript SDK",
                    "context_app_namespace": "com.rudderlabs.javascript",
                    "context_app_version": "1.0.5",
                    "context_ctest_map_cnested_map": "{\"n1\":\"context nested prop 1\"}",
                    "context_ip": "0.0.0.0",
                    "context_library_name": "RudderLabs JavaScript SDK",
                    "context_library_version": "1.0.5",
                    "context_locale": "en-GB",
                    "context_passed_ip": "0.0.0.0",
                    "context_request_ip": "[::1]:53708",
                    "context_screen_density": 2,
                    "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
                    "country": "USA",
                    "email": "mickey@disney.com",
                    "firstname": "Mickey",
                    "id": "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
                    "original_timestamp": "2020-01-24T06:29:02.364Z",
                    "received_at": "2020-01-24T06:29:02.403Z",
                    "sent_at": "2020-01-24T06:29:02.364Z",
                    "test_map_nested_map": "{\"n1\":\"nested prop 1\"}",
                    "timestamp": "2020-01-24T06:29:02.403Z",
                    "user_id": "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33"
                },
                "metadata": {
                    "columns": {
                        "anonymous_id": "string",
                        "channel": "string",
                        "city": "string",
                        "context_app_build": "string",
                        "context_app_name": "string",
                        "context_app_namespace": "string",
                        "context_app_version": "string",
                        "context_ctest_map_cnested_map": "json",
                        "context_ip": "string",
                        "context_library_name": "string",
                        "context_library_version": "string",
                        "context_locale": "string",
                        "context_passed_ip": "string",
                        "context_request_ip": "string",
                        "context_screen_density": "int",
                        "context_user_agent": "string",
                        "country": "string",
                        "email": "string",
                        "firstname": "string",
                        "id": "string",
                        "original_timestamp": "datetime",
                        "received_at": "datetime",
                        "sent_at": "datetime",
                        "test_map_nested_map": "json",
                        "timestamp": "datetime",
                        "user_id": "string",
                        "uuid_ts": "datetime"
                    },
                    "receivedAt": "2020-01-24T11:59:02.403+05:30",
                    "table": "aliases"
                }
            }
        ],
        snowflake: [
            {
                "data": {
                    "ANONYMOUS_ID": "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
                    "CHANNEL": "web",
                    "CITY": "Disney",
                    "CONTEXT_APP_BUILD": "1.0.0",
                    "CONTEXT_APP_NAME": "RudderLabs JavaScript SDK",
                    "CONTEXT_APP_NAMESPACE": "com.rudderlabs.javascript",
                    "CONTEXT_APP_VERSION": "1.0.5",
                    "CONTEXT_CTEST_MAP_CNESTED_MAP": "{\"n1\":\"context nested prop 1\"}",
                    "CONTEXT_IP": "0.0.0.0",
                    "CONTEXT_LIBRARY_NAME": "RudderLabs JavaScript SDK",
                    "CONTEXT_LIBRARY_VERSION": "1.0.5",
                    "CONTEXT_LOCALE": "en-GB",
                    "CONTEXT_PASSED_IP": "0.0.0.0",
                    "CONTEXT_REQUEST_IP": "[::1]:53708",
                    "CONTEXT_SCREEN_DENSITY": 2,
                    "CONTEXT_USER_AGENT": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
                    "COUNTRY": "USA",
                    "EMAIL": "mickey@disney.com",
                    "FIRSTNAME": "Mickey",
                    "ID": "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
                    "ORIGINAL_TIMESTAMP": "2020-01-24T06:29:02.364Z",
                    "RECEIVED_AT": "2020-01-24T06:29:02.403Z",
                    "SENT_AT": "2020-01-24T06:29:02.364Z",
                    "TEST_MAP_NESTED_MAP": "{\"n1\":\"nested prop 1\"}",
                    "TIMESTAMP": "2020-01-24T06:29:02.403Z",
                    "USER_ID": "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33"
                },
                "metadata": {
                    "columns": {
                        "ANONYMOUS_ID": "string",
                        "CHANNEL": "string",
                        "CITY": "string",
                        "CONTEXT_APP_BUILD": "string",
                        "CONTEXT_APP_NAME": "string",
                        "CONTEXT_APP_NAMESPACE": "string",
                        "CONTEXT_APP_VERSION": "string",
                        "CONTEXT_CTEST_MAP_CNESTED_MAP": "json",
                        "CONTEXT_IP": "string",
                        "CONTEXT_LIBRARY_NAME": "string",
                        "CONTEXT_LIBRARY_VERSION": "string",
                        "CONTEXT_LOCALE": "string",
                        "CONTEXT_PASSED_IP": "string",
                        "CONTEXT_REQUEST_IP": "string",
                        "CONTEXT_SCREEN_DENSITY": "int",
                        "CONTEXT_USER_AGENT": "string",
                        "COUNTRY": "string",
                        "EMAIL": "string",
                        "FIRSTNAME": "string",
                        "ID": "string",
                        "ORIGINAL_TIMESTAMP": "datetime",
                        "RECEIVED_AT": "datetime",
                        "SENT_AT": "datetime",
                        "TEST_MAP_NESTED_MAP": "json",
                        "TIMESTAMP": "datetime",
                        "USER_ID": "string",
                        "UUID_TS": "datetime"
                    },
                    "receivedAt": "2020-01-24T11:59:02.403+05:30",
                    "table": "ALIASES"
                }
            }
        ],
    }
}
