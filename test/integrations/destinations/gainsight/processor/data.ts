export const data = [
	{
		"name": "gainsight",
		"description": "Test 0",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"domain": "demo-domain.gainsightcloud.com",
								"accessKey": "sample-access-key",
								"personMap": [],
								"companyMap": [],
								"eventNameMap": [],
								"eventVersionMap": []
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
							"anonymousId": "anon_id",
							"type": "identify",
							"traits": {
								"email": "cosmo@krammer.com",
								"name": "Cosmo Krammer",
								"linkedinUrl": "https://linkedin.com/cosmo-krammer",
								"location": "New York",
								"emailOptOut": true,
								"masterAvatarTypeCode": 10
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"Email": "cosmo@krammer.com",
									"Name": "Cosmo Krammer",
									"LinkedinUrl": "https://linkedin.com/cosmo-krammer",
									"Location": "New York",
									"EmailOptOut": true,
									"MasterAvatarTypeCode": 10
								}
							},
							"type": "REST",
							"files": {},
							"method": "PUT",
							"params": {},
							"headers": {
								"Accesskey": "sample-access-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://demo-domain.gainsightcloud.com/v1.0/api/people",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight",
		"description": "Test 1",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"domain": "demo-domain.gainsightcloud.com",
								"accessKey": "sample-access-key",
								"personMap": [
									{
										"from": "age",
										"to": "age__gc"
									}
								],
								"companyMap": [],
								"eventNameMap": [],
								"eventVersionMap": []
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
							"anonymousId": "anon_id",
							"type": "identify",
							"traits": {
								"email": "cosmo@krammer.com",
								"name": "Cosmo Krammer",
								"linkedinUrl": "https://linkedin.com/cosmo-krammer",
								"location": "New York",
								"emailOptOut": true,
								"masterAvatarTypeCode": 10,
								"age": 35,
								"randomKey": "this should be dropped"
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"Email": "cosmo@krammer.com",
									"Name": "Cosmo Krammer",
									"LinkedinUrl": "https://linkedin.com/cosmo-krammer",
									"Location": "New York",
									"EmailOptOut": true,
									"MasterAvatarTypeCode": 10,
									"age__gc": 35
								}
							},
							"type": "REST",
							"files": {},
							"method": "PUT",
							"params": {},
							"headers": {
								"Accesskey": "sample-access-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://demo-domain.gainsightcloud.com/v1.0/api/people",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight",
		"description": "Test 2",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"domain": "demo-domain.gainsightcloud.com",
								"accessKey": "sample-access-key",
								"personMap": [],
								"companyMap": [],
								"eventNameMap": [],
								"eventVersionMap": []
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
							"anonymousId": "anon_id",
							"type": "identify",
							"traits": {
								"name": "Cosmo Krammer",
								"linkedinUrl": "https://linkedin.com/cosmo-krammer",
								"location": "New York",
								"emailOptOut": true,
								"masterAvatarTypeCode": 10
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
						"error": "email is required for identify",
						"statTags": {
							"destType": "GAINSIGHT",
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"feature": "processor",
							"implementation": "native",
							"module": "destination"
						},
						"statusCode": 400
					}
				]
			}
		}
	},
	{
		"name": "gainsight",
		"description": "Test 3",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"domain": "demo-domain.gainsightcloud.com",
								"accessKey": "sample-access-key",
								"sharedSecret": "sample-shared-secret",
								"eventNameMap": [
									{
										"from": "Ticket Resolved",
										"to": "Ticket Resolved Event"
									}
								],
								"eventVersionMap": [
									{
										"from": "Ticket Resolved",
										"to": "1.0.0"
									}
								],
								"topicName": "Ticket Actions",
								"tenantId": "sample-tenant-id",
								"personMap": [],
								"companyMap": []
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
							"anonymousId": "anon_id",
							"type": "track",
							"event": "Ticket Resolved",
							"properties": {
								"ticketId": "sample-ticket-id",
								"actionEmail": "sample@email.com",
								"status": "resovled"
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"ticketId": "sample-ticket-id",
									"actionEmail": "sample@email.com",
									"status": "resovled"
								}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"Accesskey": "sample-access-key",
								"tenantId": "sample-tenant-id",
								"sharedSecret": "sample-shared-secret",
								"Content-Type": "application/json",
								"topicName": "Ticket Actions",
								"eventName": "Ticket Resolved Event",
								"eventVersion": "1.0.0"
							},
							"version": "1",
							"endpoint": "https://demo-domain.gainsightcloud.com/v1.0/api/eventManager/event",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight",
		"description": "Test 4",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"domain": "demo-domain.gainsightcloud.com",
								"accessKey": "sample-access-key",
								"sharedSecret": "sample-shared-secret",
								"personMap": [],
								"companyMap": [],
								"eventNameMap": [],
								"eventVersionMap": []
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
								},
								"traits": {
									"email": "krammer@seinfeld.com"
								}
							},
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "anon_id",
							"type": "group",
							"traits": {
								"name": "Kramerica Industries",
								"industry": "Sitcom",
								"employees": "100",
								"status": "complete",
								"companyType": "spoof"
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"Email": "krammer@seinfeld.com",
									"companies": [
										{
											"Company_ID": "1P0203VCESP7AUQMV9E953G"
										}
									]
								}
							},
							"type": "REST",
							"files": {},
							"method": "PUT",
							"params": {},
							"headers": {
								"Accesskey": "sample-access-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://demo-domain.gainsightcloud.com/v1.0/api/people",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight",
		"description": "Test 5",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"domain": "demo-domain.gainsightcloud.com",
								"accessKey": "sample-access-key",
								"sharedSecret": "sample-shared-secret",
								"personMap": [],
								"companyMap": [],
								"eventNameMap": [],
								"eventVersionMap": []
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
								},
								"traits": {
									"email": "krammer@seinfeld.com"
								}
							},
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "anon_id",
							"type": "group",
							"traits": {
								"name": "Seinfeld Corps",
								"industry": "TV Series",
								"employees": "50",
								"status": "complete"
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"Email": "krammer@seinfeld.com",
									"companies": [
										{
											"Company_ID": "1P0203VCESP7AUQMV9E953G"
										}
									]
								}
							},
							"type": "REST",
							"files": {},
							"method": "PUT",
							"params": {},
							"headers": {
								"Accesskey": "sample-access-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://demo-domain.gainsightcloud.com/v1.0/api/people",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight",
		"description": "Test 6",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"domain": "demo-domain.gainsightcloud.com",
								"accessKey": "sample-access-key",
								"personMap": [],
								"companyMap": [],
								"eventNameMap": [],
								"eventVersionMap": []
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
							"anonymousId": "anon_id",
							"type": "identify",
							"traits": {
								"email": "cosmo@krammer.com",
								"firstname": "Cosmo",
								"lastname": "Krammer",
								"linkedinUrl": "https://linkedin.com/cosmo-krammer",
								"location": "New York",
								"emailOptOut": true,
								"masterAvatarTypeCode": 10
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"Email": "cosmo@krammer.com",
									"FirstName": "Cosmo",
									"LastName": "Krammer",
									"Name": "Cosmo Krammer",
									"LinkedinUrl": "https://linkedin.com/cosmo-krammer",
									"Location": "New York",
									"EmailOptOut": true,
									"MasterAvatarTypeCode": 10
								}
							},
							"type": "REST",
							"files": {},
							"method": "PUT",
							"params": {},
							"headers": {
								"Accesskey": "sample-access-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://demo-domain.gainsightcloud.com/v1.0/api/people",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight",
		"description": "Test 7",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"domain": "demo-domain.gainsightcloud.com",
								"accessKey": "sample-access-key",
								"sharedSecret": "sample-shared-secret",
								"eventNameMap": [
									{
										"from": "Ticket Resolved",
										"to": "Ticket Resolved Event"
									}
								],
								"eventVersionMap": [
									{
										"from": "Ticket Resolved",
										"to": "1.0.0"
									}
								],
								"topicName": "Ticket Actions",
								"tenantId": "sample-tenant-id",
								"personMap": [],
								"companyMap": [],
								"contractId": "externalId-shall-get-precedence"
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
								},
								"externalId": [
									{
										"type": "gainsightEventContractId",
										"id": "sample-contract-id"
									}
								]
							},
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "anon_id",
							"type": "track",
							"event": "Ticket Resolved",
							"properties": {
								"ticketId": "sample-ticket-id",
								"actionEmail": "sample@email.com",
								"status": "resovled"
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"ticketId": "sample-ticket-id",
									"actionEmail": "sample@email.com",
									"status": "resovled"
								}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"Accesskey": "sample-access-key",
								"tenantId": "sample-tenant-id",
								"sharedSecret": "sample-shared-secret",
								"Content-Type": "application/json",
								"topicName": "Ticket Actions",
								"eventName": "Ticket Resolved Event",
								"eventVersion": "1.0.0",
								"contractId": "sample-contract-id"
							},
							"version": "1",
							"endpoint": "https://demo-domain.gainsightcloud.com/v1.0/api/eventManager/event",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight",
		"description": "Test 8",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"domain": "demo-domain.gainsightcloud.com",
								"accessKey": "sample-access-key",
								"personMap": [
									{
										"from": "car",
										"to": "car__gc"
									}
								],
								"companyMap": [],
								"eventNameMap": [],
								"eventVersionMap": []
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
							"anonymousId": "anon_id",
							"type": "identify",
							"traits": {
								"name": "Bruce Wayne",
								"email": "ceo@waynefoundation.com",
								"car": "Batmobile",
								"comments": "I am Batman!",
								"lastName": "Wayne",
								"location": "Gotham Central",
								"firstName": "Bruce",
								"linkedinUrl": "https://www.linkedin.com/in/notyourBatman/"
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"Name": "Bruce Wayne",
									"Email": "ceo@waynefoundation.com",
									"car__gc": "Batmobile",
									"Comments": "I am Batman!",
									"LastName": "Wayne",
									"Location": "Gotham Central",
									"FirstName": "Bruce",
									"LinkedinUrl": "https://www.linkedin.com/in/notyourBatman/"
								}
							},
							"type": "REST",
							"files": {},
							"method": "PUT",
							"params": {},
							"headers": {
								"Accesskey": "sample-access-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://demo-domain.gainsightcloud.com/v1.0/api/people",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	}
]