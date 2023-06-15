const _ = require("lodash");

/*
 * RS: skip tracks, skip escaping, use blendo
 *    no tracks
 *    no escaping on reserved keyword groups
 *    path to $1,000,000 -> path_to_$1_000_000; 9omega -> _9omega; camelCase123Key -> camelcase123key
 * SNOWFLAKE: skip tracks, use blendo
 *    no tracks
 *    path to $1,000,000 -> PATH_TO_$1_000_000; 9omega -> _9OMEGA; camelCase123Key -> CAMELCASE123KEY
 * S3_DATALAKE: skip eescaping
 *    tracks table present
 *    no escaping on reserved keywords groups,timestamp
 *    path to $1,000,000 -> path_to_1_000_000; 9omega -> _9_omega; camelCase123Key -> camel_case_123_key
 * BQ, POSTGRES, CLICKHOUSE, MSSQL, AZURE_SYNAPSE -> default config
 */

const sampleEvents = {
  track: {
    input: {
      destination: {
        Config: {
          jsonPaths: " testMap.nestedMap, testArray"
        }
      },
      message: {
        anonymousId: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
        channel: "web",
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
          locale: "en-GB",
          os: {
            name: "",
            version: ""
          },
          screen: {
            density: 2
          },
          traits: {
            city: "Disney",
            country: "USA",
            email: "mickey@disney.com",
            firstname: "Mickey"
          },
          userAgent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36"
        },
        event: "groups",
        integrations: {
          All: true,
          RS: {
            options: {
              skipTracksTable: true,
              skipReservedKeywordsEscaping: true,
              useBlendoCasing: true
            }
          },
          SNOWFLAKE: {
            options: {
              skipTracksTable: true,
              useBlendoCasing: true,
              jsonPaths: ["tMap"]
            }
          },
          S3_DATALAKE: {
            options: {
              skipReservedKeywordsEscaping: true
            }
          },
          BQ: {
            options: {
              jsonPaths: ["tMap"]
            }
          }
        },
        messageId: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
        originalTimestamp: "2020-01-24T06:29:02.364Z",
        properties: {
          currency: "USD",
          revenue: 50,
          "path to $1,000,000": "None",
          "9omega": true,
          camelCase123Key: "camel case",
          testMap: {
            nestedMap: {
              n1: "nested prop 1"
            }
          },
          tMap: {
            t1: 10,
            t2: 20
          },
          testArray: ["This is", "an", "array"]
        },
        receivedAt: "2020-01-24T11:59:02.403+05:30",
        request_ip: "[::1]:53708",
        sentAt: "2020-01-24T06:29:02.364Z",
        timestamp: "2020-01-24T11:59:02.403+05:30",
        type: "track",
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
          metadata: {
            table: "tracks",
            columns: {
              uuid_ts: "datetime",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_library_name: "string",
              context_library_version: "string",
              context_locale: "string",
              context_screen_density: "int",
              context_traits_city: "string",
              context_traits_country: "string",
              context_traits_email: "string",
              context_traits_firstname: "string",
              context_user_agent: "string",
              event_text: "string",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              sent_at: "datetime",
              timestamp: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              channel: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              event: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_library_name: "RudderLabs JavaScript SDK",
            context_library_version: "1.0.5",
            context_locale: "en-GB",
            context_screen_density: 2,
            context_traits_city: "Disney",
            context_traits_country: "USA",
            context_traits_email: "mickey@disney.com",
            context_traits_firstname: "Mickey",
            context_user_agent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            event_text: "groups",
            id: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2020-01-24T06:29:02.364Z",
            timestamp: "2020-01-24T06:29:02.403Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.364Z",
            channel: "web",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
            event: "groups"
          }
        },
        {
          metadata: {
            table: "_groups",
            columns: {
              uuid_ts: "datetime",
              currency: "string",
              revenue: "int",
              path_to_1_000_000: "string",
              _9_omega: "boolean",
              camel_case_123_key: "string",
              test_map_nested_map_n_1: "string",
              t_map_t_1: "int",
              t_map_t_2: "int",
              test_array: "string",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_library_name: "string",
              context_library_version: "string",
              context_locale: "string",
              context_screen_density: "int",
              context_traits_city: "string",
              context_traits_country: "string",
              context_traits_email: "string",
              context_traits_firstname: "string",
              context_user_agent: "string",
              event_text: "string",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              sent_at: "datetime",
              timestamp: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              channel: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              event: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            currency: "USD",
            revenue: 50,
            path_to_1_000_000: "None",
            _9_omega: true,
            camel_case_123_key: "camel case",
            test_map_nested_map_n_1: "nested prop 1",
            t_map_t_1: 10,
            t_map_t_2: 20,
            test_array: ["This is", "an", "array"],
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_library_name: "RudderLabs JavaScript SDK",
            context_library_version: "1.0.5",
            context_locale: "en-GB",
            context_screen_density: 2,
            context_traits_city: "Disney",
            context_traits_country: "USA",
            context_traits_email: "mickey@disney.com",
            context_traits_firstname: "Mickey",
            context_user_agent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            event_text: "groups",
            id: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2020-01-24T06:29:02.364Z",
            timestamp: "2020-01-24T06:29:02.403Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.364Z",
            channel: "web",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
            event: "groups"
          }
        }
      ],
      rs: [
        {
          metadata: {
            table: "groups",
            columns: {
              uuid_ts: "datetime",
              currency: "string",
              revenue: "int",
              path_to_$1_000_000: "string",
              _9omega: "boolean",
              camelcase123key: "string",
              testmap_nestedmap: "json",
              tmap_t1: "int",
              tmap_t2: "int",
              testarray: "json",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_library_name: "string",
              context_library_version: "string",
              context_locale: "string",
              context_screen_density: "int",
              context_traits_city: "string",
              context_traits_country: "string",
              context_traits_email: "string",
              context_traits_firstname: "string",
              context_useragent: "string",
              event_text: "string",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              sent_at: "datetime",
              timestamp: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              channel: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              event: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            currency: "USD",
            revenue: 50,
            path_to_$1_000_000: "None",
            _9omega: true,
            camelcase123key: "camel case",
            testmap_nestedmap: '{"n1":"nested prop 1"}',
            tmap_t1: 10,
            tmap_t2: 20,
            testarray: '["This is","an","array"]',
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_library_name: "RudderLabs JavaScript SDK",
            context_library_version: "1.0.5",
            context_locale: "en-GB",
            context_screen_density: 2,
            context_traits_city: "Disney",
            context_traits_country: "USA",
            context_traits_email: "mickey@disney.com",
            context_traits_firstname: "Mickey",
            context_useragent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            event_text: "groups",
            id: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2020-01-24T06:29:02.364Z",
            timestamp: "2020-01-24T06:29:02.403Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.364Z",
            channel: "web",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
            event: "groups"
          }
        }
      ],
      snowflake: [
        {
          metadata: {
            table: "_GROUPS",
            columns: {
              UUID_TS: "datetime",
              CURRENCY: "string",
              REVENUE: "int",
              PATH_TO_$1_000_000: "string",
              _9OMEGA: "boolean",
              CAMELCASE123KEY: "string",
              TESTMAP_NESTEDMAP: "json",
              TMAP: "json",
              TESTARRAY: "json",
              CONTEXT_APP_BUILD: "string",
              CONTEXT_APP_NAME: "string",
              CONTEXT_APP_NAMESPACE: "string",
              CONTEXT_APP_VERSION: "string",
              CONTEXT_LIBRARY_NAME: "string",
              CONTEXT_LIBRARY_VERSION: "string",
              CONTEXT_LOCALE: "string",
              CONTEXT_SCREEN_DENSITY: "int",
              CONTEXT_TRAITS_CITY: "string",
              CONTEXT_TRAITS_COUNTRY: "string",
              CONTEXT_TRAITS_EMAIL: "string",
              CONTEXT_TRAITS_FIRSTNAME: "string",
              CONTEXT_USERAGENT: "string",
              EVENT_TEXT: "string",
              ID: "string",
              ANONYMOUS_ID: "string",
              USER_ID: "string",
              SENT_AT: "datetime",
              TIMESTAMP: "datetime",
              RECEIVED_AT: "datetime",
              ORIGINAL_TIMESTAMP: "datetime",
              CHANNEL: "string",
              CONTEXT_IP: "string",
              CONTEXT_REQUEST_IP: "string",
              CONTEXT_PASSED_IP: "string",
              EVENT: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            CURRENCY: "USD",
            REVENUE: 50,
            PATH_TO_$1_000_000: "None",
            _9OMEGA: true,
            CAMELCASE123KEY: "camel case",
            TESTMAP_NESTEDMAP: '{"n1":"nested prop 1"}',
            TMAP: '{"t1":10,"t2":20}',
            TESTARRAY: '["This is","an","array"]',
            CONTEXT_APP_BUILD: "1.0.0",
            CONTEXT_APP_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_APP_NAMESPACE: "com.rudderlabs.javascript",
            CONTEXT_APP_VERSION: "1.0.5",
            CONTEXT_LIBRARY_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_LIBRARY_VERSION: "1.0.5",
            CONTEXT_LOCALE: "en-GB",
            CONTEXT_SCREEN_DENSITY: 2,
            CONTEXT_TRAITS_CITY: "Disney",
            CONTEXT_TRAITS_COUNTRY: "USA",
            CONTEXT_TRAITS_EMAIL: "mickey@disney.com",
            CONTEXT_TRAITS_FIRSTNAME: "Mickey",
            CONTEXT_USERAGENT:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            EVENT_TEXT: "groups",
            ID: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            ANONYMOUS_ID: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            USER_ID: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            SENT_AT: "2020-01-24T06:29:02.364Z",
            TIMESTAMP: "2020-01-24T06:29:02.403Z",
            RECEIVED_AT: "2020-01-24T06:29:02.403Z",
            ORIGINAL_TIMESTAMP: "2020-01-24T06:29:02.364Z",
            CHANNEL: "web",
            CONTEXT_IP: "0.0.0.0",
            CONTEXT_REQUEST_IP: "[::1]:53708",
            CONTEXT_PASSED_IP: "0.0.0.0",
            EVENT: "groups"
          }
        }
      ],
      s3_datalake: [
        {
          metadata: {
            table: "tracks",
            columns: {
              uuid_ts: "datetime",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_library_name: "string",
              context_library_version: "string",
              context_locale: "string",
              context_screen_density: "int",
              context_traits_city: "string",
              context_traits_country: "string",
              context_traits_email: "string",
              context_traits_firstname: "string",
              context_user_agent: "string",
              event_text: "string",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              sent_at: "datetime",
              timestamp: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              channel: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              event: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_library_name: "RudderLabs JavaScript SDK",
            context_library_version: "1.0.5",
            context_locale: "en-GB",
            context_screen_density: 2,
            context_traits_city: "Disney",
            context_traits_country: "USA",
            context_traits_email: "mickey@disney.com",
            context_traits_firstname: "Mickey",
            context_user_agent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            event_text: "groups",
            id: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2020-01-24T06:29:02.364Z",
            timestamp: "2020-01-24T06:29:02.403Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.364Z",
            channel: "web",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
            event: "groups"
          }
        },
        {
          metadata: {
            table: "groups",
            columns: {
              uuid_ts: "datetime",
              currency: "string",
              revenue: "int",
              path_to_1_000_000: "string",
              _9_omega: "boolean",
              camel_case_123_key: "string",
              test_map_nested_map_n_1: "string",
              t_map_t_1: "int",
              t_map_t_2: "int",
              test_array: "string",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_library_name: "string",
              context_library_version: "string",
              context_locale: "string",
              context_screen_density: "int",
              context_traits_city: "string",
              context_traits_country: "string",
              context_traits_email: "string",
              context_traits_firstname: "string",
              context_user_agent: "string",
              event_text: "string",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              sent_at: "datetime",
              timestamp: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              channel: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              event: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            currency: "USD",
            revenue: 50,
            path_to_1_000_000: "None",
            _9_omega: true,
            camel_case_123_key: "camel case",
            test_map_nested_map_n_1: "nested prop 1",
            t_map_t_1: 10,
            t_map_t_2: 20,
            test_array: ["This is", "an", "array"],
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_library_name: "RudderLabs JavaScript SDK",
            context_library_version: "1.0.5",
            context_locale: "en-GB",
            context_screen_density: 2,
            context_traits_city: "Disney",
            context_traits_country: "USA",
            context_traits_email: "mickey@disney.com",
            context_traits_firstname: "Mickey",
            context_user_agent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            event_text: "groups",
            id: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2020-01-24T06:29:02.364Z",
            timestamp: "2020-01-24T06:29:02.403Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.364Z",
            channel: "web",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
            event: "groups"
          }
        }
      ],
      bq: [
        {
          metadata: {
            table: "tracks",
            columns: {
              uuid_ts: "datetime",
              loaded_at: "datetime",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_library_name: "string",
              context_library_version: "string",
              context_locale: "string",
              context_screen_density: "int",
              context_traits_city: "string",
              context_traits_country: "string",
              context_traits_email: "string",
              context_traits_firstname: "string",
              context_user_agent: "string",
              event_text: "string",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              sent_at: "datetime",
              timestamp: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              channel: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              event: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_library_name: "RudderLabs JavaScript SDK",
            context_library_version: "1.0.5",
            context_locale: "en-GB",
            context_screen_density: 2,
            context_traits_city: "Disney",
            context_traits_country: "USA",
            context_traits_email: "mickey@disney.com",
            context_traits_firstname: "Mickey",
            context_user_agent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            event_text: "groups",
            id: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2020-01-24T06:29:02.364Z",
            timestamp: "2020-01-24T06:29:02.403Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.364Z",
            channel: "web",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
            event: "groups"
          }
        },
        {
          metadata: {
            table: "_groups",
            columns: {
              uuid_ts: "datetime",
              loaded_at: "datetime",
              currency: "string",
              revenue: "int",
              path_to_1_000_000: "string",
              _9_omega: "boolean",
              camel_case_123_key: "string",
              test_map_nested_map: "string",
              t_map: "string",
              test_array: "string",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_library_name: "string",
              context_library_version: "string",
              context_locale: "string",
              context_screen_density: "int",
              context_traits_city: "string",
              context_traits_country: "string",
              context_traits_email: "string",
              context_traits_firstname: "string",
              context_user_agent: "string",
              event_text: "string",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              sent_at: "datetime",
              timestamp: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              channel: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              event: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            currency: "USD",
            revenue: 50,
            path_to_1_000_000: "None",
            _9_omega: true,
            camel_case_123_key: "camel case",
            test_map_nested_map: '{"n1":"nested prop 1"}',
            t_map: '{"t1":10,"t2":20}',
            test_array: '["This is","an","array"]',
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_library_name: "RudderLabs JavaScript SDK",
            context_library_version: "1.0.5",
            context_locale: "en-GB",
            context_screen_density: 2,
            context_traits_city: "Disney",
            context_traits_country: "USA",
            context_traits_email: "mickey@disney.com",
            context_traits_firstname: "Mickey",
            context_user_agent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            event_text: "groups",
            id: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2020-01-24T06:29:02.364Z",
            timestamp: "2020-01-24T06:29:02.403Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.364Z",
            channel: "web",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
            event: "groups"
          }
        }
      ]
    }
  },
  users: {
    input: {
      destination: {
        Config: {}
      },
      message: {
        type: "identify",
        sentAt: "2021-01-03T17:02:53.195Z",
        userId: "user123",
        channel: "web",
        integrations: {
          All: true,
          RS: {
            options: {
              skipUsersTable: true,
            }
          },
        },
        context: {
          os: {
            "name": "android",
            "version": "1.12.3"
          },
          app: {
            name: "RudderLabs JavaScript SDK",
            build: "1.0.0",
            version: "1.1.11",
            namespace: "com.rudderlabs.javascript"
          },
          traits: {
            email: "user123@email.com",
            phone: "+917836362334",
            userId: "user123"
          },
          locale: "en-US",
          device: {
            token: "token",
            id: "id",
            type: "ios"
          },
          library: {
            name: "RudderLabs JavaScript SDK",
            version: "1.1.11"
          },
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0"
        },
        rudderId: "8f8fa6b5-8e24-489c-8e22-61f23f2e364f",
        messageId: "2116ef8c-efc3-4ca4-851b-02ee60dad6ff",
        anonymousId: "97c46c81-3140-456d-b2a9-690d70aaca35",
        originalTimestamp: "2020-01-24T06:29:02.364Z",
        receivedAt: "2020-01-24T11:59:02.403+05:30",
        request_ip: "[::1]:53708",
        timestamp: "2020-01-24T11:59:02.403+05:30"
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
            "anonymous_id": "97c46c81-3140-456d-b2a9-690d70aaca35",
            "channel": "web",
            "context_app_build": "1.0.0",
            "context_app_name": "RudderLabs JavaScript SDK",
            "context_app_namespace": "com.rudderlabs.javascript",
            "context_app_version": "1.1.11",
            "context_device_id": "id",
            "context_device_token": "token",
            "context_device_type": "ios",
            "context_ip": "[::1]:53708",
            "context_library_name": "RudderLabs JavaScript SDK",
            "context_library_version": "1.1.11",
            "context_locale": "en-US",
            "context_os_name": "android",
            "context_os_version": "1.12.3",
            "context_request_ip": "[::1]:53708",
            "context_traits_email": "user123@email.com",
            "context_traits_phone": "+917836362334",
            "context_traits_user_id": "user123",
            "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0",
            "email": "user123@email.com",
            "id": "2116ef8c-efc3-4ca4-851b-02ee60dad6ff",
            "original_timestamp": "2020-01-24T06:29:02.364Z",
            "phone": "+917836362334",
            "received_at": "2020-01-24T06:29:02.403Z",
            "sent_at": "2021-01-03T17:02:53.195Z",
            "timestamp": "2020-01-24T06:29:02.403Z",
            "user_id": "user123"
          },
          "metadata": {
            "columns": {
              "anonymous_id": "string",
              "channel": "string",
              "context_app_build": "string",
              "context_app_name": "string",
              "context_app_namespace": "string",
              "context_app_version": "string",
              "context_device_id": "string",
              "context_device_token": "string",
              "context_device_type": "string",
              "context_ip": "string",
              "context_library_name": "string",
              "context_library_version": "string",
              "context_locale": "string",
              "context_os_name": "string",
              "context_os_version": "string",
              "context_request_ip": "string",
              "context_traits_email": "string",
              "context_traits_phone": "string",
              "context_traits_user_id": "string",
              "context_user_agent": "string",
              "email": "string",
              "id": "string",
              "original_timestamp": "datetime",
              "phone": "string",
              "received_at": "datetime",
              "sent_at": "datetime",
              "timestamp": "datetime",
              "user_id": "string",
              "uuid_ts": "datetime"
            },
            "receivedAt": "2020-01-24T11:59:02.403+05:30",
            "table": "identifies"
          }
        },
        {
          "data": {
            "context_app_build": "1.0.0",
            "context_app_name": "RudderLabs JavaScript SDK",
            "context_app_namespace": "com.rudderlabs.javascript",
            "context_app_version": "1.1.11",
            "context_device_id": "id",
            "context_device_token": "token",
            "context_device_type": "ios",
            "context_ip": "[::1]:53708",
            "context_library_name": "RudderLabs JavaScript SDK",
            "context_library_version": "1.1.11",
            "context_locale": "en-US",
            "context_os_name": "android",
            "context_os_version": "1.12.3",
            "context_request_ip": "[::1]:53708",
            "context_traits_email": "user123@email.com",
            "context_traits_phone": "+917836362334",
            "context_traits_user_id": "user123",
            "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0",
            "email": "user123@email.com",
            "id": "user123",
            "phone": "+917836362334",
            "received_at": "2020-01-24T06:29:02.403Z"
          },
          "metadata": {
            "columns": {
              "context_app_build": "string",
              "context_app_name": "string",
              "context_app_namespace": "string",
              "context_app_version": "string",
              "context_device_id": "string",
              "context_device_token": "string",
              "context_device_type": "string",
              "context_ip": "string",
              "context_library_name": "string",
              "context_library_version": "string",
              "context_locale": "string",
              "context_os_name": "string",
              "context_os_version": "string",
              "context_request_ip": "string",
              "context_traits_email": "string",
              "context_traits_phone": "string",
              "context_traits_user_id": "string",
              "context_user_agent": "string",
              "email": "string",
              "id": "string",
              "phone": "string",
              "received_at": "datetime",
              "uuid_ts": "datetime"
            },
            "receivedAt": "2020-01-24T11:59:02.403+05:30",
            "table": "users"
          }
        }
      ],
      rs: [
        {
          "data": {
            "anonymous_id": "97c46c81-3140-456d-b2a9-690d70aaca35",
            "channel": "web",
            "context_app_build": "1.0.0",
            "context_app_name": "RudderLabs JavaScript SDK",
            "context_app_namespace": "com.rudderlabs.javascript",
            "context_app_version": "1.1.11",
            "context_device_id": "id",
            "context_device_token": "token",
            "context_device_type": "ios",
            "context_ip": "[::1]:53708",
            "context_library_name": "RudderLabs JavaScript SDK",
            "context_library_version": "1.1.11",
            "context_locale": "en-US",
            "context_os_name": "android",
            "context_os_version": "1.12.3",
            "context_request_ip": "[::1]:53708",
            "context_traits_email": "user123@email.com",
            "context_traits_phone": "+917836362334",
            "context_traits_user_id": "user123",
            "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0",
            "email": "user123@email.com",
            "id": "2116ef8c-efc3-4ca4-851b-02ee60dad6ff",
            "original_timestamp": "2020-01-24T06:29:02.364Z",
            "phone": "+917836362334",
            "received_at": "2020-01-24T06:29:02.403Z",
            "sent_at": "2021-01-03T17:02:53.195Z",
            "timestamp": "2020-01-24T06:29:02.403Z",
            "user_id": "user123"
          },
          "metadata": {
            "columns": {
              "anonymous_id": "string",
              "channel": "string",
              "context_app_build": "string",
              "context_app_name": "string",
              "context_app_namespace": "string",
              "context_app_version": "string",
              "context_device_id": "string",
              "context_device_token": "string",
              "context_device_type": "string",
              "context_ip": "string",
              "context_library_name": "string",
              "context_library_version": "string",
              "context_locale": "string",
              "context_os_name": "string",
              "context_os_version": "string",
              "context_request_ip": "string",
              "context_traits_email": "string",
              "context_traits_phone": "string",
              "context_traits_user_id": "string",
              "context_user_agent": "string",
              "email": "string",
              "id": "string",
              "original_timestamp": "datetime",
              "phone": "string",
              "received_at": "datetime",
              "sent_at": "datetime",
              "timestamp": "datetime",
              "user_id": "string",
              "uuid_ts": "datetime"
            },
            "receivedAt": "2020-01-24T11:59:02.403+05:30",
            "table": "identifies"
          }
        }
      ],
      bq: [
        {
          "data": {
            "anonymous_id": "97c46c81-3140-456d-b2a9-690d70aaca35",
            "channel": "web",
            "context_app_build": "1.0.0",
            "context_app_name": "RudderLabs JavaScript SDK",
            "context_app_namespace": "com.rudderlabs.javascript",
            "context_app_version": "1.1.11",
            "context_device_id": "id",
            "context_device_token": "token",
            "context_device_type": "ios",
            "context_ip": "[::1]:53708",
            "context_library_name": "RudderLabs JavaScript SDK",
            "context_library_version": "1.1.11",
            "context_locale": "en-US",
            "context_os_name": "android",
            "context_os_version": "1.12.3",
            "context_request_ip": "[::1]:53708",
            "context_traits_email": "user123@email.com",
            "context_traits_phone": "+917836362334",
            "context_traits_user_id": "user123",
            "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0",
            "email": "user123@email.com",
            "id": "2116ef8c-efc3-4ca4-851b-02ee60dad6ff",
            "original_timestamp": "2020-01-24T06:29:02.364Z",
            "phone": "+917836362334",
            "received_at": "2020-01-24T06:29:02.403Z",
            "sent_at": "2021-01-03T17:02:53.195Z",
            "timestamp": "2020-01-24T06:29:02.403Z",
            "user_id": "user123"
          },
          "metadata": {
            "columns": {
              "anonymous_id": "string",
              "channel": "string",
              "context_app_build": "string",
              "context_app_name": "string",
              "context_app_namespace": "string",
              "context_app_version": "string",
              "context_device_id": "string",
              "context_device_token": "string",
              "context_device_type": "string",
              "context_ip": "string",
              "context_library_name": "string",
              "context_library_version": "string",
              "context_locale": "string",
              "context_os_name": "string",
              "context_os_version": "string",
              "context_request_ip": "string",
              "context_traits_email": "string",
              "context_traits_phone": "string",
              "context_traits_user_id": "string",
              "context_user_agent": "string",
              "email": "string",
              "id": "string",
              "loaded_at": "datetime",
              "original_timestamp": "datetime",
              "phone": "string",
              "received_at": "datetime",
              "sent_at": "datetime",
              "timestamp": "datetime",
              "user_id": "string",
              "uuid_ts": "datetime"
            },
            "receivedAt": "2020-01-24T11:59:02.403+05:30",
            "table": "identifies"
          }
        },
        {
          "data": {
            "context_app_build": "1.0.0",
            "context_app_name": "RudderLabs JavaScript SDK",
            "context_app_namespace": "com.rudderlabs.javascript",
            "context_app_version": "1.1.11",
            "context_device_id": "id",
            "context_device_token": "token",
            "context_device_type": "ios",
            "context_ip": "[::1]:53708",
            "context_library_name": "RudderLabs JavaScript SDK",
            "context_library_version": "1.1.11",
            "context_locale": "en-US",
            "context_os_name": "android",
            "context_os_version": "1.12.3",
            "context_request_ip": "[::1]:53708",
            "context_traits_email": "user123@email.com",
            "context_traits_phone": "+917836362334",
            "context_traits_user_id": "user123",
            "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0",
            "email": "user123@email.com",
            "id": "user123",
            "phone": "+917836362334",
            "received_at": "2020-01-24T06:29:02.403Z"
          },
          "metadata": {
            "columns": {
              "context_app_build": "string",
              "context_app_name": "string",
              "context_app_namespace": "string",
              "context_app_version": "string",
              "context_device_id": "string",
              "context_device_token": "string",
              "context_device_type": "string",
              "context_ip": "string",
              "context_library_name": "string",
              "context_library_version": "string",
              "context_locale": "string",
              "context_os_name": "string",
              "context_os_version": "string",
              "context_request_ip": "string",
              "context_traits_email": "string",
              "context_traits_phone": "string",
              "context_traits_user_id": "string",
              "context_user_agent": "string",
              "email": "string",
              "id": "string",
              "loaded_at": "datetime",
              "phone": "string",
              "received_at": "datetime",
              "uuid_ts": "datetime"
            },
            "receivedAt": "2020-01-24T11:59:02.403+05:30",
            "table": "users"
          }
        }
      ],
      snowflake: [
        {
          "data": {
            "ANONYMOUS_ID": "97c46c81-3140-456d-b2a9-690d70aaca35",
            "CHANNEL": "web",
            "CONTEXT_APP_BUILD": "1.0.0",
            "CONTEXT_APP_NAME": "RudderLabs JavaScript SDK",
            "CONTEXT_APP_NAMESPACE": "com.rudderlabs.javascript",
            "CONTEXT_APP_VERSION": "1.1.11",
            "CONTEXT_DEVICE_ID": "id",
            "CONTEXT_DEVICE_TOKEN": "token",
            "CONTEXT_DEVICE_TYPE": "ios",
            "CONTEXT_IP": "[::1]:53708",
            "CONTEXT_LIBRARY_NAME": "RudderLabs JavaScript SDK",
            "CONTEXT_LIBRARY_VERSION": "1.1.11",
            "CONTEXT_LOCALE": "en-US",
            "CONTEXT_OS_NAME": "android",
            "CONTEXT_OS_VERSION": "1.12.3",
            "CONTEXT_REQUEST_IP": "[::1]:53708",
            "CONTEXT_TRAITS_EMAIL": "user123@email.com",
            "CONTEXT_TRAITS_PHONE": "+917836362334",
            "CONTEXT_TRAITS_USER_ID": "user123",
            "CONTEXT_USER_AGENT": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0",
            "EMAIL": "user123@email.com",
            "ID": "2116ef8c-efc3-4ca4-851b-02ee60dad6ff",
            "ORIGINAL_TIMESTAMP": "2020-01-24T06:29:02.364Z",
            "PHONE": "+917836362334",
            "RECEIVED_AT": "2020-01-24T06:29:02.403Z",
            "SENT_AT": "2021-01-03T17:02:53.195Z",
            "TIMESTAMP": "2020-01-24T06:29:02.403Z",
            "USER_ID": "user123"
          },
          "metadata": {
            "columns": {
              "ANONYMOUS_ID": "string",
              "CHANNEL": "string",
              "CONTEXT_APP_BUILD": "string",
              "CONTEXT_APP_NAME": "string",
              "CONTEXT_APP_NAMESPACE": "string",
              "CONTEXT_APP_VERSION": "string",
              "CONTEXT_DEVICE_ID": "string",
              "CONTEXT_DEVICE_TOKEN": "string",
              "CONTEXT_DEVICE_TYPE": "string",
              "CONTEXT_IP": "string",
              "CONTEXT_LIBRARY_NAME": "string",
              "CONTEXT_LIBRARY_VERSION": "string",
              "CONTEXT_LOCALE": "string",
              "CONTEXT_OS_NAME": "string",
              "CONTEXT_OS_VERSION": "string",
              "CONTEXT_REQUEST_IP": "string",
              "CONTEXT_TRAITS_EMAIL": "string",
              "CONTEXT_TRAITS_PHONE": "string",
              "CONTEXT_TRAITS_USER_ID": "string",
              "CONTEXT_USER_AGENT": "string",
              "EMAIL": "string",
              "ID": "string",
              "ORIGINAL_TIMESTAMP": "datetime",
              "PHONE": "string",
              "RECEIVED_AT": "datetime",
              "SENT_AT": "datetime",
              "TIMESTAMP": "datetime",
              "USER_ID": "string",
              "UUID_TS": "datetime"
            },
            "receivedAt": "2020-01-24T11:59:02.403+05:30",
            "table": "IDENTIFIES"
          }
        },
        {
          "data": {
            "CONTEXT_APP_BUILD": "1.0.0",
            "CONTEXT_APP_NAME": "RudderLabs JavaScript SDK",
            "CONTEXT_APP_NAMESPACE": "com.rudderlabs.javascript",
            "CONTEXT_APP_VERSION": "1.1.11",
            "CONTEXT_DEVICE_ID": "id",
            "CONTEXT_DEVICE_TOKEN": "token",
            "CONTEXT_DEVICE_TYPE": "ios",
            "CONTEXT_IP": "[::1]:53708",
            "CONTEXT_LIBRARY_NAME": "RudderLabs JavaScript SDK",
            "CONTEXT_LIBRARY_VERSION": "1.1.11",
            "CONTEXT_LOCALE": "en-US",
            "CONTEXT_OS_NAME": "android",
            "CONTEXT_OS_VERSION": "1.12.3",
            "CONTEXT_REQUEST_IP": "[::1]:53708",
            "CONTEXT_TRAITS_EMAIL": "user123@email.com",
            "CONTEXT_TRAITS_PHONE": "+917836362334",
            "CONTEXT_TRAITS_USER_ID": "user123",
            "CONTEXT_USER_AGENT": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0",
            "EMAIL": "user123@email.com",
            "ID": "user123",
            "PHONE": "+917836362334",
            "RECEIVED_AT": "2020-01-24T06:29:02.403Z"
          },
          "metadata": {
            "columns": {
              "CONTEXT_APP_BUILD": "string",
              "CONTEXT_APP_NAME": "string",
              "CONTEXT_APP_NAMESPACE": "string",
              "CONTEXT_APP_VERSION": "string",
              "CONTEXT_DEVICE_ID": "string",
              "CONTEXT_DEVICE_TOKEN": "string",
              "CONTEXT_DEVICE_TYPE": "string",
              "CONTEXT_IP": "string",
              "CONTEXT_LIBRARY_NAME": "string",
              "CONTEXT_LIBRARY_VERSION": "string",
              "CONTEXT_LOCALE": "string",
              "CONTEXT_OS_NAME": "string",
              "CONTEXT_OS_VERSION": "string",
              "CONTEXT_REQUEST_IP": "string",
              "CONTEXT_TRAITS_EMAIL": "string",
              "CONTEXT_TRAITS_PHONE": "string",
              "CONTEXT_TRAITS_USER_ID": "string",
              "CONTEXT_USER_AGENT": "string",
              "EMAIL": "string",
              "ID": "string",
              "PHONE": "string",
              "RECEIVED_AT": "datetime",
              "UUID_TS": "datetime"
            },
            "receivedAt": "2020-01-24T11:59:02.403+05:30",
            "table": "USERS"
          }
        }
      ],
      s3_datalake: [
        {
          "data": {
            "_timestamp": "2020-01-24T06:29:02.403Z",
            "anonymous_id": "97c46c81-3140-456d-b2a9-690d70aaca35",
            "channel": "web",
            "context_app_build": "1.0.0",
            "context_app_name": "RudderLabs JavaScript SDK",
            "context_app_namespace": "com.rudderlabs.javascript",
            "context_app_version": "1.1.11",
            "context_device_id": "id",
            "context_device_token": "token",
            "context_device_type": "ios",
            "context_ip": "[::1]:53708",
            "context_library_name": "RudderLabs JavaScript SDK",
            "context_library_version": "1.1.11",
            "context_locale": "en-US",
            "context_os_name": "android",
            "context_os_version": "1.12.3",
            "context_request_ip": "[::1]:53708",
            "context_traits_email": "user123@email.com",
            "context_traits_phone": "+917836362334",
            "context_traits_user_id": "user123",
            "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0",
            "email": "user123@email.com",
            "id": "2116ef8c-efc3-4ca4-851b-02ee60dad6ff",
            "original_timestamp": "2020-01-24T06:29:02.364Z",
            "phone": "+917836362334",
            "received_at": "2020-01-24T06:29:02.403Z",
            "sent_at": "2021-01-03T17:02:53.195Z",
            "user_id": "user123"
          },
          "metadata": {
            "columns": {
              "_timestamp": "datetime",
              "anonymous_id": "string",
              "channel": "string",
              "context_app_build": "string",
              "context_app_name": "string",
              "context_app_namespace": "string",
              "context_app_version": "string",
              "context_device_id": "string",
              "context_device_token": "string",
              "context_device_type": "string",
              "context_ip": "string",
              "context_library_name": "string",
              "context_library_version": "string",
              "context_locale": "string",
              "context_os_name": "string",
              "context_os_version": "string",
              "context_request_ip": "string",
              "context_traits_email": "string",
              "context_traits_phone": "string",
              "context_traits_user_id": "string",
              "context_user_agent": "string",
              "email": "string",
              "id": "string",
              "original_timestamp": "datetime",
              "phone": "string",
              "received_at": "datetime",
              "sent_at": "datetime",
              "user_id": "string",
              "uuid_ts": "datetime"
            },
            "receivedAt": "2020-01-24T11:59:02.403+05:30",
            "table": "identifies"
          }
        },
        {
          "data": {
            "context_app_build": "1.0.0",
            "context_app_name": "RudderLabs JavaScript SDK",
            "context_app_namespace": "com.rudderlabs.javascript",
            "context_app_version": "1.1.11",
            "context_device_id": "id",
            "context_device_token": "token",
            "context_device_type": "ios",
            "context_ip": "[::1]:53708",
            "context_library_name": "RudderLabs JavaScript SDK",
            "context_library_version": "1.1.11",
            "context_locale": "en-US",
            "context_os_name": "android",
            "context_os_version": "1.12.3",
            "context_request_ip": "[::1]:53708",
            "context_traits_email": "user123@email.com",
            "context_traits_phone": "+917836362334",
            "context_traits_user_id": "user123",
            "context_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0",
            "email": "user123@email.com",
            "id": "user123",
            "phone": "+917836362334",
            "received_at": "2020-01-24T06:29:02.403Z"
          },
          "metadata": {
            "columns": {
              "context_app_build": "string",
              "context_app_name": "string",
              "context_app_namespace": "string",
              "context_app_version": "string",
              "context_device_id": "string",
              "context_device_token": "string",
              "context_device_type": "string",
              "context_ip": "string",
              "context_library_name": "string",
              "context_library_version": "string",
              "context_locale": "string",
              "context_os_name": "string",
              "context_os_version": "string",
              "context_request_ip": "string",
              "context_traits_email": "string",
              "context_traits_phone": "string",
              "context_traits_user_id": "string",
              "context_user_agent": "string",
              "email": "string",
              "id": "string",
              "phone": "string",
              "received_at": "datetime",
              "uuid_ts": "datetime"
            },
            "receivedAt": "2020-01-24T11:59:02.403+05:30",
            "table": "users"
          }
        }
      ]
    }
  }
};

function opInput(eventType) {
  return _.cloneDeep(sampleEvents[eventType].input);
}

function opOutput(eventType, provider) {
  switch (provider) {
    case "snowflake":
      return _.cloneDeep(sampleEvents[eventType].output.snowflake);
    case "s3_datalake":
      return _.cloneDeep(sampleEvents[eventType].output.s3_datalake);
    case "rs":
      return _.cloneDeep(sampleEvents[eventType].output.rs);
    case "bq":
      return _.cloneDeep(sampleEvents[eventType].output.bq);
    default:
      return _.cloneDeep(sampleEvents[eventType].output.default);
  }
}

module.exports = { opInput, opOutput };
