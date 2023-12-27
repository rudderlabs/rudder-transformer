const _ = require("lodash");

// TODO: also include events with whSchemaVersions v0
const sampleEvents = {
  track: {
    input: {
      destination: {
        Config: {
          restApiKey: "dummyApiKey",
          prefixProperties: true,
          useNativeSDK: false
        },
        DestinationDefinition: {
          DisplayName: "Braze",
          ID: "1WhbSZ6uA3H5ChVifHpfL2H6sie",
          Name: "BRAZE"
        },
        Enabled: true,
        ID: "1WhcOCGgj9asZu850HvugU2C3Aq",
        Name: "Braze",
        Transformations: []
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
        event: "button clicked",
        integrations: {
          All: true
        },
        messageId: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
        originalTimestamp: "2020-01-24T06:29:02.364Z",
        properties: {
          currency: "USD",
          revenue: 50,
          stack: {
            history: {
              errorDetails: [
                {
                  "message": "Cannot set headers after they are sent to the client",
                  "toString": "[function]"
                }
              ]
            }
          }
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
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
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
              event: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
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
            event_text: "button clicked",
            id: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2020-01-24T06:29:02.364Z",
            timestamp: "2020-01-24T06:29:02.403Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.364Z",
            channel: "web",
            event: "button_clicked"
          }
        },
        {
          metadata: {
            table: "button_clicked",
            columns: {
              uuid_ts: "datetime",
              currency: "string",
              revenue: "int",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
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
              event: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            currency: "USD",
            revenue: 50,
            stack_history_error_details: [
              {
                "message": "Cannot set headers after they are sent to the client",
                "toString": "[function]"
              }
            ],
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
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
            event_text: "button clicked",
            id: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2020-01-24T06:29:02.364Z",
            timestamp: "2020-01-24T06:29:02.403Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.364Z",
            channel: "web",
            event: "button_clicked"
          }
        }
      ],
      snowflake: [
        {
          metadata: {
            table: "TRACKS",
            columns: {
              UUID_TS: "datetime",
              CONTEXT_APP_BUILD: "string",
              CONTEXT_APP_NAME: "string",
              CONTEXT_APP_NAMESPACE: "string",
              CONTEXT_APP_VERSION: "string",
              CONTEXT_IP: "string",
              CONTEXT_REQUEST_IP: "string",
              CONTEXT_PASSED_IP: "string",
              CONTEXT_LIBRARY_NAME: "string",
              CONTEXT_LIBRARY_VERSION: "string",
              CONTEXT_LOCALE: "string",
              CONTEXT_SCREEN_DENSITY: "int",
              CONTEXT_TRAITS_CITY: "string",
              CONTEXT_TRAITS_COUNTRY: "string",
              CONTEXT_TRAITS_EMAIL: "string",
              CONTEXT_TRAITS_FIRSTNAME: "string",
              CONTEXT_USER_AGENT: "string",
              EVENT_TEXT: "string",
              ID: "string",
              ANONYMOUS_ID: "string",
              USER_ID: "string",
              SENT_AT: "datetime",
              TIMESTAMP: "datetime",
              RECEIVED_AT: "datetime",
              ORIGINAL_TIMESTAMP: "datetime",
              CHANNEL: "string",
              EVENT: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            CONTEXT_APP_BUILD: "1.0.0",
            CONTEXT_APP_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_APP_NAMESPACE: "com.rudderlabs.javascript",
            CONTEXT_APP_VERSION: "1.0.5",
            CONTEXT_IP: "0.0.0.0",
            CONTEXT_REQUEST_IP: "[::1]:53708",
            CONTEXT_PASSED_IP: "0.0.0.0",
            CONTEXT_LIBRARY_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_LIBRARY_VERSION: "1.0.5",
            CONTEXT_LOCALE: "en-GB",
            CONTEXT_SCREEN_DENSITY: 2,
            CONTEXT_TRAITS_CITY: "Disney",
            CONTEXT_TRAITS_COUNTRY: "USA",
            CONTEXT_TRAITS_EMAIL: "mickey@disney.com",
            CONTEXT_TRAITS_FIRSTNAME: "Mickey",
            CONTEXT_USER_AGENT:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            EVENT_TEXT: "button clicked",
            ID: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            ANONYMOUS_ID: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            USER_ID: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            SENT_AT: "2020-01-24T06:29:02.364Z",
            TIMESTAMP: "2020-01-24T06:29:02.403Z",
            RECEIVED_AT: "2020-01-24T06:29:02.403Z",
            ORIGINAL_TIMESTAMP: "2020-01-24T06:29:02.364Z",
            CHANNEL: "web",
            EVENT: "button_clicked"
          }
        },
        {
          metadata: {
            table: "BUTTON_CLICKED",
            columns: {
              UUID_TS: "datetime",
              CURRENCY: "string",
              REVENUE: "int",
              CONTEXT_APP_BUILD: "string",
              CONTEXT_APP_NAME: "string",
              CONTEXT_APP_NAMESPACE: "string",
              CONTEXT_APP_VERSION: "string",
              CONTEXT_IP: "string",
              CONTEXT_REQUEST_IP: "string",
              CONTEXT_PASSED_IP: "string",
              CONTEXT_LIBRARY_NAME: "string",
              CONTEXT_LIBRARY_VERSION: "string",
              CONTEXT_LOCALE: "string",
              CONTEXT_SCREEN_DENSITY: "int",
              CONTEXT_TRAITS_CITY: "string",
              CONTEXT_TRAITS_COUNTRY: "string",
              CONTEXT_TRAITS_EMAIL: "string",
              CONTEXT_TRAITS_FIRSTNAME: "string",
              CONTEXT_USER_AGENT: "string",
              EVENT_TEXT: "string",
              ID: "string",
              ANONYMOUS_ID: "string",
              USER_ID: "string",
              SENT_AT: "datetime",
              TIMESTAMP: "datetime",
              RECEIVED_AT: "datetime",
              ORIGINAL_TIMESTAMP: "datetime",
              CHANNEL: "string",
              EVENT: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            CURRENCY: "USD",
            REVENUE: 50,
            STACK_HISTORY_ERROR_DETAILS: [
              {
                "message": "Cannot set headers after they are sent to the client",
                "toString": "[function]"
              }
            ],
            CONTEXT_APP_BUILD: "1.0.0",
            CONTEXT_APP_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_APP_NAMESPACE: "com.rudderlabs.javascript",
            CONTEXT_APP_VERSION: "1.0.5",
            CONTEXT_IP: "0.0.0.0",
            CONTEXT_REQUEST_IP: "[::1]:53708",
            CONTEXT_PASSED_IP: "0.0.0.0",
            CONTEXT_LIBRARY_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_LIBRARY_VERSION: "1.0.5",
            CONTEXT_LOCALE: "en-GB",
            CONTEXT_SCREEN_DENSITY: 2,
            CONTEXT_TRAITS_CITY: "Disney",
            CONTEXT_TRAITS_COUNTRY: "USA",
            CONTEXT_TRAITS_EMAIL: "mickey@disney.com",
            CONTEXT_TRAITS_FIRSTNAME: "Mickey",
            CONTEXT_USER_AGENT:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            EVENT_TEXT: "button clicked",
            ID: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            ANONYMOUS_ID: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            USER_ID: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            SENT_AT: "2020-01-24T06:29:02.364Z",
            TIMESTAMP: "2020-01-24T06:29:02.403Z",
            RECEIVED_AT: "2020-01-24T06:29:02.403Z",
            ORIGINAL_TIMESTAMP: "2020-01-24T06:29:02.364Z",
            CHANNEL: "web",
            EVENT: "button_clicked",
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
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
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
              _timestamp: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              channel: "string",
              event: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
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
            event_text: "button clicked",
            id: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2020-01-24T06:29:02.364Z",
            _timestamp: "2020-01-24T06:29:02.403Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.364Z",
            channel: "web",
            event: "button_clicked"
          }
        },
        {
          metadata: {
            table: "button_clicked",
            columns: {
              uuid_ts: "datetime",
              currency: "string",
              revenue: "int",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
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
              _timestamp: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              channel: "string",
              event: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            currency: "USD",
            revenue: 50,
            stack_history_error_details: [
              {
                "message": "Cannot set headers after they are sent to the client",
                "toString": "[function]"
              }
            ],
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
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
            event_text: "button clicked",
            id: "a6a0ad5a-bd26-4f19-8f75-38484e580fc7",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2020-01-24T06:29:02.364Z",
            _timestamp: "2020-01-24T06:29:02.403Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.364Z",
            channel: "web",
            event: "button_clicked"
          }
        }
      ]
    }
  },
  identify: {
    input: {
      destination: {
        Config: {
          restApiKey: "dummyApiKey",
          prefixProperties: true,
          useNativeSDK: false
        },
        DestinationDefinition: {
          DisplayName: "Braze",
          ID: "1WhbSZ6uA3H5ChVifHpfL2H6sie",
          Name: "BRAZE"
        },
        Enabled: true,
        ID: "1WhcOCGgj9asZu850HvugU2C3Aq",
        Name: "Braze",
        Transformations: []
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
        traits: {
          country: "UK",
          lastname: "Mouse"
        },
        integrations: {
          All: true
        },
        messageId: "2536eda4-d638-4c93-8014-8ffe3f083214",
        originalTimestamp: "2020-01-24T06:29:02.362Z",
        receivedAt: "2020-01-24T11:59:02.403+05:30",
        request_ip: "[::1]:53708",
        sentAt: "2020-01-24T06:29:02.363Z",
        timestamp: "2020-01-24T11:59:02.402+05:30",
        type: "identify",
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
            table: "identifies",
            columns: {
              uuid_ts: "datetime",
              city: "string",
              country: "string",
              email: "string",
              firstname: "string",
              lastname: "string",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              context_library_name: "string",
              context_library_version: "string",
              context_locale: "string",
              context_screen_density: "int",
              context_traits_city: "string",
              context_traits_country: "string",
              context_traits_email: "string",
              context_traits_firstname: "string",
              context_user_agent: "string",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              sent_at: "datetime",
              timestamp: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              channel: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            city: "Disney",
            country: "UK",
            email: "mickey@disney.com",
            firstname: "Mickey",
            lastname: "Mouse",
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
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
            id: "2536eda4-d638-4c93-8014-8ffe3f083214",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2020-01-24T06:29:02.363Z",
            timestamp: "2020-01-24T06:29:02.402Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.362Z",
            channel: "web"
          }
        },
        {
          metadata: {
            table: "users",
            columns: {
              uuid_ts: "datetime",
              city: "string",
              country: "string",
              email: "string",
              firstname: "string",
              lastname: "string",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              context_library_name: "string",
              context_library_version: "string",
              context_locale: "string",
              context_screen_density: "int",
              context_traits_city: "string",
              context_traits_country: "string",
              context_traits_email: "string",
              context_traits_firstname: "string",
              context_user_agent: "string",
              id: "string",
              received_at: "datetime"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            city: "Disney",
            country: "UK",
            email: "mickey@disney.com",
            firstname: "Mickey",
            lastname: "Mouse",
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
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
            id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            received_at: "2020-01-24T06:29:02.403Z"
          }
        }
      ],
      snowflake: [
        {
          metadata: {
            table: "IDENTIFIES",
            columns: {
              UUID_TS: "datetime",
              CITY: "string",
              COUNTRY: "string",
              EMAIL: "string",
              FIRSTNAME: "string",
              LASTNAME: "string",
              CONTEXT_APP_BUILD: "string",
              CONTEXT_APP_NAME: "string",
              CONTEXT_APP_NAMESPACE: "string",
              CONTEXT_APP_VERSION: "string",
              CONTEXT_IP: "string",
              CONTEXT_REQUEST_IP: "string",
              CONTEXT_PASSED_IP: "string",
              CONTEXT_LIBRARY_NAME: "string",
              CONTEXT_LIBRARY_VERSION: "string",
              CONTEXT_LOCALE: "string",
              CONTEXT_SCREEN_DENSITY: "int",
              CONTEXT_TRAITS_CITY: "string",
              CONTEXT_TRAITS_COUNTRY: "string",
              CONTEXT_TRAITS_EMAIL: "string",
              CONTEXT_TRAITS_FIRSTNAME: "string",
              CONTEXT_USER_AGENT: "string",
              ID: "string",
              ANONYMOUS_ID: "string",
              USER_ID: "string",
              SENT_AT: "datetime",
              TIMESTAMP: "datetime",
              RECEIVED_AT: "datetime",
              ORIGINAL_TIMESTAMP: "datetime",
              CHANNEL: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            CITY: "Disney",
            COUNTRY: "UK",
            EMAIL: "mickey@disney.com",
            FIRSTNAME: "Mickey",
            LASTNAME: "Mouse",
            CONTEXT_APP_BUILD: "1.0.0",
            CONTEXT_APP_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_APP_NAMESPACE: "com.rudderlabs.javascript",
            CONTEXT_APP_VERSION: "1.0.5",
            CONTEXT_IP: "0.0.0.0",
            CONTEXT_REQUEST_IP: "[::1]:53708",
            CONTEXT_PASSED_IP: "0.0.0.0",
            CONTEXT_LIBRARY_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_LIBRARY_VERSION: "1.0.5",
            CONTEXT_LOCALE: "en-GB",
            CONTEXT_SCREEN_DENSITY: 2,
            CONTEXT_TRAITS_CITY: "Disney",
            CONTEXT_TRAITS_COUNTRY: "USA",
            CONTEXT_TRAITS_EMAIL: "mickey@disney.com",
            CONTEXT_TRAITS_FIRSTNAME: "Mickey",
            CONTEXT_USER_AGENT:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            ID: "2536eda4-d638-4c93-8014-8ffe3f083214",
            ANONYMOUS_ID: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            USER_ID: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            SENT_AT: "2020-01-24T06:29:02.363Z",
            TIMESTAMP: "2020-01-24T06:29:02.402Z",
            RECEIVED_AT: "2020-01-24T06:29:02.403Z",
            ORIGINAL_TIMESTAMP: "2020-01-24T06:29:02.362Z",
            CHANNEL: "web"
          }
        },
        {
          metadata: {
            table: "USERS",
            columns: {
              UUID_TS: "datetime",
              CITY: "string",
              COUNTRY: "string",
              EMAIL: "string",
              FIRSTNAME: "string",
              LASTNAME: "string",
              CONTEXT_APP_BUILD: "string",
              CONTEXT_APP_NAME: "string",
              CONTEXT_APP_NAMESPACE: "string",
              CONTEXT_APP_VERSION: "string",
              CONTEXT_IP: "string",
              CONTEXT_REQUEST_IP: "string",
              CONTEXT_PASSED_IP: "string",
              CONTEXT_LIBRARY_NAME: "string",
              CONTEXT_LIBRARY_VERSION: "string",
              CONTEXT_LOCALE: "string",
              CONTEXT_SCREEN_DENSITY: "int",
              CONTEXT_TRAITS_CITY: "string",
              CONTEXT_TRAITS_COUNTRY: "string",
              CONTEXT_TRAITS_EMAIL: "string",
              CONTEXT_TRAITS_FIRSTNAME: "string",
              CONTEXT_USER_AGENT: "string",
              ID: "string",
              RECEIVED_AT: "datetime"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            CITY: "Disney",
            COUNTRY: "UK",
            EMAIL: "mickey@disney.com",
            FIRSTNAME: "Mickey",
            LASTNAME: "Mouse",
            CONTEXT_APP_BUILD: "1.0.0",
            CONTEXT_APP_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_APP_NAMESPACE: "com.rudderlabs.javascript",
            CONTEXT_APP_VERSION: "1.0.5",
            CONTEXT_IP: "0.0.0.0",
            CONTEXT_REQUEST_IP: "[::1]:53708",
            CONTEXT_PASSED_IP: "0.0.0.0",
            CONTEXT_LIBRARY_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_LIBRARY_VERSION: "1.0.5",
            CONTEXT_LOCALE: "en-GB",
            CONTEXT_SCREEN_DENSITY: 2,
            CONTEXT_TRAITS_CITY: "Disney",
            CONTEXT_TRAITS_COUNTRY: "USA",
            CONTEXT_TRAITS_EMAIL: "mickey@disney.com",
            CONTEXT_TRAITS_FIRSTNAME: "Mickey",
            CONTEXT_USER_AGENT:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            ID: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            RECEIVED_AT: "2020-01-24T06:29:02.403Z"
          }
        }
      ],
      s3_datalake: [
        {
          metadata: {
            table: "identifies",
            columns: {
              uuid_ts: "datetime",
              city: "string",
              country: "string",
              email: "string",
              firstname: "string",
              lastname: "string",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              context_library_name: "string",
              context_library_version: "string",
              context_locale: "string",
              context_screen_density: "int",
              context_traits_city: "string",
              context_traits_country: "string",
              context_traits_email: "string",
              context_traits_firstname: "string",
              context_user_agent: "string",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              sent_at: "datetime",
              _timestamp: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              channel: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            city: "Disney",
            country: "UK",
            email: "mickey@disney.com",
            firstname: "Mickey",
            lastname: "Mouse",
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
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
            id: "2536eda4-d638-4c93-8014-8ffe3f083214",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2020-01-24T06:29:02.363Z",
            _timestamp: "2020-01-24T06:29:02.402Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.362Z",
            channel: "web"
          }
        },
        {
          metadata: {
            table: "users",
            columns: {
              uuid_ts: "datetime",
              city: "string",
              country: "string",
              email: "string",
              firstname: "string",
              lastname: "string",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              context_library_name: "string",
              context_library_version: "string",
              context_locale: "string",
              context_screen_density: "int",
              context_traits_city: "string",
              context_traits_country: "string",
              context_traits_email: "string",
              context_traits_firstname: "string",
              context_user_agent: "string",
              id: "string",
              received_at: "datetime"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            city: "Disney",
            country: "UK",
            email: "mickey@disney.com",
            firstname: "Mickey",
            lastname: "Mouse",
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
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
            id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            received_at: "2020-01-24T06:29:02.403Z"
          }
        }
      ]
    }
  },
  page: {
    input: {
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
          traits: {},
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36"
        },
        integrations: {
          All: true
        },
        messageId: "dd266c67-9199-4a52-ba32-f46ddde67312",
        originalTimestamp: "2020-01-24T06:29:02.358Z",
        properties: {
          path: "/tests/html/index2.html",
          referrer: "",
          search: "",
          title: "",
          url: "http://localhost/tests/html/index2.html"
        },
        receivedAt: "2020-01-24T11:59:02.403+05:30",
        request_ip: "[::1]:53708",
        sentAt: "2020-01-24T06:29:02.359Z",
        timestamp: "2020-01-24T11:59:02.402+05:30",
        type: "page",
        name: "sample title",
        userId: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33"
      },
      destination: {
        Config: {
          restApiKey: "dummyApiKey",
          prefixProperties: true,
          useNativeSDK: false
        },
        DestinationDefinition: {
          DisplayName: "Braze",
          ID: "1WhbSZ6uA3H5ChVifHpfL2H6sie",
          Name: "BRAZE"
        },
        Enabled: true,
        ID: "1WhcOCGgj9asZu850HvugU2C3Aq",
        Name: "Braze",
        Transformations: []
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
            table: "pages",
            columns: {
              uuid_ts: "datetime",
              path: "string",
              url: "string",
              name: "string",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              context_library_version: "string",
              context_locale: "string",
              context_screen_density: "int",
              context_user_agent: "string",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              sent_at: "datetime",
              timestamp: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              channel: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            path: "/tests/html/index2.html",
            url: "http://localhost/tests/html/index2.html",
            name: "sample title",
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
            context_library_name: "RudderLabs JavaScript SDK",
            context_library_version: "1.0.5",
            context_locale: "en-GB",
            context_screen_density: 2,
            context_user_agent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            id: "dd266c67-9199-4a52-ba32-f46ddde67312",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2020-01-24T06:29:02.359Z",
            timestamp: "2020-01-24T06:29:02.402Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.358Z",
            channel: "web"
          }
        }
      ],
      snowflake: [
        {
          metadata: {
            table: "PAGES",
            columns: {
              UUID_TS: "datetime",
              PATH: "string",
              URL: "string",
              NAME: "string",
              CONTEXT_APP_BUILD: "string",
              CONTEXT_APP_NAME: "string",
              CONTEXT_APP_NAMESPACE: "string",
              CONTEXT_APP_VERSION: "string",
              CONTEXT_IP: "string",
              CONTEXT_REQUEST_IP: "string",
              CONTEXT_PASSED_IP: "string",
              CONTEXT_LIBRARY_NAME: "string",
              CONTEXT_LIBRARY_VERSION: "string",
              CONTEXT_LOCALE: "string",
              CONTEXT_SCREEN_DENSITY: "int",
              CONTEXT_USER_AGENT: "string",
              ID: "string",
              ANONYMOUS_ID: "string",
              USER_ID: "string",
              SENT_AT: "datetime",
              TIMESTAMP: "datetime",
              RECEIVED_AT: "datetime",
              ORIGINAL_TIMESTAMP: "datetime",
              CHANNEL: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            PATH: "/tests/html/index2.html",
            URL: "http://localhost/tests/html/index2.html",
            NAME: "sample title",
            CONTEXT_APP_BUILD: "1.0.0",
            CONTEXT_APP_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_APP_NAMESPACE: "com.rudderlabs.javascript",
            CONTEXT_APP_VERSION: "1.0.5",
            CONTEXT_IP: "0.0.0.0",
            CONTEXT_REQUEST_IP: "[::1]:53708",
            CONTEXT_PASSED_IP: "0.0.0.0",
            CONTEXT_LIBRARY_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_LIBRARY_VERSION: "1.0.5",
            CONTEXT_LOCALE: "en-GB",
            CONTEXT_SCREEN_DENSITY: 2,
            CONTEXT_USER_AGENT:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            ID: "dd266c67-9199-4a52-ba32-f46ddde67312",
            ANONYMOUS_ID: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            USER_ID: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            SENT_AT: "2020-01-24T06:29:02.359Z",
            TIMESTAMP: "2020-01-24T06:29:02.402Z",
            RECEIVED_AT: "2020-01-24T06:29:02.403Z",
            ORIGINAL_TIMESTAMP: "2020-01-24T06:29:02.358Z",
            CHANNEL: "web"
          }
        }
      ],
      s3_datalake: [
        {
          metadata: {
            table: "pages",
            columns: {
              uuid_ts: "datetime",
              path: "string",
              url: "string",
              name: "string",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              context_library_version: "string",
              context_locale: "string",
              context_screen_density: "int",
              context_user_agent: "string",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              sent_at: "datetime",
              _timestamp: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              channel: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            path: "/tests/html/index2.html",
            url: "http://localhost/tests/html/index2.html",
            name: "sample title",
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
            context_library_name: "RudderLabs JavaScript SDK",
            context_library_version: "1.0.5",
            context_locale: "en-GB",
            context_screen_density: 2,
            context_user_agent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            id: "dd266c67-9199-4a52-ba32-f46ddde67312",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2020-01-24T06:29:02.359Z",
            _timestamp: "2020-01-24T06:29:02.402Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.358Z",
            channel: "web"
          }
        }
      ]
    }
  },
  screen: {
    input: {
      message: {
        channel: "web",
        context: {
          app: {
            build: "1.0.0",
            name: "RudderLabs JavaScript SDK",
            namespace: "com.rudderlabs.javascript",
            version: "1.0.0"
          },
          traits: {
            email: "test@rudderstack.com"
          },
          library: {
            name: "RudderLabs JavaScript SDK",
            version: "1.0.0"
          },
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
          locale: "en-US",
          ip: "0.0.0.0",
          os: {
            name: "",
            version: ""
          },
          screen: {
            density: 2
          }
        },
        type: "screen",
        messageId: "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
        originalTimestamp: "2019-10-14T11:15:18.299Z",
        receivedAt: "2020-01-24T11:59:02.403+05:30",
        timestamp: "2020-01-24T11:59:02.402+05:30",
        anonymousId: "00000000000000000000000000",
        userId: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
        request_ip: "[::1]:53708",
        properties: {
          path: "/abc",
          referrer: "",
          search: "",
          title: "",
          url: "",
          category: "test-category"
        },
        integrations: {
          All: true
        },
        name: "ApplicationLoaded",
        sentAt: "2019-10-14T11:15:53.296Z"
      },
      destination: {
        Config: {
          apiKey: "12345",
          mapToSingleEvent: false,
          trackAllPages: false,
          trackCategorisedPages: true,
          trackNamedPages: false
        },
        Enabled: true
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
            table: "screens",
            columns: {
              uuid_ts: "datetime",
              path: "string",
              category: "string",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_traits_email: "string",
              context_library_name: "string",
              context_library_version: "string",
              context_user_agent: "string",
              context_locale: "string",
              context_screen_density: "int",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              sent_at: "datetime",
              original_timestamp: "datetime",
              received_at: "datetime",
              timestamp: "datetime",
              channel: "string",
              name: "string"
            }
          },
          data: {
            path: "/abc",
            category: "test-category",
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.0",
            context_traits_email: "test@rudderstack.com",
            context_library_name: "RudderLabs JavaScript SDK",
            context_library_version: "1.0.0",
            context_user_agent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
            context_locale: "en-US",
            context_screen_density: 2,
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
            id: "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
            anonymous_id: "00000000000000000000000000",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2019-10-14T11:15:53.296Z",
            original_timestamp: "2019-10-14T11:15:18.299Z",
            received_at: "2020-01-24T06:29:02.403Z",
            timestamp: "2020-01-24T06:29:02.402Z",
            channel: "web",
            name: "ApplicationLoaded"
          }
        }
      ],
      snowflake: [
        {
          metadata: {
            table: "SCREENS",
            columns: {
              UUID_TS: "datetime",
              PATH: "string",
              CATEGORY: "string",
              CONTEXT_APP_BUILD: "string",
              CONTEXT_APP_NAME: "string",
              CONTEXT_APP_NAMESPACE: "string",
              CONTEXT_APP_VERSION: "string",
              CONTEXT_TRAITS_EMAIL: "string",
              CONTEXT_LIBRARY_NAME: "string",
              CONTEXT_LIBRARY_VERSION: "string",
              CONTEXT_USER_AGENT: "string",
              CONTEXT_LOCALE: "string",
              CONTEXT_SCREEN_DENSITY: "int",
              CONTEXT_IP: "string",
              CONTEXT_REQUEST_IP: "string",
              CONTEXT_PASSED_IP: "string",
              ID: "string",
              ANONYMOUS_ID: "string",
              USER_ID: "string",
              SENT_AT: "datetime",
              ORIGINAL_TIMESTAMP: "datetime",
              RECEIVED_AT: "datetime",
              TIMESTAMP: "datetime",
              CHANNEL: "string",
              NAME: "string"
            }
          },
          data: {
            PATH: "/abc",
            CATEGORY: "test-category",
            CONTEXT_APP_BUILD: "1.0.0",
            CONTEXT_APP_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_APP_NAMESPACE: "com.rudderlabs.javascript",
            CONTEXT_APP_VERSION: "1.0.0",
            CONTEXT_TRAITS_EMAIL: "test@rudderstack.com",
            CONTEXT_LIBRARY_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_LIBRARY_VERSION: "1.0.0",
            CONTEXT_USER_AGENT:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
            CONTEXT_LOCALE: "en-US",
            CONTEXT_SCREEN_DENSITY: 2,
            CONTEXT_IP: "0.0.0.0",
            CONTEXT_REQUEST_IP: "[::1]:53708",
            CONTEXT_PASSED_IP: "0.0.0.0",
            ID: "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
            ANONYMOUS_ID: "00000000000000000000000000",
            USER_ID: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            SENT_AT: "2019-10-14T11:15:53.296Z",
            ORIGINAL_TIMESTAMP: "2019-10-14T11:15:18.299Z",
            RECEIVED_AT: "2020-01-24T06:29:02.403Z",
            TIMESTAMP: "2020-01-24T06:29:02.402Z",
            CHANNEL: "web",
            NAME: "ApplicationLoaded"
          }
        }
      ],
      s3_datalake: [
        {
          metadata: {
            table: "screens",
            columns: {
              uuid_ts: "datetime",
              path: "string",
              category: "string",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_traits_email: "string",
              context_library_name: "string",
              context_library_version: "string",
              context_user_agent: "string",
              context_locale: "string",
              context_screen_density: "int",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              sent_at: "datetime",
              original_timestamp: "datetime",
              received_at: "datetime",
              _timestamp: "datetime",
              channel: "string",
              name: "string"
            }
          },
          data: {
            path: "/abc",
            category: "test-category",
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.0",
            context_traits_email: "test@rudderstack.com",
            context_library_name: "RudderLabs JavaScript SDK",
            context_library_version: "1.0.0",
            context_user_agent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
            context_locale: "en-US",
            context_screen_density: 2,
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
            id: "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
            anonymous_id: "00000000000000000000000000",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            sent_at: "2019-10-14T11:15:53.296Z",
            original_timestamp: "2019-10-14T11:15:18.299Z",
            received_at: "2020-01-24T06:29:02.403Z",
            _timestamp: "2020-01-24T06:29:02.402Z",
            channel: "web",
            name: "ApplicationLoaded"
          }
        }
      ]
    }
  },
  group: {
    input: {
      message: {
        channel: "web",
        context: {
          app: {
            build: "1.0.0",
            name: "RudderLabs JavaScript SDK",
            namespace: "com.rudderlabs.javascript",
            version: "1.0.0"
          },
          traits: {
            email: "test@rudderstack.com"
          },
          library: {
            name: "RudderLabs JavaScript SDK",
            version: "1.0.0"
          },
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
          locale: "en-US",
          ip: "0.0.0.0",
          os: {
            id: "72e528f869711c3d",
            manufacturer: "Google",
            model: "sdk_gphone_x86",
            name: "generic_x86_arm",
            token: "some_device_token",
            type: "android"
          },
          screen: {
            density: 2
          }
        },
        type: "group",
        messageId: "84e26acc-56a5-4835-8233-591137fca468",
        originalTimestamp: "2019-10-14T09:03:17.562Z",
        timestamp: "2020-01-24T11:59:02.403+05:30",
        receivedAt: "2020-01-24T11:59:02.403+05:30",
        anonymousId: "00000000000000000000000000",
        userId: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
        groupId: "g1",
        integrations: {
          All: true
        },
        sentAt: "2019-10-14T09:03:22.563Z"
      },
      destination: {
        Config: {
          apiKey: "12345",
          mapToSingleEvent: false,
          trackAllPages: true,
          trackCategorisedPages: false,
          trackNamedPages: false
        },
        Enabled: true
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
            table: "groups",
            columns: {
              uuid_ts: "datetime",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_traits_email: "string",
              context_library_name: "string",
              context_library_version: "string",
              context_user_agent: "string",
              context_locale: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              context_os_id: "string",
              context_os_manufacturer: "string",
              context_os_model: "string",
              context_os_type: "string",
              context_screen_density: "int",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              group_id: "string",
              sent_at: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              timestamp: "datetime",
              channel: "string"
            }
          },
          data: {
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.0",
            context_traits_email: "test@rudderstack.com",
            context_library_name: "RudderLabs JavaScript SDK",
            context_library_version: "1.0.0",
            context_user_agent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
            context_locale: "en-US",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
            context_os_id: "72e528f869711c3d",
            context_os_manufacturer: "Google",
            context_os_model: "sdk_gphone_x86",
            context_os_name: "",
            context_os_token: "",
            context_os_type: "android",
            context_screen_density: 2,
            id: "84e26acc-56a5-4835-8233-591137fca468",
            anonymous_id: "00000000000000000000000000",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            group_id: "g1",
            sent_at: "2019-10-14T09:03:22.563Z",
            original_timestamp: "2019-10-14T09:03:17.562Z",
            timestamp: "2020-01-24T11:59:02.403Z",
            received_at: "2020-01-24T11:59:02.403Z",
            channel: "web"
          }
        }
      ],
      snowflake: [
        {
          metadata: {
            table: "GROUPS",
            columns: {
              UUID_TS: "datetime",
              CONTEXT_APP_BUILD: "string",
              CONTEXT_APP_NAME: "string",
              CONTEXT_APP_NAMESPACE: "string",
              CONTEXT_APP_VERSION: "string",
              CONTEXT_TRAITS_EMAIL: "string",
              CONTEXT_LIBRARY_NAME: "string",
              CONTEXT_LIBRARY_VERSION: "string",
              CONTEXT_USER_AGENT: "string",
              CONTEXT_LOCALE: "string",
              CONTEXT_IP: "string",
              CONTEXT_REQUEST_IP: "string",
              CONTEXT_PASSED_IP: "string",
              CONTEXT_OS_ID: "string",
              CONTEXT_OS_MANUFACTURER: "string",
              CONTEXT_OS_MODEL: "string",
              CONTEXT_OS_TYPE: "string",
              CONTEXT_SCREEN_DENSITY: "int",
              ID: "string",
              ANONYMOUS_ID: "string",
              USER_ID: "string",
              GROUP_ID: "string",
              SENT_AT: "datetime",
              RECEIVED_AT: "datetime",
              ORIGINAL_TIMESTAMP: "datetime",
              TIMESTAMP: "datetime",
              CHANNEL: "string"
            }
          },
          data: {
            CONTEXT_APP_BUILD: "1.0.0",
            CONTEXT_APP_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_APP_NAMESPACE: "com.rudderlabs.javascript",
            CONTEXT_APP_VERSION: "1.0.0",
            CONTEXT_TRAITS_EMAIL: "test@rudderstack.com",
            CONTEXT_LIBRARY_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_LIBRARY_VERSION: "1.0.0",
            CONTEXT_USER_AGENT:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
            CONTEXT_LOCALE: "en-US",
            CONTEXT_IP: "0.0.0.0",
            CONTEXT_REQUEST_IP: "[::1]:53708",
            CONTEXT_PASSED_IP: "0.0.0.0",
            CONTEXT_OS_ID: "72e528f869711c3d",
            CONTEXT_OS_MANUFACTURER: "Google",
            CONTEXT_OS_MODEL: "sdk_gphone_x86",
            CONTEXT_OS_NAME: "",
            CONTEXT_OS_TOKEN: "",
            CONTEXT_OS_TYPE: "android",
            CONTEXT_SCREEN_DENSITY: 2,
            ID: "84e26acc-56a5-4835-8233-591137fca468",
            ANONYMOUS_ID: "00000000000000000000000000",
            USER_ID: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            GROUP_ID: "g1",
            SENT_AT: "2019-10-14T09:03:22.563Z",
            ORIGINAL_TIMESTAMP: "2019-10-14T09:03:17.562Z",
            TIMESTAMP: "2020-01-24T11:59:02.403Z",
            RECEIVED_AT: "2020-01-24T11:59:02.403Z",
            CHANNEL: "web"
          }
        }
      ],
      s3_datalake: [
        {
          metadata: {
            table: "groups",
            columns: {
              uuid_ts: "datetime",
              context_app_build: "string",
              context_app_name: "string",
              context_app_namespace: "string",
              context_app_version: "string",
              context_traits_email: "string",
              context_library_name: "string",
              context_library_version: "string",
              context_user_agent: "string",
              context_locale: "string",
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              context_os_id: "string",
              context_os_manufacturer: "string",
              context_os_model: "string",
              context_os_type: "string",
              context_screen_density: "int",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              group_id: "string",
              sent_at: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              _timestamp: "datetime",
              channel: "string"
            }
          },
          data: {
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.0",
            context_traits_email: "test@rudderstack.com",
            context_library_name: "RudderLabs JavaScript SDK",
            context_library_version: "1.0.0",
            context_user_agent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
            context_locale: "en-US",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
            context_os_id: "72e528f869711c3d",
            context_os_manufacturer: "Google",
            context_os_model: "sdk_gphone_x86",
            context_os_name: "",
            context_os_token: "",
            context_os_type: "android",
            context_screen_density: 2,
            id: "84e26acc-56a5-4835-8233-591137fca468",
            anonymous_id: "00000000000000000000000000",
            user_id: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
            group_id: "g1",
            sent_at: "2019-10-14T09:03:22.563Z",
            original_timestamp: "2019-10-14T09:03:17.562Z",
            _timestamp: "2020-01-24T11:59:02.403Z",
            received_at: "2020-01-24T11:59:02.403Z",
            channel: "web"
          }
        }
      ]
    }
  },
  alias: {
    input: {
      destination: {
        Config: {
          apiKey: "dummyApiKey",
          prefixProperties: true,
          useNativeSDK: false
        },
        DestinationDefinition: {
          DisplayName: "Kiss Metrics",
          ID: "1WhbSZ6uA3H5ChVifHpfL2H6sie",
          Name: "KISSMETRICS"
        },
        Enabled: true,
        ID: "1WhcOCGgj9asZu850HvugU2C3Aq",
        Name: "Kiss Metrics",
        Transformations: []
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
        integrations: {
          All: true
        },
        messageId: "79313729-7fe5-4204-963a-dc46f4205e4e",
        originalTimestamp: "2020-01-24T06:29:02.366Z",
        previousId: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
        receivedAt: "2020-01-24T11:59:02.403+05:30",
        request_ip: "[::1]:53708",
        sentAt: "2020-01-24T06:29:02.366Z",
        timestamp: "2020-01-24T11:59:02.403+05:30",
        type: "alias",
        userId: "1234abc"
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
            table: "aliases",
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
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              sent_at: "datetime",
              timestamp: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              channel: "string",
              previous_id: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
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
            id: "79313729-7fe5-4204-963a-dc46f4205e4e",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "1234abc",
            sent_at: "2020-01-24T06:29:02.366Z",
            timestamp: "2020-01-24T06:29:02.403Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.366Z",
            channel: "web",
            previous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca"
          }
        }
      ],
      snowflake: [
        {
          metadata: {
            table: "ALIASES",
            columns: {
              UUID_TS: "datetime",
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
              CONTEXT_USER_AGENT: "string",
              CONTEXT_IP: "string",
              CONTEXT_REQUEST_IP: "string",
              CONTEXT_PASSED_IP: "string",
              ID: "string",
              ANONYMOUS_ID: "string",
              USER_ID: "string",
              SENT_AT: "datetime",
              TIMESTAMP: "datetime",
              RECEIVED_AT: "datetime",
              ORIGINAL_TIMESTAMP: "datetime",
              CHANNEL: "string",
              PREVIOUS_ID: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            CONTEXT_APP_BUILD: "1.0.0",
            CONTEXT_APP_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_APP_NAMESPACE: "com.rudderlabs.javascript",
            CONTEXT_APP_VERSION: "1.0.5",
            CONTEXT_IP: "0.0.0.0",
            CONTEXT_REQUEST_IP: "[::1]:53708",
            CONTEXT_PASSED_IP: "0.0.0.0",
            CONTEXT_LIBRARY_NAME: "RudderLabs JavaScript SDK",
            CONTEXT_LIBRARY_VERSION: "1.0.5",
            CONTEXT_LOCALE: "en-GB",
            CONTEXT_SCREEN_DENSITY: 2,
            CONTEXT_TRAITS_CITY: "Disney",
            CONTEXT_TRAITS_COUNTRY: "USA",
            CONTEXT_TRAITS_EMAIL: "mickey@disney.com",
            CONTEXT_TRAITS_FIRSTNAME: "Mickey",
            CONTEXT_USER_AGENT:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            ID: "79313729-7fe5-4204-963a-dc46f4205e4e",
            ANONYMOUS_ID: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            USER_ID: "1234abc",
            SENT_AT: "2020-01-24T06:29:02.366Z",
            TIMESTAMP: "2020-01-24T06:29:02.403Z",
            RECEIVED_AT: "2020-01-24T06:29:02.403Z",
            ORIGINAL_TIMESTAMP: "2020-01-24T06:29:02.366Z",
            CHANNEL: "web",
            PREVIOUS_ID: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca"
          }
        }
      ],
      s3_datalake: [
        {
          metadata: {
            table: "aliases",
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
              context_ip: "string",
              context_request_ip: "string",
              context_passed_ip: "string",
              id: "string",
              anonymous_id: "string",
              user_id: "string",
              sent_at: "datetime",
              _timestamp: "datetime",
              received_at: "datetime",
              original_timestamp: "datetime",
              channel: "string",
              previous_id: "string"
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            context_app_build: "1.0.0",
            context_app_name: "RudderLabs JavaScript SDK",
            context_app_namespace: "com.rudderlabs.javascript",
            context_app_version: "1.0.5",
            context_ip: "0.0.0.0",
            context_request_ip: "[::1]:53708",
            context_passed_ip: "0.0.0.0",
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
            id: "79313729-7fe5-4204-963a-dc46f4205e4e",
            anonymous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
            user_id: "1234abc",
            sent_at: "2020-01-24T06:29:02.366Z",
            _timestamp: "2020-01-24T06:29:02.403Z",
            received_at: "2020-01-24T06:29:02.403Z",
            original_timestamp: "2020-01-24T06:29:02.366Z",
            channel: "web",
            previous_id: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca"
          }
        }
      ]
    }
  },
  extract: {
    input: {
      destination: {
        Config: {
          restApiKey: "dummyApiKey",
          prefixProperties: true,
          useNativeSDK: false
        },
        DestinationDefinition: {
          DisplayName: "Braze",
          ID: "1WhbSZ6uA3H5ChVifHpfL2H6sie",
          Name: "BRAZE"
        },
        Enabled: true,
        ID: "1WhcOCGgj9asZu850HvugU2C3Aq",
        Name: "Braze",
        Transformations: []
      },
      message: {
        channel: "sources",
        context: {
          sources: {
            job_id: "2JABSy1nq89H7xeJimBL2pCtOOp",
            job_run_id: "cfd6705nsevh5p2l77ag",
            task_run_id: "cfd6705nsevh5p2l77b0",
            version: "version"
          }
        },
        properties: {
          string_property: "value1",
          date_property: "2023-02-01T07:53:31.430Z",
          boolean_property: true,
          date_property2: "2023-01-31T07:39:10.002Z",
          userId: "dummy-user-id-inside-properties"
        },
        event: "extract_event",
        recordId: "some-uuid",
        originalTimestamp: "2020-01-24T06:29:02.364Z",
        receivedAt: "2020-01-24T11:59:02.403+05:30",
        request_ip: "[::1]:53708",
        sentAt: "2020-01-24T06:29:02.364Z",
        timestamp: "2020-01-24T11:59:02.403+05:30",
        type: "extract",
        userId: "dummy-user-id-outside-properties"
      },
      request: {
        query: {
          whSchemaVersion: "v1"
        }
      },
      metadata: {
        sourceCategory: "singer-protocol",
      }
    },
    output: {
      default: [
        {
          metadata: {
            table: "extract_event",
            columns: {
              date_property: "datetime",
              date_property_2: "datetime",
              boolean_property: "boolean",
              context_sources_job_id: "string",
              context_sources_job_run_id: "string",
              context_sources_task_run_id: "string",
              context_sources_version: "string",
              event: "string",
              id: "string",
              user_id: "string",
              received_at: "datetime",
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            date_property: "2023-02-01T07:53:31.430Z",
            date_property_2: "2023-01-31T07:39:10.002Z",
            context_sources_job_id: "2JABSy1nq89H7xeJimBL2pCtOOp",
            context_sources_job_run_id: "cfd6705nsevh5p2l77ag",
            context_sources_task_run_id: "cfd6705nsevh5p2l77b0",
            context_sources_version: "version",
            id: "some-uuid",
            user_id: "dummy-user-id-inside-properties",
            received_at: "2020-01-24T06:29:02.403Z",
            event: "extract_event",
            boolean_property: true
          }
        }
      ],
      snowflake: [
        {
          metadata: {
            table: "EXTRACT_EVENT",
            columns: {
              DATE_PROPERTY: "datetime",
              DATE_PROPERTY_2: "datetime",
              CONTEXT_SOURCES_JOB_ID: "string",
              CONTEXT_SOURCES_JOB_RUN_ID: "string",
              CONTEXT_SOURCES_TASK_RUN_ID: "string",
              CONTEXT_SOURCES_VERSION: "string",
              EVENT: "string",
              ID: "string",
              USER_ID: "string",
              RECEIVED_AT: "datetime",
              BOOLEAN_PROPERTY: "boolean",
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            DATE_PROPERTY: "2023-02-01T07:53:31.430Z",
            DATE_PROPERTY_2: "2023-01-31T07:39:10.002Z",
            CONTEXT_SOURCES_JOB_ID: "2JABSy1nq89H7xeJimBL2pCtOOp",
            CONTEXT_SOURCES_JOB_RUN_ID: "cfd6705nsevh5p2l77ag",
            CONTEXT_SOURCES_TASK_RUN_ID: "cfd6705nsevh5p2l77b0",
            CONTEXT_SOURCES_VERSION: "version",
            ID: "some-uuid",
            USER_ID: "dummy-user-id-inside-properties",
            RECEIVED_AT: "2020-01-24T06:29:02.403Z",
            EVENT: "extract_event",
            BOOLEAN_PROPERTY: true,
          }
        }
      ],
      s3_datalake: [
        {
          metadata: {
            table: "extract_event",
            columns: {
              date_property: "datetime",
              date_property_2: "datetime",
              context_sources_job_id: "string",
              context_sources_job_run_id: "string",
              context_sources_task_run_id: "string",
              context_sources_version: "string",
              event: "string",
              id: "string",
              user_id: "string",
              received_at: "datetime",
              boolean_property: "boolean",
            },
            receivedAt: "2020-01-24T11:59:02.403+05:30"
          },
          data: {
            date_property: "2023-02-01T07:53:31.430Z",
            date_property_2: "2023-01-31T07:39:10.002Z",
            context_sources_job_id: "2JABSy1nq89H7xeJimBL2pCtOOp",
            context_sources_job_run_id: "cfd6705nsevh5p2l77ag",
            context_sources_task_run_id: "cfd6705nsevh5p2l77b0",
            context_sources_version: "version",
            id: "some-uuid",
            event: "extract_event",
            boolean_property: true,
            received_at: "2020-01-24T06:29:02.403Z",
            user_id: "dummy-user-id-inside-properties",
          }
        }
      ]
    }
  },
};

function input(eventType) {
  return _.cloneDeep(sampleEvents[eventType].input);
}

function output(eventType, provider) {
  if (provider === "snowflake") {
    return _.cloneDeep(sampleEvents[eventType].output.snowflake);
  }
  if (provider === "s3_datalake") {
    return _.cloneDeep(sampleEvents[eventType].output.s3_datalake);
  }
  return _.cloneDeep(sampleEvents[eventType].output.default);
}

module.exports = { input, output };
