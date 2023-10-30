export const data = [
  {
    "name": "fb",
    "description": "Test 0",
    "feature": "dataDelivery",
    "module": "destination",
    "version": "v0",
    "input": {
      "request": {
        "body": {
          "body": {
            "XML": {},
            "JSON_ARRAY": {},
            "FORM": {
              "event": "CUSTOM_APP_EVENTS",
              "advertiser_id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
              "ud[em]": "48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08",
              "ud[fn]": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
              "ud[ge]": "62c66a7a5dd70c3146618063c344e531e6d4b59e379808443ce962b3abd63c5a",
              "ud[ln]": "3547cb112ac4489af2310c0626cdba6f3097a2ad5a3b42ddd3b59c76c7a079a3",
              "ud[ph]": "588211a01b10feacbf7988d97a06e86c18af5259a7f457fd8759b7f7409a7d1f",
              "extinfo": "[\"a2\",\"\",\"\",\"\",\"8.1.0\",\"Redmi 6\",\"\",\"\",\"Banglalink\",640,480,\"1.23\",0,0,0,\"Europe/Berlin\"]",
              "app_user_id": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
              "custom_events": "[{\"_logTime\":1567333011693,\"_eventName\":\"spin_result\",\"_valueToSum\":400,\"fb_currency\":\"GBP\",\"additional_bet_index\":0,\"battle_id\":\"N/A\",\"bet_amount\":9,\"bet_level\":1,\"bet_multiplier\":1,\"coin_balance\":9466052,\"current_module_name\":\"CasinoGameModule\",\"days_in_game\":0,\"extra_param\":\"N/A\",\"fb_profile\":\"0\",\"featureGameType\":\"N/A\",\"game_fps\":30,\"game_id\":\"fireEagleBase\",\"game_name\":\"FireEagleSlots\",\"gem_balance\":0,\"graphicsQuality\":\"HD\",\"idfa\":\"2bf99787-33d2-4ae2-a76a-c49672f97252\",\"internetReachability\":\"ReachableViaLocalAreaNetwork\",\"isLowEndDevice\":\"False\",\"is_auto_spin\":\"False\",\"is_turbo\":\"False\",\"isf\":\"False\",\"ishighroller\":\"False\",\"jackpot_win_amount\":90,\"jackpot_win_type\":\"Silver\",\"level\":6,\"lifetime_gem_balance\":0,\"no_of_spin\":1,\"player_total_battles\":0,\"player_total_shields\":0,\"start_date\":\"2019-08-01\",\"total_payments\":0,\"tournament_id\":\"T1561970819\",\"userId\":\"c82cbdff-e5be-4009-ac78-cdeea09ab4b1\",\"versionSessionCount\":2,\"win_amount\":0,\"fb_content_id\":[\"123\",\"345\",\"567\"]}]",
              "advertiser_tracking_enabled": "0",
              "application_tracking_enabled": "0"
            },
            "JSON": {}
          },
          "endpoint": "https://graph.facebook.com/v17.0/RudderFbApp/activities?access_token=invalid_access_token",
          "files": {},
          "headers": {
            "x-forwarded-for": "1.2.3.4"
          },
          "method": "POST",
          "statusCode": 200,
          "type": "REST",
          "userId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
          "version": "1",
          "params": {
            "destination": "fb"
          }
        },
        "method": "POST"
      }
    },
    "output": {
      "response": {
        "status": 400,
        "body": {
          "output": {
            "status": 400,
            "message": "Invalid OAuth 2.0 access token",
            "destinationResponse": {
              "error": {
                "message": "The access token could not be decrypted",
                "type": "OAuthException",
                "code": 190,
                "fbtrace_id": "fbpixel_trace_id"
              },
              "status": 500
            },
            "statTags": {
              "destType": "FB",
              "errorCategory": "network",
              "destinationId": "Non-determininable",
              "workspaceId": "Non-determininable",
              "errorType": "aborted",
              "feature": "dataDelivery",
              "implementation": "native",
              "module": "destination"
            }
          }
        }
      }
    }
  },
  {
    "name": "fb",
    "description": "Test 1",
    "feature": "dataDelivery",
    "module": "destination",
    "version": "v0",
    "input": {
      "request": {
        "body": {
          "body": {
            "XML": {},
            "JSON_ARRAY": {},
            "FORM": {
              "event": "CUSTOM_APP_EVENTS",
              "advertiser_id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
              "ud[em]": "48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08",
              "ud[fn]": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
              "ud[ge]": "62c66a7a5dd70c3146618063c344e531e6d4b59e379808443ce962b3abd63c5a",
              "ud[ln]": "3547cb112ac4489af2310c0626cdba6f3097a2ad5a3b42ddd3b59c76c7a079a3",
              "ud[ph]": "588211a01b10feacbf7988d97a06e86c18af5259a7f457fd8759b7f7409a7d1f",
              "extinfo": "[\"a2\",\"\",\"\",\"\",\"8.1.0\",\"Redmi 6\",\"\",\"\",\"Banglalink\",640,480,\"1.23\",0,0,0,\"Europe/Berlin\"]",
              "app_user_id": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
              "custom_events": "[{\"_logTime\":1567333011693,\"_eventName\":\"spin_result\",\"_valueToSum\":400,\"fb_currency\":\"GBP\",\"additional_bet_index\":0,\"battle_id\":\"N/A\",\"bet_amount\":9,\"bet_level\":1,\"bet_multiplier\":1,\"coin_balance\":9466052,\"current_module_name\":\"CasinoGameModule\",\"days_in_game\":0,\"extra_param\":\"N/A\",\"fb_profile\":\"0\",\"featureGameType\":\"N/A\",\"game_fps\":30,\"game_id\":\"fireEagleBase\",\"game_name\":\"FireEagleSlots\",\"gem_balance\":0,\"graphicsQuality\":\"HD\",\"idfa\":\"2bf99787-33d2-4ae2-a76a-c49672f97252\",\"internetReachability\":\"ReachableViaLocalAreaNetwork\",\"isLowEndDevice\":\"False\",\"is_auto_spin\":\"False\",\"is_turbo\":\"False\",\"isf\":\"False\",\"ishighroller\":\"False\",\"jackpot_win_amount\":90,\"jackpot_win_type\":\"Silver\",\"level\":6,\"lifetime_gem_balance\":0,\"no_of_spin\":1,\"player_total_battles\":0,\"player_total_shields\":0,\"start_date\":\"2019-08-01\",\"total_payments\":0,\"tournament_id\":\"T1561970819\",\"userId\":\"c82cbdff-e5be-4009-ac78-cdeea09ab4b1\",\"versionSessionCount\":2,\"win_amount\":0,\"fb_content_id\":[\"123\",\"345\",\"567\"]}]",
              "advertiser_tracking_enabled": "0",
              "application_tracking_enabled": "0"
            },
            "JSON": {}
          },
          "endpoint": "https://graph.facebook.com/v17.0/RudderFbApp/activities?access_token=my_access_token",
          "files": {},
          "headers": {
            "x-forwarded-for": "1.2.3.4"
          },
          "method": "POST",
          "statusCode": 200,
          "type": "REST",
          "userId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
          "version": "1",
          "params": {
            "destination": "fb"
          }
        },
        "method": "POST"
      }
    },
    "output": {
      "response": {
        "status": 200,
        "body": {
          "output": {
            "status": 200,
            "message": "Request Processed Successfully",
            "destinationResponse": {
              "events_received": 1,
              "fbtrace_id": "facebook_trace_id"
            }
          }
        }
      }
    }
  },

  {
    "name": "fb",
    "description": "Test 2",
    "feature": "dataDelivery",
    "module": "destination",
    "version": "v0",
    "input": {
      "request": {
        "body": {
          "body": {
            "XML": {},
            "JSON_ARRAY": {},
            "FORM": {
              "event": "CUSTOM_APP_EVENTS",
              "advertiser_id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
              "ud[em]": "48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08",
              "ud[fn]": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
              "ud[ge]": "62c66a7a5dd70c3146618063c344e531e6d4b59e379808443ce962b3abd63c5a",
              "ud[ln]": "3547cb112ac4489af2310c0626cdba6f3097a2ad5a3b42ddd3b59c76c7a079a3",
              "ud[ph]": "588211a01b10feacbf7988d97a06e86c18af5259a7f457fd8759b7f7409a7d1f",
              "extinfo": "[\"a2\",\"\",\"\",\"\",\"8.1.0\",\"Redmi 6\",\"\",\"\",\"Banglalink\",640,480,\"1.23\",0,0,0,\"Europe/Berlin\"]",
              "app_user_id": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
              "custom_events": "[{\"_logTime\":1567333011693,\"_eventName\":\"spin_result\",\"_valueToSum\":400,\"fb_currency\":\"GBP\",\"additional_bet_index\":0,\"battle_id\":\"N/A\",\"bet_amount\":9,\"bet_level\":1,\"bet_multiplier\":1,\"coin_balance\":9466052,\"current_module_name\":\"CasinoGameModule\",\"days_in_game\":0,\"extra_param\":\"N/A\",\"fb_profile\":\"0\",\"featureGameType\":\"N/A\",\"game_fps\":30,\"game_id\":\"fireEagleBase\",\"game_name\":\"FireEagleSlots\",\"gem_balance\":0,\"graphicsQuality\":\"HD\",\"idfa\":\"2bf99787-33d2-4ae2-a76a-c49672f97252\",\"internetReachability\":\"ReachableViaLocalAreaNetwork\",\"isLowEndDevice\":\"False\",\"is_auto_spin\":\"False\",\"is_turbo\":\"False\",\"isf\":\"False\",\"ishighroller\":\"False\",\"jackpot_win_amount\":90,\"jackpot_win_type\":\"Silver\",\"level\":6,\"lifetime_gem_balance\":0,\"no_of_spin\":1,\"player_total_battles\":0,\"player_total_shields\":0,\"start_date\":\"2019-08-01\",\"total_payments\":0,\"tournament_id\":\"T1561970819\",\"userId\":\"c82cbdff-e5be-4009-ac78-cdeea09ab4b1\",\"versionSessionCount\":2,\"win_amount\":0,\"fb_content_id\":[\"123\",\"345\",\"567\"]}]",
              "advertiser_tracking_enabled": "0",
              "application_tracking_enabled": "0"
            },
            "JSON": {}
          },
          "endpoint": "https://graph.facebook.com/v17.0/1234567891234567/events?access_token=invalid_timestamp_correct_access_token",
          "files": {},
          "headers": {
            "x-forwarded-for": "1.2.3.4"
          },
          "method": "POST",
          "statusCode": 200,
          "type": "REST",
          "userId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
          "version": "1",
          "params": {
            "destination": "fb"
          }
        },
        "method": "POST"
      }
    },
    "output": {
      "response": {
        "status": 400,
        "body": {
          "output": {
            "status": 400,
            "message": "Event Timestamp Too Old",
            "destinationResponse": {
              "error": {
                "message": "Invalid parameter",
                "type": "OAuthException",
                "code": 100,
                "error_subcode": 2804003,
                "is_transient": false,
                "error_user_title": "Event Timestamp Too Old",
                "error_user_msg": "The timestamp for this event is too far in the past. Events need to be sent from your server within 7 days of when they occurred. Enter a timestamp that has occurred within the last 7 days.",
                "fbtrace_id": "A6UyEgg_HdoiRX9duxcBOjb"
              },
              "status": 400
            },
            "statTags": {
              "destType": "FB",
              "errorCategory": "network",
              "destinationId": "Non-determininable",
              "workspaceId": "Non-determininable",
              "errorType": "aborted",
              "feature": "dataDelivery",
              "implementation": "native",
              "module": "destination"
            }
          }
        }
      }
    }
  },
  {
    "name": "fb",
    "description": "Test 3",
    "feature": "dataDelivery",
    "module": "destination",
    "version": "v0",
    "input": {
      "request": {
        "body": {
          "version": "1",
          "type": "REST",
          "method": "POST",
          "endpoint": "https://graph.facebook.com/v17.0/1234567891234567/events?access_token=throttled_valid_access_token",
          "headers": {},
          "body": {
            "JSON": {},
            "XML": {},
            "JSON_ARRAY": {},
            "FORM": {
              "extinfo": "[\"a2\",\"\",\"\",\"\",\"8.1.0\",\"Redmi 6\",\"\",\"\",\"Banglalink\",0,100,\"50.00\",0,0,0,\"\"]",
              "custom_events": "[{\"_logTime\":1567333011693,\"_eventName\":\"Viewed Screen\",\"fb_description\":\"Main.1233\"}]",
              "ud[em]": "48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08",
              "advertiser_tracking_enabled": "0",
              "application_tracking_enabled": "0",
              "event": "CUSTOM_APP_EVENTS"
            }
          },
          "files": {},
          "userId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
          "statusCode": 200,
          "params": {
            "destination": "fb"
          }
        },
        "method": "POST"
      }
    },
    "output": {
      "response": {
        "status": 429,
        "body": {
          "output": {
            "status": 429,
            "message": "API User Too Many Calls",
            "destinationResponse": {
              "error": {
                "message": "User request limit reached",
                "type": "OAuthException",
                "code": 17,
                "fbtrace_id": "facebook_px_trace_id_4"
              },
              "status": 500
            },
            "statTags": {
              "destType": "FB",
              "errorCategory": "network",
              "destinationId": "Non-determininable",
              "workspaceId": "Non-determininable",
              "errorType": "throttled",
              "feature": "dataDelivery",
              "implementation": "native",
              "module": "destination"
            }
          }
        }
      }
    }
  },
  {
    "name": "fb",
    "description": "Test 4",
    "feature": "dataDelivery",
    "module": "destination",
    "version": "v0",
    "input": {
      "request": {
        "body": {
          "version": "1",
          "type": "REST",
          "method": "POST",
          "endpoint": "https://graph.facebook.com/v17.0/1234567891234567/events?access_token=invalid_account_id_valid_access_token",
          "headers": {},
          "body": {
            "JSON": {},
            "XML": {},
            "JSON_ARRAY": {},
            "FORM": {
              "extinfo": "[\"a2\",\"\",\"\",\"\",\"8.1.0\",\"Redmi 6\",\"\",\"\",\"Banglalink\",0,100,\"50.00\",0,0,0,\"\"]",
              "custom_events": "[{\"_logTime\":1567333011693,\"_eventName\":\"Viewed Screen\",\"fb_description\":\"Main.1233\"}]",
              "ud[em]": "48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08",
              "advertiser_tracking_enabled": "0",
              "application_tracking_enabled": "0",
              "event": "CUSTOM_APP_EVENTS"
            }
          },
          "files": {},
          "userId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
          "statusCode": 200,
          "params": {
            "destination": "fb"
          }
        },
        "method": "POST"
      }
    },
    "output": {
      "response": {
        "status": 400,
        "body": {
          "output": {
            "status": 400,
            "message": "Object with ID 'PIXEL_ID' / 'DATASET_ID' / 'AUDIENCE_ID' does not exist, cannot be loaded due to missing permissions, or does not support this operation",
            "destinationResponse": {
              "error": {
                "message": "Unsupported post request. Object with ID '1234567891234569' does not exist, cannot be loaded due to missing permissions, or does not support this operation. Please read the Graph API documentation at https://developers.facebook.com/docs/graph-api",
                "type": "GraphMethodException",
                "code": 100,
                "error_subcode": 33,
                "fbtrace_id": "facebook_px_trace_id_5"
              },
              "status": 400
            },
            "statTags": {
              "destType": "FB",
              "errorCategory": "network",
              "destinationId": "Non-determininable",
              "workspaceId": "Non-determininable",
              "errorType": "aborted",
              "feature": "dataDelivery",
              "implementation": "native",
              "module": "destination"
            }
          }
        }
      }
    }
  }
]