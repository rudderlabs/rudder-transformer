export const data = [
  {
    "name": "snapchat_custom_audience",
    "description": "Test 0",
    "feature": "dataDelivery",
    "module": "destination",
    "version": "v0",
    "input": {
      "request": {
        "body": {
          "version": "1",
          "type": "REST",
          "method": "POST",
          "endpoint": "https://adsapi.snapchat.com/v1/segments/123/users",
          "headers": {
            "Authorization": "Bearer abcd123",
            "Content-Type": "application/json"
          },
          "body": {
            "JSON": {
              "users": [
                {
                  "schema": [
                    "EMAIL_SHA256"
                  ],
                  "data": [
                    [
                      "938758751f5af66652a118e26503af824404bc13acd1cb7642ddff99916f0e1c"
                    ]
                  ]
                }
              ]
            },
            "JSON_ARRAY": {},
            "XML": {},
            "FORM": {}
          },
          "files": {},
          "params": {
            "destination": "snapchat_custom_audience"
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
              "response": {
                "request_status": "SUCCESS",
                "request_id": "12345",
                "users": [
                  {
                    "sub_request_status": "SUCCESS",
                    "user": {
                      "number_uploaded_users": 1
                    }
                  }
                ]
              },
              "status": 200
            }
          }
        }
      }
    }
  },
  {
    "name": "snapchat_custom_audience",
    "description": "Test 1",
    "feature": "dataDelivery",
    "module": "destination",
    "version": "v0",
    "input": {
      "request": {
        "body": {
          "version": "1",
          "type": "REST",
          "method": "POST",
          "endpoint": "https://adsapi.snapchat.com/v1/segments/456/users",
          "headers": {
            "Authorization": "Bearer abcd123",
            "Content-Type": "application/json"
          },
          "body": {
            "JSON": {
              "users": [
                {
                  "schema": [
                    "EMAIL_SHA256"
                  ],
                  "data": [
                    [
                      "938758751f5af66652a118e26503af824404bc13acd1cb7642ddff99916f0e1c"
                    ]
                  ]
                }
              ]
            },
            "JSON_ARRAY": {},
            "XML": {},
            "FORM": {}
          },
          "files": {},
          "params": {
            "destination": "snapchat_custom_audience"
          }
        },
        "method": "POST"
      }
    },
    "output": {
      "response": {
        "status": 500,
        "body": {
          "output": {
            "status": 500,
            "destinationResponse": {
              "response": "unauthorized",
              "status": 401
            },
            "message": "Failed with unauthorized during snapchat_custom_audience response transformation",
            "statTags": {
              "destType": "SNAPCHAT_CUSTOM_AUDIENCE",
              "errorCategory": "network",
              "destinationId": "Non-determininable",
              "workspaceId": "Non-determininable",
              "errorType": "retryable",
              "feature": "dataDelivery",
              "implementation": "native",
              "module": "destination"
            },
            "authErrorCategory": "REFRESH_TOKEN"
          }
        }
      }
    }
  },
  {
    "name": "snapchat_custom_audience",
    "description": "Test 2",
    "feature": "dataDelivery",
    "module": "destination",
    "version": "v0",
    "input": {
      "request": {
        "body": {
          "version": "1",
          "type": "REST",
          "method": "DELETE",
          "endpoint": "https://adsapi.snapchat.com/v1/segments/789/users",
          "headers": {
            "Authorization": "Bearer abcd123",
            "Content-Type": "application/json"
          },
          "body": {
            "JSON": {
              "users": [
                {
                  "id": "123456",
                  "schema": [
                    "EMAIL_SHA256"
                  ],
                  "data": [
                    [
                      "938758751f5af66652a118e26503af824404bc13acd1cb7642ddff99916f0e1c"
                    ]
                  ]
                }
              ]
            },
            "JSON_ARRAY": {},
            "XML": {},
            "FORM": {}
          },
          "files": {},
          "params": {
            "destination": "snapchat_custom_audience"
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
            "authErrorCategory": "AUTH_STATUS_INACTIVE",
            "status": 400,
            "destinationResponse": {
              "response": {
                "request_status": "ERROR",
                "request_id": "98e2a602-3cf4-4596-a8f9-7f034161f89a",
                "debug_message": "Caller does not have permission",
                "display_message": "We're sorry, but the requested resource is not available at this time",
                "error_code": "E3002"
              },
              "status": 403
            },
            "message": "undefined during snapchat_custom_audience response transformation",
            "statTags": {
              "destType": "SNAPCHAT_CUSTOM_AUDIENCE",
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