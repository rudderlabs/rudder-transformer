export const data = [
	{
		"name": "freshmarketer",
		"description": "Identify call for creating new user",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "rudderstack-476952domain3105.myfreshworks.com"
							}
						},
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99099",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								}
							},
							"traits": {
								"email": "testuser@google.com",
								"first_name": "Rk",
								"last_name": "Mishra",
								"mobileNumber": "1-926-555-9504",
								"lifecycleStageId": 71010794467,
								"phone": "9988776655",
								"owner_id": "70000090119"
							},
							"type": "identify",
							"sentAt": "2022-04-22T10:57:58Z"
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
								"FORM": {},
								"JSON": {
									"contact": {
										"emails": "testuser@google.com",
										"last_name": "Mishra",
										"created_at": "2022-06-22T10:57:58Z",
										"first_name": "Rk",
										"updated_at": "2022-06-22T10:57:58Z",
										"external_id": "ea5cfab2-3961-4d8a-8187-3d1858c99099",
										"work_number": "9988776655",
										"mobile_number": "1-926-555-9504",
										"lifecycle_stage_id": 71010794467
									},
									"unique_identifier": {
										"emails": "testuser@google.com"
									}
								},
								"JSON_ARRAY": {}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Token token=dummyApiKey"
							},
							"version": "1",
							"endpoint": "https://rudderstack-476952domain3105.myfreshworks.com/crm/sales/api/contacts/upsert",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "freshmarketer",
		"description": "Identify call with numbers in lifecycleStageId, ownerId",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "rudderstack-476952domain3105.myfreshworks.com"
							}
						},
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99099",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								}
							},
							"traits": {
								"email": "testuser@google.com",
								"first_name": "Rk",
								"last_name": "Mishra",
								"mobileNumber": "1-926-555-9504",
								"lifecycleStageId": 71010794467,
								"phone": "9988776655",
								"owner_id": "70000090119"
							},
							"type": "identify",
							"sentAt": "2022-04-22T10:57:58Z"
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
								"FORM": {},
								"JSON": {
									"contact": {
										"emails": "testuser@google.com",
										"last_name": "Mishra",
										"created_at": "2022-06-22T10:57:58Z",
										"first_name": "Rk",
										"updated_at": "2022-06-22T10:57:58Z",
										"external_id": "ea5cfab2-3961-4d8a-8187-3d1858c99099",
										"work_number": "9988776655",
										"mobile_number": "1-926-555-9504",
										"lifecycle_stage_id": 71010794467
									},
									"unique_identifier": {
										"emails": "testuser@google.com"
									}
								},
								"JSON_ARRAY": {}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Token token=dummyApiKey"
							},
							"version": "1",
							"endpoint": "https://rudderstack-476952domain3105.myfreshworks.com/crm/sales/api/contacts/upsert",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "freshmarketer",
		"description": "Identify call with wrong data type in lifecycleStageId, ownerId",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "rudderstack-476952domain3105.myfreshworks.com"
							}
						},
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99099",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								}
							},
							"traits": {
								"email": "testuser@google.com",
								"first_name": "Rk",
								"last_name": "Mishra",
								"mobileNumber": "1-926-555-9504",
								"lifecycleStageId": "rudderSample",
								"phone": "9988776655",
								"ownerId": "rudderSample"
							},
							"type": "identify",
							"sentAt": "2022-04-22T10:57:58Z"
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
						"error": "owner_id,lifecycle_stage_id: invalid number format",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Identify call, email is not provided.",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "rudderstack-476952domain3105.myfreshworks.com"
							}
						},
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99099",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								}
							},
							"traits": {
								"first_name": "Rk",
								"last_name": "Mishra",
								"mobileNumber": "1-926-555-9504",
								"lifecycleStageId": "rudderSample",
								"phone": "9988776655",
								"owner_id": "rudderSample"
							},
							"type": "identify",
							"sentAt": "2022-04-22T10:57:58Z"
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
						"error": "Missing required value from \"email\"",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Group call: testing with mock api",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
							}
						},
						"message": {
							"messageId": "sadjb-1e2r3fhgb-12bvbbj",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"traits": {
									"email": "testuser@google.com"
								}
							},
							"traits": {
								"groupType": "accounts",
								"name": "Mark Twain",
								"phone": "919191919191",
								"numberOfEmployees": 51,
								"annualRevenue": 1000,
								"address": "Red Colony",
								"city": "Colony",
								"state": "Haryana"
							},
							"type": "group",
							"sentAt": "2022-04-22T10:57:58Z"
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
								"FORM": {},
								"JSON": {
									"contact": {
										"sales_accounts": [
											{
												"id": 70003771198,
												"name": "div-quer",
												"avatar": null,
												"partial": true,
												"website": null,
												"is_primary": true,
												"last_contacted": null,
												"record_type_id": "71010794477"
											},
											{
												"id": 70003825177,
												"name": "BisleriGroup",
												"avatar": null,
												"partial": true,
												"website": null,
												"is_primary": false,
												"last_contacted": null,
												"record_type_id": "71010794477"
											},
											{
												"id": 70003771396,
												"is_primary": false
											}
										]
									},
									"unique_identifier": {
										"emails": "testuser@google.com"
									}
								},
								"JSON_ARRAY": {}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Token token=dummyApiKey"
							},
							"version": "1",
							"endpoint": "https://domain-rudder.myfreshworks.com/crm/sales/api/contacts/upsert",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "freshmarketer",
		"description": "Group call: name is required field.",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
							}
						},
						"message": {
							"messageId": "sadjb-1e2r3fhgb-12bvbbj",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"traits": {
									"email": "testuser@google.com"
								}
							},
							"traits": {
								"groupType": "accounts",
								"phone": "919191919191",
								"numberOfEmployees": 51,
								"annualRevenue": 1000,
								"address": "Red Colony",
								"city": "Colony",
								"state": "Haryana"
							},
							"type": "group",
							"sentAt": "2022-04-22T10:57:58Z"
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
						"error": "Missing required value from \"name\"",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "missing message type",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
							}
						},
						"message": {
							"messageId": "sadjb-1e2r3fhgb-12bvbbj",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"traits": {
									"email": "testuser4google.com"
								}
							},
							"traits": {
								"name": "Mark Twain",
								"phone": "919191919191",
								"numberOfEmployees": 51,
								"annualRevenue": 1000,
								"address": "Red Colony",
								"city": "Colony",
								"state": "Haryana"
							},
							"sentAt": "2022-04-22T10:57:58Z"
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
						"error": "Message Type is not present. Aborting message.",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Wrong message type",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
							}
						},
						"message": {
							"messageId": "sadjb-1e2r3fhgb-12bvbbj",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"traits": {
									"email": "testuser4google.com"
								}
							},
							"traits": {
								"name": "Mark Twain",
								"phone": "919191919191",
								"numberOfEmployees": 51,
								"annualRevenue": 1000,
								"address": "Red Colony",
								"city": "Colony",
								"state": "Haryana"
							},
							"type": "page",
							"sentAt": "2022-04-22T10:57:58Z"
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
						"error": "message type page not supported",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Group call: user email is missing",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
							}
						},
						"message": {
							"messageId": "sadjb-1e2r3fhgb-12bvbbj",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"traits": {}
							},
							"traits": {
								"groupType": "accounts",
								"name": "div-quer",
								"phone": "919191919191",
								"numberOfEmployees": 51,
								"annualRevenue": 1000,
								"address": "Red Colony",
								"city": "Lal colony",
								"state": "Haryana"
							},
							"type": "group",
							"sentAt": "2022-04-22T10:57:58Z"
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
								"FORM": {},
								"JSON": {
									"sales_account": {
										"city": "Lal colony",
										"name": "div-quer",
										"phone": "919191919191",
										"state": "Haryana",
										"address": "Red Colony",
										"created_at": "2022-06-22T10:57:58Z",
										"updated_at": "2022-06-22T10:57:58Z",
										"annual_revenue": 1000,
										"number_of_employees": 51
									},
									"unique_identifier": {
										"name": "div-quer"
									}
								},
								"JSON_ARRAY": {}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Token token=dummyApiKey"
							},
							"version": "1",
							"endpoint": "https://domain-rudder.myfreshworks.com/crm/sales/api/sales_accounts/upsert",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "freshmarketer",
		"description": "Identify call: Email is not present",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99099",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								}
							},
							"traits": {
								"first_name": "Rk",
								"last_name": "Narayan",
								"mobileNumber": "1-926-555-9504",
								"phone": "9988776655"
							},
							"type": "identify",
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
						"error": "Missing required value from \"email\"",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Track call, event is not supported.",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.5"
								},
								"traits": {
									"name": "Shehan Study",
									"category": "SampleIdentify",
									"email": "test@rudderstack.com",
									"plan": "Open source",
									"logins": 5,
									"createdAt": 1599264000
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.5"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 0.8999999761581421
								},
								"campaign": {
									"source": "google",
									"medium": "medium",
									"term": "keyword",
									"content": "some content",
									"name": "some campaign",
									"test": "other value"
								},
								"page": {
									"path": "/destinations/amplitude",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/amplitude",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "dd46338d-5f83-493b-bd28-3b48f55d0be8",
							"originalTimestamp": "2020-10-20T08:14:28.778Z",
							"anonymousId": "my-anonymous-id-new",
							"userId": "newUserIdAlias",
							"properties": {
								"product_name": "Shirt",
								"brand": "Wrogn"
							},
							"event": "Add to Cart",
							"previousId": "sampleusrRudder3",
							"sentAt": "2020-10-20T08:14:28.778Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
						"error": "event name Add to Cart is not supported. Aborting!",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Track call: some required properties is missing for sales_activity",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.5"
								},
								"traits": {
									"name": "Shehan Study",
									"category": "SampleIdentify",
									"email": "test@rudderstack.com",
									"plan": "Open source",
									"logins": 5,
									"createdAt": 1599264000
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.5"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 0.8999999761581421
								},
								"campaign": {
									"source": "google",
									"medium": "medium",
									"term": "keyword",
									"content": "some content",
									"name": "some campaign",
									"test": "other value"
								},
								"page": {
									"path": "/destinations/amplitude",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/amplitude",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "dd46338d-5f83-493b-bd28-3b48f55d0be8",
							"originalTimestamp": "2020-10-20T08:14:28.778Z",
							"anonymousId": "my-anonymous-id-new",
							"userId": "newUserIdAlias",
							"email": "test@rudderstack.com",
							"properties": {
								"product_name": "Shirt",
								"brand": "Wrogn"
							},
							"event": "sales_activity",
							"previousId": "sampleusrRudder3",
							"sentAt": "2020-10-20T08:14:28.778Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
						"error": "Missing required value from \"properties.title\"",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Track call: for salesActivityName",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.5"
								},
								"traits": {
									"name": "Shehan Study",
									"category": "SampleIdentify",
									"email": "test@rudderstack.com",
									"plan": "Open source",
									"logins": 5,
									"createdAt": 1599264000
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.5"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 0.8999999761581421
								},
								"campaign": {
									"source": "google",
									"medium": "medium",
									"term": "keyword",
									"content": "some content",
									"name": "some campaign",
									"test": "other value"
								},
								"page": {
									"path": "/destinations/amplitude",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/amplitude",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								},
								"externalId": {
									"type": "Contact"
								}
							},
							"type": "track",
							"messageId": "dd46338d-5f83-493b-bd28-3b48f55d0be8",
							"originalTimestamp": "2020-10-20T08:14:28.778Z",
							"anonymousId": "my-anonymous-id-new",
							"userId": "newUserIdAlias",
							"email": "test@rudderstack.com",
							"properties": {
								"product_name": "Shirt",
								"brand": "Wrogn",
								"salesActivityName": "own-calender",
								"title": "new Contact",
								"startDate": "2021-05-04T17:00:00+05:30",
								"endDate": "2022-06-04T17:30:00+05:30",
								"ownerId": "70054866612"
							},
							"event": "sales_activity",
							"previousId": "sampleusrRudder3",
							"sentAt": "2020-10-20T08:14:28.778Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
							"body": {
								"XML": {},
								"FORM": {},
								"JSON": {
									"sales_activity": {
										"title": "new Contact",
										"end_date": "2022-06-04T17:30:00+05:30",
										"owner_id": "70054866612",
										"start_date": "2021-05-04T17:00:00+05:30",
										"created_at": "2020-10-20T08:14:28.778Z",
										"updated_at": "2020-10-20T08:14:28.778Z",
										"targetable_id": 70054866612,
										"targetable_type": "Contact",
										"sales_activity_name": "own-calender",
										"sales_activity_type_id": 70000666879
									}
								},
								"JSON_ARRAY": {}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Token token=dummyApiKey"
							},
							"version": "1",
							"endpoint": "https://domain-rudder.myfreshworks.com/crm/sales/api/sales_activities",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "freshmarketer",
		"description": "Track call: lifecycle_stage_id",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.5"
								},
								"traits": {
									"name": "Shehan Study",
									"category": "SampleIdentify",
									"plan": "Open source",
									"logins": 5,
									"createdAt": 1599264000
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.5"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 0.8999999761581421
								},
								"campaign": {
									"source": "google",
									"medium": "medium",
									"term": "keyword",
									"content": "some content",
									"name": "some campaign",
									"test": "other value"
								},
								"page": {
									"path": "/destinations/amplitude",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/amplitude",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "dd46338d-5f83-493b-bd28-3b48f55d0be8",
							"originalTimestamp": "2020-10-20T08:14:28.778Z",
							"anonymousId": "my-anonymous-id-new",
							"userId": "newUserIdAlias",
							"properties": {
								"email": "jamessampleton3@gmail.com",
								"lifecycleStageId": "71012139273",
								"title": "new Contact",
								"startDate": "2021-05-04T17:00:00+05:30",
								"endDate": "2022-06-04T17:30:00+05:30",
								"ownerId": "70054866612",
								"targetableType": "Contact"
							},
							"event": "lifecycle_stage",
							"previousId": "sampleusrRudder3",
							"sentAt": "2020-10-20T08:14:28.778Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
							"method": "POST",
							"endpoint": "https://domain-rudder.myfreshworks.com/crm/sales/api/contacts/upsert",
							"headers": {
								"Authorization": "Token token=dummyApiKey",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"contact": {
										"lifecycle_stage_id": "71012139273"
									},
									"unique_identifier": {
										"emails": "jamessampleton3@gmail.com"
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
		"name": "freshmarketer",
		"description": "Track call: In lifecycle stage, email is missing",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.5"
								},
								"traits": {
									"name": "Shehan Study",
									"category": "SampleIdentify",
									"plan": "Open source",
									"logins": 5,
									"createdAt": 1599264000
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.5"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 0.8999999761581421
								},
								"campaign": {
									"source": "google",
									"medium": "medium",
									"term": "keyword",
									"content": "some content",
									"name": "some campaign",
									"test": "other value"
								},
								"page": {
									"path": "/destinations/amplitude",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/amplitude",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "dd46338d-5f83-493b-bd28-3b48f55d0be8",
							"originalTimestamp": "2020-10-20T08:14:28.778Z",
							"anonymousId": "my-anonymous-id-new",
							"userId": "newUserIdAlias",
							"properties": {
								"lifecycleStageId": "71012139273",
								"title": "new Contact",
								"startDate": "2021-05-04T17:00:00+05:30",
								"endDate": "2022-06-04T17:30:00+05:30",
								"ownerId": "70054866612",
								"targetableType": "Contact"
							},
							"event": "lifecycle_stage",
							"previousId": "sampleusrRudder3",
							"sentAt": "2020-10-20T08:14:28.778Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
						"error": "email is required for updating life Cycle Stages. Aborting!",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Track call: Either of lifecycleStageName or lifecycleStageId is required",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.5"
								},
								"traits": {
									"name": "Shehan Study",
									"category": "SampleIdentify",
									"email": "test@rudderstack.com",
									"plan": "Open source",
									"logins": 5,
									"createdAt": 1599264000
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.5"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 0.8999999761581421
								},
								"campaign": {
									"source": "google",
									"medium": "medium",
									"term": "keyword",
									"content": "some content",
									"name": "some campaign",
									"test": "other value"
								},
								"page": {
									"path": "/destinations/amplitude",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/amplitude",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "dd46338d-5f83-493b-bd28-3b48f55d0be8",
							"originalTimestamp": "2020-10-20T08:14:28.778Z",
							"anonymousId": "my-anonymous-id-new",
							"userId": "newUserIdAlias",
							"email": "jamessampleton3@gmail.com",
							"properties": {
								"title": "new Contact",
								"startDate": "2021-05-04T17:00:00+05:30",
								"endDate": "2022-06-04T17:30:00+05:30",
								"ownerId": "70054866612",
								"targetableType": "Contact"
							},
							"event": "lifecycle_stage",
							"previousId": "sampleusrRudder3",
							"sentAt": "2020-10-20T08:14:28.778Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
						"error": "Either of lifecycleStageName or lifecycleStageId is required. Aborting!",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Track call: Either of sales activity name or sales activity type id is required",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.5"
								},
								"traits": {
									"name": "Shehan Study",
									"category": "SampleIdentify",
									"email": "test@rudderstack.com",
									"plan": "Open source",
									"logins": 5,
									"createdAt": 1599264000
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.5"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 0.8999999761581421
								},
								"campaign": {
									"source": "google",
									"medium": "medium",
									"term": "keyword",
									"content": "some content",
									"name": "some campaign",
									"test": "other value"
								},
								"page": {
									"path": "/destinations/amplitude",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/amplitude",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								},
								"externalId": {
									"type": "Contact"
								}
							},
							"type": "track",
							"messageId": "dd46338d-5f83-493b-bd28-3b48f55d0be8",
							"originalTimestamp": "2020-10-20T08:14:28.778Z",
							"anonymousId": "my-anonymous-id-new",
							"userId": "newUserIdAlias",
							"email": "test@rudderstack.com",
							"properties": {
								"product_name": "Shirt",
								"brand": "Wrogn",
								"title": "new Contact",
								"startDate": "2021-05-04T17:00:00+05:30",
								"endDate": "2022-06-04T17:30:00+05:30",
								"ownerId": "70054866612"
							},
							"event": "sales_activity",
							"previousId": "sampleusrRudder3",
							"sentAt": "2020-10-20T08:14:28.778Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
						"error": "Either of sales activity name or sales activity type id is required. Aborting!",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Track call: Either of email or targetable_id is required for creating sales activity.",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.5"
								},
								"traits": {
									"name": "Shehan Study",
									"category": "SampleIdentify",
									"plan": "Open source",
									"logins": 5,
									"createdAt": 1599264000
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.5"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 0.8999999761581421
								},
								"campaign": {
									"source": "google",
									"medium": "medium",
									"term": "keyword",
									"content": "some content",
									"name": "some campaign",
									"test": "other value"
								},
								"page": {
									"path": "/destinations/amplitude",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/amplitude",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								},
								"externalId": {
									"type": "Contact"
								}
							},
							"type": "track",
							"messageId": "dd46338d-5f83-493b-bd28-3b48f55d0be8",
							"originalTimestamp": "2020-10-20T08:14:28.778Z",
							"anonymousId": "my-anonymous-id-new",
							"userId": "newUserIdAlias",
							"properties": {
								"product_name": "Shirt",
								"brand": "Wrogn",
								"salesActivityName": "own-calender",
								"title": "new Contact",
								"startDate": "2021-05-04T17:00:00+05:30",
								"endDate": "2022-06-04T17:30:00+05:30",
								"ownerId": "70054866612"
							},
							"event": "sales_activity",
							"previousId": "sampleusrRudder3",
							"sentAt": "2020-10-20T08:14:28.778Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
						"error": "Either of email or targetable_id is required for creating sales activity. Aborting!",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Track call: sales activity with salesActivityTypeId",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.5"
								},
								"traits": {
									"name": "Shehan Study",
									"category": "SampleIdentify",
									"email": "test@rudderstack.com",
									"plan": "Open source",
									"logins": 5,
									"createdAt": 1599264000
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.5"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 0.8999999761581421
								},
								"campaign": {
									"source": "google",
									"medium": "medium",
									"term": "keyword",
									"content": "some content",
									"name": "some campaign",
									"test": "other value"
								},
								"page": {
									"path": "/destinations/amplitude",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/amplitude",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								},
								"externalId": {
									"type": "Contact"
								}
							},
							"type": "track",
							"messageId": "dd46338d-5f83-493b-bd28-3b48f55d0be8",
							"originalTimestamp": "2020-10-20T08:14:28.778Z",
							"anonymousId": "my-anonymous-id-new",
							"userId": "newUserIdAlias",
							"email": "jamessampleton3@gmail.com",
							"properties": {
								"salesActivityTypeId": "70000663932",
								"title": "new Contact",
								"startDate": "2021-05-04T17:00:00+05:30",
								"endDate": "2022-06-04T17:30:00+05:30",
								"ownerId": "70054866612"
							},
							"event": "sales_activity",
							"previousId": "sampleusrRudder3",
							"sentAt": "2020-10-20T08:14:28.778Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
							"body": {
								"XML": {},
								"FORM": {},
								"JSON": {
									"sales_activity": {
										"title": "new Contact",
										"end_date": "2022-06-04T17:30:00+05:30",
										"owner_id": "70054866612",
										"start_date": "2021-05-04T17:00:00+05:30",
										"created_at": "2020-10-20T08:14:28.778Z",
										"updated_at": "2020-10-20T08:14:28.778Z",
										"targetable_id": 70054866612,
										"targetable_type": "Contact",
										"sales_activity_type_id": "70000663932"
									}
								},
								"JSON_ARRAY": {}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Token token=dummyApiKey"
							},
							"version": "1",
							"endpoint": "https://domain-rudder.myfreshworks.com/crm/sales/api/sales_activities",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "freshmarketer",
		"description": "Track call: updated sales activity with salesActivityTypeId and targetableId",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.5"
								},
								"traits": {
									"name": "Shehan Study",
									"category": "SampleIdentify",
									"email": "test@rudderstack.com",
									"plan": "Open source",
									"logins": 5,
									"createdAt": 1599264000
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.5"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 0.8999999761581421
								},
								"campaign": {
									"source": "google",
									"medium": "medium",
									"term": "keyword",
									"content": "some content",
									"name": "some campaign",
									"test": "other value"
								},
								"page": {
									"path": "/destinations/amplitude",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/amplitude",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								},
								"externalId": {
									"id": "70052305908",
									"type": "Contact"
								}
							},
							"type": "track",
							"messageId": "dd46338d-5f83-493b-bd28-3b48f55d0be8",
							"originalTimestamp": "2020-10-20T08:14:28.778Z",
							"anonymousId": "my-anonymous-id-new",
							"userId": "newUserIdAlias",
							"properties": {
								"salesActivityTypeId": "70000663932",
								"title": "new Contact",
								"startDate": "2021-05-04T17:00:00+05:30",
								"endDate": "2022-06-04T17:30:00+05:30",
								"ownerId": "70054866612"
							},
							"event": "sales_activity",
							"previousId": "sampleusrRudder3",
							"sentAt": "2020-10-20T08:14:28.778Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
							"body": {
								"XML": {},
								"FORM": {},
								"JSON": {
									"sales_activity": {
										"title": "new Contact",
										"end_date": "2022-06-04T17:30:00+05:30",
										"owner_id": "70054866612",
										"start_date": "2021-05-04T17:00:00+05:30",
										"created_at": "2020-10-20T08:14:28.778Z",
										"updated_at": "2020-10-20T08:14:28.778Z",
										"targetable_id": "70052305908",
										"targetable_type": "Contact",
										"sales_activity_type_id": "70000663932"
									}
								},
								"JSON_ARRAY": {}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Token token=dummyApiKey"
							},
							"version": "1",
							"endpoint": "https://domain-rudder.myfreshworks.com/crm/sales/api/sales_activities",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "freshmarketer",
		"description": "Unsupported message Type",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"type": "page",
							"messageId": "dd46338d-5f83-493b-bd28-3b48f55d0be8",
							"originalTimestamp": "2020-10-20T08:14:28.778Z",
							"anonymousId": "my-anonymous-id-new",
							"userId": "newUserIdAlias",
							"email": "jamessampleton3@gmail.com",
							"properties": {
								"lifecycleStageId": "71012139273",
								"title": "new Contact",
								"startDate": "2021-05-04T17:00:00+05:30",
								"endDate": "2022-06-04T17:30:00+05:30",
								"ownerId": "70054866612",
								"targetableType": "Contact"
							},
							"event": "lifecycle_stage",
							"previousId": "sampleusrRudder3",
							"sentAt": "2020-10-20T08:14:28.778Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
						"error": "message type page not supported",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Group call: email is required for adding contacts to marketing lists",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "sadjb-1e2r3fhgb-12bvbbj",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"traits": {
								"groupType": "marketing_lists"
							},
							"type": "group",
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
						"error": "email is required for adding in the marketing lists. Aborting!",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Group call: group type is not present",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "sadjb-1e2r3fhgb-12bvbbj",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"traits": {
								"name": "Mark Twain",
								"phone": "919191919191",
								"numberOfEmployees": 51,
								"annualRevenue": 1000,
								"address": "Red Colony",
								"city": "Colony",
								"state": "Haryana"
							},
							"type": "group",
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
						"error": "groupType is required for Group call",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Group call: add contacts in existing marketing lists",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "sadjb-1e2r3fhgb-12bvbbj",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"traits": {
									"email": "jamessampleton1@gmail.com"
								}
							},
							"traits": {
								"groupType": "marketing_lists",
								"listName": "Voda 5G",
								"address": "Red Colony",
								"city": "Colony",
								"state": "Haryana"
							},
							"type": "group",
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
							"body": {
								"XML": {},
								"FORM": {},
								"JSON": {
									"ids": [
										70054866612
									]
								},
								"JSON_ARRAY": {}
							},
							"type": "REST",
							"files": {},
							"method": "PUT",
							"params": {},
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Token token=dummyApiKey"
							},
							"version": "1",
							"endpoint": "https://domain-rudder.myfreshworks.com/crm/sales/api/lists/70000059716/add_contacts",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "freshmarketer",
		"description": "Group call: groupType is not supported",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "sadjb-1e2r3fhgb-12bvbbj",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"traits": {
								"groupType": "marketing",
								"listName": "Voda 5G",
								"address": "Red Colony",
								"city": "Colony",
								"state": "Haryana"
							},
							"type": "group",
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
						"error": "groupType marketing is not supported. Aborting!",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Group call: listId or listName is required",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "sadjb-1e2r3fhgb-12bvbbj",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "jamessampleton1@gmail.com"
								}
							},
							"traits": {
								"groupType": "marketing_lists",
								"address": "Red Colony",
								"city": "Colony",
								"state": "Haryana"
							},
							"type": "group",
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
						"error": "listId or listName is required. Aborting!",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Group call: add marketing lists with listId",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "sadjb-1e2r3fhgb-12bvbbj",
							"originalTimestamp": "2022-06-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"traits": {
									"email": "jamessampleton1@gmail.com"
								}
							},
							"traits": {
								"listId": "70000058627",
								"groupType": "marketing_lists",
								"address": "Red Colony",
								"city": "Colony",
								"state": "Haryana"
							},
							"type": "group",
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
							"body": {
								"XML": {},
								"FORM": {},
								"JSON": {
									"ids": [
										70054866612
									]
								},
								"JSON_ARRAY": {}
							},
							"type": "REST",
							"files": {},
							"method": "PUT",
							"params": {},
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Token token=dummyApiKey"
							},
							"version": "1",
							"endpoint": "https://domain-rudder.myfreshworks.com/crm/sales/api/lists/70000058627/add_contacts",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "freshmarketer",
		"description": "Track call: with wrong sales activity name",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.5"
								},
								"traits": {
									"name": "Shehan Study",
									"category": "SampleIdentify",
									"email": "test@rudderstack.com",
									"plan": "Open source",
									"logins": 5,
									"createdAt": 1599264000
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.5"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 0.8999999761581421
								},
								"campaign": {
									"source": "google",
									"medium": "medium",
									"term": "keyword",
									"content": "some content",
									"name": "some campaign",
									"test": "other value"
								},
								"page": {
									"path": "/destinations/amplitude",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/amplitude",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								},
								"externalId": {
									"type": "Contact"
								}
							},
							"type": "track",
							"messageId": "dd46338d-5f83-493b-bd28-3b48f55d0be8",
							"originalTimestamp": "2020-10-20T08:14:28.778Z",
							"anonymousId": "my-anonymous-id-new",
							"userId": "newUserIdAlias",
							"email": "test@rudderstack.com",
							"properties": {
								"product_name": "Shirt",
								"brand": "Wrogn",
								"salesActivityName": "own-list",
								"title": "new Contact",
								"startDate": "2021-05-04T17:00:00+05:30",
								"endDate": "2022-06-04T17:30:00+05:30",
								"ownerId": "70054866612"
							},
							"event": "sales_activity",
							"previousId": "sampleusrRudder3",
							"sentAt": "2020-10-20T08:14:28.778Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
						"error": "sales Activity own-list doesn't exists. Aborting!",
						"statTags": {
							"destType": "FRESHMARKETER",
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
		"name": "freshmarketer",
		"description": "Track call: update contacts with sales Activity name",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.5"
								},
								"traits": {
									"name": "Shehan Study",
									"category": "SampleIdentify",
									"plan": "Open source",
									"logins": 5,
									"createdAt": 1599264000
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.5"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 0.8999999761581421
								},
								"campaign": {
									"source": "google",
									"medium": "medium",
									"term": "keyword",
									"content": "some content",
									"name": "some campaign",
									"test": "other value"
								},
								"page": {
									"path": "/destinations/amplitude",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/amplitude",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "dd46338d-5f83-493b-bd28-3b48f55d0be8",
							"originalTimestamp": "2020-10-20T08:14:28.778Z",
							"anonymousId": "my-anonymous-id-new",
							"userId": "newUserIdAlias",
							"properties": {
								"email": "jamessampleton6@gmail.com",
								"lifecycleStageName": "final Customer",
								"title": "new Contact",
								"startDate": "2021-05-04T17:00:00+05:30",
								"endDate": "2022-06-04T17:30:00+05:30",
								"ownerId": "70054866612",
								"targetableType": "Contact"
							},
							"event": "lifecycle_stage",
							"previousId": "sampleusrRudder3",
							"sentAt": "2020-10-20T08:14:28.778Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
							"body": {
								"XML": {},
								"FORM": {},
								"JSON": {
									"contact": {
										"lifecycle_stage_id": 71012806409
									},
									"unique_identifier": {
										"emails": "jamessampleton6@gmail.com"
									}
								},
								"JSON_ARRAY": {}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Token token=dummyApiKey"
							},
							"version": "1",
							"endpoint": "https://domain-rudder.myfreshworks.com/crm/sales/api/contacts/upsert",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "freshmarketer",
		"description": "Track call: with wrong lifecycleStageName",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.5"
								},
								"traits": {
									"name": "Shehan Study",
									"category": "SampleIdentify",
									"plan": "Open source",
									"logins": 5,
									"createdAt": 1599264000
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.5"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 0.8999999761581421
								},
								"campaign": {
									"source": "google",
									"medium": "medium",
									"term": "keyword",
									"content": "some content",
									"name": "some campaign",
									"test": "other value"
								},
								"page": {
									"path": "/destinations/amplitude",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/amplitude",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "dd46338d-5f83-493b-bd28-3b48f55d0be8",
							"originalTimestamp": "2020-10-20T08:14:28.778Z",
							"anonymousId": "my-anonymous-id-new",
							"userId": "newUserIdAlias",
							"properties": {
								"email": "jamessampleton6@gmail.com",
								"lifecycleStageName": "final ExCustomer",
								"title": "new Contact",
								"startDate": "2021-05-04T17:00:00+05:30",
								"endDate": "2022-06-04T17:30:00+05:30",
								"ownerId": "70054866612",
								"targetableType": "Contact"
							},
							"event": "lifecycle_stage",
							"previousId": "sampleusrRudder3",
							"sentAt": "2020-10-20T08:14:28.778Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com"
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
						"error": "failed to fetch lifeCycleStages with final ExCustomer",
						"statTags": {
							"destType": "FRESHMARKETER",
							"errorCategory": "network",
							"errorType": "aborted",
							"feature": "processor",
							"implementation": "native",
							"meta": "instrumentation",
							"module": "destination"
						},
						"statusCode": 400
					}
				]
			}
		}
	},
	{
		"name": "freshmarketer",
		"description": "Track call: Multiplexing",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.5"
								},
								"traits": {
									"name": "Shehan Study",
									"category": "SampleIdentify",
									"email": "test@rudderstack.com",
									"plan": "Open source",
									"logins": 5,
									"createdAt": 1599264000
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.5"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 0.8999999761581421
								},
								"campaign": {
									"source": "google",
									"medium": "medium",
									"term": "keyword",
									"content": "some content",
									"name": "some campaign",
									"test": "other value"
								},
								"page": {
									"path": "/destinations/amplitude",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/amplitude",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								},
								"externalId": {
									"type": "Contact"
								}
							},
							"type": "track",
							"messageId": "dd46338d-5f83-493b-bd28-3b48f55d0be8",
							"originalTimestamp": "2020-10-20T08:14:28.778Z",
							"anonymousId": "my-anonymous-id-new",
							"userId": "newUserIdAlias",
							"email": "test@rudderstack.com",
							"properties": {
								"product_name": "Shirt",
								"brand": "Wrogn",
								"salesActivityName": "own-calender",
								"title": "new Contact",
								"startDate": "2021-05-04T17:00:00+05:30",
								"endDate": "2022-06-04T17:30:00+05:30",
								"ownerId": "70054866612",
								"lifecycleStageId": "71012139273"
							},
							"event": "test_activity",
							"previousId": "sampleusrRudder3",
							"sentAt": "2020-10-20T08:14:28.778Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"domain": "domain-rudder.myfreshworks.com",
								"rudderEventsToFreshmarketerEvents": [
									{
										"from": "test_activity",
										"to": "sales_activity"
									},
									{
										"from": "test_activity",
										"to": "lifecycle_stage"
									},
									{
										"from": "test_event",
										"to": "lifecycle_stage"
									}
								]
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
							"body": {
								"XML": {},
								"FORM": {},
								"JSON": {
									"sales_activity": {
										"title": "new Contact",
										"end_date": "2022-06-04T17:30:00+05:30",
										"owner_id": "70054866612",
										"start_date": "2021-05-04T17:00:00+05:30",
										"created_at": "2020-10-20T08:14:28.778Z",
										"updated_at": "2020-10-20T08:14:28.778Z",
										"targetable_id": 70054866612,
										"targetable_type": "Contact",
										"sales_activity_name": "own-calender",
										"sales_activity_type_id": 70000666879
									}
								},
								"JSON_ARRAY": {}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"userId": "",
							"params": {},
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Token token=dummyApiKey"
							},
							"version": "1",
							"endpoint": "https://domain-rudder.myfreshworks.com/crm/sales/api/sales_activities"
						},
						"statusCode": 200
					},
					{
						"output": {
							"body": {
								"JSON": {
									"contact": {
										"lifecycle_stage_id": "71012139273"
									},
									"unique_identifier": {
										"emails": "test@rudderstack.com"
									}
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"type": "REST",
							"files": {},
							"userId": "",
							"method": "POST",
							"params": {},
							"headers": {
								"Authorization": "Token token=dummyApiKey",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://domain-rudder.myfreshworks.com/crm/sales/api/contacts/upsert"
						},
						"statusCode": 200
					}
				]
			}
		}
	}
]