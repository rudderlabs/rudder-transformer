export const data = [
  {
    "name": "marketo_static_list",
    "description": "Test 0",
    "feature": "dataDelivery",
    "module": "destination",
    "version": "v0",
    "input": {
      "request": {
        "body": {
          "type": "REST",
          "endpoint": "https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=110&id=111&id=112",
          "method": "POST",
          "userId": "",
          "headers": {
            "Authorization": "Bearer Incorrect_token",
            "Content-Type": "application/json"
          },
          "body": {
            "FORM": {},
            "JSON": {},
            "JSON_ARRAY": {},
            "XML": {}
          },
          "files": {},
          "params": {
            "destination": "marketo_static_list"
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
            "message": "Request Processed Successfully",
            "destinationResponse": {
              "response": {
                "requestId": "b6d1#18a8d2c10e7",
                "result": [
                  {
                    "id": 110,
                    "status": "skipped",
                    "reasons": [
                      {
                        "code": "1015",
                        "message": "Lead not in list"
                      }
                    ]
                  },
                  {
                    "id": 111,
                    "status": "removed"
                  },
                  {
                    "id": 112,
                    "status": "removed"
                  }
                ],
                "success": true
              },
              "status": 200
            },
            "status": 200
          }
        }
      }
    }
  },
  {
    "name": "marketo_static_list",
    "description": "Test 1",
    "feature": "dataDelivery",
    "module": "destination",
    "version": "v0",
    "input": {
      "request": {
        "body": {
          "type": "REST",
          "endpoint": "https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=1&id=2&id=3",
          "method": "POST",
          "userId": "",
          "headers": {
            "Authorization": "Bearer Incorrect_token",
            "Content-Type": "application/json"
          },
          "body": {
            "FORM": {},
            "JSON": {},
            "JSON_ARRAY": {},
            "XML": {}
          },
          "files": {},
          "params": {
            "destination": "marketo_static_list"
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
            "message": "Request Failed for Marketo Static List, Access token invalid (Retryable).during Marketo Static List Response Handling",
            "destinationResponse": {
              "response": {
                "requestId": "68d8#1846058ee27",
                "success": false,
                "errors": [
                  {
                    "code": "601",
                    "message": "Access token invalid"
                  }
                ]
              },
              "status": 200
            },
            "statTags": {
              "destType": "MARKETO_STATIC_LIST",
              "errorCategory": "network",
              "destinationId": "Non-determininable",
              "workspaceId": "Non-determininable",
              "errorType": "retryable",
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
    "name": "marketo_static_list",
    "description": "Test 2",
    "feature": "dataDelivery",
    "module": "destination",
    "version": "v0",
    "input": {
      "request": {
        "body": {
          "type": "REST",
          "endpoint": "https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=1&id=2",
          "method": "POST",
          "userId": "",
          "headers": {
            "Authorization": "Bearer token",
            "Content-Type": "application/json"
          },
          "body": {
            "FORM": {},
            "JSON": {
              "action": "createOrUpdate",
              "input": [
                {
                  "City": "Tokyo",
                  "Country": "JP",
                  "Email": "gabi29@gmail.com",
                  "PostalCode": "100-0001",
                  "Title": "Owner",
                  "id": 1328328,
                  "userId": "gabi_userId_45"
                }
              ],
              "lookupField": "id"
            },
            "JSON_ARRAY": {},
            "XML": {}
          },
          "files": {},
          "params": {
            "destination": "marketo_static_list"
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
                "requestId": "12d3c#1846057dce2",
                "success": true,
                "result": [
                  {
                    "id": 1,
                    "status": "added"
                  },
                  {
                    "id": 2,
                    "status": "added"
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
    "name": "marketo_static_list",
    "description": "Test 3",
    "feature": "dataDelivery",
    "module": "destination",
    "version": "v0",
    "input": {
      "request": {
        "body": {
          "type": "REST",
          "endpoint": "https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=3&id=4",
          "method": "POST",
          "userId": "",
          "headers": {
            "Authorization": "Bearer token",
            "Content-Type": "application/json"
          },
          "params": {},
          "body": {
            "FORM": {},
            "JSON": {
              "action": "createOrUpdate",
              "input": [
                {
                  "City": "Tokyo",
                  "Country": "JP",
                  "Email": "gabi29@gmail.com",
                  "PostalCode": "100-0001",
                  "Title": "Owner",
                  "id": 1328328,
                  "userId": "gabi_userId_45"
                },
                {
                  "City": "Tokyo",
                  "Country": "JP",
                  "Email": "b@s.com",
                  "PostalCode": "100-0001",
                  "Title": "Owner",
                  "id": 1328329,
                  "userId": "ben_userId_45"
                }
              ],
              "lookupField": "id"
            },
            "JSON_ARRAY": {},
            "XML": {}
          },
          "files": {}
        },
        "method": "POST"
      }
    },
    "output": {
      "response": {
        "status": 400,
        "body": {
          "output": {
            "destinationResponse": "",
            "message": "Request failed during: during Marketo Static List Response Handling, error: [{\"code\":\"1004\",\"message\":\"Lead not found\"}]",
            "statTags": {
              "destType": "MARKETO_STATIC_LIST",
              "errorCategory": "dataValidation",
              "destinationId": "Non-determininable",
              "workspaceId": "Non-determininable",
              "errorType": "instrumentation",
              "feature": "dataDelivery",
              "implementation": "native",
              "module": "destination"
            },
            "status": 400
          }
        }
      }
    }
  },
  {
    "name": "marketo_static_list",
    "description": "Test 4",
    "feature": "dataDelivery",
    "module": "destination",
    "version": "v0",
    "input": {
      "request": {
        "body": {
          "type": "REST",
          "endpoint": "https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=5&id=6",
          "method": "POST",
          "userId": "",
          "headers": {
            "Authorization": "Bearer token",
            "Content-Type": "application/json"
          },
          "params": {},
          "body": {
            "FORM": {},
            "JSON": {
              "action": "createOrUpdate",
              "input": [
                {
                  "City": "Tokyo",
                  "Country": "JP",
                  "Email": "gabi29@gmail.com",
                  "PostalCode": "100-0001",
                  "Title": "Owner",
                  "id": 1328328,
                  "userId": "gabi_userId_45"
                },
                {
                  "City": "Tokyo",
                  "Country": "JP",
                  "Email": "b@s.com",
                  "PostalCode": "100-0001",
                  "Title": "Owner",
                  "id": 1328329,
                  "userId": "ben_userId_45"
                }
              ],
              "lookupField": "id"
            },
            "JSON_ARRAY": {},
            "XML": {}
          },
          "files": {}
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
                "requestId": "12d3c#1846057dce2",
                "result": {
                  "id": 5,
                  "status": "skipped",
                  "reasons": [
                    {
                      "code": "1015",
                      "message": "Lead not in list"
                    }
                  ]
                },
                "success": true
              },
              "status": 200
            }
          }
        }
      }
    }
  }
]