module.exports = {
    input: {
        destination: {
            Config: {}
        },
        message: {
            anonymousId: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            channel: "web",
            context: {
                sources: {
                    job_id: "djfhksdjhfkjdhfkjahkf",
                    version: "1169/merge",
                    job_run_id: "job_run_id",
                    task_run_id: "task_run_id"
                },
                CMap: {
                    nestedMap: {
                        n1: "context nested prop 1"
                    }
                },
                userAgent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36"
            },
            event: "Product Added",
            integrations: {
                All: true,
                RS: {
                    options: {
                        jsonPaths: [
                            "extract.properties.PMap.nestedMap",
                            "extract.context.CMap.nestedMap",
                        ]
                    }
                },
                BQ: {
                    options: {
                        jsonPaths: [
                            "extract.properties.PMap.nestedMap",
                            "extract.context.CMap.nestedMap",
                        ]
                    }
                },
                POSTGRES: {
                    options: {
                        jsonPaths: [
                            "extract.properties.PMap.nestedMap",
                            "extract.context.CMap.nestedMap",
                        ]
                    }
                },
                SNOWFLAKE: {
                    options: {
                        jsonPaths: [
                            "extract.properties.PMap.nestedMap",
                            "extract.context.CMap.nestedMap",
                        ]
                    }
                },
                S3_DATALAKE: {
                    options: {
                        skipReservedKeywordsEscaping: true
                    }
                },
            },
            recordId: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            messageId: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            originalTimestamp: "2020-01-24T06:29:02.364Z",
            properties: {
                currency: "USD",
                revenue: 50,
                PMap: {
                    nestedMap: {
                        n1: "nested prop 1"
                    }
                },
            },
            type: "extract",
            receivedAt: "2020-01-24T11:59:02.403+05:30",
            request_ip: "[::1]:53708",
            sentAt: "2020-01-24T06:29:02.364Z",
            timestamp: "2020-01-24T11:59:02.403+05:30",
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
                    "context_c_map_nested_map_n_1": "context nested prop 1",
                    "context_sources_job_id": "djfhksdjhfkjdhfkjahkf",
                    "context_sources_job_run_id": "job_run_id",
                    "context_sources_task_run_id": "task_run_id",
                    "context_sources_version": "1169/merge",
                    "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
                    "currency": "USD",
                    "event": "Product Added",
                    "id": "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
                    "p_map_nested_map_n_1": "nested prop 1",
                    "received_at": "2020-01-24T06:29:02.403Z",
                    "revenue": 50
                },
                "metadata": {
                    "columns": {
                        "context_c_map_nested_map_n_1": "string",
                        "context_sources_job_id": "string",
                        "context_sources_job_run_id": "string",
                        "context_sources_task_run_id": "string",
                        "context_sources_version": "string",
                        "context_user_agent": "string",
                        "currency": "string",
                        "event": "string",
                        "id": "string",
                        "p_map_nested_map_n_1": "string",
                        "received_at": "datetime",
                        "revenue": "int",
                        "uuid_ts": "datetime"
                    },
                    "receivedAt": "2020-01-24T11:59:02.403+05:30",
                    "table": "product_added"
                }
            }
        ],
        rs: [
            {
                "data": {
                    "context_c_map_nested_map": "{\"n1\":\"context nested prop 1\"}",
                    "context_sources_job_id": "djfhksdjhfkjdhfkjahkf",
                    "context_sources_job_run_id": "job_run_id",
                    "context_sources_task_run_id": "task_run_id",
                    "context_sources_version": "1169/merge",
                    "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
                    "currency": "USD",
                    "event": "Product Added",
                    "id": "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
                    "p_map_nested_map": "{\"n1\":\"nested prop 1\"}",
                    "received_at": "2020-01-24T06:29:02.403Z",
                    "revenue": 50
                },
                "metadata": {
                    "columns": {
                        "context_c_map_nested_map": "json",
                        "context_sources_job_id": "string",
                        "context_sources_job_run_id": "string",
                        "context_sources_task_run_id": "string",
                        "context_sources_version": "string",
                        "context_user_agent": "string",
                        "currency": "string",
                        "event": "string",
                        "id": "string",
                        "p_map_nested_map": "json",
                        "received_at": "datetime",
                        "revenue": "int",
                        "uuid_ts": "datetime"
                    },
                    "receivedAt": "2020-01-24T11:59:02.403+05:30",
                    "table": "product_added"
                }
            }
        ],
        bq:[
            {
                "data": {
                    "context_c_map_nested_map": "{\"n1\":\"context nested prop 1\"}",
                    "context_sources_job_id": "djfhksdjhfkjdhfkjahkf",
                    "context_sources_job_run_id": "job_run_id",
                    "context_sources_task_run_id": "task_run_id",
                    "context_sources_version": "1169/merge",
                    "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
                    "currency": "USD",
                    "event": "Product Added",
                    "id": "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
                    "p_map_nested_map": "{\"n1\":\"nested prop 1\"}",
                    "received_at": "2020-01-24T06:29:02.403Z",
                    "revenue": 50
                },
                "metadata": {
                    "columns": {
                        "context_c_map_nested_map": "string",
                        "context_sources_job_id": "string",
                        "context_sources_job_run_id": "string",
                        "context_sources_task_run_id": "string",
                        "context_sources_version": "string",
                        "context_user_agent": "string",
                        "currency": "string",
                        "event": "string",
                        "id": "string",
                        "loaded_at": "datetime",
                        "p_map_nested_map": "string",
                        "received_at": "datetime",
                        "revenue": "int",
                        "uuid_ts": "datetime"
                    },
                    "receivedAt": "2020-01-24T11:59:02.403+05:30",
                    "table": "product_added"
                }
            }
        ],
        postgres: [
            {
                "data": {
                    "context_c_map_nested_map": "{\"n1\":\"context nested prop 1\"}",
                    "context_sources_job_id": "djfhksdjhfkjdhfkjahkf",
                    "context_sources_job_run_id": "job_run_id",
                    "context_sources_task_run_id": "task_run_id",
                    "context_sources_version": "1169/merge",
                    "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
                    "currency": "USD",
                    "event": "Product Added",
                    "id": "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
                    "p_map_nested_map": "{\"n1\":\"nested prop 1\"}",
                    "received_at": "2020-01-24T06:29:02.403Z",
                    "revenue": 50
                },
                "metadata": {
                    "columns": {
                        "context_c_map_nested_map": "json",
                        "context_sources_job_id": "string",
                        "context_sources_job_run_id": "string",
                        "context_sources_task_run_id": "string",
                        "context_sources_version": "string",
                        "context_user_agent": "string",
                        "currency": "string",
                        "event": "string",
                        "id": "string",
                        "p_map_nested_map": "json",
                        "received_at": "datetime",
                        "revenue": "int",
                        "uuid_ts": "datetime"
                    },
                    "receivedAt": "2020-01-24T11:59:02.403+05:30",
                    "table": "product_added"
                }
            }
        ],
        snowflake: [
            {
                "data": {
                    "CONTEXT_C_MAP_NESTED_MAP": "{\"n1\":\"context nested prop 1\"}",
                    "CONTEXT_SOURCES_JOB_ID": "djfhksdjhfkjdhfkjahkf",
                    "CONTEXT_SOURCES_JOB_RUN_ID": "job_run_id",
                    "CONTEXT_SOURCES_TASK_RUN_ID": "task_run_id",
                    "CONTEXT_SOURCES_VERSION": "1169/merge",
                    "CONTEXT_USER_AGENT": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
                    "CURRENCY": "USD",
                    "EVENT": "Product Added",
                    "ID": "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
                    "P_MAP_NESTED_MAP": "{\"n1\":\"nested prop 1\"}",
                    "RECEIVED_AT": "2020-01-24T06:29:02.403Z",
                    "REVENUE": 50
                },
                "metadata": {
                    "columns": {
                        "CONTEXT_C_MAP_NESTED_MAP": "json",
                        "CONTEXT_SOURCES_JOB_ID": "string",
                        "CONTEXT_SOURCES_JOB_RUN_ID": "string",
                        "CONTEXT_SOURCES_TASK_RUN_ID": "string",
                        "CONTEXT_SOURCES_VERSION": "string",
                        "CONTEXT_USER_AGENT": "string",
                        "CURRENCY": "string",
                        "EVENT": "string",
                        "ID": "string",
                        "P_MAP_NESTED_MAP": "json",
                        "RECEIVED_AT": "datetime",
                        "REVENUE": "int",
                        "UUID_TS": "datetime"
                    },
                    "receivedAt": "2020-01-24T11:59:02.403+05:30",
                    "table": "PRODUCT_ADDED"
                }
            }
        ]
    }
}
