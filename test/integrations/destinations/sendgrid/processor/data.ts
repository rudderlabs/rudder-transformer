export const data = [
    {
        "name": "sendgrid",
        "description": "Identify call without an email",
        "feature": "processor",
        "module": "destination",
        "version": "v0",
        "input": {
            "request": {
                "body": [
                    {
                        "destination": {
                            "Config": {
                                "IPPoolName": "",
                                "apiKey": "apikey",
                                "attachments": [
                                    {
                                        "content": "",
                                        "contentId": "",
                                        "disposition": "",
                                        "filename": "",
                                        "type": ""
                                    }
                                ],
                                "clickTracking": true,
                                "clickTrackingEnableText": true,
                                "contents": [
                                    {
                                        "type": "text/html",
                                        "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                    }
                                ],
                                "eventDelivery": false,
                                "eventDeliveryTS": 1668424218224,
                                "eventNamesSettings": [
                                    {
                                        "event": "open"
                                    }
                                ],
                                "footer": false,
                                "fromEmail": "a@g.com",
                                "fromName": "",
                                "ganalytics": false,
                                "group": "",
                                "groupsToDisplay": [
                                    {
                                        "groupId": ""
                                    }
                                ],
                                "html": "",
                                "listId": "list111",
                                "mailFromTraits": false,
                                "openTracking": false,
                                "openTrackingSubstitutionTag": "",
                                "replyToEmail": "",
                                "replyToName": "",
                                "sandboxMode": false,
                                "subject": "hello there from webflow",
                                "subscriptionTracking": false,
                                "substitutionTag": "",
                                "templateId": "",
                                "text": ""
                            }
                        },
                        "message": {
                            "type": "identify",
                            "userId": "user@1",
                            "context": {
                                "traits": {
                                    "age": "25",
                                    "city": "Surat",
                                    "phone": "+91 9876543210",
                                    "lastName": "test",
                                    "firstName": "rudder",
                                    "state": "Gujarat"
                                }
                            }
                        }
                    }
                ]
            }
        },
        "output": {
            "response": {
                "status": 200,
                "body": [
                    {
                        "statusCode": 400,
                        "error": "Parameter mail is required",
                        "statTags": {
                            "errorCategory": "dataValidation",
                            "errorType": "instrumentation",
                            "destType": "SENDGRID",
                            "module": "destination",
                            "implementation": "native",
                            "feature": "processor"
                        }
                    }
                ]
            }
        }
    },
    {
        "name": "sendgrid",
        "description": "Identify call with list_id configured from web-app",
        "feature": "processor",
        "module": "destination",
        "version": "v0",
        "input": {
            "request": {
                "body": [
                    {
                        "destination": {
                            "Config": {
                                "IPPoolName": "",
                                "apiKey": "apikey",
                                "attachments": [
                                    {
                                        "content": "",
                                        "contentId": "",
                                        "disposition": "",
                                        "filename": "",
                                        "type": ""
                                    }
                                ],
                                "clickTracking": true,
                                "clickTrackingEnableText": true,
                                "contents": [
                                    {
                                        "type": "text/html",
                                        "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                    }
                                ],
                                "eventDelivery": false,
                                "eventDeliveryTS": 1668424218224,
                                "eventNamesSettings": [
                                    {
                                        "event": "open"
                                    }
                                ],
                                "footer": false,
                                "fromEmail": "a@g.com",
                                "fromName": "",
                                "ganalytics": false,
                                "group": "",
                                "groupsToDisplay": [
                                    {
                                        "groupId": ""
                                    }
                                ],
                                "html": "",
                                "listId": "list111",
                                "mailFromTraits": false,
                                "openTracking": false,
                                "openTrackingSubstitutionTag": "",
                                "replyToEmail": "",
                                "replyToName": "",
                                "sandboxMode": false,
                                "subject": "hello there from webflow",
                                "subscriptionTracking": false,
                                "substitutionTag": "",
                                "templateId": "",
                                "text": ""
                            }
                        },
                        "message": {
                            "type": "identify",
                            "userId": "user@1",
                            "context": {
                                "traits": {
                                    "age": "25",
                                    "city": "Surat",
                                    "email": "test@rudderstack.com",
                                    "phone": "+91 9876543210",
                                    "lastName": "test",
                                    "firstName": "rudder",
                                    "state": "Gujarat"
                                }
                            }
                        }
                    }
                ]
            }
        },
        "output": {
            "response": {
                "status": 200,
                "body": [
                    {
                        "output": {
                            "version": "1",
                            "type": "REST",
                            "method": "PUT",
                            "endpoint": "https://api.sendgrid.com/v3/marketing/contacts",
                            "headers": {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer apikey"
                            },
                            "params": {},
                            "body": {
                                "JSON": {
                                    "contactDetails": {
                                        "email": "test@rudderstack.com",
                                        "phone_number": "+91 9876543210",
                                        "first_name": "rudder",
                                        "last_name": "test",
                                        "custom_fields": {}
                                    },
                                    "contactListIds": "list111"
                                },
                                "JSON_ARRAY": {},
                                "XML": {},
                                "FORM": {}
                            },
                            "files": {},
                            "userId": ""
                        },
                        "statusCode": 200
                    }
                ]
            }
        }
    },
    {
        "name": "sendgrid",
        "description": "Identify call with no list-id given",
        "feature": "processor",
        "module": "destination",
        "version": "v0",
        "input": {
            "request": {
                "body": [
                    {
                        "destination": {
                            "ID": "2HOQOO6wWKaKjeQrEABXgiH6cmU",
                            "Config": {
                                "IPPoolName": "",
                                "apiKey": "apikey",
                                "attachments": [
                                    {
                                        "content": "",
                                        "contentId": "",
                                        "disposition": "",
                                        "filename": "",
                                        "type": ""
                                    }
                                ],
                                "clickTracking": true,
                                "clickTrackingEnableText": true,
                                "contents": [
                                    {
                                        "type": "text/html",
                                        "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                    }
                                ],
                                "customFieldsMapping": [
                                    {
                                        "from": "name",
                                        "to": "user_name"
                                    }
                                ],
                                "eventDelivery": false,
                                "eventDeliveryTS": 1668424218224,
                                "eventNamesSettings": [
                                    {
                                        "event": "open"
                                    }
                                ],
                                "footer": false,
                                "fromEmail": "a@g.com",
                                "fromName": "",
                                "ganalytics": false,
                                "group": "",
                                "groupsToDisplay": [
                                    {
                                        "groupId": ""
                                    }
                                ],
                                "html": "",
                                "mailFromTraits": false,
                                "openTracking": false,
                                "openTrackingSubstitutionTag": "",
                                "replyToEmail": "",
                                "replyToName": "",
                                "sandboxMode": false,
                                "subject": "hello there from webflow",
                                "subscriptionTracking": false,
                                "substitutionTag": "",
                                "templateId": "",
                                "text": ""
                            }
                        },
                        "message": {
                            "type": "identify",
                            "userId": "user@1",
                            "context": {
                                "traits": {
                                    "age": "25",
                                    "city": "Surat",
                                    "name": "rudder test",
                                    "email": "test@rudderstack.com",
                                    "phone": "+91 9876543210",
                                    "lastName": "test",
                                    "firstName": "rudder",
                                    "state": "Gujarat"
                                }
                            }
                        }
                    }
                ]
            }
        },
        "output": {
            "response": {
                "status": 200,
                "body": [{
                    "output": {
                        "body": {
                            "XML": {},
                            "FORM": {},
                            "JSON": {
                                "contactDetails": {
                                    "email": "test@rudderstack.com",
                                    "last_name": "test",
                                    "first_name": "rudder",
                                    "unique_name": "rudder test",
                                    "phone_number": "+91 9876543210",
                                    "custom_fields": {
                                        "w1_T": "rudder test"
                                    }
                                },
                                "contactListIds": ""
                            },
                            "JSON_ARRAY": {}
                        },
                        "type": "REST",
                        "userId": "",
                        "files": {},
                        "method": "PUT",
                        "params": {},
                        "headers": {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer apikey"
                        },
                        "version": "1",
                        "endpoint": "https://api.sendgrid.com/v3/marketing/contacts"
                    },
                    "statusCode": 200
                }

                ]
            }
        }
    },
    {
        "name": "sendgrid",
        "description": "Track Call",
        "feature": "processor",
        "module": "destination",
        "version": "v0",
        "input": {
            "request": {
                "body": [
                    {
                        "destination": {
                            "Config": {
                                "apiKey": "apikey",
                                "eventNamesSettings": [
                                    {
                                        "event": "testing"
                                    },
                                    {
                                        "event": "clicked"
                                    }
                                ],
                                "subject": "A sample subject",
                                "replyToEmail": "ankit@rudderstack.com",
                                "contents": [
                                    {
                                        "type": "text/html",
                                        "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                    }
                                ],
                                "footer": false,
                                "bypassListManagement": false,
                                "sandboxMode": false,
                                "clickTracking": false,
                                "openTracking": false,
                                "ganalytics": false,
                                "subscriptionTracking": false,
                                "clickTrackingEnableText": false,
                                "text": null,
                                "utmContent": null
                            }
                        },
                        "message": {
                            "channel": "web",
                            "context": {
                                "app": {
                                    "build": "1.0.0",
                                    "name": "RudderLabs JavaScript SDK",
                                    "namespace": "com.rudderlabs.javascript",
                                    "version": "1.0.0"
                                },
                                "library": {
                                    "name": "RudderLabs JavaScript SDK",
                                    "version": "1.0.0"
                                },
                                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                "locale": "en-US",
                                "ip": "0.0.0.0",
                                "os": {
                                    "name": "",
                                    "version": ""
                                },
                                "screen": {
                                    "density": 2
                                }
                            },
                            "messageId": "84e26acc-56a5-4835-8233-591137fca468",
                            "session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
                            "originalTimestamp": "2019-10-14T09:03:17.562Z",
                            "type": "track",
                            "event": "testing",
                            "properties": {
                                "personalizations": [
                                    {
                                        "to": [
                                            {
                                                "email": "a@g.com"
                                            },
                                            {
                                                "name": "hello"
                                            }
                                        ],
                                        "subject": "hey there"
                                    }
                                ],
                                "from": {
                                    "email": "ankit@rudderstack.com"
                                }
                            },
                            "integrations": {
                                "All": true
                            },
                            "sentAt": "2019-10-14T09:03:22.563Z"
                        }
                    }
                ]
            }
        },
        "output": {
            "response": {
                "status": 200,
                "body": [
                    {
                        "output": {
                            "version": "1",
                            "type": "REST",
                            "method": "POST",
                            "endpoint": "https://api.sendgrid.com/v3/mail/send",
                            "headers": {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer apikey"
                            },
                            "params": {},
                            "body": {
                                "JSON": {
                                    "from": {
                                        "email": "ankit@rudderstack.com"
                                    },
                                    "personalizations": [
                                        {
                                            "to": [
                                                {
                                                    "email": "a@g.com"
                                                }
                                            ],
                                            "subject": "hey there"
                                        }
                                    ],
                                    "content": [
                                        {
                                            "type": "text/html",
                                            "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                        }
                                    ],
                                    "subject": "A sample subject",
                                    "reply_to": {
                                        "email": "ankit@rudderstack.com"
                                    }
                                },
                                "JSON_ARRAY": {},
                                "XML": {},
                                "FORM": {}
                            },
                            "files": {},
                            "userId": ""
                        },
                        "statusCode": 200
                    }
                ]
            }
        }
    },
    {
        "name": "sendgrid",
        "description": "Track Call",
        "feature": "processor",
        "module": "destination",
        "version": "v0",
        "input": {
            "request": {
                "body": [
                    {
                        "destination": {
                            "Config": {
                                "apiKey": "apikey",
                                "eventNamesSettings": [
                                    {
                                        "event": "testing"
                                    },
                                    {
                                        "event": "clicked"
                                    }
                                ],
                                "subject": "A sample subject",
                                "replyToEmail": "ankit@rudderstack.com",
                                "contents": [
                                    {
                                        "type": "text/html",
                                        "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                    }
                                ],
                                "footer": false,
                                "footerText": "some text",
                                "bypassListManagement": false,
                                "sandboxMode": false,
                                "clickTracking": false,
                                "openTracking": false,
                                "ganalytics": false,
                                "subscriptionTracking": false,
                                "clickTrackingEnableText": false
                            }
                        },
                        "message": {
                            "channel": "web",
                            "context": {
                                "app": {
                                    "build": "1.0.0",
                                    "name": "RudderLabs JavaScript SDK",
                                    "namespace": "com.rudderlabs.javascript",
                                    "version": "1.0.0"
                                },
                                "library": {
                                    "name": "RudderLabs JavaScript SDK",
                                    "version": "1.0.0"
                                },
                                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                "locale": "en-US",
                                "ip": "0.0.0.0",
                                "os": {
                                    "name": "",
                                    "version": ""
                                },
                                "screen": {
                                    "density": 2
                                }
                            },
                            "messageId": "84e26acc-56a5-4835-8233-591137fca468",
                            "session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
                            "originalTimestamp": "2019-10-14T09:03:17.562Z",
                            "type": "track",
                            "event": "testing",
                            "properties": {
                                "replyTo": {
                                    "email": "testing@gmail.com"
                                },
                                "personalizations": [
                                    {
                                        "to": [
                                            {
                                                "email": "a@g.com"
                                            },
                                            {
                                                "name": "hello"
                                            }
                                        ],
                                        "subject": "hey there"
                                    }
                                ],
                                "from": {
                                    "email": "ankit@rudderstack.com"
                                }
                            },
                            "integrations": {
                                "All": true
                            },
                            "sentAt": "2019-10-14T09:03:22.563Z"
                        }
                    }
                ]
            }
        },
        "output": {
            "response": {
                "status": 200,
                "body": [
                    {
                        "output": {
                            "version": "1",
                            "type": "REST",
                            "method": "POST",
                            "endpoint": "https://api.sendgrid.com/v3/mail/send",
                            "headers": {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer apikey"
                            },
                            "params": {},
                            "body": {
                                "JSON": {
                                    "from": {
                                        "email": "ankit@rudderstack.com"
                                    },
                                    "personalizations": [
                                        {
                                            "to": [
                                                {
                                                    "email": "a@g.com"
                                                }
                                            ],
                                            "subject": "hey there"
                                        }
                                    ],
                                    "reply_to": {
                                        "email": "testing@gmail.com"
                                    },
                                    "content": [
                                        {
                                            "type": "text/html",
                                            "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                        }
                                    ],
                                    "subject": "A sample subject"
                                },
                                "JSON_ARRAY": {},
                                "XML": {},
                                "FORM": {}
                            },
                            "files": {},
                            "userId": ""
                        },
                        "statusCode": 200
                    }
                ]
            }
        }
    },
    {
        "name": "sendgrid",
        "description": "Track Call",
        "feature": "processor",
        "module": "destination",
        "version": "v0",
        "input": {
            "request": {
                "body": [
                    {
                        "destination": {
                            "Config": {
                                "apiKey": "apikey",
                                "eventNamesSettings": [
                                    {
                                        "event": "testing"
                                    },
                                    {
                                        "event": "clicked"
                                    }
                                ],
                                "subject": "A sample subject",
                                "replyToEmail": "ankit@rudderstack.com",
                                "contents": [
                                    {
                                        "type": "text/html",
                                        "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                    }
                                ],
                                "footer": false,
                                "footerText": "some text",
                                "bypassListManagement": false,
                                "sandboxMode": false,
                                "clickTracking": false,
                                "openTracking": false,
                                "ganalytics": false,
                                "subscriptionTracking": false,
                                "clickTrackingEnableText": false,
                                "group": "12345",
                                "groupsToDisplay": [
                                    {
                                        "groupId": "12345"
                                    },
                                    {
                                        "groupId": "abc"
                                    },
                                    {
                                        "groupId": "12346"
                                    }
                                ]
                            }
                        },
                        "message": {
                            "channel": "web",
                            "context": {
                                "app": {
                                    "build": "1.0.0",
                                    "name": "RudderLabs JavaScript SDK",
                                    "namespace": "com.rudderlabs.javascript",
                                    "version": "1.0.0"
                                },
                                "library": {
                                    "name": "RudderLabs JavaScript SDK",
                                    "version": "1.0.0"
                                },
                                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                "locale": "en-US",
                                "ip": "0.0.0.0",
                                "os": {
                                    "name": "",
                                    "version": ""
                                },
                                "screen": {
                                    "density": 2
                                }
                            },
                            "messageId": "84e26acc-56a5-4835-8233-591137fca468",
                            "session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
                            "originalTimestamp": "2019-10-14T09:03:17.562Z",
                            "type": "track",
                            "event": "testing",
                            "properties": {
                                "replyTo": {
                                    "email": "testing@gmail.com"
                                },
                                "personalizations": [
                                    {
                                        "to": [
                                            {
                                                "email": "a@g.com"
                                            },
                                            {
                                                "name": "hello"
                                            }
                                        ],
                                        "subject": "hey there"
                                    }
                                ],
                                "from": {
                                    "email": "ankit@rudderstack.com"
                                }
                            }
                        },
                        "integrations": {
                            "All": true
                        },
                        "sentAt": "2019-10-14T09:03:22.563Z"
                    }
                ]
            }
        },
        "output": {
            "response": {
                "status": 200,
                "body": [
                    {
                        "output": {
                            "version": "1",
                            "type": "REST",
                            "method": "POST",
                            "endpoint": "https://api.sendgrid.com/v3/mail/send",
                            "headers": {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer apikey"
                            },
                            "params": {},
                            "body": {
                                "JSON": {
                                    "from": {
                                        "email": "ankit@rudderstack.com"
                                    },
                                    "personalizations": [
                                        {
                                            "to": [
                                                {
                                                    "email": "a@g.com"
                                                }
                                            ],
                                            "subject": "hey there"
                                        }
                                    ],
                                    "reply_to": {
                                        "email": "testing@gmail.com"
                                    },
                                    "content": [
                                        {
                                            "type": "text/html",
                                            "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                        }
                                    ],
                                    "subject": "A sample subject",
                                    "asm": {
                                        "group_id": 12345,
                                        "groups_to_display": [
                                            12345,
                                            12346
                                        ]
                                    }
                                },
                                "JSON_ARRAY": {},
                                "XML": {},
                                "FORM": {}
                            },
                            "files": {},
                            "userId": ""
                        },
                        "statusCode": 200
                    }
                ]
            }
        }
    },
    {
        "name": "sendgrid",
        "description": "Track call without an event name",
        "feature": "processor",
        "module": "destination",
        "version": "v0",
        "input": {
            "request": {
                "body": [
                    {
                        "destination": {
                            "Config": {
                                "apiKey": "apikey",
                                "eventNamesSettings": [
                                    {
                                        "event": "testing"
                                    },
                                    {
                                        "event": "clicked"
                                    }
                                ],
                                "subject": "A sample subject",
                                "replyToEmail": "ankit@rudderstack.com",
                                "contents": [
                                    {
                                        "type": "text/html",
                                        "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                    }
                                ],
                                "footer": false,
                                "footerText": "some text",
                                "bypassListManagement": false,
                                "sandboxMode": false,
                                "clickTracking": false,
                                "openTracking": false,
                                "ganalytics": false,
                                "subscriptionTracking": false,
                                "clickTrackingEnableText": false,
                                "group": "12345",
                                "groupsToDisplay": [
                                    {
                                        "groupId": "12345"
                                    },
                                    {
                                        "groupId": "abc"
                                    },
                                    {
                                        "groupId": "12346"
                                    }
                                ]
                            }
                        },
                        "message": {
                            "channel": "web",
                            "context": {
                                "app": {
                                    "build": "1.0.0",
                                    "name": "RudderLabs JavaScript SDK",
                                    "namespace": "com.rudderlabs.javascript",
                                    "version": "1.0.0"
                                },
                                "library": {
                                    "name": "RudderLabs JavaScript SDK",
                                    "version": "1.0.0"
                                },
                                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                "locale": "en-US",
                                "ip": "0.0.0.0",
                                "os": {
                                    "name": "",
                                    "version": ""
                                },
                                "screen": {
                                    "density": 2
                                }
                            },
                            "messageId": "84e26acc-56a5-4835-8233-591137fca468",
                            "session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
                            "originalTimestamp": "2019-10-14T09:03:17.562Z",
                            "type": "track",
                            "event": "new event",
                            "properties": {
                                "replyTo": {
                                    "email": "testing@gmail.com"
                                },
                                "personalizations": [
                                    {
                                        "to": [
                                            {
                                                "email": "a@g.com"
                                            },
                                            {
                                                "name": "hello"
                                            }
                                        ],
                                        "subject": "hey there"
                                    }
                                ],
                                "from": {
                                    "email": "ankit@rudderstack.com"
                                }
                            },
                            "integrations": {
                                "All": true
                            },
                            "sentAt": "2019-10-14T09:03:22.563Z"
                        }
                    }
                ]
            }
        },
        "output": {
            "response": {
                "status": 200,
                "body": [
                    {
                        "statusCode": 400,
                        "error": "Event not configured on dashboard",
                        "statTags": {
                            "errorCategory": "dataValidation",
                            "errorType": "configuration",
                            "destType": "SENDGRID",
                            "module": "destination",
                            "implementation": "native",
                            "feature": "processor"
                        }
                    }
                ]
            }
        }
    },
    {
        "name": "sendgrid",
        "description": "Track Call",
        "feature": "processor",
        "module": "destination",
        "version": "v0",
        "input": {
            "request": {
                "body": [
                    {
                        "destination": {
                            "Config": {
                                "apiKey": "apikey",
                                "eventNamesSettings": [
                                    {
                                        "event": "testing"
                                    },
                                    {
                                        "event": "clicked"
                                    }
                                ],
                                "subject": "A sample subject",
                                "replyToEmail": "ankit@rudderstack.com",
                                "contents": [
                                    {
                                        "type": "text/html",
                                        "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                    }
                                ],
                                "footer": false,
                                "footerText": "some text",
                                "bypassListManagement": false,
                                "sandboxMode": false,
                                "clickTracking": false,
                                "openTracking": false,
                                "ganalytics": false,
                                "subscriptionTracking": false,
                                "clickTrackingEnableText": false,
                                "group": "12345",
                                "groupsToDisplay": [
                                    {
                                        "groupId": "12345"
                                    },
                                    {
                                        "groupId": "abc"
                                    },
                                    {
                                        "groupId": "12346"
                                    }
                                ],
                                "attachments": [
                                    {
                                        "content": "YXNkZ2FmZ3FlcmRxZ2Iua2puYWRrbGpuYWtqc2Rmbg==",
                                        "filename": "index.html"
                                    }
                                ]
                            }
                        },
                        "message": {
                            "channel": "web",
                            "context": {
                                "app": {
                                    "build": "1.0.0",
                                    "name": "RudderLabs JavaScript SDK",
                                    "namespace": "com.rudderlabs.javascript",
                                    "version": "1.0.0"
                                },
                                "library": {
                                    "name": "RudderLabs JavaScript SDK",
                                    "version": "1.0.0"
                                },
                                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                "locale": "en-US",
                                "ip": "0.0.0.0",
                                "os": {
                                    "name": "",
                                    "version": ""
                                },
                                "screen": {
                                    "density": 2
                                }
                            },
                            "messageId": "84e26acc-56a5-4835-8233-591137fca468",
                            "session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
                            "originalTimestamp": "2019-10-14T09:03:17.562Z",
                            "type": "track",
                            "event": "testing",
                            "properties": {
                                "replyTo": {
                                    "email": "testing@gmail.com"
                                },
                                "personalizations": [
                                    {
                                        "to": [
                                            {
                                                "email": "a@g.com"
                                            },
                                            {
                                                "name": "hello"
                                            }
                                        ],
                                        "subject": "hey there"
                                    }
                                ],
                                "from": {
                                    "email": "ankit@rudderstack.com"
                                }
                            },
                            "integrations": {
                                "All": true
                            },
                            "sentAt": "2019-10-14T09:03:22.563Z"
                        }
                    }
                ]
            }
        },
        "output": {
            "response": {
                "status": 200,
                "body": [
                    {
                        "output": {
                            "version": "1",
                            "type": "REST",
                            "method": "POST",
                            "endpoint": "https://api.sendgrid.com/v3/mail/send",
                            "headers": {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer apikey"
                            },
                            "params": {},
                            "body": {
                                "JSON": {
                                    "from": {
                                        "email": "ankit@rudderstack.com"
                                    },
                                    "personalizations": [
                                        {
                                            "to": [
                                                {
                                                    "email": "a@g.com"
                                                }
                                            ],
                                            "subject": "hey there"
                                        }
                                    ],
                                    "reply_to": {
                                        "email": "testing@gmail.com"
                                    },
                                    "attachments": [
                                        {
                                            "content": "YXNkZ2FmZ3FlcmRxZ2Iua2puYWRrbGpuYWtqc2Rmbg==",
                                            "filename": "index.html"
                                        }
                                    ],
                                    "content": [
                                        {
                                            "type": "text/html",
                                            "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                        }
                                    ],
                                    "subject": "A sample subject",
                                    "asm": {
                                        "group_id": 12345,
                                        "groups_to_display": [
                                            12345,
                                            12346
                                        ]
                                    }
                                },
                                "JSON_ARRAY": {},
                                "XML": {},
                                "FORM": {}
                            },
                            "files": {},
                            "userId": ""
                        },
                        "statusCode": 200
                    }
                ]
            }
        }
    },
    {
        "name": "sendgrid",
        "description": "Track Call",
        "feature": "processor",
        "module": "destination",
        "version": "v0",
        "input": {
            "request": {
                "body": [
                    {
                        "destination": {
                            "Config": {
                                "apiKey": "apikey",
                                "eventNamesSettings": [
                                    {
                                        "event": "testing"
                                    },
                                    {
                                        "event": "clicked"
                                    }
                                ],
                                "subject": "A sample subject",
                                "replyToEmail": "ankit@rudderstack.com",
                                "contents": [
                                    {
                                        "type": "text/html",
                                        "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                    }
                                ],
                                "footer": false,
                                "footerText": "some text",
                                "bypassListManagement": false,
                                "sandboxMode": false,
                                "clickTracking": false,
                                "openTracking": false,
                                "ganalytics": false,
                                "subscriptionTracking": false,
                                "clickTrackingEnableText": false,
                                "group": "12345",
                                "groupsToDisplay": [
                                    {
                                        "groupId": "12345"
                                    },
                                    {
                                        "groupId": "abc"
                                    },
                                    {
                                        "groupId": "12346"
                                    }
                                ],
                                "attachments": [
                                    {
                                        "content": "YXNkZ21hcyxkLm1mO29xd2llbGpmbWwuYWRrbXMuLGFtZHM=",
                                        "filename": "index.html"
                                    },
                                    {
                                        "content": "bGFqa3NtZGZrZ2hxaWVybmtsYSBmZGtvamx3bWVGTC5NQW5kcy5rbmtmYWtkZg=="
                                    }
                                ]
                            }
                        },
                        "message": {
                            "channel": "web",
                            "context": {
                                "app": {
                                    "build": "1.0.0",
                                    "name": "RudderLabs JavaScript SDK",
                                    "namespace": "com.rudderlabs.javascript",
                                    "version": "1.0.0"
                                },
                                "library": {
                                    "name": "RudderLabs JavaScript SDK",
                                    "version": "1.0.0"
                                },
                                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                "locale": "en-US",
                                "ip": "0.0.0.0",
                                "os": {
                                    "name": "",
                                    "version": ""
                                },
                                "screen": {
                                    "density": 2
                                }
                            },
                            "messageId": "84e26acc-56a5-4835-8233-591137fca468",
                            "session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
                            "originalTimestamp": "2019-10-14T09:03:17.562Z",
                            "type": "track",
                            "event": "testing",
                            "properties": {
                                "replyTo": {
                                    "email": "testing@gmail.com"
                                },
                                "personalizations": [
                                    {
                                        "to": [
                                            {
                                                "email": "a@g.com"
                                            },
                                            {
                                                "name": "hello"
                                            }
                                        ],
                                        "subject": "hey there"
                                    }
                                ],
                                "from": {
                                    "email": "ankit@rudderstack.com"
                                }
                            },
                            "integrations": {
                                "All": true
                            },
                            "sentAt": "2019-10-14T09:03:22.563Z"
                        }
                    }
                ]
            }
        },
        "output": {
            "response": {
                "status": 200,
                "body": [
                    {
                        "output": {
                            "version": "1",
                            "type": "REST",
                            "method": "POST",
                            "endpoint": "https://api.sendgrid.com/v3/mail/send",
                            "headers": {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer apikey"
                            },
                            "params": {},
                            "body": {
                                "JSON": {
                                    "from": {
                                        "email": "ankit@rudderstack.com"
                                    },
                                    "personalizations": [
                                        {
                                            "to": [
                                                {
                                                    "email": "a@g.com"
                                                }
                                            ],
                                            "subject": "hey there"
                                        }
                                    ],
                                    "reply_to": {
                                        "email": "testing@gmail.com"
                                    },
                                    "attachments": [
                                        {
                                            "content": "YXNkZ21hcyxkLm1mO29xd2llbGpmbWwuYWRrbXMuLGFtZHM=",
                                            "filename": "index.html"
                                        }
                                    ],
                                    "content": [
                                        {
                                            "type": "text/html",
                                            "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                        }
                                    ],
                                    "subject": "A sample subject",
                                    "asm": {
                                        "group_id": 12345,
                                        "groups_to_display": [
                                            12345,
                                            12346
                                        ]
                                    }
                                },
                                "JSON_ARRAY": {},
                                "XML": {},
                                "FORM": {}
                            },
                            "files": {},
                            "userId": ""
                        },
                        "statusCode": 200
                    }
                ]
            }
        }
    },
    {
        "name": "sendgrid",
        "description": "Track Call",
        "feature": "processor",
        "module": "destination",
        "version": "v0",
        "input": {
            "request": {
                "body": [
                    {
                        "destination": {
                            "Config": {
                                "apiKey": "apikey",
                                "eventNamesSettings": [
                                    {
                                        "event": "testing"
                                    },
                                    {
                                        "event": "clicked"
                                    }
                                ],
                                "subject": "A sample subject",
                                "replyToEmail": "ankit@rudderstack.com",
                                "contents": [
                                    {
                                        "type": "text/html",
                                        "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                    }
                                ],
                                "footer": false,
                                "footerText": "some text",
                                "bypassListManagement": false,
                                "sandboxMode": false,
                                "clickTracking": false,
                                "openTracking": false,
                                "ganalytics": false,
                                "subscriptionTracking": false,
                                "clickTrackingEnableText": false,
                                "group": "12345",
                                "groupsToDisplay": [
                                    {
                                        "groupId": "12345"
                                    },
                                    {
                                        "groupId": "abc"
                                    },
                                    {
                                        "groupId": "12346"
                                    }
                                ],
                                "attachments": [
                                    {
                                        "content": "YXNkZ21hcyxkLm1mO29xd2llbGpmbWwuYWRrbXMuLGFtZHM=",
                                        "filename": "index.html"
                                    },
                                    {
                                        "content": "bGFqa3NtZGZrZ2hxaWVybmtsYSBmZGtvamx3bWVGTC5NQW5kcy5rbmtmYWtkZg=="
                                    }
                                ]
                            }
                        },
                        "message": {
                            "channel": "web",
                            "context": {
                                "app": {
                                    "build": "1.0.0",
                                    "name": "RudderLabs JavaScript SDK",
                                    "namespace": "com.rudderlabs.javascript",
                                    "version": "1.0.0"
                                },
                                "library": {
                                    "name": "RudderLabs JavaScript SDK",
                                    "version": "1.0.0"
                                },
                                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                "locale": "en-US",
                                "ip": "0.0.0.0",
                                "os": {
                                    "name": "",
                                    "version": ""
                                },
                                "screen": {
                                    "density": 2
                                }
                            },
                            "messageId": "84e26acc-56a5-4835-8233-591137fca468",
                            "session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
                            "originalTimestamp": "2019-10-14T09:03:17.562Z",
                            "type": "track",
                            "event": "testing",
                            "properties": {
                                "replyTo": {
                                    "email": "testing@gmail.com"
                                },
                                "mailSettings": {
                                    "bypassListManagement": true,
                                    "footer": true
                                },
                                "personalizations": [
                                    {
                                        "to": [
                                            {
                                                "email": "a@g.com"
                                            },
                                            {
                                                "name": "hello"
                                            }
                                        ],
                                        "subject": "hey there"
                                    }
                                ],
                                "from": {
                                    "email": "ankit@rudderstack.com"
                                }
                            },
                            "integrations": {
                                "All": true
                            },
                            "sentAt": "2019-10-14T09:03:22.563Z"
                        }
                    }
                ]
            }
        },
        "output": {
            "response": {
                "status": 200,
                "body": [
                    {
                        "output": {
                            "version": "1",
                            "type": "REST",
                            "method": "POST",
                            "endpoint": "https://api.sendgrid.com/v3/mail/send",
                            "headers": {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer apikey"
                            },
                            "params": {},
                            "body": {
                                "JSON": {
                                    "from": {
                                        "email": "ankit@rudderstack.com"
                                    },
                                    "personalizations": [
                                        {
                                            "to": [
                                                {
                                                    "email": "a@g.com"
                                                }
                                            ],
                                            "subject": "hey there"
                                        }
                                    ],
                                    "reply_to": {
                                        "email": "testing@gmail.com"
                                    },
                                    "attachments": [
                                        {
                                            "content": "YXNkZ21hcyxkLm1mO29xd2llbGpmbWwuYWRrbXMuLGFtZHM=",
                                            "filename": "index.html"
                                        }
                                    ],
                                    "content": [
                                        {
                                            "type": "text/html",
                                            "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
                                        }
                                    ],
                                    "subject": "A sample subject",
                                    "asm": {
                                        "group_id": 12345,
                                        "groups_to_display": [
                                            12345,
                                            12346
                                        ]
                                    },
                                    "mail_settings": {
                                        "bypass_list_management": {
                                            "enable": true
                                        },
                                        "footer": {
                                            "enable": true,
                                            "text": "some text"
                                        }
                                    }
                                },
                                "JSON_ARRAY": {},
                                "XML": {},
                                "FORM": {}
                            },
                            "files": {},
                            "userId": ""
                        },
                        "statusCode": 200
                    }
                ]
            }
        }
    }
]