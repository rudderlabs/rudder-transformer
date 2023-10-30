export const data = [
  {
    "name": "clevertap",
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
          "endpoint": "https://api.clevertap.com/1/upload/test1",
          "headers": {
            "X-CleverTap-Account-Id": "476550467",
            "X-CleverTap-Passcode": "fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1",
            "Content-Type": "application/json"
          },
          "body": {
            "JSON": {
              "d": [
                {
                  "type": "profile",
                  "profileData": {
                    "Email": "jamesDoe@gmail.com",
                    "Name": "James Doe",
                    "Phone": "92374162212",
                    "Gender": "M",
                    "Employed": true,
                    "DOB": "1614775793",
                    "Education": "Science",
                    "Married": "Y",
                    "Customer Type": "Prime",
                    "graduate": true,
                    "msg_push": true,
                    "msgSms": true,
                    "msgemail": true,
                    "msgwhatsapp": false,
                    "custom_tags": "[\"Test_User\",\"Interested_User\",\"DIY_Hobby\"]",
                    "custom_mappings": "{\"Office\":\"Trastkiv\",\"Country\":\"Russia\"}",
                    "address": "{\"city\":\"kolkata\",\"country\":\"India\",\"postalCode\":789223,\"state\":\"WB\",\"street\":\"\"}"
                  },
                  "identity": "anon_id"
                }
              ]
            },
            "JSON_ARRAY": {},
            "XML": {},
            "FORM": {}
          },
          "files": {},
          "params": {
            "destination": "clevertap"
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
                "status": "success",
                "processed": 1,
                "unprocessed": []
              },
              "status": 200
            }
          }
        }
      }
    }
  },
  {
    "name": "clevertap",
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
            "FORM": {},
            "JSON": {
              "d": [
                {
                  "identity": "anon-id-new",
                  "type": "event",
                  "evtName": "Web Page Viewed: Rudder",
                  "evtData": {
                    "title": "Home",
                    "path": "/"
                  }
                }
              ]
            }
          },
          "type": "REST",
          "files": {},
          "method": "POST",
          "headers": {
            "X-CleverTap-Account-Id": "fakeId123",
            "X-CleverTap-Passcode": "fakePasscode123",
            "Content-Type": "application/json"
          },
          "version": "1",
          "endpoint": "https://api.clevertap.com/1/upload/test2",
          "params": {
            "destination": "clevertap"
          }
        },
        "method": "POST"
      }
    },
    "output": {
      "response": {
        "status": 401,
        "body": {
          "output": {
            "status": 401,
            "message": "Request failed  with status: 401",
            "destinationResponse": {
              "response": {
                "status": "fail",
                "error": "Invalid Credentials",
                "code": 401
              },
              "status": 401
            },
            "statTags": {
              "destType": "CLEVERTAP",
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
    "name": "clevertap",
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
            "FORM": {},
            "JSON": {
              "d": [
                {
                  "identity": "anon-id-new",
                  "type": "event",
                  "evtData": {
                    "title": "Home",
                    "path": "/"
                  }
                }
              ]
            }
          },
          "type": "REST",
          "files": {},
          "method": "POST",
          "headers": {
            "X-CleverTap-Account-Id": "476550467",
            "X-CleverTap-Passcode": "fbee74a147828e2932c701d19dc1f2dcfa4ac0048be3aa3a88d427090a59dc1c0fa002f1",
            "Content-Type": "application/json"
          },
          "version": "1",
          "endpoint": "https://api.clevertap.com/1/upload/test3",
          "params": {
            "destination": "clevertap"
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
            "message": "Request failed  with status: 200",
            "destinationResponse": {
              "response": {
                "status": "fail",
                "processed": 0,
                "unprocessed": []
              },
              "status": 200
            },
            "statTags": {
              "destType": "CLEVERTAP",
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